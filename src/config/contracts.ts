import FHELotteryABI from './FHELotteryABI.json';

export const CONTRACTS = {
  FHELottery: import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
};

export const ABIS = {
  FHELottery: FHELotteryABI,
};

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11155111;
