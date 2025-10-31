import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Lock, Loader2 } from "lucide-react";
import { useLottery } from "@/hooks/useLottery";
import { encryptLotteryNumbers, initializeFHE } from "@/lib/fhe";
import { CONTRACTS } from "@/config/contracts";
import { useToast } from "@/hooks/use-toast";
import { formatEther } from "viem";

const LotterySelector = () => {
  const { address } = useAccount();
  const { round, buyTicket, isPending, isConfirming, hash, isConfirmed, refetchUserTickets } = useLottery(0); // Current round is 0
  const { toast } = useToast();

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [purchasedNumbers, setPurchasedNumbers] = useState<number[]>([]);

  const maxNumbers = 6;
  const totalNumbers = 49;

  // Watch for transaction confirmation and show success toast
  useEffect(() => {
    if (isConfirmed && hash && purchasedNumbers.length > 0) {
      toast({
        title: "🎫 Ticket Purchased Successfully!",
        description: (
          <div className="mt-2">
            <p className="mb-2">Your numbers (now encrypted on-chain): {purchasedNumbers.join(", ")}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm flex items-center gap-1"
            >
              View on Etherscan →
            </a>
          </div>
        ),
      });
      setPurchasedNumbers([]);
      refetchUserTickets();
    }
  }, [isConfirmed, hash, purchasedNumbers, toast, refetchUserTickets]);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < maxNumbers) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const isSelected = (num: number) => selectedNumbers.includes(num);

  const quickPick = () => {
    const numbers: number[] = [];
    while (numbers.length < maxNumbers) {
      const num = Math.floor(Math.random() * totalNumbers) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const handleBuyTicket = async () => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to buy a ticket",
        variant: "destructive",
      });
      return;
    }

    if (!round) {
      toast({
        title: "Round not available",
        description: "Cannot load current lottery round",
        variant: "destructive",
      });
      return;
    }

    if (selectedNumbers.length !== maxNumbers) {
      toast({
        title: "Invalid selection",
        description: `Please select exactly ${maxNumbers} numbers`,
        variant: "destructive",
      });
      return;
    }

    // Check if round is still active
    const now = Math.floor(Date.now() / 1000);
    if (now >= round.endTime) {
      toast({
        title: "Round closed",
        description: "This lottery round has ended",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEncrypting(true);
      toast({
        title: "Encrypting your numbers...",
        description: "Please wait while we encrypt your lottery ticket using FHE",
      });

      // Initialize FHE
      await initializeFHE();

      // Encrypt the lottery numbers
      const { encryptedNumbers, proofs } = await encryptLotteryNumbers(
        selectedNumbers,
        CONTRACTS.FHELottery,
        address
      );

      setIsEncrypting(false);

      toast({
        title: "Encryption complete!",
        description: "Submitting your encrypted ticket to the blockchain...",
      });

      // Store numbers for success message later
      setPurchasedNumbers([...selectedNumbers]);

      // Buy ticket on-chain
      await buyTicket(encryptedNumbers, proofs, round.ticketPrice);

      // Clear selection
      setSelectedNumbers([]);
    } catch (error) {
      console.error("Ticket purchase failed:", error);
      setIsEncrypting(false);

      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      toast({
        title: "❌ Purchase Failed",
        description: (
          <div className="mt-2">
            <p className="mb-2">{errorMessage}</p>
            {hash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm flex items-center gap-1"
              >
                View failed transaction on Etherscan →
              </a>
            )}
          </div>
        ),
        variant: "destructive",
      });
    }
  };

  const isLoading = isPending || isConfirming || isEncrypting;
  const ticketPrice = round?.ticketPrice || BigInt(10000000000000000); // 0.01 ETH default

  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Pick Your Lucky Numbers
          </h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Your selection is encrypted using FHE technology
          </p>
          {round && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>{round.name}</p>
              <p>Ends: {new Date(round.endTime * 1000).toLocaleString()}</p>
              <p>Total tickets: {round.ticketCount} | Prize pool: {formatEther(round.prizePool)} ETH</p>
            </div>
          )}
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Selected: {selectedNumbers.length}/{maxNumbers}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={quickPick}
                disabled={isLoading}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Quick Pick
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap min-h-[60px] p-4 bg-muted/30 rounded-xl border border-primary/10">
              {selectedNumbers.map((num) => (
                <div
                  key={num}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)] animate-in zoom-in"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-8">
            {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={(!isSelected(num) && selectedNumbers.length >= maxNumbers) || isLoading}
                className={`
                  aspect-square rounded-full font-bold transition-all
                  ${isSelected(num)
                    ? 'bg-gradient-to-br from-primary to-amber-500 text-primary-foreground scale-110 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                    : 'bg-muted hover:bg-muted/80 text-foreground hover:scale-105'
                  }
                  ${(!isSelected(num) && selectedNumbers.length >= maxNumbers) || isLoading ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <span className="text-sm">Ticket Price</span>
              <span className="font-bold text-primary">{formatEther(ticketPrice)} ETH</span>
            </div>

            <Button
              size="lg"
              onClick={handleBuyTicket}
              className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground font-bold text-lg h-14 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all"
              disabled={selectedNumbers.length !== maxNumbers || isLoading || !address}
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isEncrypting ? 'Encrypting...' :
               isPending || isConfirming ? 'Submitting...' :
               selectedNumbers.length === maxNumbers
                ? 'Buy Ticket (FHE Encrypted)'
                : `Select ${maxNumbers - selectedNumbers.length} more number${maxNumbers - selectedNumbers.length !== 1 ? 's' : ''}`
              }
            </Button>

            {!address && (
              <p className="text-xs text-center text-muted-foreground">
                Connect your wallet to buy tickets
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LotterySelector;
