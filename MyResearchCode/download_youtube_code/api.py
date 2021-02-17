#### youtube search by keywords ###
# refer to : https://developers.google.com/youtube/v3/docs/search/list
# Get some information:
# 1.videoid
# 2.title
# 3.published_time
# 4.channel_id
# 5.channel_title
# 6.thumbnail:return image url
def youtube_search(youtube,keyword,result_num):
    search_response = youtube.search().list(q=keyword,
    part='id,snippet',
    maxResults=result_num, #at most 50
    order = 'relevance'
    ).execute()
    videos = []
    for search_result in search_response.get('items', []):
        if search_result['id']['kind'] == 'youtube#video':
            data = {'videoid':search_result['id']['videoId'],
            'title':search_result['snippet']['title'],
            #'description':search_result['snippet']['description'],# not complete
            'published_time':search_result['snippet']['publishedAt'],
            'channel_id':search_result['snippet']['channelId'],
            'channel_title':search_result['snippet']['channelTitle'],
            'thumbnail':search_result['snippet']['thumbnails']['high']['url']}
            videos.append(data)
    return videos


#### list more detail about video  ###
# refer to : https://developers.google.com/youtube/v3/docs/captions/list
# Get some information:
# 1.duration
# 2.description
# 3.viewCount
# 4.likeCount
# 5.dislikeCount
# 6.tags
# (7.caption: boolean,return true or false)
######### (8. related videos id )############

def video_get_info(youtube, vlist):
    videos_info = []
    for item in vlist:
        vid = item['videoid']
        response = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=vid
        ).execute()
        #print("vid = ", vid)
        video = response['items'][0]
        data = {'duration':video['contentDetails']['duration'],
                'description':video['snippet']['description'],
                #'caption':video['contentDetails']['caption'],
                'viewCount': video['statistics']['viewCount'] if 'viewCount' in video['statistics'] else '0',
                'likeCount': video['statistics']['likeCount'] if 'likeCount' in video['statistics'] else '0',
                'dislikeCount' : video['statistics']['dislikeCount'] if 'dislikeCount' in video['statistics'] else '0',
                'tags' : video['snippet']['tags'] if 'tags' in video['snippet'] else []
               }
        videos_info.append(data)
    return videos_info
    
    
def video_get_channel_info(youtube, vlist):
    channel_info = []
    for video_item in vlist:
        request = youtube.channels().list(
        part='snippet,contentDetails,statistics',
        id= video_item['channel_id']
        ).execute()
        infos = request['items'][0]
        if infos['kind'] == 'youtube#channel':
            data = {'channel_title': infos['snippet']['title'],
                    'channel_description': infos['snippet']['description'],
                    'channel_viewcount': infos['statistics']['viewCount'] if 'viewCount' in infos['statistics'] else '0',
                    'channel_subscriberCount': infos['statistics']['subscriberCount'] if 'subscriberCount' in infos['statistics'] else '0',
                    'videoCount': infos['statistics']['videoCount'] if 'videoCount' in infos['statistics'] else '0'
                    }
            channel_info.append(data)
    return channel_info
        


##### Comment Threads ######
# refer to: https://developers.google.com/youtube/v3/docs/commentThreads/list
# get comment's information
# 1.videoid
# 2.textDisplay (textOriginal)
# 3.publishedAt
# 4.authorDisplayName
# 5.authorProfileImageUrl
def get_comment_threads(youtube, vlist):
    comments = []
    for video in vlist:
        vid = video['videoid']
        #print("vid = ",vid)
        try:
            results = youtube.commentThreads().list(
                part="snippet",#replies
                videoId=vid,
                maxResults=100, # at most 100 comments
                textFormat="plainText"## or 'html'
            ).execute()
            for item in results["items"]:
                if 'snippet' in item:
                    data = {
                        'videoId':item['snippet']['videoId'],
                        'textDisplay':item['snippet']['topLevelComment']['snippet']['textDisplay'],
                        'publishedAt':item['snippet']['topLevelComment']['snippet']['publishedAt'],
                        'authorDisplayName':item['snippet']['topLevelComment']['snippet']['authorDisplayName'],#
                        'authorProfileImageUrl':item['snippet']['topLevelComment']['snippet']['authorProfileImageUrl']#
                    }
                    comments.append(data)
        except:
            print("videoid: ",vid," do not have comments!")
    return comments
'''
############## Caption ##################
def download_caption(youtube, caption_id):#tfmt
    subtitle = youtube.captions().download(
      id=caption_id,
      tlang='en'
      ).execute()
    return subtitle

def list_captions(youtube, video_id):
    results = youtube.captions().list(
        part="snippet",
        videoId=video_id,
    ).execute()
    for item in results["items"]:
        caption_id = item["id"]
        name = item["snippet"]["name"]
        language = item["snippet"]["language"]
        if language == "en":
            #print("caption_id = ",caption_id)
            print ("Caption track '%s(%s)' in '%s' language."% (name, caption_id, language))
    return results["items"]
'''
