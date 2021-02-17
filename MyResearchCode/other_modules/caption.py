import os
import sys
from other_modules import output,vtt

def download(keyword,result_num,videos):
    keyword = keyword.replace(' ','_')
    caption_path = 'caption/'+str(keyword)+"_"+str(result_num)+"_captions/"
    filename_root = "../datafile/"+str(keyword)+"_"+str(result_num)+"_"
    # caption_path = 'caption/'+str(keyword)+"_"+str(result_num)+"_captions/"
    # filename_root = "datafile/"+str(keyword)+"_"+str(result_num)+"_"
    
    ## download transcript :vtt format 
    for item in videos:
        vid = item['videoid']
        print(vid)
        #cmd = ".\youtube-dl.exe --write-auto-sub --skip-download --idhttps://www.youtube.com/watch?v="+str(vid)
        cmd = "youtube-dl --write-auto-sub --skip-download -o " + caption_path + "/%\(id\)s.%\(ext\)s https://www.youtube.com/watch?v="+str(vid)
        os.system(cmd)

    ## preprocess ##
    caption_filelist = os.listdir(caption_path)
    print(caption_filelist)
    for item in videos:
        vid = item['videoid']
        filename = str(vid)+".en.vtt"
        # check the transcript file exist or not, update vidoes information
        if filename in caption_filelist:
            item['caption_exist'] = "T"
            # preprocess
            transcript = vtt.combine(caption_path+filename)
            # print(filename,transcript,"\n\n===[=]===\n\n")
            item['transcript'] = transcript
        else:    
            item['caption_exist'] = "F"
            item['transcript'] = None
    return videos

    
