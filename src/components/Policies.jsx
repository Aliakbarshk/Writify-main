import React from "react";

const Policies = () => {
      return (
        <div className="min-h-screen bg-[#1a1a1a] text-[#dcdcdc] p-6 md:p-12 font-sans">
          <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-4xl font-bold text-center mb-8">
              Legal Policies
            </h1>

            {/* About Us */}
            <section>
              <h2 className="text-2xl font-semibold mb-2">About Us</h2>
              <p className="text-gray-400">
                We are a digital platform offering unique AI-generated content
                services. Our mission is to empower users with tools that
                enhance productivity and creativity.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-2">Contact Us</h2>
              <p className="text-gray-400">
                For any queries, reach out at{" "}
                <a
                  href="mailto:support@writify.ai"
                  className="text-blue-400 underline"
                >
                  support@writify.ai
                </a>
              </p>
            </section>

            {/* Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-2">
                Privacy Policy
              </h2>
              <p className="text-gray-400">
                We value your privacy. We only collect essential data to provide
                and improve our services. No data is shared with third parties
                without consent.
              </p>
            </section>

            {/* Terms & Conditions */}
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-2">
                Terms & Conditions
              </h2>
              <p className="text-gray-400">
                By using our service, you agree to our terms. Do not misuse the
                platform or attempt unauthorized access. Violations may lead to
                permanent account suspension.
              </p>
            </section>

            {/* Return & Refund Policy */}
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-2">
                Return & Refund Policy
              </h2>
              <p className="text-gray-400">
                As this is a digital service,{" "}
                <strong>no refunds or cancellations</strong> are allowed once
                the purchase is made.
              </p>
            </section>

            {/* Footer Note */}
            <div className="border-t border-gray-600 pt-6 text-sm text-center text-gray-500">
              © {new Date().getFullYear()} Writify.ai. All rights reserved.
            </div>
          </div>
   
        </div>
      );
} 

export default Policies;