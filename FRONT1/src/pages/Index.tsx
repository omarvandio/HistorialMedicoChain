import { useState, useEffect } from 'react';
import { Activity, LogOut } from 'lucide-react';
import { connectWallet, disconnectWallet, checkIfWalletIsConnected, WalletState } from '@/lib/web3';
import { UserRole, MedicalFile } from '@/lib/types';
import ConnectButton from '@/components/ConnectButton';
import RoleSelector from '@/components/RoleSelector';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';
import FileViewer from '@/components/FileViewer';
import Login from '@/components/Login';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
  });
  const [role, setRole] = useState<UserRole>('patient');
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MedicalFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    const state = await checkIfWalletIsConnected();
    setWalletState(state);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletState(disconnectWallet());
      toast.info('Wallet desconectada');
    } else {
      checkWalletConnection();
    }
  };

  const handleConnect = async () => {
    try {
      const state = await connectWallet();
      setWalletState(state);
      toast.success('Wallet conectada exitosamente');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDisconnect = () => {
    setWalletState(disconnectWallet());
    toast.info('Wallet desconectada');
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: MedicalFile[] = uploadedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      ownerAddress: walletState.address || '',
      file: file,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('Archivo eliminado');
  };

  const handleViewFile = (file: MedicalFile) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedFile(null);
  };

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    // Determinar rol según email
    if (email.includes('doctor')) {
      setRole('doctor');
    } else {
      setRole('patient');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWalletState(disconnectWallet());
    setFiles([]);
    toast.info('Sesión cerrada');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                HistorialMedicoChain
                </h1>
                <p className="text-xs text-muted-foreground">Gestión de Historiales Médicos Web3</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
              <RoleSelector role={role} onRoleChange={setRole} />
              <ConnectButton
                address={walletState.address}
                isConnected={walletState.isConnected}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Welcome Card */}
        {walletState.isConnected && (
          <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-primary-foreground shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Bienvenido, {role === 'patient' ? 'Paciente' : 'Doctor'}
            </h2>
            <p className="text-sm md:text-base text-primary-foreground/90">
              {role === 'patient' 
                ? 'Gestiona tus historiales médicos de forma segura en la blockchain'
                : 'Accede a los historiales médicos de tus pacientes de forma segura'
              }
            </p>
          </div>
        )}

        {/* File Upload Section */}
        {role === 'patient' && (
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Cargar Nuevo Archivo</h3>
            <FileUploader 
              onFileUpload={handleFileUpload} 
              userAddress={walletState.address}
            />
          </div>
        )}

        {/* Files List Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-lg md:text-xl font-semibold">
              {role === 'patient' ? 'Mis Archivos' : 'Archivos de Pacientes'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {files.length} archivo{files.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <FileList
            files={files}
            onDelete={handleDeleteFile}
            onView={handleViewFile}
            role={role}
            walletAddress={walletState.address}
          />
        </div>
      </main>

      {/* File Viewer Modal */}
      <FileViewer
        file={selectedFile}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
};

export default Index;
