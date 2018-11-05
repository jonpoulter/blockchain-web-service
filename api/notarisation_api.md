# Notarisation API

## Request Validation

The Identity of the request is added to mempool awaiting validation within prescribed seconds threshold defined by `validationWindow` property.  Identity of a request is derived as follows:

`````
<address>:<timestamp>:starRegistry

`````

This is an idempotent operation and will return the original response whilst the identity remains in the mempool.
 
 
 **URL**: `/requestValidation`  
**URL Parameters**: N/A  
**Method**: `POST`  
**Data**:  Provide identity to be added to mempool 
 

```
{
	"address": "[wallet address]",
}
```  
**Data Example**:  
   
```
{
	"address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
}
```
### Success Response

**Condition**: If system is online and body property exists  
**Code**: `200 OK`  
**Content Example**:  

```
{
    "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
    "requestTimeStamp": 1540829497754,
    "message": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9:1540829497754:starRegistry",
    "validationWindow": 300
}
```

### Error Responses

**Condition**: If address property doesn't exist in request payload  
**Code**: `400 BAD REQUEST`  
**Content Example**: 
    
```
{
    "errors": [
        {
            "location": "body",
            "param": "address",
            "msg": "Invalid value"
        }
    ]
}
```

## Validate Message Signature

Application validates Identity.  Once validated; the user is granted access to register a single star.

**URL**: `/message-signature/validate`  
**URL Parameters**: N/A  
**Method**: `POST`   
**Data**: Provide wallet address and Identity Signature


```
{
	"address": [wallet address],
	"signature": [base64 encoded signature of returned identity]
}

```

**Data Example**: 


```
{
	"address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
	"signature": "ILo4rAdUU0klNmAI6PMHbTt/RdgsfIn8Cgqznr+Nup1BaDK3RUoNEi45Wg+0vsij0SggFO0IhN2HaqazIiR+xec="
}

```

### Success Response



## Add Block

Adds a block to the blockchain.

**URL**: `/block`  
**URL Parameters**: N/A  
**Method**: `POST`  
**Data**:  Provide star and associated address to be added to Block  

```
{
	"address": "[unicode 1 char minimum]",
	"star": {
		"dec": "[mandatory: degrees arc-minutes arc-seconds e.g -49 21 38.1]",
		"ra": "[mandatory: hours minutes seconds e.g 13 03 33.35]",
		"mag": "[optional: magnitude (number)]",
		"const": "[optional: constallation (string)]",
		"story": "[mandatory: hex encoded ascii string limited to 250 words/500 bytes]" 
	}
}
```  
**Data Example**:  
   
```
{
	"address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
	"star" : {
		"dec": "-26 29 24.9",
		"ra": "16 29 1.0",
		"story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f0a"
	}
}
```
### Success Response

**Condition**: If system is online and body property exists  
**Code**: `200 OK`  
**Content Example**:  

```
{
    "registerStar": true,
    "status": {
        "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
        "requestTimeStamp": 1540909339093,
        "message": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9:1540909339093:starRegistry",
        "validationWindow": 151,
        "messageSignature": "valid"
    }
}
```

### Error Responses

**Condition**: message signature is invalid  
**Code**: `400 BAD REQUEST`  
**Content Example**: 
    
```
   {
    "registerStar": false,
    "status": {
        "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
        "requestTimeStamp": 1540909339093,
        "message": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9:1540909339093:starRegistry",
        "validationWindow": 291,
        "messageSignature": "invalid"
    }
```

**Condition**: signature and/or address missing in payload  
**Code**: `400 BAD REQUEST`  
**Content Example**: 
    
```
  {
    "errors": [
        {
            "location": "body",
            "param": "signature",
            "msg": "Invalid value"
        }
    ]
}
```

**Condition**: Application has not validated Identity. 
**Code**: `401 UNAUTHORIZED`  
**Content Example**: 

```
{
    "error": "not granted access to starRegistry"
}

```
