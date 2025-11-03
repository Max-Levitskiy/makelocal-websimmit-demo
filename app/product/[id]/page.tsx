'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  producer: string;
  price: number;
  image: string;
  description: string;
  category: string;
  fullDescription: string;
  producerInfo: string;
  availability: string;
  personalizationOptions: string[];
}

const productsData: { [key: string]: ProductData } = {
  '1': {
    id: '1',
    name: 'Organic Honey',
    producer: 'Sunny Valley Farms',
    price: 12.99,
    image: '🍯',
    description: 'Pure, raw honey from local bees. Perfect for tea, toast, or baking.',
    category: 'Food',
    fullDescription: 'Our organic honey is harvested from hives maintained in pesticide-free meadows. Each jar contains the pure essence of local wildflowers, with no additives or processing. Rich in antioxidants and natural enzymes.',
    producerInfo: 'Family-owned farm operating for over 30 years in the valley.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['Add gift message', 'Select jar size', 'Subscribe monthly']
  },
  '2': {
    id: '2',
    name: 'Handcrafted Soap',
    producer: 'Natural Essence',
    price: 8.50,
    image: '🧼',
    description: 'All-natural soap made with organic oils and essential oils.',
    category: 'Bath',
    fullDescription: 'Luxurious handmade soap crafted with organic coconut oil, shea butter, and pure essential oils. Gentle on sensitive skin and environmentally friendly.',
    producerInfo: 'Small batch artisan soap maker using traditional cold-process methods.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['Choose scent', 'Add gift wrapping', 'Buy bundle']
  },
  '3': {
    id: '3',
    name: 'Fresh Sourdough Bread',
    producer: 'Artisan Bakery Co.',
    price: 6.00,
    image: '🍞',
    description: 'Traditional sourdough made with locally-milled flour.',
    category: 'Food',
    fullDescription: 'Authentic sourdough bread made with our 100-year-old starter culture. Slowly fermented for 24 hours, resulting in a complex flavor and perfect crust.',
    producerInfo: 'Third-generation bakers committed to traditional methods.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['Sliced or whole', 'Weekly subscription', 'Extra loaf']
  },
  '4': {
    id: '4',
    name: 'Ceramic Coffee Mug',
    producer: 'Clay Studio',
    price: 18.00,
    image: '☕',
    description: 'Hand-thrown ceramic mug with unique glaze patterns.',
    category: 'Crafts',
    fullDescription: 'Each mug is individually crafted on the potter\'s wheel, making every piece unique. Food-safe glazes in beautiful earth tones. Holds 12oz.',
    producerInfo: 'Local pottery studio specializing in functional ceramics.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['Choose color', 'Add custom engraving', 'Set of 2']
  },
  '5': {
    id: '5',
    name: 'Organic Apple Cider',
    producer: 'Orchard Hills',
    price: 9.99,
    image: '🍎',
    description: 'Fresh pressed cider from organic apples. No added sugar.',
    category: 'Beverage',
    fullDescription: 'Made from a blend of heirloom apple varieties grown in our certified organic orchard. Cold-pressed and bottled the same day for maximum freshness.',
    producerInfo: 'Fifth-generation orchard with 200+ heritage apple trees.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['1L or 2L bottle', 'Add spice blend', 'Monthly delivery']
  },
  '6': {
    id: '6',
    name: 'Knitted Wool Scarf',
    producer: 'Cozy Knits',
    price: 35.00,
    image: '🧣',
    description: 'Soft merino wool scarf, hand-knitted with care.',
    category: 'Fashion',
    fullDescription: 'Luxuriously soft scarf hand-knitted from 100% merino wool. Perfect for cold weather, and the natural fibers are both warm and breathable.',
    producerInfo: 'Local artisan specializing in sustainable knitwear.',
    availability: 'In stock - Next delivery: Friday',
    personalizationOptions: ['Choose color', 'Custom length', 'Gift box']
  }
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const product = productsData[id];
  
  const [quantity, setQuantity] = useState(1);
  const [selectedPersonalization, setSelectedPersonalization] = useState<string[]>([]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-emerald-600 hover:underline">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    router.push('/checkout');
  };

  const togglePersonalization = (option: string) => {
    setSelectedPersonalization(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-emerald-600 hover:underline mb-6 inline-block">
          ← Back to catalog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-12 flex items-center justify-center">
              <span className="text-9xl">{product.image}</span>
            </div>

            {/* Product Details */}
            <div className="p-8">
              <span className="inline-block bg-emerald-600 text-white text-sm px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">by {product.producer}</p>
              <p className="text-3xl font-bold text-emerald-600 mb-6">${product.price.toFixed(2)}</p>
              
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700 mb-4">{product.fullDescription}</p>
                <p className="text-gray-600 text-sm italic">{product.producerInfo}</p>
              </div>

              <div className="mb-6">
                <p className="text-emerald-600 font-semibold">✓ {product.availability}</p>
              </div>

              {/* Personalization Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Personalization Options</h3>
                <div className="space-y-2">
                  {product.personalizationOptions.map((option: string) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPersonalization.includes(option)}
                        onChange={() => togglePersonalization(option)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-emerald-600 font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-emerald-600 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 text-white py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-colors"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>

              {/* Coordinator Note */}
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Local Coordinator:</span> This product will be included in Friday&apos;s group delivery to your neighborhood.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
