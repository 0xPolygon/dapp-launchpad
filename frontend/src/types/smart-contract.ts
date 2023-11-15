export type ISmartContractsConstantJsonData = {
    contractAddress: string;
    bytecode: string;
    abi: any;
}

export type IDeployedNetworkConstantJson = {
    chainId: number;
    name: string;
    url: string;
    forking?: {
        url: string;
    },
    blockTime?: number;
}

export type ISmartContractsConstantJson = { [contractName: string]: ISmartContractsConstantJsonData };
