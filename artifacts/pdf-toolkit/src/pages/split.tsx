import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"ranges" | "all-pages">("all-pages");
  const [ranges, setRanges] = useState<string>("");
  const [outputMode, setOutputMode] = useState<"separate" | "merged">("separate");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setDownloadUrl(null);
  };

  const handleSplit = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);
      
      if (mode === "ranges" && ranges) {
        // Parse "1-3,5-5" to [{"from":1,"to":3},{"from":5,"to":5}]
        const parsedRanges = ranges.split(",").map(r => {
          const parts = r.trim().split("-");
          if (parts.length === 1) return { from: parseInt(parts[0]), to: parseInt(parts[0]) };
          return { from: parseInt(parts[0]), to: parseInt(parts[1]) };
        });
        formData.append("ranges", JSON.stringify(parsedRanges));
      }
      
      formData.append("outputMode", outputMode);

      const response = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to split PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "PDF split successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while splitting the PDF.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-split">Split PDF</h1>
          <p className="text-muted-foreground text-lg">Separate one page or a whole set for easy conversion into independent PDF files.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to split"
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

                <div className="space-y-6 bg-muted/30 p-6 rounded-xl border">
                  <div className="space-y-3">
                    <Label className="text-base">Split by</Label>
                    <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="all-pages" id="all-pages" data-testid="radio-all-pages" />
                        <Label htmlFor="all-pages" className="flex-1 cursor-pointer">Extract all pages</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="ranges" id="ranges" data-testid="radio-ranges" />
                        <Label htmlFor="ranges" className="flex-1 cursor-pointer">Custom ranges</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {mode === "ranges" && (
                    <div className="space-y-2 pl-2">
                      <Label htmlFor="ranges-input">Page ranges</Label>
                      <Input 
                        id="ranges-input" 
                        placeholder="e.g. 1-5, 8, 11-13" 
                        value={ranges}
                        onChange={(e) => setRanges(e.target.value)}
                        data-testid="input-ranges"
                      />
                      <p className="text-xs text-muted-foreground">Comma separated page numbers or ranges.</p>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-base">Output mode</Label>
                    <RadioGroup value={outputMode} onValueChange={(v: any) => setOutputMode(v)} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="separate" id="separate" data-testid="radio-separate" />
                        <Label htmlFor="separate" className="flex-1 cursor-pointer">Separate PDF files</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="merged" id="merged" data-testid="radio-merged" />
                        <Label htmlFor="merged" className="flex-1 cursor-pointer">Merge extracted pages into one PDF</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleSplit}
                    disabled={isProcessing || (mode === "ranges" && !ranges)}
                    data-testid="button-split"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Split PDF"
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
            <h2 className="text-2xl font-bold">Your PDF has been split!</h2>
            <p className="text-muted-foreground">Download your processed files below.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = outputMode === "separate" || mode === "all-pages" ? "split.zip" : "split.pdf";
                  a.click();
                }}
                data-testid="button-download"
                className="shadow-md"
              >
                Download File
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setFile(null);
                  setDownloadUrl(null);
                  setRanges("");
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
