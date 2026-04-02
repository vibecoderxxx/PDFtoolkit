import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pagesToRemove, setPagesToRemove] = useState<string>("");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setDownloadUrl(null);
  };

  const handleRemove = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (pagesToRemove) {
        const pagesArray = pagesToRemove.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        formData.append("pages", JSON.stringify(pagesArray));
      }

      const response = await fetch("/api/pdf/remove-pages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to remove pages");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "Pages removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while removing pages.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-remove-pages">Remove pages from PDF</h1>
          <p className="text-muted-foreground text-lg">Remove unwanted pages from your document in a click.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to remove pages from"
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} data-testid="button-remove-file">
                    Change file
                  </Button>
                </div>

                <div className="space-y-6 bg-muted/30 p-8 rounded-xl border max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-lg">Select pages to remove</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages to remove</Label>
                      <Input
                        id="pages"
                        type="text"
                        placeholder="e.g. 1, 3, 5"
                        value={pagesToRemove}
                        onChange={(e) => setPagesToRemove(e.target.value)}
                        data-testid="input-pages"
                      />
                      <p className="text-xs text-muted-foreground">Comma separated page numbers.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleRemove}
                    disabled={isProcessing || !pagesToRemove}
                    data-testid="button-remove-pages"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Remove Pages"
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
            <p className="text-muted-foreground">The specified pages have been removed.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = "removed-pages.pdf";
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
                  setFile(null);
                  setDownloadUrl(null);
                  setPagesToRemove("");
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
