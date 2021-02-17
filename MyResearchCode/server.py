# import sys
from flask import Flask, send_file, send_from_directory, request, Response
from download_youtube_code import api,auth_api
import download
import os
import json
import pickle
import subprocess



app = Flask(__name__)
ROOT = "vis_json/"


@app.route('/', methods=['GET'])
def index():
    return send_file(ROOT + 'final.json')

@app.route('/SearchHistory/', methods=['GET'])
def SearchHistory():
    with open("result/analyze_result.pkl", "rb") as pkl_file:
        data = pickle.load(pkl_file)
    # print("We have already search:",data.keys())
    # data.keys()
    newlist=[]
    for strr in list(data.keys()):
        newlist.append(' '.join(strr.split('_')[:-1]))
    resp = Response(json.dumps(newlist))
    # resp = Response(json.dumps(list(data.keys())))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp


############################
@app.route('/Download/<Keyword>', methods=['GET'])
def Download(Keyword):
    amount = '50'
    print("start download :",Keyword,"...")
    download.main(service,Keyword,amount)
    subprocess.call(['python','video_filter.py',Keyword,amount])
    
    data= {"finish":True}
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/Comment_Analyze/<Keyword>', methods=['GET'])
def Comment_Analyze(Keyword):
    amount = '50'
    print("start comment analyze :",Keyword,"...")
    subprocess.call(['python','comment_analyze.py',Keyword,amount])
    
    data= {"finish":True}
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/Caption_Analyze/<Keyword>', methods=['GET'])
def Caption_Analyze(Keyword):
    amount = '50'
    print("start caption analyze :",Keyword,"...")
    subprocess.call(['python','caption_analyze.py',Keyword,amount])
    print("start write into json file : ....")
    subprocess.call(['python','read_analyze_result.py',Keyword,amount])
    
    data= {"finish":True}
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp


#################################
### fo anaylze ####
@app.route('/Analyze/<Keyword>', methods=['GET'])
def Analyze(Keyword): ##total flow
    amount = '50'
    print("start download :",Keyword,"...")
    # subprocess.call(['python','download.py',Keyword,amount])
    download.main(service,Keyword,amount)
    subprocess.call(['python','video_filter.py',Keyword,amount])
    
    print("start comment analyze :",Keyword,"...")
    subprocess.call(['python','comment_analyze.py',Keyword,amount])
    
    print("start caption analyze :",Keyword,"...")
    subprocess.call(['python','caption_analyze.py',Keyword,amount])
    
    print("start write into json file : ....")
    subprocess.call(['python','read_analyze_result.py',Keyword,amount])
    
    data= {"finish":True}
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp




@app.route('/GetJson/', methods=['GET'])
def GetJson():
    f = open('vis_json/final.json','r')
    data = json.load(f)
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp


@app.route('/GetJson_bitcoin/<index>', methods=['GET'])
def GetJson_bitcoin(index):
    if index=='0':
        f = open('vis_json/bitcoin_introduction.json','r')
    elif index=='1':
        f = open('vis_json/bitcoin_mining.json','r')
    elif index=='2':
        f = open('vis_json/NLP_intro.json','r')
    elif index=='3':
        f = open('vis_json/NLP.json','r')
    elif index=='4':
        f = open('vis_json/4.json','r')
    elif index=='5':
        f = open('vis_json/5.json','r')
    data = json.load(f)
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp

## For already analyze <keyword> ##
@app.route('/GetAnalyzeResult/<KeywordStr>', methods=['GET'])
def GetAnalyzeResult(KeywordStr):
    # amount = str(KeywordStr.split('_')[-1])
    # keyword = KeywordStr[:(len(KeywordStr)-len(amount)-1)]
    keyword = KeywordStr.replace(' ','_')
    amount = "50"
    print("keyword/amount:",keyword,amount)
    subprocess.call(['python','read_analyze_result.py',keyword,amount])
    f = open('vis_json/final.json','r')
    data = json.load(f)
    resp = Response(json.dumps(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp
    

@app.route('/DeleteAnalyzeResult/<KeywordStr>', methods=['GET'])
def DeleteAnalyzeResult(KeywordStr):
    with open("result/analyze_result.pkl", "rb") as pkl_file:
        data = pickle.load(pkl_file)
        pkl_file.close()

    if KeywordStr in data:
        del data[KeywordStr]

    # # restore in pkl
    output = open('result/analyze_result.pkl', 'wb')
    pickle.dump(data, output)
    output.close()
    
    resp = Response(json.dumps(list(data.keys())))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Content-Type'] = 'application/json'
    return resp
    


if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    service = auth_api.get_authenticated_service()

    PORT=8001
    app.run('0.0.0.0', PORT,threaded=True)
   
