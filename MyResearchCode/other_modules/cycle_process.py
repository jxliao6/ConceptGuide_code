# refer to : https://stackoverflow.com/questions/40833612/find-all-cycles-in-a-graph-implementation

def dfs(graph, start, end):

    fringe = [(start, [])]
    while fringe:
        state, path = fringe.pop()
        if path and state == end:
            yield path
            continue
        for next_state in graph[state]:
            if next_state in path:
                continue
            fringe.append((next_state, path+[next_state]))


def RemoveCycle(EdgesOfNode,LenOfNodes):
    
    NewEdgesOfNode={}
    RemovedEdgesOfNode={}
    for key in range(LenOfNodes) :
        # graph = EdgesOfNode[key]
        graph={}
        removegraph = {}
        for i in EdgesOfNode[key]:
            graph[i] = EdgesOfNode[key][i][:]

        # adjust graph 
        for i in range(LenOfNodes):
            if i not in graph:
                graph[i] = []
        # print("orginalgraph",graph)

        # find cycles
        cycles = [[node]+path  for node in graph for path in dfs(graph, node, node)]
        
        if len(cycles)!=0: # if cycles exist
            # print("cylce:",len(cycles),cycles[:])
            while(len(cycles)!=0): # remove node's link which has smallest outdegree until no cycles
                recentcycle = [nodelist for nodelist in cycles[0]][:-1]
                outdegreelist = [(node,len(graph[node])) for node in recentcycle]
                outdegreelist.sort(key=lambda tup: tup[1])
                minDegreeNode = outdegreelist[0][0]
                # print("MinDegree",minDegreeNode)
                # adjust graph
                for linknode in graph[minDegreeNode]: #!!!!
                    if linknode in recentcycle:
                        if minDegreeNode not in removegraph:
                            removegraph[minDegreeNode] =[linknode]
                        else:
                            removegraph[minDegreeNode].append(linknode)
                        graph[minDegreeNode].remove(linknode)
                # now cycles
                cycles = [[node]+path  for node in graph for path in dfs(graph, node, node)]
            # print("newgraph",graph)
            # print("newcycle",cycles)
        
        
        # adjust back graph
        for i in range(LenOfNodes):
            if(len(graph[i])==0):
                del graph[i]
        NewEdgesOfNode[key] = graph
        RemovedEdgesOfNode[key] = removegraph
    # print("NewEdgesOfNode:",NewEdgesOfNode)
    print("RemovedEdgesOfNode:",RemovedEdgesOfNode)
    return [NewEdgesOfNode,RemovedEdgesOfNode]
    