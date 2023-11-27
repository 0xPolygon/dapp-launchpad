export interface IContractDeploymentMap {
    [contractName: string]: {
        contractAddress: string;
        bytecode: string;
        abi: any;
        name: string;
    }
}

export type IEnvironment = "development" | "production";
