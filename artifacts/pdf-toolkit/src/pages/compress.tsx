import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ downloadUrl: string; originalSize: number; compressedSize: number; savings: number } | null>(null);
  const [qualityLevel, setQualityLevel] = useState<number[]>([50]);
  const { toast } = useToast();

  const getQualityString = (val: number) => {
    if (val < 33) return "low";
    if (val < 66) return "medium";
    return "high";
  };

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", getQualityString(qualityLevel[0]));

      const response = await fetch("/api/pdf/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to compress PDF");

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Success!",
        description: "PDF compressed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while compressing the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-compress">Compress PDF</h1>
          <p className="text-muted-foreground text-lg">Reduce file size while optimizing for maximal PDF quality.</p>
        </div>

        {!result ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to compress"
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} data-testid="button-remove-file">
                    Change file
                  </Button>
                </div>

                <div className="space-y-6 bg-muted/30 p-6 rounded-xl border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Compression Level</h3>
                      <span className="text-sm font-bold text-primary capitalize">{getQualityString(qualityLevel[0])} Quality</span>
                    </div>
                    
                    <div className="pt-6 pb-2 px-2">
                      <Slider
                        value={qualityLevel}
                        onValueChange={setQualityLevel}
                        max={100}
                        step={1}
                        data-testid="slider-quality"
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <div className="text-center">
                        <p className="font-medium text-foreground">Extreme Compression</p>
                        <p>Less quality</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">Recommended</p>
                        <p>Good quality</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">Less Compression</p>
                        <p>High quality</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleCompress}
                    disabled={isProcessing}
                    data-testid="button-compress"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      "Compress PDF"
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
            <h2 className="text-2xl font-bold">Your PDF has been compressed!</h2>
            
            <div className="bg-muted p-6 rounded-xl max-w-md mx-auto space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Original Size</span>
                <span className="font-medium">{formatBytes(result.originalSize)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Compressed Size</span>
                <span className="font-bold text-green-600">{formatBytes(result.compressedSize)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Saved</span>
                <span className="font-bold text-primary">{result.savings.toFixed(0)}%</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = result.downloadUrl;
                  a.download = "compressed.pdf";
                  a.click();
                }}
                data-testid="button-download"
                className="shadow-md"
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setFile(null);
                  setResult(null);
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
