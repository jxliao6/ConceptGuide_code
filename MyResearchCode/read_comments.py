import pickle
import sys
from textblob import TextBlob
from pprint import pprint
import matplotlib.pyplot as plt




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
    

    rank = 1
    videos_info = {}
    for item in videos:
        print("rank=",rank," ",item['videoid']," ",item['title'])
        info = {}
        info['title'] = item['title']
        info['likeCount'] = item['likeCount']
        info['dislikeCount'] = item['dislikeCount']
        info['viewCount'] = item['viewCount']
        info['index'] = rank
        videos_info[item['videoid']] = info
        rank = rank + 1

    # pprint(videos_info)

    #print schema
    print(comments[0].keys())
    print("total",len(comments),"comments")
    # SentimentOfVideo = {}
    vid=comments[0]["videoId"]
    cnt= 0
    summ = 0
    for comment in comments:
        if(vid!=comment["videoId"]):
            # print("CHECKK",summ," ",cnt)
            if vid in videos_info:
                videos_info[vid]['sentiment']= float(summ) / cnt
                videos_info[vid]['NumOfComments'] = cnt
            summ = 0
            cnt = 0
            vid = comment["videoId"]
        text = comment['textDisplay']
        blob = TextBlob(text)
        print("publish time: ",comment['publishedAt']," | ","author: ",comment["authorDisplayName"]," | ","vidoe_id: ",comment["videoId"])
        print("comment : ",comment['textDisplay'].replace('\n',' '))
        print("sentiment : ",blob.sentiment.polarity)
        summ = summ + blob.sentiment.polarity
        cnt = cnt +1
        print("\n\n")
       
    videoid = [com['videoId'] for com in comments]
    print(set(videoid))
    print(len(set(videoid)))


    print("========================")
    for vid in videos_info:
        if 'sentiment' not in videos_info[vid]:
            videos_info[vid]["NumOfComments"] = 0
            videos_info[vid]["sentiment"] = 0
    # pprint(SentimentOfVideo)
    pprint(videos_info)

 

# # sentiment
    ylabels = ['sentiment', 'likeCount','dislikeCount','viewCount','NumOfComments']

    for i in range(1, 6):
        plt.subplot(2, 3, i)
        plt.xlabel('rank')
        plt.ylabel(ylabels[i-1])
        x = [] # rank
        y = [] # sentiment
        for vid in videos_info:
            x.append(videos_info[vid]["index"])
            y.append(float(videos_info[vid][ylabels[i-1]]))
        plt.plot(x, y, 'ro')
        plt.axis([0,max(x),min(y),max(y)])
    plt.show()