import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Plans = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const plans = [
    {
      id: 'gratuit',
      name: t('plans.gratuit.name'),
      description: t('plans.gratuit.description'),
      price: '0',
      period: '',
      badge: t('plans.gratuit.badge'),
      features: [
        t('plans.gratuit.feature1'),
        t('plans.gratuit.feature2'),
        t('plans.gratuit.feature3'),
      ],
      buttonText: t('plans.gratuit.button'),
      buttonLink: '/register-cooperative?plan=gratuit',
      color: 'emerald',
      icon: '🟢',
    },
    {
      id: 'standard',
      name: t('plans.standard.name'),
      description: t('plans.standard.description'),
      price: '500',
      period: t('plans.standard.period'),
      features: [
        t('plans.standard.feature1'),
        t('plans.standard.feature2'),
        t('plans.standard.feature3'),
      ],
      buttonText: t('plans.standard.button'),
      buttonLink: '/register-cooperative?plan=standard',
      color: 'blue',
      icon: '🔵',
    },
    {
      id: 'premium',
      name: t('plans.premium.name'),
      description: t('plans.premium.description'),
      price: '1200',
      period: t('plans.premium.period'),
      features: [
        t('plans.premium.feature1'),
        t('plans.premium.feature2'),
        t('plans.premium.feature3'),
      ],
      buttonText: t('plans.premium.button'),
      buttonLink: '/register-cooperative?plan=premium',
      color: 'violet',
      icon: '🟣',
    },
    {
      id: 'professionnel',
      name: t('plans.professionnel.name'),
      description: t('plans.professionnel.description'),
      price: '2000',
      period: t('plans.professionnel.period'),
      features: [
        t('plans.professionnel.feature1'),
        t('plans.professionnel.feature2'),
        t('plans.professionnel.feature3'),
      ],
      buttonText: t('plans.professionnel.button'),
      buttonLink: '/register-cooperative?plan=professionnel',
      icon: '🟡',
      popular: true,
      colors: {
        text: 'text-amber-500',
        bgHover: 'hover:bg-amber-50',
        textHover: 'hover:text-amber-700',
        borderHover: 'hover:border-amber-300'
      }
    },
  ];

  const defaultColors = {
    text: 'text-emerald-500',
    bgHover: 'hover:bg-emerald-50',
    textHover: 'hover:text-emerald-700',
    borderHover: 'hover:border-emerald-300'
  };

  const getColors = (plan) => {
    switch (plan.id) {
      case 'gratuit':      return { text: 'text-emerald-500', bgHover: 'hover:bg-emerald-50',  textHover: 'hover:text-emerald-700', borderHover: 'hover:border-emerald-300' };
      case 'standard':    return { text: 'text-blue-500',    bgHover: 'hover:bg-blue-50',     textHover: 'hover:text-blue-700',    borderHover: 'hover:border-blue-300'    };
      case 'premium':     return { text: 'text-violet-500',  bgHover: 'hover:bg-violet-50',   textHover: 'hover:text-violet-700',  borderHover: 'hover:border-violet-300'  };
      case 'professionnel': return { text: 'text-amber-500', bgHover: 'hover:bg-amber-50',    textHover: 'hover:text-amber-700',   borderHover: 'hover:border-amber-300'   };
      default:            return defaultColors;
    }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-96 h-96 bg-green-200/20 rounded-full blur-3xl`} />
      <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-96 h-96 bg-blue-200/20 rounded-full blur-3xl`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider bg-emerald-100 text-emerald-800 mb-4 uppercase">
            {t('plans.badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            {t('plans.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            {t('plans.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.popular
                  ? 'border-amber-400 shadow-xl shadow-amber-100/50 scale-105 z-10'
                  : 'border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1'
              } transition-all duration-300 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-md whitespace-nowrap">
                  <FaStar className="text-[10px]" /> {t('plans.recommended')}
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{plan.icon}</span>
                  {plan.badge && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-start">{plan.name}</h3>
                <p className="text-sm text-gray-500 h-10 text-start">{plan.description}</p>
              </div>

              <div className="mb-8 text-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-xl font-bold text-gray-900">{t('plans.currency')}</span>
                  )}
                </div>
                {plan.period && (
                  <span className="text-sm text-gray-500 font-medium">{t('plans.perYear')}</span>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => {
                  const colors = getColors(plan);
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium text-start">
                      <FaCheckCircle className={`${colors.text} mt-0.5 text-base flex-shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <Link
                to={plan.buttonLink}
                className={`block w-full py-3 px-6 rounded-xl text-center font-bold text-sm transition-all duration-300 ${
                  plan.popular
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : `bg-gray-50 text-gray-900 border border-gray-200 ${getColors(plan).bgHover} ${getColors(plan).textHover} ${getColors(plan).borderHover}`
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
