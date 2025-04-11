
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useBackNavigation from "@/hooks/useBackNavigation";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: Date;
}

const Wallet = () => {
  const { ExitConfirmDialog } = useBackNavigation();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState<number>(500); // Default balance
  const [addAmount, setAddAmount] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "credit",
      amount: 500,
      description: "Welcome bonus",
      date: new Date(2025, 3, 10) // April 10, 2025
    },
    {
      id: "2",
      type: "debit",
      amount: 120,
      description: "Medicine purchase",
      date: new Date(2025, 3, 9) // April 9, 2025
    }
  ]);
  
  // Check if wallet has enough balance for a payment
  const checkWalletBalance = (amount: number): boolean => {
    if (balance >= amount) {
      return true;
    }
    
    toast({
      title: "Insufficient Balance",
      description: `Your wallet has ₹${balance}, but you need ₹${amount}`,
      variant: "destructive"
    });
    
    return false;
  };
  
  // Add money to wallet
  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    // Add new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "credit",
      amount: amount,
      description: "Added to wallet",
      date: new Date()
    };
    
    setTransactions([newTransaction, ...transactions]);
    setBalance(prevBalance => prevBalance + amount);
    setAddAmount("");
    
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to your wallet`,
      variant: "default"
    });
  };
  
  // Mock payment handler
  const handlePayment = (amount: number) => {
    if (checkWalletBalance(amount)) {
      // Process payment
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount: amount,
        description: "Payment for order",
        date: new Date()
      };
      
      setTransactions([newTransaction, ...transactions]);
      setBalance(prevBalance => prevBalance - amount);
      
      toast({
        title: "Payment Successful",
        description: `₹${amount} has been deducted from your wallet`,
        variant: "default"
      });
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBackButton title="Wallet" />
      <ExitConfirmDialog />
      
      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg font-medium text-gray-300 mb-1">Available Balance</h2>
          <h1 className="text-3xl font-bold text-white mb-4">₹{balance.toFixed(2)}</h1>
          
          <div className="mt-4">
            <div className="flex items-center mb-3">
              <Input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="mr-2"
              />
              <Button 
                className="bg-zepmeds-purple hover:bg-zepmeds-purple/80 whitespace-nowrap"
                onClick={handleAddMoney}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Money
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="border-white/10 text-white" 
                onClick={() => setAddAmount("100")}
              >
                ₹100
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white" 
                onClick={() => setAddAmount("200")}
              >
                ₹200
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 text-white" 
                onClick={() => setAddAmount("500")}
              >
                ₹500
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Pay Section (to demonstrate wallet balance check) */}
        <div className="glass-morphism rounded-xl p-5 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Pay</h2>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="border-white/10 text-white" 
              onClick={() => handlePayment(100)}
            >
              Pay ₹100
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white" 
              onClick={() => handlePayment(250)}
            >
              Pay ₹250
            </Button>
            <Button 
              variant="outline" 
              className="border-white/10 text-white" 
              onClick={() => handlePayment(1000)}
            >
              Pay ₹1000
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-400 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Demonstrates the wallet balance check functionality</span>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="credit">Added</TabsTrigger>
            <TabsTrigger value="debit">Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                        }`}>
                          {transaction.type === "credit" ? (
                            <ArrowDown className={`h-5 w-5 text-green-500`} />
                          ) : (
                            <ArrowUp className={`h-5 w-5 text-red-500`} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {transaction.description}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === "credit" ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No transactions found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="credit" className="mt-0">
            <h2 className="text-xl font-bold text-white mb-4">Money Added</h2>
            {transactions.filter(t => t.type === "credit").length > 0 ? (
              <div className="space-y-3">
                {transactions
                  .filter(transaction => transaction.type === "credit")
                  .map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-morphism rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-green-500/20">
                            <ArrowDown className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {transaction.description}
                            </h3>
                            <p className="text-gray-400 text-xs">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-500">
                          +₹{transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No money added yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="debit" className="mt-0">
            <h2 className="text-xl font-bold text-white mb-4">Money Spent</h2>
            {transactions.filter(t => t.type === "debit").length > 0 ? (
              <div className="space-y-3">
                {transactions
                  .filter(transaction => transaction.type === "debit")
                  .map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-morphism rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-red-500/20">
                            <ArrowUp className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">
                              {transaction.description}
                            </h3>
                            <p className="text-gray-400 text-xs">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-red-500">
                          -₹{transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No money spent yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Wallet;
