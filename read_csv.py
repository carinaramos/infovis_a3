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

# record total number of wins per year for each team who won at least one game
wins_by_school = {}
for row in rows:
	winner = row[WINNER]
	# if this school isn't in the dictionary yet, add it & set initial values of zero wins for all years
	if winner not in wins_by_school:
		wins_by_school[winner] = {}
		for year in map(lambda a: f"19{a:02}", range(85, 100)):
			wins_by_school[winner][year] = 0
		for year in map(lambda a: f"20{a:02}", range(0, 17)):
			wins_by_school[winner][year] = 0
	win_year = f"19{row[DATE][-2:]}" if int(row[DATE][-2:]) > 84 else f"20{row[DATE][-2:]}"
	wins_by_school[winner][win_year] += 1

seeds_by_school = {}
for row in rows:
	winner = row[WINNER]
	# if this school isn't in the dictionary yet, add it & set initial values of zero wins for all years
	if winner not in seeds_by_school:
		seeds_by_school[winner] = {}
		for year in map(lambda a: f"19{a:02}", range(85, 100)):
			seeds_by_school[winner][year] = 17
		for year in map(lambda a: f"20{a:02}", range(0, 17)):
			seeds_by_school[winner][year] = 17
	seed_year = f"19{row[DATE][-2:]}" if int(row[DATE][-2:]) > 84 else f"20{row[DATE][-2:]}"
	seeds_by_school[winner][seed_year] = int(row[WINNING_SEED])
	loser = row[LOSER]
	# if this school isn't in the dictionary yet, add it & set initial values of zero wins for all years
	if loser not in seeds_by_school:
		seeds_by_school[loser] = {}
		for year in map(lambda a: f"19{a:02}", range(85, 100)):
			seeds_by_school[loser][year] = 17
		for year in map(lambda a: f"20{a:02}", range(0, 17)):
			seeds_by_school[loser][year] = 17
	seed_year = f"19{row[DATE][-2:]}" if int(row[DATE][-2:]) > 84 else f"20{row[DATE][-2:]}"
	seeds_by_school[loser][seed_year] = int(row[LOSING_SEED])

pprint.pprint(wins_by_school['Duke'])
pprint.pprint(seeds_by_school['Duke'])

			
with open("wins_by_school.json", "w") as outfile:
    outfile.write(json.dumps(wins_by_school, indent = 4))
with open("seeds_by_school.json", "w") as outfile:
    outfile.write(json.dumps(seeds_by_school, indent = 4))
