import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
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
        text: 'text-emerald-500',
        bgHover: 'hover:bg-emerald-50',
        textHover: 'hover:text-emerald-700',
        borderHover: 'hover:border-emerald-300'
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
      case 'professionnel': return { text: 'text-emerald-500', bgHover: 'hover:bg-emerald-50', textHover: 'hover:text-emerald-700', borderHover: 'hover:border-emerald-300' };
      default:            return defaultColors;
    }
  };

  return (
    <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-gray-100 text-gray-800 mb-4 uppercase">
            {t('plans.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4 tracking-tight">
            {t('plans.title')}
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-normal">
            {t('plans.subtitle')}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-7 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${
                plan.popular
                  ? 'border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20'
                  : 'border-gray-200/80 shadow-sm hover:border-gray-300 hover:shadow-md hover:shadow-slate-100'
              }`}
            >
              {/* Top part block */}
              <div>
                {/* Header Card (Title on same line & Badge) */}
                <div className="flex items-center justify-between gap-2 mb-4 min-h-[40px]">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-start truncate whitespace-nowrap">
                    {plan.name}
                  </h3>
                  
                  {plan.popular ? (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap flex items-center gap-1 shadow-sm">
                      {t('plans.recommended')}
                    </span>
                  ) : plan.badge ? (
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                {/* Subtitle / Description */}
                <p className="text-sm text-gray-400 min-h-[48px] text-start mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Area */}
                <div className="text-start mb-5 min-h-[64px] flex flex-col justify-center">
                  <div className="flex items-baseline text-slate-900 font-bold">
                    <span className="text-4xl tracking-tight">
                      {plan.price === '0' ? '$0' : `${plan.price}`}
                    </span>
                    {plan.price !== '0' && (
                      <span className="text-xl ml-1 font-bold">{t('plans.currency')}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-medium block mt-1">
                    {plan.period ? t('plans.perYear') : 'per month'}
                  </span>
                </div>

                {/* Action Button with Hover State */}
                <div className="mb-6">
                  <Link
                    to={plan.buttonLink}
                    className={`block w-full py-3 px-4 rounded-xl text-center font-bold text-sm transition-all duration-200 ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/30 active:scale-[0.98]'
                        : 'bg-[#121824] hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-100 my-4" />
              </div>

              {/* Features Section */}
              <div className="mt-2 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 text-start leading-tight">
                      <FaCheckCircle className="text-emerald-500 text-base mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;