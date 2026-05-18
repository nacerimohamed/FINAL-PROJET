import React, { useState, useRef, useEffect } from "react";
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiMail, 
  FiGlobe, 
  FiArrowLeft, 
  FiSend,
  FiTruck,
  FiTag,
  FiSmile //
} from "react-icons/fi";
import { FaLeaf, FaTimes } from "react-icons/fa";
import { RiDiscussLine, RiMessage3Line } from "react-icons/ri";
import { BsBasket3, BsAward } from "react-icons/bs";

// ── UI translations per language ────────────────────────────
const UI = {
  fr: {
    headerTitle: "Assistant Coopératif",
    headerStatus: "En ligne",
    inputPlaceholder: "Écrivez votre message...",
    welcomeTitle: "Bienvenue",
    welcomeSubtitle: "Assistant des coopératives de Drâa-Tafilalet",
    chooseLang: "Choisissez votre langue",
    back: "← Changer la langue",
  },
  en: {
    headerTitle: "Cooperative Assistant",
    headerStatus: "Online",
    inputPlaceholder: "Type your message...",
    welcomeTitle: "Welcome",
    welcomeSubtitle: "Drâa-Tafilalet Cooperatives Assistant",
    chooseLang: "Choose your language",
    back: "← Change language",
  },
  ar: {
    headerTitle: "المساعد التعاوني",
    headerStatus: "متصل",
    inputPlaceholder: "...اكتب رسالتك",
    welcomeTitle: "مرحباً",
    welcomeSubtitle: "مساعد تعاونيات درعة تافيلالت",
    chooseLang: "اختر لغتك",
    back: "تغيير اللغة ←",
  },
};

// ── Suggested questions per language ────────────────────────
const SUGGESTIONS = {
  fr: [
    { label: "Produits disponibles", topic: "products", icon: <BsBasket3 /> },
    { label: "Comment acheter ?", topic: "buy", icon: <FiShoppingBag /> },
    { label: "Livraison", topic: "delivery", icon: <FiTruck /> },
    { label: "Coopératives participantes", topic: "cooperatives", icon: <FiUsers /> },
    { label: "Prix des produits", topic: "price", icon: <FiTag /> },
    { label: "Huile d'argan", topic: "argan", icon: <FaLeaf /> },
    { label: "Safran", topic: "safran", icon: <BsAward /> },
  ],
  en: [
    { label: "Available products", topic: "products", icon: <BsBasket3 /> },
    { label: "How to buy?", topic: "buy", icon: <FiShoppingBag /> },
    { label: "Delivery", topic: "delivery", icon: <FiTruck /> },
    { label: "Participating cooperatives", topic: "cooperatives", icon: <FiUsers /> },
    { label: "Product prices", topic: "price", icon: <FiTag /> },
    { label: "Argan oil", topic: "argan", icon: <FaLeaf /> },
    { label: "Saffron", topic: "safran", icon: <BsAward /> },
  ],
  ar: [
    { label: "المنتجات المتوفرة", topic: "products", icon: <BsBasket3 /> },
    { label: "كيف أشتري؟", topic: "buy", icon: <FiShoppingBag /> },
    { label: "التوصيل", topic: "delivery", icon: <FiTruck /> },
    { label: "التعاونيات المشاركة", topic: "cooperatives", icon: <FiUsers /> },
    { label: "أسعار المنتجات", topic: "price", icon: <FiTag /> },
    { label: "زيت الأركان", topic: "argan", icon: <FaLeaf /> },
    { label: "الزعفران", topic: "safran", icon: <BsAward /> },
  ],
};

