// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="px-6 py-12 bg-gray-50 border-t mt-20 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} The Weight Coach™ · All rights reserved</p>
      <p className="mt-2">
        <a href="/terms" className="underline">Terms</a> &middot; 
        <a href="/privacy" className="underline ml-2">Privacy</a>
      </p>
    </footer>
  );
}
