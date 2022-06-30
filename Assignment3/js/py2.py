import pandas as pd
from json import dump

def SelectAsexual(path):
    df = pd.read_csv(path, usecols=["annais","preusuel","nb_g","nb_f"])

    mask = df.groupby(["preusuel"]).sum()
    mask = mask[mask.nb_g!=0]
    mask = mask[mask.nb_f!=0]
    df = df[df.preusuel.isin(mask.index)]
    print(df)
    df.to_csv("out2.csv", index=False, encoding="utf-8")
    dico = dict()
    for x in df.groupby("preusuel"):
        dico[x[0]] = {
            e[1].annais: {
                "nb_g": e[1].nb_g,
                "nb_f": e[1].nb_f
                }
            for e in x[1].iterrows()
            }
    
    with open("out2.json", 'w', encoding="utf-8") as f:
        dump(dico, f, ensure_ascii=False)
df  = SelectAsexual('./out1.csv')
