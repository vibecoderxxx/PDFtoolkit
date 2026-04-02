import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState("");
  const [page, setPage] = useState(1);
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setDownloadUrl(null); };

  const handleSign = async () => {
    if (!file || !signatureText.trim()) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signatureText", signatureText);
      formData.append("page", page.toString());
      formData.append("x", x.toString());
      formData.append("y", y.toString());
      const response = await fetch("/api/pdf/sign", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF signed successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to sign PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Sign PDF</h1>
          <p className="text-muted-foreground text-lg">Add your signature to any PDF document.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to sign" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border space-y-4">
                  <div className="flex items-center gap-2 mb-2"><PenTool className="w-5 h-5 text-primary" /><h3 className="font-medium">Signature</h3></div>
                  <div><Label>Signature Text</Label><Input placeholder="Your name or signature" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} className="text-lg" /></div>
                  {signatureText && (
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <p className="text-2xl italic font-serif text-foreground">{signatureText}</p>
                      <p className="text-xs text-muted-foreground mt-1">Preview</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Page</Label><Input type="number" min={1} value={page} onChange={(e) => setPage(Number(e.target.value))} /></div>
                    <div><Label>X Position</Label><Input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} /></div>
                    <div><Label>Y Position</Label><Input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} /></div>
                  </div>
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleSign} disabled={isProcessing || !signatureText.trim()}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Signing...</> : "Sign PDF"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-10 rounded-2xl shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Download className="w-10 h-10" /></div>
            <h2 className="text-2xl font-bold">Your signed PDF is ready!</h2>
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "signed.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
