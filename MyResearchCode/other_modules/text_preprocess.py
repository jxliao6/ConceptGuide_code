from nltk.corpus import wordnet
from nltk import word_tokenize, pos_tag
from nltk.stem import WordNetLemmatizer
import re
from nltk.stem.porter import PorterStemmer
porter_stemmer = PorterStemmer()



lemmatizer = WordNetLemmatizer()

#### remove html 

def replaceCharEntity(htmlstr):
    CHAR_ENTITIES={'nbsp':' ','160':' ','lt':'','60':' ','gt':' ','62':' ','amp':' ','38':' ','quot':' ','34':' ','ll':' ', "‚Äô":",'"}
    re_charEntity=re.compile(r'&#?(?P<name>\w+);')
    sz=re_charEntity.search(htmlstr)
    while sz:
        entity=sz.group()
        key=sz.group('name')
        try:
            htmlstr=re_charEntity.sub(CHAR_ENTITIES[key],htmlstr,1)
            sz=re_charEntity.search(htmlstr)
        except KeyError:
            htmlstr=re_charEntity.sub('',htmlstr,1)
            sz=re_charEntity.search(htmlstr)
    return htmlstr



# POS tagging
def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return treebank_tag
        # return None


# Check if is noun , 'es','s'=> remove
def lemmatize_sentence(sentence):
    sentence.replace(' ll ', 'will')
    sentence.replace('gon na', '')
    sentence.replace(' gonna ','')
    sentence.replace('gon na ', '')
    
    #stopword_list= [' gonna ',' ll ']
    #for stopword in stopword_list:
        # print(sentence)
    #    sentence = sentence.replace(stopword,' ')
    res = []
    lemmatizer = WordNetLemmatizer()
    for word, pos in pos_tag(word_tokenize(sentence)):
        wordnet_pos = get_wordnet_pos(pos) or wordnet.NOUN
        if(wordnet_pos=="n"):
            res.append(lemmatizer.lemmatize(word, pos=wordnet_pos))
        else:
            res.append(word)
        
    strr=""
    for item in res:
        strr = strr+" "+item
    return strr

def lemmatize_phrase(phrase):
    stopword_list= [' gonna ',' ll ']
    for stopword in stopword_list:
        # print(sentence)
        phrase = phrase.replace(stopword,' ')
    res = []
    lemmatizer = WordNetLemmatizer()
    for word, pos in pos_tag(word_tokenize(phrase)):
        # print("wordpos",word,pos)
        wordnet_pos = get_wordnet_pos(pos) or wordnet.NOUN
        if(wordnet_pos=="n"):
            res.append(lemmatizer.lemmatize(word, pos=wordnet_pos))
        elif(wordnet_pos=="WP" or wordnet_pos=='WRB' or wordnet_pos=='CD'): ## if the phrase contain 'what' ,'how'..., remove this phrase
            res=[]
            break
        else:
            res.append(word)
        
    strr=""
    for item in res:
        strr = strr+" "+item
    return strr


# def PhraseReduction(phrase):  #e.g. "sorting algorithm"=>"sort algorithm"
#     strr=""
#     for word, pos in pos_tag(word_tokenize(phrase)):
        
#         try:
#             wordnet_pos = get_wordnet_pos(pos) or wordnet.NOUN
#             print(word,pos,wordnet_pos)
#             # print(wordnet_lemmatizer.lemmatize(w))
#             strr = strr+lemmatizer.lemmatize(word, pos=wordnet_pos)+" "
#         except:
#             strr = strr
#     return strr[:-1]

def PhraseReduction(phrase):  #e.g. "sorting algorithm"=>"sort algorithm"
    strr=""
    vlist=(phrase.replace('-',' ')).split(' ')
    for voc in vlist:
        for word, pos in pos_tag(word_tokenize(voc)):
            try:
                wordnet_pos = get_wordnet_pos(pos) or wordnet.NOUN
                strr = strr+lemmatizer.lemmatize(word, pos=wordnet_pos)+" "
            except:
                strr = strr+word+" "
    # print("phraseReduction",phrase,strr[:-1])
    return strr[:-1]

    

# lowercase the transcript, lemmatize,
# remove the parts within () and [] which show up in automatic transcripts
def Sentence(line):
    if(len(line)!=0):
        # return line.lower()
        line.replace("\"","\'")
        line = line.lower()
        line = replaceCharEntity(line)
        new_line = lemmatize_sentence(line)
        return (new_line)

def List(vlist):
    new_vlist=[]
    for line in vlist:
        if(len(line)!=0):
            # return line.lower()
            line = line.lower()
            line = replaceCharEntity(line)
            new_line = lemmatize_phrase(line)
            if new_line!='':
                new_vlist.append(new_line[1:])
    return (new_vlist)



