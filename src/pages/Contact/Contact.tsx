import ContactBG from "@/assets/contact/contact.png";
import VeloV from "@/assets/velocity-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

interface ContactSliceProps {
  title: string;
  data1: string;
  data2?: string;
}

const ContactSlice: React.FC<ContactSliceProps> = ({ title, data1, data2 }) => {
  return (
    <div className="space-y-0.5">
      <h6 className="mb-0.5 font-medium sm:text-lg">{title}</h6>
      <p className="text-sm text-gray-600 sm:text-base">{data1}</p>
      <p className="text-sm text-gray-600 sm:text-base">{data2}</p>
    </div>
  );
};

const contactSliceData: ContactSliceProps[] = [
  {
    title: "Call Center",
    data1: "800100 975 20 34",
    data2: "+ (123) 1000-234 5678",
  },
  {
    title: "Our Address",
    data1: "USA, New York - 1069",
    data2: "Str. First Avenue 1",
  },
  {
    title: "Email",
    data1: "velocity@email.com",
  },
  {
    title: "Socials",
    data1: "Facebook | Twitter",
  },
];

const Contact = () => {
  return (
    <section className="pb-5">
      <div className="bg-velo-white py-5">
        <div className="container">
          <div
            style={{
              backgroundImage: `url(${ContactBG})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="overflow-hidden rounded-xl"
          >
            <div className="bg-velo-black/60 space-y-1 px-7 py-7 backdrop-blur-[1px] sm:py-10 md:py-13 lg:py-20">
              <div className="text-velo-white flex items-center text-lg">
                <img className="w-4" src={VeloV} alt="velocity" />
                elocity
              </div>
              <h3 className="text-velo-white text-2xl md:text-5xl">
                Contact Us
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-1 gap-8 py-10 md:grid-cols-2 md:py-20 lg:gap-12">
        <div className="space-y-7">
          <h6 className="text-velo-red font-semibold">/get in touch/</h6>
          <h5 className="text-3xl lg:text-5xl">
            We are always ready to help you and answer your questions
          </h5>

          <p className="text-[16.5px]">
            Contact Velocity Car Shop today for professional auto care, quick
            turnaround, honest service, and a dedicated team ready to keep you
            moving forward.
          </p>

          <div className="grid grid-cols-2 gap-5 md:gap-8">
            {contactSliceData.map((eachSlice, index) => (
              <ContactSlice
                key={index}
                title={eachSlice.title}
                data1={eachSlice.data1}
                data2={eachSlice.data2}
              />
            ))}
          </div>
        </div>

        <div className="bg-velo-gray flex items-center justify-center rounded-3xl p-5 sm:p-10 md:p-7 lg:p-15">
          <div>
            <h6 className="text-2xl font-medium">Get In Touch</h6>
            <p className="pt-3 pb-6 text-gray-500 lg:text-[17px]">
              Let us know what you need, and we will gladly assist you with your
              tailored requirements.
            </p>
            <div className="space-y-5">
              <Input
                type="text"
                placeholder="Full Name"
                className="border-velo-black/30 h-10 rounded-none border-0 border-b text-lg shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="border-velo-black/30 h-10 rounded-none border-0 border-b text-lg shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
              <Input
                type="text"
                placeholder="Subject"
                className="border-velo-black/30 h-10 rounded-none border-0 border-b text-lg shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
              <Textarea
                placeholder="Your Message"
                className="border-velo-black/30 h-20 rounded-none border-0 border-b text-lg shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
              <Button className="bg-velo-red hover:bg-velo-maroon mt-2 h-11">
                <FaChevronRight />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <iframe
          className="pointer-events-none h-[200px] md:h-[350px] w-full rounded-2xl brightness-85 grayscale filter"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05052390957!2d-74.30915645023623!3d40.697193364541725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2z4Kao4Ka_4KaJIOCmh-Cmr-CmvOCmsOCnjeCmlSwg4Kau4Ka-4Kaw4KeN4KaV4Ka_4KaoIOCmr-CngeCmleCnjeCmpOCmsOCmvuCmt-CnjeCmn-CnjeCmsA!5e0!3m2!1sbn!2sbd!4v1744656816494!5m2!1sbn!2sbd"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
