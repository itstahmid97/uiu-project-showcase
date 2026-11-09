# UIU Project Showcase & Archive System 🏛️🏆
**Varsity Project Showcase, Awards, and Idea Repository**  
*Department of Computer Science and Engineering, United International University (UIU)*  
**Course:** CSE 3522: Database Management Systems Laboratory  
**Target Environment:** Localhost via XAMPP (Apache 2.4+ & MySQL 8.0+ / MariaDB 10.4+)  
**Stack:** PHP 8.x (Clean PDO, Prepared Statements) + TypeScript / Tailwind CSS + MySQL 8.0+

---

## ⚡ Quick Launch Guide for Evaluators & Students

1. **Copy into XAMPP:**
   Copy the `project_showcase` folder into your XAMPP `htdocs` directory:
   - Windows: `C:\xampp\htdocs\project_showcase`
   - macOS: `/Applications/XAMPP/xamppfiles/htdocs/project_showcase`

2. **Import Database:**
   - Open phpMyAdmin: `http://localhost/phpmyadmin/`
   - Import `project_showcase/database/schema.sql`.

3. **Open Portal:**
   - Visit: `http://localhost/project_showcase/public/`
   - Or run built-in PHP server:
     ```bash
     cd project_showcase
     php -S localhost:8000 -t public
     ```
     and open `http://localhost:8000/`.

---

## 📑 Full Documentation
The comprehensive specification, 3NF schema breakdown, trigger explanations, 12 mandatory SQL queries, EXPLAIN benchmark comparisons, and viva defense answers are available in:
👉 [project_showcase/README.md](project_showcase/README.md)
