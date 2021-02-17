### can be execute ###
1. download.py
2. video_filter.py
2-2. comment_anaylze.py
3. caption_analyze.py
4. read_analyze_result.py

Else. wiki_preprocess.py

########   Different python file(.py)   #######
#### download.py #####
cmd : "python download.py <keyword> <num>"
p.s. if <keyword> has space use '' to represent 
    - search "keyword" from youtube
    - then download "video title","video id",....any video information and caption

    # import "auth_api.py"
        => authenticate the youtube api
    # import "api.py"
        => do any api call from youtube
    # import "caption.py"https://www.olevod.com/
        => download caption from youtube 
    # import "output.py"
        => output data to csv,pickle

## caption.py 
    # import "vtt.py"
        => read vtt then combine

## read_pkl.py 
cmd : "python read_pkl.py <keyword> <num>"
    - a convenious file to quickly access pickle data

##### caption_analyze.py #####
cmd : "python caption_anaylze.py '<keyword>' <num>
    - extract concept words from corresponding wikipedia set
    - tempcheck.txt : can see that which category has no corresponding wikiset
    #import google_api
        access google_api (natural language) to classify text content
    #import similarity
        - consine similarity 
        - for each concept has a vector: (v1,v2,v3,....vn),
            if concept exists in v1,value = 1, else value = 0
    #import word2vec_model
        - cosine similarity
        - for each concept ha a vector (trained by word2vector)
    #import prerequisite
        - calculate each features (refer to paper:Prerequisite Relation Learning for Concepts in MOOCs)
        - generate f1~f5(list),Prob_ConceptPairs(dictionary)
        - save the result in "/result/analyze_result.pkl"

##### wiki_preprocess.py #####
cmd : "python wiki_preprocess.py step1/step2"
    - from folder "/wiki_orginal" ,then do preprocess , classify 
    - save in "category_to_wordlist.pkl" => let "caption_analyze.py" use
    - print in "wiki_preprocess_stdout.txt" (just print, no other use)

    <run step 1>
        - automatic classify by google natural language api => ouput in "mapp.json"
    <Manually Do something>
        - copy "mapp.json" to "mapp_edit.json", then can modify category by myself
    <run step 2>
        - read "mapp_edit.json",then output correct format to "category_to_wordlist.pkl"


##### wiki_crawler.py #####
 different method to craw the wikipedia pages
 A~Z check to "geology.txt"...the file above geo not yet


##### read_analyze_result.py #####
after anaylze(caption_analyze.py), save result in pkl
then this file can read the result from pkl
- able to adjust simlarity threshold (can only "enhance")
- add "learning path" information to json file (both video and concept path)
    1. BFS : previous neighbor of each concept node
    2. calcualte the highlight links
    3. generate concept sequence(by "topological sorting") //http://www.csie.ntnu.edu.tw/~u91029/DirectedAcyclicGraph.html
    4. infer video sequences (refer to paper:"Constructing Learning Maps for Lecture Videos by Exploring Wikipedia Knowledge")    
    finall will generate (BFSneighbor and video sequence)







######## Pickle file(.pkl) #######
# category_to_wordlist.pkl
    - save wikiword (already classify)
# /result/analyze_result.pkl
    - save every search keywords anaylzed_result
    - e.g. {"data_structure_50":keyword_dict
            "visualization_50":keyword_dict
            }
            keyword_dict={"pairs":Prob_ConceptPairs,"f1":f1,...,"f5":f5}





########### what i adjust in wiki category ###################



/Science/Engineering & Technology/Robotics : =>use "/Science/Engineering & Technology"
remove ""/Jobs & Education/Education": ["chemistry_terms.txt"], "
if category is not on the list ,choose the similiest


wikipedia crawler wrong =>geothermal heating and cooling.txt ,Glossary_of_sound_laws_in_the_Indo-European_languages
(https://en.wikipedia.org/wiki/Glossary_of_sound_laws_in_the_Indo-European_languages))=>OK
https://en.wikipedia.org/wiki/Glossary_of_geothermal_heating_and_cooling

not download
https://en.wikipedia.org/w/index.php?title=Special:Search&limit=500&offset=0&profile=default&search=+glossary+of+terms+&searchToken=cjihgy0vbah0ymnpdr4yv3uw2
https://en.wikipedia.org/wiki/Glossary_of_computer_graphics
https://en.wikipedia.org/wiki/Glossary_of_computer_hardware_terms

########## keywords that can try
1. artificial intelligence , computer science visualization, data structure, machine learning
2. calculus




<!-- install -->
0. install python3

1. py -m pip install XX
py -m pip install flask
py -m pip install --upgrade google-api-python-client
py -m easy_install --upgrade google-api-python-client
py -m pip install --upgrade google-auth google-auth-oauthlib google-auth-httplib2
py -m pip install webvtt-py
py -m pip install scipy
py -m pip install isodate
py -m pip install textblob
py -m pip install sklearn
py -m pip install toposort
py -m pip install python-rake
py -m pip install google-cloud
py -m pip install google-cloud-storage
py -m pip install google-cloud-language
py -m pip install gensim
py -m pip install Wikipedia-API
py -m pip install matplotlib

2. execute python 
import nltk
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