// ── Knowledge base responses ────────────────────────────────
const KB = {
  products: {
    fr: "Nos coopératives proposent des produits authentiques de Drâa-Tafilalet :\n- Huile d'argan\n- Miel naturel\n- Safran de Taliouine\n- Dattes Mejhoul\n- Cosmétiques naturels\n\nConsultez notre catalogue pour tout découvrir !",
    en: "Our cooperatives offer authentic Drâa-Tafilalet products:\n- Argan oil\n- Natural honey\n- Taliouine saffron\n- Mejhoul dates\n- Natural cosmetics\n\nBrowse our catalog to discover everything!",
    ar: "تقدم تعاونياتنا منتجات أصيلة من درعة تافيلالت:\n- زيت الأركان\n- العسل الطبيعي\n- زعفران تالوين\n- تمور المجهول\n- مستحضرات تجميل طبيعية\n\nتصفح الكتالوج لاكتشاف المزيد!",
  },
  buy: {
    fr: "Pour acheter :\n1. Parcourez les produits\n2. Choisissez votre produit\n3. Contactez la coopérative via WhatsApp ou téléphone\n4. Confirmez votre commande",
    en: "To buy:\n1. Browse products on our website\n2. Choose your product\n3. Contact the cooperative via WhatsApp or phone\n4. Confirm your order\n\nIt's simple and direct!",
    ar: "لشراء المنتجات:\n1. تصفح المنتجات على موقعنا\n2. اختر المنتج المطلوب\n3. تواصل مع التعاونية عبر واتساب أو الهاتف\n4. أكد طلبك\n\nالعملية بسيطة ومباشرة!",
  },
  delivery: {
    fr: "Oui, la livraison est disponible !\nChaque coopérative gère ses livraisons. Contactez-la directement pour connaître les options, délais et frais dans votre région.",
    en: "Yes, delivery is available!\nEach cooperative manages its own deliveries. Contact them directly for options, timeframes and fees in your area.",
    ar: "نعم، التوصيل متاح!\nكل تعاونية تدير خدمة التوصيل الخاصة بها. تواصل معها مباشرة لمعرفة الخيارات والمدة والرسوم في منطقتك.",
  },
  cooperatives: {
    fr: "Plusieurs coopératives de Drâa-Tafilalet sont sur notre plateforme.\nSpécialisées en huile d'argan, safran, dattes, miel et cosmétiques naturels.\nVisitez la page 'Coopératives' pour les découvrir !",
    en: "Several Drâa-Tafilalet cooperatives are on our platform.\nSpecializing in argan oil, saffron, dates, honey and natural cosmetics.\nVisit the 'Cooperatives' page to discover them!",
    ar: "العديد من تعاونيات درعة تافيلالت على منصتنا.\nمتخصصة في زيت الأركان والزعفران والتمور والعسل ومستحضرات التجميل.\nقم بزيارة صفحة 'التعاونيات' لاكتشافها!",
  },
  price: {
    fr: "Les prix varient selon le produit et la coopérative.\nVous trouverez les prix sur chaque fiche produit. Nos prix sont équitables et soutiennent les producteurs locaux.",
    en: "Prices vary by product and cooperative.\nYou'll find prices on each product page. Our prices are fair and support local producers.",
    ar: "تختلف الأسعار حسب المنتج والتعاونية.\nستجد الأسعار في صفحة كل منتج. أسعارنا عادلة وتدعم المنتجين المحليين.",
  },
  argan: {
    fr: "L'huile d'argan de nos coopératives est 100% pure et naturelle.\nPressée à froid, disponible en version alimentaire et cosmétique. Un trésor du terroir marocain !",
    en: "Our argan oil is 100% pure and natural.\nCold-pressed, available in food and cosmetic versions. A Moroccan heritage treasure!",
    ar: "زيت الأركان من تعاونياتنا نقي 100% وطبيعي.\nمعصور على البارد، متوفر للاستخدام الغذائي والتجميلي. كنز من التراث المغربي!",
  },
  safran: {
    fr: "Le safran de Taliouine est l'un des meilleurs au monde !\nPur, récolté à la main dans la région Drâa-Tafilalet.",
    en: "Taliouine saffron is one of the best in the world!\nPure, hand-harvested in the Drâa-Tafilalet region.",
    ar: "زعفران تالوين من أفضل الأنواع في العالم!\nنقي، يُحصد يدوياً في منطقة درعة تافيلالت.",
  },
  default: {
    fr: "Merci pour votre message ! Je peux vous aider avec les produits, les achats, la livraison ou nos coopératives. Posez votre question !",
    en: "Thanks for your message! I can help you with products, purchases, delivery or our cooperatives. Ask your question!",
    ar: "شكراً لرسالتك! يمكنني مساعدتك في المنتجات والشراء والتوصيل والتعاونيات. اطرح سؤالك!",
  },
  welcome: {
    fr: "Bonjour ! Comment puis-je vous aider aujourd'hui ?\nVoici quelques questions fréquentes :",
    en: "Hello! How can I help you today?\nHere are some common questions:",
    ar: "مرحباً! كيف يمكنني مساعدتك اليوم؟\nإليك بعض الأسئلة الشائعة:",
  },
};

