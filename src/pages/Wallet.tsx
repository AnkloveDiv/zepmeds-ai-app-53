import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, PlusCircle, CreditCardIcon, Landmark, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useBackNavigation from "@/hooks/useBackNavigation";

interface Transaction {
  id: string;
  date: Date;
  type: "credit" | "debit";
  amount: number;
  description: string;
}

const Wallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("balance");
  const [walletBalance, setWalletBalance] = useState(500);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      date: new Date(2023, 4, 15),
      type: "credit",
      amount: 100,
      description: "Referral Bonus"
    },
    {
      id: "t2",
      date: new Date(2023, 4, 12),
      type: "debit",
      amount: 250,
      description: "Medicine purchase"
    },
    {
      id: "t3",
      date: new Date(2023, 4, 10),
      type: "credit",
      amount: 500,
      description: "Added money"
    },
    {
      id: "t4",
      date: new Date(2023, 4, 5),
      type: "debit",
      amount: 150,
      description: "Doctor consultation"
    }
  ]);
  
  useBackNavigation();

  const handleAddMoney = () => {
    const amount = parseInt(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setWalletBalance(prev => prev + amount);
    
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date(),
      type: "credit",
      amount: amount,
      description: "Added money"
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Money added",
      description: `₹${amount} has been added to your wallet`,
    });
    
    setAddMoneyAmount("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Wallet" />

      <main className="px-4 py-4">
        <div className="glass-morphism rounded-xl p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-400 mb-1">Total Balance</h2>
          <div className="text-3xl font-bold text-white mb-4">₹{walletBalance.toLocaleString()}</div>
          
          <div className="grid grid-cols-2 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-zepmeds-purple/20 border-zepmeds-purple/30 hover:bg-zepmeds-purple/30 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Money
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Enter Amount (₹)</label>
                    <input
                      type="number"
                      value={addMoneyAmount}
                      onChange={(e) => setAddMoneyAmount(e.target.value)}
                      className="rounded-md p-2 border border-gray-700 bg-black/20 text-white"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {[100, 200, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        className="px-3 py-1 bg-black/30 border border-gray-700 rounded-md text-sm hover:bg-zepmeds-purple/20"
                        onClick={() => setAddMoneyAmount(amount.toString())}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center justify-center py-3 px-2 border border-gray-700 rounded-md hover:bg-black/30 cursor-pointer">
                        <CreditCardIcon className="h-5 w-5 mb-1 text-zepmeds-purple" />
                        <span className="text-xs">Card</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 px-2 border border-gray-700 rounded-md hover:bg-black/30 cursor-pointer">
                        <Landmark className="h-5 w-5 mb-1 text-zepmeds-purple" />
                        <span className="text-xs">UPI</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-3 px-2 border border-gray-700 rounded-md hover:bg-black/30 cursor-pointer">
                        <CreditCard className="h-5 w-5 mb-1 text-zepmeds-purple" />
                        <span className="text-xs">Net Banking</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleAddMoney} className="w-full bg-zepmeds-purple hover:bg-zepmeds-purple/80">
                    Add Money
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-black/30 text-white" onClick={() => navigate("/coupons")}>
              View Coupons & Offers
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="cards">Payment Methods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism rounded-xl p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"} flex items-center justify-center mr-3`}>
                      {transaction.type === "credit" ? (
                        <ArrowDown className={`h-5 w-5 text-green-500`} />
                      ) : (
                        <ArrowUp className={`h-5 w-5 text-red-500`} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{transaction.description}</h4>
                      <span className="text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {transaction.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`font-semibold ${transaction.type === "credit" ? "text-green-500" : "text-red-500"}`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cards">
            <div className="glass-morphism rounded-xl p-4 mb-4">
              <Button className="w-full border border-dashed border-gray-700 bg-black/20 text-gray-400 py-8 flex flex-col items-center justify-center">
                <PlusCircle className="h-6 w-6 mb-2" />
                <span>Add Payment Method</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Wallet;
