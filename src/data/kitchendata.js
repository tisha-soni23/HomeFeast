// Sample data. Replace `image` with your own photos (e.g. "/images/meera.jpg").
export const kitchens = [
  {
    id: "anita",
    name: "Anita's Ghar Ka Khana",
    cook: "Anita Sharma",
    cuisine: "North Indian",
    rating: 4.9,
    reviews: 126,
    veg: true,
    tag: "Weekly",
    blurb: "Dal tadka, jeera rice & phulka",
    about:
      "Comforting North Indian meals cooked fresh every morning with seasonal produce and home-ground masalas.",
    time: "25–35 min",
    distance: "1.2 km",
    delivers: "Delivers within 4 km",
    days: "Mon–Sat",
    from: 89,
    image: "/images/kitchens/anita.jpg",
    menu: [
      { name: "Everyday thali", desc: "Dal, sabzi, 4 phulkas, rice & salad", price: 119 },
      { name: "Mini tiffin", desc: "Dal, sabzi, 3 phulkas & salad", price: 89 },
      { name: "Rajma chawal bowl", desc: "Slow-cooked rajma, rice & onion salad", price: 109 },
    ],
  },
  {
    id: "meera",
    name: "Meera's South Kitchen",
    cook: "Meera Iyer",
    cuisine: "South Indian",
    rating: 4.8,
    reviews: 98,
    veg: true,
    tag: "Weekly",
    blurb: "Sambar rice, poriyal & curd",
    about:
      "Traditional South Indian lunches with fresh coconut chutneys and filter-coffee-strong mornings.",
    time: "30–40 min",
    distance: "2.1 km",
    delivers: "Delivers within 5 km",
    days: "Mon–Sat",
    from: 99,
    image: "/images/kitchens/meera.jpg",
    menu: [
      { name: "Sambar rice meal", desc: "Sambar rice, poriyal & curd", price: 99 },
      { name: "Curd rice combo", desc: "Curd rice, pickle & vadam", price: 89 },
      { name: "Mini idli set", desc: "6 idlis, sambar & two chutneys", price: 109 },
    ],
  },
  {
    id: "kavita",
    name: "Kavita's Thali House",
    cook: "Kavita Shah",
    cuisine: "Gujarati",
    rating: 4.7,
    reviews: 74,
    veg: true,
    tag: "Monthly",
    blurb: "Rotli, shaak, dal-bhat & kadhi",
    about:
      "Homestyle Gujarati thalis with a little sweetness, a little spice and a lot of ghee.",
    time: "30–40 min",
    distance: "1.8 km",
    delivers: "Delivers within 4 km",
    days: "Mon–Sun",
    from: 109,
    image: "/images/kitchens/kavita.jpg",
    menu: [
      { name: "Gujarati thali", desc: "Rotli, shaak, dal-bhat, kadhi & farsan", price: 129 },
      { name: "Light thali", desc: "Rotli, shaak, khichdi & kadhi", price: 109 },
    ],
  },
];

export const plans = [
  { id: "one", name: "One meal", desc: "Try a fresh meal today", meals: 1, save: 0 },
  { id: "weekly", name: "Weekly", desc: "5 meals, Monday to Friday", meals: 5, save: 8 },
  { id: "monthly", name: "Monthly", desc: "22 meals with pause anytime", meals: 22, save: 15 },
];

export const calcTotal = (price, plan) =>
  Math.round(price * plan.meals * (1 - plan.save / 100));