
from other_modules import googleapi,text_preprocess,keywords
from collections import defaultdict
from operator import itemgetter
from pprint import pprint



def extract_wikiwords(text,wlist):
    word_count = {}
    total = 0
    for word in wlist:
        num = text.count(" "+word+" ")
        if num != 0:
            word_count[word] = num
            total = total+num
    sorted_word_count = sorted(word_count.items(), key=lambda d: d[1], reverse=True)
    #print(type(sorted_word_count[0]))
    return [sorted_word_count,total]

def decide_wiki_words(mapp,clist): 
    wlist = []
    #print(clist)
    if len(clist)!=0:
        for category in clist:
            find = 0
            for key_str in mapp:
                if category in key_str: #a/ =>  a/b/c
                    wlist.extend(mapp[key_str])
                    find = 1
            # if find ==0:
            #     tempfile.write(category+"\n")
    else:
        wlist = mapp['else']

    wlist = set(wlist) #fet unique voc
    return wlist


def IntegrateSameVoc(voc_list): # combine the count if they are the same words in voc_list
    tempDict = defaultdict(int)
    for voc, count in voc_list:
        tempDict[voc] += count
    voc_list = tempDict.items()
    voc_list = sorted(voc_list, key=itemgetter(1),reverse=True)
    return voc_list

def Extract(videos,all_text,mapp,RAKEKeywords,tagKeywords):
    word_freq_dict = {}
    NumOfWord_videodict={}
    voc_list = []
    for item in videos:
        line = all_text[item['videoid']]
        # print("CHECK_lenth:",len(item['transcript'])," ",len(line))
        classify_pair_result = googleapi.classify(line)
        classify_result = [cate for cate,score in classify_pair_result]
        classify_score =  [score for cate,score in classify_pair_result]
        wlist = decide_wiki_words(mapp, classify_result)
        # wlist = set()
        ###combine wlist and autoKeywords
        print("CHECK how many word in extract wordsets: ")
        wlist = keywords.updateWlist(text_preprocess.List(wlist),text_preprocess.List(RAKEKeywords),text_preprocess.List(tagKeywords))
        #wlist = removeSubstring(wlist)
        print(len(wlist))
        
        [word_count,total_words] = extract_wikiwords(line, wlist)
        
        print("video id : ", item['videoid'],' | ',"video title : ", item['title'].encode("utf8").decode("cp950", "ignore"))
        #print("original text : ", line.replace('\n',' ').encode("utf8").decode("cp950", "ignore"))
        print("category: ",classify_result)
        print("confidence:",classify_score)
        
        print("== After classify ==  ", len(wlist),total_words, " concept words\n",word_count,"\n\n")
        ### save word_count
        word_freq_dict[item['videoid']] = word_count
        NumOfWord_videodict[item['videoid']] = total_words # add
        voc_list.extend(word_count)
        #voc_list.extend([x[0] for x in word_count])
        voc_list = IntegrateSameVoc(voc_list) 
    
    return [word_freq_dict,NumOfWord_videodict,voc_list]


def CreateVocAppearDict(voc_list,word_freq_dict):
    voc_appear_dict = {}
    for word,count in voc_list:
        l = []
        for vid in word_freq_dict:
            if word in [x[0] for x in word_freq_dict[vid]]:
                l.append(vid)
        voc_appear_dict[word] = l
    return voc_appear_dict

def PrintExtractResult(videos,voc_list,word_freq_dict,voc_appear_dict):
    print("  \n\n\n\n==================================  ")
    for item in word_freq_dict:
        print(item,": ",word_freq_dict[item])

    print("  \n\n\n\n==================================  ")
    for voc,count in voc_list:
        print(voc, "(", count,"):", voc_appear_dict[voc])

    print("  \n\n\n\n==================================  ")
    for voc,count in voc_list:
        l = []
        for item in videos:
            if item['videoid'] in voc_appear_dict[voc]:
                l.append(item['title'].encode("utf8").decode("cp950", "ignore"))
        print(voc, "(", count,"):", l)


class Phrase:
    def __init__(self, strr):
        self.strr = strr
    def __eq__(self, that):
        if text_preprocess.PhraseReduction(self.strr) != text_preprocess.PhraseReduction(that.strr):
            return False
        return text_preprocess.PhraseReduction(self.strr) == text_preprocess.PhraseReduction(that.strr)
    def __hash__(self):
        return hash(text_preprocess.PhraseReduction(self.strr))


