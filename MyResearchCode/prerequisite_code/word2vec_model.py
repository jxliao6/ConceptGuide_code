from gensim.models import word2vec
from gensim import models
#from gensim.models.keyedvectors import KeyedVectors
import gensim
import logging
import nltk
import numpy as np
from scipy import spatial
import json

# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
# model = models.Word2Vec.load('wiki.en.text.model')

def vector_of_word(string,model):
    if string in model:
        return model.wv[string]
    else:
        tokens = nltk.word_tokenize(string)
        sum_vec = [0]*200
        for tok in tokens:
            if tok in model:
                sum_vec = sum_vec + model.wv[tok]
        return sum_vec

def cosine_similarity(string1,string2,model):
    vec1 = vector_of_word(string1,model)
    vec2 = vector_of_word(string2,model)
    res = 1 - spatial.distance.cosine(vec1, vec2)
    if np.isnan(res):
        return 0
    else : 
        return res
       
# def Print_Sim_Of_Conceptpair(select_N,voc_list,model):
#     #voc_N = len(voc_list)
#     voc_N = select_N
#     for i in range(voc_N):
#         for j in range(voc_N):
#             print(" (",voc_list[i][0],",",voc_list[j][0],") : ",cosine_similarity(voc_list[i][0],voc_list[j][0],model))


def Select_Similar_ConceptPairs(select_N,voc_list,model,threshold):
    # select the concept pair that: 1. similarity>threshold ,2. remove(a,b) if (a,b) exist
    Prob_ConceptPairs={}
    voc_N = select_N
    # video_N = len(word_freq_dict)
    for i in range(voc_N):
        for j in range(voc_N):
            pair_similarity = cosine_similarity(voc_list[i][0],voc_list[j][0],model)
            if (pair_similarity > threshold):
                if((voc_list[j][0],voc_list[i][0]) not in Prob_ConceptPairs) and(voc_list[i][0]!=voc_list[j][0]):
                    Prob_ConceptPairs[(voc_list[i][0],voc_list[j][0])] = pair_similarity
            # print(Count_Common_videos(voc_appear_dict,voc_list[i][0],voc_list[j][0]),"|  (",voc_list[i][0],",",voc_list[j][0],") : ",similarities_sparse[i,j])
    return Prob_ConceptPairs

#main1:calculate every concept pair (input:every concept pairs) then return Prob_ConceptPairs&f2
def main(voc_list,model,similarity_threshold):
    TOP_N_CONCEPT = 30
    # similarity_threshold =-111
    # Print_Sim_Of_Conceptpair(TOP_N_CONCEPT,voc_list,model)
    Prob_ConceptPairs = Select_Similar_ConceptPairs(TOP_N_CONCEPT,voc_list,model,similarity_threshold)
    return Prob_ConceptPairs

#main2:calculate Prob_ConceptPair(input:Prob_ConceptPair) then return f2
def main2(Prob_ConceptPairs,model):
    # f1=[]
    Prob_ConceptPair2={}
    for item in Prob_ConceptPairs:
        (a,b)=item
        pair_similarity = cosine_similarity(a,b,model)
        Prob_ConceptPair2[item]={"similarity":Prob_ConceptPairs[item],"f1":pair_similarity}
        # f1.append(pair_similarity)
    # return 
    return Prob_ConceptPair2