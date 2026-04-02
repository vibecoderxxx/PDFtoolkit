import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, FileOutput } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pagesToExtract, setPagesToExtract] = useState<string>("");
  const [outputMode, setOutputMode] = useState<"merged" | "zip">("merged");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setDownloadUrl(null);
  };

  const handleExtract = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (pagesToExtract) {
        const pagesArray = pagesToExtract.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        formData.append("pages", JSON.stringify(pagesArray));
      }
      formData.append("outputMode", outputMode);

      const response = await fetch("/api/pdf/extract-pages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract pages");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "Pages extracted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while extracting pages.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-extract-pages">Extract pages from PDF</h1>
          <p className="text-muted-foreground text-lg">Get a new document containing only the desired pages.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to extract pages from"
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

                <div className="space-y-6 bg-muted/30 p-8 rounded-xl border max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileOutput className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-lg">Select pages to extract</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages to extract</Label>
                      <Input
                        id="pages"
                        type="text"
                        placeholder="e.g. 1, 3, 5"
                        value={pagesToExtract}
                        onChange={(e) => setPagesToExtract(e.target.value)}
                        data-testid="input-pages"
                      />
                      <p className="text-xs text-muted-foreground">Comma separated page numbers.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Label className="text-base">Output options</Label>
                      <RadioGroup value={outputMode} onValueChange={(v: any) => setOutputMode(v)} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merged" id="merged" data-testid="radio-merged" />
                          <Label htmlFor="merged" className="cursor-pointer">Merge extracted pages</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="zip" id="zip" data-testid="radio-zip" />
                          <Label htmlFor="zip" className="cursor-pointer">Extract as separate files (ZIP)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleExtract}
                    disabled={isProcessing || !pagesToExtract}
                    data-testid="button-extract-pages"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Extract Pages"
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
            <h2 className="text-2xl font-bold">Your files are ready!</h2>
            <p className="text-muted-foreground">The specified pages have been extracted.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = outputMode === "zip" ? "extracted.zip" : "extracted.pdf";
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
                  setPagesToExtract("");
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
