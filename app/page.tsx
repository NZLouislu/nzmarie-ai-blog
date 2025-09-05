import Navbar from "@/components/Navbar";
import HomePage from "@/components/Home";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function Page() {
  return (
    <div className="w-full mx-auto max-w-[1200px]">
      <GoogleAnalytics />
      <Navbar />
      <Banner />
      <HomePage />
      <Footer />
    </div>
  );
}