def CheckSamePhrases(voc_list):
    # Make Sure Which are the SamePhrases then record
    voc_list2=[]
    new_voclist=[]
    for voc,cnt in voc_list:
        new_voclist.append(Phrase(voc))
        voc_list2.append(voc)
    print("voc_list")
    pprint(voc_list)
    newset= set(new_voclist)
    new_voclist=[]
    for item in newset:
        new_voclist.append(item.strr)
    print("new_voclist")
    pprint(new_voclist)
    print(len(voc_list),len(new_voclist))
    
    SamePhrases = list(set(voc_list2)-set(new_voclist))
    print("SamePhrases",SamePhrases)
    SamePhraseRecords={}
    for phrase in SamePhrases:
        for voc in voc_list2:
            if text_preprocess.PhraseReduction(voc) == text_preprocess.PhraseReduction(phrase) and voc not in SamePhrases:
                SamePhraseRecords[phrase]= voc
    print("SamePhraseRecord",SamePhraseRecords)
    new_list=[]
    for voc,cnt in voc_list:
        if voc in SamePhraseRecords:
            new_list.append((SamePhraseRecords[voc],cnt))
        else:
            new_list.append((voc,cnt))
     
    new_list = [(word,sum( v for k,v in new_list if k == word )) for word in  dict(new_list).keys()]
    new_list = sorted(new_list, key=lambda tup: tup[1], reverse=True)
    return[SamePhrases,SamePhraseRecords,new_list]

def MergeSamelist(samelist):
    mainword = samelist[0][0]
    total=0
    for word,cnt in samelist:
        total = total + cnt
    return [(mainword,total)]

    
#299 285

# def CheckSamePhrases(voc_list):
#     new_list=[]
#     SamePhraseRecords={} # save common set
#     SamePhrases=[] #only save words
#     for voc1,cnt1 in voc_list:
#         print("voc1",voc1)
#         if(voc1 not in SamePhrases): # if not checked as SamePhrases before , then check
#             samelist=[]
#             for voc2,cnt2 in voc_list: # check
#                 if text_preprocess.PhraseReduction(voc1) == text_preprocess.PhraseReduction(voc2):
#                     samelist.append((voc2,cnt2))  
#             if len(samelist)>1:
#                 # SamePhraseRecords.append(samelist)
#                 for item in samelist[1:]:
#                     SamePhraseRecords[item[0]] = samelist[0][0]
#                 SamePhrases.extend([item[0] for item in samelist[1:]])
#                 print(samelist)          
#                 samelist = MergeSamelist(samelist)
#             new_list.extend(samelist)
#     print("new_list",new_list)
#     print("Check size",len(voc_list),len(new_list))
#     print("SamePhraseRecord",SamePhraseRecords)
#     print("SamePhrases",SamePhrases)
#     print("SamePhraseRecordSet",set(SamePhraseRecords))
#     return[SamePhrases,SamePhraseRecords,new_list]



def IntegrateSameWords_AfterLemmatize(voc_list,word_freq_dict):
    
    # Make Sure Which are the SamePhrases then record
    [SamePhrases,SamePhraseRecords,new_voclist] = CheckSamePhrases(voc_list)

    # adjust the word_freq_dict
    new_word_freq_dict={}
    for vid in word_freq_dict:
        wlist = word_freq_dict[vid]
        new_wlist=[]
        for word,cnt in wlist:
            if word in SamePhraseRecords:
                new_wlist.append((SamePhraseRecords[word],cnt))
            else:
                new_wlist.append((word,cnt))
        
        print("wlist/new_wlist")
        print(wlist)
        print(new_wlist)
        
        d = dict(new_wlist)
        new_wlist = [(word,sum( v for k,v in new_wlist if k == word )) for word in d.keys()]
        new_wlist = sorted(new_wlist, key=lambda tup: tup[1], reverse=True)
        print("NEWNEW",new_wlist)
        new_word_freq_dict[vid]= new_wlist
    
    return [new_voclist,new_word_freq_dict]



def removeSubstring(vlist):  # e.g. if both "bubble" and "sort" and "bubble sort" exist in Top30 Words,remove"bubble" "sort"
    checklist = vlist[:]
    
    checklist = list(filter(lambda x: x!='gon na', checklist))
    for voctuple in vlist:
        splitlist = voctuple[0].split(' ')
        if(len(splitlist)>1):
            remove_words = []
            for item in splitlist:
                t = [t for t in checklist if text_preprocess.PhraseReduction(t[0])==text_preprocess.PhraseReduction(item)]
                if(len(t)!=0):
                    remove_words.append(t[0])
            
            if(len(remove_words)==len(splitlist)): # all words have single voc corresponding
                for word in remove_words:
                    if word in vlist:
                        vlist.remove(word)
                        print("c_remove ",word)
    return vlist


        
