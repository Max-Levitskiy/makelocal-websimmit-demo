import Link from 'next/link';
import ProductCard from './components/ProductCard';

const products = [
  {
    id: '1',
    name: 'Organic Honey',
    producer: 'Sunny Valley Farms',
    price: 12.99,
    image: '🍯',
    description: 'Pure, raw honey from local bees. Perfect for tea, toast, or baking.',
    category: 'Food'
  },
  {
    id: '2',
    name: 'Handcrafted Soap',
    producer: 'Natural Essence',
    price: 8.50,
    image: '🧼',
    description: 'All-natural soap made with organic oils and essential oils.',
    category: 'Bath'
  },
  {
    id: '3',
    name: 'Fresh Sourdough Bread',
    producer: 'Artisan Bakery Co.',
    price: 6.00,
    image: '🍞',
    description: 'Traditional sourdough made with locally-milled flour.',
    category: 'Food'
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug',
    producer: 'Clay Studio',
    price: 18.00,
    image: '☕',
    description: 'Hand-thrown ceramic mug with unique glaze patterns.',
    category: 'Crafts'
  },
  {
    id: '5',
    name: 'Organic Apple Cider',
    producer: 'Orchard Hills',
    price: 9.99,
    image: '🍎',
    description: 'Fresh pressed cider from organic apples. No added sugar.',
    category: 'Beverage'
  },
  {
    id: '6',
    name: 'Knitted Wool Scarf',
    producer: 'Cozy Knits',
    price: 35.00,
    image: '🧣',
    description: 'Soft merino wool scarf, hand-knitted with care.',
    category: 'Fashion'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Local Products, Delivered Fresh
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-100">
              Connect with local producers and get quality products delivered to your door
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#catalog" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors text-lg">
                Browse Products
              </Link>
              <Link href="/how-it-works" className="bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-800 transition-colors text-lg border-2 border-white">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Support Local</h3>
              <p className="text-gray-600">
                Direct connection with local producers and artisans
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Group Delivery</h3>
              <p className="text-gray-600">
                Efficient delivery through community coordination
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="text-xl font-bold mb-2">Fresh Quality</h3>
              <p className="text-gray-600">
                Get the freshest products directly from the source
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="catalog" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Become a Coordinator
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Organize deliveries in your community and earn rewards while supporting local producers
          </p>
          <Link href="/for-coordinators" className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors text-lg inline-block">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}

