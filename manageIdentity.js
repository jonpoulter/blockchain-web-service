const propertiesReader = require('properties-reader');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

//create signature.properties file with following properties
//message -> message to encrypt
//walletAddress -> your wallet address
//wif -> your private key in wallet import format
const props = propertiesReader('signature.properties');
const message = props.get('message');
const walletAddress = props.get('walletAddress');
const wif = props.get('wif');

console.log(`walletAddress is ${walletAddress}`);
console.log(`wif is ${wif}`);
console.log(`message is ${message}`);

//Wallet Import Format for Electrum Private Key
const keyPair = bitcoin.ECPair.fromWIF(wif);
const privateKey = keyPair.privateKey;

//Generate signature using private key
const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed);

console.log('**** BASE64 Signature below *******')
console.log(signature.toString('base64'));

//Verfiy message by decrypting signature using public key (derived from wallet address) and compare with message
console.log(bitcoinMessage.verify(message, walletAddress, signature));