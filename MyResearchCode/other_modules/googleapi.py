###################################################################
# refer to:  https://cloud.google.com/natural-language/docs/categories?hl=zh-tw
# and : https://cloud.google.com/natural-language/docs/classify-text-tutorial?hl=zh-tw
# need the file to authenciate : My youtube Project 71686-6e199e090d27.json
#####################################################################
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import os

# Instantiates a client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "xxx.json"
client = language.LanguageServiceClient()
'''
def classify(text):
    """Classify the input text into categories. """
    language_client = language.LanguageServiceClient()
    document = language.types.Document(
        content=text,
        type=language.enums.Document.Type.PLAIN_TEXT)
    response = language_client.classify_text(document)
    categories = response.categories
    result = []#{}

    for category in categories:
        # Turn the categories into a dictionary of the form:
        #  {category.name: category.confidence}, so that they can be treated as a sparse vector.
        #result[category.name] = category.confidence
        result.append(category.name)
        #print(category.name,":",category.confidence)
    return result
'''

def classify(text):
    """Classify the input text into categories. """
    if len(text.split())<10:
        return []
    else:
        language_client = language.LanguageServiceClient()
        document = language.types.Document(
            content=text,
            type=language.enums.Document.Type.PLAIN_TEXT)
        try:
            response = language_client.classify_text(document)
            categories = response.categories
        except:
            categories=[]
        result = []#{}

        for category in categories:
            # Turn the categories into a dictionary of the form:
            #  {category.name: category.confidence}, so that they can be treated as a sparse vector.
            #result[category.name] = category.confidence
            result.append((category.name,category.confidence))
            #print(category.name,":",category.confidence)
    return result





# The text to analyze
'''
#text = u'Hello, world!'
# Detects the sentiment of the text
document = types.Document(
    content=text,
    type=enums.Document.Type.PLAIN_TEXT)
sentiment = client.analyze_sentiment(document=document).document_sentiment

print('Text: {}'.format(text))
print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))
'''
