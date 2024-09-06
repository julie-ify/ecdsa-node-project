import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex as toHex } from 'ethereum-cryptography/utils.js';
import { useEffect, useState } from 'react';
import { getAddress } from './util';

function Wallet({
	address,
	setAddress,
	privateKey,
	setPrivateKey,
	balance,
	setBalance,
}) {
	const [walletAddress, setWalletAddress] = useState('');

	useEffect(() => {
		async function fetchBalance() {
			if (address) {
				const {
					data: { balance },
				} = await server.get(`balance/${address}`);
				setBalance(balance);
			} else {
				setBalance(0);
			}
		}
		fetchBalance();
	}, [address]);

	async function onChange(evt) {
		const privateKey = evt.target.value;
		setPrivateKey(privateKey);

		// public key is derived from the private key
		const publicKey = secp256k1.getPublicKey(privateKey);
		// wallet address is derived from the public key
		const walletAddress = getAddress(publicKey);
		setWalletAddress(walletAddress);
		setAddress(toHex(publicKey));
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Private Key
				<input
					placeholder="Type a private key, for example: 0x1"
					value={privateKey}
					onChange={onChange}
				></input>
			</label>
			{walletAddress && (
				<code>Wallet Address: {walletAddress}</code>
			)}
			<div className="balance">Balance: {balance}</div>
		</div>
	);
}

export default Wallet;
