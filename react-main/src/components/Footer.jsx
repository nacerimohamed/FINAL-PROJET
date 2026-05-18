import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
     <style>{`
        /* ========== STYLE PROFESSIONNEL PREMIUM ========== */
        
        footer {
          background: linear-gradient(145deg, #0A2B1E 0%, #093D2A 50%, #0A2B1E 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
        }

        /* Pattern décoratif subtil */
        footer .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
          pointer-events: none;
        }

        /* Glow animé premium */
        footer::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25), transparent 70%);
          filter: blur(60px);
          top: -150px;
          left: -150px;
          animation: floatSlow 12s ease-in-out infinite alternate;
        }

        footer::after {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.2), transparent 70%);
          filter: blur(60px);
          bottom: -120px;
          right: -120px;
          animation: floatSlow 10s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatSlow {
          0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          100% { transform: translate(30px, 20px) scale(1.2); opacity: 0.8; }
        }

        /* Container principal */
        .footer-container {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem 1.5rem;
        }

        /* Grille moderne */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }

        /* Style des titres */
        .footer-title {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin-bottom: 1.25rem;
          position: relative;
          display: inline-block;
          padding-bottom: 0.5rem;
        }

        .footer-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 45px;
          height: 2px;
          background: linear-gradient(90deg, #34d399, #fbbf24);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .footer-col:hover .footer-title::after {
          width: 70px;
        }

        /* Liste des liens */
        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-list li {
          margin-bottom: 0.75rem;
        }

        .footer-link {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          padding: 0.25rem 0;
        }

        .footer-link svg {
          width: 14px;
          height: 14px;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s ease;
          color: #34d399;
        }

        .footer-link:hover {
          color: #34d399;
          transform: translateX(6px);
        }

        .footer-link:hover svg {
          opacity: 1;
          transform: translateX(0);
        }

        /* Contact items */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .contact-item:last-child {
          border-bottom: none;
        }

        .contact-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .contact-icon svg {
          width: 16px;
          height: 16px;
          color: #34d399;
        }

        .contact-item:hover {
          color: #34d399;
          transform: translateX(4px);
        }

        .contact-item:hover .contact-icon {
          background: rgba(16, 185, 129, 0.2);
          transform: scale(1.05);
        }

        .contact-text a {
          color: inherit;
          text-decoration: none;
        }

        /* Social icons premium */
        .social-icons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(52, 211, 153, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .social-icon svg {
          width: 18px;
          height: 18px;
          color: #a7f3d0;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: transparent;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        .social-icon:hover svg {
          color: white;
          transform: scale(1.1);
        }

        /* Newsletter */
        .newsletter-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .newsletter-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
          color: white;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #34d399;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.1);
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .newsletter-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1rem;
          color: white;
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }

        .newsletter-btn svg {
          width: 14px;
          height: 14px;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, #059669, #047857);
        }

        /* Divider */
        .footer-divider {
          border-top: 1px solid rgba(52, 211, 153, 0.15);
          padding-top: 1.5rem;
          text-align: center;
        }

        .copyright {
          color: #64748b;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .copyright a {
          color: #34d399;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .copyright a:hover {
          color: #fbbf24;
        }

        /* Animation des colonnes */
        .footer-col {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeSlideUp 0.6s ease forwards;
        }

        .footer-col:nth-child(1) { animation-delay: 0.05s; }
        .footer-col:nth-child(2) { animation-delay: 0.15s; }
        .footer-col:nth-child(3) { animation-delay: 0.25s; }
        .footer-col:nth-child(4) { animation-delay: 0.35s; }

        @keyframes fadeSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer-container {
            padding: 2rem 1.5rem 1rem;
          }
          .footer-grid {
            gap: 1.5rem;
          }
          .footer-title {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.8rem;
          }
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