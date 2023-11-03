#!/usr/bin/env node

import { program } from "commander";
import { dev } from "./commands/dev.js";
import { init } from "./commands/init.js";

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
    .option("-n, --fork-network [NAME]", "Name of the network to fork; optional. By default, it starts a new chain from genesis block.")
    .option("-b, --fork-block-num [number]", "Block number to fork at. By default, it's the latest block.")
    .action(dev);

// Parse program
program.parse();