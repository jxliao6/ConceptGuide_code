import pickle
import sys
sys.stdout = open("read_pkl.txt", "w",encoding="utf-8")#!encoding delete

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("please enter : python download_caption.py <keyword> <result_num>")
        sys.exit()
    keyword = str(sys.argv[1]).replace(' ','_')
    result_num = sys.argv[2]
    filepath = "datafile/"+keyword+"_"+result_num+"_videos_info.pkl"
    with open(filepath, 'rb')as f:
        videos = pickle.load(f)

    #print schema
    print(videos[0].keys())
    print("total",len(videos),"videos")
    for video in videos:
        print("\n\n\n\n\n\n\n\n\n\n\n\n")
        for item in video:
            #print(item)
            if type(video[item])==list:
                print(item,video[item])
            elif type(video[item])==float or type(video[item])==int:
                print(item,video[item])
            else:
                print("=====",item,"=====\n",video[item].encode("utf8").decode("cp950", "ignore"))
            print(" ")
    
    
    print("==============")
    for item in videos:
        print(item['caption_exist'])
    