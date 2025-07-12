// src/components/PricingPlans.jsx

import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const plans = [
  {
    name: 'Starter',
    price: '29',
    desc: 'Basic AI coach with daily check-ins',
    features: ['AI-generated meal plans', 'Calorie/macro tracking', 'Weekly progress review'],
    planId: 'starter',
  },
  {
    name: 'Pro',
    price: '59',
    desc: 'Advanced plan for serious transformation',
    features: ['Everything in Starter', '+ 1:1 AI coach chat', '+ Exercise generation', '+ Habit tracking'],
    planId: 'pro',
  },
];

export default function PricingPlans() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(null);

  async function handleCheckout(plan) {
    setLoading(plan.planId);
    const token = await getToken();

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: plan.planId,
        email: 'demo@example.com', // Replace with actual Clerk user email if needed
        countryCode: 'US', // In future: detect from user
      }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    setLoading(null);
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-extrabold text-center mb-12">Choose Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-12">
        {plans.map((plan) => (
          <div key={plan.planId} className="border rounded-xl p-6 shadow hover:shadow-md">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-green-600 text-3xl font-semibold mb-4">${plan.price}/mo</p>
            <p className="text-gray-600 mb-4">{plan.desc}</p>
            <ul className="mb-6 space-y-2 text-gray-700">
              {plan.features.map((feat, i) => (
                <li key={i}>✅ {feat}</li>
              ))}
            </ul>
            <button
              disabled={loading === plan.planId}
              onClick={() => handleCheckout(plan)}
              className="bg-green-600 text-white px-5 py-3 rounded-lg w-full font-semibold hover:bg-green-700"
            >
              {loading === plan.planId ? 'Redirecting...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

  
