import { utf8ToBytes } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';

// hash a message
export function hashMessage(message) {
	const bytes = utf8ToBytes(message.toString());
	const hash = keccak256(bytes);
	return hash;
}