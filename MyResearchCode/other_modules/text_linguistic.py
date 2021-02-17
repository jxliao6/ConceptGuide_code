from nltk.corpus import wordnet
from nltk import word_tokenize, pos_tag
from nltk.stem import WordNetLemmatizer
import re
from nltk.stem.porter import PorterStemmer
porter_stemmer = PorterStemmer()

from other_modules import text_preprocess

lemmatizer = WordNetLemmatizer()

# preprocess the text
def Sentence(line):
    if(len(line)!=0):
        # return line.lower()
        line = line.lower()
        line = replaceCharEntity(line)
        new_line = lemmatize_sentence(line)
        return (new_line)



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



