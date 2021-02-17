# read final.json
# detect video_sequence.py

from collections import deque
from pprint import pprint
import sys
import json
import numpy as np
from toposort import toposort, toposort_flatten
from other_modules import cycle_process 


# sys.stdout = open("read_pkl.txt", "w",encoding="utf-8")#!encoding delete
# GRAY, BLACK = 0, 1

# def topological(graph):
#     order, enter, state = deque(), set(graph), {}
#     def dfs(node):
#         state[node] = GRAY
#         for k in graph.get(node, ()):
#             sk = state.get(k, None)
#             if sk == GRAY: 
#                 # print("cycle")
#                 return [-1]
#                 # raise ValueError("cycle")
#             if sk == BLACK: 
#                 continue
#             enter.discard(k)
#             dfs(k)
#         order.appendleft(node)
#         state[node] = BLACK

#     while enter: dfs(enter.pop())
#     return list(order) # order



def adjust_SimilarityThreshold(links,newthreshold):
    newlinks = []
    for link in links:
        if(link["similarity"]<newthreshold):
            link["prerequisite"] = None
        newlinks.append(link)
    return newlinks

def create_adjacency_dict(links,LenOfNodes):
    adjacency = {}
    for i in range(LenOfNodes):
        adjacency[i] = []

    for link in links:
        if link["prerequisite"]!=None:
            adjacency[link["target"]].append(link["source"])
           
    # pprint(adjacency)
    return adjacency

def BFS(graph, start):
    visited, queue = set(), [start]
    while queue:
        vertex = queue.pop(0)
        if vertex not in visited:
            visited.add(vertex)
            queue.extend(set(graph[vertex]) - visited)
    return list(visited)


def NodeNameDict(nodes):
    A = []
    for node in nodes:
        A.append(node["name"])
    return A


def Get_Edges_OfEachNode(LenOfNodes,BFSresult,links):
    d = {}
    for i in range(LenOfNodes):
        d[i] = []
    EdgesOfNode = {}
    for i in range(LenOfNodes):
        EdgesOfNode[i] = {}

    for i in range(LenOfNodes):
        HighlightNodes = BFSresult[i] 
        for link in links:
            if(link["target"] in HighlightNodes) and (link["source"] in HighlightNodes) and (link["prerequisite"]!=None):
                if link["source"] not in EdgesOfNode[i]:
                    EdgesOfNode[i][link["source"]] = [link["target"]]
                else:
                    EdgesOfNode[i][link["source"]].append(link["target"])
    return EdgesOfNode

def Get_ConceptSequence_OfEachNode(LenOfNodes,EdgesOfNode):
    ConceptSequence = {}
    for i in range(LenOfNodes):
        # ConceptSequence[i] = topological(EdgesOfNode[i])
        # convert type list to set
        tmp={}
        for key in EdgesOfNode[i]:
            tmp[key] = set(EdgesOfNode[i][key])
        try:
            ConceptSequence[i] =  toposort_flatten(tmp)[::-1]
        except:
            ConceptSequence[i] = ["cycle"] # cycle
    
    # print("ConceptSequence",ConceptSequence)
    return ConceptSequence



# def Infer_VideoSequence(nodes,ConceptSequence,videos,TopConcepts):
#     video_sequences = {}
#     LenOfNodes = len(nodes)
#     for selectednodes in range(LenOfNodes):
#         currentConceptSeq = ConceptSequence[selectednodes]
#         currentvideoset = set([])
#         for node in nodes:
#             if node["index"] in currentConceptSeq:
#                 currentvideoset = currentvideoset | set([item[0] for item in node["videos_id"]]) #set(node["videos_id"])
#         print("setsize",len(currentvideoset))
#         for vid in currentvideoset:
#             # print(vid)
#             v = []
#             concepts = [item[0] for item in videos[vid]["concepts"]]
#             for c in concepts:
#                 if c in TopConcepts:
#                     if(TopConcepts.index(c) in currentConceptSeq):
#                         v.append(currentConceptSeq.index(TopConcepts.index(c)))
#                         # print(c,ConceptIndex[c],currentConceptSeq.index(ConceptIndex[c]))
#             if selectednodes in video_sequences:
#                 video_sequences[selectednodes].append((vid,np.average(v)))
#             else:
#                  video_sequences[selectednodes] = [(vid,np.average(v))]
#     return video_sequences

def ChangeConceptIndexToName(cindex_list,dictt):
    cname_list=[]
    for cindex in cindex_list:
        cname_list.append(dictt[cindex])
    return cname_list
        
