import { ADDRESSES } from '@/lib/config';
import { publicClient } from '@/lib/wagmi';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { readContract } from 'viem/actions';
import { mainnet } from 'viem/chains';

interface TokenBalance {
  contract_ticker_symbol: string;
  contract_name: string;
  contract_address: string;
  balance: string;
  balance_24h?: string;
  quote_rate?: number;
  quote?: number;
  quote_24h?: number;
  logo_url?: string;
  contract_decimals: number;
  type: string;
  verified?: boolean;
  coin_gecko_id?: string;
  chainId: number;
}

interface UnmarshalResponse {
  items_on_page: number;
  next_offset: number;
  assets: TokenBalance[];
}

// Blockscout response structure for Fuse
interface BlockscoutTokenBalance {
  token: {
    address: string;
    address_hash: string;
    circulating_market_cap?: string;
    decimals: string;
    exchange_rate?: string;
    holders?: string;
    holders_count?: string;
    icon_url?: string;
    is_bridged?: boolean;
    name: string;
    symbol: string;
    total_supply?: string;
    type: string;
    volume_24h?: string;
  };
  token_id: null;
  token_instance: null;
  value: string;
}

type BlockscoutResponse = BlockscoutTokenBalance[];

interface BalanceData {
  totalUSD: number;
  soUSDValue: number;
  totalUSDExcludingSoUSD: number;
  ethereum: TokenBalance[];
  fuse: TokenBalance[];
  isLoading: boolean;
  error: string | null;
}

// Chain IDs for Unmarshal API
const ETHEREUM_CHAIN_ID = 1;
const FUSE_CHAIN_ID = 122;

