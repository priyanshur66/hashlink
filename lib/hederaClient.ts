import { Client } from "@hashgraph/sdk";

// Creates a Hedera client without an operator (no private key required)
// Defaults to testnet. You can set HEDERA_NETWORK to "testnet" | "mainnet" | "previewnet"
export function getHederaClient(): Client {
  const network = process.env.HEDERA_NETWORK ?? "testnet";
  switch (network) {
    case "mainnet":
      return Client.forMainnet();
    case "previewnet":
      return Client.forPreviewnet();
    case "testnet":
    default:
      return Client.forTestnet();
  }
}
