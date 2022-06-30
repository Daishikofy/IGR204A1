import pandas as pd

def SelectAsexual(path):
    df = pd.read_csv (path, sep=';')
    df.drop(columns="dpt", inplace=True)
    df = df[df.preusuel != "_PRENOMS_RARES"]
    df = df[df.annais != "XXXX"]


    sum = df.groupby(by=["annais","sexe","preusuel"], as_index=False).sum()
    #print(sum)
    men = sum.loc[sum["sexe"]==1]
    women = sum.loc[sum["sexe"]==2]
    menNames = []
    womenNames = []
    multiNames = []
    for name in men.preusuel.to_list():
        if name not in menNames:
            menNames.append(name);

    for name in women.preusuel.to_list():
        if name not in womenNames:
            womenNames.append(name);
    for name in womenNames:
        if name in menNames:
            multiNames.append(name)
    print(len(multiNames))
    #multi = women.loc[sum["preusuel"].isin(men["preusuel"].)]
    #print(multi)

    sum = sum.reset_index()

    data = sum.to_csv(index=False, encoding="utf-8")
    f = open("asexualNames.csv", "w", encoding='utf8', newline='')
    f.write(data)
    f.close()

SelectAsexual('../data/dpt2020.csv')