const minMentor = 5
const maxMentor = 7
const numExperiencedRequired = 2;
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
            countExperiencedMentors(results.data);
            console.log(classCount);
            console.log(classes);
            bruteForce(results.data);
        },
        error: errorFn,
        transform: function(value, header) {
            switch (header){
                case "Have you mentored before?":
                case "Can you drive to and from your class?":
                case "Do you have a Working With Children Check? If not- please organise this before next Monday the 13th.":
                    value = (value == "Yes") ? true : false;
                    break;
            }
            return value;
        }
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
            if (mentor[aClass[0]] != "" && mentor[aClass[0]] != 0) {
                classes[aClass[0]]++;
            }
        });
    });

    //Alert & Remove classes without enough preferences to make up the minimum requiredxs
    let insufficientClasses = []
    for(let thisClass in classes) {
        if(classes[thisClass[0]] < minMentor){
            insufficientClasses.push(thisClass);
            delete classes[thisClass];
            classCount--;
        }
    }
    if(insufficientClasses.length>0) alert(`The folowing classes have insufficient\
    preferences and could not be allocated:\n${insufficientClasses}`);
}

function countExperiencedMentors(data) {
    let numExperienced = 0;
    data.forEach(function(mentor) {
        if(mentor["Have you mentored before?"]){
            numExperienced++;
        }
    });
    console.log(`Number of experience mentors: ${numExperienced}`);
}

// Handles errors in parsing CSV file
function errorFn() {

}

function bruteForce(data) {
    let conditionsSatisfied = false;

    let iterationCounter = 0;
    let classAllocations;
    while(!conditionsSatisfied) {
        classAllocations = assignRandomMentors(data);
        let sizeSatisfied = checkSizes(classAllocations);
        let driversSatisfied = checkAtLeastOneDriver(classAllocations);
        let experiencedSatisfied = checkExperienced(classAllocations);
        conditionsSatisfied = (sizeSatisfied && driversSatisfied && experiencedSatisfied) ? true : false;
        iterationCounter++;
    }
    console.log(`Requirements satisfied in ${iterationCounter} random iterations!`);
    
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        console.log(`${classKeys[key]}:\n`);
        for(let i=0; i<classAllocations[classKeys[key]].length; i++){
            console.log(classAllocations[classKeys[key]][i]["Name"]);
        }
    }
}

function checkExperienced(classAllocations) {
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        let experiencedCount = 0;
        for(let i=0; i<classAllocations[classKeys[key]].length; i++) {
            if(classAllocations[classKeys[key]][i]["Have you mentored before?"]) experiencedCount++;
        }
        if(experiencedCount<2) return false;
    }
    return true;
}

//Iterates through each class and it's allocated mentors and returns true if every class has at least one driver
function checkAtLeastOneDriver(classAllocations) {
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        let classHasDriver = false;
        for(let i=0; i<classAllocations[classKeys[key]].length; i++) {
            if(classAllocations[classKeys[key]][i]["Can you drive to and from your class?"]) classHasDriver = true;
        }
        if(!classHasDriver) return false;
    }
    return true;
}

function checkSizes(classAllocations) {
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        //Currently only checks if the minimum mentor num is satisfied
        if(classAllocations[classKeys[key]].length < minMentor){
            return false;
        }
    }
    return true;
}

function assignRandomMentors(data) {
    let classAllocations = {};
    let classKeys = Object.keys(classes);
    for(let key in classKeys) {
        classAllocations[classKeys[key]] = [];
    }

    data.forEach(function(mentor) {
        let randPref = Math.floor(Math.random() * (4-1 + 1)) + 1;

        Object.entries(classes).forEach(function(aClass) {
            let thisKey = aClass[0];
            if (mentor[aClass[0]] == randPref) classAllocations[thisKey].push(mentor);
        });
    })

    return classAllocations;
}