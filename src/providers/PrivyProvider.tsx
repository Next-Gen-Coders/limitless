import { PrivyProvider as PrivyProviderComponent } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { createConfig } from "@privy-io/wagmi";
import type { PrivyClientConfig } from "@privy-io/react-auth";

import { mainnet, sepolia, polygon } from "viem/chains";
import { http } from "wagmi";
import TanstackProvider from "./TanstackProvider";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID!;

  const wagmiConfig = createConfig({
    chains: [mainnet, sepolia, polygon],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
    },
  });

  const privyConfig: PrivyClientConfig = {
    // Customize Privy's appearance in your app
    appearance: {
      theme: "light",
      accentColor: "#676FFF",
      logo: "/logo.png",
      walletChainType: "ethereum-only",
    },
    embeddedWallets: {
      ethereum: {
        createOnLogin: "off", // defaults to 'off'
      },
      solana: {
        createOnLogin: "off",
      },
    },
    // Create embedded wallets for users who don't have a wallet
  };

  return (
    <PrivyProviderComponent appId={appId} config={privyConfig}>
      <TanstackProvider>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </TanstackProvider>
    </PrivyProviderComponent>
  );
}