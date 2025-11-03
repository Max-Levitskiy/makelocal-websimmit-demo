import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How MakeLocal Works</h1>
          <p className="text-xl text-emerald-100">
            Simple, efficient, and community-driven
          </p>
        </div>
      </section>

      {/* The Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The MakeLocal Flow</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full font-bold text-2xl mb-4">
                  1
                </div>
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-xl font-bold mb-2">Browse & Order</h3>
                <p className="text-gray-600">
                  Discover local products from nearby producers. Place orders directly through our platform with easy customization options.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full font-bold text-2xl mb-4">
                  2
                </div>
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-2">Group Coordination</h3>
                <p className="text-gray-600">
                  Local coordinators group orders from your neighborhood to optimize pickup and delivery routes.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full font-bold text-2xl mb-4">
                  3
                </div>
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-xl font-bold mb-2">Efficient Delivery</h3>
                <p className="text-gray-600">
                  Receive your fresh, local products at your door as part of a coordinated neighborhood delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MakeLocal?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">🌱</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Support Local Economy</h3>
                  <p className="text-gray-600">
                    Every purchase directly supports local producers, artisans, and small businesses in your community.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">💰</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Lower Costs</h3>
                  <p className="text-gray-600">
                    Group deliveries mean lower delivery fees and better prices for everyone involved.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">♻️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
                  <p className="text-gray-600">
                    Reduced carbon footprint through optimized delivery routes and minimal packaging.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">🤝</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Community Building</h3>
                  <p className="text-gray-600">
                    Connect with neighbors and local producers, strengthening community bonds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Coordination Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Group Delivery Coordination</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Orders Collected</h4>
                  <p className="text-gray-600">
                    Coordinators collect all orders from a specific area or neighborhood during a set time window.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Producers Notified</h4>
                  <p className="text-gray-600">
                    Local producers receive grouped orders and prepare items for efficient pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Route Optimized</h4>
                  <p className="text-gray-600">
                    Delivery routes are planned to maximize efficiency and minimize environmental impact.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Delivered Together</h4>
                  <p className="text-gray-600">
                    All orders in your area are delivered in one coordinated trip, reducing costs and emissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Join thousands of community members supporting local producers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors text-lg">
              Browse Products
            </Link>
            <Link href="/for-coordinators" className="bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-800 transition-colors text-lg border-2 border-white">
              Become a Coordinator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
