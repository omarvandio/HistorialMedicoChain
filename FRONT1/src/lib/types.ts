export type UserRole = 'patient' | 'doctor';

export interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  ownerAddress: string;
  file: File;
  previewUrl?: string;
}

export interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  userAddress: string | null;
}

export interface FileListProps {
  files: MedicalFile[];
  onDelete: (fileId: string) => void;
  onView: (file: MedicalFile) => void;
  role: UserRole;
  walletAddress: string | null;
}

export interface FileViewerProps {
  file: MedicalFile | null;
  isOpen: boolean;
  onClose: () => void;
}
