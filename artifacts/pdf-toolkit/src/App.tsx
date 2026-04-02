import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/index";
import MergePdf from "@/pages/merge";
import SplitPdf from "@/pages/split";
import RemovePages from "@/pages/remove-pages";
import ExtractPages from "@/pages/extract-pages";
import CompressPdf from "@/pages/compress";
import Watermark from "@/pages/watermark";
import PageNumbers from "@/pages/page-numbers";
import ProtectPdf from "@/pages/protect";
import UnlockPdf from "@/pages/unlock";
import RotatePdf from "@/pages/rotate";
import ImagesToPdf from "@/pages/images-to-pdf";
import PdfToImages from "@/pages/pdf-to-images";
import RepairPdf from "@/pages/repair";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/merge" component={MergePdf} />
      <Route path="/split" component={SplitPdf} />
      <Route path="/remove-pages" component={RemovePages} />
      <Route path="/extract-pages" component={ExtractPages} />
      <Route path="/compress" component={CompressPdf} />
      <Route path="/watermark" component={Watermark} />
      <Route path="/page-numbers" component={PageNumbers} />
      <Route path="/protect" component={ProtectPdf} />
      <Route path="/unlock" component={UnlockPdf} />
      <Route path="/rotate" component={RotatePdf} />
      <Route path="/images-to-pdf" component={ImagesToPdf} />
      <Route path="/pdf-to-images" component={PdfToImages} />
      <Route path="/repair" component={RepairPdf} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
