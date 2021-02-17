################################################################
# do any caption_analyze
#   1. classify then decide which set of wiki_list to use
#   2. extract concept words from corresponding wiki_list
#   3. save all the result that print to the screen
#       =>"result/"+keyword+"_"+result_num+"_result.txt"

## variable ##
#   1. word_freq_dict(a dictionary) : key :'video_id','wlist'
#           - wlist (a list of tuple): [('word1',cnt1),('word2',cnt2),...]
#           - e.g.{'videoid1': wlist1,'videoid2': wlist2}
#   2. voc_appear_dict (a dictionary) : which videos did every voc appear
#           - e.g.{'functions': ['BrVZZZkkGGI', 'FNZ5o9S9prU', 'DuDz6B4cqVc'],'':}
#
#   3. voc_list: a list of tuple(word,cnt)
#           -e.g.[('node', 117), ('list', 114),.....]
#   4. NumOfWord_videodict: a dictionary
#           - key: videoid
#           - e.g.{'videoid1':2 , 'videoid2':4, .....}

## linguistic features ##
#   1. polarity
#   2. objectivity
#   3. occurrence of hedge words
#
#   5. pausality, redundancy, emotivenes
#################################################################
import pickle
import sys
from other_modules import similarity,output,similarity_tfidf,tfidf_VocList,auto_KeywordExtraction, text_preprocess, keywords,ExtractWordsFromVideos
from prerequisite_code import word2vec_model,feature2,feature2_2,feature3,feature4
from datetime import datetime
from pprint import pprint
import json
##word2vec model
from gensim.models import word2vec
from gensim import models
import gensim
import logging
from nltk.stem import WordNetLemmatizer



wiki_category_path = "wiki_classification_result.pkl" 
print(str(datetime.now()))
start_time = datetime.now()


