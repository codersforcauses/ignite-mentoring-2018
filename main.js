const minMentor = 0
const maxMentor = 11
const numExperiencedRequired = 0;
let classCount = 0;
let classes = {};
let data1 = null;
const preferenceKeys = [
    '1st Preference',
    '2nd Preference',
    '3rd Preference',
    '4th Preference',
    '5th Preference',
    '6th Preference',
    '7th Preference',
    '8th Preference'
]

// Reads the uploaded CSV file and parse the data into objects
function readFile() {
    let input = document.getElementById("csvfile").files[0];
    let config = {
        delimiter: ",",
        quoteChar: '"',
        header: true,
		trimHeaders: true,
		complete: function(results) {
            countClass(results.data);
            console.log(results.data)
            // countPrefPerClass(results.data);
            // countExperiencedMentors(results.data);
            data1 = results.data;
            bruteForce(results.data);
        },
        error: errorFn,
        transform: function(value, header) {
            switch (header){
                case "Do you have a Working With Children Check?":
                case "Have you had experience mentoring with Ignite?":
                case "Do you have both a license and a car to drive to classes?":
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
    data.forEach(item => {
        Object.keys(item).forEach((columnName) => {
            const className = item[columnName]
            if (isClass(columnName) && classes[className] == undefined) {
                classCount++;
                classes[className] = 0;
            }
        })
    })
}

function isClass(columnName) {
	return /Preference/.test(columnName)
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
    const data2 = data? data: data1;
    let conditionsSatisfied = false;
    let iterationLimit = 100000;

    let iterationCounter = 0;
    let classAllocations;
    while(!conditionsSatisfied) {
        classAllocations = assignRandomMentors(data2);
        let sizeSatisfied = checkSizes(classAllocations);
        let driversSatisfied = checkAtLeastOneDriver(classAllocations);
        driversSatisfied = true
        let experiencedSatisfied = checkExperienced(classAllocations);
        conditionsSatisfied = (sizeSatisfied && driversSatisfied && experiencedSatisfied) ? true : false;
        iterationCounter++;
        if (iterationCounter > iterationLimit) {
            alert(`Could not properly allocate the mentors in less than ${iterationLimit}\
             iterations. Please try again.\n(NOTE: This may occur repeatedly if you have very few mentors on file)`);
            return;
        }
    }
    console.log(`Requirements satisfied in ${iterationCounter} random iterations!`);
    
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        console.log(`${classKeys[key]}:\n`);
        for(let i=0; i<classAllocations[classKeys[key]].length; i++){
            console.log(classAllocations[classKeys[key]][i]["Name"]);
        }
    }

    let peopleAllocated = 0;
    Object.keys(classAllocations).forEach(key => {
        peopleAllocated += classAllocations[key].length
    })
    console.log(classAllocations)
    generateTable(classAllocations);
    alert(`${peopleAllocated} people were allocated`)

    if(document.getElementById("downloadRadio").checked){
        writeResult(classAllocations)
    }    
}

function writeResult(classAllocations) {
    const result = []
    Object.keys(classAllocations).forEach(function(className) {
        classAllocations[className].forEach(function(mentor) {
            mentor['Assigned Class'] = className
            result.push(mentor)
        })
    })

    const csv = Papa.unparse(result)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", 'output.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Browser does not support the download attribute')
    }
}

function checkExperienced(classAllocations) {
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        let experiencedCount = 0;
        for(let i=0; i<classAllocations[classKeys[key]].length; i++) {
            if(classAllocations[classKeys[key]][i]["Have you had experience mentoring with Ignite?"]) experiencedCount++;
        }
        if(experiencedCount<numExperiencedRequired) return false;
    }
    return true;
}

//Iterates through each class and it's allocated mentors and returns true if every class has at least one driver
function checkAtLeastOneDriver(classAllocations) {
    let classKeys = Object.keys(classAllocations);
    for(let key in classKeys) {
        let classHasDriver = false;
        for(let i=0; i<classAllocations[classKeys[key]].length; i++) {
            if(classAllocations[classKeys[key]][i]["Do you have both a license and a car to drive to classes?"]) classHasDriver = true;
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

        if(classAllocations[classKeys[key]].length > maxMentor) {
            return false;
        }
    }
    return true;
}

// Randomly picks a preference for each mentor e.g. 1-4 and the randomly chosen preference (a class)
// assigned to that mentor
function assignRandomMentors(data) {
    let classAllocations = {};
    let classKeys = Object.keys(classes);
    for(let key in classKeys) {
        classAllocations[classKeys[key]] = [];
    }

    data.forEach(function(mentor) {
        let limit = 0
        for (let i = 0; i < preferenceKeys.length; i++) {
            if (mentor[preferenceKeys[i]]) limit++
            else break;
        }
        if (limit > 6) {
            limit = 6
        }
        let preferenceKey = preferenceKeys[Math.floor(Math.random() * (limit))];
        classAllocations[mentor[preferenceKey]].push(mentor)
    })

    return classAllocations;
}

function generateTable(classAllocations) {

    let tableColumns = classCount
    let tableRows = 0;

    let classKeys = Object.keys(classAllocations);
    //get max num of rows needed
    for(let key in classKeys) {
        if (classAllocations[classKeys[key]].length > tableRows) tableRows = classAllocations[classKeys[key]].length;
    }

    let classNames = [];
    let keyCtr=0;
    for(let key in classKeys) {
        let innerArr = []
        for(let j=0; j<tableRows; j++) {
            innerArr[j] = (classAllocations[classKeys[key]].length > j) ? classAllocations[classKeys[key]][j]["Please give your full name:"] : "";
        }
        classNames[keyCtr] = innerArr;
        keyCtr++;
    }
    console.table(classNames);

    let tableDiv = document.getElementById("resultTable");
    tableDiv.innerHTML = '';
    let tbl = document.createElement("table");
    let headerRow = document.createElement("tr");
    for(let key in classKeys) {
        let cell = document.createElement("th");
        let cellText = document.createTextNode(classKeys[key]);
        cell.appendChild(cellText);
        headerRow.appendChild(cell);
    }
    tbl.appendChild(headerRow);

    for(let r=0; r<tableRows; r++) {
        let row = document.createElement("tr");

        for(let c = 0; c<tableColumns; c++) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode(classNames[c][r]);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tbl.appendChild(row);
    }
    tableDiv.appendChild(tbl);
} 