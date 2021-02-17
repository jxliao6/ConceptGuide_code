import json
from pprint import pprint
# def convert_to_json_VisType1(TOP_N_CONCEPT,voc_list,similarities_sparse):
#     f = open("vis_json/type1.json","w")
#     l1 = []
#     dic = {}
#     # node
#     for i in range(TOP_N_CONCEPT):
#         dic = {"name":voc_list[i][0],"group":1}
#         l1.append(dic) 
#     # links
#     l2 = []
#     for i in range(TOP_N_CONCEPT):
#         for j in range(TOP_N_CONCEPT):
#             # print("(",i,",",j,") : ",similarities_sparse[i,j])
#             dic =  {'source':i,'target':j,'similarity':similarities_sparse[i,j]}
#             if(similarities_sparse[i,j]>=0):
#                 l2.append(dic)
#     json.dump({"nodes":l1,"links":l2},f,indent=4, sort_keys=True)
# def PruneVideos(nodes):
#     newnodes=[]
#     totalvids = []
#     covervids = []
#     for node in nodes:
#         newnode = {}
#         ### newnode = node
#         for key in node:
#             if type(node[key])==list:
#                 newnode[key] = node[key][:]
#             else:
#                 newnode[key] = node[key]
#         if(len(newnode["videos_id"])>7):
#             newnode["videos_id"] = newnode["videos_id"][:6]
#             covervids.extend([item[0] for item in newnode["videos_id"][:6]])
#         else:
#             covervids.extend([item[0] for item in newnode["videos_id"]])
#         totalvids.extend([item[0] for item in node["videos_id"]])
#         newnodes.append(newnode)
#     print("check coverage after prune:",len(set(totalvids)),len(set(covervids)))
#     print("not includes",set(totalvids)-set(covervids))
#     addBackVids=list(set(totalvids)-set(covervids))
#     return newnodes

def PruneVideos(nodes):
    totalvids = []
    covervids = []
    for node in nodes:
        if(len(node["videos_id"])>6):
            covervids.extend([item[0] for item in node["videos_id"][:6]])
        else:
            covervids.extend([item[0] for item in node["videos_id"]])
        totalvids.extend([item[0] for item in node["videos_id"]])

    print("check coverage after prune:",len(set(totalvids)),len(set(covervids)))
    print("not includes",set(totalvids)-set(covervids))
    addBackVids=list(set(totalvids)-set(covervids))
    
    # add back if vid not in coverage
    newnodes=[]
    for node in nodes:
        newnode = {}
        for key in node:
            if type(node[key])==list:
                newnode[key] = node[key][:]
            else:
                newnode[key] = node[key]
        if(len(newnode["videos_id"])>6):
            newnode["videos_id"] = newnode["videos_id"][:6]
            covervids.extend([item[0] for item in newnode["videos_id"][:6]])
            for checkv,checkcnt in node["videos_id"][6:]:
                if checkv in addBackVids:
                    newnode["videos_id"].append((checkv,checkcnt))
                    covervids.append(checkv)
        else:
            covervids.extend([item[0] for item in newnode["videos_id"]])
        totalvids.extend([item[0] for item in node["videos_id"]])
        newnodes.append(newnode)
    print("check coverage after prune:",len(set(totalvids)),len(set(covervids)))
    print("not includes",set(totalvids)-set(covervids))
    return newnodes


def concept_relationship(TOP_N_CONCEPT,anaylze_result_element):
    voc_list = anaylze_result_element['voc_list']
    voc_appear_dict = anaylze_result_element['voc_appear_dict']
    similarities_sparse = anaylze_result_element['similarities_sparse']
    Prob_ConceptPairs = anaylze_result_element["pairs"]

    # f = open("vis_json/final.json","w")
    l1 = []
    dic = {}
    # node
    for i in range(TOP_N_CONCEPT):
        dic = {"index":i,"name":voc_list[i][0],"group":1,"count":voc_list[i][1]["cnt"],"videos_id":voc_appear_dict[voc_list[i][0]]}
        l1.append(dic) 

    # links
    l2 = []
    for i in range(TOP_N_CONCEPT):
        for j in range(TOP_N_CONCEPT):
            # print("(",i,",",j,") : ",similarities_sparse[i,j])
            pre_value = Prob_ConceptPairs[(voc_list[i][0],voc_list[j][0])]['prerequisite'] if ((voc_list[i][0],voc_list[j][0]) in Prob_ConceptPairs) else None
            if (pre_value!=None) and (pre_value<0):
                dic =  {'source':j,'target':i,'similarity':similarities_sparse[i,j],'prerequisite':-pre_value}
            else:   
                dic =  {'source':i,'target':j,'similarity':similarities_sparse[i,j],'prerequisite':pre_value}
            if(similarities_sparse[i,j]>=0):
                l2.append(dic)
    return {"nodes":l1,"links":l2}
    # json.dump({"nodes":l1,"links":l2},f,indent=4, sort_keys=True)

