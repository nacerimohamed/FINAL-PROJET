import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        footer {
          background: linear-gradient(135deg, #064e3b, #065f46);
          position: relative;
          overflow: hidden;
        }

        /* soft animated glow */
        footer::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(16, 185, 129, 0.15);
          filter: blur(80px);
          top: -80px;
          left: -80px;
          animation: floatGlow 6s ease-in-out infinite alternate;
        }

        footer::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          background: rgba(52, 211, 153, 0.12);
          filter: blur(80px);
          bottom: -80px;
          right: -80px;
          animation: floatGlow 7s ease-in-out infinite alternate;
        }

        @keyframes floatGlow {
          from { transform: translateY(0px); }
          to { transform: translateY(20px); }
        }

        /* links animation */
        .footer-link {
          display: inline-block;
          position: relative;
          color: #d1d5db;
          transition: all 0.3s ease;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -3px;
          left: 0;
          background: #34d399;
          transition: width 0.3s ease;
        }

        .footer-link:hover {
          color: #34d399;
          transform: translateX(5px);
        }

        .footer-link:hover::after {
          width: 100%;
        }

        /* card fade animation */
        .footer-col {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
        }

        .footer-col:nth-child(1) { animation-delay: 0.1s; }
        .footer-col:nth-child(2) { animation-delay: 0.2s; }
        .footer-col:nth-child(3) { animation-delay: 0.3s; }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* title underline */
        .footer-title {
          position: relative;
          display: inline-block;
          margin-bottom: 12px;
        }

        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 40px;
          height: 2px;
          background: #34d399;
          border-radius: 10px;
        }

        /* contact hover */
        .contact {
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .contact:hover {
          opacity: 1;
          transform: translateX(5px);
          color: #34d399;
        }
      `}</style>

      <footer className="text-white">
        <div className="container mx-auto px-6 py-14 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* PRODUCTS */}
            <div className="footer-col">
              <h3 className="footer-title text-xl font-bold">
                Products
              </h3>

              <ul className="space-y-3 mt-4">

                <li>
                  <a href="#products" className="footer-link">
                    {t("footer.categoriesList.honey")}
                  </a>
                </li>

                <li>
                  <a href="#products" className="footer-link">
                    {t("footer.categoriesList.spices")}
                  </a>
                </li>

                <li>
                  <a href="#products" className="footer-link">
                    {t("footer.categoriesList.oils")}
                  </a>
                </li>

              </ul>
            </div>

            {/* COOPERATIVES */}
            <div className="footer-col">
              <h3 className="footer-title text-xl font-bold">
                Cooperatives
              </h3>

              <ul className="space-y-3 mt-4">

                <li>
                  <a href="#cooperatives" className="footer-link">
                    {t("footer.cooperativeList")}
                  </a>
                </li>

                <li>
                  <a href="#about" className="footer-link">
                    {t("footer.aboutUs")}
                  </a>
                </li>

                <li>
  <a href="#faq" className="footer-link">
    {t("footer.faq")}
  </a>
</li>

<li>
  <a href="#testimonials" className="footer-link">
    {t("footer.testimonials")}
  </a>
</li>

              </ul>
            </div>

            {/* CONTACT */}
            <div className="footer-col">
              <h3 className="footer-title text-xl font-bold">
                Contact
              </h3>

              <div className="mt-4 space-y-2">

                <p className="contact">admin@cooperative.ma</p>
                <p className="contact">+212 6 XX XX XX XX</p>
                <p className="contact">Ouarzazate, Maroc</p>

              </div>
            </div>

          </div>

          {/* bottom */}
          <div className="border-t border-white/10 mt-10 pt-6 text-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;