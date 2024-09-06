const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { keccak256 } = require('ethereum-cryptography/keccak.js');
const { bytesToHex } = require('ethereum-cryptography/utils.js');

// Public Key to Address
function getAddress(publicKey) {
	const publicKeyHash = keccak256(publicKey);
	const address = bytesToHex(publicKeyHash.slice(-20));
	return address;
}

// generate private key
const generateWallet = () => {
	const privateKey = secp256k1.utils.randomPrivateKey();
	const publicKey = secp256k1.getPublicKey(privateKey);
	getAddress(publicKey);
	return publicKey;
};

generateWallet();


