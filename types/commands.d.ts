export interface IInitCommandOptions {
    template: string;
}

export interface IDevCommandOptions {
    forkNetworkName?: string;
    forkBlockNum?: string;
    resetOnChange?: boolean;
    enableExplorer?: boolean;
    ethernalLoginEmail?: string;
    ethernalLoginPassword?: string;
    ethernalWorkspace?: string;
    onlyFrontend?: boolean;
    onlySmartContracts?: boolean;
}

export interface IGenerateSmartContractsConfig {
    environment: "development" | "production";
    networkName: string;
}
