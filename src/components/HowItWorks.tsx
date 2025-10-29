import { Card } from "@/components/ui/card";
import { Lock, Wallet, TrendingUp, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet using RainbowKit to get started",
    },
    {
      icon: Lock,
      title: "Pick Numbers (FHE Encrypted)",
      description: "Select your lucky numbers. They're encrypted with FHE to ensure complete privacy",
    },
    {
      icon: TrendingUp,
      title: "Wait for Draw",
      description: "The draw happens automatically on-chain at the scheduled time",
    },
    {
      icon: CheckCircle,
      title: "Claim Winnings",
      description: "If you win, claim your prize directly to your wallet. It's that simple!",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-secondary/5 to-background" id="how-it-works">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">Simple, secure, and transparent blockchain lottery</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-primary-foreground font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  {index + 1}
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-card/30 backdrop-blur-sm border border-primary/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-center">What is FHE?</h3>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Fully Homomorphic Encryption (FHE) allows computations to be performed on encrypted data without decrypting it. 
            This means your lottery numbers remain private and secure until the draw, ensuring fairness and preventing any manipulation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
