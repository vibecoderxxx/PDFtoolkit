import { Layout } from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
            <p>
              PDF Toolkit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">2. Information We Collect</h2>
            <p>
              <strong>Files You Upload:</strong> When you use our PDF processing tools, you may upload files to our servers. These files are processed solely to provide the requested service and are automatically deleted within one hour of processing completion.
            </p>
            <p>
              <strong>Usage Data:</strong> We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed. This data helps us improve our services.
            </p>
            <p>
              <strong>Account Information:</strong> If you create an account, we collect your email address and any profile information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve our PDF processing services</li>
              <li>Process your uploaded files as requested</li>
              <li>Send you service-related communications</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">4. Data Retention</h2>
            <p>
              Uploaded files are automatically deleted from our servers within one hour of processing. Account data is retained for as long as your account is active. You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">5. Data Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties. We may share anonymized, aggregated data for analytical purposes. We may disclose information when required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. For more details, see our Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access, correct, or delete your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">8. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data transfers are encrypted using TLS 1.3.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@pdftoolkit.com or visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
