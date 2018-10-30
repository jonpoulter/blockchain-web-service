const express = require('express');
const cacheControl = require('express-cache-controller');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const simpleChain = require('./simpleChain');
const blockchain = new simpleChain.Blockchain('chaindata');
//temporarily stores identities for configured timeWall period that have requested validation
const mempool = new Map();
//stores addresses that have been granted access
const accessGrants = new Set();


const app = express();
const port = 8000;
//5 minute mempool timewall
const timeWall = 300000;

//set cache-control to no-cache
app.use(cacheControl({
    noCache: true
}))

//parse application/json in the request body
app.use(bodyParser.json())

//remove ETag header
app.disable('etag');

//uri only matches when height is an integer equal or greater than 0
app.get('/block/:height(\\d+)', (req, res) => {
    
    console.log(`/block/${req.params.height}`);
    const height = req.params.height;
    blockchain.getBlock(height)
    .then(block => res.json(JSON.parse(block)))
    .catch(err => {
        res.json({ error: `${err}`})
    });
});

app.get('/stars/address/:address', (req, res) => {

    console.log(`/stars/address/${req.params.address}`);
    const address = req.params.address;
    let matches = [];
    blockchain.getBlocks()
              .then(blocks => {
                for (let block of blocks) {
                    block = JSON.parse(block);
                    console.log(`block address is ${block.body.address}`);
                    if (block.body.address == address) {
                        matches.push(block);
                    }
                }
                res.status(200).json(matches);
              })
              .catch(e => res.status(500).json({error: e}));
});

app.get('/stars/hash/:hash', (req, res) => {

    console.log(`/stars/hash/${req.params.hash}`);
    const hash = req.params.hash;
    blockchain.getBlocks()
            .then(blocks => {
                for (let block of blocks) {
                    block = JSON.parse(block);
                    if (block.hash == hash) {
                        res.status(200).json(block);
                    }
                }
                res.status(200).json({"status":"not found"});
            })
});

/*app.post('/block', [check('body').isLength({min:1})], (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    } else { 
        blockchain.addBlock(new simpleChain.Block(req.body.body))
                .then(b => res.status(201).json(JSON.parse(b)))
                .catch(e => res.status(500).json({error: e}));
    } 
});*/

app.post('/block', [check('address').isLength({min:1}), check('star').exists(), check('star.dec').exists(), check('star.ra').exists(), check('star.story').isLength({min:2,max:500})], (req,res) => {

    console.log('/block');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } else {

        if (accessGrants.has(req.body.address)) {
            console.log(`submitted story is: ${Buffer.from(req.body.star.story, 'hex')}`);

            accessGrants.delete(req.body.address);

            blockchain.addBlock(new simpleChain.Block(req.body))
                .then(b => res.status(201).json(JSON.parse(b)))
                .catch(e => res.status(500).json({error: e}));
        } else {
            res.status(401).json({"error": "not granted access to starRegistry"});
        }
        
    }
});

//accept a blockchain ID (public wallet address) with a a unconfirmed validation request for a star registration.
//the response provides a message that the user should sign within configured timewall
app.post('/requestValidation', [check('address').isLength({min:1})], (req, res) => {

    console.log(`/requestValidation`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    } else  {

        var entry = mempool.get(req.body.address);
        if (entry == undefined) {

            const timestamp = Date.now();
            console.log(`adding id ${req.body.address} to mempool`);
            const entry = {  "address": req.body.address, 
                                "requestTimeStamp": timestamp, 
                                "message": `${req.body.address}:${timestamp}:starRegistry`,
                                "validationWindow":timeWall/1000}
            mempool.set(req.body.address, entry);
            setTimeout(function() {
                console.log(`attempting to remove id ${req.body.address} from mempool: ${mempool.delete(req.body.address)}`);
            }, timeWall);
           
            res.status(201).json(entry);
        } else {

            entry.validationWindow = Math.round((timeWall - (Date.now() - entry.requestTimeStamp))/1000);
            res.status(200).json(entry);
        }
        
       
    }
})

app.post('/message-signature/validate', [check('address').isLength({min:1}), check('signature').isLength({min:1})], (req,res) => {

    console.log(`/message-signature/validate`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    } else {
        //retrieve msg from mempool keyed on wallet address
        const entry = mempool.get(req.body.address);
        if (entry == undefined) {
            res.status(400).json({"error":"address not found in mempool"});
            
        } else {
            //decrypt signature and compare message in entry
            console.log(`msg is ${entry.message}`);
            const verified = bitcoinMessage.verify(entry.message, req.body.address, req.body.signature);

            if (verified) {
                accessGrants.add(req.body.address);
                const response = {
                    "registerStar": true,
                    "status": {
                        "address": req.body.address,
                        "requestTimeStamp": entry.requestTimeStamp,
                        "message": entry.message,
                        "validationWindow": Math.round((timeWall - (Date.now() - entry.requestTimeStamp))/1000),
                        "messageSignature": "valid"
                    }
                }
                res.status(200).json(response);
            } else {
                const response = {
                    "registerStar": false,
                    "status": {
                        "address": req.body.address,
                        "requestTimeStamp": entry.requestTimeStamp,
                        "message": entry.message,
                        "validationWindow": Math.round((timeWall -(Date.now() - entry.requestTimeStamp))/1000),
                        "messageSignature": "invalid"
                    }
                }
                res.status(400).json(response);
            }
        }
    }
}) 

app.listen(port, () => {
    console.log(`web service listening on port ${port}!`)}
);

