import React from "react";
import { useNavigate } from "react-router-dom";

const Policies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#dcdcdc] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#00adb5] hover:bg-[#00c3cc] text-white text-sm rounded-md cursor-pointer mb-6"
        >
          ⬅ Back
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 border-b border-gray-600 pb-4">
          Legal Policies
        </h1>

        {/* About Us */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            About Us
          </h2>
          <p className="text-gray-400">
            We are a digital platform offering unique AI-generated content
            services. Our mission is to empower users with tools that enhance
            productivity and creativity.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Contact Us
          </h2>
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
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Privacy Policy
          </h2>
          <p className="text-gray-400">
            We value your privacy. We only collect essential data to provide and
            improve our services. No data is shared with third parties without
            consent.
          </p>
        </section>

        {/* Terms & Conditions */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Terms & Conditions
          </h2>
          <p className="text-gray-400">
            By using our service, you agree to our terms. Do not misuse the
            platform or attempt unauthorized access. Violations may lead to
            permanent account suspension.
          </p>
        </section>

        {/* Return & Refund Policy */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Return & Refund Policy
          </h2>
          <p className="text-gray-400">
            As this is a digital service,{" "}
            <strong>no refunds or cancellations</strong> are allowed once the
            purchase is made.
          </p>
        </section>

        {/* Footer Note */}
        <div className="border-t border-gray-600 pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} Writify.ai. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Policies;
