import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Lock, Wallet, TrendingUp, CheckCircle, Shield, Eye, Zap } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet using RainbowKit to get started with FHE Lottery",
    },
    {
      icon: Lock,
      title: "Pick Numbers (FHE Encrypted)",
      description: "Select your lucky numbers. They're encrypted with FHE to ensure complete privacy on-chain",
    },
    {
      icon: TrendingUp,
      title: "Wait for Draw",
      description: "The draw happens automatically on-chain at the scheduled time using smart contracts",
    },
    {
      icon: CheckCircle,
      title: "Claim Winnings",
      description: "If you win, claim your prize directly to your wallet. It's that simple and secure!",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your lottery numbers are encrypted on-chain using Fully Homomorphic Encryption, keeping them private until the draw",
    },
    {
      icon: Eye,
      title: "Transparent & Fair",
      description: "All draws are executed on-chain with verifiable randomness, ensuring complete fairness and transparency",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Winners can claim their prizes instantly through smart contracts, no intermediaries needed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Demo Video Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                How FHE Lottery Works
              </h1>
              <p className="text-xl text-muted-foreground">
                Watch our demo to see privacy-preserving lottery in action
              </p>
            </div>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center border border-primary/10 overflow-hidden">
                <video
                  controls
                  className="w-full h-full rounded-xl object-contain"
                  preload="metadata"
                >
                  <source src="/test_vedio.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  📥 <a href="/test_vedio.mp4" download className="text-primary hover:underline">Download demo video</a> to watch offline
                </p>
              </div>
            </Card>
          </div>

          {/* Steps Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Four Simple Steps</h2>
              <p className="text-muted-foreground">Get started with FHE Lottery in minutes</p>
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
          </div>

          {/* FHE Explanation */}
          <div className="mb-16">
            <Card className="p-8 bg-card/30 backdrop-blur-sm border-primary/20">
              <h3 className="text-3xl font-bold mb-6 text-center">What is FHE?</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground text-lg mb-4">
                  <strong className="text-primary">Fully Homomorphic Encryption (FHE)</strong> is a revolutionary cryptographic technology that allows computations to be performed on encrypted data without ever decrypting it.
                </p>
                <p className="text-muted-foreground mb-4">
                  In the context of FHE Lottery, this means:
                </p>
                <ul className="text-muted-foreground space-y-2 mb-4">
                  <li>🔒 Your lottery numbers remain encrypted on the blockchain</li>
                  <li>🔐 No one (including the lottery operators) can see your numbers before the draw</li>
                  <li>✅ The smart contract can still verify winning numbers without decryption</li>
                  <li>🛡️ Complete privacy and fairness are guaranteed mathematically</li>
                </ul>
                <p className="text-muted-foreground">
                  This technology is powered by <strong className="text-primary">Zama's fhEVM</strong>, which brings FHE capabilities to Ethereum-compatible blockchains.
                </p>
              </div>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose FHE Lottery?</h2>
              <p className="text-muted-foreground">The most secure and fair lottery platform</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <Card className="p-8 bg-card/30 backdrop-blur-sm border-primary/20">
              <h3 className="text-3xl font-bold mb-6 text-center">Technical Architecture</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-4 text-primary">Smart Contracts</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Built on Ethereum Sepolia testnet</li>
                    <li>• FHE encryption using Zama's fhEVM v0.5</li>
                    <li>• Automated draw execution on-chain</li>
                    <li>• Verifiable random number generation</li>
                    <li>• Instant prize distribution via smart contracts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 text-primary">Frontend Technology</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• React 18 with TypeScript</li>
                    <li>• Wagmi v2 for blockchain interaction</li>
                    <li>• RainbowKit for wallet connection</li>
                    <li>• Zama Relayer SDK for FHE encryption</li>
                    <li>• Real-time contract data fetching</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 FHE Lottery. All numbers encrypted with Fully Homomorphic Encryption.</p>
          <p className="mt-2">Built on blockchain for transparency and fairness.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorksPage;
