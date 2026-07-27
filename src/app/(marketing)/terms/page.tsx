import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PageGuard",
  description: "Terms and conditions for using PageGuard uptime monitoring service.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose prose-gray dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: July 26, 2026</p>

      <h2>1. Service Description</h2>
      <p>
        PageGuard (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides a website uptime monitoring service
        that periodically checks your websites for availability and sends email alerts
        when downtime is detected. We also offer public status page hosting and
        related monitoring features.
      </p>

      <h2>2. Acceptance of Terms</h2>
      <p>
        By creating an account or using PageGuard, you agree to be bound by these
        Terms of Service. If you do not agree, you may not use the service.
      </p>

      <h2>3. User Obligations</h2>
      <h3>3.1 Accurate Information</h3>
      <p>
        You agree to provide accurate, current, and complete information during the
        registration process and to keep your account information updated.
      </p>

      <h3>3.2 Acceptable Use</h3>
      <p>
        You agree not to:
      </p>
      <ul>
        <li>Use the service for any unlawful purpose or in violation of any applicable laws;</li>
        <li>Attempt to disrupt, degrade, or impair the service or its underlying infrastructure;</li>
        <li>Monitor websites without authorization to do so;</li>
        <li>Use automated scripts or bots to interact with the service beyond normal API rate limits;</li>
        <li>Share your account credentials with unauthorized third parties.</li>
      </ul>

      <h3>3.3 Account Responsibility</h3>
      <p>
        You are solely responsible for maintaining the confidentiality of your login
        credentials and for all activities that occur under your account. You must
        notify us immediately of any unauthorized use of your account.
      </p>

      <h2>4. Service Availability</h2>
      <p>
        While we strive for high availability of our monitoring service, we do not
        guarantee 100% uptime. PageGuard may experience temporary interruptions due
        to maintenance, infrastructure issues, or factors beyond our control.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        PageGuard monitors the availability of third-party websites and services. We
        are <strong>not liable</strong> for the downtime, unavailability, or
        performance issues of any third-party sites you choose to monitor.
        Our service provides monitoring and alerting only and does not constitute a
        guarantee that your website will remain operational.
      </p>
      <p>
        To the fullest extent permitted by law, PageGuard shall not be liable for any
        indirect, incidental, special, consequential, or punitive damages arising out
        of or related to your use of the service.
      </p>

      <h2>6. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access to the service at
        any time for violation of these terms or for any other reason, with or
        without notice. Upon termination, your right to use the service ceases
        immediately.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws
        applicable to agreements made and performed in the jurisdiction where
        PageGuard operates, without regard to its conflict of law provisions.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may modify these terms at any time. Changes will be effective immediately
        upon posting. Your continued use of the service after changes constitutes
        acceptance of the new terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:support@pguard.co">support@pguard.co</a>.
      </p>
    </article>
  );
}
