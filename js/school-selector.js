
// create a button for each school
var listDiv = document.getElementById('year-selector');
for (var i=1985; i < 2017; i++) {
    var opt = document.createElement('option');
    // opt.classList = 'btn btn-outline-secondary';
    opt.id = records[i]["name"];
    // button.style.backgroundColor = ...
    opt.innerHTML = records[i]["name"];
    opt = handleSchoolClick;
    listDiv.appendChild(opt);                             
}
