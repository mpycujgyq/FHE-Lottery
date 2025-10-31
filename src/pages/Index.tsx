import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LotterySelector from "@/components/LotterySelector";
import MyTickets from "@/components/MyTickets";
import RecentWinners from "@/components/RecentWinners";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <Header />
      <main className="pt-16">
        <Hero />
        <LotterySelector />
        <MyTickets />
        <RecentWinners />
      </main>
      
      <footer className="border-t border-primary/10 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 FHE Lottery. All numbers encrypted with Fully Homomorphic Encryption.</p>
          <p className="mt-2">Built on blockchain for transparency and fairness.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
