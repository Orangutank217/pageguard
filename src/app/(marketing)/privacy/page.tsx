import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PageGuard",
  description: "How PageGuard collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose prose-gray dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: July 26, 2026</p>

      <h2>1. Information We Collect</h2>
      <p>
        When you use PageGuard, we collect the following information:
      </p>
      <ul>
        <li>
          <strong>Account information:</strong> your email address and full name
          are collected when you create an account.
        </li>
        <li>
          <strong>Monitoring data:</strong> the URLs you choose to monitor, along
          with the check history (HTTP status codes, response times, and uptime
          percentages) associated with each monitor.
        </li>
        <li>
          <strong>Usage data:</strong> we may collect anonymized usage statistics
          to improve the service, such as feature interactions and page views.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Operate and maintain the PageGuard monitoring service;</li>
        <li>Send email alerts when your monitored sites experience downtime;</li>
        <li>Process payments and manage subscriptions through our billing provider;</li>
        <li>Respond to support inquiries and communicate with you about your account;</li>
        <li>Improve and develop new features for the service.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        PageGuard uses cookies solely for authentication purposes. We do not use
        cookies for tracking, advertising, or any other non-essential purpose.
        The authentication cookies are strictly necessary for the service to
        function and are set only when you sign in to your account.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        We rely on the following third-party providers to deliver the service:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> &mdash; database hosting and authentication. Your
          account credentials, monitor configurations, and check history are stored
          in Supabase. Supabase acts as our data processor.
        </li>
        <li>
          <strong>Resend</strong> &mdash; email delivery. Your email address is shared
          with Resend when we send alert notifications or account-related emails.
        </li>
        <li>
          <strong>Paddle</strong> &mdash; payment processing. When you purchase a Pro
          subscription, your payment information is handled entirely by Paddle.
          We do not store credit card details on our servers.
        </li>
      </ul>
      <p>
        Each of these providers has their own privacy policy and data processing
        agreements. We have selected providers that adhere to industry-standard
        security practices.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your account data for as long as your account is active. Check
        history is pruned according to your plan limits (up to 50 checks for Free
        plans, up to 1,000 checks for Pro plans). If you delete your account, all
        associated data is permanently removed within a reasonable timeframe.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul>
        <li>
          <strong>Access:</strong> you can view the data associated with your
          account at any time through the dashboard settings page.
        </li>
        <li>
          <strong>Correction:</strong> you can update your account information
          through the settings page.
        </li>
        <li>
          <strong>Deletion:</strong> you can delete your account and all associated
          data through the settings page (Danger Zone section).
        </li>
        <li>
          <strong>Data portability:</strong> you can request a copy of your data by
          contacting us at support@pguard.co.
        </li>
      </ul>

      <h2>7. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect
        your data, including encryption in transit (TLS) and at rest, access
        controls, and regular security audits of our infrastructure.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated &quot;Last updated&quot; date.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle your
        data, please contact us at{" "}
        <a href="mailto:support@pguard.co">support@pguard.co</a>.
      </p>
    </article>
  );
}
