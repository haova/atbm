import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { DENOM, RPC } from "./constants.js";
import { join } from "node:path";

const root = join(homedir(), ".atbm");
mkdirSync(root, { recursive: true });

export const lookupClient = async (address) => {
  for (const name in RPC) {
    if (address.indexOf(name) === 0)
      return await StargateClient.connect(RPC[name]);
  }

  throw new Error(`Invalid address: ${address}`);
};

export const lookupSignerClient = async (address, signer) => {
  for (const name in RPC) {
    if (address.indexOf(name) === 0)
      return await SigningStargateClient.connectWithSigner(RPC[name], signer);
  }

  throw new Error(`Invalid address: ${address}`);
};

export const listWallet = () => {
  return readdirSync(root);
};

export const saveWallet = (name, info) => {
  const path = join(root, name);
  writeFileSync(path, JSON.stringify(info));
};

export const loadWallet = (name, info) => {
  return JSON.parse(readFileSync(join(root, name)));
};

export const lookupWallet = (address) => {
  const ls = listWallet();

  let recovery, prefix;
  for (const name of ls) {
    const info = loadWallet(name);
    for (const item of info.addresses)
      if (item.address === address) {
        prefix = item.prefix;
        recovery = info.recovery;
        break;
      }

    if (recovery) break;
  }

  if (!recovery) return null;

  return { recovery, prefix, address };
};

export const unitToDenom = (unit) => {
  for (const denom in DENOM) {
    if (DENOM[denom].unit.toLowerCase() === unit.toLowerCase()) return denom;
  }

  return unit;
};

export const sameClient = (addr1, addr2) => {
  return addr1.split("1")[0] === addr2.split("1")[0];
};
