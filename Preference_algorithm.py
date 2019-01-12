#!/usr/bin/env python
# coding: utf-8

# In[43]:


import pandas as pd
import numpy as np
data = pd.read_csv('fakedata.csv') 
data = data.rename(columns = {'Do you have a Working With Children Check? If not- please organise this before next Monday the 13th.': 'WWCC', 'Can you drive to and from your class?':'CanDrive', 'Have you mentored before?':'HasMentored', 'What is your gender?':'Gender - 1 is male'})
# df.rename(columns={'oldName1': 'newName1', 'oldName2': 'newName2'})
data = data.drop(['Timestamp', 'Email', 'Phone Number', 'If you do have a WWCC what is your number?', 'WWCC'], axis = 1)
# df.apply(lambda x: [1, 2], axis=1)
data.iloc[:, 1] = data.iloc[:, 1].apply(lambda x: 1 if x == 'Yes' else 0)
data.iloc[:, 2] = data.iloc[:, 2].apply(lambda x: 1 if x == 'Male' else 0) #True values for Male
data.iloc[:, 3] = data.iloc[:, 3].apply(lambda x: 1 if x == 'Yes' else 0)
data['priority'] = ''
data['assigned'] = 0
data['assignedto'] = ''
# data.iloc[:, 1]
pd.set_option('max_columns', 15, 'max_rows', 130)

data.head(10)


# In[44]:


# approach

# min 3 people in a class
# atleast 2 people with experience per class
# atleast 1 male/female per class
# atleast 1 driver per class
# Driving to class? Need to consider for location of class?

# could have very IF THEN bound solutions

# assign people highest priority dependending on if they both CanDrive and HasMentored - assign maximum of two people with
# highest priotiy to each class (must remove them after allocation has completed) (hard cap of 2 should increase if each class
# overfills)

# then assign people to class IF classes have already 2 males or two females?



# In[45]:


for i in range(len(data)):
    data.loc[[i], 'priority'] = data.CanDrive[i] + data.HasMentored[i]
print('highest')
print(data[data.priority == 2].priority.count())
print('2nd')
print(data[data.priority == 1].priority.count())
print('3rd')
print(data[data.priority == 0].priority.count())

for i in range(len(data)):
    data.loc[[i], ['priority']] = data.CanDrive[i] + data.HasMentored[i]
# data.head(10)


# In[46]:


i = 2
j = 15
# data[data.columns[19]][2]
# (data[data.columns[j+4]][i] == 1) & (data.assigned[i] == 0)
# data[data.columns[j+4]][i]== 1
# data.assigned[i] == 0
# (data.assignedto.value_counts(dropna=False).sort_index().iloc[0] % len(data)) <= 2
# # data[data.assignedto == data.columns[j+4]].assignedto.count()
# for p in reversed(range(3)):
#     print(p)
# for i in [1,2,3,4]:
#     print(i)
#pd.DataFrame().reindex_like(df1)
# new_data = pd.DataFrame().reindex_like(data)
# new_data = new_data.dropna()
# new_data = new_data.append(other = data[data.assignedto != ''])
# data = data.drop(data[data.assignedto != ''].index, axis = 0)
# new_data
# data


# In[47]:


# new_data = pd.DataFrame().reindex_like(data)
# new_data = new_data.dropna()

for p in reversed(range(3)):
    for n in [1, 2, 3, 4]:
        for j in range(17): #column
        #     print('success')
            for i in range(len(data)): #row
        #         print('again')
                if (
                    data[data.columns[j+4]][i] == n) & \
                    (data.assigned[i] == 0) & \
                    (data[data.assignedto == data.columns[j+4]].assignedto.count() <= 3) & \
                    (data.priority[i] == p):
    
                    data.loc[[i], ['assignedto']]  = data.columns[j+4]
                    data.loc[[i], ['assigned']]  = 1
        #             print(i)
        #             print(j)
#     new_data = new_data.append(other = data[data.assignedto != ''])
#     data = data.drop(data[data.assignedto != ''].index, axis = 0)
data.head(130)


# In[48]:


data.groupby('assignedto').sum()
# data.head(130)


# In[ ]:




