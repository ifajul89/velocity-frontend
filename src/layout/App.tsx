import Navbar from "@/components/ui/shared/Navbar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-16">
        <Outlet />
      </div>
    </>
  );
};

export default App;
