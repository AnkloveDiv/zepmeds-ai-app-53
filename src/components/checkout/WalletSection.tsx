
import React from "react";
import { Wallet } from "lucide-react";
import { Label } from "@/components/ui/label";

interface WalletSectionProps {
  walletBalance: number;
  useWallet: boolean;
  setUseWallet: (use: boolean) => void;
}

const WalletSection = ({
  walletBalance,
  useWallet,
  setUseWallet,
}: WalletSectionProps) => {
  const handleToggleWallet = () => {
    setUseWallet(!useWallet);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <Wallet className="mr-2 text-green-400" size={20} />
        ZepMeds Wallet
      </h2>
      <div className="p-4 rounded-xl border border-green-800 bg-green-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <h3 className="text-white font-medium">Available Balance</h3>
              <p className="text-green-400 font-bold">₹{walletBalance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Label htmlFor="use-wallet" className="mr-2 text-gray-400">Use wallet</Label>
            <input
              type="checkbox"
              id="use-wallet"
              checked={useWallet}
              onChange={handleToggleWallet}
              className="h-5 w-5 rounded border-gray-700 bg-black/40 checked:bg-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
