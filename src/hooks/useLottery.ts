import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ABIS } from '@/config/contracts';

export function useLottery(roundId: number = 0) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read current round count
  const { data: roundsCount } = useReadContract({
    address: CONTRACTS.FHELottery,
    abi: ABIS.FHELottery,
    functionName: 'roundsCount',
  });

  // Read specific round data
  const { data: roundData, refetch: refetchRound } = useReadContract({
    address: CONTRACTS.FHELottery,
    abi: ABIS.FHELottery,
    functionName: 'getRound',
    args: [BigInt(roundId)],
    query: {
      enabled: roundId >= 0,
    },
  });

  // Read user's tickets for the round
  const { data: userTicketIndices, refetch: refetchUserTickets } = useReadContract({
    address: CONTRACTS.FHELottery,
    abi: ABIS.FHELottery,
    functionName: 'getUserTickets',
    args: address ? [BigInt(roundId), address] : undefined,
    query: {
      enabled: !!address && roundId >= 0,
    },
  });

  // Read winners for a round
  const { data: winners, refetch: refetchWinners } = useReadContract({
    address: CONTRACTS.FHELottery,
    abi: ABIS.FHELottery,
    functionName: 'getWinners',
    args: [BigInt(roundId)],
    query: {
      enabled: roundData && roundData[3], // Only if round is drawn
    },
  });

  /**
   * Buy a lottery ticket with encrypted numbers
   * @param encryptedNumbers Array of 6 encrypted numbers (0x...)
   * @param proofs Array of 6 proofs (0x...)
   * @param ticketPrice Price in wei
   */
  const buyTicket = async (
    encryptedNumbers: `0x${string}`[],
    proofs: `0x${string}`[],
    ticketPrice: bigint
  ) => {
    if (encryptedNumbers.length !== 6 || proofs.length !== 6) {
      throw new Error('Must provide exactly 6 encrypted numbers and proofs');
    }

    return writeContract({
      address: CONTRACTS.FHELottery,
      abi: ABIS.FHELottery,
      functionName: 'buyTicket',
      args: [BigInt(roundId), encryptedNumbers, proofs],
      value: ticketPrice,
    });
  };

  // Parse round data
  const round = roundData ? {
    name: roundData[0] as string,
    startTime: Number(roundData[1]),
    endTime: Number(roundData[2]),
    drawn: roundData[3] as boolean,
    winningNumbers: roundData[4] as number[],
    ticketPrice: roundData[5] as bigint,
    prizePool: roundData[6] as bigint,
    ticketCount: Number(roundData[7]),
    winnerCount: Number(roundData[8]),
  } : undefined;

  return {
    // Round data
    roundsCount: roundsCount ? Number(roundsCount) : 0,
    round,
    winners: winners as string[] | undefined,
    userTicketIndices: userTicketIndices ? (userTicketIndices as bigint[]).map(Number) : [],

    // Actions
    buyTicket,
    refetchRound,
    refetchUserTickets,
    refetchWinners,

    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}
