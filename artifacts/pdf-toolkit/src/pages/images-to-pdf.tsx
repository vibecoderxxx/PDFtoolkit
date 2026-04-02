import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "fit-to-image">("A4");
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
      formData.append("orientation", orientation);
      formData.append("pageSize", pageSize);
      formData.append("margin", "0");

      const response = await fetch("/api/pdf/images-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to convert images");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "Images converted to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while converting the images.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-images-to-pdf">JPG to PDF</h1>
          <p className="text-muted-foreground text-lg">Convert JPG images to PDF in seconds. Easily adjust orientation and margins.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            <FileUpload
              onUpload={handleUpload}
              maxFiles={20}
              accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
              title="Select images"
              description="Upload JPG or PNG images"
            />

            {files.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Selected images ({files.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-2">
                    {files.map((f, i) => (
                      <div key={i} className="relative group aspect-square bg-muted/50 rounded-lg border overflow-hidden" data-testid={`file-item-${i}`}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-xs font-medium truncate w-full px-2">{f.name}</span>
                        </div>
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setFiles(files.filter((_, index) => index !== i))}
                            data-testid={`button-remove-${i}`}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-xl border">
                  <div className="space-y-3">
                    <Label className="text-base">Page orientation</Label>
                    <RadioGroup value={orientation} onValueChange={(v: any) => setOrientation(v)} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="portrait" id="portrait" data-testid="radio-portrait" />
                        <Label htmlFor="portrait" className="flex-1 cursor-pointer">Portrait</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="landscape" id="landscape" data-testid="radio-landscape" />
                        <Label htmlFor="landscape" className="flex-1 cursor-pointer">Landscape</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Page size</Label>
                    <RadioGroup value={pageSize} onValueChange={(v: any) => setPageSize(v)} className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="fit-to-image" id="fit" data-testid="radio-fit" />
                        <Label htmlFor="fit" className="flex-1 cursor-pointer">Fit (same page size as image)</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="A4" id="a4" data-testid="radio-a4" />
                        <Label htmlFor="a4" className="flex-1 cursor-pointer">A4</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value="Letter" id="letter" data-testid="radio-letter" />
                        <Label htmlFor="letter" className="flex-1 cursor-pointer">US Letter</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleConvert}
                    disabled={files.length === 0 || isProcessing}
                    data-testid="button-convert"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      "Convert to PDF"
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
            <p className="text-muted-foreground">The images have been successfully converted to PDF.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = "images.pdf";
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
                  setFiles([]);
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
