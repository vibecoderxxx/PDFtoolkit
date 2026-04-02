import { Layout } from "@/components/Layout";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is PDF Toolkit free to use?",
    answer: "Yes, PDF Toolkit offers a generous free tier that lets you process PDF files without any cost. For higher volume usage and advanced features, we offer premium plans with additional capabilities.",
  },
  {
    question: "Are my files secure?",
    answer: "Absolutely. All files are transferred using encrypted connections (HTTPS/TLS). Many of our tools process files directly in your browser, meaning your documents never leave your device. For server-side processing, files are automatically deleted after processing is complete.",
  },
  {
    question: "What file size limits apply?",
    answer: "Free users can process files up to 100MB per document. Premium users enjoy higher limits of up to 4GB per file, along with batch processing capabilities for handling multiple files at once.",
  },
  {
    question: "Can I use PDF Toolkit on mobile devices?",
    answer: "Yes, PDF Toolkit is fully responsive and works in any modern web browser on phones, tablets, and desktops. We also offer dedicated mobile apps for iOS and Android for an optimized experience.",
  },
  {
    question: "What PDF formats do you support?",
    answer: "We support all standard PDF formats including PDF 1.0 through 2.0, PDF/A for archival, and PDF/X for print production. Our tools handle password-protected PDFs, scanned documents, and form-fillable PDFs.",
  },
  {
    question: "How does the PDF compression work?",
    answer: "Our compression algorithm analyzes your PDF and optimizes images, fonts, and metadata while preserving visual quality. You can choose between different compression levels: low (best quality), medium (balanced), and high (smallest file size).",
  },
  {
    question: "Can I convert PDFs to editable documents?",
    answer: "Yes, our conversion tools can transform PDFs into editable Word documents, Excel spreadsheets, PowerPoint presentations, and more. The conversion preserves formatting, tables, and images as accurately as possible.",
  },
  {
    question: "Does OCR work with all languages?",
    answer: "Our OCR engine supports over 100 languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and many more. It can handle multi-language documents and various script types.",
  },
  {
    question: "How does the AI Summarizer work?",
    answer: "Our AI Summarizer uses advanced natural language processing to analyze your PDF content and generate concise summaries. It identifies key points, main arguments, and important details to give you a quick overview of lengthy documents.",
  },
  {
    question: "Can I merge more than two PDFs at once?",
    answer: "Yes, you can merge as many PDF files as you need in a single operation. Simply upload all the files you want to combine, arrange them in your preferred order, and merge them with one click.",
  },
  {
    question: "Do you offer an API for developers?",
    answer: "Yes, we provide a comprehensive REST API that allows developers to integrate PDF processing capabilities into their own applications. Visit our API documentation page for more details on endpoints, authentication, and usage examples.",
  },
  {
    question: "What happens to my files after processing?",
    answer: "For tools that require server-side processing, your files are automatically deleted from our servers within one hour of processing completion. We never store, share, or analyze your documents beyond what's necessary to provide the service.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about PDF Toolkit. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
