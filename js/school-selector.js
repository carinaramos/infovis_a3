// create clear button
var clearButton = document.getElementById('clear-button');
const handleClear = () => {
    console.log("clearing all teams");
    const numSchoolsSelected = selectedSchools.length;
    for (let i=0; i < numSchoolsSelected; i++) {
        updateSelectedSchools(selectedSchools[0]);
    }
}
clearButton.onclick = function() {handleClear()};


// create team selector
async function initTeamSelect() {
    streaks = await d3.json("teams.json");
    var teamSelect = document.getElementById('team-selector');
    const handleTeamClick = (selectElement) => {
        console.log("selected team: " + selectElement.value);
        updateSelectedSchools(selectElement.value);
        teamSelect.value = "Select a team";
    }
    teamSelect.onchange = function() {handleTeamClick(this)};
    for (const team of Object.keys(streaks)) {
        var opt = document.createElement('option');
        opt.id = team;
        opt.innerHTML = team;
        teamSelect.appendChild(opt);                             
    }
}




initTeamSelect();