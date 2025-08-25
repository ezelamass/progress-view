import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, Download } from 'lucide-react';

interface FileAttachment {
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy?: string;
}

interface FileUploadProps {
  deliverableId: string;
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  deliverableId,
  attachments,
  onAttachmentsChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      setUploading(true);
      setUploadProgress(0);

      const uploadedFiles: FileAttachment[] = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `deliverables/${deliverableId}/${fileName}`;

        try {
          const { error } = await supabase.storage
            .from('project-documents')
            .upload(filePath, file);

          if (error) throw error;

          uploadedFiles.push({
            fileName: file.name,
            filePath,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          });

          setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
        }
      }

      if (uploadedFiles.length > 0) {
        const newAttachments = [...attachments, ...uploadedFiles];
        onAttachmentsChange(newAttachments);
        toast({
          title: "Success",
          description: `${uploadedFiles.length} file(s) uploaded successfully`,
        });
      }

      setUploading(false);
      setUploadProgress(0);
    },
    [deliverableId, attachments, onAttachmentsChange, disabled, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading,
    multiple: true,
  });

  const removeFile = async (attachment: FileAttachment) => {
    try {
      const { error } = await supabase.storage
        .from('project-documents')
        .remove([attachment.filePath]);

      if (error) throw error;

      const updatedAttachments = attachments.filter(a => a.filePath !== attachment.filePath);
      onAttachmentsChange(updatedAttachments);
      
      toast({
        title: "Success",
        description: "File removed successfully",
      });
    } catch (error) {
      console.error('Error removing file:', error);
      toast({
        title: "Error",
        description: "Failed to remove file",
        variant: "destructive",
      });
    }
  };

  const downloadFile = async (attachment: FileAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(attachment.filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!disabled && (
        <Card className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Support for multiple files
                </p>
              </div>
            )}
          </div>
          
          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </Card>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Attached Files ({attachments.length})</h4>
          {attachments.map((attachment, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.fileSize)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(attachment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(attachment)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};