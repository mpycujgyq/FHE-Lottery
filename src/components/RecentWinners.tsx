import { Card } from "@/components/ui/card";
import { Trophy, Award, Medal } from "lucide-react";

const RecentWinners = () => {
  const winners = [
    { address: "0x742d...5c9a", amount: "$500,000", numbers: [7, 14, 21, 28, 35, 42], icon: Trophy, color: "text-primary" },
    { address: "0x8f3a...2d1b", amount: "$250,000", numbers: [3, 11, 19, 27, 33, 41], icon: Award, color: "text-amber-400" },
    { address: "0x1c4e...8f7d", amount: "$100,000", numbers: [5, 12, 23, 31, 38, 44], icon: Medal, color: "text-orange-400" },
  ];

  return (
    <section className="py-20 px-4" id="winners">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Recent Winners</h2>
          <p className="text-muted-foreground">Join our lucky winners on-chain</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {winners.map((winner, index) => {
            const Icon = winner.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-8 h-8 ${winner.color}`} />
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Winner</div>
                    <div className="font-mono text-sm">{winner.address}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Prize Amount</div>
                    <div className="text-2xl font-bold text-primary">{winner.amount}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Winning Numbers</div>
                    <div className="flex gap-1 flex-wrap">
                      {winner.numbers.map((num) => (
                        <div
                          key={num}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-xs text-primary-foreground font-bold"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentWinners;
