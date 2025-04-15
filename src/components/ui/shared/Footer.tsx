import { Link } from "react-router";
import VelocityLogo from "@/assets/velocity-logo.png";

const Footer = () => {
  return (
    <footer className="bg-velo-black text-velo-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex w-full lg:w-1/5">
              <img
                className="w-6 md:w-10"
                src={VelocityLogo}
                alt="velocity-logo"
              />{" "}
              <span className="border-velo-maroon -ml-0.5 border-b-2 font-semibold text-white md:text-2xl">
                elocity.
              </span>
            </Link>

            <p className="text-velo-gray mt-6 text-sm md:text-base">
              Discover a curated selection of high-end vehicles from top-tier
              dealers and private collectors. Whether you're acquiring your next
              luxury car or showcasing your prized model, experience an elevated
              standard of automotive excellence.
            </p>
          </div>

          <div className="col-span-2 flex w-full flex-wrap justify-between gap-5">
            <div className="text-left">
              <p className="text-lg font-medium text-gray-200">About Us</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    Company History
                  </a>
                </li>

                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    Meet the Team
                  </a>
                </li>

                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    Employee Handbook
                  </a>
                </li>

                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    {" "}
                    Careers{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-left">
              <p className="text-lg font-medium text-gray-200">Helpful Links</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    {" "}
                    FAQs{" "}
                  </a>
                </li>

                <li>
                  <a
                    className="text-velo-gray hover:text-velo-red transition"
                    href="#"
                  >
                    {" "}
                    Support{" "}
                  </a>
                </li>

                <li className="flex justify-start">
                  <a
                    className="group flex gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#"
                  >
                    <span className="text-velo-gray group-hover:text-velo-red transition">
                      Live Chat
                    </span>

                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-teal-500"></span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="">
              <p className="text-lg font-medium text-gray-200">Contact Us</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li className="">
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>

                    <span className="text-velo-gray flex-1">
                      velocity@mail.com
                    </span>
                  </a>
                </li>

                <li className="">
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>

                    <span className="text-velo-gray flex-1">0148456089</span>
                  </a>
                </li>
                <li className="flex">
                  <a
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>

                    <span className="text-velo-gray flex-1">
                      314 Uttara, Dhaka, Bangladesh
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-velo-gray h-[0.1px] w-full" />
      <p className="pt-2 pb-2.5 text-center font-semibold">
        <small>
          © {new Date().getFullYear()} Velocity. All rights reserved.
        </small>
      </p>
    </footer>
  );
};

export default Footer;
