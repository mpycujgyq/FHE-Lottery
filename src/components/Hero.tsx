import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container relative z-10 text-center space-y-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-primary/20">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">FHE Encrypted Blockchain Lottery</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent animate-pulse">
          Win Big with Privacy
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Fully Homomorphic Encryption ensures your numbers stay private until the draw
        </p>
        
        <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 max-w-md mx-auto shadow-[0_0_50px_rgba(255,215,0,0.15)]">
          <div className="text-sm text-muted-foreground mb-2">Current Prize Pool</div>
          <div className="text-5xl md:text-6xl font-bold text-primary mb-6">
            $1,250,000
          </div>
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground font-bold text-lg h-14 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all"
          >
            Pick Your Numbers
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24h</div>
            <div className="text-muted-foreground">Until Draw</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1,547</div>
            <div className="text-muted-foreground">Participants</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-muted-foreground">On-Chain</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
