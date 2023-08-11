#!/usr/bin/env node

import { Command } from "commander";
import { generateWallet, queryBalance, transfer } from "./query.js";
import { listWallet, loadWallet, lookupWallet, saveWallet } from "./utils.js";
const program = new Command();

program
  .name("atbm")
  .description(
    "ATBM (AnToanBaoMat) \n+ Courses: An Toan Bao Mat He Thong Thong Tin \n+ Project: Inter-blockchain utilities"
  )
  .version("1.0.0");

program
  .command("balance")
  .description("Query the account balance")
  .argument("<string>", "account's address to lookup")
  .action(async (address) => {
    const result = await queryBalance(address);

    console.log(`Balance of "${address}": `);
    for (const unit in result) {
      console.log(`✔ ${result[unit]} ${unit}`);
    }
  });

program
  .command("wallet")
  .description("Generate a wallet")
  .option("--recovery <string>", "recovery phrases")
  .option("--name <string>", "saved name")
  .action(async ({ recovery, name }) => {
    const isSaved = !recovery && name;
    let info;

    if (isSaved) {
      info = loadWallet(name);
      console.log(`Your wallet has been saved as "${name}"`);
    } else {
      info = await generateWallet(recovery);
      console.log("Your wallet was generated:");
      console.log(`✔ Recovery Phrases: ${info.recovery}`);
    }

    for (const item of info.addresses) {
      console.log(`✔ ${item.name} Address: ${item.address}`);
    }

    if (!isSaved && name) {
      saveWallet(name, info);
      console.log(`Saved wallet as "${name}"`);
    }
  });

program
  .command("transfer")
  .argument("<from_address>", "from address")
  .argument("<to_address>", "to address")
  .argument("<amount>", "amount")
  .argument("<unit>", "unit")
  .action(async (fromAddress, ...args) => {
    const fromWalletInfo = lookupWallet(fromAddress);

    if (!fromWalletInfo) {
      return console.log(`Can not found ${fromAddress} in any wallet`);
    }

    console.log(`Transfering...`);
    await transfer(fromWalletInfo, ...args);
    console.log(`✔ Done`);
  });

program
  .command("list")
  .description("List all saved wallets")
  .action(async () => {
    console.log(
      `All wallets: \n${listWallet()
        .map((item) => `✔ ${item}`)
        .join("\n")}`
    );
  });

program.parse();
