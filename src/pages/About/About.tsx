import About1 from "@/assets/about-us/about1.jpg";
import About2 from "@/assets/about-us/about2.jpg";
import { PiArrowDownRightBold } from "react-icons/pi";
import CEO from "@/assets/about-us/ceo.jpg";
import React from "react";

const teamData = [
  {
    name: "Conor McGregor",
    image:
      "https://i2-prod.dublinlive.ie/news/celebs/article25659946.ece/ALTERNATES/s1200c/2_conor-mcgregor.jpg",
    designation: "CTO & Retired CFO",
    description:
      "Over a decade of experience in automotive tech and dealership growth.",
  },
  {
    name: "Ava Martinez",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    designation: "Chief Marketing Officer",
    description:
      "Led marketing teams in top-tier car dealerships across the U.S. and Europe",
  },
  {
    name: "Derek Johnson",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    designation: "Head of Sales",
    description:
      "15+ years in dealership sales and customer experience leadership.",
  },
  {
    name: "Sophie Lee",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    designation: "Operations Manager",
    description:
      "Streamlined operations in multi-location car dealerships nationwide.",
  },
];

interface TeamCardProps {
  image: string;
  name: string;
  designation: string;
  description: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  image,
  name,
  designation,
  description,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1 rounded-2xl bg-white px-5 py-10 text-center">
      <img
        className="size-[150px] rounded-full border-[6px]"
        src={image}
        alt="team-image"
      />
      <h5 className="mt-5 text-lg font-semibold">{name}</h5>
      <h6 className="text-velo-red">{designation}</h6>
      <div className="my-3 h-[1px] w-4/5 bg-gray-200" />
      <p className="text-[16.5px] font-light text-gray-600">{description}</p>
    </div>
  );
};

const About = () => {
  return (
    <section>
      <div className="container">
        <div className="mx-auto flex items-end justify-center gap-8 py-20">
          <div className="pb-5">
            <h4 className="text-velo-red mb-3 text-xl font-semibold">
              We are Velocity
            </h4>
            <h3 className="w-max text-5xl leading-[50px] font-[600]">
              Quality cars, trusted service,
              <br />
              <span className="text-gray-500">
                reliability, and performance
              </span>
            </h3>
          </div>
          <p className="w-80 text-gray-400">
            Velocity is your trusted destination for quality cars, seamless
            service, and a drive towards excellence
          </p>
        </div>
        <div className="flex items-center gap-5">
          <img
            className="h-[400px] w-2/3 rounded-2xl object-cover"
            src={About1}
            alt=""
          />
          <img
            className="h-[400px] w-1/3 rounded-2xl object-cover"
            src={About2}
            alt=""
          />
        </div>

        <div className="my-20 grid grid-cols-2">
          <h3 className="flex pl-44 text-5xl font-semibold">
            Our Story <PiArrowDownRightBold className="mt-2" />
          </h3>

          <div className="space-y-4 font-[400] text-gray-700">
            <p className="text-velo-black text-[16.1px] font-medium">
              Velocity started with a simple idea: to make car buying better.
              Frustrated by the traditional dealership experience, we set out to
              create a space where quality, transparency, and trust are the
              foundation—not the exception. What began as a small team of
              passionate car lovers quickly grew into a trusted destination for
              drivers seeking more than just a vehicle.
            </p>

            <p className="pt-3">
              We carefully curate every car in our collection, ensuring it meets
              our high standards of performance, reliability, and design.
              Whether you're buying your first car or upgrading to your dream
              ride, we're here to guide you every step of the way—with honest
              advice, fair pricing, and zero pressure.
            </p>

            <p>
              At Velocity, we believe your car should match your lifestyle and
              your expectations. That's why we're committed to delivering a
              seamless experience rooted in care, quality, and community. We're
              not just in the car business—we're in the business of helping you
              drive forward with confidence.
            </p>

            <div className="flex items-center gap-3 pt-4">
              <img className="size-10 rounded-full" src={CEO} alt="ceo" />
              <div>
                <h5 className="font-bold">Mike Tyson</h5>
                <h6 className="text-gray-400">Founder & CEO</h6>
              </div>
            </div>
            <p className="text-[16.1px] font-medium">
              "At Velocity Car Shop, we're driven by precision, performance, and
              customer satisfaction. Our mission is to deliver top-tier
              automotive care with speed, integrity, and excellence."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-velo-white">
        <div className="container py-10">
          <h3 className="text-center text-5xl leading-[60px] font-semibold">
            Our Team has over{" "}
            <span className="text-gray-400">
              70 years
              <br />
              of combined experience!
            </span>
          </h3>
          <p className="mx-auto w-[550px] py-5 text-center text-[16px] font-light text-gray-600">
            Our team brings experience, innovation, and creativity to the
            automotive world, ensuring your vehicle is in the best hands at
            Velocity Car Shop.
          </p>

          <div className="my-5 grid grid-cols-4 gap-5">
            {teamData.map((eachMember, index) => (
              <TeamCard
                image={eachMember.image}
                name={eachMember.name}
                designation={eachMember.designation}
                description={eachMember.description}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
