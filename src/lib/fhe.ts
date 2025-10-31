import { getAddress, toHex } from 'viem';

declare global {
  interface Window {
    relayerSDK?: {
      initSDK: () => Promise<void>;
      createInstance: (config: Record<string, unknown>) => Promise<any>;
      SepoliaConfig: Record<string, unknown>;
    };
    ethereum?: any;
    okxwallet?: any;
  }
}

let fheInstance: any = null;
let sdkPromise: Promise<any> | null = null;

const SDK_URL = 'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs';

/**
 * Dynamically load Zama FHE SDK from CDN
 */
const loadSdk = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  if (window.relayerSDK) {
    console.log('✅ SDK already loaded');
    return window.relayerSDK;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SDK_URL}"]`) as HTMLScriptElement | null;
      if (existing) {
        console.log('⏳ SDK script tag exists, waiting...');
        // Wait a bit for SDK to initialize
        const checkInterval = setInterval(() => {
          if (window.relayerSDK) {
            clearInterval(checkInterval);
            resolve(window.relayerSDK);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          if (window.relayerSDK) {
            resolve(window.relayerSDK);
          } else {
            reject(new Error('SDK script exists but window.relayerSDK not initialized'));
          }
        }, 5000);
        return;
      }

      console.log('📦 Loading SDK from CDN...');
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;

      script.onload = () => {
        console.log('📦 Script loaded, waiting for SDK initialization...');
        // Give SDK time to initialize
        setTimeout(() => {
          if (window.relayerSDK) {
            console.log('✅ SDK initialized');
            resolve(window.relayerSDK);
          } else {
            console.error('❌ window.relayerSDK still undefined after load');
            reject(new Error('relayerSDK unavailable after load'));
          }
        }, 500);
      };

      script.onerror = () => {
        console.error('❌ Failed to load SDK script');
        reject(new Error('Failed to load FHE SDK'));
      };

      document.body.appendChild(script);
    });
  }

  return sdkPromise;
};

/**
 * Initialize FHE instance with Sepolia network configuration
 */
export async function initializeFHE(provider?: any): Promise<any> {
  if (fheInstance) {
    return fheInstance;
  }

  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires browser environment');
  }

  const ethereumProvider = provider ||
    window.ethereum ||
    (window as any).okxwallet?.provider ||
    (window as any).okxwallet ||
    (window as any).coinbaseWalletExtension;

  if (!ethereumProvider) {
    throw new Error('Ethereum provider not found. Please connect your wallet first.');
  }

  console.log('🔌 Using Ethereum provider:', {
    isOKX: !!(window as any).okxwallet,
    isMetaMask: !!(window.ethereum as any)?.isMetaMask,
  });

  const sdk = await loadSdk();
  if (!sdk) {
    throw new Error('FHE SDK not available');
  }

  await sdk.initSDK();

  const config = {
    ...sdk.SepoliaConfig,
    network: ethereumProvider,
  };

  fheInstance = await sdk.createInstance(config);
  console.log('✅ FHE instance initialized for Sepolia');

  return fheInstance;
}

/**
 * Encrypt 6 lottery numbers (1-49) using FHE
 * @param numbers Array of 6 numbers (1-49)
 * @param contractAddress Lottery contract address
 * @param userAddress User's wallet address
 * @returns Array of 6 encrypted handles and proofs
 */
export const encryptLotteryNumbers = async (
  numbers: number[],
  contractAddress: string,
  userAddress: string
): Promise<{
  encryptedNumbers: `0x${string}`[];
  proofs: `0x${string}`[];
}> => {
  if (numbers.length !== 6) {
    throw new Error('Must provide exactly 6 numbers');
  }

  // Validate numbers are in range 1-49
  for (const num of numbers) {
    if (num < 1 || num > 49) {
      throw new Error(`Invalid number ${num}. Numbers must be between 1 and 49`);
    }
  }

  console.log('[FHE] Encrypting lottery numbers:', numbers);

  const fhe = await initializeFHE();
  const checksumContract = getAddress(contractAddress);

  const encryptedNumbers: `0x${string}`[] = [];
  const proofs: `0x${string}`[] = [];

  // Encrypt each number individually
  for (const number of numbers) {
    console.log(`[FHE] Encrypting number: ${number}`);
    const input = fhe.createEncryptedInput(checksumContract, userAddress);
    input.add8(number); // Use euint8 for numbers 1-49

    const { handles, inputProof } = await input.encrypt();

    encryptedNumbers.push(toHex(handles[0]));
    proofs.push(toHex(inputProof));
  }

  console.log('[FHE] ✅ All numbers encrypted');

  return { encryptedNumbers, proofs };
};

/**
 * Encrypt a single uint8 value (for lottery numbers 1-49)
 */
export const encryptUint8 = async (
  value: number,
  contractAddress: string,
  userAddress: string
): Promise<{
  encrypted: `0x${string}`;
  proof: `0x${string}`;
}> => {
  if (value < 0 || value > 255) {
    throw new Error('Value must be between 0 and 255 for uint8');
  }

  console.log('[FHE] Encrypting uint8:', value);

  const fhe = await initializeFHE();
  const checksumAddress = getAddress(contractAddress);

  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add8(value);

  const { handles, inputProof } = await input.encrypt();

  return {
    encrypted: toHex(handles[0]),
    proof: toHex(inputProof),
  };
};

/**
 * Encrypt a uint64 value (for larger amounts like ticket price)
 */
export const encryptAmount = async (
  amount: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{
  encryptedAmount: `0x${string}`;
  proof: `0x${string}`;
}> => {
  console.log('[FHE] Encrypting amount:', amount.toString());

  const fhe = await initializeFHE();
  const checksumAddress = getAddress(contractAddress);

  console.log('[FHE] Creating encrypted input...');
  const input = fhe.createEncryptedInput(checksumAddress, userAddress);
  input.add64(amount);

  console.log('[FHE] Encrypting...');
  const { handles, inputProof } = await input.encrypt();

  console.log('[FHE] ✅ Encryption complete');

  return {
    encryptedAmount: toHex(handles[0]),
    proof: toHex(inputProof),
  };
};
