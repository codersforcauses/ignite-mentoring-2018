"""Python script to generate fake data with the same format as the example data.
   Fields relative to out algorithm (Working with children's check, driver, experience and gender)
   are randomised with 50% chance. 
   Each 'mentor' will preference 4 out of the NUMCLASSES classes (1,2,3,4).
   Each 'mentor' also has a unique 'name'.

   Run the script from a CLI with python data_gen.py

   This will create a file named 'fakedata.csv' with your data.
   To change the amount of data generated change the DATAROWS variable below.
   To add new classes, add them to the CLASSTIMES list and modify NUMCLASSES as appropriate."""


import csv
import random

'''Change the random integers generated in this function to change how likely the
   mentors in the random data are to have a WWCC, be a driver, and be experienced.'''
def generatePersonalInfo(idNum):
    Name = 'name'+str(idNum)
    Timestamp = '2018/12/19'
    email = Name+'@gmail.com'
    Phone = '11010101'
    wwcc = 'Yes' if (random.randint(0,1)==1) else 'No'
    wwccNum = '123141'
    driver = 'Yes' if (random.randint(0,1)==1) else 'No'
    gender = 'Male' if(random.randint(0,1)==1) else 'Female'
    experienced = 'Yes' if (random.randint(0,1)==1) else 'No'
    return (Timestamp+','+Name+','+email+','+Phone+','+wwcc+','+wwccNum+','+driver\
    +','+gender+','+experienced+',')

DATAROWS = 130
CLASSTIMES = ['Monday 9:55-11am - Kiara College', 'Monday 10-11am - Balga SHS', 'Monday 12:18-1:22pm - Fremantle College'\
'Monday 12:18-1:22pm - Fremantle College', 'Monday 1:55-2:45pm - Southern River College',\
'Tuesday 8:50-9:55am - Kiara College', 'Tuesday 10-11am - Balga SHS', 'Tuesday 12:18-1:22pm - Fremantle College',\
'Tuesday 1:55-2:45pm - Southern River College', 'Wednesday 10-11am - Balga SHS', 'Wednesday 11:10-12:15pm - Fremantle College',\
'Wednesday 12:20-1:25pm - Balga SHS', 'Wednesday 1:55-2:45pm - Southern River College',\
'Thursday 1:05-1:55pm - Southern River College', 'Thursday 1:45-2:50pm - Fremantle College',\
'Thursday 1:55-3pm - Kiara College', 'Friday 9:30-10:40am - Hampton SHS', 'Friday 2-3pm BalgaSHS']
NUMCLASSES = len(CLASSTIMES)

with open("fakedata.csv", "wb") as csvfile:
    headerString = 'Timestamp,Name,Email,Phone Number,Do you have a Working With Children Check? If not- please organise this before next Monday the 13th.,\
If you do have a WWCC what is your number?,Can you drive to and from your class?,What is your gender?\
,Have you mentored before?'

    for classtime in CLASSTIMES:
        headerString += (', ' + classtime)
        
    csvfile.write(headerString+'\n')
    for id in range (0, DATAROWS):
        classes = [0] * NUMCLASSES
        y=1
        while y<5:
            prefClass = random.randint(0, NUMCLASSES-1)
            if classes[prefClass] == 0:
                classes[prefClass] = y
                y+=1

        csvline = generatePersonalInfo(id)
        for g in range(0,NUMCLASSES):
            csvline+=str(classes[g])
            if(g==NUMCLASSES-1):
                csvline+='\n'
            else:
                csvline+=','
        csvfile.write(csvline)




    

