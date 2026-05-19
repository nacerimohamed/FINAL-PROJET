import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* ── Inline SVG flags for cross-platform support ── */
const FlagFR = () => (
  <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm shadow-sm border border-gray-200/50">
    <rect width="213.3" height="480" fill="#002395" />
    <rect x="213.3" width="213.4" height="480" fill="#fff" />
    <rect x="426.7" width="213.3" height="480" fill="#ED2939" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm shadow-sm border border-gray-200/50">
    <rect width="640" height="480" fill="#012169" />
    <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" fill="#fff" />
    <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E" />
    <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#fff" />
    <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E" />
  </svg>
);

const FlagMA = () => (
  <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm shadow-sm border border-gray-200/50">
    <rect width="640" height="480" fill="#C1272D" />
    <path d="M320 179.4l-23.3 71.7h-75.4l61 44.3-23.3 71.7 61-44.4 61 44.4-23.3-71.7 61-44.3h-75.4z" fill="none" stroke="#006233" strokeWidth="12" />
  </svg>
);

const flagComponents = { fr: FlagFR, en: FlagGB, ar: FlagMA };

const LanguageSwitcher = ({ mobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'ENG' },
    { code: 'ar', label: 'AR' }
  ];

  const currentLangCode = (i18n.language || 'fr').split('-')[0];
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];
  const CurrentFlag = flagComponents[currentLang.code] || FlagFR;

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); setIsOpen(false); };

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (mobile) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-2 font-medium">🌐 Langue / Language</p>
        <div className="flex flex-col space-y-2">
          {languages.map((lang) => {
            const Flag = flagComponents[lang.code];
            return (
              <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentLangCode === lang.code
                    ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border-2 border-green-300 shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                  }`}>
                <Flag />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm">{lang.label}</span>
                  <span className="text-xs opacity-70">{lang.name}</span>
                </div>
                {currentLangCode === lang.code && (
                  <span className="ml-auto">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 border-2 ${isOpen ? 'bg-green-50 border-green-300 shadow-md' : 'bg-white/80 border-gray-200 hover:border-green-300 hover:bg-green-50/50 hover:shadow-sm'
          }`}>
        <CurrentFlag />
        <span className="text-gray-700 font-bold text-sm tracking-wide">{currentLang.label}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
        <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🌐 Langue</p>
        </div>
        {languages.map((lang, index) => {
          const Flag = flagComponents[lang.code];
          return (
            <button key={lang.code} onClick={() => changeLanguage(lang.code)}
              className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-all duration-200 ${currentLangCode === lang.code ? 'bg-gradient-to-r from-green-50 to-green-100/50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                } ${index < languages.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <Flag />
              <div className="flex-1">
                <span className="font-bold text-sm">{lang.label}</span>
                <span className="text-xs text-gray-400 ml-2">{lang.name}</span>
              </div>
              {currentLangCode === lang.code && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;