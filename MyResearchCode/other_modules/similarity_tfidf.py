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
def cosine_sim(feature_matrix):
    #A =  np.array([[0, 1, 0, 0, 1], [0, 0, 1, 1, 1],[1, 1, 0, 1, 0]])
    A =  np.array(feature_matrix)
    A_sparse = sparse.csr_matrix(A)

    similarities = cosine_similarity(A_sparse)
    #print('pairwise dense output:\n {}\n'.format(similarities))

    #also can output sparse matrices
    similarities_sparse = cosine_similarity(A_sparse,dense_output=False)
    # print('pairwise sparse output:\n {}\n'.format(similarities_sparse))
    #print(similarities_sparse[0,1])
    ## print result
    
    return similarities_sparse

def Count_Common_videos(voc_appear_dict,voc1,voc2):
    list1 = voc_appear_dict[voc1]
    list2 = voc_appear_dict[voc2]
    common_list = set(list1)&set(list2)
    #print(common_list)
    return len(common_list)

def convert_to_json_type1(select_N,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse):
    f = open("vis_json/type1.json","w")
    l1 = []
    dic = {}
    voc_N = select_N
    # node
    for i in range(voc_N):
        dic = {"name":voc_list[i][0],"group":1}
        l1.append(dic) 
    # links
    l2 = []
    for i in range(voc_N):
        for j in range(voc_N):
            # print("(",i,",",j,") : ",similarities_sparse[i,j])
            dic =  {'source':i,'target':j,'weight':similarities_sparse[i,j]}
            if(similarities_sparse[i,j]>=0):
                l2.append(dic)
    json.dump({"nodes":l1,"links":l2},f,indent=4, sort_keys=True)
            
def Print_csr_matrix_index(select_N,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse):
    #voc_N = len(voc_list)
    voc_N = select_N
    video_N = len(word_freq_dict)
    for i in range(voc_N):
        for j in range(voc_N):
            print("(",i,",",j,") : ",similarities_sparse[i,j])

def PrintSetWithScore(the_set,v_list):
    new_list=[]
    v_dict = dict(v_list)
    for voc in the_set:
        score = v_dict[voc]
        new_list.append((voc,score))
    new_list = sorted(new_list, key=itemgetter(1),reverse=True)
    pprint(new_list)
   
# =============================================================================
# Print voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf
# =============================================================================
def Print_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,TOP_N_CONCEPT):
    print("\n\nvoc_list")
    pprint(voc_list[:TOP_N_CONCEPT])
    print("\n\nvoc_list_with_MaxTfidf")
    pprint(voc_list_with_MaxTfidf[:TOP_N_CONCEPT])
    print("\n\nvoc_list_with_AvgTfidf")
    pprint(voc_list_with_AvgTfidf[:TOP_N_CONCEPT])
    
    print("\n\n diffenece between 3 lists")
    set1 = set([voc for (voc,val) in voc_list[:TOP_N_CONCEPT]])
    set2 = set([voc for (voc,val) in voc_list_with_MaxTfidf[:TOP_N_CONCEPT]])
    set3 = set([voc for (voc,val) in voc_list_with_AvgTfidf[:TOP_N_CONCEPT]])
    CommonSet = set1 & set2 & set3
    print("\n\ncommon")
    pprint(CommonSet)
    print("\n\nwords only in voc_list")
    PrintSetWithScore(set1-CommonSet,voc_list)# pprint.pprint(set1-CommonSet)
    print("\n\nwords only in voc_list_with_MaxTfidf")
    PrintSetWithScore(set2-CommonSet,voc_list_with_MaxTfidf)# pprint.pprint(set2-CommonSet)
    print("\n\nwords only in voc_list_with_AvgTfidf")
    PrintSetWithScore(set3-CommonSet,voc_list_with_AvgTfidf)# pprint.pprint(set3-CommonSet)


# =============================================================================
# Process tfidf_Maxtrix
#  => return new voc_list
#       but this time , every element(voc,cnt) in list
#       cnt will be "max_tfidf","avg_tfidf"
# - max_tfidf : 
#    e.g. refer to similarities_sparse , 
#         concept1 would be max/avg value in vector1
# =============================================================================
def GetMaxTfidf(voc_list,similarities_sparse):
    tfidf_list = []
    for vector in similarities_sparse:
        tfidf_list.append(max(vector))
    new_voc_list = []
    i = 0
    for (voc,cnt) in voc_list:
        new_voc_list.append((voc,tfidf_list[i]))
        i = i + 1
    new_voc_list = sorted(new_voc_list, key=itemgetter(1),reverse=True)
    return new_voc_list
        


