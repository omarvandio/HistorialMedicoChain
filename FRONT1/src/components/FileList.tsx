import { useState } from 'react';
import { FileText, Image as ImageIcon, FileJson, Eye, Trash2, Calendar, Sparkles, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileListProps, MedicalFile } from '@/lib/types';
import { analyzeFileWithAI } from '@/lib/ai';
import { certifyFileOnBlockchain } from '@/lib/blockchain';
import { toast } from 'sonner';

const FileList = ({ files, onDelete, onView, role, walletAddress }: FileListProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCertifying, setIsCertifying] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleAnalyzeWithAI = async (file: MedicalFile) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFileWithAI(file);
      setAnalysisResult(result);
      setIsAnalysisOpen(true);
      toast.success('Análisis completado');
    } catch (error: any) {
      toast.error(error.message || 'Error al analizar archivo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCertifyOnBlockchain = async (file: MedicalFile) => {
    if (!walletAddress) {
      toast.error('Conecta tu wallet primero');
      return;
    }

    setIsCertifying(true);
    try {
      const result = await certifyFileOnBlockchain(file, walletAddress);
      
      if (result.success) {
        toast.success('Archivo certificado en blockchain');
        toast.info(result.message, { duration: 5000 });
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al certificar en blockchain');
    } finally {
      setIsCertifying(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-destructive" />;
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-secondary" />;
    if (type === 'application/json') return <FileJson className="h-5 w-5 text-primary" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (files.length === 0) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <FileText className="h-12 md:h-16 w-12 md:w-16 opacity-20" />
          <p className="text-base md:text-lg">No hay archivos cargados</p>
          <p className="text-sm">Los archivos que subas aparecerán aquí</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <Card 
            key={file.id} 
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-muted rounded-lg shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate mb-1">{file.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(file.uploadDate)}
                </div>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => onView(file)}
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Eye className="h-3 w-3" />
                  Ver
                </Button>
                
                {role === 'patient' && (
                  <Button
                    onClick={() => onDelete(file.id)}
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAnalyzeWithAI(file)}
                disabled={isAnalyzing}
                className="gap-2 w-full"
              >
                <Sparkles className="h-3 w-3" />
                {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => handleCertifyOnBlockchain(file)}
                disabled={isCertifying}
                className="gap-2 w-full bg-gradient-to-r from-primary to-primary/80"
              >
                <Shield className="h-3 w-3" />
                {isCertifying ? 'Certificando...' : 'Certificar en Blockchain'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Análisis con IA
            </DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
            {analysisResult}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileList;
