export interface IDevCommandOptions {
    forkNetworkName?: string;
    forkBlockNum?: string;
    resetOnChange?: boolean;
    enableExplorer?: boolean;
    ethernalLoginEmail?: string;
    ethernalLoginPassword?: string;
    ethernalWorkspace?: string;
}

export interface IGenerateSmartContractsConfig {
    environment: "development" | "production";
    networkName: string;
}
