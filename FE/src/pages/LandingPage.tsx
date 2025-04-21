import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="font-sans bg-white">
      {/* Header */}
      <header className="border-b">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo Placeholder */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-300 rounded" /> {/* Replace with logo image later */}
      <span className="text-2xl font-semibold">RentEase</span>
    </div>

    {/* Menu Links */}
    <nav className="flex gap-6 text-lg">
      <a href="#features" className="hover:text-gray-700">Features</a>
      <a href="#pricing" className="hover:text-gray-700">Pricing</a>
      <a href="#contact" className="hover:text-gray-700">Contact</a>
    </nav>

    {/* Auth Buttons */}
    <div className="space-x-3">
       <Link to="/login">
        <button className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
      Log In
        </button>
        </Link>
    </div>
  </div>
</header>

      {/* Hero */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between px-6 py-16 gap-8 max-w-7xl mx-auto">
  <div className="flex-1 flex flex-col justify-center">
    <h1 className="text-4xl font-bold mb-4">Rent Management Made Easy</h1>
    <p className="text-lg text-gray-600 mb-6">A simple platform to manage tenants, payments, and reminders.</p>
    <button className="bg-black text-white px-6 py-3 rounded">Get Started</button>
  </div>
  <div className="flex-1 flex items-center justify-center">
    <div className="bg-gray-200 w-full h-56 rounded-md" />
  </div>
  </div>

      {/* Features */}
      <div className="px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold">• Tenant Management</h3>
            <p className="text-sm text-gray-600">Easily add and manage tenants.</p>
          </div>
          <div>
            <h3 className="font-semibold">• Automated Reminders</h3>
            <p className="text-sm text-gray-600">Send rent reminders automatically.</p>
          </div>
          <div>
            <h3 className="font-semibold">• Rent Collection</h3>
            <p className="text-sm text-gray-600">Accept online payments securely.</p>
          </div>
          <div>
            <h3 className="font-semibold">• Payment Tracking</h3>
            <p className="text-sm text-gray-600">View payment history and status.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-16 gap-8 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold mb-4">Streamline Your Rent Collection</h2>
          <p className="mb-6 text-gray-600">Sign up now and simplify your rental business.</p>
          <button className="bg-black text-white px-6 py-3 rounded">Sign Up</button>
        </div>
        <div className="bg-gray-200 w-full h-56 rounded-md" />
      </div>

      {/* Footer CTA */}
      <footer className="text-center py-10 border-t">
        <h3 className="text-2xl font-semibold mb-2">Streamline Your Rent Collection</h3>
        <p className="text-sm text-gray-600">Sign up now and simplify your rental business.</p>
      </footer>
    </div>
  );
}
