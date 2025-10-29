import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Lock } from "lucide-react";

const LotterySelector = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const maxNumbers = 6;
  const totalNumbers = 49;

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
                disabled={!isSelected(num) && selectedNumbers.length >= maxNumbers}
                className={`
                  aspect-square rounded-full font-bold transition-all
                  ${isSelected(num)
                    ? 'bg-gradient-to-br from-primary to-amber-500 text-primary-foreground scale-110 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                    : 'bg-muted hover:bg-muted/80 text-foreground hover:scale-105'
                  }
                  ${!isSelected(num) && selectedNumbers.length >= maxNumbers ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <span className="text-sm">Ticket Price</span>
              <span className="font-bold text-primary">0.01 ETH</span>
            </div>
            
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground font-bold text-lg h-14 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all"
              disabled={selectedNumbers.length !== maxNumbers}
            >
              {selectedNumbers.length === maxNumbers 
                ? 'Buy Ticket (FHE Encrypted)' 
                : `Select ${maxNumbers - selectedNumbers.length} more number${maxNumbers - selectedNumbers.length !== 1 ? 's' : ''}`
              }
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LotterySelector;
