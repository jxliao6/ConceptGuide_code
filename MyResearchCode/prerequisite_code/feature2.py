import pprint
from scipy import spatial
import numpy as np
import nltk
from datetime import datetime

## feature2  (Video Reference Distance  )###
def calculate_f2(Prob_ConceptPairs,voc_list,word_freq_dict,voc_appear_dict,model):
    ## Vrw_dict
    Vrw_dict={}
    for (a,cnt1) in voc_list:
        for (b,cnt2) in voc_list:
            # Calculate Vrw(a,b)
            fa_sum = 0
            up_value = 0
            for vid in word_freq_dict: # for each video
                l = word_freq_dict[vid]
                get_a = [item[1] for item in l if item[0] == a]
                if len(get_a)!=0:
                    fa = get_a[0]
                    fa_sum = fa_sum + fa
                    if len([item for item in l if item[0] == b])!=0: 
                        rb = 1
                    else:
                        rb = 0
                else : 
                    fa = 0
                    rb = 0
                up_value = up_value + fa*rb
            # print("check","(",a,",,",b,fa,rb,fa_sum)
            key = (a,b)
            Vrw_dict[key] = float(up_value)/fa_sum
    
    print("Vrw_dict:")
    for item in Vrw_dict:
        if(Vrw_dict[item]!=0):
            print(item,Vrw_dict[item])

    # f2=[]
    for item in Prob_ConceptPairs:
        #calculate(Vrd)
        (a,b) = item
        f2_value = Vrw_dict[(b,a)] - Vrw_dict[(a,b)]
        Prob_ConceptPairs[item]["f2"] = f2_value
        # f2.append(f2_value)
    print("finish f2_no_generalized",str(datetime.now()))



    #generalized      
    # GVrw_dict = {}
    # for (a,cnt1) in voc_list:
    #     for (b,cnt2) in voc_list:
    #         # print(model.most_similar(a),'\n\n')
    #         value = Vrw_dict[(a,b)]##!!
    #         w_sum = 0
    #         if a in model:#can be normalized
    #             for (ai,w) in model.most_similar(a):
    #                 # remove 's'
    #                 if ai[len(ai)-1]=='s':
    #                     ai = ai[:len(ai)-1]
    #                 if((ai,b) in Vrw_dict):
    #                     if Vrw_dict[(ai,b)]!=0:
    #                         w = cosine_similarity(ai,b,model)
    #                         w_sum = w_sum+w
    #                         value = value + Vrw_dict[(ai,b)]* w
    #         value = float(value)/(1+w_sum)    
    #         GVrw_dict[(a,b)] = value

    # g_f2=[]
    for item in Prob_ConceptPairs:
        (a,b)=item
        # f2_val = GVrw_dict[(b,a)] - GVrw_dict[(a,b)]
        val1 = GVrw(b,a,Vrw_dict,model)
        val2 = GVrw(a,b,Vrw_dict,model)
        f2_val = val1 - val2
        # print("a,b=",a,b,val1,val2)
        # g_f2.append(f2_val)
        Prob_ConceptPairs[item]["g_f2"] = f2_val
    # return [f2,g_f2]
    return (Prob_ConceptPairs)
    




##other functions
def GVrw(a,b,Vrw_dict,model):
    value = Vrw_dict[(a,b)]##!!
    w_sum = 0
    if a in model:#can be normalized
        for (ai,w) in model.most_similar(a):
            # remove 's'
            if ai[len(ai)-1]=='s':
                ai = ai[:len(ai)-1]
            if((ai,b) in Vrw_dict):
                if Vrw_dict[(ai,b)]!=0:
                    w = cosine_similarity(ai,b,model)
                    w_sum = w_sum+w
                    value = value + Vrw_dict[(ai,b)]* w
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