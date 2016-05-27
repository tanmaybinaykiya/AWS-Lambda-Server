#Backend project

##Install

Make sure you have the [Serverless Framework](http://www.serverless.com) installed and you're using Node.js v4.0+. 
```
npm install serverless -g
```

Install project dependencies via npm:
```
npm install
```

Start Local Dynamo using:
```
docker run -i -t -p 7777:7777 tray/dynamodb-local -port 7777
```


Start Dev server using:
```
serverless offline start --s dev
```
