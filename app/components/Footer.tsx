import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-4">MakeLocal</h3>
            <p className="text-gray-400">
              Supporting local producers and communities, one product at a time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-emerald-400">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-emerald-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/roles" className="text-gray-400 hover:text-emerald-400">
                  Roles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/for-coordinators" className="text-gray-400 hover:text-emerald-400">
                  For Coordinators
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-gray-400 mb-2">Email: hello@makelocal.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MakeLocal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
