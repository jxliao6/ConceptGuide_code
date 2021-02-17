from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import numpy as np
import json
import pprint

def cosine_sim(feature_matrix):
    #A =  np.array([[0, 1, 0, 0, 1], [0, 0, 1, 1, 1],[1, 1, 0, 1, 0]])
    A =  np.array(feature_matrix)
    A_sparse = sparse.lil_matrix(A)

    similarities = cosine_similarity(A_sparse)
    #print('pairwise dense output:\n {}\n'.format(similarities))

    #also can output sparse matrices
    similarities_sparse = cosine_similarity(A_sparse,dense_output=False)
    #print('pairwise sparse output:\n {}\n'.format(similarities_sparse))
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

# def Print_csr_matrix_concept(select_N,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse):
#     #voc_N = len(voc_list)
#     probable
#     voc_N = select_N
#     video_N = len(word_freq_dict)
#     for i in range(voc_N):
#         for j in range(voc_N):
#             print(Count_Common_videos(voc_appear_dict,voc_list[i][0],voc_list[j][0]),"|  (",voc_list[i][0],",",voc_list[j][0],") : ",similarities_sparse[i,j])
def Decide_similarity_threshold(voc_N,voc_list,similarities_sparse):
    sim_list=[]
    for i in range(voc_N):
        for j in range(voc_N):
            if (voc_list[i][0]!=voc_list[j][0]):
                sim_list.append(similarities_sparse[i,j])
    sim_list = sorted(sim_list)
    print("Quartile:",np.percentile(sim_list, [85,86,87,88,90]))
    return np.percentile(sim_list, 85) #87

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


def Create_Concept_Feature_Matrix(select_N,voc_list,word_freq_dict,voc_appear_dict):
    x = []
    for (voc,detail) in voc_list[:select_N]:
        l = []
        for videoid in word_freq_dict:
            if videoid in voc_appear_dict[voc]:
                l.append(1)
            else:
                l.append(0)
        x.append(l)
    print(x)
    return x 

def Combine_With_WikiRelations(vlist,similarities_sparse,WikiRelations):
    new_similarities_sparse = similarities_sparse
    for i in range(len(vlist)):
        for j in range(len(vlist)):
            word1 = vlist[i][0]
            word2 = vlist[j][0]
            print("(",i,",",j,") : ",word1,word2,similarities_sparse[i,j],WikiRelations[(word1,word2)], WikiRelations[(word2,word1)])
            # new_similarities_sparse[i,j] = 1*similarities_sparse[i,j]+0*(WikiRelations[(word1,word2)]+WikiRelations[(word2,word1)])
            new_similarities_sparse[i,j] = 0.5*similarities_sparse[i,j]+0.25*(WikiRelations[(word1,word2)]+WikiRelations[(word2,word1)])
    return new_similarities_sparse

def Get_EveryPairs_Similarity(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict):
    # TOP_N_CONCEPT = len(voc_list) if len(voc_list)<30 else 30 # TOP_N_CONCEPT = 30
    X = Create_Concept_Feature_Matrix(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict)
    similarities_sparse = cosine_sim(X)
    #Print_csr_matrix_index(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse)
    # Print_csr_matrix_concept(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse)
    # Prob_ConceptPairs = Select_Similar_ConceptPairs(TOP_N_CONCEPT,voc_list,voc_appear_dict,similarities_sparse,similarity_threshold)
    # convert_to_json_type1(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,similarities_sparse)
    return similarities_sparse
