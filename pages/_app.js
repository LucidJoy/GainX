import "../styles/app.sass";

import { CreateLendProvider } from "../context/LendContext";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import {
  filecoinHyperspace,
  polygonMumbai,
} from "wagmi/chains";

const { chains, provider } = configureChains(
  [filecoinHyperspace, polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://rpc.ankr.com/filecoin_testnet`,
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "NftLend",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <CreateLendProvider>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </WagmiConfig>
    </CreateLendProvider>
  );
}
