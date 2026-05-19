import os
import re

base_dir = r"c:\Users\elmaa\OneDrive\Bureau\COOP - Copie\FINAL-PROJET\react-main\src"

def fix_regionmap():
    path = os.path.join(base_dir, "pages", "Admin", "RegionMap.jsx")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    content = re.sub(r'<<<<<<< HEAD\n.*?=======\n.*?\n>>>>>>> [^\n]+\n', r'''      {/* Embedded Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
''', content, flags=re.DOTALL)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def fix_chatbot():
    path = os.path.join(base_dir, "components", "Chatbot.jsx")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Conflict 1: Imports
    c1 = r'''<<<<<<< HEAD
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
=======
import { GoogleGenerativeAI } from "@google/generative-ai";
import robotIcon from "../assets/robot_icon.png";
>>>>>>> [^\n]+'''
    r1 = r'''import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiMail, 
  FiGlobe, 
  FiArrowLeft, 
  FiSend,
  FiTruck,
  FiTag,
  FiSmile
} from "react-icons/fi";
import { FaLeaf, FaTimes } from "react-icons/fa";
import { RiDiscussLine, RiMessage3Line } from "react-icons/ri";
import { BsBasket3, BsAward } from "react-icons/bs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import robotIcon from "../assets/robot_icon.png";'''
    content = re.sub(c1, r1, content)

    # Conflict 2: Icon
    c2 = r'''<<<<<<< HEAD\s+<div className="w-10 h-10 rounded-full flex items-center justify-center text-lg text-amber-100"\s+style=\{\{ background: "rgba\(255,255,255,0\.2\)", backdropFilter: "blur\(10px\)" \}\}>\s+<FaLeaf className="w-5 h-5" />\s+=======\s+<div className="w-10 h-10 rounded-full shadow-sm overflow-hidden border border-white/20 flex-shrink-0">\s+<img src=\{robotIcon\} alt="Bot" className="w-full h-full object-cover scale-110" />\s+>>>>>>> [^\n]+'''
    r2 = r'''              <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden border border-white/20 flex-shrink-0">
                <img src={robotIcon} alt="Bot" className="w-full h-full object-cover scale-110" />'''
    content = re.sub(c2, r2, content)

    # Conflict 3: Button
    c3 = r'''<<<<<<< HEAD\s+<button\s+onClick=\{\(\) => setIsOpen\(!isOpen\)\}\s+className="w-\[60px\] h-\[60px\].*?=======\s+\{!isOpen && \(\s+<button\s+onClick=\{\(\) => setIsOpen\(true\)\}\s+className="w-\[64px\] h-\[64px\].*?>>>>>>> [^\n]+'''
    r3 = r'''      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[64px] h-[64px] rounded-full border-none flex items-center justify-center cursor-pointer text-white transition-transform duration-300 hover:scale-110 shadow-2xl z-[10000] overflow-hidden"
        style={{
          background: isOpen ? "linear-gradient(135deg, #4e6c33 0%, #3a6232 100%)" : "transparent",
          boxShadow: "0 6px 24px rgba(59,130,246,0.4)",
          animation: !isOpen ? "chatPulse 2s infinite" : "none",
        }}
      >
        {isOpen ? "✕" : <img src={robotIcon} alt="Chatbot" className="w-full h-full object-cover" />}
      </button>'''
    content = re.sub(c3, r3, content, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_regionmap()
fix_chatbot()
print("Fixed RegionMap and Chatbot")
