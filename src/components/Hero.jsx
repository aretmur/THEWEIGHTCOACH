// src/components/Hero.jsx

import { Link } from 'react-router-dom';
import { SignedOut, SignUpButton } from '@clerk/clerk-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-20 text-center px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          AI-Powered Weight Coaching for Real Results 💪
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Whether your goal is weight loss or muscle gain — our AI coaches create personalized plans tailored to your body, your habits, and your target.
        </p>

        <div className="flex justify-center items-center gap-4 flex-wrap">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
                Start Free Trial
              </button>
            </SignUpButton>
          </SignedOut>

          <Link to="/pricing" className="text-green-700 font-semibold underline hover:text-green-800 text-lg">
            See Plans & Pricing →
          </Link>
        </div>

        <img
          src="/public/hero-weight-coach.svg"
          alt="AI weight coach illustration"
          className="mt-16 w-full max-w-3xl mx-auto"
        />
      </div>
    </section>
  );
}
