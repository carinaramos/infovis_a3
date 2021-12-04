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
# print('Field names are:' + ', '.join(field for field in fields))

teams = {}
for row in rows:
    winner = row[WINNER]
    teams[winner] = ""
    loser = row[LOSER]
    teams[loser] = ""

with open('teams.json', 'w') as outfile:
    outfile.write(json.dumps(teams, indent = 1, sort_keys=True))
        