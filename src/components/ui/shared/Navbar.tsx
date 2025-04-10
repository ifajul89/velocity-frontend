import { currentUser, logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";
import VelocityLogo from "@/assets/velocity-logo.png";
import { Button } from "../button";

const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/products", name: "All Products" },
    { path: "/about", name: "About Us" },
    { path: "/contact", name: "Contact Us" },
  ];

  // user
  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  // user

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Successful log out", { duration: 1000 });
  };

  // Hide/Show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close desktop menu when clicking outside
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(null);
      }

      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleDropdown = (index: number) => {
    setMenuOpen(menuOpen === index ? null : index); // Toggle the menu
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white shadow-md transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container flex items-center justify-between py-2.5 lg:px-0">
        <Link to="/" className="flex w-1/3 items-end">
          <img className="w-8" src={VelocityLogo} alt="velocity-logo" />{" "}
          <span className="text-velo-black border-velo-maroon -ml-1 border-b-2 text-xl font-semibold">
            elocity.
          </span>
        </Link>

        {/* Large Device Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`border-b-2 px-0.5 text-base text-[16px] duration-300 ${
                location.pathname === item.path
                  ? "text-velo-red border-velo-red"
                  : "hover:border-velo-red text-velo-black hover:text-velo-red border-transparent"
              }`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex w-1/3 justify-end">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => toggleDropdown(0)} // Use index to toggle specific dropdown
                className="rounded- bg-sky-600 px-4 py-2 text-white"
              >
                Dashboard
              </Button>
              {menuOpen === 0 && (
                <ul className="animate-slide-down absolute right-0 mt-2 w-40 space-y-2 rounded bg-sky-100 p-2 shadow-lg">
                  <li>
                    <Link
                      to="/dashboard"
                      className="block rounded px-3 py-2 hover:bg-sky-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded px-3 py-2 text-left hover:bg-sky-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button className="!bg-velo-red hover:!bg-velo-maroon h-11 w-22">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="">
                <Button className="!bg-velo-black h-11 w-24 hover:!bg-black">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="relative lg:hidden" ref={mobileDropdownRef}>
          <button
            onClick={toggleMobileMenu}
            className="rounded bg-gray-100 p-2 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {mobileMenuOpen && (
            <div className="animate-slide-down absolute right-0 z-50 mt-2 w-48 space-y-2 rounded bg-white p-4 shadow-lg">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={`block rounded px-3 py-2 text-sm ${
                    location.pathname === item.path
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-purple-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={toggleMobileMenu}
                    className="block rounded px-3 py-2 text-sm hover:bg-purple-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-purple-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="block rounded px-3 py-2 text-sm hover:bg-purple-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="block rounded px-3 py-2 text-sm hover:bg-purple-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
