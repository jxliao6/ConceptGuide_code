from sklearn.metrics.pairwise import cosine_similarity
from operator import itemgetter
from scipy import sparse
import numpy as np
import json
from pprint import pprint
import math
from other_modules import similarity

# ==========================================================================
# Other small functions
# ==========================================================================
  
def PrintSetWithScore(the_set,v_list):
    new_list=[]
    v_dict = dict(v_list)
    for voc in the_set:
        score = v_dict[voc]
        new_list.append((voc,score))
    new_list = sorted(new_list, key=itemgetter(1),reverse=True)
    pprint(new_list)
   
def IS_WordInTitle(word,title_text):
    if ' '+word+' ' in title_text:
        return 1
    else:
        return 0

def IS_MultiWord(word):
    if len(word.split(' '))>1:
        return 1
    else:
        return 0

def Appears_MultiVideos(A,B):
    return float(A)/B

# =============================================================================
# Print voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf
# =============================================================================
def Print_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,TOP_N_CONCEPT):
    print("\n\nvoc_list")
    pprint(voc_list)
    print("\n\nvoc_list_with_MaxTfidf")
    pprint(voc_list_with_MaxTfidf)
    print("\n\nvoc_list_with_AvgTfidf")
    pprint(voc_list_with_AvgTfidf)
    
    print("\n\n diffenece between 3 lists")
    set1 = set([voc for (voc,val) in voc_list][:TOP_N_CONCEPT])
    set2 = set([voc for (voc,val) in voc_list_with_MaxTfidf][:TOP_N_CONCEPT])
    set3 = set([voc for (voc,val) in voc_list_with_AvgTfidf][:TOP_N_CONCEPT])
    CommonSet = set1 & set2 & set3
    print("\n\ncommon")
    pprint(CommonSet)
    print("\n\nwords only in voc_list")
    PrintSetWithScore(set1-CommonSet,voc_list)# pprint.pprint(set1-CommonSet)
    print("\n\nwords only in voc_list_with_MaxTfidf")
    PrintSetWithScore(set2-CommonSet,voc_list_with_MaxTfidf)# pprint.pprint(set2-CommonSet)
    print("\n\nwords only in voc_list_with_AvgTfidf")
    PrintSetWithScore(set3-CommonSet,voc_list_with_AvgTfidf)# pprint.pprint(set3-CommonSet)


def Print_different_voc_list2(vlist,tfidf_VList,TOP_N_CONCEPT):
    print("diffenece between 2 lists")
    set1 = set([voc for (voc,val) in vlist][:TOP_N_CONCEPT])
    set2 = set([voc for (voc,d) in tfidf_VList][:TOP_N_CONCEPT])
    CommonSet = set1 & set2 
    print("\n\ncommon")
    pprint(CommonSet)
    print("\n\nwords only in vlist")
    pprint(set1-CommonSet)
    print("\n\nwords only in tfidf_VList")
    pprint(set2-CommonSet)
    


# =============================================================================
# Process tfidf_Maxtrix
#  => return new voc_list
#       but this time , every element(voc,cnt) in list
#       cnt will be "max_tfidf","avg_tfidf"
# - max_tfidf : 
#    e.g. refer to similarities_sparse , 
#         concept1 would be max/avg value in vector1
# =============================================================================
def GetMaxTfidf(voc_list,tfidf_matrix):
    tfidf_list = []
    for vector in tfidf_matrix:
        tfidf_list.append(max(vector))
    new_voc_list = []
    i = 0
    for (voc,cnt) in voc_list:
        new_voc_list.append((voc,tfidf_list[i]))
        i = i + 1
    new_voc_list = sorted(new_voc_list, key=itemgetter(1),reverse=True)
    return new_voc_list
        


def GetAvgTfidf(voc_list,tfidf_matrix):
    tfidf_list = []
    for vector in tfidf_matrix:
        tfidf_list.append(float(np.sum(vector))/len(vector))
    new_voc_list = []
    i = 0
    for (voc,cnt) in voc_list:
        new_voc_list.append((voc,tfidf_list[i]))
        i = i + 1
    new_voc_list = sorted(new_voc_list, key=itemgetter(1),reverse=True)
    return new_voc_list
