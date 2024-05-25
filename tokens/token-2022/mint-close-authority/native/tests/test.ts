import { Buffer } from "node:buffer";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
	Connection,
	Keypair,
	PublicKey,
	SYSVAR_RENT_PUBKEY,
	SystemProgram,
	Transaction,
	TransactionInstruction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as borsh from "borsh";

function createKeypairFromFile(path: string): Keypair {
	return Keypair.fromSecretKey(
		Buffer.from(JSON.parse(require("node:fs").readFileSync(path, "utf-8"))),
	);
}

class Assignable {
	constructor(properties) {
		Object.keys(properties).map((key) => {
			return (this[key] = properties[key]);
		});
	}
}

class CreateTokenArgs extends Assignable {
	toBuffer() {
		return Buffer.from(borsh.serialize(CreateTokenArgsSchema, this));
	}
}
const CreateTokenArgsSchema = new Map([
	[
		CreateTokenArgs,
		{
			kind: "struct",
			fields: [["token_decimals", "u8"]],
		},
	],
]);

describe("Create Token", async () => {
	const connection = new Connection(
		"https://api.devnet.solana.com/",
		"confirmed",
	);
	const payer = createKeypairFromFile(
		`${require("node:os").homedir()}/.config/solana/id.json`,
	);
	const program = createKeypairFromFile(
		"./program/target/deploy/program-keypair.json",
	);

	it("Create a Token-22 SPL-Token !", async () => {
		const mintKeypair: Keypair = Keypair.generate();

		const instructionData = new CreateTokenArgs({
			token_decimals: 9,
		});

		const instruction = new TransactionInstruction({
			keys: [
				{ pubkey: mintKeypair.publicKey, isSigner: true, isWritable: true }, // Mint account
				{ pubkey: payer.publicKey, isSigner: false, isWritable: true }, // Mint authority account
				{ pubkey: payer.publicKey, isSigner: false, isWritable: true }, // Mint close authority account
				{ pubkey: payer.publicKey, isSigner: true, isWritable: true }, // Transaction Payer
				{ pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // Rent account
				{ pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
				{ pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // Token program
			],
			programId: program.publicKey,
			data: instructionData.toBuffer(),
		});

		const signature = await sendAndConfirmTransaction(
			connection,
			new Transaction().add(instruction),
			[payer, mintKeypair],
		);

		console.log("Token Mint Address: ", mintKeypair.publicKey.toBase58());
		console.log("Transaction Signature: ", signature);
	});
});
