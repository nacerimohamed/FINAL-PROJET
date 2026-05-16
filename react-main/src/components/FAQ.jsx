import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div
      className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-green-300 bg-green-50/50 shadow-lg shadow-green-500/10"
          : "border-gray-200 bg-white hover:border-green-200 hover:shadow-md"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 lg:p-6 text-left transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 flex-1">
          <span
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              isOpen
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={`font-semibold text-base lg:text-lg transition-colors duration-200 pr-4 ${
              isOpen ? "text-green-800" : "text-gray-800"
            }`}
          >
            {question}
          </h3>
        </div>
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "bg-green-600 text-white rotate-180"
              : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Animated Answer */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ overflow: "hidden" }}
      >
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 pl-[4.5rem]">
          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      question: t("faq.q5"),
      answer: t("faq.a5"),
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-green-100 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-emerald-100 rounded-full filter blur-3xl opacity-40"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 fade-up">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            {t("faq.title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 fade-up">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="text-center mt-12 fade-up">
          <p className="text-gray-600 mb-4">{t("faq.moreQuestions")}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("faq.contactUs")}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
