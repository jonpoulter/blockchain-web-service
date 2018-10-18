# Blockchain Web Service

Simple example of a RESTful Web API with Node.js allowing interaction with a backend blockchain using LevelDB

## Getting Started

### Prerequisites

Installing node and NPM is relatively straightforward using the installer package available from the [Node.js web site](https://nodejs.org/en/]) 

Also to interact with the REST service it is recommended [curl](https://github.com/curl/curl) or [Postman](https://www.getpostman.com/) is used. 

### Configuring your project

- Use NPM to install project dependencies

```
npm install
```

### Running Service

Under `blockchain-web-service` directory execute the following command:

```
node index.js
```

The service is now listening on your loopback address on port `8000`.  On first start up the genesis block will be created and leveldb directory `chaindata` will be created under the project root directory.  The genesis block is assigned the block height `0`.  

 

## REST API

## Get Block

Retrieve block details at block height

**URL**: `/block/:height`  
**URL Parameters**: `height=[integer]` where `height` is the block height  
**Method**: `GET`  
**Data**:  N/A

### Success Response

**Condition**: If Block associated with the key specified by `height` path parameter exists  
**Code**: `200 OK`  
**Content Example**: 

```
{
  "hash": "2421e57373c1c3db7288f9132c273429889b1c7b121db623adb727914868e854",
  "height": 0,
  "body": "First block in the chain - Genesis block",
  "time": "1539879762",
  "previousBlockHash": ""
}
```

### Error Responses

**Condition**: If Block associated with the key specified by `height` path parameter doesn't exist   
**Code**: `404 NOT FOUND`  
**Content**: N/A

## Add Block

Adds a block to the blockchain.

**URL**: `/block`  
**URL Parameters**: N/A  
**Method**: `POST`  
**Data**:  Provide body to be added to Block  

```
{
	"body": "[unicode 1 char minimum]"
}
```  
**Data Example**:  
   
```
{
	"body": "This is a test message"
}
```
### Success Response

**Condition**: If system is online and body property exists  
**Code**: `201 CREATED`  
**Content Example**:  

```
{
    "hash": "db79bce3accdd29e297b598a1c373094ff89cf110f2d6c4fdc2c5a8556dd3120",
    "height": 2,
    "body": "Testing block with test string data 2",
    "time": "1539882036",
    "previousBlockHash": "afa07f776463a75e4259964cb47d00d3185270487b1cc4c8cc5312d031bd1406"
}
```

### Error Responses

**Condition**: If body property doesn't exist in request payload  
**Code**: `400 BAD REQUEST`  
**Content Example**: 
    
```
{
    "errors": [
        {
            "location": "body",
            "param": "body",
            "msg": "Invalid value"
        }
    ]
}
```
