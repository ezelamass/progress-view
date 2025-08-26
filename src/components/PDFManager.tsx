import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PDFAttachment {
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy?: string;
}

interface PDFManagerProps {
  attachments: PDFAttachment[];
  deliverableName: string;
  isClientView?: boolean;
}

export const PDFManager: React.FC<PDFManagerProps> = ({
  attachments,
  deliverableName,
  isClientView = false,
}) => {
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadPDF = async (attachment: PDFAttachment) => {
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

      toast({
        title: "Success",
        description: `Downloaded ${attachment.fileName}`,
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const isPDF = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const pdfAttachments = attachments.filter(attachment => isPDF(attachment.fileName));

  if (pdfAttachments.length === 0) {
    return (
      <Card className="bg-muted/20 border-dashed">
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No PDF Documents</h3>
          <p className="text-sm text-muted-foreground">
            {isClientView 
              ? "No PDF documents are available for this deliverable yet."
              : "Upload PDF documents to share with your client."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          PDF Documents for {deliverableName}
        </h3>
        <Badge variant="secondary">
          {pdfAttachments.length} PDF{pdfAttachments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-3">
        {pdfAttachments.map((attachment, index) => (
          <Card key={index} className="bg-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {attachment.fileName}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span>📄</span>
                        {formatFileSize(attachment.fileSize)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </span>
                      {attachment.uploadedBy && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {attachment.uploadedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPDF(attachment)}
                  className="ml-4"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isClientView && (
        <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-sm text-info-foreground">
            💡 Click "Download" to save PDF documents to your device. These files contain important project deliverables and documentation.
          </p>
        </div>
      )}
    </div>
  );
};