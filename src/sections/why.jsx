import { FiMapPin, FiCalendar, FiHeart } from "react-icons/fi";

function WhyHomeFeast() {
  return (
    <section className="w-full bg-[#FFFCF7] px-6 py-20 sm:px-10 lg:px-16 lg:py-24" id="why-homefeast">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.5fr_1fr] lg:gap-12">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C94B16]">
              Why HomeFeast
            </p>
          </div>

          <div>
            <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-[#32190F] sm:text-5xl">
              Good food should
              <br className="hidden sm:block" /> feel familiar.
            </h2>
          </div>

          <div>
            <p className="max-w-md text-lg leading-8 text-[#80634F] sm:text-xl">
              Skip expensive, repetitive takeout. Enjoy honest homemade meals
              from cooks in your neighbourhood.
            </p>
          </div>

        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Card 1 */}
          <div className="relative flex min-h-100 flex-col rounded-[36px] border border-[#EBDCC8] bg-[#FFF9F0] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10">

            <div className="flex items-start justify-between">
              <div className="flex h-18.5 w-18.5 items-center justify-center rounded-3xl bg-[#FBDD9B] text-[#873C1D]">
                <FiMapPin className="text-3xl" />
              </div>

              <span className="text-base font-semibold text-[#B49A85]">
                01
              </span>
            </div>

            <div className="mt-auto pt-12">
              <h3 className="mb-5 font-serif text-3xl font-semibold text-[#32190F]">
                Truly local
              </h3>

              <p className="text-lg leading-[1.65] text-[#80634F]">
                Discover verified home cooks delivering right around your
                neighbourhood.
              </p>
            </div>

          </div>

          {/* Card 2 */}
          <div className="relative flex min-h-100 flex-col rounded-[36px] border border-[#EBDCC8] bg-[#FFF9F0] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10">

            <div className="flex items-start justify-between">
              <div className="flex h-18.5 w-18.5 items-center justify-center rounded-3xl bg-[#FBDD9B] text-[#873C1D]">
                <FiCalendar className="text-3xl" />
              </div>

              <span className="text-base font-semibold text-[#B49A85]">
                02
              </span>
            </div>

            <div className="mt-auto pt-12">
              <h3 className="mb-5 font-serif text-3xl font-semibold text-[#32190F]">
                Plans that bend
              </h3>

              <p className="text-lg leading-[1.65] text-[#80634F]">
                Order once or subscribe. Pause, skip, or change your meals
                anytime.
              </p>
            </div>

          </div>

          {/* Card 3 */}
          <div className="relative flex min-h-100 flex-col rounded-[36px] border border-[#EBDCC8] bg-[#FFF9F0] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10">

            <div className="flex items-start justify-between">
              <div className="flex h-18.5 w-18.5 items-center justify-center rounded-3xl bg-[#FBDD9B] text-[#873C1D]">
                <FiHeart className="text-3xl" />
              </div>

              <span className="text-base font-semibold text-[#B49A85]">
                03
              </span>
            </div>

            <div className="mt-auto pt-12">
              <h3 className="mb-5 font-serif text-3xl font-semibold text-[#32190F]">
                Made with care
              </h3>

              <p className="text-lg leading-[1.65] text-[#80634F]">
                Fresh, hygienic food prepared in small batches with honest
                ingredients.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyHomeFeast;