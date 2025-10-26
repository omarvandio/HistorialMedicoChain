import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileViewerProps } from '@/lib/types';

const FileViewer = ({ file, isOpen, onClose }: FileViewerProps) => {
  const [fileContent, setFileContent] = useState<string>('');

  useEffect(() => {
    if (file) {
      if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            setFileContent(JSON.stringify(json, null, 2));
          } catch (error) {
            setFileContent('Error al leer el archivo JSON');
          }
        };
        reader.readAsText(file.file);
      } else if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file.file);
        setFileContent(url);
      } else if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file.file);
        setFileContent(url);
      }
    }
  }, [file]);

  const handleDownload = () => {
    if (file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{file.name}</span>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {file.type.startsWith('image/') && (
            <img 
              src={fileContent} 
              alt={file.name} 
              className="w-full h-auto rounded-lg"
            />
          )}
          
          {file.type === 'application/pdf' && (
            <iframe
              src={fileContent}
              className="w-full h-[600px] rounded-lg border"
              title={file.name}
            />
          )}
          
          {file.type === 'application/json' && (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{fileContent}</code>
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;
