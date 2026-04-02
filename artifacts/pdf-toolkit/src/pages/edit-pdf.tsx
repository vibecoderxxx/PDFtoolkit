import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextAnnotation { text: string; page: number; x: number; y: number; fontSize: number; }

export default function EditPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([{ text: "", page: 1, x: 50, y: 700, fontSize: 12 }]);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setDownloadUrl(null); };

  const addAnnotation = () => setAnnotations([...annotations, { text: "", page: 1, x: 50, y: 650, fontSize: 12 }]);
  const removeAnnotation = (idx: number) => setAnnotations(annotations.filter((_, i) => i !== idx));
  const updateAnnotation = (idx: number, field: keyof TextAnnotation, value: string | number) => {
    const updated = [...annotations];
    (updated[idx] as any)[field] = value;
    setAnnotations(updated);
  };

  const handleEdit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("annotations", JSON.stringify(annotations.filter(a => a.text.trim())));
      const response = await fetch("/api/pdf/edit", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      toast({ title: "Success!", description: "PDF edited successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to edit PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Edit PDF</h1>
          <p className="text-muted-foreground text-lg">Add text annotations to your PDF document.</p>
        </div>
        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to edit" />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p></div></div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><h3 className="font-medium">Text Annotations</h3><Button variant="outline" size="sm" onClick={addAnnotation}><Plus className="w-4 h-4 mr-1" />Add</Button></div>
                  {annotations.map((ann, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg border space-y-3">
                      <div className="flex justify-between items-center"><span className="text-sm font-medium">Annotation {idx + 1}</span>{annotations.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeAnnotation(idx)}><X className="w-4 h-4" /></Button>}</div>
                      <Input placeholder="Text content" value={ann.text} onChange={(e) => updateAnnotation(idx, "text", e.target.value)} />
                      <div className="grid grid-cols-4 gap-2">
                        <div><Label className="text-xs">Page</Label><Input type="number" min={1} value={ann.page} onChange={(e) => updateAnnotation(idx, "page", Number(e.target.value))} /></div>
                        <div><Label className="text-xs">X</Label><Input type="number" value={ann.x} onChange={(e) => updateAnnotation(idx, "x", Number(e.target.value))} /></div>
                        <div><Label className="text-xs">Y</Label><Input type="number" value={ann.y} onChange={(e) => updateAnnotation(idx, "y", Number(e.target.value))} /></div>
                        <div><Label className="text-xs">Size</Label><Input type="number" value={ann.fontSize} onChange={(e) => updateAnnotation(idx, "fontSize", Number(e.target.value))} /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleEdit} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</> : "Apply Edits"}
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
              <Button size="lg" onClick={() => { const a = document.createElement("a"); a.href = downloadUrl; a.download = "edited.pdf"; a.click(); }} className="shadow-md">Download PDF</Button>
              <Button variant="outline" size="lg" onClick={() => { setFile(null); setDownloadUrl(null); }}>Start Over</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