def Infer_VideoSequence(nodes,ConceptSequence,videos,TopConcepts):
    print("TopConcepts",TopConcepts)
    video_sequences = {}
    video_correspondConcept={}
    LenOfNodes = len(nodes)
    for selectednodes in range(LenOfNodes):
        print("selectednodes:",selectednodes)
        video_correspondConcept[selectednodes]={}
        currentConceptSeq = ConceptSequence[selectednodes]
        currentvideoset = []
        for c_index in currentConceptSeq:   
            for node in nodes:
                if node["index"]==c_index:
                    # currentvideoset.append(node["videos_id"])
                    for item in node["videos_id"]:
                        if item[0] not in currentvideoset:
                            currentvideoset.append(item[0])

        print("setsize",len(currentvideoset),currentvideoset)
        currentConceptNameSeq=ChangeConceptIndexToName(currentConceptSeq,TopConcepts)
        
        print(currentConceptNameSeq)
        for vid in currentvideoset:
            print(vid)
            v1 = [] # count average location
            v2 = [] # save appear concept
            concepts = [item[0] for item in videos[vid]["concepts"]]
            for c in concepts:
                if c in currentConceptNameSeq:
                    v1.append(currentConceptNameSeq.index(c))
                    v2.append(TopConcepts.index(c))
                    # print(c,ConceptIndex[c],currentConceptSeq.index(ConceptIndex[c]))
            print("v1",v1,np.average(v1))
            print("v2",v2)
            if selectednodes in video_sequences:
                video_sequences[selectednodes].append((vid,np.average(v1)))
            else:
                video_sequences[selectednodes] = [(vid,np.average(v1))]
            video_correspondConcept[selectednodes][vid]=v2

    pprint(video_correspondConcept)
    return [video_sequences,video_correspondConcept]

def SelectRepresentVideo(vidlist,videos):
    
    if(len(vidlist)>1):
        new_vidlist = []
        for vid,wcount in vidlist:
            sent = videos[vid]["comment_sentiment"]    
            new_vidlist.append((vid,wcount,sent))
        # if the first element sentiment < second element's sentiment ,select the second one
        if new_vidlist[0][2]<=0 and new_vidlist[0][2]-new_vidlist[1][2]<0: 
            return [(new_vidlist[1][0],new_vidlist[1][1])]
    return vidlist[:1]


def Adjust_Video_id(nodess,videos):
    newnodes=[]
    for node in nodess:
        newnode = {}
        ### newnode = node
        for key in node:
            if type(node[key])==list:
                newnode[key] = node[key][:]
            else:
                newnode[key] = node[key]
        newnode["videos_id"] = SelectRepresentVideo(newnode["videos_id"],videos)
        # if(len(newnode["videos_id"])>3):
        #     newnode["videos_id"] = newnode["videos_id"][:1]#3
        newnodes.append(newnode)
    return newnodes

def Create_Videos_CorrespondingConcept(nodes):
    newdict={}
    for node in nodes:
        for vid,cnt in node["videos_id"]:
            if vid not in newdict:
                newdict[vid]=[node["index"]]
            else:
                newdict[vid].append(node["index"])
    return newdict


def GenerateLearningPath(links,nodes,videos): #main
    #adjust(decrease) concept-videos_id before generate learning path
    newnodes = Adjust_Video_id(nodes,videos)
    # generate video's corresponding concept dictionary
    # VideoSequence_ConceptInfo = Create_Videos_CorrespondingConcept(newnodes)


    ####
    LenOfNodes = len(newnodes)
    TopConcepts = NodeNameDict(newnodes)

    ##### Do BFS for each node #####
    #   :  get every prerequisite nodes for each node (Highlight nodes)
    
    # Create adjacency dictionary
    adjacency_dict = create_adjacency_dict(links,LenOfNodes) 
    BFSresult = {}
    for i in range(LenOfNodes):
        BFSresult[i] = BFS(adjacency_dict,i)
    # pprint(BFSresult)

    # Get edge for each node (HighlightLinks)
    EdgesOfNode = Get_Edges_OfEachNode(LenOfNodes,BFSresult,links)
    # pprint(EdgesOfNode)

    # Cycle Preprocess
    # : if cylce exist : remove cycle by consider "outdegree"
    [EdgesOfNode,RemovedEdgesOfNode] = cycle_process.RemoveCycle(EdgesOfNode,LenOfNodes)
    # pprint(EdgesOfNode)

    # Use "topology sorting" to get a legal concept sequence for each selected node
    ConceptSequence = Get_ConceptSequence_OfEachNode(LenOfNodes,EdgesOfNode)
    pprint(ConceptSequence)

    
    # Get videoSequences : infer videoSequences from ConceptSequence
    # refer to paper: " Constructing Learning Maps for Lecture Videos by Exploring Wikipedia Knowledge "
    [video_sequences,video_correspondConcept] = Infer_VideoSequence(newnodes,ConceptSequence,videos,TopConcepts)
    # sort
    for index in video_sequences:
        video_sequences[index] = sorted(video_sequences[index], key=lambda s : s[1])
    pprint(video_sequences)

   

    # return [BFSresult,EdgesOfNode,ConceptSequence,video_sequences,RemovedEdgesOfNode,VideoSequence_ConceptInfo]
    return [BFSresult,EdgesOfNode,ConceptSequence,video_sequences,RemovedEdgesOfNode,video_correspondConcept]
