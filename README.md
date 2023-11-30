# Polygon DApp Scaffold

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
    - [Initialising a project](#initialising-a-project)
    - [Setting up enviroment variables](#setting-up-enviroment-variables)
    - [Starting a dev environment](#starting-a-dev-environment)
    - [Deploying](#deploying)
    - [Help](#help)
- [Project structure](#project-structure)
    - [Frontend](#frontend)
    - [Smart contracts](#smart-contracts)
- [Contributing](#contributing)
- [FAQs](#faqs)

## Introduction
Polygon DApp Scaffold is a CLI tool to quickly initialise a fully-integrated Polygon DApp, create a development environment, and deploy everything to production.

Every step of the way is automated!

## Node version
Node >v16.14.x is supported, although Node v18.x.x is recommended.

Before going on with installation, make sure to switch to a supported Node version.

To easily manage different npm versions on your system, we recommend using [nvm](https://github.com/nvm-sh/nvm).

## Installation
Install the package globally, and the tool will be accessible anywhere.
```
npm install -g @0xpolygon/polygon-dapp-scaffold
```

## Usage

### Initialising a project
To initialise a project, simply run:
```
create-polygon-dapp init [YOUR PROJECT NAME]
```

This will create a new directory in your current directory, and initialise a minimal DApp project inside it, then proceed to install all required packages.

By default, the scaffolded project is in javascript. To use typescript or any other template, use `--template NAME` option.

To get a list of available templates (for use in above option), run `list scaffold-templates`.

### Setting up enviroment variables
Before starting anything, set up the environment variables in both the `frontend` and `smart-contracts` suub-folders, in a `.env` file. Example env files are provided for each, in `.env.example`.

#### WalletConnect Project ID
To get a WalletConnect Project ID, Head over to [WalletConnect Cloud](https://cloud.walletconnect.com/) and create a new project. This will generate a project ID which you can then use.

### Starting a dev environment
To start a development environment, use:
```
create-polygon-dapp dev
```

And this will start a fully integrated dev environment - a local dev blockchain and a local Frontend dev server! Any change in the code automatically updates both the frontend and the smart contracts; no manual reload is necessary!

This will also generate some funded test wallets for you in this test chain, which you can use to develop your DApp.

You may also start this local chain by forking Ethereum or any Polygon chains. Just run:
```
create-polygon-dapp dev -n polygonZkevm
```

To see all available options, run:
```
create-polygon-dapp dev -h
```

See [Project structure](#project-structure) to learn about how the dev environment is structured.

### Deploying
To deploy your project to production, run:
```
create-polygon-dapp deploy -n CHAIN_NAME
```

This will do 2 things:
- Deploy all your smart contracts to the selected chain, and log the deployment results.
- Deploy your frontend to Vercel, and log the deployment URL.

To deploy only the smart contracts, run:
```
create-polygon-dapp deploy -n CHAIN_NAME --only-smart-contracts
```

And to deploy only the frontend, run:
```
create-polygon-dapp deploy -n CHAIN_NAME --only-frontend
```

The frontend deployment requires that smart contracts to have been deployed before. So if you are only deploying the frontend, make sure that you did run the smart contracts deploy command successfully before this.

### Help
To see all available options of any command at any time, use:
```
create-polygon-dapp [COMMAND NAME] -h
```

## Project structure

The project is divided into two parts - Frontend (inside `./frontend`) and Smart contracts (inside `./smart-contracts`).

### Frontend

#### Node version
Node >v16.14.x is supported, although Node v18.x.x is recommended.

A `.nvmrc` has been provided if you use `nvm`. You can use this by:
```
nvm use # in ./frontend
```

#### Framework

The frontend runs on a Next.js server. If you're new to Next.js but know React.js, getting used to Next.js would be trivial. To get started, modify the component file at `./frontend/src/pages/index`.

To learn more about Next.js, [read their docs](https://nextjs.org/docs).

#### Environment variables

Before you start, you need to setup the environment variables. Look at the `.env.example` to know what to setup. Env variables required are:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="" 
```

Note, all env variable names which are supposed to be exposed used in client requests should be prefixed with `NEXT_PUBLIC_`.

#### Connecting wallet

To connect user wallets, [Web3Modal v3](https://web3modal.com/) has been integrated and pre-configured for you.

Use the provided `useWallet` hook to interact with Web3Modal and wallets. This contains utilities to simplify anything you need related to wallets.

#### Sending transactions to smart contracts

To send transactions to either a locally deployed smart contract or a smart contract on a prod chain, use the `useSmartContract` hook. This contains utilities to simplify getting and interacting with a Ethers.js contract instance.

When [deploying to local or production](#deploying), this hook will automatically use the correct chain and contracts.

#### Deploying to local test server

The `dev` command automates everything for you to setup a local Next.js test server.

#### Deploying to Vercel

To deploy this, follow the [Deploying](#deploying) guide.

With the `deploy` command, the Frontend deployment is fully automated. Vercel is used for deployments. Vercel offers free quotas to developers to get started.

No pre-configuration is necessary to run the `deploy` command. You'll be taken through all relevant steps upon running it.

### Smart Contracts

#### Node version
Node >v16.14.X is supported, although Node v18.17.X is recommended.

A `.nvmrc` has been provided if you use `nvm`. You can use this by:
```
nvm use # in ./smart-contracts
```

#### Environment variables

Before you start, you need to setup the environment variables. Look at the `.env.example` to know what to setup. Env variables required are:
```
PRIVATE_KEY_DEPLOYER="" 
```

#### Framework

The smart contracts run on a Hardhat environment.

The smart contracts are written in [Solidity](https://docs.soliditylang.org/), and are in the `contracts` directory.

Tests are written in JS/TS, and are in `tests` directory. An example test is written for you here.

Scripts are also written in JS/TS, and are in `scripts` directory. Some mandatory scripts are already there to get started with.

#### Deploying on local test chain

The `dev` command automates everything for you to setup a local test chain.

This will also generate some funded test wallets for you in this test chain, which you can use to develop your DApp.

You may also start this local chain by forking Ethereum or any Polygon chain. Just run:
```
create-polygon-dapp dev -n polygonZkevm -b [BLOCK_NUMBER_TO_FORK_AT]
```

To see all available options, run:
```
create-polygon-dapp dev -h
```

The `dev` command internally runs the provided `scripts/deploy_localhost` script to deploy all contracts in the correct sequence. When working on your own smart contracts, make sure to update this script.

#### Local test chain explorer

Optionally, you can also enable a local blockchain explorer, which auto-indexes all transactions, and provides a feature-loaded dashboard for you to get an overview of this chain.

To use it, run the `dev` command with `-e`, optionally with a few more args.

For this to work, you need to sign up on [Ethernal](https://app.tryethernal.com/), and create a workspace. Then you put your login email, password and workspace name inside the `.env` in `smart-contracts`. (checkout the `.env.example`)

The above config can also be mentioned with `dev` command params `--ethernal-login-email`, `--ethernal-login-password` and `--ethernal-workspace`, which overrides the env variables.

Once started, you can access the chain explorer at the same URL as mentioned before!

#### Deploying to production

The `deploy` command automates everything for you to deploy to Ethereum or any Polygon chain.

The `deploy` command internally runs the provided `scripts/deploy_prod` script to deploy all contracts in the correct sequence. When working on your own smart contracts, make sure to update this script.

To see all available options, run:
```
create-polygon-dapp deploy -h
```

## Contributing

### Building

To build the CLI tool, run:

```
npm run build
```

This will generate `cli.js` inside `bin` directory, which can they be installed globally with:

```
npm run install-global
```

After this, `create-polygon-dapp` will be available as a global command.

### Dev environment

To modify this tool, a dev environment can be started by running:

```
npm run dev
```

This watches the source files, and bundles up the CLI app on every change, and installs it globally. In other words, the global `create-polygon-dapp` is always updated with your changes in the code.

### Reporting bugs / Feature requests

To report a bug or request a feature, [create an issue](https://github.com/0xPolygon/polygon-dapp-scaffold/issues), and describe what you want.

## FAQs

### Why does Metamask fail in sending transactions in dev environment with a nonce error?
Everytime the dev environment is started, a new local test chain is started. Metamask internally maintains a cache of "latest block number" and "account transaction nonce". Since every run of `dev` creates a new chain, it never matches with this cache.

To know how to clear the cache, [read this](https://support.metamask.io/hc/en-us/articles/360015488891-How-to-clear-your-account-activity-reset-account).

### Why does Metamask fail in sending transactions with a nonce error when using "reset on change" option in dev environment?
The reset on change option resets the blockchain on every code change. Metamask internally maintains a cache of "latest block number" and "account transaction nonce". After resetting the chain, the latest block number and account transaction nonce should go back to initial state as well, but Metamask does not update this cache on its own.

To know how to clear the cache, [read this](https://support.metamask.io/hc/en-us/articles/360015488891-How-to-clear-your-account-activity-reset-account).
