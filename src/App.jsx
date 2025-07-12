import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Pages
import Landing from './pages/Landing';
import Pricing from './pages/Pricing'; // ✅ File is correctly named Pricing.jsx
import Dashboard from './pages/Dashboard';

// Components
import OnboardingFlow from './components/OnboardingFlow';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <SignedIn>
            <OnboardingFlow />
          </SignedIn>
        }
      />

      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}
