import pprint
from scipy import spatial
import numpy as np
import nltk
from datetime import datetime

## feature2  (Video Reference Distance  )###
def calculate_f2(Prob_ConceptPairs,voc_list,word_freq_dict,voc_appear_dict,model):
    
    f2=[]
    # for (a,b) in Prob_ConceptPairs:
    #     #calculate(Vrd)
    #     f2.append(Vrw(b,a,word_freq_dict) - Vrw(a,b,word_freq_dict))
    # print("finish f2_no_generalized",str(datetime.now()))

    g_f2=[]
    for (a,b) in Prob_ConceptPairs:
        # f2_val = GVrw_dict[(b,a)] - GVrw_dict[(a,b)]
        val1 = GVrw(b,a,model,word_freq_dict)
        val2 = GVrw(a,b,model,word_freq_dict)
        f2_val = val1 - val2
        print("a,b=",a,b,val1,val2)
        g_f2.append(f2_val)
    return [f2,g_f2]

    




##other functions
def Vrw(a,b,word_freq_dict):
    fa_sum = 0
    for vid in word_freq_dict: # for each video
        l = word_freq_dict[vid]
        if len([item[1] for item in l if item[0] == a])!=0:
            fa = [item[1] for item in l if item[0] == a][0]
            fa_sum = fa_sum + fa
            if len([item for item in l if item[0] == b])!=0: 
                rb = 1
            else:
                rb = 0
        else : 
            fa = 0
            rb = 0
    if (fa_sum==0):
        return 0
    else:
        return (float(fa*rb)/fa_sum)

def GVrw(a,b,model,word_freq_dict):
    value = Vrw(a,b,word_freq_dict)##!!
    w_sum = 0
    if a in model:#can be normalized
        for (ai,w) in model.most_similar(a):
            # remove 's'
            if ai[len(ai)-1]=='s':
                ai = ai[:len(ai)-1]
                if Vrw(ai,b,word_freq_dict)!=0:
                    w = cosine_similarity(ai,b,model)
                    w_sum = w_sum+w
                    value = value + Vrw(ai,b,word_freq_dict)* w
    value = float(value)/(1+w_sum)    
    return value


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