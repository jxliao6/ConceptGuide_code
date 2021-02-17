import RAKE ,sys , pickle
from pprint import pprint 
from other_modules import text_preprocess
     


def GetKeywords(text):
 
    Rake  = RAKE.Rake(RAKE.SmartStopList())
    keyword = Rake.run(text, minCharacters = 2, maxWords = 4, minFrequency = 2)
    # keywords2 = Rake.run(text, minCharacters = 2, maxWords = 1, minFrequency = 10)
    
    keywords=[]
    for (voc,score) in keyword:
        if (len(voc.split())>1):
            keywords.append(voc)
    print("Rake keywords:")
    pprint(keyword)
    return keywords

if __name__ == '__main__':
    keyword = str(sys.argv[1]).replace(' ', '_')
    result_num = sys.argv[2]
    filepath = "datafile/"+keyword+"_"+result_num+"_videos_info.pkl"
    
    with open(filepath, 'rb')as f:
        videos = pickle.load(f)
    vid = "o_OZdbCzHUA"

    for item in videos:
        if item['videoid']==vid:
            # text = item['transcript']
            text = text_preprocess.main(item['transcript'])
            GetKeywords(text)

# def Extract(texts,wlist):
#     for vid in texts:
#         text = texts[vid]
#         word_count = {}
#         total = 0
#         for word in wlist:
#             num = text.count(" "+word+" ")
#             if num != 0:
#                 word_count[word] = num
#                 total = total+num
#         sorted_word_count = sorted(word_count.items(), key=lambda d: d[1], reverse=True)
#         # return [sorted_word_count,total]

# def UpdateWlist(ori_set,new_list):
#     # ori_list = list(ori_set)
#     update_list = list(set(list(ori_set)+new_list))
#     for item in update_list:
#         if item[len(item)-1]=='s':
#             if(item[:len(item)-1] in update_list):
#                 update_list.remove(item)
#     return set(update_list)
    
