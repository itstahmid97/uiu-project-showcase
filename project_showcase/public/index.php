<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UIU Project Showcase — Student Engineering & Capstone Portal</title>

  <!-- Tailwind CSS 3.4 CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#fff7ed',
              100: '#ffedd5',
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c'
            }
          },
          fontFamily: {
            sans: ['Outfit', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            heading: ['Outfit', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }
        }
      }
    }
  </script>

  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200 relative">

  <!-- Ambient Moving Background Elements (Inspired by UIU UCAM Cloud) -->
  <div class="ambient-bg-container" aria-hidden="true">
    <div class="ambient-orb orb-orange"></div>
    <div class="ambient-orb orb-amber"></div>
    <div class="ambient-orb orb-purple"></div>
    <canvas id="ambient-canvas"></canvas>
  </div>

  <!-- ========================================== -->
  <!-- Top Navigation Bar                         -->
  <!-- ========================================== -->
  <header class="sticky top-0 z-40 w-full glass-header border-b border-slate-200/80 dark:border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center space-x-2.5 sm:space-x-3 group min-w-0 flex-shrink-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-orange-700 transition flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <div class="min-w-0">
          <span class="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white">UIU Project <span class="text-orange-600 dark:text-orange-500">Showcase</span></span>
          <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Department of CSE • UIU</p>
        </div>
      </a>

      <!-- Navigation Actions -->
      <div class="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
        <!-- Submit Project Button -->
        <button id="open-add-project-btn" class="btn-primary-animated inline-flex items-center px-2.5 py-1.5 sm:px-3.5 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700 transition shadow-sm" title="Submit Project">
          <svg class="w-3.5 h-3.5 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline mr-1">Submit</span><span>Project</span>
        </button>

        <!-- Add Course Button (Extensibility Demo) -->
        <button id="open-add-course-btn" class="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700" title="Add Course">
          <svg class="w-3.5 h-3.5 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Add Course</span>
        </button>

        <!-- Theme Toggle -->
        <button id="theme-toggle-btn" class="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0" aria-label="Toggle Theme">
          <div id="theme-toggle-icon"></div>
        </button>
      </div>
    </div>
  </header>

  <!-- ========================================== -->
  <!-- Hero Section                               -->
  <!-- ========================================== -->
  <section class="hero-section relative bg-white/35 dark:bg-transparent backdrop-blur-[1px] border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden py-10 md:py-16">
    <!-- Background Pattern & Subtle Glow -->
    <div class="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-30 pointer-events-none"></div>
    <div class="hero-glow"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full min-w-0">
      <div class="max-w-3xl w-full">
        <!-- University Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/90 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300/80 dark:border-orange-800/60 mb-4 max-w-full">
          <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0"></span>
          <span class="truncate font-semibold">United International University • Project Showcase</span>
        </div>

        <!-- Headline -->
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
          Explore Student Projects, <span class="text-orange-600 dark:text-orange-500">Capstones & Innovations</span>
        </h1>

        <!-- Extensible Subtitle (No hardcoded course lists) -->
        <p class="mt-3 text-xs sm:text-base text-slate-700 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
          A centralized university platform to browse, evaluate, and showcase outstanding undergraduate laboratory works and capstone design projects across all academic trimesters.
        </p>

        <!-- Search Bar -->
        <div class="mt-6 relative w-full max-w-xl">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input type="text" id="hero-search-input" placeholder="Search by title, keywords (e.g. ESP32, Flutter, PyTorch), or student name..." class="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white placeholder-slate-400 shadow-sm transition">
          <button id="clear-search-btn" class="hidden absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
            ✕
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/80">
        <!-- Metric 1 -->
        <div class="stat-card p-4 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Archived Projects</p>
          <h3 id="stat-total-projects" class="text-2xl font-black text-slate-950 dark:text-white mt-1">--</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Across All Trimesters</p>
        </div>

        <!-- Metric 2 -->
        <div class="stat-card p-4 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Capstone Vault</p>
          <h3 id="stat-total-fydp" class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">--</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Final Year Projects</p>
        </div>

        <!-- Metric 3 -->
        <div class="stat-card p-4 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Award Winners</p>
          <h3 id="stat-total-winners" class="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">--</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Showcase Honors</p>
        </div>

        <!-- Metric 4 -->
        <div class="stat-card p-4 rounded-xl bg-white/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <p class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Prize Grants</p>
          <h3 id="stat-total-prize" class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">--</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Award Funding (BDT)</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================== -->
  <!-- Unified Filter Toolbar & Catalogue         -->
  <!-- ========================================== -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

    <!-- Unified Filters Toolbar -->
    <div class="catalog-filter-card p-4 bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Catalog Filter & Search</span>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium" id="results-count-display">
          Loading archive...
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- Course Filter -->
        <div>
          <label for="course-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Course</label>
          <select id="course-filter" class="w-full text-xs py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800 dark:text-white font-medium shadow-sm">
            <option value="">All Courses</option>
          </select>
        </div>

        <!-- Trimester Filter -->
        <div>
          <label for="trimester-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Trimester</label>
          <select id="trimester-filter" class="w-full text-xs py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800 dark:text-white font-medium shadow-sm">
            <option value="">All Trimesters</option>
          </select>
        </div>

        <!-- Award Filter -->
        <div>
          <label for="award-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Award Status</label>
          <select id="award-filter" class="w-full text-xs py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800 dark:text-white font-medium shadow-sm">
            <option value="all">All Projects</option>
            <option value="winners_only">Award Winners Only</option>
            <option value="1st_prize">1st Prize</option>
            <option value="2nd_prize">2nd Prize</option>
            <option value="3rd_prize">3rd Prize</option>
            <option value="best_fydp">Best FYDP</option>
            <option value="best_innovation">Best Innovation</option>
          </select>
        </div>

        <!-- Sort Filter -->
        <div>
          <label for="sort-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">Sort By</label>
          <select id="sort-filter" class="w-full text-xs py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-800 dark:text-white font-medium shadow-sm">
            <option value="newest">Honors & Newest First</option>
            <option value="prize_desc">Highest Prize Money</option>
            <option value="title_asc">Project Title (A-Z)</option>
            <option value="oldest">Earliest Archive Date</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="flex items-end">
          <button id="reset-filters-btn" class="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      <!-- Popular Tech Tags -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mr-1">Popular Stack:</span>
        <div id="popular-techs-container" class="flex flex-wrap items-center gap-1.5">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div id="loading-indicator" class="hidden py-16 text-center">
      <div class="inline-block animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mb-2"></div>
      <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Querying database records...</p>
    </div>

    <!-- Project Cards Grid -->
    <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Injected via TypeScript -->
    </div>

  </main>

  <!-- ========================================== -->
  <!-- Project Details Modal                      -->
  <!-- ========================================== -->
  <div id="project-detail-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" role="dialog" aria-modal="true">
    <div id="detail-modal-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

    <div class="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
      <div class="modal-dialog-panel relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-3xl lg:max-w-4xl border border-slate-200 dark:border-slate-800 my-4 sm:my-8 animate-modal-pop">
        <!-- Close Button -->
        <button id="close-detail-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition z-10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div id="detail-modal-body">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- Add Course Modal (Extensibility Demo)      -->
  <!-- ========================================== -->
  <div id="add-course-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center">
      <div class="modal-dialog-panel relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 animate-modal-pop">
        <button id="close-add-course-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Add University Course</h3>
            <p class="text-xs text-slate-500">Live Extensibility Demonstration</p>
          </div>
        </div>

        <div id="add-course-feedback" class="hidden mb-4"></div>

        <form id="add-course-form" class="space-y-4">
          <div>
            <label for="new-course-code" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code *</label>
            <input type="text" id="new-course-code" required placeholder="e.g. CSE 4889 or EEE 3101" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
          </div>

          <div>
            <label for="new-course-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Title *</label>
            <input type="text" id="new-course-title" required placeholder="e.g. Machine Learning & Robotics Lab" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
          </div>

          <div>
            <label for="new-course-dept" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Department</label>
            <select id="new-course-dept" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
              <option value="1">CSE - Computer Science & Engineering</option>
              <option value="2">EEE - Electrical & Electronic Engineering</option>
              <option value="3">CE - Civil Engineering</option>
              <option value="4">SoBE - School of Business & Economics</option>
            </select>
          </div>

          <div class="pt-2">
            <button type="submit" id="submit-course-btn" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Save Course into Database
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- Submit Project Modal                       -->
  <!-- ========================================== -->
  <div id="add-project-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" role="dialog" aria-modal="true">
    <div id="add-project-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

    <div class="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
      <div class="modal-dialog-panel relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 my-4 animate-modal-pop">
        <button id="close-add-project-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Submit Project</h3>
            <p class="text-xs text-slate-500">Record a new student project into the database</p>
          </div>
        </div>

        <div id="add-project-feedback" class="hidden mb-4"></div>

        <form id="add-project-form" class="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label for="new-project-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
            <input type="text" id="new-project-title" required placeholder="e.g. Smart Autonomous Campus Navigation Bot" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="new-project-course" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course *</label>
              <select id="new-project-course" required class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                <!-- Populated dynamically -->
              </select>
            </div>
            <div>
              <label for="new-project-trimester" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trimester *</label>
              <select id="new-project-trimester" required class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                <!-- Populated dynamically -->
              </select>
            </div>
          </div>

          <div>
            <label for="new-project-abstract" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Abstract *</label>
            <textarea id="new-project-abstract" rows="3" required placeholder="Brief description of the problem, methodology, and key results..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none"></textarea>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="new-project-tech" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Technologies & Stack * (Comma-separated)</label>
              <span class="text-[10px] text-slate-400">Click suggestions to auto-add</span>
            </div>
            <input type="text" id="new-project-tech" required placeholder="e.g. Next.js, FastAPI, PyTorch, Docker, MySQL" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
            <!-- Dynamic Auto-updating Tech Suggestions -->
            <div class="mt-2 flex flex-wrap items-center gap-1.5" id="tech-modal-suggestions">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="new-project-github" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Repo URL</label>
              <input type="url" id="new-project-github" placeholder="https://github.com/..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
            </div>
            <div>
              <label for="new-project-demo" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL</label>
              <input type="url" id="new-project-demo" placeholder="https://..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="new-project-leader-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Team Leader Full Name *</label>
              <input type="text" id="new-project-leader-name" required placeholder="e.g. Abdullah Al Noman" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
            </div>
            <div>
              <label for="new-project-leader-id" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student ID *</label>
              <input type="text" id="new-project-leader-id" required placeholder="e.g. 011 221 045" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none font-mono">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label for="new-project-supervisor" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty Advisor</label>
              <select id="new-project-supervisor" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                <!-- Populated dynamically -->
              </select>
            </div>
            <div>
              <label for="new-project-award" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Award Distinction</label>
              <select id="new-project-award" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                <option value="None">None (Archived)</option>
                <option value="1st Prize">1st Prize</option>
                <option value="2nd Prize">2nd Prize</option>
                <option value="3rd Prize">3rd Prize</option>
                <option value="Best FYDP">Best FYDP</option>
                <option value="Best Innovation">Best Innovation</option>
              </select>
            </div>
            <div>
              <label for="new-project-prize" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Prize Money (BDT)</label>
              <input type="number" id="new-project-prize" min="0" step="500" value="0" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none font-mono">
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" id="submit-project-btn" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition shadow-sm">
              Register & Archive Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- Clean Footer                               -->
  <!-- ========================================== -->
  <footer class="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070a11] py-6 text-xs text-slate-500 dark:text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div>
        <p class="font-bold text-slate-900 dark:text-slate-100">UIU Project Showcase</p>
        <p class="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Student Engineering & Capstone Repository • Department of Computer Science & Engineering, UIU</p>
      </div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 sm:text-right">
        <p>United International University • Dhaka, Bangladesh</p>
      </div>
    </div>
  </footer>

  <!-- Application Script -->
  <script src="js/app.js"></script>
</body>
</html>
