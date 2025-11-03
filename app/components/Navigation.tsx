'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">MakeLocal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium">
              Catalog
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-emerald-600 font-medium">
              How It Works
            </Link>
            <Link href="/roles" className="text-gray-700 hover:text-emerald-600 font-medium">
              Roles
            </Link>
            <Link href="/for-coordinators" className="text-gray-700 hover:text-emerald-600 font-medium">
              For Coordinators
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-emerald-600 font-medium">
              Contact
            </Link>
            <Link href="/for-coordinators" className="bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
              Become a Coordinator
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md font-medium">
              Catalog
            </Link>
            <Link href="/how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md font-medium">
              How It Works
            </Link>
            <Link href="/roles" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md font-medium">
              Roles
            </Link>
            <Link href="/for-coordinators" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md font-medium">
              For Coordinators
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md font-medium">
              Contact
            </Link>
            <Link href="/for-coordinators" className="block mx-3 my-2 px-3 py-2 bg-emerald-600 text-white text-center rounded-full font-semibold hover:bg-emerald-700">
              Become a Coordinator
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
