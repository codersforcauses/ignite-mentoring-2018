import csv
import random

with open("fakedata.csv", "wb") as csvfile:
    
    csvfile.write('id, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17\n')
    for x in range (0, 130):
        classes = [0] * 17
        y=1
        while y<5:
            prefClass = random.randint(0, 16)
            if classes[prefClass] == 0:
                classes[prefClass] = y
                y+=1

        csvline = str(x)+","
        for g in range(0,17):
            csvline+=str(classes[g])
            if(g==16):
                csvline+='\n'
            else:
                csvline+=','
        csvfile.write(csvline)

    

