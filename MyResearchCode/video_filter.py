##################################################
# select the videos that satisfy requirement : 
# 1. time duration : 3~20 minutes
# 2. caption exist 
################################################
import pickle
import sys
from other_modules import output
import isodate


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("please enter : python video_filter.py <keyword> <result_num>")
        sys.exit()
    keyword = str(sys.argv[1]).replace(' ','_')
    result_num = sys.argv[2]
    filepath = "datafile/"+keyword+"_"+result_num+"_videos_info.pkl"
    filename_root = "datafile/"+str(keyword).replace(' ',"_")+"_"+str(result_num)+"_"
    with open(filepath, 'rb')as f:
        videos = pickle.load(f)
    ### set interval
    MIN_sec = isodate.parse_duration('PT4M').total_seconds()
    MAX_sec = isodate.parse_duration('PT30M').total_seconds()
    print("select the videos that is : ", MIN_sec, " ~ ", MAX_sec, "minutes")

    # select the video we want
    videos2 = []
    for item in videos:
        seconds = isodate.parse_duration(item ['duration']).total_seconds()
        #print(item ['duration'], " ", seconds)
        if item['caption_exist'] == "T" and seconds >= MIN_sec and seconds <= MAX_sec:
            videos2.append(item)
    print(len(videos2)," videos are selected ! ")
    #for item in videos2:
    #    print(item['duration'], " ", item['caption_exist'])
    
    output.to_pickle(videos2, filename_root+"videos_info.pkl")
