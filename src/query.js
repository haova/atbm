import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee } from "@cosmjs/stargate";
import { CHAIN, DENOM } from "./constants.js";
import {
  listWallet,
  loadWallet,
  lookupClient,
  lookupSignerClient,
  sameClient,
  unitToDenom,
} from "./utils.js";

export const queryBalance = async (address) => {
  const client = await lookupClient(address);

  const data = await client.getAllBalances(address);
  const result = {};

  for (const item of data) {
    const denom = DENOM[item.denom] || { unit: item.denom, value: 1 };
    result[denom.unit] ||= 0;
    result[denom.unit] += parseInt(item.amount) * denom.value;
  }

  return result;
};

export const getWallet = async (recovery, prefix) => {
  return await DirectSecp256k1HdWallet.fromMnemonic(recovery, {
    prefix,
  });
};

export const generateWallet = async (recovery) => {
  if (!recovery) {
    recovery = (await DirectSecp256k1HdWallet.generate(24)).mnemonic;
  }
  const addresses = [];

  for (const name in CHAIN) {
    const wallet = await getWallet(recovery, CHAIN[name].prefix);

    addresses.push({
      ...CHAIN[name],
      address: (await wallet.getAccounts())[0].address,
    });
  }

  return { recovery, addresses };
};

const normalTransfer = async (
  { recovery, prefix, address: fromAddress },
  toAddress,
  amount,
  denom
) => {
  const isSameClient = sameClient(fromAddress, toAddress);
  const wallet = await getWallet(recovery, prefix);
  const signingClient = await lookupSignerClient(fromAddress, wallet);
  const transferAmount = { denom, amount: amount.toString() };
  const fee = amount * 0.005;
  const feeRecord = {
    amount: [{ denom, amount: (fee < 1 ? 1 : fee).toString() }],
    gas: (200000).toString(),
  };

  let result;
  if (isSameClient) {
    result = await signingClient.sendTokens(
      fromAddress,
      toAddress,
      [transferAmount],
      feeRecord
    );
  } else {
    result = await signingClient.sendIbcTokens(
      fromAddress,
      toAddress,
      transferAmount,
      "transfer",
      "channel-0",
      {
        revisionHeight: 123,
        revisionNumber: 456,
      },
      Math.floor(Date.now() / 1000) + 60,
      feeRecord
    );
  }

  const { gasUsed } = result;

  return {
    fee: gasUsed * (DENOM[denom]?.value || 1),
    unit: DENOM[denom]?.unit || denom,
  };
};

export const transfer = async (fromWallet, toAddress, amount, unit) => {
  const denom = unitToDenom(unit);
  amount = parseFloat(amount) / (DENOM[denom]?.value || 1);

  return await normalTransfer(fromWallet, toAddress, amount, denom);
};
