import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";

/**
 * 
 * @returns @description Contains data and methods to interact with smart contract
 */
export const useSmartContract = () => {
    const { ethersSigner, ethersProvider } = useWallet();
    const [contractsData, setContractsData] = useState({});
    const [deployedNetworkData, setDeployedNetworkData] = useState();

    // Setup contracts data
    useEffect(() => {
        (async () => {
            const contractsDataNew = await import(`@/constants/smart-contracts-${process.env.NODE_ENV === "production" ? "production" : "development"}.json`);
            setContractsData(contractsDataNew);

            const deployedNetworkDataNew = await import(`@/constants/deployed-network-${process.env.NODE_ENV === "production" ? "production" : "development"}.json`);
            setDeployedNetworkData(deployedNetworkDataNew);
        })();
    }, []);

    /**
     * @description Gets names of all smart contracts
     * @returns Array of names
     */
    const getAllSmartContractNames = () => {
        return Object.keys(contractsData);
    }

    /**
     * @description Gets a specific smart contract, wrapped with Ethers
     * @param name Name of the smart contract, all upper-case
     * @dev To get names of all smart contracts, use `getAllSmartContractNames` function
     * @returns Smart contract
     */
    const getSmartContract = (name) => {
        const smartContractData = contractsData[name];
        if (!smartContractData || !ethersProvider || !ethersSigner) return null;

        const smartContract = new ethers.Contract(
            smartContractData.contractAddress,
            smartContractData.abi,
            ethersSigner
        );

        return smartContract;
    }

    return {
        // Data
        deployedNetworkData,

        // Methods
        getSmartContract,
        getAllSmartContractNames
    }
}


