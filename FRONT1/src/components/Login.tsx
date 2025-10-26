import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

// Datos simulados de usuarios
const SIMULATED_USERS = [
  { email: 'paciente@histochain.com', password: 'paciente123', role: 'patient' },
  { email: 'doctor@histochain.com', password: 'doctor123', role: 'doctor' },
];

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = SIMULATED_USERS.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      toast.success(`Bienvenido ${user.role === 'patient' ? 'Paciente' : 'Doctor'}`);
      onLogin(email, password);
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl w-fit">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          HistorialMedicoChain - HistoChain
          </CardTitle>
          <CardDescription>
            Gestión de Historiales Médicos - Web3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80">
              Iniciar Sesión
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>📋 Paciente: paciente@histochain.com / paciente123</p>
              <p>👨‍⚕️ Doctor: doctor@histochain.com / doctor123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
