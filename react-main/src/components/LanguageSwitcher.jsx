import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ mobile = false }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (mobile) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-2 font-medium">Langue / Language</p>
        <div className="flex flex-col space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                i18n.language === lang.code
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
        <span className="text-xl">
          {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
        </span>
        <span className="text-gray-700 font-medium text-sm">
          {languages.find(lang => lang.code === i18n.language)?.code.toUpperCase() || 'FR'}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
              i18n.language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="flex-1 font-medium">{lang.name}</span>
            {i18n.language === lang.code && (
              <span className="text-green-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;