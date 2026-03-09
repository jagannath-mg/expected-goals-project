from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import math
from functools import lru_cache
from statsbombpy import sb

app = Flask(__name__)
CORS(app)

model = joblib.load("XG_Model.pkl")

try:
    feature_names = model.feature_names_in_
except:
    feature_names = list(model.get_booster().feature_names)

print(f"Model features: {feature_names}")

# Competition IDs per league
LEAGUE_CONFIG = {
    'epl':        {'competition_id': 2,  'name': 'Premier League'},
    'laliga':     {'competition_id': 11, 'name': 'La Liga'},
    'bundesliga': {'competition_id': 9,  'name': 'Bundesliga'},
}

# La Liga limited to 5 newest full seasons — EPL & Bundesliga show all
LEAGUE_SEASON_WHITELIST = {
    'epl':        None,
    'bundesliga': None,
    'laliga':     [90, 42, 4, 1, 2],
    # 90=2020/21, 42=2019/20, 4=2018/19, 1=2017/18, 2=2016/17
}


# ─────────────────────────────────────────────
# CACHING
# ─────────────────────────────────────────────

@lru_cache(maxsize=256)
def get_cached_events(match_id):
    return sb.events(match_id=match_id)

@lru_cache(maxsize=32)
def get_cached_matches(competition_id, season_id):
    return sb.matches(competition_id=competition_id, season_id=season_id)

@lru_cache(maxsize=8)
def get_cached_competitions():
    return sb.competitions()


# ─────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────

def predict_xg_for_shot(row):
    try:
        loc = row.get('location', [0, 0])
        x = loc[0] if isinstance(loc, list) else 0
        y = loc[1] if isinstance(loc, list) else 40

        dx = 120 - x
        dy = abs(40 - y)
        distance_to_goal = math.sqrt(dx**2 + dy**2)
        angle_rad = math.atan2(dy, dx) if dx != 0 else 0

        body_part_raw = row.get('shot_body_part', 'Right Foot')
        body_part = body_part_raw['name'] if isinstance(body_part_raw, dict) else str(body_part_raw)

        shot_type_raw = row.get('shot_type', 'Open Play')
        shot_type = shot_type_raw['name'] if isinstance(shot_type_raw, dict) else str(shot_type_raw)

        under_pressure = 1 if row.get('under_pressure', False) else 0
        minute = int(row.get('minute', 0))

        sample = pd.DataFrame([{
            'minute':           minute,
            'x':                x,
            'y':                y,
            'distance_to_goal': distance_to_goal,
            'angle_to_goal':    angle_rad,
            'body_part':        body_part,
            'shot_type':        shot_type,
            'under_pressure':   under_pressure
        }])

        sample = pd.get_dummies(sample)
        sample = sample.reindex(columns=feature_names, fill_value=0)
        xg = model.predict_proba(sample)[0][1]
        return round(float(xg), 4)
    except Exception as e:
        print(f"xG prediction error: {e}")
        return 0.0


