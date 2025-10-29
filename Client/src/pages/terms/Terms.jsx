import React, { useEffect } from "react";
import "./Terms.scss";

function Terms() {
  useEffect(() => {
    document.title = "Terms of Service — LuggageShare";
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "LuggageShare Terms of Service - Understand the rules and guidelines for using our luggage-sharing platform.";
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
    <main className="terms-page">
      <div className="container">
        <div className="legal-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: October 29, 2025</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to LuggageShare. By accessing or using our platform at
              luggageshare.app (the "Service"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms,
              please do not use our Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and
              LuggageShare ("we," "us," or "our"). We reserve the right to
              update these Terms at any time, and your continued use of the
              Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2>2. Service Description</h2>
            <p>
              LuggageShare is a platform that connects international students
              who need luggage transportation with travelers who have available
              luggage space. Our Service facilitates:
            </p>
            <ul>
              <li>
                Posting and browsing travel listings with available luggage
                capacity
              </li>
              <li>Requesting luggage transportation services</li>
              <li>Communication between students and travelers</li>
              <li>Payment processing for luggage transportation services</li>
              <li>Rating and review systems for user accountability</li>
            </ul>
            <p>
              <strong>Important:</strong> LuggageShare is a platform that
              facilitates connections between users. We are not a transportation
              company and do not provide luggage transportation services
              directly. All arrangements are made between individual users.
            </p>
          </section>

          <section>
            <h2>3. Eligibility and Account Registration</h2>

            <h3>3.1 Age Requirement</h3>
            <p>
              You must be at least 18 years old to use our Service. By
              registering, you represent that you meet this age requirement.
            </p>

            <h3>3.2 Account Creation</h3>
            <p>To use our Service, you must:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as necessary</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>

            <h3>3.3 Account Verification</h3>
            <p>
              We may require identity verification for certain features or
              transactions. Failure to provide requested verification may limit
              your ability to use the Service.
            </p>
          </section>

          <section>
            <h2>4. User Responsibilities</h2>

            <h3>4.1 For Travelers (Service Providers)</h3>
            <p>If you offer luggage transportation services, you agree to:</p>
            <ul>
              <li>
                Provide accurate information about your travel plans, including
                dates, routes, and available luggage capacity
              </li>
              <li>Handle luggage with reasonable care and attention</li>
              <li>
                Comply with all airline, customs, and transportation regulations
              </li>
              <li>Communicate promptly with students regarding arrangements</li>
              <li>Not transport prohibited or illegal items</li>
              <li>
                Deliver luggage as agreed or provide timely notice of delays
              </li>
              <li>
                Maintain appropriate travel insurance that may cover transported
                items
              </li>
            </ul>

            <h3>4.2 For Students (Service Recipients)</h3>
            <p>If you request luggage transportation services, you agree to:</p>
            <ul>
              <li>Provide accurate descriptions of items to be transported</li>
              <li>
                Ensure luggage complies with airline and customs regulations
              </li>
              <li>
                Not send prohibited, illegal, dangerous, or restricted items
              </li>
              <li>Package items securely and appropriately</li>
              <li>Communicate pickup and delivery details clearly</li>
              <li>Pay agreed-upon fees in a timely manner</li>
              <li>Obtain necessary insurance for valuable items</li>
              <li>Provide necessary customs documentation</li>
            </ul>

            <h3>4.3 General Conduct</h3>
            <p>All users must:</p>
            <ul>
              <li>Treat other users with respect and professionalism</li>
              <li>Communicate honestly and transparently</li>
              <li>
                Honor commitments and agreements made through the platform
              </li>
              <li>Provide accurate ratings and reviews</li>
              <li>Report suspicious activity or violations</li>
            </ul>
          </section>

          <section>
            <h2>5. Prohibited Activities</h2>
            <p>You may not:</p>
            <ul>
              <li>
                Transport or request transportation of illegal items, including
                but not limited to: drugs, weapons, counterfeit goods, stolen
                property, or items that violate customs regulations
              </li>
              <li>Use the Service for any fraudulent or unlawful purpose</li>
              <li>Impersonate another person or misrepresent your identity</li>
              <li>Harass, threaten, or intimidate other users</li>
              <li>Attempt to circumvent our payment system</li>
              <li>Create multiple accounts to manipulate ratings or reviews</li>
              <li>Use automated systems or bots to access the Service</li>
              <li>Scrape, copy, or distribute content from our platform</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Reverse engineer or attempt to access source code</li>
              <li>
                Share personal contact information in public listings (use our
                messaging system)
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Luggage Transportation Terms</h2>

            <h3>6.1 Arrangements</h3>
            <p>
              All luggage transportation arrangements are made directly between
              users. LuggageShare facilitates connections but is not a party to
              these arrangements.
            </p>

            <h3>6.2 Inspection Rights</h3>
            <p>
              Travelers have the right to inspect luggage before agreeing to
              transport it and may refuse items that appear suspicious, damaged,
              or improperly packaged.
            </p>

            <h3>6.3 Prohibited Items</h3>
            <p>
              Users must not transport items that are illegal, hazardous,
              prohibited by airlines or customs, or violate any applicable laws.
              This includes but is not limited to:
            </p>
            <ul>
              <li>Illegal drugs or controlled substances</li>
              <li>Weapons, ammunition, or explosives</li>
              <li>Hazardous materials</li>
              <li>Counterfeit or pirated goods</li>
              <li>Items that violate intellectual property rights</li>
              <li>Live animals</li>
              <li>Perishable items without proper packaging</li>
            </ul>

            <h3>6.4 Customs and Legal Compliance</h3>
            <p>
              Users are responsible for ensuring compliance with all customs,
              import/export, and transportation regulations. Both travelers and
              students must declare items as required by law.
            </p>

            <h3>6.5 Weight and Size Limits</h3>
            <p>
              Luggage must comply with airline weight and size restrictions.
              Travelers should clearly specify their capacity limitations in
              listings.
            </p>
          </section>

          <section>
            <h2>7. Liability and Insurance</h2>

            <h3>7.1 Platform Liability</h3>
            <p>
              LuggageShare is a platform connecting users and is not liable for:
            </p>
            <ul>
              <li>Lost, damaged, delayed, or stolen luggage</li>
              <li>Disputes between users</li>
              <li>Compliance with customs or transportation regulations</li>
              <li>Quality or safety of transported items</li>
              <li>Actions or omissions of users</li>
              <li>Cancellations or changes to travel plans</li>
            </ul>
            <p>
              <strong>
                TO THE FULLEST EXTENT PERMITTED BY LAW, LUGGAGESHARE DISCLAIMS
                ALL LIABILITY FOR ANY DAMAGES ARISING FROM USE OF THE SERVICE.
              </strong>
            </p>

            <h3>7.2 User Insurance</h3>
            <p>
              We strongly recommend that users obtain appropriate insurance:
            </p>
            <ul>
              <li>
                <strong>Students:</strong> Consider insurance for valuable items
                being transported
              </li>
              <li>
                <strong>Travelers:</strong> Ensure your travel insurance covers
                items you transport for others
              </li>
            </ul>

            <h3>7.3 Limitation of Liability</h3>
            <p>
              We are not liable for indirect, incidental, consequential, or
              punitive damages arising from the use of the Service.
            </p>

            <h3>7.4 Indemnification</h3>
            <p>
              You agree to indemnify and hold LuggageShare harmless from any
              claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any laws or third-party rights</li>
              <li>Items you transport or have transported</li>
            </ul>
          </section>

          <section>
            <h2>8. Ratings and Reviews</h2>
            <p>
              Our platform includes a rating and review system to build trust
              and accountability:
            </p>
            <ul>
              <li>
                Reviews must be honest, accurate, and based on actual
                experiences
              </li>
              <li>
                Reviews must not contain offensive, defamatory, or
                discriminatory content
              </li>
              <li>
                We reserve the right to remove reviews that violate our
                guidelines
              </li>
              <li>You may not manipulate ratings or reviews</li>
              <li>
                Users cannot review themselves or coordinate false reviews
              </li>
            </ul>
          </section>

          <section>
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the Service, including text, graphics, logos,
              images, and software, is the property of LuggageShare or its
              licensors and is protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul>
              <li>
                Copy, modify, or distribute our content without permission
              </li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Create derivative works based on our Service</li>
            </ul>
            <p>
              User-generated content (profiles, reviews, messages) remains your
              property, but you grant us a license to use, display, and
              distribute this content as necessary to operate the Service.
            </p>
          </section>

          <section>
            <h2>10. Privacy</h2>
            <p>
              Your use of the Service is subject to our Privacy Policy, which
              explains how we collect, use, and protect your personal
              information. By using the Service, you consent to our data
              practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2>11. Account Suspension and Termination</h2>

            <h3>11.1 By You</h3>
            <p>
              You may terminate your account at any time through account
              settings or by contacting support.
            </p>

            <h3>11.2 By Us</h3>
            <p>
              We reserve the right to suspend or terminate your account
              immediately if:
            </p>
            <ul>
              <li>You violate these Terms</li>
              <li>Your actions pose risk to other users or the platform</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>You have repeatedly received negative reviews</li>
              <li>We are required to do so by law</li>
              <li>We decide to discontinue the Service</li>
            </ul>

            <h3>11.3 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Your access to the Service will cease</li>
              <li>You must fulfill any outstanding obligations</li>
              <li>We may retain certain information as required by law</li>
              <li>
                Provisions that should survive termination will remain in effect
              </li>
            </ul>
          </section>

          <section>
            <h2>12. Dispute Resolution</h2>

            <h3>12.1 User Disputes</h3>
            <p>
              Disputes between users should be resolved directly whenever
              possible. Our customer support team can facilitate communication
              but cannot force resolutions.
            </p>

            <h3>12.2 Platform Disputes</h3>
            <p>
              For disputes with LuggageShare, please contact us first to seek an
              informal resolution. We are committed to addressing concerns
              fairly and promptly.
            </p>

            <h3>12.3 Arbitration Agreement</h3>
            <p>
              If we cannot resolve a dispute informally, you agree that disputes
              will be resolved through binding arbitration rather than in court,
              except for small claims court matters or intellectual property
              disputes.
            </p>

            <h3>12.4 Class Action Waiver</h3>
            <p>
              You agree to resolve disputes individually and waive the right to
              participate in class actions or class arbitrations.
            </p>
          </section>

          <section>
            <h2>13. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>We do not guarantee that:</p>
            <ul>
              <li>The Service will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>
                Results from using the Service will meet your expectations
              </li>
              <li>User-provided information is accurate or reliable</li>
            </ul>
          </section>

          <section>
            <h2>14. Force Majeure</h2>
            <p>
              We are not liable for delays or failures in performance resulting
              from circumstances beyond our reasonable control, including but
              not limited to: natural disasters, war, terrorism, labor disputes,
              government actions, internet failures, or pandemics.
            </p>
          </section>

          <section>
            <h2>15. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of [Jurisdiction], without
              regard to conflict of law provisions. Any legal actions must be
              brought in the courts located in [Jurisdiction].
            </p>
          </section>

          <section>
            <h2>16. Miscellaneous</h2>

            <h3>16.1 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and LuggageShare.
            </p>

            <h3>16.2 Severability</h3>
            <p>
              If any provision of these Terms is found invalid, the remaining
              provisions will continue in full effect.
            </p>

            <h3>16.3 No Waiver</h3>
            <p>
              Our failure to enforce any right or provision does not constitute
              a waiver of that right or provision.
            </p>

            <h3>16.4 Assignment</h3>
            <p>
              You may not assign these Terms without our consent. We may assign
              our rights and obligations to any party at any time.
            </p>

            <h3>16.5 Notices</h3>
            <p>
              We may provide notices through the Service, by email, or by
              posting on our website. You are responsible for keeping your
              contact information current.
            </p>
          </section>

          <section>
            <h2>17. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting. Material changes will
              be communicated through:
            </p>
            <ul>
              <li>Email notification to registered users</li>
              <li>Prominent notice on the platform</li>
              <li>Updated "Last Updated" date at the top of this page</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes
              acceptance of the modified Terms. If you do not agree with
              changes, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2>18. Contact Information</h2>
            <p>
              For questions, concerns, or support regarding these Terms, please
              contact us:
            </p>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> legal@luggageshare.app
              </p>
              <p>
                <strong>Support:</strong> support@luggageshare.app
              </p>
              <p>
                <strong>Website:</strong> https://www.luggageshare.app
              </p>
            </div>
            <p>We aim to respond to all inquiries within 48 hours.</p>
          </section>

          <section className="acknowledgment">
            <p>
              By using LuggageShare, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Terms;
