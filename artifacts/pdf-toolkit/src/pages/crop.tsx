import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, Crop as CropIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [margins, setMargins] = useState({ top: 50, right: 50, bottom: 50, left: 50 });
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setDownloadUrl(null); };

  const handleCrop = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("top", margins.top.toString());
      formData.append("right", margins.right.toString());
      formData.append("bottom", margins.bottom.toString());
      formData.append("left", margins.left.toString());
      const response = await fetch("/api/pdf/crop", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF cropped successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to crop PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Crop PDF</h1>
          <p className="text-muted-foreground text-lg">Trim the margins of your PDF pages.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to crop" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-xl border">
                  <div className="flex items-center gap-2 mb-4"><CropIcon className="w-5 h-5 text-primary" /><h3 className="font-medium">Crop Margins (points)</h3></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Top</Label><Input type="number" value={margins.top} onChange={(e) => setMargins({ ...margins, top: Number(e.target.value) })} /></div>
                    <div><Label>Right</Label><Input type="number" value={margins.right} onChange={(e) => setMargins({ ...margins, right: Number(e.target.value) })} /></div>
                    <div><Label>Bottom</Label><Input type="number" value={margins.bottom} onChange={(e) => setMargins({ ...margins, bottom: Number(e.target.value) })} /></div>
                    <div><Label>Left</Label><Input type="number" value={margins.left} onChange={(e) => setMargins({ ...margins, left: Number(e.target.value) })} /></div>
                  </div>
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleCrop} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Cropping...</> : "Crop PDF"}
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
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "cropped.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
