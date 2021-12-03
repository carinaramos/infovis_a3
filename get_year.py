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

DATE = 0
WINNING_SEED = 3
WINNER = 4
LOSING_SEED = 6
LOSER = 7

# seed -> expected wins
seed_expected_wins = {
    1: 5.5,
    2: 4,
    3: 2,
    4: 2,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
}

years = {}
for year in range(1985, 2017):
    seed_list = []
    for i in range(16):
        for j in range(4):
            seed_list.append({"seed": i+1, "offset": j, "name" : "", "wins" : 0, "score": 0, "color": ""})
    years[str(year)] = seed_list

next_offset = {}
for i in range(1, 17):
    next_offset[i] = 0
pprint.pprint(next_offset)


for row in rows:
	year_int = int(row[DATE][-2:])
	year = f"19{year_int}" if year_int > 84 else f"20{year_int}"
    for team_index, seed_index in zip([WINNER, LOSER], [WINNING_SEED, LOSING_SEED]):
        seed = 2
			
with open("years.json", "w") as outfile:
    outfile.write(json.dumps(years, indent = 1))