import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  trustWallet,
  zerionWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../styles/globals.css";
import { useState } from "react";
import ChainContext from "../context/Chain";

function MyApp({ Component, pageProps }: AppProps) {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ThirdwebProvider
            clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
            activeChain={selectedChain}
            supportedWallets={[
              metamaskWallet(),
              coinbaseWallet(),
              walletConnect(),
              trustWallet({ recommended: true }),
              zerionWallet(),
              rainbowWallet(),
            ]}><Component {...pageProps} />
          </ThirdwebProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ChainContext.Provider>
  );
}

export default MyApp;
