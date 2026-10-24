import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import image from "../assets/image.png"
import { FaArrowRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Dashboard from "./dashboard";
const messages = [
  "Missing Ghar Ka Khana?",
  "We've Got You Covered!",
  "Book Your Meal Today From",
  "HomeFeast",
];
const Herosection = () => {
   const [index, setIndex] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  useEffect(() => {
  document.body.style.overflow = showDashboard ? "hidden" : "";
  return () => {
    document.body.style.overflow = "";
  };
}, [showDashboard]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (

   <section id="home">
    
  <div className='relative min-h-screen bg-orange-100'>
    <img className="w-screen h-screen object-cover" src={image} alt="loading"></img>
  </div>
   <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">

        {/* Small Badge */}
        <span className="mb-6 rounded-full border border-[#E8C98B] bg-[#FFE5AE] px-6 py-3 text-sm font-bold tracking-[0.2em] text-[#4A2415]">
          HOMEMADE, EVERY DAY
        </span>

        {/* Main Heading */}
         <AnimatePresence mode="wait">
        <motion.h1
          key={messages[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="font-serif text-4xl font-semibold leading-tight text-[#4A1F0C] sm:text-5xl md:text-5xl"
        >
          {messages[index]}
        </motion.h1>
      </AnimatePresence>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3F200F] sm:text-xl md:text-2xl">
          Wholesome tiffins from local home cooks,
          <br className="hidden sm:block" />
          delivered with the comfort of home.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">

          <a
            href="#meals"
            className="flex items-center gap-5 rounded-full bg-[#7A2E10] px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-[#5F230B]"
          >
            Explore meals
            <FaArrowRight className="text-base" />
          </a>

          <a onClick={() => setShowDashboard(true)}
            href="#how-it-works"
            className="rounded-full border border-[#E5C38D] bg-[#FFE2AA] px-6 py-4 text-lg font-bold text-[#542B18] transition-all duration-300 hover:bg-[#FFF0D0]"
          >
            Join as a cook
          </a>

        </div>

      </div>
      <motion.div 
      animate={{ y: [0, -6, 0] }}
      transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
     }}
      className="absolute bottom-8 right-10 z-40 flex items-center md:gap-3 gap-1 rounded-full  md:rounded-3xl bg-[#FFF7E9] px-3 py-2 md:px-6 md:py-4 shadow-lg sm:right-8">

      {/* Green Status Indicator */}
      <div className="flex h-4 w-4 md:h-6 md:w-6 shrink-0 items-center justify-center rounded-full bg-[#DCE8D1]">
        <span className=" h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#4F8045]"></span>
      </div>

      {/* Popup Text */}
      <div>
        <h3 className="md:text-lg text-sm font-bold leading-tight text-[#66351F]">
          Fresh today
        </h3>

        <p className=" hidden sm:block mt-1 text-base leading-tight text-[#75452E]">
          Cooked in small batches
        </p>
      </div>
  
   </motion.div>
    <div className="absolute bottom-8 left-10 z-40 flex items-center gap-3 rounded-3xl bg-[#FFF7E9] px-6 py-4 shadow-lg sm:left-8">
     
      {/* Popup Text */}
      <div>
        <div className='flex gap-1 items-center'>
        <h3 className=" text sm text-lg font-bold leading-tight text-[#66351F]">
        4.8
        </h3>
        <FaStar className='mt-1 text-xs text-amber-400'/>
        </div>

        <p className=" hidden sm:block mt-1 text-base leading-tight text-[#75452E]">
         15000+ Happy users
        </p>
      </div>
  
    </div>
    </div>
    {showDashboard && (
            <Dashboard name="Aditi" initialRole="Cook" onClose={() => setShowDashboard(false)} />
          )}
   </section>
  )
}

export default Herosection