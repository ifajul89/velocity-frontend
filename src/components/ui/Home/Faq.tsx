import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaArrowRightLong } from "react-icons/fa6";

const quistions = [
  {
    question: "What financing options are available for purchasing a car?",
    answer:
      "We offer a range of financing options, including flexible payment plans, low-interest loans, and leasing. Please contact our finance team for personalized assistance.",
  },
  {
    question: "Can I trade in my old car?",
    answer:
      "Yes, we accept trade-ins. Our team will evaluate your vehicle's value and offer you a fair trade-in price, which can be applied toward the purchase of your new car.",
  },
  {
    question: "How do I schedule a test drive?",
    answer:
      "Scheduling a test drive is easy. You can either book online through our website or call our customer service team to arrange an appointment at your convenience.",
  },
  {
    question: "Are the cars certified pre-owned?",
    answer:
      "Yes, we offer a selection of certified pre-owned vehicles. Each car undergoes a thorough inspection and comes with a warranty for your peace of mind.",
  },
  {
    question: "What is the warranty on a new car?",
    answer:
      "All new cars come with a manufacturer's warranty, which typically includes coverage for 3 years or 36,000 miles, whichever comes first. Additional extended warranty options are available.",
  },
];

const Faq = () => {
  return (
    <section className="container my-16 flex items-center gap-16 md:my-20">
      <div className="w-2/5 space-y-7">
        <div>
          <div className="bg-velo-red h-1 w-20 rounded-full" />
          <h3 className="text-velo-black mt-2 text-4xl font-semibold">
            Any question?
            <br />
            We got you.
          </h3>
        </div>

        <p className="text-gray-600">
          At Velocity, we believe in making your car buying experience as smooth
          and transparent as possible. Browse through our frequently asked
          questions to find quick answers about pricing, availability,
          financing, and more.
        </p>

        <a
          className="text-velo-red hover:text-velo-maroon flex items-center gap-1 duration-300 hover:underline"
          href="#"
        >
          More FAQs <FaArrowRightLong />
        </a>
      </div>
      <Accordion
        defaultValue="item-0"
        type="single"
        collapsible
        className="w-3/5"
      >
        {quistions.map((question, index) => (
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
              {question.question}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] font-light text-gray-600">
              {question.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;
