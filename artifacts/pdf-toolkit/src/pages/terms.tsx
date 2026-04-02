import { Layout } from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PDF Toolkit ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you should not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">2. Description of Service</h2>
            <p>
              PDF Toolkit provides online tools for processing PDF documents, including but not limited to merging, splitting, compressing, converting, editing, and securing PDF files. The Service may be offered as free or paid tiers with varying capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service only for lawful purposes</li>
              <li>Not upload files that contain malware, viruses, or malicious code</li>
              <li>Not attempt to overload, disrupt, or interfere with the Service</li>
              <li>Not use automated scripts or bots to access the Service without authorization</li>
              <li>Ensure you have the right to process any documents you upload</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">4. Intellectual Property</h2>
            <p>
              You retain all rights to the documents you upload and process through the Service. PDF Toolkit does not claim any ownership of your content. The Service itself, including its design, code, and branding, is the property of PDF Toolkit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">5. File Processing & Storage</h2>
            <p>
              Files uploaded for processing are temporarily stored on our servers and automatically deleted within one hour of processing completion. We do not access, review, or analyze the content of your files except as necessary to provide the requested service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">6. Service Availability</h2>
            <p>
              We strive to maintain high availability of the Service but do not guarantee uninterrupted access. We may perform maintenance, updates, or modifications that temporarily affect availability. We are not liable for any losses resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">7. Limitation of Liability</h2>
            <p>
              PDF Toolkit is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid for the Service in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">8. Payment Terms</h2>
            <p>
              Premium features require a paid subscription. Payments are processed securely through third-party payment providers. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are handled according to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time for violations of these Terms. You may stop using the Service at any time. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">10. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes take effect when posted on this page. Continued use of the Service after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">11. Contact</h2>
            <p>
              For questions about these Terms, please contact us at legal@pdftoolkit.com or visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
