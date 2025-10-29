import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Eye } from "lucide-react";

const MyTickets = () => {
  const tickets = [
    { id: "001", numbers: [7, 14, 21, 28, 35, 42], date: "2025-10-30", status: "pending" },
    { id: "002", numbers: [3, 11, 19, 27, 33, 41], date: "2025-10-29", status: "lost" },
  ];

  return (
    <section className="py-20 px-4" id="my-tickets">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">My Tickets</h2>
          <p className="text-muted-foreground">Track your lottery entries and winnings</p>
        </div>

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div>
                      <div className="font-mono text-sm text-muted-foreground mb-1">
                        Ticket #{ticket.id}
                      </div>
                      <div className="flex gap-1">
                        {ticket.numbers.map((num) => (
                          <div
                            key={num}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-xs text-primary-foreground font-bold"
                          >
                            {num}
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
                        {ticket.date}
                      </div>
                    </div>

                    <div>
                      {ticket.status === "pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Not Won
                        </span>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="border-primary/50">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-card/30 backdrop-blur-sm border-primary/20 text-center">
            <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your wallet and pick your numbers to get started
            </p>
            <Button className="bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-primary-foreground">
              Buy First Ticket
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MyTickets;
