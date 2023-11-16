#!/usr/bin/env node

import { program } from "commander";
import { dev } from "./commands/dev";
import { init } from "./commands/init";
import { deploy } from "./commands/deploy";

/// Metadata
program
  .name('poly-scaffold')
  .description('CLI tool to initialise a fully-integrated Polygon project and interact with it')
  .version('0.0.1 (beta)');

//// Add commands

// Init
program
    .command("init")
    .description("Initialises a Poly-Scaffold project in the current directory")
    .argument("[project-name]", "Name of the project; optional")
    .action(init);

// Dev
program
    .command("dev")
    .description("Starts a local dev environment - a local blockchain (hardhat) and a local FE (Next.js) server")
    .option("-n, --fork-network-name [NAME]", "Name of the network to fork; optional. By default, it starts a new chain from genesis block.")
    .option("-b, --fork-block-num [number]", "Block number to fork at. By default, it's the latest block.")
    .option("-r, --reset-on-change", "Resets the entire local blockchain when any code is changed; for forked mode, it resets back to forked block number; NOT DEFAULT")
    .action(dev);

// Deploy
  program
    .command("deploy")
    .description("Deploys the smart contracts and frontend app to production")
    .option("-n, --network-name <NAME>", "Name of the network to deploy smart contracts to.")
    .option("--only-smart-contracts", "Deploys only smart contracts and updates `smart-contracts-production.json`")
    .option("--only-frontend", "Deploys only smart contracts and updates `smart-contracts-production.json`")
    .action(deploy);

// Parse program
program.parse();