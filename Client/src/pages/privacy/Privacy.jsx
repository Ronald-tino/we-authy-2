import React, { useEffect } from "react";
import "./Privacy.scss";

function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — LuggageShare";
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "LuggageShare Privacy Policy - Learn how we collect, use, and protect your personal information.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", content);
      document.head.appendChild(m);
    }
  }, []);

  return (
    <main className="privacy-page">
      <div className="container">
        <div className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: October 29, 2025</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to LuggageShare ("we," "our," or "us"). We are committed
              to protecting your privacy and ensuring the security of your
              personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our
              platform at luggageshare.app (the "Service").
            </p>
            <p>
              By using our Service, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information You Provide</h3>
            <p>When you register and use our Service, we collect:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Email address, password
                (encrypted), username, and profile details
              </li>
              <li>
                <strong>Profile Data:</strong> Name, profile picture, phone
                number, student status, university affiliation, and biographical
                information
              </li>
              <li>
                <strong>Travel Information:</strong> Departure and destination
                locations, travel dates, luggage capacity, and route details
              </li>
              <li>
                <strong>Communications:</strong> Messages exchanged through our
                platform, reviews, and ratings
              </li>
              <li>
                <strong>Verification Documents:</strong> Identity verification
                documents when required for enhanced security
              </li>
            </ul>

            <h3>2.2 Location Data</h3>
            <p>
              We collect location information to facilitate matching between
              travelers and students:
            </p>
            <ul>
              <li>Origin and destination locations for travel routes</li>
              <li>
                General geographic location (city/region level) for service
                optimization
              </li>
              <li>
                Location data you voluntarily provide when creating listings or
                requests
              </li>
            </ul>
            <p>
              <strong>Note:</strong> We do not track your real-time location
              unless you explicitly enable this feature.
            </p>

            <h3>2.3 Automatically Collected Information</h3>
            <p>When you access our Service, we automatically collect:</p>
            <ul>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on the platform, and interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Device type, operating
                system, browser type, IP address, and unique device identifiers
              </li>
              <li>
                <strong>Cookies and Similar Technologies:</strong> We use
                cookies, web beacons, and similar tracking technologies to
                enhance your experience and gather analytics data
              </li>
            </ul>

            <h3>2.4 Analytics and Cookies</h3>
            <p>
              We use cookies and analytics tools to improve our Service and
              understand user behavior:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required for authentication
                and platform functionality
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how users
                interact with our platform (e.g., Google Analytics)
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and
                preferences
              </li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings,
              though disabling certain cookies may limit platform functionality.
            </p>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>
                <strong>Service Provision:</strong> Creating and managing your
                account, facilitating connections between travelers and students
              </li>
              <li>
                <strong>Matching and Communication:</strong> Connecting users
                based on travel routes, enabling in-platform messaging
              </li>
              <li>
                <strong>Safety and Security:</strong> Verifying identities,
                preventing fraud, monitoring for suspicious activity, enforcing
                our Terms of Service
              </li>
              <li>
                <strong>Platform Improvement:</strong> Analyzing usage patterns,
                testing new features, optimizing user experience
              </li>
              <li>
                <strong>Customer Support:</strong> Responding to inquiries,
                resolving disputes, providing assistance
              </li>
              <li>
                <strong>Legal Compliance:</strong> Complying with applicable
                laws, regulations, and legal processes
              </li>
              <li>
                <strong>Marketing (with consent):</strong> Sending promotional
                emails about new features, special offers, and platform updates
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing and Disclosure</h2>

            <h3>4.1 With Other Users</h3>
            <p>
              When you create a listing or booking, certain information is
              shared with matched users to facilitate the transaction:
            </p>
            <ul>
              <li>Profile name and photo</li>
              <li>Travel route information</li>
              <li>Ratings and reviews</li>
              <li>Contact information (when a booking is confirmed)</li>
            </ul>

            <h3>4.2 With Service Providers</h3>
            <p>
              We share information with trusted third-party service providers
              who assist in operating our platform:
            </p>
            <ul>
              <li>Cloud hosting providers (for data storage)</li>
              <li>Analytics services (for usage insights)</li>
              <li>Customer support tools</li>
              <li>Email service providers</li>
            </ul>
            <p>
              These providers are contractually obligated to protect your data
              and use it only for specified purposes.
            </p>

            <h3>4.3 For Legal Reasons</h3>
            <p>We may disclose your information if required to:</p>
            <ul>
              <li>Comply with legal obligations or court orders</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or security threats</li>
              <li>Respond to government requests</li>
            </ul>

            <h3>4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your
              information may be transferred to the acquiring entity.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              information:
            </p>
            <ul>
              <li>Encryption of sensitive data (including passwords)</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage with reputable providers</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>6. Your Rights and Choices</h2>

            <h3>6.1 Access and Correction</h3>
            <p>
              You can access and update your personal information through your
              account settings at any time.
            </p>

            <h3>6.2 Data Deletion</h3>
            <p>
              You may request deletion of your account and associated data by
              contacting us at privacy@luggageshare.app. Note that some
              information may be retained for legal or operational purposes.
            </p>

            <h3>6.3 Marketing Communications</h3>
            <p>
              You can opt out of promotional emails by clicking the
              "unsubscribe" link in any marketing email or adjusting your
              notification settings.
            </p>

            <h3>6.4 Cookie Management</h3>
            <p>
              You can control cookies through your browser settings or opt out
              of analytics tracking.
            </p>

            <h3>6.5 Data Portability</h3>
            <p>
              You have the right to request a copy of your data in a structured,
              machine-readable format.
            </p>

            <h3>6.6 GDPR Rights (European Users)</h3>
            <p>
              If you are in the European Economic Area, you have additional
              rights:
            </p>
            <ul>
              <li>Right to be informed about data processing</li>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our
              Service and fulfill the purposes outlined in this Privacy Policy:
            </p>
            <ul>
              <li>
                Account data is retained while your account is active and for a
                reasonable period after deletion
              </li>
              <li>Communications may be retained for dispute resolution</li>
              <li>
                Analytics data may be aggregated and anonymized for long-term
                analysis
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>
              Our Service is not intended for users under 18 years of age. We do
              not knowingly collect personal information from children. If you
              believe we have collected information from a minor, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure appropriate
              safeguards are in place to protect your data in accordance with
              this Privacy Policy and applicable laws.
            </p>
          </section>

          <section>
            <h2>10. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites. We are not
              responsible for the privacy practices of these external sites. We
              encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes
              in our practices or for legal, operational, or regulatory reasons.
              We will notify you of significant changes by:
            </p>
            <ul>
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification for material changes</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> privacy@luggageshare.app
              </p>
              <p>
                <strong>Support:</strong> support@luggageshare.app
              </p>
              <p>
                <strong>Website:</strong> https://www.luggageshare.app
              </p>
            </div>
            <p>We will respond to all legitimate requests within 30 days.</p>
          </section>

          <section className="acknowledgment">
            <p>
              By using LuggageShare, you acknowledge that you have read and
              understood this Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Privacy;
