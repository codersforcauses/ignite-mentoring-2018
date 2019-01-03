const minMentor = 5
const maxMentor = 7
let classcount = 0;
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
            countTime(results.data);
            countPrefPerClass(results.data);
		},
		error: errorFn
    };

	let results = Papa.parse(input, config);	
}

// Counts the number of classes and adds classes as properties to the object classes
function countClass(data) {
    let row = data[0];
    let patt = new RegExp("Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday\s\d"); //TODO this returns positive for the WWC check property
    
    Object.entries(row).forEach(
        function(keyvaluepair) {
            if (patt.test(keyvaluepair[0])) {
                console.log(keyvaluepair[0]);
                classcount++;
                classes[keyvaluepair[0]] = 0;
            }
        }
    );
}

// Counts the number of preferences for each class
function countPrefPerClass(data) {
    data.forEach(function(mentor) {
        Object.entries(classes).forEach(function(aClass) {
            console.log(mentor[aClass[0]]);
            if (mentor[aClass[0]] != "") {
                classes[aClass[0]]++;
            }
        });
    });
}

// Handles errors in parsing CSV file
function errorFn() {

}