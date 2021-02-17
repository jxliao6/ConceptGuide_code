import RAKE
from pprint import pprint 

def SelectFromRAKEResult(result,wordcnt_threshold,score_threshold):
    keywords=[]
    for (voc,score) in result:
        if (len(voc.split())>wordcnt_threshold and score>score_threshold):
            keywords.append(voc)
    return keywords

def GetKeywords(texts,title_text):
    all_text = ""
    keywords = []
    Rake  = RAKE.Rake(RAKE.SmartStopList())

    #every single video 
    for vid in texts:
        all_text = all_text+texts[vid]+". "
        SingleRAKEresult = Rake.run(texts[vid], minCharacters = 3, maxWords = 4, minFrequency = 2)
        print(SingleRAKEresult)
        kwords = SelectFromRAKEResult(SingleRAKEresult,0,1.8)
        # print(texts[vid])
        print(vid,"kwords:",kwords)
        keywords.extend(kwords)

    # title text
    SingleRAKEresult = Rake.run(title_text, minCharacters = 3, maxWords = 4, minFrequency = 2)
    print("title_text:",SingleRAKEresult)
    kwords = SelectFromRAKEResult(SingleRAKEresult,0,1.8)
    print("title kwords:",kwords)
    keywords.extend(kwords)

    # total videos' text
    totalRAKEresult = Rake.run(all_text, minCharacters = 2, maxWords = 4, minFrequency = 5)
    keywords.extend(SelectFromRAKEResult(totalRAKEresult,1,-1))
    return list(set(keywords))

def Extract(texts,wlist):
    for vid in texts:
        text = texts[vid]
        word_count = {}
        total = 0
        for word in wlist:
            num = text.count(" "+word+" ")
            if num != 0:
                word_count[word] = num
                total = total+num
        sorted_word_count = sorted(word_count.items(), key=lambda d: d[1], reverse=True)
        # return [sorted_word_count,total]

