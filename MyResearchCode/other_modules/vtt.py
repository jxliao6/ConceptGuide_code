from webvtt import WebVTT 


def combine(vtt_filename):
    line = ""
    for caption in WebVTT().read(vtt_filename):
        #print(caption.start)
        new_texts = caption.text.replace("  "," ").split('\n')
        for new_text in new_texts:
            if(line.find(new_text)==-1):
                line = line +" "+new_text
    #print(line)
    return line.replace("  "," ")