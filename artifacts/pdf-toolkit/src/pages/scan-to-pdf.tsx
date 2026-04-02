import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ScanLine } from "lucide-react";

export default function ScanToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFiles((prev) => [...prev, ...uploadedFiles]);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("orientation", "portrait");
      formData.append("pageSize", "A4");
      formData.append("margin", "20");
      const response = await fetch("/api/pdf/images-to-pdf", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "Scanned images converted to PDF." });
    } catch {
      toast({ title: "Error", description: "Failed to convert scans to PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Scan to PDF</h1>
          <p className="text-muted-foreground text-lg">Upload scanned images and convert them into a PDF document.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            <FileUpload onUpload={handleUpload} maxFiles={20} accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/tiff": [".tiff", ".tif"] }} title="Select scanned images" description="Upload JPG, PNG, or TIFF scans" />
            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Selected scans ({files.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2"><ScanLine className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-medium truncate">{f.name}</span></div>
                      <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-destructive">Remove</Button>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleConvert} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Converting...</> : "Create PDF"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card p-10 rounded-2xl shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Download className="w-10 h-10" /></div>
            <h2 className="text-2xl font-bold">Your PDF is ready!</h2>
            <div className="flex justify-center space-x-4 pt-4">
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "scanned.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFiles([]); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
