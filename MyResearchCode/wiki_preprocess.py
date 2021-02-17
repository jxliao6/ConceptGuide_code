############################################################################
#
# output => "wiki_preprocess_stdout.txt"
# output => category_to_wordlist.pkl"
# a list of dictionary : 
#           'filename':<wiki_XXX.txt>,
#           <category1>:confidence score,
#           <category2>:confidence score,
#           ...
#   Date structure
    # class_dict =? '<filename>':category
    # wikiword_dict => '<wikifilename>': wiki words
    # mapp : <category on googleapi> => <wikiset file name> 
    # mapp2 : <category on googleapi> => <wiki word >
############################################################################
# step 1 : classify each wiki file
# then you can manually edit "mapp_edit.json"
# step 2 : mapp each category to the related wikiwords
############################################################################
import os
# import googleapi,output
from other_modules import googleapi,output
import sys
import json
path = "wiki_original"
filelist = []
remove_words = ['None','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
                'P','Q','R','S','T','U','V','W','X','Y','Z',
                '0–9','Log in','Article','Talk','Read','Edit','About Wikipedia',
                'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w'
                ,'x','y','z',
               'See also','^','References','Index','+','more']

def Access_and_Classify_Wikifile():
    #### read every wiki original file ####
    wikiword_dict = {}
    class_dict = {}
    #print(os.listdir(path))
    for filename in os.listdir(path):
        if filename.startswith('.'):
            continue
        ## access wiki words => save in wiki_list,text
        with open(path+"/"+filename, encoding='utf-8') as f:
            lines = f.readlines()
        wiki_list = []
        text = ""
        for every in lines:
            wiki_list.append(every.rstrip('\n'))
            text = text+" "+every.rstrip('\n')

        ## do preprocess ,filter uncorrect words
        wiki_list = [x for x in wiki_list if x not in remove_words]
        ## update classify information => save in class_dict,wikiword_dict
        #print(filename.encode("utf8").decode("cp950", "ignore"))
        class_pair_list = googleapi.classify(text)
        class_list = [ cate for cate,score in class_pair_list]
        wikiword_dict[filename] = wiki_list
        class_dict[filename] = class_list
        #print(text.encode("utf8").decode("cp950", "ignore"))
        #print("  ")
    return (wikiword_dict,class_dict)


def Map_Category_To_Wikiset():
    ### for each category on googleapi, what's the corresponding wikiset
    mapp = {} 
    for fileitem in class_dict:
        for category in class_dict[fileitem]:
            if category not in mapp:
                l = []
                l.append(fileitem)
                mapp[category] = l
            else:
                if fileitem not in mapp[category]:
                    mapp[category].append(fileitem)
    return mapp

def Map_Category_To_Wikiwords():
    ### for each category on googleapi, what's the corresponding wiki words
    mapp2 = {}
    for category in mapp:
        print(category, ":", mapp[category])
        for wikiset in mapp[category]:
            if category not in mapp2:
                mapp2[category] = []
                mapp2[category].extend(wikiword_dict[wikiset])
            else:
                mapp2[category].extend(wikiword_dict[wikiset])

    ## add 'else' in mapp2
    wlist = []
    for category in mapp2:
        wlist.extend(mapp2[category])
    wlist = set(wlist)
    mapp2['else'] = wlist
    return mapp2



if __name__ == '__main__':
        
    output.save_print("wiki_preprocess_stdout.txt")

    if len(sys.argv) < 2:
        sys.stderr.write('Usage: python wiki_preprocess.py step1/step2 ')
        sys.exit()

    if sys.argv[1]=="step1":
        (wikiword_dict,class_dict) = Access_and_Classify_Wikifile()
        mapp = Map_Category_To_Wikiset()
        ### save to json ###
        with open('mapp.json', 'w') as fp:
            json.dump(mapp, fp)

    elif sys.argv[1]=="step2":
        (wikiword_dict,class_dict) = Access_and_Classify_Wikifile()
        with open('mapp_edit.json', 'r') as fp:
            mapp = json.load(fp)
        mapp2 = Map_Category_To_Wikiwords()

        print("\n\n\n length")
        for item in mapp2:
            print(item, ":", len(mapp2[item]))
        
        ### save ###
        output.to_pickle(mapp2, "category_to_wordlist.pkl")
        
    
