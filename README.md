# ConceptGuide 

This repository is the official implementation of paper **ConceptGuide: Supporting Online Video Learning with ConceptMap-based Recommendation of Learning Path**. 



## Requirements

To install requirements:

```setup
pip install flask
pip install --upgrade google-api-python-client
pip install --upgrade google-auth google-auth-oauthlib goole-auth-httplib2
pip install webvtt-py
pip install scipy
pip install isodate
pip install textblob
pip install toposort
pip install python-rake
pip install google-cloud goole-cloud-storage google-cloud-language
pip install gensim
pip install wikipedia-API
```
Environment requirements:
 1. python 3
 2. node.js
 3. npm
 4. webpack 
 5. Google cloud project, service_account and API AOuth2.0 user authorization 
  * put client_secret.json and authorization json file into MyResearch folder.
  * change line 12 of googleapi.py under MyResearchCode/other_modules to own service_account.

## Run

To run the ConceptGuide system, run this command for frontend under folder MyReseachCode-vis.

```
npm run dev
```

To open backend, run this command under folder MyResearchCode.

```
python server.py
```

