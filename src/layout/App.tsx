import Navbar from "@/components/ui/shared/Navbar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="mt-12 md:mt-14 lg:mt-16">
        <Outlet />
      </div>
    </>
  );
};

export default App;
