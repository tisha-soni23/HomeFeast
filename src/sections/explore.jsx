import { useMemo, useState } from "react";
import meals from "../data/meals";
import {FiSearch,FiHeart,FiChevronDown,} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import MealDetail from "./Mealdetail";
import Dashboard from "./dashboard";
import { useFavorites, toggleFavorite } from "./favorite";
export default function ExploreMeals() {
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("All");
  const [plan, setPlan] = useState("Weekly");
  const [sortBy, setSortBy] = useState("Recommended");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const favorites = useFavorites();
  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const filteredMeals = useMemo(() => {
    let result = meals.filter((meal) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        meal.name.toLowerCase().includes(query) ||
        meal.cook.toLowerCase().includes(query) ||
        meal.cuisine.toLowerCase().includes(query) ||
        meal.description.toLowerCase().includes(query) ||
        meal.location.toLowerCase().includes(query);

      const matchesType =
        mealType === "All" || meal.type === mealType;

      const matchesPlan =
        plan === "All Plans" || meal.plan === plan;

      return matchesSearch && matchesType && matchesPlan;
    });

    if (sortBy === "Highest Rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    return result;
  }, [search, mealType, plan, sortBy]);

 

  return (
    <section
      className="min-h-screen bg-[#FFF9F0] px-5 py-10 text-[#32190F] sm:px-8 lg:px-[5.2%] lg:py-12"
    id="meals">
      <div className="mx-auto max-w-360">

        {/* Heading Section */}
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.25em] text-[#C94B16]">
              Near Koramangala, Bengaluru
            </p>

            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[72px]">
              What feels like home
              <br className="hidden sm:block" /> today?
            </h1>
          </div>

          <div className="md:col-span-4 md:pl-5">
            <p className="max-w-sm text-lg leading-[1.8] text-[#80634F] sm:text-xl">
              Verified local cooks, transparent menus, and flexible
              plans for every kind of day.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-9 flex flex-col gap-4 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7] p-4 shadow-[0_15px_45px_rgba(70,40,20,0.04)] lg:flex-row lg:items-center lg:gap-3 lg:px-8 lg:py-5">

          {/* Search Input */}
          <div className="flex min-w-0 flex-1 items-center gap-4 px-2">
            <FiSearch className="shrink-0 text-2xl text-[#A58B77]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search cooks, dishes, or cuisines"
              aria-label="Search cooks, dishes, or cuisines"
              className="w-full bg-transparent py-3 text-lg text-[#32190F] outline-none placeholder:text-[#A58B77] sm:text-xl"
            />
          </div>

          {/* Meal Type Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Veg", "Non-Veg"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`whitespace-nowrap rounded-full border px-5 py-4 text-sm font-semibold transition-colors sm:text-base ${
                  mealType === type
                    ? "border-[#F28A3C] bg-[#FFF0D8] text-[#873C1D]"
                    : "border-[#EBDCC8] bg-[#FFFCF7] text-[#32190F] hover:bg-[#FFF3E2]"
                }`}
              >
                {type === "Veg" && (
                  <span className="mr-2 inline-flex h-3 w-3 items-center justify-center rounded-[3px] border border-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-700" />
                  </span>
                )}

                {type === "Non-Veg" && (
                  <span className="mr-2 inline-flex h-3 w-3 items-center justify-center rounded-[3px] border border-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  </span>
                )}

                {type}
              </button>
            ))}
          </div>

          {/* Subscription Plan Filter */}
          <div className="relative shrink-0">
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              aria-label="Filter by meal plan"
              className="w-full cursor-pointer appearance-none rounded-full border border-[#EBDCC8] bg-[#FFFCF7] py-4 pl-6 pr-12 text-base font-semibold outline-none transition hover:bg-[#FFF3E2] focus:border-[#F28A3C] lg:min-w-46.25"
            >
              <option value="All Plans">All Plans</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            <FiChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[#80634F] sm:text-base">
          <p>
            {filteredMeals.length} trusted home{" "}
            {filteredMeals.length === 1 ? "kitchen" : "kitchens"} found
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-meals">Sorted by</label>

            <select
              id="sort-meals"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="cursor-pointer bg-transparent font-medium text-[#80634F] outline-none"
            >
              <option value="Recommended">Recommended</option>
              <option value="Highest Rated">Highest rated</option>
              <option value="Price: Low to High">Price: low to high</option>
            </select>
          </div>
        </div>
        {/* Meal Cards */}
    {filteredMeals.length > 0 ? (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

    {filteredMeals.map((meal) => (
      <article
        key={meal.id}
        className="group overflow-hidden rounded-[30px] border border-[#EBDCC8] bg-[#FFFCF7] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,40,20,0.08)]"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden sm:h-64">
          <img
            src={meal.image}
            alt={meal.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Meal Type Badge */}
          <span className="absolute bottom-4 left-4 rounded-full bg-[#FFFCF7] px-4 py-2 text-sm font-semibold text-[#34764B]">
            {meal.type}
          </span>

          {/* Favorite Button */}
          <button
  type="button"
  onClick={() => toggleFavorite(meal)}
  aria-label={isFavorite(meal.id) ? "Remove from favorites" : "Add to favorites"}
  aria-pressed={isFavorite(meal.id)}
  className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
    isFavorite(meal.id)
      ? "bg-[#C94B16] text-white"
      : "bg-[#FFFCF7] text-[#713014]"
  }`}
>
  <FiHeart className={`text-xl ${isFavorite(meal.id) ? "fill-current" : ""}`} />
</button>
            
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Meal Name and Rating */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="font-serif text-xl font-semibold leading-snug text-[#32190F]">
              {meal.name}
            </h2>

            <div className="flex shrink-0 items-center gap-1 pt-1 font-semibold text-[#873C1D]">
              <FaStar className="text-[#D58A28]" />
              <span>{meal.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Cook Name */}
          <p className="mb-4 text-sm text-[#A58B77]">
            by {meal.cook}
          </p>

          {/* Food Description */}
          <p className="mb-4 text-sm leading-relaxed text-[#80634F]">
            {meal.description}
          </p>

          {/* Cuisine, Preparation Time and Distance */}
          <div className="mb-5 flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs text-[#80634F]">
            <div className=" flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{meal.cuisine}</span>
            <span>·</span>
            <span>{meal.prepTime}</span>
            <span>·</span>
            <span>{meal.distance}</span>
            </div>
            <div>
            <span className="rounded-full bg-[#FFF0D8] px-3 py-2 text-xs font-medium text-[#873C1D]">
              {meal.plan}
            </span>
            </div>
          </div>
          

          {/* Price and Plan */}
          <div className="mb-5 border-t border-[#EBDCC8] pt-4">
            <div className=" flex justify-between">
              <div>
              <span className="text-sm text-[#80634F]">From </span>
              <span className="text-xl font-bold text-[#32190F]">
                ₹{meal.price}
              </span>
              <span className="ml-1 text-xs text-[#80634F]">
                / meal
              </span>
              </div>
              <div></div>

            <button
            type="button"
            onClick={() => setSelectedMeal(meal)}
            className="rounded-full bg-[#713014] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#873C1D] focus:outline-none focus:ring-2 focus:ring-[#C94B16] focus:ring-offset-2"
          >
            View Menu →
          </button>
            </div>       
          </div> 
        </div>
      </article>
    ))}
  </div>
) : (
  <div className="rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7] px-6 py-16 text-center">
    <h2 className="mb-3 font-serif text-3xl font-semibold text-[#32190F]">
      No kitchens found
    </h2>

    <p className="mb-6 text-[#80634F]">
      Try changing your search or meal filters.
    </p>

    <button
      type="button"
      onClick={() => {
        setSearch("");
        setMealType("All");
        setPlan("All Plans");
      }}
      className="rounded-full bg-[#713014] px-6 py-3 font-semibold text-white hover:bg-[#873C1D]"
    >
      Clear filters
    </button>
  </div>
)}             
      </div> 
            {selectedMeal && (
        <MealDetail
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onTrack={() => setShowDashboard(true)}
        />
      )}
      {showDashboard && (
  <Dashboard name="Aditi" onClose={() => setShowDashboard(false)} />
)}
    </section>
    
    
  );
}