// ABI for AccountantWithRateProviders getRate function
const ACCOUNTANT_ABI = [
  {
    "inputs": [],
    "name": "getRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "rate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useUnmarshalBalance = (address: Address | undefined): BalanceData => {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    totalUSD: 0,
    soUSDValue: 0,
    totalUSDExcludingSoUSD: 0,
    ethereum: [],
    fuse: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!address) {
      setBalanceData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchBalances = async () => {
      setBalanceData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Make parallel requests to both chains and get soUSD rate
        const [ethereumResponse, fuseResponse, soUSDRate] = await Promise.allSettled([
          // Ethereum via Unmarshal
          fetch(`https://api.unmarshal.com/v2/ethereum/address/${address}/assets?verified=true&includeLowVolume=true&auth_key=${process.env.EXPO_PUBLIC_UNMARSHAL_API_KEY}`, {
            headers: {
              accept: 'application/json',
            },
          }),
          // Fuse via Blockscout
          fetch(`https://explorer.fuse.io/api/v2/addresses/${address}/token-balances`, {
            headers: {
              accept: 'application/json',
            },
          }),
          readContract(publicClient(mainnet.id), {
            address: ADDRESSES.ethereum.accountant,
            abi: ACCOUNTANT_ABI,
            functionName: 'getRate',
          }),
        ]);

        let ethereumTokens: TokenBalance[] = [];
        let fuseTokens: TokenBalance[] = [];
        let rate = BigInt(0);

        // Process Ethereum response (Unmarshal)
        if (ethereumResponse.status === 'fulfilled' && ethereumResponse.value.ok) {
          const ethereumData: UnmarshalResponse = await ethereumResponse.value.json();
          // Add chainId to Ethereum tokens
          ethereumTokens = (ethereumData.assets || []).map(token => ({
            ...token,
            chainId: ETHEREUM_CHAIN_ID,
          }));
        } else if (ethereumResponse.status === 'rejected') {
          console.warn('Failed to fetch Ethereum balances:', ethereumResponse.reason);
        }

        // Process Fuse response (Blockscout)
        if (fuseResponse.status === 'fulfilled' && fuseResponse.value.ok) {
          const fuseData: BlockscoutResponse = await fuseResponse.value.json();
          // Convert Blockscout format to our standard format
          fuseTokens = fuseData.map((item): TokenBalance => ({
            contract_ticker_symbol: item.token.symbol,
            contract_name: item.token.name,
            contract_address: item.token.address,
            balance: item.value,
            quote_rate: item.token.exchange_rate ? parseFloat(item.token.exchange_rate) : 0,
            quote: 0, // Will be calculated
            logo_url: item.token.icon_url,
            contract_decimals: parseInt(item.token.decimals),
            type: item.token.type,
            verified: true, // Assume verified if it's on Blockscout
            chainId: FUSE_CHAIN_ID,
          }));
        } else if (fuseResponse.status === 'rejected') {
          console.warn('Failed to fetch Fuse balances:', fuseResponse.reason);
        }

        // Process soUSD rate
        if (soUSDRate.status === 'fulfilled') {
          rate = soUSDRate.value;
        } else {
          console.warn('Failed to fetch soUSD rate:', soUSDRate.reason);
        }

        // Helper function to check if token is soUSD (vault token)
        const isSoUSDToken = (token: TokenBalance): boolean => {
          return token.contract_address.toLowerCase() === ADDRESSES.ethereum.vault.toLowerCase() ||
                 token.contract_address.toLowerCase() === ADDRESSES.fuse.vault.toLowerCase();
        };

        // Calculate token values separately for soUSD and regular tokens
        const calculateTokenValue = (token: TokenBalance): { soUSDValue: number; regularValue: number } => {
          if (!token.balance) return { soUSDValue: 0, regularValue: 0 };

          // Convert balance from raw format to decimal format using contract_decimals
          const formattedBalance = parseFloat(token.balance) / Math.pow(10, token.contract_decimals);
          
          // Special handling for soUSD tokens - use rate from AccountantWithRateProviders
          if (isSoUSDToken(token) && rate > 0) {
            console.log('rate: ', rate);
            // Rate is in 18 decimals, so divide by 10^18 to get the actual rate
            const soUSDRate = Number(rate) / Math.pow(10, 6);
            const value = formattedBalance * soUSDRate;
            console.log('formattedBalance: ', formattedBalance);
            console.log('value: ', value);
            console.log('soUSDRate: ', soUSDRate);
            return { soUSDValue: value, regularValue: 0 };
          }
          
          // For regular tokens, use quote_rate
          if (!token.quote_rate) return { soUSDValue: 0, regularValue: 0 };
          const value = formattedBalance * token.quote_rate;
          return { soUSDValue: 0, regularValue: value };
        };

        // Calculate totals for both chains
        const ethereumTotals = ethereumTokens.reduce(
          (acc, token) => {
            const { soUSDValue, regularValue } = calculateTokenValue(token);
            return {
              soUSD: acc.soUSD + soUSDValue,
              regular: acc.regular + regularValue,
            };
          },
          { soUSD: 0, regular: 0 }
        );

        const fuseTotals = fuseTokens.reduce(
          (acc, token) => {
            const { soUSDValue, regularValue } = calculateTokenValue(token);
            return {
              soUSD: acc.soUSD + soUSDValue,
              regular: acc.regular + regularValue,
            };
          },
          { soUSD: 0, regular: 0 }
        );

        const totalSoUSD = ethereumTotals.soUSD + fuseTotals.soUSD;
        console.log('ethereumTotals.soUSD: ', ethereumTotals.soUSD);
        console.log('fuseTotals.soUSD: ', fuseTotals.soUSD);
        console.log('totalSoUSD: ', totalSoUSD);
        const totalRegular = ethereumTotals.regular + fuseTotals.regular;

        setBalanceData({
          totalUSD: totalSoUSD + totalRegular,
          soUSDValue: totalSoUSD,
          totalUSDExcludingSoUSD: totalRegular,
          ethereum: ethereumTokens,
          fuse: fuseTokens,
          isLoading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching balances:', error);
        setBalanceData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    fetchBalances();
  }, [address]);

  return balanceData;
}; 