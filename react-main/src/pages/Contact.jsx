import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  FaUser, 
  FaEnvelope, 
  FaCommentAlt, 
  FaPaperPlane, 
  FaSpinner, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaBolt,
  FaLeaf
} from "react-icons/fa";

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
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -6,
      boxShadow: "0 20px 40px -15px rgba(6, 78, 59, 0.12)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.99 }
  };

  const iconVariants = {
    hover: {
      scale: 1.08,
      rotate: isRTL ? -6 : 6,
      backgroundColor: "#047857",
      color: "#fef3c7",
      transition: { type: "spring", stiffness: 400, damping: 12 }
    }
  };

  // Contact info mapping with unified icons
  const contactInfo = [
    { 
      icon: <FaEnvelope className="w-6 h-6" />, 
      title: t('contact.email'), 
      content: "contact@cooperative.ma", 
      sub: t('contact.responseTime')
    },
    { 
      icon: <FaPhoneAlt className="w-5 h-5" />, 
      title: t('contact.phone'), 
      content: "+212 5XX-XXXXXX", 
      sub: t('contact.hours')
    },
    { 
      icon: <FaMapMarkerAlt className="w-5 h-5" />, 
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
      
      {/* Hero Section Premium (Green Gradient) */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-amber-50 py-5 border-b-4 border-emerald-600"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: isRTL ? 135 : -135 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="inline-block mb-4"
          >
            <div className="bg-emerald-500/20 backdrop-blur-md rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto border border-emerald-400/30 shadow-inner">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-emerald-300 text-3xl"
              >
                <FaLeaf />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm"
          >
            {t('contact.title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-emerald-100/80 max-w-2xl mx-auto mb-6 font-medium"
          >
            {t('contact.subtitle')}
          </motion.p>
          
         
        </div>
      </motion.div>

      {/* Main Grid Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-stone-50/60 py-16"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:items-start">
          
          {/* Contact Form Container */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            {...cardVariants}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-emerald-100/60 transition-all duration-300"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t('contact.formTitle')}
              </h2>
              <p className="text-gray-500 text-sm">
                {t('contact.formSubtitle')}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  {t('contact.name')}
                </label>
                <div className="relative">
                  <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === "name" ? "text-emerald-600" : "text-gray-400"}`}>
                    <FaUser className="text-sm" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 border border-emerald-100 bg-emerald-50/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-400 text-sm font-medium text-gray-700`}
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  {t('contact.email')}
                </label>
                <div className="relative">
                  <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focusedField === "email" ? "text-emerald-600" : "text-gray-400"}`}>
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 border border-emerald-100 bg-emerald-50/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-400 text-sm font-medium text-gray-700`}
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  {t('contact.message')}
                </label>
                <div className="relative">
                  <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-5 transition-colors duration-200 ${focusedField === "message" ? "text-emerald-600" : "text-gray-400"}`}>
                    <FaCommentAlt className="text-sm" />
                  </span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows="5"
                    className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-4 border border-emerald-100 bg-emerald-50/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-400 text-sm font-medium text-gray-700 resize-none`}
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {sending ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    <span>{t('contact.sending')}</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>{t('contact.send')}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information Right Column */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              {...cardVariants}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-emerald-100/60"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {t('contact.infoTitle')}
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? -15 : 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} gap-4 group`}
                  >
                    <motion.div
                      whileHover="hover"
                      variants={iconVariants}
                      className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center w-12 h-12 border border-emerald-100"
                    >
                      {item.icon}
                    </motion.div>
                    
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                      <p className="text-gray-600 text-sm font-medium whitespace-pre-line leading-relaxed">{item.content}</p>
                      {item.sub && (
                        <p className="text-gray-400 text-xs font-semibold">{item.sub}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Fast Response Guarantee Banner */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-50 p-6 rounded-2xl text-center relative overflow-hidden border border-emerald-700/50 shadow-md shadow-emerald-950/20"
            >
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[size:24px_24px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-3 bg-amber-400/20 p-2.5 rounded-full border border-amber-400/30 text-amber-300 text-xl animate-pulse">
                  <FaBolt />
                </div>
                
                <h4 className="text-lg font-bold text-amber-200 mb-1">
                  {t('contact.guarantee')}
                </h4>
                
                <p className="text-emerald-100/90 text-xs max-w-sm font-medium leading-relaxed">
                  {t('contact.guaranteeText')}
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Contact;