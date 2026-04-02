import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
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
import OrganizePdf from "@/pages/organize";
import ScanToPdf from "@/pages/scan-to-pdf";
import OcrPdf from "@/pages/ocr";
import WordToPdf from "@/pages/word-to-pdf";
import PowerpointToPdf from "@/pages/powerpoint-to-pdf";
import ExcelToPdf from "@/pages/excel-to-pdf";
import HtmlToPdf from "@/pages/html-to-pdf";
import PdfToWord from "@/pages/pdf-to-word";
import PdfToPowerpoint from "@/pages/pdf-to-powerpoint";
import PdfToExcel from "@/pages/pdf-to-excel";
import PdfToPdfa from "@/pages/pdf-to-pdfa";
import CropPdf from "@/pages/crop";
import EditPdf from "@/pages/edit-pdf";
import SignPdf from "@/pages/sign";
import RedactPdf from "@/pages/redact";
import ComparePdf from "@/pages/compare";
import AiSummarizer from "@/pages/ai-summarizer";
import TranslatePdf from "@/pages/translate";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function SignInPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Home />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/merge">{() => <ProtectedRoute component={MergePdf} />}</Route>
            <Route path="/split">{() => <ProtectedRoute component={SplitPdf} />}</Route>
            <Route path="/remove-pages">{() => <ProtectedRoute component={RemovePages} />}</Route>
            <Route path="/extract-pages">{() => <ProtectedRoute component={ExtractPages} />}</Route>
            <Route path="/compress">{() => <ProtectedRoute component={CompressPdf} />}</Route>
            <Route path="/watermark">{() => <ProtectedRoute component={Watermark} />}</Route>
            <Route path="/page-numbers">{() => <ProtectedRoute component={PageNumbers} />}</Route>
            <Route path="/protect">{() => <ProtectedRoute component={ProtectPdf} />}</Route>
            <Route path="/unlock">{() => <ProtectedRoute component={UnlockPdf} />}</Route>
            <Route path="/rotate">{() => <ProtectedRoute component={RotatePdf} />}</Route>
            <Route path="/images-to-pdf">{() => <ProtectedRoute component={ImagesToPdf} />}</Route>
            <Route path="/pdf-to-images">{() => <ProtectedRoute component={PdfToImages} />}</Route>
            <Route path="/repair">{() => <ProtectedRoute component={RepairPdf} />}</Route>
            <Route path="/organize">{() => <ProtectedRoute component={OrganizePdf} />}</Route>
            <Route path="/scan-to-pdf">{() => <ProtectedRoute component={ScanToPdf} />}</Route>
            <Route path="/ocr">{() => <ProtectedRoute component={OcrPdf} />}</Route>
            <Route path="/word-to-pdf">{() => <ProtectedRoute component={WordToPdf} />}</Route>
            <Route path="/powerpoint-to-pdf">{() => <ProtectedRoute component={PowerpointToPdf} />}</Route>
            <Route path="/excel-to-pdf">{() => <ProtectedRoute component={ExcelToPdf} />}</Route>
            <Route path="/html-to-pdf">{() => <ProtectedRoute component={HtmlToPdf} />}</Route>
            <Route path="/pdf-to-word">{() => <ProtectedRoute component={PdfToWord} />}</Route>
            <Route path="/pdf-to-powerpoint">{() => <ProtectedRoute component={PdfToPowerpoint} />}</Route>
            <Route path="/pdf-to-excel">{() => <ProtectedRoute component={PdfToExcel} />}</Route>
            <Route path="/pdf-to-pdfa">{() => <ProtectedRoute component={PdfToPdfa} />}</Route>
            <Route path="/crop">{() => <ProtectedRoute component={CropPdf} />}</Route>
            <Route path="/edit-pdf">{() => <ProtectedRoute component={EditPdf} />}</Route>
            <Route path="/sign">{() => <ProtectedRoute component={SignPdf} />}</Route>
            <Route path="/redact">{() => <ProtectedRoute component={RedactPdf} />}</Route>
            <Route path="/compare">{() => <ProtectedRoute component={ComparePdf} />}</Route>
            <Route path="/ai-summarize">{() => <ProtectedRoute component={AiSummarizer} />}</Route>
            <Route path="/translate">{() => <ProtectedRoute component={TranslatePdf} />}</Route>
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
