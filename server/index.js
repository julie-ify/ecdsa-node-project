const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { hashMessage, setInitialBalance } = require('./util');

app.use(cors());
app.use(express.json());

const balances = {
	'038d22de5b2be9685c32214a1f2182d15624fdec582fc3a2782bd67bdafb3cb372': 100,
	'020425743e27f6df6dc474bd60d8762b497d3abaa4af149983f70575510709be59': 50,
	'03b5604d3b9b5bc219c753de7980317c9ef425aa2c241fa6697a64b9f4b1858ee5': 75,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	try {
		const { sender, recipient, amount, r, s } = req.body;
		const messageHash = hashMessage(amount);

		// Reconstruct the signature from r and s
		const signature = { r: BigInt(r), s: BigInt(s) };

		// Verify the signature using the public key (sender)
		const isSigned = secp256k1.verify(
			signature,
			messageHash,
			sender // sender's public key
		);

		if (!isSigned) {
			return res.status(400).send({ message: 'Invalid signature!' });
		}

		setInitialBalance(sender, balances);
		setInitialBalance(recipient, balances);

		if (balances[sender] < amount) {
			res.status(400).send({ message: 'Not enough funds!' });
		} else {
			balances[sender] -= amount;
			balances[recipient] += amount;
			res.send({ balance: balances[sender] });
		}
	} catch (ex) {
		console.error('Server-side error:', ex.message);
		res
			.status(500)
			.send({ message: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
