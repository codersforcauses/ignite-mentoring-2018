'use strict'

function compute() {

    const CSV_URL = "mentor-ex.csv";
    let fileList = document.getElementById("fileUpload")
    if(fileList.files.length != 1){
        document.getElementById("numAlert").innerHTML = "Upload one file.";
        return;
    }

    const selectedFile = fileList.files[0];

    let reader = new FileReader();
    reader.onload = function(e){
        var csvText = reader.result;
        //console.log(csvText);
        loadData(csvText);
    }
    reader.readAsText(selectedFile);   
}

function loadData(csvText) {
    const numColumns = 27;
    let returnObj = Papa.parse(csvText);
    let data = returnObj.data;
    let headers = data[0];
    
    let mentorObjects = [];
    for(let i=1; i<data.length; i++){
        let tempMentorObj = {};
        for(let j=0; j<data[i].length; j++){
            tempMentorObj[headers[j]] = data[i][j];
        }
        console.log(tempMentorObj);
        mentorObjects.push(tempMentorObj);
    }   
}




