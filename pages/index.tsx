import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import {Navbar, NavbarBrand, NavbarContent,NavbarMenu,NavbarMenuToggle, NavbarMenuItem, NavbarItem, Link,Switch,} from "@nextui-org/react";
import { CheckBadgeIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import { NextPage } from "next";
import {useTheme} from "next-themes";
import MoonIcon from "./moon";
import SunIcon from "./sun";
import Head from "next/head";
const features = [
  {
    name: 'Safe',
    description:
      'Safety is our top priority. We utilize cutting-edge encryption techniques and decentralized storage solutions to safeguard your personal information and assets. With end-to-end encryption and multi-factor authentication, you can trust that your data is secure from unauthorized access and malicious attacks.',
    icon: CheckBadgeIcon,
  },
  {
    name: 'Secured',
    description: 'Security is at the core of our platform. We implement industry-leading security protocols and best practices to protect your digital assets and ensure the integrity of our systems. Our smart contract infrastructure undergoes rigorous auditing and testing to mitigate potential vulnerabilities and safeguard against exploits.',
    icon: LockClosedIcon,
  },
  {
    name: 'Decentralized',
    description: 'Decentralization is fundamental to our philosophy. By leveraging blockchain technology, we empower users with full control over their data and assets, eliminating the need for intermediaries and central authorities. Our decentralized architecture ensures censorship resistance, immutability, and trustless transactions, giving you the freedom to transact and interact with confidence.',
    icon: ServerIcon,
  },
];
const stats = [
  { id: 1, name: 'Transactions every 24 hours', value: '2 million +' },
  { id: 2, name: 'Assets under holding', value: '$100 million' },
  { id: 3, name: 'New users annually', value: '50,000' },
];

const Home: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [  "Home","Airdrops", "Support",];
  const { theme, setTheme } = useTheme();
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
        return "https://discord.gg/WT9PkkPnCH";
      // Add more cases for additional menu items if needed
      default:
        return "#"; // Default href value if index is out of range
    }
  }
  return (
    <div>
      <Head>
        <title>Web3SolutionsPro - Web3 Solutions </title>
    </Head>
     <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
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
          <Link color="foreground" href="https://discord.gg/WT9PkkPnCH">
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
          }}
        >
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
        title: "Solutions to all your Web3 needs 😀",
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
          }}
        >
        </Switch>
      </NavbarMenu>
    </Navbar>
    <div className="relative isolate px-6 pt-14 lg:px-8">
    <div
      className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm leading-6  ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Announcing our next round of Airdrops.{' '}
          <a href="#" className="font-semibold text-indigo-600">
            <span className="absolute inset-0" aria-hidden="true" />
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Your Gateway to Decentralized Empowerment!
        </h1>
        <p className="mt-6 text-lg leading-8 ">
        Unlock the potential of the web3 ecosystem with our innovative Dapp. Seamlessly interact with blockchain technologies, securely manage digital assets, and embrace a new era of decentralized possibilities. Join us as we redefine the future of web interactions and empower users to take control of their digital experiences. Experience the power of decentralization with Web3SolutionsPro
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="synchronize"
            className="rounded-md text-white bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </a>
          <a href="synchronize" className="text-sm font-semibold leading-6 ">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
    <div
      className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
    <div className="overflow-hidden  py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Synchronize Wallets faster</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl">Sync your wallet, secure your assets!</p>
              <p className="mt-6 text-lg leading-8 ">
              Wallet synchronization is a crucial step in ensuring the safety and accessibility of your digital assets.<br/>
              Our platform offers a secure and reliable solution for managing your digital assets.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7  lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold ">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            
          </div>
 </div>
      </div>
    </div>
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 ">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight  sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
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


export default Home;
