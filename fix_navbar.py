import os
import re

base_dir = r"c:\Users\elmaa\OneDrive\Bureau\COOP - Copie\FINAL-PROJET\react-main\src"

def fix_navbar():
    path = os.path.join(base_dir, "components", "Navbar.jsx")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Fix the map function to include index
    content = content.replace('{navLinks.map((link) => {', '{navLinks.map((link, index) => {')

    # Conflict 1
    content = re.sub(r'<<<<<<< HEAD\n.*?\n=======\n(.*?)\n>>>>>>> [^\n]+\n', r'\1\n', content, count=1, flags=re.DOTALL)
    
    # Conflict 2
    content = re.sub(r'<<<<<<< HEAD\n.*?\n=======\n(.*?)\n>>>>>>> [^\n]+\n', r'\1\n', content, count=1, flags=re.DOTALL)

    # Conflict 3
    content = re.sub(r'<<<<<<< HEAD\n.*?\n=======\n(.*?)\n>>>>>>> [^\n]+\n', r'\1\n', content, count=1, flags=re.DOTALL)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_navbar()
print("Fixed Navbar.jsx")