if __name__ == '__main__':

    ####  related information, load data ,save print result ####

    if len(sys.argv) < 2:
        print("please enter : python caption_anlyze_debater.py <keyword> <num>")
        sys.exit()
    keyword = str(sys.argv[1]).replace(' ', '_')
    result_num = sys.argv[2]
    #keyword = "blockchain"
    #    result_num = "50"
    filepath = "debater/debater_data/"+keyword+"_texts.pkl"
    with open(filepath, 'rb') as f:
        videos = pickle.load(f)
    sys.stdout = open("debater/debater_result_plain/"+keyword+"_result.txt", "w",encoding="utf-8")#!encoding delete

    ####  load wiki words  ####
    with open('category_to_wordlist.pkl', 'rb')as f:
        mapp = pickle.load(f)
    for item in mapp:
        print(item, ":", len(mapp[item]))


    ### get RAKE keywords from transcript , and get video's tag  as keyword 
    all_text = {}
    tagKeywords = []
    title_text = ""
    for item in videos:
        line = text_preprocess.Sentence(item['transcript'])
        all_text[item['videoid']]=line
        #tagKeywords.extend(item['tags'])
        #title_text = title_text +" "+ text_preprocess.Sentence(item['title'])
    RAKEKeywords = auto_KeywordExtraction.GetKeywords(all_text,title_text)
    print("Rake keywords:")
    pprint(RAKEKeywords)
    #print("tagKeywords:",tagKeywords)

    # print("title_text:",title_text)
    # auto_KeywordExtraction.Extract(all_text,autoKeywords)

    ##### extract words from corresponding wordset #####
    [word_freq_dict,NumOfWord_videodict,voc_list] = ExtractWordsFromVideos.Extract(videos,all_text,mapp,RAKEKeywords,tagKeywords)
    
    ##### Combine the phrases if they are the same word after lemmatization #####
    print("startcombine",str(datetime.now()))
    [voc_list,word_freq_dict]= ExtractWordsFromVideos.IntegrateSameWords_AfterLemmatize(voc_list,word_freq_dict)
    # voc_list = ExtractWordsFromVideos.removeSubstring(voc_list)
    print("startcombine",str(datetime.now()))
    
    ##### create "voc_appear_dict" #####
    voc_appear_dict = ExtractWordsFromVideos.CreateVocAppearDict(voc_list,word_freq_dict)
    ExtractWordsFromVideos.PrintExtractResult(videos,voc_list,word_freq_dict,voc_appear_dict)
    

    # setting parameters
    # similarity_threshold = 0.5 #0.4
    TOP_N_CONCEPT = len(voc_list) if len(voc_list)<30 else 30
    voclist_SelectMethod = 0 # 1: term_frequency/2: max/3:average 

    # print("  \n\n\n\nConcept similarity ===============  ")
    # # Prob_ConceptPairs:Those Conecept Pair that Similarity>thresold =>Probable has prerequisite relationship
    # similarities_sparse = similarity.Get_EveryPairs_Similarity(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,similarity_threshold)
    # Prob_ConceptPairs = similarity.Select_ProbConceptPairs(TOP_N_CONCEPT,voc_list,voc_appear_dict,similarities_sparse,similarity_threshold)
    # print("size of Prob_ConceptPairs",len(Prob_ConceptPairs))
    # pprint(Prob_ConceptPairs)


    # generate VOCList by concept Importance score then Ranking
    tfidf_VocList = tfidf_VocList.Create(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,title_text,NumOfWord_videodict,voclist_SelectMethod)
    print("tfidf_VocList")
    # TOP_N_CONCEPT = len(tfidf_VocList) if len(tfidf_VocList)<30 else 30
    pprint(tfidf_VocList)
    tfidf_VocList = keywords.removeSubstring(tfidf_VocList,TOP_N_CONCEPT)
    # tfidf_VocList = keywords.removeSubstring2(tfidf_VocList,TOP_N_CONCEPT)

    # print(BREAK)
    print(" \n\n\n\nConcept similarity(with tf-idf) ===============")
    # check wiki relations
    WikiPageRecords = feature3.Create_WikiPageRecords(tfidf_VocList[:TOP_N_CONCEPT])
    WikiRelations = feature3.CheckExist_InEachWiki(tfidf_VocList[:TOP_N_CONCEPT],WikiPageRecords)
    similarities_sparse = similarity.Get_EveryPairs_Similarity(TOP_N_CONCEPT,tfidf_VocList,word_freq_dict,voc_appear_dict)
    similarities_sparse = similarity.Combine_With_WikiRelations(tfidf_VocList[:TOP_N_CONCEPT],similarities_sparse,WikiRelations)
    similarity_threshold = similarity.Decide_similarity_threshold(TOP_N_CONCEPT,tfidf_VocList,similarities_sparse)
    Prob_ConceptPairs = similarity.Select_ProbConceptPairs(TOP_N_CONCEPT,tfidf_VocList,voc_appear_dict,similarities_sparse,similarity_threshold)
    
    # Print(if no prerequisite)
    print("calculate similarity cost:",float((datetime.now() -start_time).seconds)/60,"minutes")

    # [voc_list,similarities_sparse] = similarity_tfidf.Get_EveryPairs_Similarity(TOP_N_CONCEPT,voc_list,word_freq_dict,voc_appear_dict,NumOfWord_videodict,similarity_threshold,voclist_SelectMethod)
    # Prob_ConceptPairs = similarity_tfidf.Select_ProbConceptPairs(TOP_N_CONCEPT,voc_list,voc_appear_dict,similarities_sparse,similarity_threshold)
    print("size of Prob_ConceptPairs",len(Prob_ConceptPairs))
    pprint(Prob_ConceptPairs)
    
    

    ###!
    print("  \n\n\n\nPrerequisite f1 (Word2Vec similarity) ===============  ")
    # logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
    model = models.Word2Vec.load('wiki.en.text.model')
    Prob_ConceptPairs = word2vec_model.main2(Prob_ConceptPairs,model)
    # Prob_ConceptPairs2 = word2vec_model.main(voc_list,model,-111)
    # print(len(Prob_ConceptPairs2))
    
    ###prerequisite###
    print("  \n\n\n\nPrerequisite f2 ===============  ")
    Prob_ConceptPairs = feature2.calculate_f2(Prob_ConceptPairs,voc_list,word_freq_dict,voc_appear_dict,model)
    print(str(datetime.now()))
    # pprint(Prob_ConceptPairs)

    print("  \n\n\n\nPrerequisite f3 ===============  ")
    Prob_ConceptPairs = feature3.calculate_f3(Prob_ConceptPairs,model)
    print(str(datetime.now()))
    
    print("  \n\n\n\nPrerequisite f4 ===============  ")
    f4 = feature4.calculate_f4(Prob_ConceptPairs,voc_appear_dict,word_freq_dict,model)
    print(str(datetime.now()))
    pprint(Prob_ConceptPairs)

    
    ## Print Result
    print('%-50s'%"ConceptPairs",'%-12s'%"similarity",'%-12s'%"f1",'%-12s'%"f2",'%-12s'%"f2_gen",'%-12s'%"f3",'%-12s'%"f4")
    for item in Prob_ConceptPairs:
        (a,b)=item
        print('( %-20s'%a,",",'%-20s )  '%b,'%-10.5f'%Prob_ConceptPairs[item]['similarity'],",",'%-10.5f'%Prob_ConceptPairs[item]['f1'],",",'%-10.5f'%Prob_ConceptPairs[item]['f2'],",",'%-10.5f'%Prob_ConceptPairs[item]['g_f2'],",",'%-10.5f'%Prob_ConceptPairs[item]['f3'],",",'%-10.5f'%Prob_ConceptPairs[item]['f4'])


    #print cost time
    end_time = datetime.now()
    time_delta = float((end_time -start_time).seconds)/60
    print(str(end_time))
    print(time_delta,"minutes")
    

    ## save in json file
    # ,Prob_ConceptPairs,f1,f2,g_f2,f3,fˋ,similarity_threshold,time_delta
    key = str(keyword)+"_"+str(result_num)
    data = {}
    data[key]={'voc_list':tfidf_VocList,'voc_appear_dict':voc_appear_dict ,'word_freq_dict':word_freq_dict,'similarities_sparse':similarities_sparse,'pairs':Prob_ConceptPairs,'similarity_threshold':similarity_threshold,'time_delta':time_delta,'voclist_SelectMethod':voclist_SelectMethod}
    
    #with open("debater_result/analyze_result.pkl", "rb") as pkl_file:
    #    data = pickle.load(pkl_file)
    #    pkl_file.close()
    #if key in data:
    #    del data[key]
    #data[key]={'voc_list':tfidf_VocList,'voc_appear_dict':voc_appear_dict,'word_freq_dict':word_freq_dict,'similarities_sparse':similarities_sparse,'pairs':Prob_ConceptPairs,'similarity_threshold':similarity_threshold,'time_delta':time_delta,'voclist_SelectMethod':voclist_SelectMethod}
    
  
    
    print("finish_anyalyze ,now",data.keys())

    with open("debater/debater_result/analyze_result.pkl", "wb") as pkl_file:
        pickle.dump(data,pkl_file)
        pkl_file.close()
