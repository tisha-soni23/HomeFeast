import { GiHotMeal } from "react-icons/gi";
export default function Footer() {
  return (
    <footer className="w-full bg-[#32190F] px-6 py-12 text-[#FFF5E8] sm:px-10 lg:px-[5%]">
      <div className="mx-auto flex max-w-350 flex-col justify-between gap-8 md:flex-row md:items-center">

        {/* Logo and Tagline */}
        <div className="shrink-0">
          <div >
            {/* Logo */}
            <a href="home" className="mb-4 flex items-center gap-4"><GiHotMeal className='w-10 h-10'/>

            <span className=" mt-4 text-xl font-semibold tracking-tight">
              HomeFeast
            </span></a>
          </div>

          {/* Tagline */}
          <p className="font-serif text-lg font-semibold">
            Home is only a meal away.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center gap-x-9 gap-y-4 text-base sm:text-lg">
          <a
            href="#meals"
            className="transition-colors duration-200 hover:text-[#F9C85E]"
          >
            Browse meals
          </a>

          <a
            href="#For-cooks"
            className="transition-colors duration-200 hover:text-[#F9C85E]"
          >
            Become a cook
          </a>

          <a
            href="#how-it-works"
            className="transition-colors duration-200 hover:text-[#F9C85E]"
          >
            How it works
          </a>
        </nav>

        {/* Description */}
        <p className="max-w-[320px] text-base leading-7 text-[#FFF5E8] md:text-right">
          Made for students, professionals, and home cooks.
        </p>

      </div>
    </footer>
  );
}