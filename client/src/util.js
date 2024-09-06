import { utf8ToBytes, bytesToHex as toHex } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';

// hash a message
export function hashMessage(message) {
	const bytes = utf8ToBytes(message.toString());
	const hash = keccak256(bytes);
	return hash;
}

// Public Key to Address
export function getAddress(publicKey) {
	const publicKeyHash = keccak256(publicKey);
	const address = toHex(publicKeyHash.slice(-20));
	return address;
}
