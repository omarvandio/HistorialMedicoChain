import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, FileJson } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FileUploadProps } from '@/lib/types';
import { toast } from 'sonner';

const FileUploader = ({ onFileUpload, userAddress }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!userAddress) {
      toast.error('Por favor, conecta tu wallet primero');
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/') || 
                         file.type === 'application/json';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(`Tipo de archivo no válido: ${file.name}`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`Archivo muy grande: ${file.name} (máximo 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileUpload(validFiles);
      toast.success(`${validFiles.length} archivo(s) cargado(s) exitosamente`);
    }
  }, [onFileUpload, userAddress]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024,
    disabled: !userAddress
  });

  const getIcon = () => {
    if (isDragActive) return <Upload className="h-12 w-12 text-primary animate-pulse" />;
    return <Upload className="h-12 w-12 text-muted-foreground" />;
  };

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
        } ${!userAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {getIcon()}
          <div>
            <p className="text-lg font-semibold mb-2">
              {isDragActive ? '¡Suelta los archivos aquí!' : 'Arrastra archivos o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-muted-foreground">
              PDF, imágenes (PNG, JPG) o JSON - Máximo 10MB
            </p>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-4 w-4" />
              PDF
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Image className="h-4 w-4" />
              Imágenes
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileJson className="h-4 w-4" />
              JSON
            </div>
          </div>
        </div>
      </div>
      
      {!userAddress && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Conecta tu wallet para comenzar a cargar archivos
        </p>
      )}
    </Card>
  );
};

export default FileUploader;
