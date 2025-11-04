export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <div className="flex size-12 shrink-0 items-center justify-start text-primary">
            <span className="material-symbols-outlined text-3xl">widgets</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
            MakeLocal
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button
              type="button"
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
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
                  Browse products, personalize items, and place demo orders to see local
                  manufacturing in action.
                </h2>
              </div>
              <div className="flex-wrap gap-3 flex">
                <button
                  type="button"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Browse catalog</span>
                </button>
                <button
                  type="button"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-slate-100/20 dark:bg-slate-700/50 backdrop-blur-sm text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Talk to us at Booth TBD</span>
                </button>
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
        <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
          {/* Product Card 1 */}
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
            <div
              className="w-full bg-slate-200 dark:bg-slate-800 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1zIiFTYILQo9DfolBTX5QYmeSEvZKZcxYMvl79vHQkveIMCoZLFL5iGXLzlyKQpeQRVLPJE6pGtC_kC5F9JqGRAhHhdLO26VUTzc9NVuUEXqO4asLmsSkwSKGD2m_vyFzNKS7a1dotnzpRpF6kv166cr40M9dUy3F4GZddhrPjNwNgY3EORhUEUqIsivX7R3dkRMbBlL0qGUDginDlwGdTLPLe-LOqi3sQkofE46EST5y6LzV1OXL5XiOsdly4IX32gpTRnzsZ78")',
              }}
            />
            <div className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Keychain
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                A stylish and durable keychain, personalized with your initials.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  ~20 min print
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  PLA
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="size-6 rounded-full bg-red-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-blue-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-green-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="flex-1 ml-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Personalize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 2 */}
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
            <div
              className="w-full bg-slate-200 dark:bg-slate-800 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3Hry-59iye7wPvbPDW8_QapMbVQIGmZ7BSp3HzEgiO2l3l0hKgFeiMWlC4l-FJCHl5f2vNG6MJGksd3bWZNB_W5zBuyPTVrQ3i_MZ-Z1FE5EgDXgmUFT6aVE_kmy0AIBv3uQSWrYxEkiWqnF5J7nSGX-H0Qwa_Zzix3NyiWSqUP7mwshXAQus00bofIfXsy7jEj4enJ8B5mDI2HxYXkYsl_BGa7UIfhkJs5vL8xaihSfK8y9iXZxYJGdK28NI3HzT7BfGixM-Y9Y")',
              }}
            />
            <div className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Desk Organizer
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                Keep your desk tidy and efficient with this compact organizer.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  ~30 min print
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  PLA
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="size-6 rounded-full bg-gray-800 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-white border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-yellow-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="flex-1 ml-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Personalize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 3 */}
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
            <div
              className="w-full bg-slate-200 dark:bg-slate-800 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBI5NJQyP2Cu_cgmHZ8Sydkvcmr0Am8VHiQBDYawZmo5s0Bcye6XNPcEYwSetyqUAaMkKVDGShzrTIzmJ6jEPRcTa0ORLDab3BbudiEFRCTpAv1Nn4eA-_rOq7VRiq9VOwJ7u30MxcdX8qFXF2yBviALT9vQvN2J5kvDgYBvho7vFtx7j9yW7bNNABNbz-_qXCXRLJBo3VZAstKS1FTtn_R8Cyca5lCGjsfGthqpXzTi1EltubUu_wqEBGAXnHhkd-23JQq-Js1Bzg")',
              }}
            />
            <div className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Phone Stand
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                A modern stand for any smartphone, perfect for your desk.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  ~25 min print
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  PLA
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="size-6 rounded-full bg-purple-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-pink-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-orange-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="flex-1 ml-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Personalize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 4 */}
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none">
            <div
              className="w-full bg-slate-200 dark:bg-slate-800 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUtcFatZTitM2kxUzX3qtoiBss05kGiBbTg_JtfIzlP2TP7xkAJtm2ABw5xjdVs7xI1aYOWro1snyNPPPs1U8Ka1JQK0NgiNBXmI72zkbXBLq3EaCK-tZ51dWIhCxy5ayxPKdMc9B7ctP5B9v8sd59tpI9_IANFk-bgtA8dv_h4fptiWaXSqXd0Eend2XKhPTkRFYPnyqsaWesZYCgX3dFGc73vCSYHj5eH8uFntI5FMwjVDKQ3Zu3GdXDlHOcFK9JFCHlf8bfmHY")',
              }}
            />
            <div className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">
                Cable Clip
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                Manage your cables with ease and keep your space organized.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  ~15 min print
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                  PLA
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="size-6 rounded-full bg-teal-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-indigo-500 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="size-6 rounded-full bg-gray-400 border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                />
                <button
                  type="button"
                  className="flex-1 ml-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary/20 text-primary text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Personalize</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* "How It Works" Section */}
        <div className="px-4 py-10">
          <h2 className="text-slate-900 dark:text-white text-center text-[22px] font-bold leading-tight tracking-[-0.015em] pb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">store</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">1. Choose a product</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Browse our catalog of useful and fun items.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">palette</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">2. Personalize it</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Pick your colors and add your own text or logo.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center size-16 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">print</span>
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
                <span className="material-symbols-outlined text-3xl">local_mall</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">4. Pick it up</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get a notification when your item is ready.
              </p>
            </div>
          </div>
          <div className="text-center pt-8">
            <a
              className="text-primary font-bold text-sm hover:underline"
              href="#"
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
