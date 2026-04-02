import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileIcon, GitCompare } from "lucide-react";

export default function ComparePdf() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ differences: string; identical: boolean } | null>(null);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file1", file1);
      formData.append("file2", file2);
      const response = await fetch("/api/pdf/compare", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setResult(data);
      toast({ title: data.identical ? "Identical" : "Differences found", description: data.identical ? "The two PDFs have identical text content." : "Differences have been detected between the PDFs." });
    } catch {
      toast({ title: "Error", description: "Failed to compare PDFs.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Compare PDF</h1>
          <p className="text-muted-foreground text-lg">Compare two PDF files and find the differences.</p>
        </div>
        <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Original PDF</h3>
              {!file1 ? (
                <FileUpload onUpload={(files) => setFile1(files[0])} title="Select first PDF" description="Upload the original PDF" />
              ) : (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-2"><FileIcon className="w-6 h-6 text-primary" /><span className="text-sm font-medium truncate">{file1.name}</span></div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile1(null); setResult(null); }}>Change</Button>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-3">Modified PDF</h3>
              {!file2 ? (
                <FileUpload onUpload={(files) => setFile2(files[0])} title="Select second PDF" description="Upload the modified PDF" />
              ) : (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-2"><FileIcon className="w-6 h-6 text-primary" /><span className="text-sm font-medium truncate">{file2.name}</span></div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile2(null); setResult(null); }}>Change</Button>
                </div>
              )}
            </div>
          </div>
          {file1 && file2 && !result && (
            <div className="pt-4 flex justify-center">
              <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleCompare} disabled={isProcessing}>
                {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Comparing...</> : <><GitCompare className="w-5 h-5 mr-2" />Compare PDFs</>}
              </Button>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border text-center ${result.identical ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                <p className={`font-bold text-lg ${result.identical ? "text-green-700" : "text-amber-700"}`}>{result.identical ? "Documents are identical" : "Differences found"}</p>
              </div>
              {!result.identical && (
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">{result.differences}</pre>
              )}
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { setFile1(null); setFile2(null); setResult(null); }}>Compare Again</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
