import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        footer {
          background: #000000;
          border-top: 2px solid #10b981;
        }
        
        footer h3 {
          color: #ffffff;
        }
        
        footer .text-white {
          color: #ffffff !important;
        }
        
        footer .text-green-300 {
          color: #10b981 !important;
        }
        
        footer .text-green-200 {
          color: #34d399 !important;
        }
        
        footer .bg-green-600 {
          background: #10b981 !important;
        }
        
        footer .bg-green-500 {
          background: #10b981 !important;
        }
        
        footer .bg-blue-600 {
          background: #1877f2 !important;
        }
        
        footer .bg-gradient-to-r {
          background: linear-gradient(135deg, #000000 0%, #111827 100%) !important;
        }
        
        footer .from-purple-500.to-pink-500 {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
        }
        
        footer .from-yellow-400.to-orange-500 {
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%) !important;
        }
        
        footer li {
          color: #d1d5db;
        }
        
        footer li:hover {
          color: #10b981 !important;
        }
        
        .social-icon {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <footer className="bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Colonne 1: Catégories */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('footer.categories')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.honey')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.semolina')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.spices')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.oils')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.hydrolats')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/products" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.categoriesList.driedFruits')}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 2: Coopérative et informations légales */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('footer.cooperative')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/cooperatives" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.searchCooperative')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cooperatives" 
                    className="flex items-center hover:text-green-300 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.cooperativeList')}</span>
                  </Link>
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-4 text-white">{t('footer.legalInfo')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="hover:text-green-300 transition-colors cursor-pointer flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.aboutUs')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal" 
                    className="hover:text-green-300 transition-colors cursor-pointer flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.legalMentions')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="hover:text-green-300 transition-colors cursor-pointer flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.termsOfUse')}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="hover:text-green-300 transition-colors cursor-pointer flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-300 hover:text-white">{t('footer.privacyPolicy')}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3: Contact et réseaux sociaux */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">{t('footer.adminContact')}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <a href="mailto:admin@cooperative.ma" className="text-gray-300 hover:text-white transition-colors">
                    admin@cooperative.ma
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <a href="tel:+212612345678" className="text-gray-300 hover:text-white transition-colors">
                    +212 6 12 34 56 78
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-300">Ouarzazate, Maroc</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 text-white">{t('footer.followUs')}</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/212612345678" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon bg-green-600 hover:bg-green-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472,14.382c-0.297,0.149-1.758,0.867-2.03,0.967c-0.272,0.099-0.471,0.149-0.671,0.149c-0.421,0-0.512-0.128-0.73-0.447c-0.218-0.318-0.836-1.058-1.188-1.408c-0.395-0.387-0.594-0.446-0.791-0.446c-0.198,0-0.396,0.05-0.594,0.05c-0.198,0-0.521-0.05-0.818-0.198c-0.297-0.149-1.058-0.422-1.997-1.158c-0.74-0.644-1.237-1.436-1.383-1.677c-0.198-0.347-0.025-0.535,0.149-0.694c0.174-0.149,0.396-0.347,0.594-0.521c0.198-0.174,0.272-0.297,0.396-0.446c0.124-0.149,0.062-0.274-0.035-0.372c-0.099-0.099-0.892-1.087-1.188-1.485c-0.31-0.421-0.694-0.446-0.943-0.446c-0.249,0-0.521,0.05-0.818,0.198c-0.297,0.149-1.092,0.545-1.287,1.436c-0.198,0.892,0.198,1.955,0.967,2.873c0.77,0.918,3.045,2.898,5.187,3.67c1.189,0.421,1.632,0.471,2.229,0.421c0.594-0.05,1.908-0.793,2.18-1.558c0.272-0.77,0.272-1.436,0.198-1.558C17.719,14.334,17.596,14.334,17.472,14.382z"/>
                    <path d="M12,0C5.373,0,0,5.373,0,12c0,6.627,5.373,12,12,12s12-5.373,12-12C24,5.373,18.627,0,12,0z M12,22.5C6.21,22.5,1.5,17.79,1.5,12S6.21,1.5,12,1.5S22.5,6.21,22.5,12S17.79,22.5,12,22.5z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors border"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16.5h-4v-9h4v9zm-2-10.5c-1.11 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm8 10.5h-4v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2v5.5h-4v-9h4v1.5c.8-1.2 2.2-2 3.5-2 2.5 0 4.5 2 4.5 4.5v5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;