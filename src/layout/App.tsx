import Footer from "@/components/ui/shared/Footer";
import Navbar from "@/components/ui/shared/Navbar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default App;
