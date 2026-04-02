import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, FileIcon, ListOrdered } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<string>("bottom-center");
  const [format, setFormat] = useState<string>("numeric");
  const [startNumber, setStartNumber] = useState("1");
  const { toast } = useToast();

  const handleUpload = (uploadedFiles: File[]) => {
    setFile(uploadedFiles[0]);
    setDownloadUrl(null);
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("position", position);
      formData.append("format", format);
      formData.append("startNumber", startNumber);

      const response = await fetch("/api/pdf/add-page-numbers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add page numbers");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      toast({
        title: "Success!",
        description: "Page numbers added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding page numbers.",
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3" data-testid="heading-page-numbers">Add Page Numbers</h1>
          <p className="text-muted-foreground text-lg">Add page numbers into PDFs with ease.</p>
        </div>

        {!downloadUrl ? (
          <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl shadow-sm border">
            {!file ? (
              <FileUpload
                onUpload={handleUpload}
                title="Select PDF file"
                description="Upload a PDF to add page numbers"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-xl border">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-teal-600 mb-2">
                      <ListOrdered className="w-5 h-5" />
                      <h3 className="font-medium">Number Options</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger data-testid="select-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger data-testid="select-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="numeric">1, 2, 3</SelectItem>
                          <SelectItem value="Page X of Y">Page 1 of 5</SelectItem>
                          <SelectItem value="X/Y">1/5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label htmlFor="start">Start number</Label>
                      <Input
                        id="start"
                        type="number"
                        value={startNumber}
                        onChange={(e) => setStartNumber(e.target.value)}
                        data-testid="input-start-number"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] shadow-md"
                    onClick={handleAddPageNumbers}
                    disabled={isProcessing}
                    data-testid="button-add-page-numbers"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Add Page Numbers"
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
            <p className="text-muted-foreground">Page numbers have been added successfully.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = "numbered.pdf";
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
