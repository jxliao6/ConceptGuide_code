# refer to : https://github.com/martin-majlis/Wikipedia-API
## feature3  (Wiki Distance  )###
import pprint
from scipy import spatial
import numpy as np
import nltk
import wikipediaapi
import re

# import sys
wiki = wikipediaapi.Wikipedia('en')# wikipedia.set_lang("en")
wiki_request_records = {}

#other functions (for calculate similarity)
def Create_WikiPageRecords(vlist):
    records={}
    for (voc,detail) in vlist:
        page = wiki.page(voc)
        if page.exists()==True:
            records[voc] = page.text.strip()
        else:
            records[voc] = None
    return records
    
def CheckExist(word1,word2,records):
    wikitext = records[word1]
    if wikitext!=None:
        if(Term_Exist(wikitext,word2))==1:
            return 1
    return 0

def CheckExist_InEachWiki(vlist,WikiPageRecords):
    history={}
    for (word1,d1) in vlist:
        for (word2,d2) in vlist:
            if word1==word2:
                history[(word1,word2)] = 1
            else:
                result =CheckExist(word1,word2,WikiPageRecords)
                history[(word1,word2)] = result
            # print(wikiexist,word,word2,result)
    return history

# main function to calculate feature3
def calculate_f3(Prob_ConceptPairs,model):
    ##generalized
    # f3 = []
    for item in Prob_ConceptPairs:
        (a,b) = item
        # Wrd_dict[(a,b)] = Wrw(b,a,model) - Wrw(a,b,model)
        f3_value = Wrw(b,a,model) - Wrw(a,b,model)
        # f3.append(f3_value)
        Prob_ConceptPairs[item]['f3']=f3_value
    # return f3
    return Prob_ConceptPairs



def Wrw(a,b,model):
    # Wrw_dict = {}
    # get a's most similar words
    a_similars = model.most_similar(a,topn=2) if (a in model) else []
    # print("(a,b)=",a,b)
    # print("a's similars",a_similars)
    value = Erw(a,b)
    w_sum = 0
    if len(a_similars)!=0:
        for (e,w) in a_similars:
            # remove 's'
            if e[len(e)-1]=='s':
                e = e[:len(e)-1]
            value = value+ Erw(e,b) * w
            w_sum = w_sum + w
        return float(value)/(1+w_sum)
    else:
        return Erw(a,b)
    # print(Wrw_dict)

def Term_Exist(str,word):
    str = str.lower()
    str = re.sub("[?!()-/==.~@#%&*]+", "",str)
    word = word.lower()
    if word in str:
        #print("find in =>",str[str.find(word):str.find(word)+15])
        return 1
    else:
        return 0


def Erw(e,b): # check whether term 'b exists in wiki_entity 'e'
    #check records
    if e in wiki_request_records:
        if wiki_request_records[e]!=None:
            if(Term_Exist(wiki_request_records[e],b))==1:
                return 1
        return 0 
    # no records,send request to wiki_api
    else:
        page = wiki.page(e)
        if page.exists()==True:
            # print(page.title)
            if(Term_Exist(page.text,b))==1:
                wiki_request_records[e] = page.text.strip()
                # print("find ",e)
                return 1
        else:
            wiki_request_records[e] = None
            # print("cannot find {",e,"}")
        return 0


