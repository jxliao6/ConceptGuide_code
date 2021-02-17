import requests
from bs4 import BeautifulSoup
from urllib.request import urlopen
import sys,os
import html.parser
import string
#from urllib.request import Request,urlopen, urlretrieve
import urllib.request
import pysrt
from other_modules import output#import output
url_root = "https://en.wikipedia.org/wiki/"

#import panda
#refer to : https://www.ptt.cc/bbs/Python/M.1500690769.A.A6B.html
#print(item.encode("utf8").decode("cp950", "ignore"))
'''
def download_sub(keyword):
    url = "https://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-"+keyword
    table = pd.read_html(url)[4]
    print(table.encode(sys.stdin.encoding, "replace").decode(sys.stdin.encoding))
'''
####################################################################################################
# Example for different method 
# 1. Method1 : <li>
#    https://en.wikipedia.org/wiki/List_of_terms_relating_to_algorithms_and_data_structures
# 2. Method2 : <dfn>/<dt>
#   https://en.wikipedia.org/wiki/Glossary_of_architecture
# 3. for bolds : <h3>
#   https://en.wikipedia.org/wiki/Glossary_of_geothermal_heating_and_cooling
# 4. Method4 :  <li> + <b>
#   https://en.wikipedia.org/wiki/Glossary_of_astronomy
####################################################################################################
def Method1(glossary_name):
    # soup initial
    url = url_root+glossary_name
    html_doc = urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')

    # start crawler
    s = soup.find_all('li')
    wordlist = []
    for item in s:
        #print(item.string)
        wordlist.append(item.string)
    #print(wordlist)
    return wordlist

def Method2(glossary_name):
    # soup initial
    url = url_root+glossary_name
    html_doc = urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')

    # start crawler
    #s = soup.find_all('dfn')
    s = soup.find_all('dt')
    wordlist = []
    for item in s:
        newitem =item.find('a')
        if(newitem!=None):
            wordlist.append(newitem.string)
        else:
            wordlist.append(item.string)
    return wordlist

def Method3(glossary_name):
    # soup initial
    url = url_root+glossary_name
    html_doc = urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')

    # start crawler
    s = soup.find_all('h3')
    wordlist = []
    for item in s:
        #print(item)
        newitem = item.find('span',{'class':'mw-headline'})
        if newitem!=None:
            print(newitem.string)
            wordlist.append(newitem.string)
    return wordlist


def Method4(glossary_name):
    # soup initial
    url = url_root+glossary_name
    html_doc = urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')

    # start crawler
    s = soup.find_all('li')
    wordlist = []
    for item in s:
        #print(item)
        newitem = item.find('b')
        if newitem!=None:
            wordlist.append(newitem.string)
    return wordlist


def Method5(glossary_name):
    # soup initial
    url = url_root+glossary_name
    html_doc = urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')

    # start crawler
    s = soup.find_all('li')
    wordlist = []
    for item in s:
        #print(item)
        newitem = item.find('b')
        if newitem is not None:
            try:
                print(newitem.find('a').text)
                #x = newitem.find('a').find('title')
                wordlist.append(newitem.find('a').text)#.string)
            except:
                continue
        #else:
            #print(item)
    return(wordlist)


def Print_List(wordlist):
    for i in wordlist:
        print(i)


def Output_to_txt(wordlist,glossary_name):
    for i in wordlist:
        print(i)


def Craw(method,glossary_name):
    if method==1:
        wordlist = Method1(glossary_name)
    elif method==2:
        wordlist = Method2(glossary_name)
    elif method==3:
        wordlist = Method3(glossary_name)
    elif method==4:
        wordlist = Method4(glossary_name)
    elif method==5:
        wordlist = Method5(glossary_name)
    Print_List(wordlist)

    

if __name__ == "__main__":
    
    sys.stdout = open("wiki_crawler_stdout_new.txt", "w",encoding="utf-8")
    #Craw(1,'List_of_terms_relating_to_algorithms_and_data_structures')
    #Craw(2,'Glossary_of_architecture')
    Craw(5,"Glossary_of_clinical_research")
    #Craw(2,"Glossary_of_geothermal_heating_and_cooling")
   
   #wlist2 = Crawler_For_Bolds("Glossary_of_geothermal_heating_and_cooling")

