import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import contractsData from "@/constants/smart-contracts.json";
import { ISmartContractsConstantJson } from "@/types/smart-contract";

/**
 * 
 * @returns @description Contains data and methods to interact with smart contract
 */
export const useSmartContract = () => {
    const { ethersSigner, ethersProvider } = useWallet();

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
    const getSmartContract = <T>(name: string) => {
        const smartContractData = (contractsData as ISmartContractsConstantJson)[name];
        if (!smartContractData || !ethersProvider || !ethersSigner) return null;

        const smartContract = new ethers.Contract(
            smartContractData.contractAddress,
            smartContractData.abi,
            ethersSigner
        ) as T;

        return smartContract;
    }

    return {
        // Methods
        getSmartContract,
        getAllSmartContractNames
    }
}