# ─────────────────────────────────────────────
# MANUAL XG CALCULATOR ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/features', methods=['GET'])
def get_features():
    return jsonify({
        'numeric':     ['minute', 'x', 'y', 'distance_to_goal', 'angle_to_goal'],
        'categorical': ['body_part', 'shot_type'],
        'binary':      ['under_pressure'],
        'all_features': feature_names,
        'importance':  {name: float(val) for name, val in zip(feature_names, model.feature_importances_)}
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    angle_deg = float(data.get('angle_to_goal', 0))
    angle_rad = math.radians(angle_deg)

    sample = pd.DataFrame([{
        'minute':           int(data.get('minute', 0)),
        'x':                float(data.get('x', 0)),
        'y':                float(data.get('y', 40)),
        'distance_to_goal': float(data.get('distance_to_goal', 0)),
        'angle_to_goal':    angle_rad,
        'body_part':        data.get('body_part', 'Right Foot'),
        'shot_type':        data.get('shot_type', 'Open Play'),
        'under_pressure':   int(data.get('under_pressure', 0))
    }])

    sample = pd.get_dummies(sample)
    sample = sample.reindex(columns=feature_names, fill_value=0)
    xg = model.predict_proba(sample)[0][1]

    reasons = []
    if xg < 0.1:
        dist     = data.get('distance_to_goal', 0)
        body     = data.get('body_part', '').lower()
        pressure = data.get('under_pressure', 0)
        if dist > 25:
            reasons.append("long distance")
        if angle_deg < 30 or angle_deg > 150:
            reasons.append("difficult angle")
        if 'left foot' in body:
            reasons.append("weak foot")
        if 'head' in body:
            reasons.append("header used")
        if pressure == 1:
            reasons.append("under pressure")

    return jsonify({"xg": float(xg), "reasons": reasons if reasons else None})


# ─────────────────────────────────────────────
# LEAGUE STATS ENDPOINTS
# ─────────────────────────────────────────────

@app.route('/league/<league_key>/seasons', methods=['GET'])
def get_seasons(league_key):
    """Return available seasons for a league — filtered by whitelist if set."""
    if league_key not in LEAGUE_CONFIG:
        return jsonify({'error': 'Unknown league'}), 404
    try:
        competitions = get_cached_competitions()
        comp_id   = LEAGUE_CONFIG[league_key]['competition_id']
        filtered  = competitions[competitions['competition_id'] == comp_id]
        whitelist = LEAGUE_SEASON_WHITELIST.get(league_key)

        seasons = []
        for _, row in filtered.iterrows():
            sid = int(row['season_id'])
            if whitelist is not None and sid not in whitelist:
                continue
            seasons.append({
                'season_id':   sid,
                'season_name': str(row['season_name']),
            })

        seasons.sort(key=lambda x: x['season_name'], reverse=True)
        return jsonify(seasons)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/league/<league_key>/fixtures', methods=['GET'])
def get_fixtures(league_key):
    """Return all matches for a league + season."""
    if league_key not in LEAGUE_CONFIG:
        return jsonify({'error': 'Unknown league'}), 404

    season_id = request.args.get('season_id', type=int)
    if not season_id:
        return jsonify({'error': 'season_id query param required'}), 400

    cfg = LEAGUE_CONFIG[league_key]
    try:
        matches = get_cached_matches(cfg['competition_id'], season_id)
        result  = []
        for _, m in matches.iterrows():
            result.append({
                'match_id':   int(m['match_id']),
                'date':       str(m['match_date']),
                'home':       str(m['home_team']),
                'away':       str(m['away_team']),
                'home_score': int(m['home_score']),
                'away_score': int(m['away_score']),
                'matchweek':  int(m.get('match_week', 0)),
            })
        result.sort(key=lambda x: (x['matchweek'], x['date']), reverse=True)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/league/<league_key>/match/<int:match_id>', methods=['GET'])
def get_match_xg(league_key, match_id):
    """Return all shots with model-predicted xG for a specific match."""
    if league_key not in LEAGUE_CONFIG:
        return jsonify({'error': 'Unknown league'}), 404

    season_id = request.args.get('season_id', type=int)
    if not season_id:
        return jsonify({'error': 'season_id query param required'}), 400

    try:
        events = get_cached_events(match_id)
        shots  = events[events['type'] == 'Shot'].copy()

        if shots.empty:
            return jsonify({
                'home_team': '', 'away_team': '',
                'home_xg': 0,   'away_xg': 0,
                'home_shots': [],'away_shots': []
            })

        cfg     = LEAGUE_CONFIG[league_key]
        matches = get_cached_matches(cfg['competition_id'], season_id)
        match_row = matches[matches['match_id'] == match_id].iloc[0]
        home_team = str(match_row['home_team'])
        away_team = str(match_row['away_team'])

        home_shots, away_shots = [], []

        for _, shot in shots.iterrows():
            loc = shot.get('location', [0, 0])

            outcome_raw = shot.get('shot_outcome', '')
            outcome     = outcome_raw['name'] if isinstance(outcome_raw, dict) else str(outcome_raw)
            is_goal     = outcome == 'Goal'

            body_part_raw = shot.get('shot_body_part', '')
            body_part     = body_part_raw['name'] if isinstance(body_part_raw, dict) else str(body_part_raw)

            shot_type_raw = shot.get('shot_type', '')
            shot_type     = shot_type_raw['name'] if isinstance(shot_type_raw, dict) else str(shot_type_raw)

            team_raw = shot.get('team', '')
            team     = team_raw['name'] if isinstance(team_raw, dict) else str(team_raw)

            player_raw = shot.get('player', 'Unknown')
            player     = player_raw['name'] if isinstance(player_raw, dict) else str(player_raw)

            shot_data = {
                'player':           player,
                'minute':           int(shot.get('minute', 0)),
                'x':                loc[0] if isinstance(loc, list) else 0,
                'y':                loc[1] if isinstance(loc, list) else 40,
                'outcome':          outcome,
                'is_goal':          is_goal,
                'body_part':        body_part,
                'shot_type':        shot_type,
                'under_pressure':   bool(shot.get('under_pressure', False)),
                'model_xg':         predict_xg_for_shot(shot.to_dict()),
                'statsbomb_xg':     round(float(shot.get('shot_statsbomb_xg', 0) or 0), 4),
            }

            if team == home_team:
                home_shots.append(shot_data)
            else:
                away_shots.append(shot_data)

        home_xg = round(sum(s['model_xg'] for s in home_shots), 2)
        away_xg = round(sum(s['model_xg'] for s in away_shots), 2)

        return jsonify({
            'home_team':  home_team,
            'away_team':  away_team,
            'home_xg':    home_xg,
            'away_xg':    away_xg,
            'home_shots': home_shots,
            'away_shots': away_shots,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
