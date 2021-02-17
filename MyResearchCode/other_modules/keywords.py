
from pprint import pprint 
from other_modules import text_preprocess




def updateWlist(wiki_set,RAKE_klist,tagklist):
    # ori_list = list(ori_set)
    update_list = set(list(wiki_set)+RAKE_klist+tagklist) #+tagklist
    stop_list=['part','of','for','back','it','good morning','to','at','in','the','video','key','simple','bitcoin bitcoin','with','we','do','time','and','make','[ music ]','day','best','work','be','is','are','by','sex','set','meet tomorrow','language processing','natural language','good thing','next','hello', 'gon na']
    for item in stop_list:
        if item in update_list:
            update_list.remove(item)
    return set(update_list)
    
def removeSubstring(vlist,TOP_N_CONCEPT):  # e.g. if both "bubble" and "sort" and "bubble sort" exist in Top30 Words,remove"bubble" "sort"
    print("lenofvlist",len(vlist))
    print("vlist:")
    pprint(vlist[:TOP_N_CONCEPT])
    print("========================\n\n\n\n\n")

    checklist = vlist[:]
    for voctuple in vlist[:TOP_N_CONCEPT]:
        splitlist = voctuple[0].split(' ')
        if(len(splitlist)>1):
            remove_words = []
            for item in splitlist:
                # t = [t for t in vlist[:TOP_N_CONCEPT] if t[0]==item]
                # t = [t for t in checklist if t[0]==item]
                t = [t for t in checklist if text_preprocess.PhraseReduction(t[0])==text_preprocess.PhraseReduction(item)]
                if(len(t)!=0):
                    remove_words.append(t[0])
            
            if(len(remove_words)==len(splitlist)): # all word have single voc corresponding
                for word in remove_words:
                    if word in vlist:
                        vlist.remove(word)
                        print("remove ",word)
                # if len(t)!=0:
                    # vlist.remove(t[0])
    
    
    print("========================\n\n\n\n\n")
    print("lenofvlist",len(vlist))
    print("vlist:")
    pprint(vlist[:TOP_N_CONCEPT])
    return vlist


def SamePhrase(p1,p2):
    if str(text_preprocess.PhraseReduction(p1)) == str(text_preprocess.PhraseReduction(p2)):
        return True
    else:
        return False

def SubPhrase(p1,p2): # p1 is subphrase of p2
    if str(text_preprocess.PhraseReduction(p1)) in str(text_preprocess.PhraseReduction(p2)):
        return True
    else:
        return False
    
def removeSubstring2(vlist,TOP_N_CONCEPT):  # remove any substring 
    print("lenofvlist",len(vlist))
    print("vlist:")
    pprint(vlist[:TOP_N_CONCEPT])
    print("========================\n\n\n\n\n")


    
    for vocitem in vlist[:TOP_N_CONCEPT]:
        phrase=vocitem[0]

        # Same Phrase : e.g. "sorting algorithm","sort algorithm"=>remain the more importance one
        same_phraselist = [ (t,vlist.index(t)) for t in vlist[:TOP_N_CONCEPT] if SamePhrase(t[0],phrase)==True]
        print(phrase,"/ same_phraselist:",same_phraselist)
        if(len(same_phraselist)>1): # there contain same phrases
            same_phraselist = sorted(same_phraselist, key=lambda tup: tup[1])[1:]
            print("sorted same_phraselist: ",same_phraselist)
            for t in same_phraselist:
                vlist.remove(t[0])
                print("remove!!!",t[0])
        # only 1 word and is substring of others ,remove this word (e.g."bubble" contained in "bubble sort")
        if len(phrase.split(' '))==1:
             similar_phraselist = [ (t,vlist.index(t)) for t in vlist[:TOP_N_CONCEPT] if SubPhrase(phrase,t[0])==True]
             print(phrase,"/ similar_phraselist:",similar_phraselist)
             if(len(similar_phraselist)>1):
                 vlist.remove(vocitem)
        #         print("remove!!!",phrase)
    print("newvlist:",vlist[:TOP_N_CONCEPT])
    return vlist
        
        
    
    
    print("========================\n\n\n\n\n")
    print("lenofvlist",len(vlist))
    print("vlist:")
    pprint(vlist[:TOP_N_CONCEPT])
    return vlist




if __name__ == '__main__':
    phrase = "Sorting"
    print (text_preprocess.PhraseReduction(phrase))
