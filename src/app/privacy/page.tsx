import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "InkLink Tattoo Finder privacy policy — how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | InkLink Tattoo Finder",
    description: "InkLink Tattoo Finder privacy policy — how we collect, use, and protect your information.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "Privacy Policy" }])} />
      <JsonLd data={webPageJsonLd({
        name: "Privacy Policy",
        description: "InkLink Tattoo Finder privacy policy — how we collect, use, and protect your information.",
        url: "/privacy",
        type: "WebPage",
      })} />
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Privacy Policy
      </h1>

      <div className="mt-6 space-y-6 leading-relaxed text-stone-600 dark:text-stone-400">
        <p>Last updated: February 2026</p>

        <p>
          Welcome to InkLink Tattoo Finder (&quot;InkLink,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), accessible at{" "}
          <a
            href="https://inklinktattoofinder.com"
            className="text-teal-500 hover:underline"
          >
            https://inklinktattoofinder.com
          </a>
          . This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website. Please also
          review our{" "}
          <Link href="/terms" className="text-teal-500 hover:underline">
            Terms of Service
          </Link>{" "}
          for the rules governing your use of InkLink.
        </p>

        {/* ── 1. Information We Collect ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          1. Information We Collect
        </h2>
        <p>
          InkLink Tattoo Finder collects minimal information to provide our
          directory service. The categories of information we may collect
          include:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Account information</strong> — If you sign in
            through our authentication provider (NextAuth.js), we receive your
            name, email address, and profile image from the identity provider
            you choose (e.g., Google).
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Business listing data</strong> — If you claim or
            create a listing, we collect the business information you submit
            (name, address, phone, hours, description, images).
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Uploaded images</strong> — Photos uploaded to
            listings are stored via our image hosting provider, Cloudinary.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Usage data</strong> — We may collect anonymous
            usage data such as pages visited, search queries, browser type, and
            referring URLs to improve our service.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Location data</strong> — When you search for
            tattoo shops, we may use your general location (city/state) to
            provide relevant results. We do not track precise GPS coordinates.
          </li>
        </ul>

        {/* ── 2. How We Use Information ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          2. How We Use Information
        </h2>
        <p>
          Any information collected is used solely to operate, maintain, and
          improve the InkLink Tattoo Finder directory experience. Specifically,
          we use your information to:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Display and manage tattoo shop listings.</li>
          <li>Authenticate users and manage dashboard sessions.</li>
          <li>Respond to inquiries and support requests.</li>
          <li>Geocode business addresses for map display.</li>
          <li>Analyze aggregated usage trends to improve the site.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties, nor do we
          use it for targeted advertising.
        </p>

        {/* ── 3. Business Listings ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          3. Business Listings
        </h2>
        <p>
          Business information displayed on InkLink Tattoo Finder (names,
          addresses, phone numbers, hours, ratings) is sourced from publicly
          available data or submitted directly by business owners. Business
          owners may request updates or removal by contacting us at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>
          .
        </p>

        {/* ── 4. Third-Party Services ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          4. Third-Party Services
        </h2>
        <p>
          InkLink relies on the following third-party services to operate. Each
          service has its own privacy policy governing how it handles data:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Cloudinary</strong> — We use Cloudinary for image
            hosting and uploads. When you upload photos to a listing, those
            images are stored on Cloudinary&apos;s servers. See the{" "}
            <a
              href="https://cloudinary.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              Cloudinary Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Railway</strong> — Our application is hosted on
            Railway&apos;s cloud platform. Server logs and request metadata may
            be processed by Railway as part of normal hosting operations. See
            the{" "}
            <a
              href="https://railway.app/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              Railway Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">NextAuth.js</strong> — We use NextAuth.js as our
            authentication framework. NextAuth.js operates within our
            application and does not independently collect or store your data
            outside of our systems. Session tokens are stored as secure,
            HTTP-only cookies in your browser.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Google Maps Embed</strong> — Listing pages may
            display an embedded Google Map to show the business location. When
            this map loads, Google may collect usage data in accordance with
            the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              Google Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Nominatim / OpenStreetMap</strong> — We use the
            Nominatim geocoding service (powered by OpenStreetMap) to convert
            business addresses into map coordinates. Queries sent to Nominatim
            include the address being geocoded. See the{" "}
            <a
              href="https://osmfoundation.org/wiki/Privacy_Policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              OpenStreetMap Foundation Privacy Policy
            </a>
            .
          </li>
        </ul>

        {/* ── 5. Cookies ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          5. Cookie Policy
        </h2>
        <p>
          InkLink uses a limited number of cookies that are essential to site
          functionality:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Session cookie</strong>{" "}
            (<code className="rounded bg-stone-200 px-1 text-sm dark:bg-stone-700">next-auth.session-token</code>) — A
            secure, HTTP-only cookie set by NextAuth.js when you sign in. It
            identifies your authenticated session and expires when you sign out
            or after the session lifetime ends.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">CSRF token cookie</strong>{" "}
            (<code className="rounded bg-stone-200 px-1 text-sm dark:bg-stone-700">next-auth.csrf-token</code>) — A
            security cookie used to prevent cross-site request forgery during
            authentication flows.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Callback URL cookie</strong>{" "}
            (<code className="rounded bg-stone-200 px-1 text-sm dark:bg-stone-700">next-auth.callback-url</code>) — A
            temporary cookie that stores the page you were visiting before
            signing in, so you can be redirected back afterward.
          </li>
        </ul>
        <p>
          We do not use advertising cookies, tracking pixels, or analytics
          cookies. You can control cookie preferences through your browser
          settings, but disabling cookies may prevent you from signing in.
        </p>

        {/* ── 6. Data Retention ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          6. Data Retention
        </h2>
        <p>We retain different types of data for different periods:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Account data</strong> — Retained for as long as
            your account is active. If you request account deletion, we will
            remove your personal information within 30 days.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Business listing data</strong> — Retained for as
            long as the listing is active on the platform. Delisted businesses
            are removed within 30 days unless required for legal compliance.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Uploaded images</strong> — Retained on Cloudinary
            for as long as the associated listing is active. Images are deleted
            within 30 days of listing removal.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Session data</strong> — Session tokens expire
            automatically after 30 days of inactivity or upon sign-out.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Server logs</strong> — Hosting-level server logs
            may be retained by Railway for up to 90 days for debugging and
            security purposes.
          </li>
        </ul>

        {/* ── 7. CCPA (California Privacy Rights) ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          7. Your California Privacy Rights (CCPA)
        </h2>
        <p>
          If you are a California resident, the California Consumer Privacy Act
          (CCPA) grants you the following rights regarding your personal
          information:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Right to Know</strong> — You have the right to
            request that we disclose the categories and specific pieces of
            personal information we have collected about you, the categories of
            sources from which it was collected, the business purpose for
            collecting it, and the categories of third parties with whom we
            share it.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Right to Delete</strong> — You have the right to
            request the deletion of your personal information that we have
            collected, subject to certain exceptions (e.g., legal compliance,
            completing a transaction).
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Right to Opt-Out of Sale</strong> — InkLink does
            not sell your personal information. Because we do not sell personal
            information, there is no need to opt out. If this practice ever
            changes, we will update this policy and provide an opt-out
            mechanism.
          </li>
          <li>
            <strong className="text-stone-700 dark:text-stone-300">Right to Non-Discrimination</strong> — We will not
            discriminate against you for exercising any of your CCPA rights. We
            will not deny you services, charge different prices, or provide a
            different quality of service because you exercised your privacy
            rights.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>{" "}
          with the subject line &quot;CCPA Request.&quot; We will verify your
          identity before processing your request and respond within 45 days as
          required by law.
        </p>

        {/* ── 8. Children's Privacy (COPPA) ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          8. Children&apos;s Privacy
        </h2>
        <p>
          InkLink Tattoo Finder is not directed at children under the age of 13.
          We do not knowingly collect personal information from children under
          13. If you are a parent or guardian and believe your child has provided
          us with personal information, please contact us at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>{" "}
          and we will promptly delete that information. By using InkLink, you
          confirm that you are at least 13 years of age. Users under 18 should
          review this policy with a parent or guardian.
        </p>

        {/* ── 9. International Users ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          9. International Users
        </h2>
        <p>
          InkLink Tattoo Finder is operated from the United States and is
          intended primarily for users located within the United States. If you
          access InkLink from outside the United States, please be aware that
          your information may be transferred to, stored, and processed in the
          United States, where data protection laws may differ from those in your
          country. By using our website, you consent to the transfer of your
          information to the United States and acknowledge that your data will be
          handled in accordance with this Privacy Policy and applicable U.S.
          law. We do not represent that InkLink complies with the privacy laws of
          any other jurisdiction.
        </p>

        {/* ── 10. Data Security ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          10. Data Security
        </h2>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, alteration, disclosure, or destruction. These
          measures include HTTPS encryption for all traffic, secure HTTP-only
          session cookies, and restricted access to production systems. However,
          no method of transmission over the Internet or electronic storage is
          100% secure, and we cannot guarantee absolute security. Please see
          our{" "}
          <Link href="/terms" className="text-teal-500 hover:underline">
            Terms of Service
          </Link>{" "}
          for additional details on liability limitations.
        </p>

        {/* ── 11. Changes to This Policy ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          11. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. When we make
          changes, we will update the &quot;Last updated&quot; date at the top of
          this page. We encourage you to review this policy periodically. Your
          continued use of InkLink after any changes constitutes your acceptance
          of the updated policy.
        </p>

        {/* ── 12. Contact ── */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          12. Contact Us
        </h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, your
          personal data, or wish to exercise your privacy rights, please contact
          us at:
        </p>
        <p>
          InkLink Tattoo Finder
          <br />
          Email:{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>
          <br />
          Website:{" "}
          <a
            href="https://inklinktattoofinder.com"
            className="text-teal-500 hover:underline"
          >
            https://inklinktattoofinder.com
          </a>
        </p>
        <p>
          Please also review our{" "}
          <Link href="/terms" className="text-teal-500 hover:underline">
            Terms of Service
          </Link>{" "}
          for the complete terms governing your use of InkLink Tattoo Finder.
        </p>
      </div>
    </div>
  );
}
