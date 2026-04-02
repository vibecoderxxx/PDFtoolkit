import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
    setDownloadUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      
      const order = files.map((_, i) => i);
      formData.append("order", JSON.stringify(order));

      const response = await fetch("/api/pdf/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to merge PDFs");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "PDFs merged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while merging PDFs.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-merge">Merge PDF</h1>
          <p className="text-muted-foreground text-lg">Combine multiple PDFs into one unified document.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            <FileUpload
              onUpload={handleUpload}
              maxFiles={20}
              title="Select PDF files"
              description="Upload multiple PDFs to merge them"
            />

            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Files to merge ({files.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border" data-testid={`file-item-${i}`}>
                      <span className="text-sm font-medium truncate">{f.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles(files.filter((_, index) => index !== i))}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        data-testid={`button-remove-${i}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleMerge}
                    disabled={files.length < 2 || isProcessing}
                    data-testid="button-merge"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      "Merge PDFs"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-10 rounded-2xl shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Your PDF is ready!</h2>
            <p className="text-muted-foreground">The files have been successfully merged.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = "merged.pdf";
                  a.click();
                }}
                data-testid="button-download"
                className="shadow-md"
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setFiles([]);
                  setDownloadUrl(null);
                }}
                data-testid="button-start-over"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
