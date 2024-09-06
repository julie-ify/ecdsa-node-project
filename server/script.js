const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { toHex } = require('ethereum-cryptography/utils.js');

// generate private key
const generateWallet = () => {
	const privateKey = toHex(secp256k1.utils.randomPrivateKey());
	const publicKey = toHex(secp256k1.getPublicKey(privateKey));
	return publicKey;
};

generateWallet();
