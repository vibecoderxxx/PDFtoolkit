import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, RotateCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [degrees, setDegrees] = useState<string>("90");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setDownloadUrl(null);
  };

  const handleRotate = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("degrees", degrees);
      formData.append("allPages", "true");

      const response = await fetch("/api/pdf/rotate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to rotate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "PDF rotated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while rotating the PDF.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-rotate">Rotate PDF</h1>
          <p className="text-muted-foreground text-lg">Rotate your PDFs the way you need them.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to rotate"
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
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RotateCw className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-lg">Rotation Options</h3>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Rotate by</Label>
                    <RadioGroup value={degrees} onValueChange={setDegrees} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="90" id="deg-90" data-testid="radio-90" />
                        <Label htmlFor="deg-90" className="flex-1 cursor-pointer">90° Clockwise</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="180" id="deg-180" data-testid="radio-180" />
                        <Label htmlFor="deg-180" className="flex-1 cursor-pointer">180° (Upside down)</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="270" id="deg-270" data-testid="radio-270" />
                        <Label htmlFor="deg-270" className="flex-1 cursor-pointer">90° Counter-clockwise</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleRotate}
                    disabled={isProcessing}
                    data-testid="button-rotate"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Rotating...
                      </>
                    ) : (
                      "Rotate PDF"
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
            <h2 className="text-2xl font-bold">Your PDF is ready!</h2>
            <p className="text-muted-foreground">The document has been rotated.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = "rotated.pdf";
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
                  setDownloadUrl(null);
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
