var yearSelect = document.getElementById('year-selector');

const handleYearClick = (selectElement) => {
    console.log("selected year: " + selectElement.value);
    updateSelectedYear(selectElement.value);
}

var yearSelector = document.getElementById("year-selector")
yearSelector.onchange = function() {handleYearClick(this)};

for (var i=1985; i < 2017; i++) {
    var opt = document.createElement('option');
    opt.id = i;
    opt.innerHTML = i;
    yearSelect.appendChild(opt);                             
}
yearSelector.value = selectedYear;
