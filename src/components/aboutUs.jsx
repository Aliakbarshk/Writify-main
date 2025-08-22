import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
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
          About Us
        </h1>

        {/* Our Story */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            My Journey
          </h2>
          <p className="text-gray-400">
            YouWritee is created and managed by just one person — me. I started
            this project with a passion to make text-to-handwriting conversion
            easy, fast, and realistic. Everything you see here is built from
            scratch, with dedication and love for technology.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            My Mission
          </h2>
          <p className="text-gray-400">
            My mission is to provide a reliable, fun, and simple tool for
            students, teachers, and anyone who wants to add a personal touch to
            their text using realistic handwriting.
          </p>
        </section>

        {/* Why Choose Me */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Why Choose YouWritee?
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Solo-built & personally maintained</li>
            <li>Realistic handwriting styles</li>
            <li>Fast and easy to use</li>
            <li>Built with passion and attention to detail</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section className="bg-[#222831] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-[#00adb5]">
            Contact Me
          </h2>
          <p className="text-gray-400 mb-2">
            Email:{" "}
            <a
              href="mailto:writeefyy@gmail.com"
              className="text-blue-400 underline"
            >
              writeefyy@gmail.com
            </a>
          </p>
          <p className="text-gray-400">
            WhatsApp (No calls):{" "}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline"
            >
              +91 98765 43210
            </a>
          </p>
        </section>

        {/* Footer Note */}
        <div className="border-t border-gray-600 pt-6 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} YouWritee. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
