// src/components/PricingPlans.jsx

import React, { useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import MainDisclaimer from '../legal/MainDisclaimer';

const plans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 'A$29',
    priceId: import.meta.env.VITE_STARTER_PRICE_ID,
    interval: 'month',
    features: [
      'AI-generated meal plans',
      'Calorie & macro tracking',
      'Weekly progress reports',
    ],
    recommended: false,
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 'A$49',
    priceId: import.meta.env.VITE_PROFESSIONAL_PRICE_ID,
    interval: 'month',
    features: [
      'Everything in Starter',
      '1:1 live AI coach chat',
      'Daily exercise generator',
      'Habit & mobility tracking',
    ],
    recommended: true,
  },
];

export default function PricingPlans() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const beginSubscribe = (plan) => {
    setSelectedPlan(plan);
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    setShowDisclaimer(true);
  };

  const cancelDisclaimer = () => {
    setShowDisclaimer(false);
    setSelectedPlan(null);
    localStorage.removeItem('selectedPlan');
  };

  const acceptDisclaimer = async () => {
    setShowDisclaimer(false);
    if (!isLoaded || !selectedPlan) return;

    if (isSignedIn) {
      // Proceed to Stripe checkout
      try {
        setLoading(true);
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: selectedPlan.priceId,
            userId: user?.id,
            userEmail: user?.emailAddresses?.[0]?.emailAddress,
          }),
        });

        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('No URL from session response');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        alert('Something went wrong during the checkout process.');
      } finally {
        setLoading(false);
      }
    } else {
      // Redirect to signup
      navigate('/signup', {
        state: {
          redirectReason: 'subscription',
          planName: selectedPlan.name,
          planId: selectedPlan.id,
          priceId: selectedPlan.priceId,
        },
      });
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-20 px-6" id="plans">
      <h2 className="text-4xl font-extrabold text-center mb-12">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-xl p-6 shadow ${
              plan.recommended
                ? 'ring-2 ring-blue-600 scale-105'
                : 'hover:shadow-lg transition'
            } relative`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-blue-700 text-3xl font-bold mb-1">{plan.price}</p>
            <p className="text-gray-500 mb-4 text-sm">per {plan.interval}</p>

            <ul className="text-gray-700 mb-6 space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✅ {feature}</li>
              ))}
            </ul>

            <button
              onClick={() => beginSubscribe(plan)}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading && selectedPlan?.id === plan.id
                ? 'Processing...'
                : 'Subscribe'}
            </button>

            {!isSignedIn && (
              <p className="text-xs text-center text-gray-500 mt-2">
                You'll be asked to sign up first
              </p>
            )}
          </div>
        ))}
      </div>

      {showDisclaimer && (
        <MainDisclaimer
          userEmail={user?.emailAddresses?.[0]?.emailAddress}
          onAccept={acceptDisclaimer}
          onCancel={cancelDisclaimer}
        />
      )}

      <div className="text-center mt-12 text-sm text-gray-500">
        Secure payment • Cancel anytime
      </div>
    </section>
  );
}

  
