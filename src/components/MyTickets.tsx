import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Eye, Lock } from "lucide-react";
import { useAccount } from "wagmi";
import { useLottery } from "@/hooks/useLottery";
import { useState, useEffect } from "react";

const MyTickets = () => {
  const { address } = useAccount();
  const [roundId, setRoundId] = useState(0);
  const { round, userTicketIndices, refetchUserTickets } = useLottery(roundId);

  // Refetch tickets when address changes
  useEffect(() => {
    if (address) {
      refetchUserTickets();
    }
  }, [address, refetchUserTickets]);

  if (!address) {
    return (
      <section className="py-20 px-4" id="my-tickets">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">My Tickets</h2>
            <p className="text-muted-foreground">Track your lottery entries and winnings</p>
          </div>

          <Card className="p-12 bg-card/30 backdrop-blur-sm border-primary/20 text-center">
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to view your lottery tickets
            </p>
          </Card>
        </div>
      </section>
    );
  }

  const hasTickets = userTicketIndices && userTicketIndices.length > 0;

  return (
    <section className="py-20 px-4" id="my-tickets">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">My Tickets</h2>
          <p className="text-muted-foreground">Track your lottery entries and winnings</p>
          {round && (
            <div className="mt-4 text-sm">
              <p className="font-medium">{round.name}</p>
              <p className="text-muted-foreground">
                {hasTickets ? `You have ${userTicketIndices.length} ticket${userTicketIndices.length !== 1 ? 's' : ''} in this round` : 'No tickets yet in this round'}
              </p>
            </div>
          )}
        </div>

        {hasTickets ? (
          <div className="space-y-4">
            {userTicketIndices.map((ticketIndex) => {
              const ticketId = String(ticketIndex).padStart(3, '0');
              const drawDate = round ? new Date(round.endTime * 1000).toLocaleDateString() : 'TBD';
              const isPending = round ? !round.drawn : true;

              return (
                <Card
                  key={ticketIndex}
                  className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-primary" />
                      </div>

                      <div>
                        <div className="font-mono text-sm text-muted-foreground mb-1">
                          Ticket #{ticketId}
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-muted-foreground">
                            FHE Encrypted
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-amber-500/30 border border-primary/50 flex items-center justify-center text-xs text-muted-foreground font-bold"
                              title="Number encrypted with FHE"
                            >
                              🔒
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">Draw Date</div>
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-4 h-4" />
                          {drawDate}
                        </div>
                      </div>

                      <div>
                        {isPending ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pending Draw
                          </span>
                        ) : round?.winningNumbers && round.winningNumbers.length > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Draw Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Awaiting Results
                          </span>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/50"
                        title="Numbers are encrypted and cannot be viewed"
                        disabled
                      >
                        <Eye className="w-4 h-4 opacity-50" />
                      </Button>
                    </div>
                  </div>

                  {!isPending && round?.winningNumbers && round.winningNumbers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <div className="text-xs text-muted-foreground mb-2">Winning Numbers:</div>
                      <div className="flex gap-1">
                        {round.winningNumbers.map((num, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs text-white font-bold"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 bg-card/30 backdrop-blur-sm border-primary/20 text-center">
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
            <p className="text-muted-foreground mb-6">
              Pick your lucky numbers above to get started
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground"
              onClick={() => document.querySelector('.lottery-selector')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Buy First Ticket
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MyTickets;
