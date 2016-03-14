var crypto = require('crypto-js');

var secretMessage = [{
	name: 'Andrew',
	secretName: '007'
}];

console.log(JSON.stringify(secretMessage));
console.log(secretMessage);
console.log(secretMessage[0].name);
var secretKey = '123abc';

var encryptedMessage = crypto.AES.encrypt(JSON.stringify(secretMessage), secretKey);
console.log('Encrypted Message: ' + encryptedMessage);

var bytes = crypto.AES.decrypt(encryptedMessage, secretKey);
var decryptedMessage = JSON.parse(bytes.toString(crypto.enc.Utf8));

console.log('Decrypted message: ' + decryptedMessage);
console.log(secretMessage[0].name);