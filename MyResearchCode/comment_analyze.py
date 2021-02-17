## directly update comment analyze result into videos.pkl


import pickle
import sys
from textblob import TextBlob
from pprint import pprint
import matplotlib.pyplot as plt
from other_modules import output



sys.stdout = open("read_pkl.txt", "w",encoding="utf-8")#!encoding delete

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("please enter : python download_caption.py <keyword> <result_num>")
        sys.exit()
    keyword = str(sys.argv[1]).replace(' ','_')
    result_num = sys.argv[2]
    commentfilepath = "datafile/"+keyword+"_"+result_num+"_comment.pkl"
    with open(commentfilepath, 'rb')as f1:
        comments = pickle.load(f1)
    
    videofilepath = "datafile/"+keyword+"_"+result_num+"_videos_info.pkl"
    with open(videofilepath, 'rb')as f2:
        videos = pickle.load(f2)
        
    # print("videoslen",len(videos))
    # pprint(videos)
    rank = 1
    videos_info = {}
    for item in videos:
        info = item
        # del info['videoid']
        videos_info[item['videoid']] = info
        rank = rank + 1


    vid=comments[0]["videoId"]
    cnt= 0
    summ = 0
    for comment in comments:
        if(vid!=comment["videoId"]):
            # print("CHECKK",summ," ",cnt)
            if vid in videos_info:
                videos_info[vid]['comment_sentiment']= float(summ) / cnt
                videos_info[vid]['NumOfComments'] = cnt
            summ = 0
            cnt = 0
            vid = comment["videoId"]
        text = comment['textDisplay']
        blob = TextBlob(text)
        # print("publish time: ",comment['publishedAt']," | ","author: ",comment["authorDisplayName"]," | ","vidoe_id: ",comment["videoId"])
        # print("comment : ",comment['textDisplay'].replace('\n',' '))
        # print("sentiment : ",blob.sentiment.polarity)
        summ = summ + blob.sentiment.polarity
        cnt = cnt +1
        # print("\n\n")
       
    videoid = [com['videoId'] for com in comments]
    

    for vid in videos_info:
        if 'comment_sentiment' not in videos_info[vid]:
            videos_info[vid]["NumOfComments"] = 0
            videos_info[vid]["comment_sentiment"] = 0

    #change dictionary into list
    videos2 = []
    for vid in videos_info:
        videos2.append(videos_info[vid])
    # print(len(videos2))
    # pprint(videos2)

    # update videos' pickle
    output.to_pickle(videos2, videofilepath)