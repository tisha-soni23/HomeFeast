import Herosection from "./sections/herosection"
import Navbar from "./sections/navbar";
import ExploreMeals from "./sections/explore";
import WhyHomeFeast from "./sections/why";
import TrustBar from "./sections/Trustbar";
import BecomeCook from "./sections/becomecook";
import HowItWorks from "./sections/how";
import PlatformSection from "./sections/platform";
import Footer from "./sections/footer";
import Login from "./sections/login";
const App=()=> {
  return (
    <div className="min-h-screen  ">
      <Navbar/>
      <Herosection/> 
      <ExploreMeals/>
      <TrustBar/>
      <WhyHomeFeast/>
      <BecomeCook/>
      <HowItWorks/>
      <PlatformSection/>
      <Footer/>

    </div>
  )
}

export default App

