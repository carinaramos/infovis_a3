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

with open('colors.json', 'r') as infile:
    colors = json.load(infile)

DATE = 0
WINNING_SEED = 3
WINNER = 4
LOSING_SEED = 6
LOSER = 7

# seed -> expected wins
expected_wins = {
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
    years[str(year)] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

for row in rows:
    year_string = row[DATE][-2:]
    year = f"19{year_string}" if int(year_string) > 84 else f"20{year_string}"
    # add winner
    winning_seed = int(row[WINNING_SEED])
    num_seedmates = len(years[year][winning_seed - 1].keys())
    if row[WINNER] not in years[year][winning_seed - 1]:
        years[year][winning_seed - 1][row[WINNER]] = {"seed": winning_seed, "offset": num_seedmates, "name" : row[WINNER], "wins" : 1, "score": 0, "color": colors[row[WINNER]]}
    else:
        years[year][winning_seed - 1][row[WINNER]]["wins"] += 1
    # add loser
    losing_seed = int(row[LOSING_SEED])
    num_seedmates = len(years[year][losing_seed - 1].keys())
    if row[LOSER] not in years[year][losing_seed - 1]:
        years[year][losing_seed - 1][row[LOSER]] = {"seed": losing_seed, "offset": num_seedmates, "name" : row[LOSER], "wins" : 0, "score": 0, "color": colors[row[LOSER]]}

years_with_scores = {}

for year in years: # year = string key
    year_list = []
    for seed_dict in years[year]: 
        for team_name in seed_dict:
            stats = seed_dict[team_name]
            stats["score"] = stats["wins"] - expected_wins[stats["seed"]] 
            year_list.append(stats)

    years_with_scores[year] = year_list



    
with open("years_with_colors.json", "w") as outfile:
    outfile.write(json.dumps(years_with_scores, indent = 1))

# TEST DATA LOAD
with open("years_with_colors.json", "r") as infile:
    years_obj = json.load(infile)

total_wrong = 0
for year in years_obj.keys():
    for idx, seed_dict in enumerate(years_obj[year]):
        if len(seed_dict) != 4:
            total_wrong += 1
            print(f"{year} seed: {idx+1} has {len(seed_dict)} at this seed")
            # pprint.pprint(seed_dict)

with open("years_with_colors.json", "r") as infile:
    years_obj = json.load(infile)