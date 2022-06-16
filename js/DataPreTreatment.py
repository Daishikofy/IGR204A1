import pandas as pd

def SelectTop20(path):
    df = pd.read_csv (path, sep=';')
    df.drop(columns="dpt", inplace=True)
    df = df[df.preusuel != "_PRENOMS_RARES"]
    df = df[df.annais != "XXXX"]


    sum = df.groupby(by=["annais","sexe","preusuel"]).sum()

    sum['rank'] = sum.groupby(["annais","sexe"], group_keys=False)["nombre"].rank(method="max", ascending=False)
    sum.drop(columns="nombre", inplace=True)
    sum = sum['rank'].groupby(["annais","sexe"], group_keys=False).nsmallest(10)
    print(sum)

    sum = sum.reset_index()

    data = sum.to_csv(index=False, encoding="utf-8")
    f = open("topNames.csv", "w", encoding='utf8', newline='')
    f.write(data)
    f.close()

SelectTop20('data/dpt2020.csv')