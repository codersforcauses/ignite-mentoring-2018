const minMentor = 5
const maxMentor = 7
let classCount = 0;
let classes = {};

// Reads the uploaded CSV file and parse the data into objects
function readFile() {
    let input = document.getElementById("csvfile").files[0];
    let config = {
        delimiter: ",",
        quoteChar: '"',
        header: true,
		trimHeaders: true,
		complete: function(results) {
            console.log(results.data);
            countClass(results.data);
            countPrefPerClass(results.data);
            console.log(classCount);
            console.log(classes);
		},
		error: errorFn
    };

	let results = Papa.parse(input, config);	
}

// Counts the number of classes and adds classes as properties to the object classes
function countClass(data) {
    let row = data[0];

    Object.keys(row).forEach(function (columnName) {
    	if (findClass(columnName)) {
    		classCount++;
    		classes[columnName] = 0;
    	}
    });
}

function findClass(columnName) {
	return /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/.test(columnName) 
                && /\d{1,2}am|\d{1,2}pm/g.test(columnName)
}

// Counts the number of preferences for each class
function countPrefPerClass(data) {
    data.forEach(function(mentor) {
        Object.entries(classes).forEach(function(aClass) {
            if (mentor[aClass[0]] != "") {
                classes[aClass[0]]++;
            }
        });
    });
}

// Handles errors in parsing CSV file
function errorFn() {

}