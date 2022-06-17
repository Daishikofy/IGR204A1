# IGR204 MINI-PROJECT 1 : BABY NAMES


## Assignment 1 : Evolutions of names over time
The goal of this visualisation is to answer the following questions:

*How do baby names evolve over time? Are there names that have consistently remained popular or unpopular? Are there some that have were suddenly or briefly popular or unpopular? Are there trends in time?*

### How to run the visualisation

To this visualisation it, go to the *Assigment1* folder and run the following line in a termina in order to open a python server:

    python -m http.server 8080

Then, go to *http://localhost:8080*

You can visualize time spans of 10 years by changing the dates at the bottom of the visualisation. 
Select the radio button in order to see the ranking of feminin or masculin names.
Hover your mouse over the coloured rectangles in order to see more information about it.

### Implementation
The data was pretreated using the script: *DataPreTreatment.py* located in the *js/* folder. This scripts reads the data from the **dpt2020.csv** file and creates the **topNames.cvs** from it. This last cvs uses the following header:

    annais,sexe,preusuel,rank

**annais**: Year of attribution  
**sexe:** Name's associated genre, 1 for masculin, 2 for feminin  
**preusuel:** The name  
**rank:** It rank from 1 to 10 in it's year of attribution and in it's category

We then used d3 in order to create the visualisation. Rectangles are displayed horizontaly following a linear scale along the years and verticaly following a linear scale acording to their ranking.  
A list of all the names apearing in the top 10 along 10 years is created and a single color is associated to each of them allowing to follow the evolution in popularity of each name acording to the placement of each coloured rectangle along the y axis.

### Critical analysis

This visualisation only covers the top 10 names of each years, only the evolution of fairly popular names can be seen.  

## Assignment 2 : Names popularity acording to regions
The goal of this visualisation is to answer the following questions:

*Is there a regional effect in the data? Are some names more popular in some regions? Are popular names generally popular across the whole country?*

### How to run the visualisation
To run this visualisation, paste the **dpt2020.csv** file inside the *Assignment2/* folder then execute the jupyter notebook.

### Implementation
This notebook uses modules numpy, altair, pandas and geopandas.

The structure of the notebook is explained in the first blocks.

### Critical analysis
A discussion about the relevance of the selected visualizations is included at the end of the notebook.
