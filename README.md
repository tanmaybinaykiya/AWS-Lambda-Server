# AWS Serverless based NodeJS REST Server
## Install

Make sure you have the [Serverless Framework](http://www.serverless.com) installed and you're using Node.js v4.0+. 

```sh
npm install serverless -g
```

Install project dependencies via npm:

```sh
npm install
```

Start Local Dynamo using:

```sh
docker run -i -t -p 7777:7777 tray/dynamodb-local -port 7777  -sharedDb
```

Start Dev server using:

```sh
serverless offline start --s dev
```
