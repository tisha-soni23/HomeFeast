import { FiMapPin, FiCalendar, FiShoppingBag } from "react-icons/fi";

function HowItWorks() {
  return (
    <section className="w-full bg-[#F9C95E] px-6 py-20 sm:px-10 lg:px-16 lg:py-28" id="how-it-works">
      <div className="mx-auto max-w-6xl">

        {/* Section Heading */}
        <div className="mb-20 text-center">
          <p className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-[#C94B16]">
            Simple from the start
          </p>

          <h2 className="font-serif text-5xl font-semibold tracking-tight text-[#65280F] sm:text-6xl lg:text-7xl">
            Pick. Plan. Enjoy.
          </h2>
        </div>

        {/* Three Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3">

          {/* Step 1 */}
          <div className="px-6 py-8 md:border-r md:border-[#D8A94D] md:px-10 md:py-0">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[#65280F]">
                <FiMapPin className="text-4xl" />
              </div>

              <span className="text-base font-semibold text-[#AD7B36]">
                01
              </span>
            </div>

            <h3 className="mb-5 font-serif text-2xl font-semibold text-[#65280F] sm:text-3xl">
              Find your cook
            </h3>

            <p className="max-w-xs text-base leading-8 text-[#80502C] sm:text-lg">
              Explore trusted kitchens nearby and read real customer reviews.
            </p>
          </div>

          {/* Step 2 */}
          <div className="px-6 py-8 md:border-r md:border-[#D8A94D] md:px-10 md:py-0">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[#65280F]">
                <FiCalendar className="text-4xl" />
              </div>

              <span className="text-base font-semibold text-[#AD7B36]">
                02
              </span>
            </div>

            <h3 className="mb-5 font-serif text-2xl font-semibold text-[#65280F] sm:text-3xl">
              Choose your plan
            </h3>

            <p className="max-w-xs text-base leading-8 text-[#80502C] sm:text-lg">
              Pick a single meal, weekly routine, or monthly subscription.
            </p>
          </div>

          {/* Step 3 */}
          <div className="px-6 py-8 md:px-10 md:py-0">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[#65280F]">
                <FiShoppingBag className="text-4xl" />
              </div>

              <span className="text-base font-semibold text-[#AD7B36]">
                03
              </span>
            </div>

            <h3 className="mb-5 font-serif text-2xl font-semibold text-[#65280F] sm:text-3xl">
              Enjoy every bite
            </h3>

            <p className="max-w-xs text-base leading-8 text-[#80502C] sm:text-lg">
              Get fresh meals in your selected delivery window, without the
              daily hassle.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;