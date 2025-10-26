import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getShortAddress } from '@/lib/web3';

interface ConnectButtonProps {
  address: string | null;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectButton = ({ address, isConnected, onConnect, onDisconnect }: ConnectButtonProps) => {
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium">
          {getShortAddress(address)}
        </div>
        <Button
          onClick={onDisconnect}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onConnect}
      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
    >
      <Wallet className="h-4 w-4" />
      Conectar Wallet
    </Button>
  );
};

export default ConnectButton;
