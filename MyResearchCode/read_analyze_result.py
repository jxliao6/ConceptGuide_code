# read particular keyword anaylze result 
# generate this search result json file
import pickle
from pprint import pprint
import sys
from other_modules  import  json_format,video_sequence

sys.stdout = open("read_pkl.txt", "w",encoding="utf-8")#!encoding delete


def weighted_sum_features(element):

    # weight_vec = [1,1,1,1]
    # weight_vec = [1.4,2.5,1.5,7.4]
    weight_vec = [1,3,1,3]
    Prob_ConceptPairs = element["pairs"]
    answer={}
    for item in Prob_ConceptPairs: # for i in range(len(Prob_ConceptPairs)):
        value = (Prob_ConceptPairs[item]["f1"] * weight_vec[0])+ (Prob_ConceptPairs[item]["g_f2"] * weight_vec[1])+ (Prob_ConceptPairs[item]["f3"]* weight_vec[2]) + (Prob_ConceptPairs[item]["f4"]* weight_vec[3])
        # answer.append(value)
        Prob_ConceptPairs[item]["prerequisite"] = value
    # pprint.pprint(Prob_ConceptPairs)
    element["pairs"] = Prob_ConceptPairs
    return element


def Format_Print(element):
    Prob_ConceptPairs = element["pairs"]
    print('%-50s'%"ConceptPairs",'%-12s'%"similarity",'%-12s'%"f1",'%-12s'%"f2",'%-12s'%"g_f2",'%-12s'%"f3",'%-12s'%"f4","weighted_sum")
    for item in Prob_ConceptPairs:
        (a,b)=item
        print('( %-20s'%a,",",'%-20s )  '%b,'%-10.5f'%Prob_ConceptPairs[item]['similarity'],",",'%-10.5f'%Prob_ConceptPairs[item]['f1'],",",'%-10.5f'%Prob_ConceptPairs[item]['f2'],",",'%-10.5f'%Prob_ConceptPairs[item]['g_f2'],",",'%-10.5f'%Prob_ConceptPairs[item]['f3'],",",'%-10.5f'%Prob_ConceptPairs[item]['f4'],",",Prob_ConceptPairs[item]['prerequisite'])
        


def adjust_SimilarityThreshold(links,newthreshold):
    newlinks = []
    for link in links:
        if(link["similarity"]<newthreshold):
            link["prerequisite"] = None
        newlinks.append(link)
    return newlinks


if __name__ == '__main__':

    # setting
    # newthreshold = 0.7

    # what keywords we want to see 
    keyword = str(sys.argv[1]).replace(' ', '_')
    result_num = sys.argv[2]
    key = str(keyword)+"_"+str(result_num)
    print(key)
    
    ### read from video_info
    filepath = "datafile/"+keyword+"_"+result_num+"_videos_info.pkl"
    with open(filepath, 'rb')as f:
        videos = pickle.load(f)
    print(videos[0].keys())
    
    
    ### read from anaylze_result.pkl
    with open("result/analyze_result.pkl", "rb") as pkl_file:
        data = pickle.load(pkl_file)
    print("We have already search:",data.keys())
    # print(type(data[key]["f1"]))
    # pprint.pprint(data)
    print(data[key].keys())
    

    #weighted sum 
    element = weighted_sum_features(data[key])
    data[key] = element
    Format_Print(data[key])
    

    #generate json file
    # json_format.convert_to_json_VisType1(30,data[key]['voc_list'],data[key]['similarities_sparse'])
    TOP_N_CONCEPT = 30 if (len(data[key]["voc_list"])>=30) else len(data[key]["voc_list"])
    search_info = {"key":key,"NumOfVideos":len(data[key]["word_freq_dict"]),"similarity_threshold":data[key]["similarity_threshold"],"voclist_SelectMethod":data[key]["voclist_SelectMethod"],"time_delta":data[key]["time_delta"]}
    videos = json_format.video_info(data[key]["word_freq_dict"],videos)
    concept_relationship = json_format.concept_relationship(TOP_N_CONCEPT,data[key])
    

     #Adjust similarity threshold 
    # newlinks = adjust_SimilarityThreshold(concept_relationship["links"],newthreshold = 0.6)
    # concept_relationship["links"] = newlinks
    
    # Add "# concept words" information in videos_id
    concept_relationship = json_format.add_NumOfConceptWords(concept_relationship,videos)
    
    #combine sentiment and videos info as "user feedback score"
    videos = json_format.Process_UserFeedback(videos)

    # Generate Learning path
    [BFSresult,EdgesOfNode,ConceptSequence,video_sequences,RemovedEdgesOfNode,VideoSequence_ConceptInfo] = video_sequence.GenerateLearningPath(concept_relationship["links"],concept_relationship["nodes"],videos)

    
    # Prune concept_videosid when there are too much videos of concept
    concept_relationship["nodes"] = json_format.PruneVideos(concept_relationship["nodes"])
    
    json_format.generate_jsonfile(key,search_info,videos,concept_relationship,BFSresult,EdgesOfNode,RemovedEdgesOfNode,ConceptSequence,video_sequences,VideoSequence_ConceptInfo)
