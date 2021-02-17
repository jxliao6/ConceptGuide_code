import os
import sys
# import api, output, auth_api
from other_modules import output,caption
from download_youtube_code import api,auth_api
# import caption
from datetime import datetime


# start_time = datetime.now()
def main(service,keyword,result_num):
    # if len(sys.argv) < 2:
    #     print("please enter : python download.py <keyword> <max_result_num>")
    #     sys.exit()
    # keyword = str(sys.argv[1])
    # result_num = sys.argv[2]
    print("Keyword = ", keyword)
    print("num = ", result_num)
    filename_root = "datafile/"+str(keyword).replace(' ',"_")+"_"+str(result_num)+"_"

    # ## authenticate ##
    # os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    # service = auth_api.get_authenticated_service()

    ## search and get videos ##
    videos = api.youtube_search(service, keyword, result_num)

    ## get videos more information ##
    videos_2 = api.video_get_info(service, videos)
    ## merge 2 list =>videos
    videos_size = len(videos)
    for i in range(videos_size):
        videos[i].update(videos_2[i])
        
    ## get channel information ##
    videos_channel = api.video_get_channel_info(service, videos)
    for i in range(videos_size):
        videos[i].update(videos_channel[i])

    ## get videos comments ##
    
    videos_3 = api.get_comment_threads(service, videos)
    #download_output.to_dict(videos_3,filename_root+"comment.txt")
    output.to_csv(videos_3, filename_root+"comment.csv")
    output.to_pickle(videos_3, filename_root+"comment.pkl")
    

    
    # download caption
    videos_4 = caption.download(keyword, result_num, videos)
    for i in range(videos_size):
        videos[i].update(videos_4[i])


    # output data
    #output.to_dict(videos,filename_root+"videos_info.txt")
    output.to_csv(videos, filename_root+"videos_info.csv")
    output.to_pickle(videos, filename_root+"videos_info.pkl")


    # end_time = datetime.now()
    # time_delta = float((end_time -start_time).seconds)/60
    # print("download video data for ",time_delta,"minutes")
    
