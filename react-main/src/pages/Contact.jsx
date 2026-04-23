import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:8000/api/contact',
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'non lu'
        },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(t('contact.sent'));
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('contact.error'));
    } finally {
      setSending(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: isRTL ? -5 : 5,
      backgroundColor: "#065f46",
      color: "#fef3c7",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // Contact information data with translations
  const contactInfo = [
    { 
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", 
      title: t('contact.email'), 
      content: "contact@cooperative.ma", 
      sub: t('contact.responseTime')
    },
    { 
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", 
      title: t('contact.phone'), 
      content: "+212 5XX-XXXXXX", 
      sub: t('contact.hours')
    },
    { 
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", 
      title: t('contact.address'), 
      content: t('contact.addressFull'), 
      sub: null 
    }
  ];

  return (
    <>
      <Navbar />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {/* Hero Section avec animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-800 text-amber-50 py-20"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute inset-0 bg-black"
        ></motion.div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: isRTL ? 180 : -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="inline-block mb-6"
          >
            <div className="bg-amber-50/20 backdrop-blur-sm rounded-full p-4 w-24 h-24 flex items-center justify-center mx-auto border border-amber-100/30">
              <motion.svg
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-12 h-12 text-amber-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </motion.svg>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-light mb-6 tracking-wide"
          >
            {t('contact.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8 font-light"
          >
            {t('contact.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-1 bg-amber-200/50 mx-auto"
          ></motion.div>
        </div>
      </motion.div>

      {/* Contact Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-20 bg-stone-50/50"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={`grid lg:grid-cols-2 gap-16 ${isRTL ? 'lg:rtl-grid' : ''}`}>
          
          {/* Contact Form - Carte élégante avec animations */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            {...cardVariants}
            className="bg-white p-10 rounded-2xl shadow-lg border border-stone-200 hover:border-emerald-700/30 transition-all"
          >
            <div className="mb-10">
              <motion.h2
                initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-light text-stone-800 mb-4"
              >
                {t('contact.formTitle')}
              </motion.h2>
              <motion.p
                initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-stone-500 text-lg"
              >
                {t('contact.formSubtitle')}
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-stone-700 font-medium mb-3 text-lg">
                  {t('contact.name')}
                </label>
                <div className="relative">
                  <motion.svg
                    animate={focusedField === "name" ? { scale: 1.1, color: "#065f46" } : {}}
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 transition-colors`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </motion.svg>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 transition-all bg-stone-50/50`}
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-3 text-lg">
                  {t('contact.email')}
                </label>
                <div className="relative">
                  <motion.svg
                    animate={focusedField === "email" ? { scale: 1.1, color: "#065f46" } : {}}
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 transition-colors`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </motion.svg>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 transition-all bg-stone-50/50`}
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-stone-700 font-medium mb-3 text-lg">
                  {t('contact.message')}
                </label>
                <div className="relative">
                  <motion.svg
                    animate={focusedField === "message" ? { scale: 1.1, color: "#065f46" } : {}}
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-6 text-stone-400 w-5 h-5 transition-colors`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </motion.svg>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows="6"
                    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/20 transition-colors resize-none bg-stone-50/50`}
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-amber-50 font-medium text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                {sending ? (
                  <div className="flex items-center justify-center">
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-6 w-6 mr-3 text-amber-50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    {t('contact.sending')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <motion.svg
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </motion.svg>
                    {t('contact.send')}
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information - avec animations */}
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              {...cardVariants}
              className="bg-white p-10 rounded-2xl shadow-lg border border-stone-200"
            >
              <motion.h2
                initial={{ x: isRTL ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-light text-stone-800 mb-10"
              >
                {t('contact.infoTitle')}
              </motion.h2>
              
              <div className="space-y-10">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-start group ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <motion.div
                      whileHover="hover"
                      variants={iconVariants}
                      className={`bg-emerald-100 text-emerald-800 p-4 rounded-xl transition-colors cursor-pointer ${isRTL ? 'ml-6' : 'mr-6'}`}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: isRTL ? -5 : 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={isRTL ? 'text-right' : 'text-left'}
                    >
                      <h3 className="font-medium text-stone-800 mb-2 text-xl">{item.title}</h3>
                      <p className="text-stone-600 text-lg whitespace-pre-line">{item.content}</p>
                      {item.sub && (
                        <p className="text-stone-400 text-sm mt-1">{item.sub}</p>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Carte réponse garantie */}
            <motion.div
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                transition: { type: "spring", stiffness: 300 }
              }}
              className="bg-gradient-to-r from-emerald-800 to-stone-800 text-amber-50 p-8 rounded-2xl text-center relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.8 }}
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: isRTL ? [0, -5, 5, 0] : [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-4"
              >
                <svg className="w-12 h-12 mx-auto text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </motion.div>
              
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-light mb-3"
              >
                {t('contact.guarantee')}
              </motion.h4>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-amber-100/80"
              >
                {t('contact.guaranteeText')}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Contact;