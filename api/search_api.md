# Search API

## Get Block By Height

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
    "hash": "d9d3d9fa530513a7379f898d815d8dc111994c3aa8ad6ef5ee8cf2c152caa78a",
    "height": 9,
    "body": {
        "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
        "star": {
            "dec": "33, 29' 24.9",
            "ra": "16 24 1.0",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f0a"
        }
    },
    "time": "1541524650",
    "previousBlockHash": "130c3cf1b5b73f3efe8b01c1730446295be6d10af952de0a40a2d1c5b92987c4"
}
```

### Error Responses

**Condition**: If Block associated with the key specified by `height` path parameter doesn't exist   
**Code**: `404 NOT FOUND`  
**Content**: N/A

## Get Block By Hash

Retrieve Block Details associated with hash.

**URL**: `/stars/hash/:hash`  
**URL Parameters**: `hash=[64 character hexidecimal]` where `hash` is the block hash  
**Method**: `GET`  
**Data**:  N/A

### Success Response

**Condition**: If Block associated with the hash specified by `hash` path parameter exists  
**Code**: `200 OK`  
**Content Example**: 

```
{
    "hash": "3deac4366ba999809f8c1a22a9ac4a27c01d430ea11970d555c2ab3018d91524",
    "height": 7,
    "body": {
        "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
        "star": {
            "dec": "-26 29 24.9",
            "ra": "16 29 1.0",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f0a"
        }
    },
    "time": "1540831238",
    "previousBlockHash": "4a5cb9c95b5633a8d29d53442bf77d155b7975b12459de772a6b7006b3dc6ad6"
}
```

### Error Responses

**Condition**: If Block associated with the hash specified by `hash` path parameter doesn't exist   
**Code**: `404 NOT FOUND`  
**Content**: N/A

## Get Blocks By Wallet Address

Retrieve Blocks associated with wallet address.

**URL**: `/stars/address/:address`  
**URL Parameters**: `address=[base58 encoded]` where `address` is the wallet address  
**Method**: `GET`  
**Data**:  N/A

### Success Response

**Condition**: If 0 or more blocks associated with the hash specified by `wallet address` path parameter exist
**Code**: `200 OK`  
**Content Example**: 

```
[
    {
        "hash": "133e4264d86332e23bfb6c37c15d870ffa8fa31cf0e92b7dd66de60102dc60b4",
        "height": 2,
        "body": {
            "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
            "star": {
                "dec": "-26, 29 24.9",
                "ra": "16h 29m 1.0",
                "story": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1540828745",
        "previousBlockHash": "60afb96ccaf72f2a015aa2b3f5f9a91d081f80ab7f3bd731868b76e7681c9973"
    },
    {
        "hash": "dbe1eff5d8432c8e27a3d2b71914327c5579bb527615d35493b9df2771282055",
        "height": 3,
        "body": {
            "address": "1JPUM1oE3VUDnULtxB4k19jtunduhrABU9",
            "star": {
                "dec": "-43, 22 45",
                "ra": "12 11 32",
                "story": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1540828972",
        "previousBlockHash": "133e4264d86332e23bfb6c37c15d870ffa8fa31cf0e92b7dd66de60102dc60b4"
    }
]
```