# ============================================================================
# Combine_different_voc_list
#   calculate new score by combine 
#       1. voc_list(with term_frequency)
#       2. voc_list_with_MaxTfidf
#       3. voc_list_with_Avg_Tfidf
# ============================================================================
def Combine_different_voc_list(word_freq_dict,voc_appear_dict,voc_list,voc_list_with_MaxTfidf,title_text,voclist_SelectMethod,weight1,weight2,weight3,weight4,weight5):
    voc_dict = dict(voc_list)
    voc_dict_with_MaxTfidf = dict(voc_list_with_MaxTfidf)
    # voc_dict_with_AvgTfidf = dict(voc_list_with_AvgTfidf)
    tfidf_VocDict = {}
    if(voclist_SelectMethod==0): # combine
        for (voc,cnt) in voc_list:
            # set thresold to filter those concepts only appears few times
            if voc_dict[voc]<=2:
                pass
            elif voc_dict[voc]<=3 and (float(voc_dict[voc])/len(voc_appear_dict[voc])<2):
                pass
            else:
                normalized_A = voc_dict[voc]/(voc_list[0][1])
                normalized_B = voc_dict_with_MaxTfidf[voc]/(voc_list_with_MaxTfidf[0][1])
                normalized_C = IS_WordInTitle(voc,title_text)
                # normalized_C = voc_dict_with_AvgTfidf[voc]/(voc_list_with_AvgTfidf[0][1])
                normalized_D = IS_MultiWord(voc)
                normalized_E = Appears_MultiVideos(len(voc_appear_dict[voc]),len(word_freq_dict))
                score = weight1* normalized_A + weight2* normalized_B + weight3 * normalized_C + weight4 * normalized_D + weight5 * normalized_E
                
                # tfidf_VocList.append((voc,cnt,,score))
                tfidf_VocDict[voc] = {"cnt":cnt,"importance":score,"numOfVideos":len(voc_appear_dict[voc])}
                print("tmp CHECK",voc,":",normalized_A,",",normalized_B,",",normalized_C,",",normalized_D,",",normalized_E)
    elif (voclist_SelectMethod == 1):
        tfidf_VocList = voc_list    
    elif (voclist_SelectMethod == 2):
        tfidf_VocList = voc_list_with_MaxTfidf
    elif (voclist_SelectMethod == 3):
        tfidf_VocList = voc_list_with_AvgTfidf
    # tfidf_VocList  = sorted(tfidf_VocList, key=itemgetter(1),reverse=True)
    tfidf_VocList = sorted(tfidf_VocDict.items(), key=lambda x: x[1]['importance'],reverse=True)
    return tfidf_VocList

# ========================================================================
# Create_Concept_Tfidf_Matrix 
# => Generate tfidf_Maxtrix then return
#       e.g.[[vector1],[vector2].....[vector n]]
# each vector correspond to one concept
#       e.g(concept1 => vector1 , concept2 => vector2)
# each vector : tf-idf for k videos 
#       e.g.[value1,value2,value3,.....,value k]
# ========================================================================
def Create_Concept_Tfidf_Matrix(voc_list,word_freq_dict,voc_appear_dict,NumOfWord_videodict):
    x = []
    scnt = 0
    NumOfVideos = len(word_freq_dict) 
    for voc,cnt in voc_list:
        scnt = scnt +1
        l = []
        for videoid in  sorted(word_freq_dict):
            word_dict = dict(word_freq_dict[videoid])
            NumOfWord_inVideo = NumOfWord_videodict[videoid]
            if voc in word_dict:
                tf = float(word_dict[voc])/ NumOfWord_inVideo
                val = float(NumOfVideos)/len(voc_appear_dict[voc])
                idf = math.log10(val)
                l.append(tf*idf)
                # print("tmp ",voc,(word_dict[voc]),NumOfWord_inVideo,NumOfVideos,len(voc_appear_dict[voc]))
            else:#tf = 0
                l.append(0)
        x.append(l)
    # print(x) # x is tf-idf matrix 
    return x 


def Print_Video_Coverage(TOP_N_CONCEPT,voc_list,voc_appear_dict):
    vlists=[]
    voc_list = voc_list[:TOP_N_CONCEPT]
    for (voc,score) in voc_list:
        for vid in voc_appear_dict[voc]:
            if(vid not in vlists):
                vlists.append(vid)
    print("video coverage:",len(vlists),vlists)
    


def Create(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,title_text,NumOfWord_videodict,voclist_SelectMethod):
    tfidf_matrix = Create_Concept_Tfidf_Matrix(voc_list,word_freq_dict,voc_appear_dict,NumOfWord_videodict)
    
    #### change voc list's value by different method ####
    voc_list_with_MaxTfidf = GetMaxTfidf(voc_list,tfidf_matrix)
    # voc_list_with_AvgTfidf = GetAvgTfidf(voc_list,tfidf_matrix)
    # Print_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,TOP_N_CONCEPT)
    
    
    ### Try Different Weight ###
    # try_list = [[0.9,0.1,0,0],[0.8,0.2,0,0],[0.5,0.5,0,0],[0.2,0.6,0.2,0],[0.2,0.65,0.55,0.1]] # the last one is the setting
    # try_list = [[0.9,0.1,0,0,0],[0.8,0.2,0,0,0],[0.5,0.5,0,0,0],[0.2,0.6,0.2,0,0],[0.2,0.6,0.25,0.35,0.45]] # the last one is the setting
    try_list = [[0.2,0.6,0.25,0.40,0.45]] #[0.2,0.6,0.25,0.40,0.45]!!
    for (w1,w2,w3,w4,w5) in try_list:
        tfidf_VocList = Combine_different_voc_list(word_freq_dict,voc_appear_dict,voc_list,voc_list_with_MaxTfidf,title_text,0,w1,w2,w3,w4,w5)
        print("====Check combine by (w1,w2) = (",w1," ,",w2,",",w3,",",w4,",",w5,")====")
        Print_Video_Coverage(TOP_N_CONCEPT,voc_list,voc_appear_dict)
        Print_different_voc_list2(voc_list,tfidf_VocList,TOP_N_CONCEPT)

    return tfidf_VocList
