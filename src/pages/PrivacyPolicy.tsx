export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">
            <strong className="font-semibold text-gray-700">Last updated: August 2026</strong>
          </p>

          <p className="mt-6 text-sm leading-relaxed text-gray-700">
            Motos Marketplace ("we," "us," or "our") operates motosmarketplace.com (the "Site"). This page
            explains what information we collect, how we use it, and the choices you have.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Information We Collect</h2>

          <p className="text-sm font-semibold text-gray-800">Information you provide directly:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Contact form submissions (name, email, message)</li>
            <li>Financing inquiry information, if you choose to apply for financing through a partner lender</li>
          </ul>

          <p className="mt-4 text-sm font-semibold text-gray-800">Information collected automatically:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Usage data such as pages visited, time spent, and referring pages (via Google Analytics)</li>
            <li>Device and browser information (browser type, operating system, screen size)</li>
            <li>Approximate location (derived from IP address)</li>
          </ul>

          <p className="mt-4 text-sm font-semibold text-gray-800">Cookies and similar technologies:</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We use cookies and similar tracking technologies to operate the Site, understand how visitors use
            it, and — where applicable — to serve advertising.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">How We Use Information</h2>
          <p className="text-sm leading-relaxed text-gray-700">We use the information we collect to:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Operate, maintain, and improve the Site</li>
            <li>Respond to inquiries sent through our contact form</li>
            <li>Analyze site traffic and usage patterns</li>
            <li>Display advertising, including third-party ads served through Google AdSense</li>
          </ul>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Third-Party Services</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            We use the following third-party services, which may collect information as described in their own
            privacy policies:
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li><strong className="font-semibold text-gray-900">Google Analytics</strong> — website usage analytics</li>
            <li>
              <strong className="font-semibold text-gray-900">Google AdSense</strong> — displays advertisements on
              our Site. Google may use cookies to serve ads based on your prior visits to this or other websites.
              You can opt out of personalized advertising by visiting{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
                Google Ads Settings
              </a>.
            </li>
            <li>
              <strong className="font-semibold text-gray-900">Financing partners</strong> — if you choose to apply
              for financing through a partner lender, you will be directed to that lender's own website, and their
              privacy policy will govern the information you provide there.
            </li>
          </ul>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Third-Party Advertising</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this
            website or other websites. Google's use of advertising cookies enables it and its partners to serve
            ads to you based on your visit to this Site and/or other sites on the Internet. You may opt out of
            personalized advertising by visiting Google's Ads Settings page.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Your Choices</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>You can disable cookies through your browser settings, though some parts of the Site may not function properly without them.</li>
            <li>
              You can opt out of personalized ads via{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
                Google Ads Settings
              </a>.
            </li>
            <li>
              You can contact us at{" "}
              <a href="mailto:support@motosmarketplace.com" className="text-red-600 hover:underline">
                support@motosmarketplace.com
              </a>{" "}
              to ask what information we hold about you or to request its deletion, where applicable.
            </li>
          </ul>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Data Security</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            We take reasonable measures to protect the information we collect, but no method of transmission or
            storage is 100% secure.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Children's Privacy</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            This Site is not directed to children under 13, and we do not knowingly collect personal information
            from children under 13.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Changes to This Policy</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an
            updated "Last updated" date.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            If you have questions about this Privacy Policy, contact us at:
            <br />
            <a href="mailto:support@motosmarketplace.com" className="font-semibold text-red-600 hover:underline">
              support@motosmarketplace.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
