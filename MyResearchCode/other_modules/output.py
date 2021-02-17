import csv
import json
import pickle
import sys

def to_dict(vlist,filename):
    output = open(filename, 'w')
    for item in vlist:
        output.write(json.dumps(item))
        output.write("\n")
        #print(item['description'].encode("utf8").decode("cp950", "ignore"))
    output.close()

def to_csv(vlist,filename):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        #fieldnames =  vlist[0].keys()
        fieldnames = [x for x in vlist[0].keys()]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for item in vlist:
            writer.writerow(item)

def to_pickle(vlist,filename):
    with open(filename,'wb')as f:
        pickle.dump(vlist,f)


def to_txt(text,filename):
    with open(filename,'w')as f:
        f.write(text)
    f.close()

def save_print(filename):
    sys.stdout = open(filename, "w")
