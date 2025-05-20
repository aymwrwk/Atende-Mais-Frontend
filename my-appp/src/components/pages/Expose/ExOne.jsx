import './style.css';

export default function Example() {
  return (
    <div className="relative overflow-hidden background-image">
      <div className="pb-40 pt-16 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-md">
            <h1 className="text-4xl py-3 font-bold tracking-tight text-gray-900 sm:text-5xl">
              A Revolução Digital na Gestão de Pedidos.
            </h1>
            <p className="mt-4 text-lg text-gray-500">
               Otimize suas operações e veja seus pedidos fluírem como nunca antes! Invista agora no nosso sistema e impulsione sua eficiência.
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-6xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-4 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-4">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                      <div className="h-40 w-28 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-40 w-28 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/login"
                className="inline-block mt-6 rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-center font-medium text-white hover:bg-indigo-700"
              >
                Conhecer Planos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
