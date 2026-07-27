import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — PageGuard",
  description: "30-day money-back guarantee for PageGuard Pro subscriptions.",
};

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose prose-gray dark:prose-invert">
      <h1>Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: July 26, 2026</p>

      <h2>1. 30-Day Money-Back Guarantee</h2>
      <p>
        We stand behind the quality of PageGuard Pro. If you are not satisfied with
        your Pro subscription for any reason, you may request a full refund within
        <strong> 30 days of purchase</strong>. This guarantee applies to all new
        Pro subscriptions.
      </p>
      <p>
        After the 30-day period, refunds are handled on a case-by-case basis.
        We reserve the right to decline refund requests made beyond 30 days from
        the purchase date.
      </p>

      <h2>2. Free Plan</h2>
      <p>
        PageGuard offers a Free plan that requires no payment. Since no charges are
        incurred, no refund is applicable to the Free plan. You can use the Free
        plan for as long as you like and upgrade or cancel at any time.
      </p>

      <h2>3. How to Request a Refund</h2>
      <p>
        To request a refund, please email us at{" "}
        <a href="mailto:support@pguard.co">support@pguard.co</a> with the
        following information:
      </p>
      <ul>
        <li>The email address associated with your PageGuard account;</li>
        <li>The date of your Pro subscription purchase;</li>
        <li>A brief reason for your refund request (optional but helpful).</li>
      </ul>
      <p>
        We will confirm receipt of your request within 2 business days.
      </p>

      <h2>4. Processing Time</h2>
      <p>
        Once your refund request is approved, the refund will be processed within
        <strong> 5&ndash;10 business days</strong>. The funds will be returned to the
        original payment method used during purchase. You will receive a
        confirmation email from our payment processor (Paddle) when the refund
        has been completed.
      </p>

      <h2>5. Cancellation During Refund Period</h2>
      <p>
        If you request a refund, your Pro subscription will be cancelled and your
        account will revert to the Free plan. You will continue to have access to
        Pro features until the refund is processed, at which point your plan limits
        will be adjusted to Free tier.
      </p>

      <h2>6. Contact</h2>
      <p>
        For any questions about this Refund Policy, please contact us at{" "}
        <a href="mailto:support@pguard.co">support@pguard.co</a>.
      </p>
    </article>
  );
}
