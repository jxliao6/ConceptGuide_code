import subprocess

## setting! ##
download_words = []
videofilter_words = []
commentanalyze_words = []
captionanalyze_words = ['natural language processing']#'machine learning','regression machine learning'
# captionanalyze_words = ['Sentiment analysis','natural language processing automatic summarization','regression machine learning','decision tree machine learning']#'machine learning','regression machine learning'
# 'Sentiment analysis','sorting data structure','natural language processing automatic summarization'
#'sorting data structure','regression machine learning','makeup beginners'
read_analyze_words = []
amount = '20'
# '2017 lipstick recommend','make up Eye shadow','web crawler','React.js component'
# have to download
for word in download_words:
    subprocess.call(['python','download.py',word,amount])
  
for word in videofilter_words:
    subprocess.call(['python','video_filter.py',word,amount])

# do comment analyze
for word in commentanalyze_words:
    print("start anaylze :",word,"...")
    subprocess.call(['python','comment_analyze.py',word,amount])
    print("finish comment analyze : ",word,"!")

# do caption analyze
for word in captionanalyze_words:
    print("start anaylze :",word,"...")
    subprocess.call(['python','caption_analyze.py',word,amount])
    print("finish caption analyze : ",word,"!")

# read analyze result
for word in read_analyze_words:
    print("start convert to json :",word,"...")
    subprocess.call(['python','read_analyze_result.py',word,amount])
    print("finish convert to json : ",word,"!")
