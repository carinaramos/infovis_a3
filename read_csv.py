# importing csv module
import csv, pprint, json

# csv file name
filename = "NCAA Mens March Madness Historical Results.csv"

# initializing the titles and rows list
fields = []
rows = []

# reading csv file
with open(filename, 'r') as csvfile:
	# creating a csv reader object
	csvreader = csv.reader(csvfile)
	
	# extracting field names through first row
	fields = next(csvreader)

	# extracting each data row one by one
	for row in csvreader:
		rows.append(row)

	# get total number of rows
	print("Total no. of rows: %d"%(csvreader.line_num))

DATE = 0
WINNING_SEED = 3
WINNER = 4
LOSING_SEED = 6
LOSER = 7

# printing the field names
print('Field names are:' + ', '.join(field for field in fields))

schools = {}
for row in rows:
	winner = row[WINNER]
	loser = row[LOSER]
	
	# set the seed for both teams
	for team, seed_index in zip([winner, loser], [WINNING_SEED, LOSING_SEED]):
		if team not in schools:
			schools[team] = {"name": team, "seeds" : [17]*32, "wins" : [0]*32}
		year = int(row[DATE][-2:])
		year_index = (year - 85) if (year > 84) else (year + 15)
		# set the seed for that year
		schools[team]["seeds"][year_index] = int(row[seed_index])
	
	# add 1 to the winning team's win record for that year
	schools[winner]["wins"][year_index] += 1

# TEST 
years = list(range(85, 100)) + list(range(0, 17))
for year in years:
	year_index = (year - 85) if (year > 84) else (year + 15)
	print(year, year_index)

			
with open("schools.json", "w") as outfile:
    outfile.write(json.dumps(list(schools.values()), indent = 1, sort_keys=True))