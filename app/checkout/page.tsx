'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [queuePosition, setQueuePosition] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    deliveryNotes: ''
  });

  useEffect(() => {
    if (isProcessing && queuePosition > 0) {
      const timer = setTimeout(() => {
        setQueuePosition(prev => Math.max(0, prev - 1));
      }, 800);
      return () => clearTimeout(timer);
    }
    if (isProcessing && queuePosition === 0) {
      setTimeout(() => {
        router.push('/order-status');
      }, 1500);
    }
  }, [isProcessing, queuePosition, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>

        {!isProcessing ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🍯</span>
                    <div>
                      <p className="font-semibold">Organic Honey</p>
                      <p className="text-sm text-gray-600">Qty: 1</p>
                    </div>
                  </div>
                  <span className="font-bold">$12.99</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal</span>
                    <span>$12.99</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600">$0.00 (Group delivery!)</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>$12.99</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Notes (Optional)</label>
                  <textarea
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>

              {/* Group Delivery Info */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-2">🚚 Group Delivery Info</h3>
                <p className="text-sm text-gray-700">
                  Your order will be part of Friday&apos;s coordinated delivery to your neighborhood. 
                  Coordinator: Sarah Johnson
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Expected delivery: Friday, Nov 10, 2:00 PM - 5:00 PM
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-colors"
              >
                Place Order
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Processing Your Order</h2>
                <p className="text-gray-600 mb-6">Please wait while we confirm your order...</p>
              </div>

              {/* Queue Visualization */}
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Queue Position</span>
                    <span className="font-semibold text-emerald-600">
                      {queuePosition > 0 ? `#${queuePosition}` : 'Processing...'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, 100 - (queuePosition * 8))}%` }}
                    ></div>
                  </div>
                </div>

                {queuePosition > 0 ? (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{queuePosition}</span> {queuePosition === 1 ? 'person' : 'people'} ahead of you
                  </p>
                ) : (
                  <p className="text-emerald-600 font-semibold">✓ Order confirmed!</p>
                )}
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-gray-600">
                  💡 Our system efficiently processes orders in groups to coordinate delivery times
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
