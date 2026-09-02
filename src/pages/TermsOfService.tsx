export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">
            <strong className="font-semibold text-gray-700">Last updated: August 2026</strong>
          </p>

          <p className="mt-6 text-sm leading-relaxed text-gray-700">
            These Terms of Service ("Terms") govern your use of motosmarketplace.com (the "Site"), operated by
            Moto Markets ("we," "us," or "our"). By accessing or using the Site, you agree to these Terms. If you
            do not agree, please do not use the Site.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">1. What We Do</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Moto Markets is a marketplace that lists motorcycles from third-party dealers and individual sellers.
            We are not a party to any transaction between a buyer and a seller, and we do not own, inspect, or
            guarantee any motorcycle listed on the Site. Any purchase, sale, or agreement you make with a dealer
            or another user is solely between you and that party.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">2. Accounts</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            You may need to create an account (as an individual or a dealer) to list a motorcycle or contact a
            seller. You're responsible for keeping your login credentials secure and for all activity under your
            account. Provide accurate information when registering, and let us know if you believe your account
            has been compromised.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">3. Listings and User Content</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            If you post a listing, you're responsible for its accuracy — including the vehicle's condition,
            mileage, VIN, and ownership. You may not list a motorcycle you don't own or aren't authorized to sell,
            or post false, misleading, or fraudulent information. We may remove any listing or content that
            violates these Terms or that we believe is inaccurate, fraudulent, or otherwise inappropriate, at our
            discretion and without prior notice.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">4. Subscriptions and Payments</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Some features (such as creating listings beyond a free trial period) require an active subscription.
            Subscription payments are processed by third-party payment processors, including Stripe and PayPal —
            we do not store your full payment card details. Subscriptions renew automatically until cancelled; you
            can cancel at any time from your account, and you'll retain access through the end of your current
            billing period.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">5. Prohibited Conduct</h2>
          <p className="text-sm leading-relaxed text-gray-700">You agree not to:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Post fraudulent, stolen, or misrepresented listings</li>
            <li>Harass, defraud, or attempt to scam another user</li>
            <li>Scrape, copy, or reuse Site data or listings without permission</li>
            <li>Interfere with the Site's normal operation or attempt to bypass its security</li>
            <li>Use the Site for any unlawful purpose</li>
          </ul>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">6. Third-Party Services</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            The Site integrates with third-party services — including payment processors (Stripe, PayPal), sign-in
            providers (Google), mapping (Google Maps), and financing partners. Your use of those services is
            governed by their own terms and privacy policies, not ours.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">7. No Warranty</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            The Site and all listings are provided "as is," without warranties of any kind. We don't guarantee the
            accuracy of any listing, the condition of any motorcycle, or that the Site will be uninterrupted or
            error-free. Always independently verify a vehicle's condition, history, and VIN before purchasing.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">8. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            To the fullest extent permitted by law, Moto Markets is not liable for any indirect, incidental, or
            consequential damages arising from your use of the Site, or from any transaction, dispute, or
            interaction with another user or dealer.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">9. Termination</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            We may suspend or terminate your account if you violate these Terms. You may stop using the Site and
            close your account at any time.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">10. Changes to These Terms</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            We may update these Terms from time to time. Changes will be posted on this page with an updated "Last
            updated" date. Continuing to use the Site after changes take effect means you accept the updated
            Terms.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">11. Governing Law</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            These Terms are governed by the laws of the State of Tennessee, without regard to its conflict of law
            principles.
          </p>

          <h2 className="mt-8 mb-3 text-xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            Questions about these Terms? Contact us at:
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
