export type ISmartContractsConstantJsonData = {
    contractAddress: string;
    bytecode: string;
    abi: any;
}

export type ISmartContractsConstantJson = { [contractName: string]: ISmartContractsConstantJsonData };
