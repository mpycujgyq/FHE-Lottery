import { getAddress } from 'viem';

declare global {
  interface Window {
    FheRelayer: any;
  }
}

let fheInstance: any = null;

export const initializeFHE = async () => {
  if (fheInstance) return fheInstance;

  if (typeof window === 'undefined' || !window.FheRelayer) {
    throw new Error('FHE Relayer SDK not loaded. Make sure the CDN script is included.');
  }

  try {
    fheInstance = await window.FheRelayer.create();
    console.log('FHE Relayer initialized successfully');
    return fheInstance;
  } catch (error) {
    console.error('Failed to initialize FHE:', error);
    throw error;
  }
};

const toHex = (bytes: Uint8Array): `0x${string}` => {
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}` as `0x${string}`;
};

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

  const fhe = await initializeFHE();
  const checksumContract = getAddress(contractAddress);
  const checksumUser = getAddress(userAddress);

  const encryptedNumbers: `0x${string}`[] = [];
  const proofs: `0x${string}`[] = [];

  // Encrypt each number individually
  for (const number of numbers) {
    const input = fhe.createEncryptedInput(checksumContract, checksumUser);
    input.add8(number); // Use euint8 for numbers 1-49

    const result = await input.encrypt();
    const { handles, inputProof } = result;

    encryptedNumbers.push(toHex(handles[0] as Uint8Array));
    proofs.push(toHex(inputProof));
  }

  return { encryptedNumbers, proofs };
};

/**
 * Decrypt a single euint8 value
 */
export const decryptUint8 = async (
  ciphertext: string,
  contractAddress: string,
  userAddress: string
): Promise<number | null> => {
  try {
    const fhe = await initializeFHE();
    const checksumContract = getAddress(contractAddress);
    const checksumUser = getAddress(userAddress);

    const decrypted = await fhe.decrypt(ciphertext, checksumContract, checksumUser);
    return Number(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
