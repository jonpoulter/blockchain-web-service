# Notarisation API

## Request Validation

The Identity of the request is added to mempool awaiting validation within prescribed seconds threshold defined by `validationWindow` property.  Identity of a request is derived as follows:

`````
<address>:<timestamp>:starRegistry

`````

This is an idempotent operation and will return the original request whilst the identity remains in the mempool.
 
 
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

**Condition**: address not found in mempool.    
**Code**: `400 BAD REQUEST`  
**Content Example**: 

```
{
	"error": "address not found in mempool"
}
```


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
		"story": "[mandatory: ascii string limited to 250 characters]" 
	}
}
```  
**Data Example**:  
   
```
{
	"address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
	"star": {
		"dec": "33, 29' 24.9",
		"ra": "16 24 1.0",
		"story": "Found star using https://www.google.com/sky/"
	}
}

```

### Success Response

**Condition**: If signature has been validated  
**Code**: `200 OK`  
**Content Example**: 

```

{
    "hash": "f6a0c3eb76f21d049d6ba1a74dc03b85106481f7d3c4e21e6ecfc456229f2933",
    "height": 2,
    "body": {
        "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
        "star": {
            "dec": "33, 29' 24.9",
            "ra": "16 24 1.0",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1541606531",
    "previousBlockHash": "e72f95ebe0ee7b05e553ef8919d0c4d60b65c8816ae62bea5b1208a23585e2d7"
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

**Condition**: dec, ra or story missing or story length not in permitted range.  
**Code**: `400 BAD REQUEST`  
**Content Example**: 

```
{
    "errors": [
        {
            "location": "body",
            "param": "star.story",
            "value": "",
            "msg": "Invalid value"
        }
    ]
}

```
