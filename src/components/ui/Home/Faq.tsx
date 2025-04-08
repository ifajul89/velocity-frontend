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
  {
    question: "Do you offer home delivery for purchased vehicles?",
    answer:
      "Yes, we offer home delivery for your convenience. Once you've purchased your vehicle, our team will arrange a delivery to your doorstep.",
  },
];

const Faq = () => {
  return (
    <div>
      <h1 className="my-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </h1>
      <div className="mx-auto grid grid-cols-1 gap-4 px-4 lg:grid-cols-3">
        {quistions.map((item, index) => (
          <div
            key={index}
            className="mb-6 rounded-lg bg-purple-600 p-6 text-white shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
