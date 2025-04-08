import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { path: "/", name: "Home" },
    { path: "*", name: "All Products" },
    { path: "*", name: "About Us" },
    { path: "*", name: "Contact Us" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-10 w-full bg-white shadow-md">
      <div className="relative container mx-auto px-4 lg:px-0">
        <div className="flex h-16 items-center justify-between">
          <Link
            className="bg-gradient-to-r from-purple-600 via-purple-400 to-purple-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl"
            to={"/"}
          >
            Velocity
          </Link>

          <div className="hidden lg:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-2">
                {navLinks.map((items) => (
                  <li key={items?.path}>
                    <NavLink
                      to={items?.path}
                      className={`px-4 py-2 rounded-lg text-base text-gray-800 transition ${location?.pathname === items.path && "bg-purple-600 font-medium text-white"}`}
                    >
                      {" "}
                      {items?.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                to={"/login"}
              >
                Login
              </Link>

              <div className="hidden sm:flex">
                <Link
                  to={"/register"}
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-purple-600"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="block lg:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            {open && (
              <div className="absolute top-[70px] right-5 flex w-[170px] flex-col gap-2 rounded-lg bg-white p-3 shadow-2xl lg:hidden">
                {navLinks.map((items) => (
                  <Link
                    onClick={() => setOpen(!open)}
                    className={` ${location.pathname === items.path && "bg-purple-600 text-white"} rounded-md px-3 py-1.5 hover:bg-purple-500 hover:text-white`}
                    to={items.path}
                  >
                    {items.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;