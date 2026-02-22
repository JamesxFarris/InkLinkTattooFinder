import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for InkLink Tattoo Finder — the rules and guidelines governing your use of our tattoo shop directory.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | InkLink Tattoo Finder",
    description:
      "Terms of Service for InkLink Tattoo Finder — the rules and guidelines governing your use of our tattoo shop directory.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbJsonLd([{ label: "Terms of Service" }])} />
      <JsonLd
        data={webPageJsonLd({
          name: "Terms of Service",
          description:
            "Terms of Service for InkLink Tattoo Finder — the rules and guidelines governing your use of our tattoo shop directory.",
          url: "/terms",
          type: "WebPage",
        })}
      />
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
        Terms of Service
      </h1>

      <div className="mt-6 space-y-6 leading-relaxed text-stone-600 dark:text-stone-400">
        <p>Last updated: February 2026</p>

        {/* 1. Acceptance of Terms */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          1. Acceptance of Terms
        </h2>
        <p>
          Welcome to InkLink Tattoo Finder (&quot;InkLink,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;), accessible at{" "}
          <a
            href="https://inklinktattoofinder.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder.com
          </a>
          . By accessing or using our website, creating an account, submitting
          content, or claiming a business listing, you agree to be bound by
          these Terms of Service (&quot;Terms&quot;). If you do not agree with
          any part of these Terms, you must not use our website.
        </p>
        <p>
          These Terms apply to all visitors, registered users, business owners,
          and anyone else who accesses or uses the service.
        </p>

        {/* 2. Description of Service */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          2. Description of Service
        </h2>
        <p>
          InkLink Tattoo Finder is a free online directory that helps users
          discover tattoo shops and artists across the United States. Our
          services include browsable shop listings, business listing claims for
          shop owners, user-submitted shop information, a contact form, and
          photo uploads. We do not process payments, sell products, or
          facilitate transactions between users and tattoo shops.
        </p>

        {/* 3. Account Registration and Responsibilities */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          3. Account Registration and Responsibilities
        </h2>
        <p>
          To access certain features such as claiming a business listing or
          submitting a new shop, you may need to create an account using your
          email address and a password. When you create an account, you agree to:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Provide accurate, current, and complete information during
            registration.
          </li>
          <li>
            Maintain the security of your password and accept responsibility for
            all activity that occurs under your account.
          </li>
          <li>
            Notify us immediately at{" "}
            <a
              href="mailto:inklinktattoofinder@gmail.com"
              className="text-teal-500 hover:underline"
            >
              inklinktattoofinder@gmail.com
            </a>{" "}
            if you suspect any unauthorized use of your account.
          </li>
          <li>
            Not create multiple accounts for deceptive or abusive purposes.
          </li>
        </ul>
        <p>
          You are solely responsible for any actions taken through your account.
          We reserve the right to suspend or terminate accounts that violate
          these Terms.
        </p>

        {/* 4. Business Listing Claims and Accuracy */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          4. Business Listing Claims and Accuracy
        </h2>
        <p>
          Tattoo shop owners or authorized representatives may claim their
          business listing on InkLink. By claiming a listing, you represent and
          warrant that:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            You are the owner or an authorized representative of the business.
          </li>
          <li>
            All information you provide about the business (including name,
            address, phone number, hours of operation, and photos) is accurate
            and up to date.
          </li>
          <li>
            You will promptly update your listing if any business information
            changes.
          </li>
        </ul>
        <p>
          We reserve the right to verify claims, request documentation of
          ownership, reject or revoke claims at our discretion, and remove or
          modify listings that contain inaccurate, misleading, or inappropriate
          content. Falsely claiming a business you do not own or represent is a
          violation of these Terms and may result in account termination.
        </p>

        {/* 5. User-Submitted Content */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          5. User-Submitted Content
        </h2>
        <p>
          InkLink allows users to submit content, including new shop listings,
          photos, and other information (&quot;User Content&quot;). By
          submitting User Content, you agree that:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            You own the content or have the necessary rights and permissions to
            submit it.
          </li>
          <li>
            Your content is accurate to the best of your knowledge and does not
            contain false or misleading information.
          </li>
          <li>
            Your content does not violate any applicable law or the rights of
            any third party, including intellectual property, privacy, or
            publicity rights.
          </li>
          <li>
            Your content does not contain material that is defamatory, obscene,
            hateful, threatening, or otherwise objectionable.
          </li>
        </ul>
        <p>
          By submitting User Content, you grant InkLink a non-exclusive,
          worldwide, royalty-free, perpetual, and irrevocable license to use,
          display, reproduce, modify, and distribute your content in connection
          with operating and promoting the service. You retain ownership of your
          original content, but this license allows us to display it on our
          platform.
        </p>
        <p>
          We reserve the right to remove or edit any User Content at our sole
          discretion, without notice, for any reason, including content that we
          believe violates these Terms or is otherwise harmful to the service or
          its users.
        </p>

        {/* 6. Photo Uploads */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          6. Photo Uploads
        </h2>
        <p>
          Photos uploaded to InkLink are stored via third-party cloud services.
          By uploading photos, you represent that you own the images or have
          permission from the copyright holder to upload and display them. You
          agree not to upload photos that:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Infringe on the copyright, trademark, or other intellectual property
            rights of others.
          </li>
          <li>
            Contain explicit, violent, or otherwise inappropriate content
            unrelated to tattoo artistry.
          </li>
          <li>Contain personally identifiable information of others without their consent.</li>
          <li>Are intentionally misleading or do not represent the listed business.</li>
        </ul>
        <p>
          We may remove any uploaded photo at our discretion if it violates
          these Terms or is reported as inappropriate.
        </p>

        {/* 7. Prohibited Conduct */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          7. Prohibited Conduct
        </h2>
        <p>You agree not to use InkLink to:</p>
        <ul className="ml-6 list-disc space-y-2">
          <li>
            Violate any applicable local, state, national, or international law
            or regulation.
          </li>
          <li>Submit false, inaccurate, or misleading business information.</li>
          <li>
            Impersonate any person or entity, or falsely claim an affiliation
            with a business.
          </li>
          <li>
            Scrape, harvest, or collect data from the site using automated means
            without our prior written consent.
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            service.
          </li>
          <li>Attempt to gain unauthorized access to any part of the service.</li>
          <li>
            Use the contact form to send spam, unsolicited commercial messages,
            or harassing communications.
          </li>
          <li>
            Upload viruses, malware, or any other harmful code.
          </li>
        </ul>

        {/* 8. Intellectual Property */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          8. Intellectual Property
        </h2>
        <p>
          The InkLink name, logo, website design, layout, graphics, and original
          content are the property of InkLink Tattoo Finder and are protected by
          applicable intellectual property laws. You may not copy, reproduce,
          distribute, or create derivative works from any part of our service
          without our express written permission.
        </p>
        <p>
          Business listing information displayed on InkLink may be sourced from
          publicly available data and user submissions. Individual tattoo shop
          names, logos, and trademarks remain the property of their respective
          owners.
        </p>

        {/* 9. Third-Party Links and Services */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          9. Third-Party Links and Services
        </h2>
        <p>
          Our service may contain links to third-party websites, such as tattoo
          shop websites or social media pages. These links are provided for your
          convenience only. We do not endorse, control, or assume any
          responsibility for the content, privacy policies, or practices of any
          third-party websites. You access third-party sites at your own risk.
        </p>

        {/* 10. Disclaimers */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          10. Disclaimers
        </h2>
        <p>
          InkLink Tattoo Finder is provided on an &quot;as is&quot; and
          &quot;as available&quot; basis without warranties of any kind, either
          express or implied. We do not warrant that:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>The service will be uninterrupted, secure, or error-free.</li>
          <li>
            Business listing information, including hours, addresses, phone
            numbers, or photos, is accurate, complete, or current.
          </li>
          <li>
            The quality of services provided by any tattoo shop listed on our
            directory will meet your expectations.
          </li>
        </ul>
        <p>
          InkLink is a directory service only. We do not employ, endorse,
          recommend, or guarantee any tattoo shop or artist listed on the
          platform. Any interactions, appointments, or transactions you have
          with a listed business are solely between you and that business.
        </p>

        {/* 11. Limitation of Liability */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          11. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, InkLink Tattoo Finder, its
          owners, operators, and affiliates shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of or inability to use the
          service. This includes, but is not limited to, damages for loss of
          profits, data, goodwill, or other intangible losses, even if we have
          been advised of the possibility of such damages.
        </p>
        <p>
          We are not responsible for any harm, injury, or loss resulting from
          your interactions with tattoo shops or artists found through our
          directory. You use the information on InkLink at your own risk.
        </p>

        {/* 12. Indemnification */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          12. Indemnification
        </h2>
        <p>
          You agree to indemnify, defend, and hold harmless InkLink Tattoo
          Finder and its owners, operators, and affiliates from and against any
          claims, liabilities, damages, losses, costs, or expenses (including
          reasonable attorney&apos;s fees) arising out of or related to your use
          of the service, your violation of these Terms, your User Content, or
          your violation of any rights of a third party.
        </p>

        {/* 13. Termination */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          13. Termination
        </h2>
        <p>
          We may suspend or terminate your account and access to the service at
          any time, with or without cause, and with or without notice. Reasons
          for termination may include, but are not limited to:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Violation of these Terms.</li>
          <li>Submitting false or misleading business information.</li>
          <li>Fraudulently claiming a business listing.</li>
          <li>Abusive or harmful behavior toward other users or the service.</li>
          <li>Extended periods of inactivity, at our discretion.</li>
        </ul>
        <p>
          Upon termination, your right to use the service will immediately
          cease. Any provisions of these Terms that by their nature should
          survive termination will remain in effect, including intellectual
          property provisions, disclaimers, indemnification, and limitations of
          liability.
        </p>

        {/* 14. Changes to Terms */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          14. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If
          we make material changes, we will update the &quot;Last updated&quot;
          date at the top of this page. Your continued use of the service after
          any changes constitutes your acceptance of the updated Terms. We
          encourage you to review these Terms periodically.
        </p>

        {/* 15. Governing Law */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          15. Governing Law
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the United States, without regard to conflict of law
          principles. Any disputes arising from these Terms or your use of the
          service shall be resolved in accordance with applicable law.
        </p>

        {/* 16. Severability */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          16. Severability
        </h2>
        <p>
          If any provision of these Terms is found to be unenforceable or
          invalid, that provision will be limited or eliminated to the minimum
          extent necessary so that the remaining Terms will remain in full force
          and effect.
        </p>

        {/* 17. Contact */}
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          17. Contact
        </h2>
        <p>
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <a
            href="mailto:inklinktattoofinder@gmail.com"
            className="text-teal-500 hover:underline"
          >
            inklinktattoofinder@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
