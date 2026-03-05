from statsbombpy import sb  # ← THIS is the correct import

bundesliga = sb.matches(competition_id=9, season_id=281)
print("Bundesliga 23/24:", len(bundesliga), "matches")
print(bundesliga[['match_id','home_team','away_team','match_date']].head(3))

laliga = sb.matches(competition_id=11, season_id=90)
print("\nLa Liga 20/21:", len(laliga), "matches")
print(laliga[['match_id','home_team','away_team','match_date']].head(3))

epl = sb.matches(competition_id=2, season_id=27)
print("\nPremier League 15/16:", len(epl), "matches")
print(epl[['match_id','home_team','away_team','match_date']].head(3))
