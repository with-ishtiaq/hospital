import React from 'react';
import { Mail } from 'lucide-react';

const MailVerification = ({ onVerificationComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-8">We've sent a verification link to your email address. Please click on the link to verify your account.</p>
          
          <div className="space-y-4">
            <button
              onClick={onVerificationComplete}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
            >
              Email Verified - Continue
            </button>
            
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
              Resend Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailVerification;
