import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  disabled?: boolean;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogoUrl,
  onLogoChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentLogoUrl);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PNG, JPG, and JPEG files are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Logo file must be smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        // Delete old logo if exists
        if (currentLogoUrl) {
          const oldPath = currentLogoUrl.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('client-logos')
              .remove([oldPath]);
          }
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `client-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        setUploadProgress(25);

        // Upload new logo
        const { error: uploadError } = await supabase.storage
          .from('client-logos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        setUploadProgress(75);

        // Get public URL
        const { data } = supabase.storage
          .from('client-logos')
          .getPublicUrl(fileName);

        const logoUrl = data.publicUrl;
        setPreviewUrl(logoUrl);
        onLogoChange(logoUrl);
        setUploadProgress(100);

        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast({
          title: "Error",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [currentLogoUrl, onLogoChange, disabled, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading,
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeLogo = async () => {
    if (!currentLogoUrl) return;

    try {
      const fileName = currentLogoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('client-logos')
          .remove([fileName]);
      }

      setPreviewUrl('');
      onLogoChange('');
      
      toast({
        title: "Success",
        description: "Logo removed successfully",
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-2">
      <Label>Company Logo</Label>
      
      {/* Current Logo Preview */}
      {previewUrl && (
        <Card className="p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={previewUrl} 
                alt="Company logo" 
                className="h-12 w-12 object-cover rounded border"
                onError={() => setPreviewUrl('')}
              />
              <div>
                <p className="font-medium text-sm">Current Logo</p>
                <p className="text-xs text-muted-foreground">Click to upload a new one</p>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeLogo}
                className="text-destructive hover:text-destructive/90"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Upload Area */}
      {!disabled && (
        <Card className="p-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            {isDragActive ? (
              <p className="text-sm font-medium">Drop logo here...</p>
            ) : (
              <div>
                <p className="text-sm font-medium mb-1">
                  {previewUrl ? 'Replace logo' : 'Upload company logo'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
          
          {uploading && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};