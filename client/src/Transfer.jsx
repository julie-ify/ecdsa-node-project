import { useState } from 'react';
import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex as toHex } from 'ethereum-cryptography/utils.js';
import { hashMessage } from './util';

function Transfer({ setBalance, privateKey }) {
	const [sendAmount, setSendAmount] = useState('');
	const [recipient, setRecipient] = useState('');

	const setValue = (setter) => (evt) => setter(evt.target.value);

	async function transfer(evt) {
		evt.preventDefault();
		try {
			const messageHash = hashMessage(sendAmount);
			const signature = secp256k1.sign(messageHash, privateKey);
			const r = signature.r.toString();
			const s = signature.s.toString();
			const publicKey = toHex(secp256k1.getPublicKey(privateKey));

			const {
				data: { balance },
			} = await server.post(`send`, {
				sender: publicKey,
				r,
				s,
				amount: parseInt(sendAmount),
				recipient,
			});

			setBalance(balance);
		} catch (ex) {
			console.error('Error:', ex.response ? ex.response.data.message : ex.message)
			alert(`Error: ${ex.response ? ex.response.data.message : ex.message}`);
		}
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="1, 2, 3..."
					value={sendAmount}
					onChange={setValue(setSendAmount)}
					required
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipient}
					onChange={setValue(setRecipient)}
					required
				></input>
			</label>

			<input type="submit" className="button" value="Transfer" />
		</form>
	);
}

export default Transfer;
