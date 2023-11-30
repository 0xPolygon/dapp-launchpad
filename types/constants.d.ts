export interface IContractDeploymentMap {
    [contractName: string]: {
        contractAddress: string;
        bytecode: string;
        abi: any;
        name: string;
    }
}

export type IEnvironment = "development" | "production";

export interface IDappScaffoldConfig {
    template: {
        name: string;
        filesAndDirs: {
            "smart-contracts": {
                "path-dir": string;
                "contracts-dir": string;
                "deploy-localhost": string;
                "deploy-prod": string;
                "typechain-types-dir": undefined | string;
                "artifacts-dir": string;
                "hardhat-config": string;
                "hardhat-config-ethernal": string;
            },
            frontend: {
                "path-dir": string;
                "smart-contracts-config-dir": string;
                "deployed-network-development": string;
                "deployed-network-production": string;
                "smart-contracts-development": string;
                "smart-contracts-production": string;
                "types-dir": undefined | string;
                "typechain-types-dir": undefined | string;
            }
        }
    }
}
