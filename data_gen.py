"""Python script to generate fake data with a unique ID and 17 classes.
   Each 'mentor' will preference 4 out of the 17 classes (1,2,3,4).
   
   Run the script for BASH with python data_gen.py
   
   This will create a file named 'fakedata.csv' with your data.
   To change the amount of data generated change the DATAROWS variable below."""


import csv
import random

DATAROWS = 130
with open("fakedata.csv", "wb") as csvfile:
    
    csvfile.write('id, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17\n')
    for id in range (0, DATAROWS):
        classes = [0] * 17
        y=1
        while y<5:
            prefClass = random.randint(0, 16)
            if classes[prefClass] == 0:
                classes[prefClass] = y
                y+=1

        csvline = str(id)+","
        for g in range(0,17):
            csvline+=str(classes[g])
            if(g==16):
                csvline+='\n'
            else:
                csvline+=','
        csvfile.write(csvline)

    

