# Feature 5: Distributional Asymmetry Distance
# Complexity Level Distance
def calculate_f4(Prob_ConceptPairs,voc_appear_dict,word_freq_dict,model):
    num_of_videos = len(word_freq_dict)
    for item in Prob_ConceptPairs:
        (a,b) = item
        f4_value = (len(voc_appear_dict[a])- len(voc_appear_dict[b]))/num_of_videos
        Prob_ConceptPairs[item]['f4'] = f4_value
    return Prob_ConceptPairs