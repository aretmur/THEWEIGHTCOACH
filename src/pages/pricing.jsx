import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import MainDisclaimer from '../legal/MainDisclaimer';

const PricingSection = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [showMainDisclaimer, setShowMainDisclaimer] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  const plans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 'A$29',
    priceId: import.meta.env.VITE_STARTER_PRICE_ID,
    interval: 'month',
    features: [ /* features */ ],
    recommended: false
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 'A$49',
    priceId: import.meta.env.VITE_PROFESSIONAL_PRICE_ID,
    interval: 'month',
    features: [ /* features */ ],
    recommended: true
  }
];


  const handleSubscribe = (plan) => {
    if (!isLoaded) return;

    // Store selected plan for later use
    setPendingPlan(plan);
    localStorage.setItem('selectedPlan', JSON.stringify(plan));

    // Show Main Disclaimer popup first
    setShowMainDisclaimer(true);
  };

  const handleDisclaimerAccept = () => {
    setShowMainDisclaimer(false);
    
    if (pendingPlan) {
      if (isSignedIn) {
        // User is signed in, proceed directly to checkout
        redirectToCheckout(pendingPlan);
      } else {
        // User is not signed in, redirect to signup
        navigate('/signup', { 
          state: { 
            redirectReason: 'subscription',
            planName: pendingPlan.name,
            planId: pendingPlan.id,
            priceId: pendingPlan.priceId
          }
        });
      }
    }
  };

  const handleDisclaimerCancel = () => {
    setShowMainDisclaimer(false);
    setPendingPlan(null);
    localStorage.removeItem('selectedPlan');
  };

  const redirectToCheckout = async (plan) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user?.id,
          userEmail: user?.emailAddresses?.[0]?.emailAddress,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }

      throw new Error('Unable to create checkout session');
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your request. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for everyone. No hidden fees, no surprises. Select the plan that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                plan.recommended 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {plan.price}
                </div>
                <div className="text-gray-500">per {plan.interval}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg 
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={!isLoaded}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.recommended
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {!isLoaded ? 'Loading...' : 'Subscribe Now'}
              </button>

              {!isSignedIn && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  You'll be asked to create an account first
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Secure Payment • Cancel Anytime
          </p>
        </div>
      </div>

      {/* Render MainDisclaimer if triggered */}
      {showMainDisclaimer && (
        <MainDisclaimer
          userEmail={user?.emailAddresses?.[0]?.emailAddress}
          onAccept={handleDisclaimerAccept}
          onCancel={handleDisclaimerCancel}
        />
      )}
    </section>
  );
};

export default PricingSection;
