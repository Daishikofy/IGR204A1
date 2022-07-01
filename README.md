# IGR204 MINI-PROJECT 1 : BABY NAMES


## Assignment 1 : Evolutions of names over time
The goal of this visualisation is to answer the following questions:

*How do baby names evolve over time? Are there names that have consistently remained popular or unpopular? Are there some that have were suddenly or briefly popular or unpopular? Are there trends in time?*

### How to run the visualisation

To see this visualisation, go to the *Assigment1* folder and run the following line in a terminal in order to open a python server:

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

## Assignment 3 : Difference of popularity between sexes in multigender names
The goal of this visualisation is to answer the following questions:

*Are there gender effects in the data? Does popularity of names given to both sexes evolve consistently?*

### How to run the visualisation

To see this visualisation, go to the `Assigment3` folder and run the following line in a terminal in order to open a python server:

    $python -m http.server 8080

Then, go to `http://localhost:8080`

You can visualize time spans of 10 years by changing the dates at the bottom of the visualisation. 
Select the radio button in order to see the ranking of feminin or masculin names.
Hover your mouse over the coloured rectangles in order to see more information about it.

### Implementation
The data was pretreated using the python scripts: `DataPreTreatment.py`, `py1.py` and `py2.py` located in the `js/` folder. These scripts read the data from the **dpt2020.csv** file and create at last the **out2.json** file from it. This json has a better hierarchy than the big csv file for the upcoming task, thus eases the computing time a lot.

We then used d3 in order to create the visualisation. 
There are 3 inputs that can be filled with a number: the first year to display, the range of years to display and the last year to display. They are mostly inter-dependant, but the range has priority over the others.

Below that is a fourth input: the name to research. Start typing a name and corresponding names in the database will display if they are multi-gender.

Below the inputs is a set of tooltips, then come the visualisations:

On the left, the curves for all the names corresponding to the research are displayed. There are two curves per name, one for males (with squares as the points) and one for females (the regular polyline).

When hovering over the curves, tooltips will be displayed to give the data to the user.

Click one of the curves to display on the rightmost visualisation the yearly differences between genders for the choice of a name.

As you may see for the name CAMILLE, there is a peak of female domination around in the 1990's!

Again, hover over the data to see some tooltips!


### Critical analysis

This visualisation only covers national counts. Some may want to explore by department.

The boundaries were not tested, please don't break the program.
