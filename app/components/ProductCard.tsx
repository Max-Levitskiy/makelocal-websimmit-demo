import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  producer: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export default function ProductCard({ id, name, producer, price, image, description, category }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
          <span className="text-6xl">{image}</span>
          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {producer}</p>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-emerald-600">${price.toFixed(2)}</span>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
