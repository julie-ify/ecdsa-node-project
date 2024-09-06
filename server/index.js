const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { hashMessage, setInitialBalance } = require('./util');

app.use(cors());
app.use(express.json());

// public keys linked to their wallet balances
const balances = {
	'035d6995e02475ef2acf2664f60f95b25b0436dc68e69066bef86a70f87a5fb777': 100,
	'0295a5d8b7d2b9e87b42793d08816fbd22c4ca42db5bf607dea40db87f00de3696': 50,
	'029335cf0251ffde6c70f7a39f898ff53539d4fde7f1e9301a3a0b909db49f384a': 75,
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
		res.status(500).send({ message: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
