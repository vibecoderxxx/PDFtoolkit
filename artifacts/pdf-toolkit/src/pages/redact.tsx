import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RedactPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState("");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setDownloadUrl(null); };

  const handleRedact = async () => {
    if (!file || !searchTerms.trim()) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("searchTerms", searchTerms);
      const response = await fetch("/api/pdf/redact", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF redacted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to redact PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Redact PDF</h1>
          <p className="text-muted-foreground text-lg">Black out sensitive information in your PDF documents.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to redact" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border space-y-4">
                  <div className="flex items-center gap-2 mb-2"><EyeOff className="w-5 h-5 text-red-500" /><h3 className="font-medium">Redaction Settings</h3></div>
                  <div><Label>Text to redact (comma-separated)</Label><Input placeholder="e.g., John Doe, 555-1234, SSN" value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} /></div>
                  <p className="text-xs text-muted-foreground">All matching text will be covered with black rectangles and permanently removed from the document.</p>
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md bg-red-600 hover:bg-red-700" onClick={handleRedact} disabled={isProcessing || !searchTerms.trim()}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Redacting...</> : "Redact PDF"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-10 rounded-2xl shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Download className="w-10 h-10" /></div>
            <h2 className="text-2xl font-bold">Your redacted PDF is ready!</h2>
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "redacted.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
