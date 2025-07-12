import React, { useState, useEffect, useRef } from 'react';

export default function MainDisclaimer({ userEmail, onAccept, onCancel }) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const scrollContainerRef = useRef(null);

  // Check if user has scrolled to the bottom
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // Consider "end" reached when within 50px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledToEnd(true);
      }
    }
  };

  const handleConfirm = () => {
    if (hasScrolledToEnd && isChecked) {
      // Redirect to signup page
      window.location.href = 'https://www.theweightcoach.com/signup';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && hasScrolledToEnd && isChecked) {
      handleConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [hasScrolledToEnd, isChecked]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Legal Terms & Health Disclaimers</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: 'calc(90vh - 200px)' }}
        >
          <div className="prose prose-sm max-w-none">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-red-800 font-bold text-lg mb-2">⚠️ CRITICAL LEGAL & HEALTH WARNINGS</h4>
              <p className="text-red-700 text-sm">
                Please read every section carefully. Your safety and legal understanding are paramount.
              </p>
            </div>

            <h4 className="text-lg font-bold mb-3">1. 🚫 STRICT NO REFUNDS POLICY</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="font-bold text-yellow-800 mb-2">AI processing costs are incurred immediately upon subscription.</p>
              <p className="text-sm">
                Due to the personalized nature of our AI coaching service and immediate processing costs, 
                <strong> absolutely no refunds are available</strong> for any unused portion of your subscription period. 
                This includes partial months, cancelled subscriptions, dissatisfaction with results, or any other reason.
              </p>
              <p className="text-sm mt-2">
                <strong>Billing:</strong> You may cancel anytime to prevent future charges, but cancellation takes effect 
                at the end of your current billing cycle. No pro-rated refunds will be issued.
              </p>
            </div>

            <h4 className="text-lg font-bold mb-3">2. ⚕️ MEDICAL DISCLAIMER & HEALTH WARNINGS</h4>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="font-bold text-red-800 mb-2">THIS IS NOT MEDICAL ADVICE</p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>TheWeightCoach provides AI-generated fitness and nutrition information for educational purposes only</li>
                <li><strong>You MUST consult a qualified healthcare professional</strong> before starting any new fitness program or diet</li>
                <li><strong>Especially critical if you have:</strong> Heart conditions, diabetes, eating disorders, pregnancy, injuries, or take medications</li>
                <li>We are not doctors, nutritionists, or medical professionals</li>
                <li>Our AI cannot assess your individual medical situation</li>
              </ul>
            </div>

            <h4 className="text-lg font-bold mb-3">3. ⚖️ ASSUMPTION OF RISK & LIABILITY</h4>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
              <p className="text-sm mb-2">
                <strong>Physical Activity Risks:</strong> You acknowledge that any physical activity carries inherent risks 
                including but not limited to: injury, aggravation of pre-existing conditions, heart attack, stroke, or death.
              </p>
              <p className="text-sm mb-2">
                <strong>Your Responsibility:</strong> You agree that you are voluntarily participating in these activities 
                and assume ALL risk of injury to yourself.
              </p>
              <p className="text-sm">
                <strong>Limitation of Liability:</strong> TheWeightCoach Pty Ltd and its affiliates will NOT be liable 
                for any injury, loss, damage, or death you may suffer in connection with your use of our services.
              </p>
            </div>

            <h4 className="text-lg font-bold mb-3">4. 📊 RESULTS & EXPECTATIONS</h4>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>No guarantees:</strong> Weight loss and fitness results vary dramatically from person to person</li>
                <li><strong>Individual factors:</strong> Your results depend on genetics, effort, adherence, medical conditions, and consistency</li>
                <li><strong>Realistic expectations:</strong> Some users may see no results or even gain weight</li>
                <li><strong>Time commitment:</strong> Meaningful results typically require months of consistent effort</li>
              </ul>
            </div>

            <h4 className="text-lg font-bold mb-3">5. 💳 SUBSCRIPTION & AUTOMATIC BILLING</h4>
            <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4">
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>Auto-renewal:</strong> Your subscription automatically renews unless you cancel</li>
                <li><strong>Billing responsibility:</strong> You are responsible for all fees, taxes, and charges</li>
                <li><strong>Price changes:</strong> We may change prices with 30 days notice</li>
                <li><strong>Payment method:</strong> Keep your payment method current to avoid service interruption</li>
              </ul>
            </div>

            <h4 className="text-lg font-bold mb-3">6. 🔒 DATA & PRIVACY</h4>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>Your health data is processed according to Australian Privacy Principles</li>
                <li>We may use aggregated, anonymized data to improve our AI systems</li>
                <li>Third-party integrations may have their own privacy policies</li>
                <li>Data breaches will be reported as required by law</li>
              </ul>
            </div>

            <h4 className="text-lg font-bold mb-3">7. 🌏 JURISDICTION & GOVERNING LAW</h4>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
              <p className="text-sm">
                These terms are governed by the laws of Victoria, Australia. Any disputes will be resolved in 
                Victorian courts. If you're outside Australia, you agree to these terms and jurisdiction.
              </p>
            </div>

            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6 mt-6">
              <p className="font-bold text-red-900 text-center">
                By checking the agreement box and clicking "Confirm", you acknowledge that you have read, 
                understood, and agree to be bound by ALL of these terms. You confirm you are over 18 years 
                old and legally able to enter this agreement.
              </p>
            </div>

            {/* Scroll indicator */}
            {!hasScrolledToEnd && (
              <div className="text-center mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  📜 Please scroll to the bottom to continue
                </p>
                <div className="mt-2">
                  <svg className="w-6 h-6 mx-auto text-yellow-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with checkbox and buttons */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agreement-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={!hasScrolledToEnd}
              className={`w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
                !hasScrolledToEnd ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            />
            <label 
              htmlFor="agreement-checkbox" 
              className={`ml-3 text-sm font-medium ${
                !hasScrolledToEnd ? 'text-gray-400' : 'text-gray-900 cursor-pointer'
              }`}
            >
              I have read, understood, and agree to all the terms and conditions above. I confirm I am over 18 years old.
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasScrolledToEnd || !isChecked}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasScrolledToEnd && isChecked
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm & Continue {hasScrolledToEnd && isChecked && '(Press Enter)'}
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Reading Progress</span>
              <span>{hasScrolledToEnd ? 'Complete' : 'Please scroll to bottom'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  hasScrolledToEnd ? 'bg-green-500 w-full' : 'bg-blue-500 w-1/2'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
