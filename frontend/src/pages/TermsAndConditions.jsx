import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>

        <p className="mb-4 text-gray-700">
          Welcome to <strong>Unlimitly</strong>! By accessing or using our platform, including the live collaboration whiteboard, online code editor, interview questions, and discussion forums, you agree to comply with these Terms and Conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By using our services, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">2. Use of the Platform</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>You may use the platform only for lawful purposes and in accordance with these Terms.</li>
          <li>You agree not to engage in any conduct that may harm the platform, our users, or violate the rights of others.</li>
          <li>All content you post, share, or submit must be appropriate and respectful.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content, features, and functionality of the platform, including text, graphics, logos, and software, are owned by Unlimitly or its licensors and are protected by copyright, trademark, and other laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">4. User Accounts</h2>
        <p className="text-gray-700 mb-4">
          To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5. Termination</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to suspend or terminate your access at any time for violations of these Terms or any unlawful activity.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          To the maximum extent permitted by law, Unlimitly is not liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">7. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          We may update these Terms from time to time. Continued use of the platform after any changes constitutes your acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">8. Governing Law</h2>
        <p className="text-gray-700 mb-4">
          These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in Solapur, Maharashtra, India.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">9. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions regarding these Terms and Conditions, please contact us at <a href="mailto:unlimitlytech@gmail.com" className="text-blue-600 hover:underline">unlimitlytech@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