// ── Topic matching from free text ───────────────────────────
const matchTopic = (text) => {
  const lower = text.toLowerCase();
  const rules = [
    { topic: "products", words: ["produit","product","منتج","catalogue","catalog","كتالوج","disponible","available","metov"] },
    { topic: "buy", words: ["acheter","achat","buy","purchase","shraa","commander","order","talab","commande","chri"] },
    { topic: "delivery", words: ["livraison","delivery","tawsil","shipping","shahn","envoyer"] },
    { topic: "cooperatives", words: ["coopérative","cooperative","taawon","partenaire","partner","sharik","particip","taawoniyat"] },
    { topic: "price", words: ["prix","price","taman","coût","cost","si3r","combien","how much","kam"] },
    { topic: "argan", words: ["argan","arkan","arghan"] },
    { topic: "safran", words: ["safran","saffron","zafran"] },
  ];
  for (const r of rules) {
    if (r.words.some((w) => lower.includes(w))) return r.topic;
  }
  return "default";
};

// ── Chatbot Component ───────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(null); // null = show language picker
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isRtl = lang === "ar";
  const ui = lang ? UI[lang] : UI.fr;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && lang && inputRef.current) inputRef.current.focus();
  }, [isOpen, lang]);

  const handleSelectLang = (selectedLang) => {
    setLang(selectedLang);
    setMessages([{ type: "bot", text: KB.welcome[selectedLang], time: new Date() }]);
  };

  const handleResetLang = () => {
    setLang(null);
    setMessages([]);
    setInput("");
  };

  const addBotResponse = (topic) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        type: "bot",
        text: KB[topic]?.[lang] || KB.default[lang],
        time: new Date(),
      }]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { type: "user", text: trimmed, time: new Date() }]);
    setInput("");
    addBotResponse(matchTopic(trimmed));
  };

  const handleSuggestion = (s) => {
    setMessages((prev) => [...prev, { type: "user", text: s.label, time: new Date() }]);
    addBotResponse(s.topic);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const fmtTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-[370px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: "520px",
            maxHeight: "calc(100vh - 120px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(194,120,62,0.15)",
            background: "#faf6f1",
            animation: "chatFadeIn 0.3s ease-out",
            direction: isRtl ? "rtl" : "ltr",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-5 py-4"
            style={{ background: "linear-gradient(135deg, #8B4513 0%, #C2783E 50%, #D4A574 100%)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg text-amber-100"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                <FaLeaf className="w-5 h-5" />
              </div>
              <div className="text-white">
                <div className="font-bold text-sm">{ui.headerTitle}</div>
                <div className="text-[11px] opacity-80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                  {ui.headerStatus}
                </div>
              </div>
            </div>
            
          </div>

          {/* ── Language Picker Screen ── */}
          {!lang ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
              <div className="flex flex-col items-center text-amber-800">
                <RiMessage3Line className="text-5xl mb-2" />
                <h3 className="text-xl font-bold text-gray-800 mb-1">{UI.fr.welcomeTitle}</h3>
                <p className="text-sm text-gray-500">{UI.fr.welcomeSubtitle}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <FiGlobe /> {UI.fr.chooseLang}
              </p>
              <div className="flex flex-col gap-3 w-full max-w-[240px]">
                {[
                  { code: "ar", label: "العربية" },
                  { code: "fr", label: "Français" },
                  { code: "en", label: "English" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLang(l.code)}
                    className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-base font-semibold border-2 transition-all duration-200 cursor-pointer"
                    style={{
                      background: "white",
                      borderColor: "#d4a574",
                      color: "#8B4513",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#C2783E";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.borderColor = "#C2783E";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#8B4513";
                      e.currentTarget.style.borderColor = "#d4a574";
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* ── Messages Area ── */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d4a574 transparent",
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    style={{ animation: "msgSlide 0.3s ease-out" }}
                  >
                    <div
                      className="max-w-[82%] px-4 py-3 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words"
                      style={{
                        borderRadius: msg.type === "user"
                          ? (isRtl ? "18px 18px 18px 4px" : "18px 18px 4px 18px")
                          : (isRtl ? "18px 18px 4px 18px" : "18px 18px 18px 4px"),
                        background: msg.type === "user"
                          ? "linear-gradient(135deg, #8B4513, #C2783E)"
                          : "white",
                        color: msg.type === "user" ? "white" : "#3d2b1f",
                        boxShadow: msg.type === "bot" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      {msg.text}
                      <div className="text-[10px] mt-1.5 opacity-50" style={{ textAlign: isRtl ? "left" : "right" }}>
                        {fmtTime(msg.time)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start" style={{ animation: "msgSlide 0.3s ease-out" }}>
                    <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-amber-700 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}

                {/* Suggestion chips */}
                {!isTyping && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SUGGESTIONS[lang].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        className="border rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                        style={{
                          background: "white",
                          borderColor: "#d4a574",
                          color: "#8B4513",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#C2783E";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "#C2783E";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "#8B4513";
                          e.currentTarget.style.borderColor = "#d4a574";
                        }}
                      >
                        <span className="text-amber-800 group-hover:text-white transition-colors">{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Footer ── */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                <button
                  onClick={handleResetLang}
                  className="w-full text-center py-2 text-[11px] text-gray-400 hover:text-amber-700 cursor-pointer bg-transparent border-none transition-colors font-bold flex items-center justify-center gap-1"
                >
                  <FiArrowLeft className="text-xs" /> {ui.back}
                </button>
                <div className="flex items-center gap-2.5 px-4 pb-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={ui.inputPlaceholder}
                    className="flex-1 border-[1.5px] rounded-3xl px-4 py-2.5 text-[13.5px] outline-none transition-colors"
                    style={{
                      borderColor: "#e0d5c8",
                      background: "#faf6f1",
                      color: "#3d2b1f",
                      direction: isRtl ? "rtl" : "ltr",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#C2783E")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0d5c8")}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-full border-none flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
                    style={{
                      background: input.trim()
                        ? "linear-gradient(135deg, #8B4513, #C2783E)"
                        : "#e0d5c8",
                      color: "white",
                    }}
                  >
                    <FiSend size={15} style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] rounded-full border-none flex items-center justify-center cursor-pointer text-white text-2xl transition-transform duration-300 hover:scale-110 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #4e6c33 0%, #3a6232 100%)",
          boxShadow: "0 6px 24px rgba(139,69,19,0.35)",
          animation: !isOpen ? "chatPulse 2s infinite" : "none",
        }}
      >
        {isOpen ? "✕" : <RiDiscussLine />}
      </button>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(194,120,62,0.4); }
          50%      { box-shadow: 0 0 0 14px rgba(194,120,62,0); }
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;