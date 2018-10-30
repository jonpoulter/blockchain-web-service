# Blockchain Notary Web Service

Simple example of a RESTful Web API with Node.js allowing interaction with a backend blockchain using LevelDB.  The concepts are illustrated via a notary service that allows end users to notarize ownership of a digital asset; in this case a [star](https://www.google.com/sky/).

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

The REST API is comprised of notary related actions as well as search functionality.

- [Notarisation API](api/notarisation_api.md)

- [Search API](api/search_api.md)

