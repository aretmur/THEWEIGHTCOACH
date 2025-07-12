import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Pricing from './pages/pricing.jsx';
import Dashboard from './pages/Dashboard'; // placeholder
import OnboardingFlow from './components/OnboardingFlow'; // already exists

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />

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
