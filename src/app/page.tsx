"use client";

import Link from "next/link";
import { CartIcon } from "@/components/cart/CartIcon";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllProducts } from "@/lib/products/products-loader";

export default function Home() {
  const products = getAllProducts();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center p-4 mx-auto">
          <div className="flex size-12 shrink-0 items-center justify-start text-primary">
            <span className="material-symbols-outlined text-3xl">widgets</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
            MakeLocal
          </h2>
          <div className="flex w-12 items-center justify-end">
            <Link href="/cart">
              <CartIcon className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-visible rounded-xl h-12 bg-transparent text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HeroSection */}
        <div className="@container">
          <div className="@[480px]:p-4 p-0">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(16, 26, 34, 0.2) 0%, rgba(16, 26, 34, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGHKQZrGeeS94CPVjgQN9DYedk8I4LB9drFfK1Y5nS4omYG6fXkt_n6YMJ3EqpflVTk6WnGyxdiudzVf5kMtQeFFsf9RVJQulWhKVIKtd-aqLXVc0vMza1Vee4Sp_tnWJxVyFrcXniS93m3zCHTRopZVkcWzFeR3y4BQaFXbdJ0ZdUpbwx6j-5mUNeMjD-nABdPOekJptpCzk5yQIyJoD2tpH0i_PHG5UTK0Z73Ht6mHPMXnDlari3bP12NPouvnIR0m_AXofTfcw")',
              }}
            >
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Make it here.
                </h1>
                <h2 className="text-slate-200 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  Browse products, personalize items, and place demo orders to
                  see local manufacturing in action.
                </h2>
              </div>
              <div className="flex-wrap gap-3 flex">
                <a
                  href="#products"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Browse catalog</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Live Queue Banner */}
        <div className="overflow-hidden py-3 bg-slate-200/50 dark:bg-slate-800/50 my-5">
          <div className="inline-block whitespace-nowrap animate-marquee text-slate-700 dark:text-slate-300">
            <span className="px-4">Now printing: Keychain for Sara (42%)</span>
            <span className="text-primary px-4">•</span>
            <span className="px-4">Next: Clip for João</span>
            <span className="text-primary px-4">•</span>
            <span className="px-4">Ready for pickup: TOKEN-7B3</span>
            <span className="text-primary px-4">•</span>
            <span className="px-4">Now printing: Keychain for Sara (42%)</span>
            <span className="text-primary px-4">•</span>
            <span className="px-4">Next: Clip for João</span>
            <span className="text-primary px-4">•</span>
            <span className="px-4">Ready for pickup: TOKEN-7B3</span>
            <span className="text-primary px-4">•</span>
          </div>
        </div>

        {/* SectionHeader */}
        <h2
          id="products"
          className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5"
        >
          Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* "How It Works" Section */}
        <div className="px-4 py-10">
          <h2 className="text-slate-900 dark:text-white text-center text-[22px] font-bold leading-tight tracking-[-0.015em] pb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  store
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                1. Choose a product
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Browse our catalog of useful and fun items.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  palette
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                2. Personalize it
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Pick your colors and add your own text or logo.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  print
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                3. We print it locally
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Your order is made right here at the event.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  local_mall
                </span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                4. Pick it up
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get a notification when your item is ready.
              </p>
            </div>
          </div>
          <div className="text-center pt-8">
            <a
              className="text-primary font-bold text-sm hover:underline"
              href="https://makelocal.eu"
            >
              See the full flow
            </a>
          </div>
        </div>
        <div className="h-5" />
      </main>
    </div>
  );
}
