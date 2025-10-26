import { UserRole } from '@/lib/types';
import { UserCircle, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector = ({ role, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      <Button
        onClick={() => onRoleChange('patient')}
        variant={role === 'patient' ? 'default' : 'ghost'}
        size="sm"
        className={`gap-2 ${role === 'patient' ? 'bg-primary hover:bg-primary/90' : ''}`}
      >
        <UserCircle className="h-4 w-4" />
        Paciente
      </Button>
      <Button
        onClick={() => onRoleChange('doctor')}
        variant={role === 'doctor' ? 'default' : 'ghost'}
        size="sm"
        className={`gap-2 ${role === 'doctor' ? 'bg-secondary hover:bg-secondary/90' : ''}`}
      >
        <Stethoscope className="h-4 w-4" />
        Médico
      </Button>
    </div>
  );
};

export default RoleSelector;
