import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Ticket } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            FHE Lottery
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#my-tickets" className="text-muted-foreground hover:text-primary transition-colors">
            My Tickets
          </a>
          <a href="#winners" className="text-muted-foreground hover:text-primary transition-colors">
            Winners
          </a>
        </nav>

        <ConnectButton 
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
};

export default Header;
