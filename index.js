const express = require('express');
const cacheControl = require('express-cache-controller');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');
const simpleChain = require('./simpleChain');
const blockchain = new simpleChain.Blockchain('chaindata');

const app = express();
const port = 8000;

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
    
    const height = req.params.height;
    blockchain.getBlock(height)
    .then(block => res.json(JSON.parse(block)))
    .catch(err => {
        res.json({ error: `${err}`})
    });
});

app.post('/block', [check('body').isLength({min:1})], (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    } else { 
        blockchain.addBlock(new simpleChain.Block(req.body.body))
                .then(b => res.status(201).json(JSON.parse(b)))
                .catch(e => res.status(500).json({error: e}));
    } 
});

app.listen(port, () => {
    console.log(`web service listening on port ${port}!`)}
);

