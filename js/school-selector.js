
var clearButton = document.getElementById('clear-button');
clearButton.onclick = function() {handleClear()};

const handleClear = () => {
    console.log("clearing all teams");
    const numSchoolsSelected = selectedSchools.length;
    for (let i=0; i < numSchoolsSelected; i++) {
        updateSelectedSchools(selectedSchools[0]);
    }
}


// // create a button for each school
// var listDiv = document.getElementById('year-selector');
// for (var i=1985; i < 2017; i++) {
//     var opt = document.createElement('option');
//     // opt.classList = 'btn btn-outline-secondary';
//     opt.id = records[i]["name"];
//     // button.style.backgroundColor = ...
//     opt.innerHTML = records[i]["name"];
//     opt = handleSchoolClick;
//     listDiv.appendChild(opt);                             
// }
