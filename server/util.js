const { utf8ToBytes } = require('ethereum-cryptography/utils.js');
const { keccak256 } = require('ethereum-cryptography/keccak.js');

// hash a message
function hashMessage(message) {
	const bytes = utf8ToBytes(message.toString());
	const hash = keccak256(bytes);
	return hash;
}

function setInitialBalance(address, balances) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}

module.exports = { hashMessage, setInitialBalance }