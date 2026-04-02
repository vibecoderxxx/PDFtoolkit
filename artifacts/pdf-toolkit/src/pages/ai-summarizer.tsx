import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileIcon, Sparkles, Copy, Check } from "lucide-react";

export default function AiSummarizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => { setFile(uploadedFiles[0]); setSummary(null); };

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/pdf/ai-summarize", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setSummary(data.summary);
      toast({ title: "Success!", description: "PDF summarized successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to summarize PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (summary) { navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">AI Summarizer</h1>
          <p className="text-muted-foreground text-lg">Get an AI-powered summary of your PDF document.</p>
        </div>
        <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
          {!file ? (
            <FileUpload onUpload={handleUpload} title="Select PDF file" description="Upload a PDF to summarize" />
          ) : !summary ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center space-x-3"><FileIcon className="w-8 h-8 text-primary" /><div><p className="font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change file</Button>
              </div>
              <div className="bg-muted/30 p-6 rounded-xl border text-center">
                <Sparkles className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">AI will analyze your document and generate a comprehensive summary of its key points and main ideas.</p>
              </div>
              <div className="pt-4 flex justify-center">
                <Button size="lg" className="min-w-[200px] shadow-md" onClick={handleSummarize} disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</> : <><Sparkles className="w-5 h-5 mr-2" />Summarize</>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />Summary</h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>{copied ? <><Check className="w-4 h-4 mr-1" />Copied</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}</Button>
              </div>
              <div className="bg-muted/30 p-6 rounded-xl border prose prose-sm max-w-none"><p className="whitespace-pre-wrap">{summary}</p></div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => { setFile(null); setSummary(null); }}>Summarize Another</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
