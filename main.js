function readFile() {
    let input = document.getElementById("csvfile").files[0];
    let config = {
        delimiter: ",",
        quoteChar: '"',
        header: true,
		trimHeaders: true,
		complete: function(results) {
			console.log(results.data);
		},
		error: errorFn
    };

	let results = Papa.parse(input, config);
	
}

// Handles errors 
function errorFn() {

}