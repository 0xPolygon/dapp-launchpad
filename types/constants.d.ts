export interface IContractDeploymentMap {
    [contractName: string]: {
        contractAddress: string;
        bytecode: string;
        abi: any;
        name: string;
    }
}