def GetAvgTfidf(voc_list,similarities_sparse):
    tfidf_list = []
    for vector in similarities_sparse:
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
def Combine_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,voclist_SelectMethod):
    voc_dict = dict(voc_list)
    voc_dict_with_MaxTfidf = dict(voc_list_with_MaxTfidf)
    voc_dict_with_AvgTfidf = dict(voc_list_with_AvgTfidf)
    new_voc_list = []
    print("check max:",(voc_list[0][1]),(voc_list_with_MaxTfidf[0][1]))
    if(voclist_SelectMethod==0): # combine
        for (voc,cnt) in voc_list:
            print("test",voc,voc_dict[voc]/(voc_list[0][1]) ,voc_dict_with_MaxTfidf[voc]/(voc_list_with_MaxTfidf[0][1]))
            score = 0.1* voc_dict[voc]/(voc_list[0][1]) + 0.9* voc_dict_with_MaxTfidf[voc]/(voc_list_with_MaxTfidf[0][1])
            new_voc_list.append((voc,score))

    elif (voclist_SelectMethod == 1):
        new_voc_list = voc_list    
    elif (voclist_SelectMethod == 2):
        new_voc_list = voc_list_with_MaxTfidf
    elif (voclist_SelectMethod == 3):
        new_voc_list = voc_list_with_AvgTfidf
    return new_voc_list
# =============================================================================
# Select_ProbConceptPairs
# => return probable concept pairs if the cosine_similarity> threshlod
# =============================================================================
def Select_ProbConceptPairs(select_N,voc_list,voc_appear_dict,similarities_sparse,threshold):
    # select the concept pair that: 1. similarity>threshold ,2. remove(a,b) if (a,b) exist
    Prob_ConceptPairs={}
    voc_N = select_N
    # video_N = len(word_freq_dict)
    for i in range(voc_N):
        for j in range(voc_N):
            if(similarities_sparse[i,j])>threshold:
                if((voc_list[j][0],voc_list[i][0]) not in Prob_ConceptPairs) and(voc_list[i][0]!=voc_list[j][0]):
                    Prob_ConceptPairs[(voc_list[i][0],voc_list[j][0])] = similarities_sparse[i,j]
            # print(Count_Common_videos(voc_appear_dict,voc_list[i][0],voc_list[j][0]),"|  (",voc_list[i][0],",",voc_list[j][0],") : ",similarities_sparse[i,j])
    return Prob_ConceptPairs

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
    print("NumOfVideos",NumOfVideos)
    for videoid in sorted(word_freq_dict):
        print(videoid)
    for voc,cnt in voc_list:
        scnt = scnt +1
        l = []
        for videoid in  sorted(word_freq_dict):
            word_dict = dict(word_freq_dict[videoid])
            NumOfWord_inVideo = NumOfWord_videodict[videoid]
            if voc in word_dict:
                tf = float(word_dict[voc])/ NumOfWord_inVideo
                val = float(NumOfVideos/len(voc_appear_dict[voc]))
                idf = math.log10(val)
                l.append(tf*idf)
            else:#tf = 0
                l.append(0)
        x.append(l)
    print(x) # x is tf-idf matrix 
    return x 





def Get_EveryPairs_Similarity(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,NumOfWord_videodict,similarity_threshold,voclist_SelectMethod):
    tfidf_matrix = Create_Concept_Tfidf_Matrix(voc_list,word_freq_dict,voc_appear_dict,NumOfWord_videodict)
    

    #### change voc list's value by different metho ####
    voc_list_with_MaxTfidf = GetMaxTfidf(voc_list,tfidf_matrix)
    voc_list_with_AvgTfidf = GetAvgTfidf(voc_list,tfidf_matrix)
    Print_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,TOP_N_CONCEPT)
    voc_list = Combine_different_voc_list(voc_list,voc_list_with_MaxTfidf,voc_list_with_AvgTfidf,0)
    
    
    print("\nselect 30 top combination_score\n")  
    pprint(voc_list[:TOP_N_CONCEPT])


    X = similarity.Create_Concept_Feature_Matrix(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict)
    similarities_sparse = similarity.cosine_sim(X)
    
    return [voc_list,similarities_sparse]
