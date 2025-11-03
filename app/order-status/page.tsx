'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const orderStatuses = [
  { id: 1, name: 'Order Placed', description: 'Your order has been received', completed: true },
  { id: 2, name: 'Confirmed by Producer', description: 'Sunny Valley Farms confirmed your order', completed: true },
  { id: 3, name: 'Being Prepared', description: 'Your items are being prepared', completed: true },
  { id: 4, name: 'Ready for Pickup', description: 'Coordinator will pick up your order', completed: false },
  { id: 5, name: 'Out for Delivery', description: 'On the way to your location', completed: false },
  { id: 6, name: 'Delivered', description: 'Order has been delivered', completed: false }
];

export default function OrderStatusPage() {
  const [currentStep, setCurrentStep] = useState(3);
  const [statuses, setStatuses] = useState(orderStatuses);

  useEffect(() => {
    // Simulate progress updates
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 6) {
          const next = prev + 1;
          setStatuses(orderStatuses.map(status => ({
            ...status,
            completed: status.id <= next
          })));
          return next;
        }
        clearInterval(timer);
        return prev;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Order Status</h1>
          <p className="text-gray-600">Order #ML-2024-001</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Expected Delivery */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-8 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-emerald-800 mb-1">Expected Delivery</h2>
                <p className="text-gray-700">Friday, November 10, 2025</p>
                <p className="text-gray-600 text-sm">Between 2:00 PM - 5:00 PM</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6">Delivery Progress</h3>
            <div className="space-y-6">
              {statuses.map((status, index) => (
                <div key={status.id} className="relative">
                  <div className="flex items-start">
                    {/* Status Icon */}
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        status.completed
                          ? 'bg-emerald-600 border-emerald-600'
                          : currentStep === status.id
                          ? 'bg-white border-emerald-600'
                          : 'bg-white border-gray-300'
                      }`}>
                        {status.completed ? (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : currentStep === status.id ? (
                          <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      {index < statuses.length - 1 && (
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-12 mt-2 ${
                          status.completed ? 'bg-emerald-600' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>

                    {/* Status Details */}
                    <div className="ml-4 flex-1">
                      <h4 className={`font-semibold ${
                        status.completed || currentStep === status.id ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {status.name}
                      </h4>
                      <p className={`text-sm ${
                        status.completed || currentStep === status.id ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {status.description}
                      </p>
                      {currentStep === status.id && (
                        <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>

                    {/* Timestamp */}
                    {status.completed && (
                      <div className="text-xs text-gray-500">
                        {index === 0 && 'Nov 3, 10:30 AM'}
                        {index === 1 && 'Nov 3, 11:15 AM'}
                        {index === 2 && 'Nov 3, 2:45 PM'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🍯</span>
                <div className="flex-1">
                  <p className="font-semibold">Organic Honey</p>
                  <p className="text-sm text-gray-600">by Sunny Valley Farms</p>
                  <p className="text-sm text-gray-600">Quantity: 1</p>
                </div>
                <span className="font-bold">$12.99</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$12.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coordinator Info */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Your Coordinator</h3>
            <div className="flex items-center space-x-4 bg-emerald-50 rounded-lg p-4">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                SJ
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Community Coordinator</p>
                <p className="text-sm text-emerald-600 mt-1">📞 (555) 987-6543</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1 bg-emerald-600 text-white text-center py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
              Browse More Products
            </Link>
            <button className="flex-1 bg-white text-emerald-600 border-2 border-emerald-600 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
              Contact Coordinator
            </button>
          </div>
        </div>

        {/* Demo Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Demo Mode:</span> Status updates are simulated for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}
