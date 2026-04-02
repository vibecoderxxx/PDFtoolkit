import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, GripVertical } from "lucide-react";

export default function OrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const { toast } = useToast();

  const handleUpload = async (uploadedFiles: File[]) => {
    const f = uploadedFiles[0];
    setFile(f);
    setDownloadUrl(null);
    const formData = new FormData();
    formData.append("file", f);
    try {
      const res = await fetch("/api/pdf/page-count", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setPageCount(data.pageCount);
        setPageOrder(Array.from({ length: data.pageCount }, (_, i) => i + 1));
      }
    } catch {}
  };

  const movePage = (from: number, to: number) => {
    const newOrder = [...pageOrder];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    setPageOrder(newOrder);
  };

  const handleOrganize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("order", JSON.stringify(pageOrder.map(p => p - 1)));
      const response = await fetch("/api/pdf/organize", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "Pages reordered successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to reorganize PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Organize PDF</h1>
          <p className="text-muted-foreground text-lg">Sort, reorder, and organize the pages of your PDF.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to organize" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{pageCount} pages</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPageOrder([]); }}>Change file</Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {pageOrder.map((page, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium flex-1">Page {page}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => movePage(idx, idx - 1)}>↑</Button>
                        <Button variant="ghost" size="sm" disabled={idx === pageOrder.length - 1} onClick={() => movePage(idx, idx + 1)}>↓</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleOrganize} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</> : "Reorganize PDF"}
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
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "organized.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); setPageOrder([]); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
