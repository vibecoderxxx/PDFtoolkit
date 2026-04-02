import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon } from "lucide-react";

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setDownloadUrl(null); };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/pdf/pdf-to-word", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF converted to Word document." });
    } catch {
      toast({ title: "Error", description: "Failed to convert PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">PDF to WORD</h1>
          <p className="text-muted-foreground text-lg">Convert your PDF files to editable Word documents.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to convert to Word" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleConvert} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Converting...</> : "Convert to Word"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-10 rounded-2xl shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Download className="w-10 h-10" /></div>
            <h2 className="text-2xl font-bold">Your Word document is ready!</h2>
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "document.docx"; a.click(); }} className="shadow-md">Download DOCX</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
