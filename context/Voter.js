import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { useRouter } from 'next/router';

// Internal Import
import { VotingAddress, VotingAddressABI } from "./constants";
console.log("PINATA_KEY:", process.env.NEXT_PUBLIC_PINATA_API_KEY);
console.log("PINATA_SECRET:", process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY);

const PINATA_API_KEY        = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

const PINATA_GATEWAY        = "https://gateway.pinata.cloud/ipfs";

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

const getProvider = () => {
    if (!window.ethereum) throw new Error("Please Install MetaMask");
    return new ethers.providers.Web3Provider(window.ethereum);
};

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {

    const votingTitle = "My smart contract app";
    const router = useRouter();

    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState(0);
    const [candidateArray, setCandidateArray]   = useState([]);
    const [error, setError]                     = useState('');
    const [voterArray, setVoterArray]           = useState([]);
    const [voterLength, setVoterLength]         = useState(0);
    const [voterAddress, setVoterAddress]       = useState([]);

    // ----------------------------------------------------------------
    // Wallet
    // ----------------------------------------------------------------

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return setError("Please Install MetaMask");

            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            const chainId  = await window.ethereum.request({ method: "eth_chainId" });

            console.log("Accounts:", accounts);
            console.log("ChainId:", chainId);

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
        } catch (err) {
            console.error("checkIfWalletConnected error:", err);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return setError("Please Install MetaMask");

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.error("connectWallet error:", err);
        }
    };

    // ----------------------------------------------------------------
    // IPFS — Pinata
    // ----------------------------------------------------------------

    const uploadToIPFS = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Content-Type"          : "multipart/form-data",
                        pinata_api_key          : PINATA_API_KEY,
                        pinata_secret_api_key   : PINATA_SECRET_API_KEY,
                    },
                }
            );

            const url = `${PINATA_GATEWAY}/${res.data.IpfsHash}`;
            console.log("Uploaded file to IPFS:", url);
            return url;

        } catch (err) {
            console.error("uploadToIPFS error:", err);
            setError("Error Uploading file to IPFS");
        }
    };

    const uploadToIPFSCandidate = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Content-Type"          : "multipart/form-data",
                        pinata_api_key          : PINATA_API_KEY,
                        pinata_secret_api_key   : PINATA_SECRET_API_KEY,
                    },
                }
            );

            const url = `${PINATA_GATEWAY}/${res.data.IpfsHash}`;
            console.log("Uploaded candidate file to IPFS:", url);
            return url;

        } catch (err) {
            console.error("uploadToIPFSCandidate error:", err);
            setError("Error Uploading file to IPFS");
        }
    };

    const uploadJSONToIPFS = async (jsonObject) => {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            jsonObject,
            {
                headers: {
                    pinata_api_key          : PINATA_API_KEY,
                    pinata_secret_api_key   : PINATA_SECRET_API_KEY,
                },
            }
        );
        return `${PINATA_GATEWAY}/${res.data.IpfsHash}`;
    };

    // ----------------------------------------------------------------
    // Voter
    // ----------------------------------------------------------------

    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;

            if (!name || !address || !position)
                return setError("Input data missing");

            const provider = getProvider();
            const signer   = provider.getSigner();
            const contract = fetchContract(signer);

            console.log("Creating voter, wallet:", await signer.getAddress());

            const metadataUrl = await uploadJSONToIPFS({ name, address, position, image: fileUrl });

            const tx = await contract.voterRight(address, name, metadataUrl, fileUrl);
            await tx.wait();

            console.log("Voter created!");
            router.push("/voterlist");

        } catch (err) {
            console.error("createVoter error:", err);
            setError("Error in create voter: " + err.message);
        }
    };

    const getAllVoterData = async () => {
        try {
            const provider = getProvider();
            const network  = await provider.getNetwork();
            console.log("Connected network:", network);

            const signer   = provider.getSigner();
            const contract = fetchContract(signer);

            const code = await provider.getCode(VotingAddress);
            console.log("Contract code (first 20 chars):", code.slice(0, 20));

            const voterListData = await contract.getVoterList();
            console.log("Voter list:", voterListData);

            if (!voterListData || voterListData.length === 0) {
                setVoterArray([]);
                setVoterLength(0);
                return;
            }

            setVoterAddress(voterListData);

            const voterData = await Promise.all(
                voterListData.map((el) => contract.getVoterData(el))
            );

            setVoterArray(voterData);

            const length = await contract.getVoterLength();
            setVoterLength(length.toNumber());

        } catch (err) {
            console.error("getAllVoterData error:", err);
            setError("Something went wrong fetching voter data: " + err.message);
        }
    };

    const giveVote = async (id) => {
        try {
            const candidateAddress = id.address;
            const candidateId      = id.id;

            const provider = getProvider();
            const signer   = provider.getSigner();
            const contract = fetchContract(signer);

            console.log("Voting, wallet:", await signer.getAddress());

            const tx = await contract.vote(candidateAddress, candidateId);
            await tx.wait();

            console.log("Vote cast!");

        } catch (err) {
            console.error("giveVote error:", err);
            setError("Something went wrong voting: " + err.message);
        }
    };

    // ----------------------------------------------------------------
    // Candidate
    // ----------------------------------------------------------------

    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;

            if (!name || !address || !age)
                return setError("Input data missing");

            const provider = getProvider();
            const signer   = provider.getSigner();
            const contract = fetchContract(signer);

            console.log("Creating candidate, wallet:", await signer.getAddress());

            const metadataUrl = await uploadJSONToIPFS({ name, address, image: fileUrl, age });

            const tx = await contract.setCandidate(address, age, name, fileUrl, metadataUrl);
            await tx.wait();

            console.log("Candidate created!");
            router.push("/");

        } catch (err) {
            console.error("setCandidate error:", err);
            setError("Error in set candidate: " + err.message);
        }
    };

    const getNewCandidate = async () => {
        try {
            const provider = getProvider();
            const signer   = provider.getSigner();
            const contract = fetchContract(signer);

            const allCandidate = await contract.getCandidate();
            console.log("Candidate list:", allCandidate);

            if (!allCandidate || allCandidate.length === 0) {
                setCandidateArray([]);
                setCandidateLength(0);
                return;
            }

            const candidateData = await Promise.all(
                allCandidate.map((el) => contract.getCandidateData(el))
            );

            setCandidateArray(candidateData);

            const length = await contract.getCandidateLength();
            setCandidateLength(length.toNumber());

        } catch (err) {
            console.error("getNewCandidate error:", err);
            setError("Something went wrong fetching candidates: " + err.message);
        }
    };

    // ----------------------------------------------------------------
    // Context value
    // ----------------------------------------------------------------

    return (
        <VotingContext.Provider value={{
            votingTitle,
            checkIfWalletConnected,
            connectWallet,
            uploadToIPFS,
            uploadToIPFSCandidate,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            error,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
        }}>
            {children}
        </VotingContext.Provider>
    );
};