def video_info(word_freq_dict,video_info):
    new_video_info={}
    for item in video_info:
        # del item["transcript"] ###!
        item ["concepts"] = word_freq_dict[item["videoid"]]
        new_video_info[item["videoid"]] = item 
    return new_video_info

def add_NumOfConceptWords(concept_relationship,videos):
    # print(concept_relationship["nodes"]["videos_id"])
    newnodes = []
    for node in concept_relationship["nodes"]:
        # print(node["name"],node["videos_id"])
        node["conceptCountForEachVid"] = {}
        new_videos_id=[]
        for vid in node["videos_id"]:
            if vid in videos:
                for word in videos[vid]["concepts"]:
                    if(word[0]==node["name"]):
                        # print(word[0],word[1])
                        node["conceptCountForEachVid"][vid]=word[1]
                        new_videos_id.append((vid,word[1]))
            else:
                pass
        # print("new_videos_id",new_videos_id)
        new_videos_id.sort(key=lambda tup: tup[1], reverse=True)
        node["videos_id"] = new_videos_id
        newnodes.append(node)
            # concept_relationship[""]
    concept_relationship["nodes"] = newnodes
    # pprint(concept_relationship)
    return concept_relationship


def Process_UserFeedback(videos): # combine likes/dislikes to user feedback
    new_videos={}
    print("start Combine ")
    like_dislike_list = []
    comment_sentiment_list = []
    for vid in videos:
        like_dislike_list.append(int(videos[vid]['likeCount']))
        like_dislike_list.append(int(videos[vid]['dislikeCount']))
        comment_sentiment_list.append(videos[vid]['comment_sentiment'])
    print(comment_sentiment_list)
    print(max(like_dislike_list),max(comment_sentiment_list))
    
    for vid in videos:
        likeCount = float(videos[vid]['likeCount'])
        dislikeCount = float(videos[vid]['dislikeCount'])
        normalized_CommentSent = videos[vid]['comment_sentiment']/max(comment_sentiment_list)
        print("likes/dislikes/non/normalizeed:",likeCount,dislikeCount,videos[vid]['comment_sentiment'],normalized_CommentSent)
        if (likeCount+dislikeCount)!=0:
            likesDislikes= (likeCount-dislikeCount)/(likeCount+dislikeCount)
            userFeedbackScore = 0.3*likesDislikes + 0.7* normalized_CommentSent
            print("likesDislikes,Comment",likesDislikes,',',normalized_CommentSent)
            print(userFeedbackScore,'\n')
        else:
            userFeedbackScore = 0 
            print(userFeedbackScore,'\n')
        new_videos[vid] = videos[vid]
        new_videos[vid]['userFeedbackScore'] = userFeedbackScore
    return new_videos 

def generate_jsonfile(key,search_info,videos,concept_relationship,BFSresult,EdgesOfNode,RemovedEdgesOfNode,ConceptSequence,video_sequences,VideoSequence_ConceptInfo):
    data={}
    # concept_relationship = add_NumOfConceptWords(concept_relationship,videos)
    data["search_info"] = search_info
    data["concept_relationship"] = concept_relationship
    data["videos_info"] = videos
    data["highlight_nodes"] = BFSresult
    data["BFSinput"] = EdgesOfNode
    data["RemovedCycleLinks"] = RemovedEdgesOfNode
    data["video_sequences"] = video_sequences
    data["concept_sequences"] = ConceptSequence
    data["VideoSequence_ConceptInfo"] = VideoSequence_ConceptInfo
    
    f = open("vis_json/final.json","w")
    json.dump(data,f,indent=4, sort_keys=True)
            