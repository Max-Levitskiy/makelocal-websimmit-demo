'use client';

import { useState } from 'react';

export default function ForCoordinatorsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    motivation: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        motivation: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-amber-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a MakeLocal Coordinator</h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">
            Earn income while building community connections
          </p>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors text-lg"
          >
            View Coordinator Resources
          </button>
        </div>
      </section>

      {/* What is a Coordinator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Does a Coordinator Do?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-amber-50 rounded-lg p-6 text-center border border-amber-200">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold text-lg mb-2">Collect Orders</h3>
              <p className="text-gray-600 text-sm">
                Gather orders from customers in your neighborhood or community area
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center border border-amber-200">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-lg mb-2">Coordinate</h3>
              <p className="text-gray-600 text-sm">
                Work with local producers to arrange pickup times and locations
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center border border-amber-200">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-2">Organize Delivery</h3>
              <p className="text-gray-600 text-sm">
                Plan efficient delivery routes to bring products to customers
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center border border-amber-200">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2">Earn Commission</h3>
              <p className="text-gray-600 text-sm">
                Get paid for each successful delivery you coordinate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Coordinator Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-5xl mb-4 text-center">💵</div>
              <h3 className="text-xl font-bold mb-3 text-center">Competitive Earnings</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">15% commission on each order</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Bonus for high volume</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Weekly direct deposits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">No startup costs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-5xl mb-4 text-center">⏰</div>
              <h3 className="text-xl font-bold mb-3 text-center">Flexible Schedule</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Choose your own hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Work part-time or full-time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Set your delivery windows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Perfect side hustle</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-5xl mb-4 text-center">🌟</div>
              <h3 className="text-xl font-bold mb-3 text-center">Community Impact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Support local businesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Build community connections</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Reduce carbon footprint</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">✓</span>
                  <span className="text-gray-600">Be a local leader</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">🚗</div>
              <div>
                <h3 className="font-bold mb-1">Reliable Transportation</h3>
                <p className="text-gray-600 text-sm">
                  Car, bike, or any reliable way to pick up and deliver orders
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-bold mb-1">Smartphone</h3>
                <p className="text-gray-600 text-sm">
                  Access to our mobile app for order management
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">⏱️</div>
              <div>
                <h3 className="font-bold mb-1">Time Commitment</h3>
                <p className="text-gray-600 text-sm">
                  At least 10 hours per week to coordinate deliveries
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">💬</div>
              <div>
                <h3 className="font-bold mb-1">Good Communication</h3>
                <p className="text-gray-600 text-sm">
                  Ability to coordinate with customers and producers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Apply to Become a Coordinator</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">Application Submitted!</h3>
                <p className="text-gray-600">
                  Thank you for your interest. We'll review your application and get back to you within 2-3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Location (City/Neighborhood) *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Downtown Seattle, WA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Previous Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="delivery">Delivery/Logistics</option>
                    <option value="community">Community Organization</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="none">No Related Experience</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Why do you want to be a coordinator?</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us about your interest..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 text-white py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition-colors"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Static Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Coordinator Resources</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-600">📚 Training Materials</h3>
                  <ul className="space-y-2">
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Getting Started Guide</p>
                      <p className="text-xs text-gray-600">Complete onboarding manual</p>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Best Practices</p>
                      <p className="text-xs text-gray-600">Tips from top coordinators</p>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Video Tutorials</p>
                      <p className="text-xs text-gray-600">Step-by-step walkthroughs</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-600">🛠️ Tools & Templates</h3>
                  <ul className="space-y-2">
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Order Tracking Sheet</p>
                      <p className="text-xs text-gray-600">Downloadable template</p>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Route Planning Tool</p>
                      <p className="text-xs text-gray-600">Optimize your deliveries</p>
                    </li>
                    <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <p className="font-semibold text-sm">Customer Communication Templates</p>
                      <p className="text-xs text-gray-600">Pre-written messages</p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-600">💡 Success Stories</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm italic mb-2">
                        "I've been coordinating for 6 months and love being a connector in my community while earning extra income!"
                      </p>
                      <p className="text-xs font-semibold">- Maria R., Portland</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm italic mb-2">
                        "Started part-time, now I coordinate full-time. Best decision I've made!"
                      </p>
                      <p className="text-xs font-semibold">- James T., Seattle</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-600">📞 Support</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Email:</span> coordinators@makelocal.com
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Phone:</span> (555) 123-4567
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Hours:</span> Mon-Fri, 9am-6pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
