import Link from 'next/link';

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Roles in the MakeLocal Ecosystem</h1>
          <p className="text-xl text-emerald-100">
            Everyone has a part to play in building a stronger local economy
          </p>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customers */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-emerald-200">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-8 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 text-emerald-600">Who They Are</h3>
                <p className="text-gray-600 mb-4">
                  Community members who purchase local products through the MakeLocal platform.
                </p>
                
                <h3 className="font-bold text-lg mb-3 text-emerald-600">What They Do</h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span className="text-gray-600">Browse and order local products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span className="text-gray-600">Receive deliveries at their door</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span className="text-gray-600">Support local producers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    <span className="text-gray-600">Provide feedback and reviews</span>
                  </li>
                </ul>

                <h3 className="font-bold text-lg mb-3 text-emerald-600">Benefits</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Fresh, quality local products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Lower delivery costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Support community</span>
                  </li>
                </ul>

                <Link href="/" className="block w-full bg-emerald-600 text-white text-center py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors">
                  Start Shopping
                </Link>
              </div>
            </div>

            {/* Coordinators */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-300">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-8 text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-2xl font-bold text-gray-900">Coordinators</h2>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 text-amber-600">Who They Are</h3>
                <p className="text-gray-600 mb-4">
                  Community leaders who organize and manage group deliveries in their neighborhoods.
                </p>
                
                <h3 className="font-bold text-lg mb-3 text-amber-600">What They Do</h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    <span className="text-gray-600">Collect orders from local area</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    <span className="text-gray-600">Coordinate with producers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    <span className="text-gray-600">Organize delivery routes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    <span className="text-gray-600">Manage customer relationships</span>
                  </li>
                </ul>

                <h3 className="font-bold text-lg mb-3 text-amber-600">Benefits</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Earn commission on orders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Flexible schedule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Build community connections</span>
                  </li>
                </ul>

                <Link href="/for-coordinators" className="block w-full bg-amber-600 text-white text-center py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors">
                  Become a Coordinator
                </Link>
              </div>
            </div>

            {/* Producers */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-200">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 text-center">
                <div className="text-6xl mb-4">🌾</div>
                <h2 className="text-2xl font-bold text-gray-900">Producers</h2>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 text-blue-600">Who They Are</h3>
                <p className="text-gray-600 mb-4">
                  Local farmers, artisans, and makers who create quality products for the community.
                </p>
                
                <h3 className="font-bold text-lg mb-3 text-blue-600">What They Do</h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-600">List products on platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-600">Fulfill grouped orders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-600">Coordinate with coordinators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-600">Maintain product quality</span>
                  </li>
                </ul>

                <h3 className="font-bold text-lg mb-3 text-blue-600">Benefits</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Direct market access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Better profit margins</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">★</span>
                    <span className="text-gray-600">Build customer base</span>
                  </li>
                </ul>

                <Link href="/contact" className="block w-full bg-blue-600 text-white text-center py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                  Become a Producer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Everyone Works Together</h2>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
                  🛍️
                </div>
                <div className="flex-shrink-0 text-gray-400 text-2xl">→</div>
                <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
                  🤝
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Customers</span> place orders through the platform, which are collected by <span className="font-semibold">Coordinators</span> in their area.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
                  🤝
                </div>
                <div className="flex-shrink-0 text-gray-400 text-2xl">→</div>
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                  🌾
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Coordinators</span> group orders and communicate with <span className="font-semibold">Producers</span> to arrange efficient pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                  🌾
                </div>
                <div className="flex-shrink-0 text-gray-400 text-2xl">→</div>
                <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
                  🤝
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Producers</span> prepare orders and hand them off to <span className="font-semibold">Coordinators</span> for delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl">
                  🤝
                </div>
                <div className="flex-shrink-0 text-gray-400 text-2xl">→</div>
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
                  🛍️
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-semibold">Coordinators</span> deliver orders to <span className="font-semibold">Customers</span> in an optimized route.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="font-bold text-lg mb-2 text-emerald-800">The Result</h3>
              <p className="text-gray-700">
                A sustainable, community-driven marketplace that benefits everyone: customers get fresh local products, coordinators earn income, and producers reach more customers—all while reducing environmental impact and strengthening community bonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Find Your Role in MakeLocal
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Whether you're a customer, coordinator, or producer, there's a place for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors text-lg">
              Start Shopping
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
