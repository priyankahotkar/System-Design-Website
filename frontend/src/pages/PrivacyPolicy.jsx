import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>

        <p className="mb-4 text-gray-300">
          At <strong className="text-indigo-300">Unlimitly</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform, including our system design tools, discussion forums, online code editor, and mentorship services.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Personal information you provide, such as your name, email address, and profile details.</li>
          <li>Content you create or share on our platform, including questions, answers, messages, and project data.</li>
          <li>Usage data, such as pages visited, features used, and session duration.</li>
          <li>Technical information like IP address, browser type, and device information.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>To provide, maintain, and improve our services.</li>
          <li>To personalize your experience and show relevant content.</li>
          <li>To communicate with you about updates, promotions, and support.</li>
          <li>To detect, prevent, and address technical issues or security threats.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Cookies and Tracking</h2>
        <p className="text-gray-300 mb-4">
          We may use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Sharing Your Information</h2>
        <p className="text-gray-300 mb-4">
          We do not sell your personal information. We may share information with service providers who help us run the platform, or when required by law.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Security</h2>
        <p className="text-gray-300 mb-4">
          We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Children’s Privacy</h2>
        <p className="text-gray-300 mb-4">
          Our platform is not intended for children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Changes to This Policy</h2>
        <p className="text-gray-300 mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-6 mb-4">Contact Us</h2>
        <p className="text-gray-300">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:unlimitlytech@gmail.com" className="text-indigo-400 hover:underline">unlimitlytech@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
