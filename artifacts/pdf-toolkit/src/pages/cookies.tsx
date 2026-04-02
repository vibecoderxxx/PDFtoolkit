import { Layout } from "@/components/Layout";

export default function Cookies() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground">What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">How We Use Cookies</h2>
            <p>PDF Toolkit uses cookies for the following purposes:</p>

            <h3 className="text-lg font-semibold text-foreground mt-4">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas access, and remembering your preferences. The website cannot function properly without these cookies.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-4">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-4">Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering your language preferences, recent tool usage, and display settings.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-4">Marketing Cookies</h3>
            <p>
              These cookies may be set through our site by advertising partners. They may be used to build a profile of your interests and show you relevant content on other sites. They do not directly store personal information but are based on uniquely identifying your browser and device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites. Please note that disabling cookies may affect the functionality of our website.
            </p>
            <p>Here's how to manage cookies in popular browsers:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chrome: Settings &gt; Privacy and security &gt; Cookies</li>
              <li>Firefox: Settings &gt; Privacy & Security &gt; Cookies</li>
              <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
              <li>Edge: Settings &gt; Privacy &gt; Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Third-Party Cookies</h2>
            <p>
              Some cookies on our website are set by third-party services that appear on our pages. We do not control the dissemination of these cookies. You can check the third-party websites for more information about these cookies and how to manage them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at privacy@pdftoolkit.com or visit our Contact page.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
