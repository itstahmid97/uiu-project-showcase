<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UIU Project Showcase & Archive System | CSE 3522 DBMS Laboratory</title>
    
    <!-- Meta information for academic presentation -->
    <meta name="description" content="United International University (UIU) Project Showcase, Awards, and Research Archive for CSE 3522, CSE 4326, CSE 4165, CSE 4000A, and CSE 4000B.">
    <meta name="author" content="Department of CSE, United International University">

    <!-- Tailwind CSS 3.4 CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        uiu: {
                            50: '#fff7ed',
                            100: '#ffedd5',
                            200: '#fed7aa',
                            500: '#f97316',
                            600: '#ea580c',
                            700: '#c2410c',
                            800: '#9a3412',
                            900: '#7c2d12'
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace']
                    }
                }
            }
        }
    </script>

    <!-- Custom Utility Stylesheet -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">

    <!-- ====================================================================== -->
    <!-- TOP NAVIGATION BAR                                                     -->
    <!-- ====================================================================== -->
    <header class="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
            
            <!-- University & System Brand -->
            <a href="#" class="flex items-center space-x-3 group min-w-0">
                <div class="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:bg-orange-700 transition">
                    <!-- Academic Crest / Archive Icon -->
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center space-x-2">
                        <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">UIU <span class="text-orange-600 dark:text-orange-500">Showcase</span></span>
                        <span class="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-md bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800 flex-shrink-0">Archive</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:block">CSE 3522 • DBMS Laboratory Portal</p>
                </div>
            </a>

            <!-- Desktop & Tablet Action Controls -->
            <div class="hidden sm:flex items-center space-x-2 lg:space-x-3">
                <!-- SQL Lab & Viva Explorer Button -->
                <button id="open-viva-btn" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition border border-blue-200 dark:border-blue-800 shadow-sm" title="Open SQL Lab & Viva Defense Explorer">
                    <svg class="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>SQL Lab & Viva</span>
                </button>

                <!-- Add Project Button -->
                <button id="open-add-project-btn" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition border border-orange-200 dark:border-orange-800 shadow-sm" title="Submit and archive a student project">
                    <svg class="w-3.5 h-3.5 mr-1.5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    <span>Add Project</span>
                </button>

                <!-- Add Course Button (Extensibility Demo) -->
                <button id="open-add-course-btn" class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition border border-emerald-200 dark:border-emerald-800 shadow-sm" title="Demonstrate dynamic addition of university courses">
                    <svg class="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    <span class="hidden md:inline">Add Course</span>
                </button>

                <!-- Theme Toggle Button -->
                <button id="theme-toggle-btn" class="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle Theme" title="Toggle dark/light theme">
                    <div id="theme-toggle-icon"></div>
                </button>
            </div>

            <!-- Mobile Quick Actions & Menu Toggle -->
            <div class="flex items-center space-x-1.5 sm:hidden">
                <button id="mobile-viva-quick-btn" onclick="app.openVivaModal()" class="p-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800" title="SQL Lab">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </button>
                <button id="mobile-theme-btn" onclick="app.toggleTheme()" class="p-2 rounded-lg text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800" title="Toggle Theme">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </button>
                <button id="mobile-menu-btn" class="p-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800" aria-label="Toggle Mobile Menu">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>
        </div>

        <!-- Mobile Drawer Navigation (Collapsible) -->
        <div id="mobile-menu" class="hidden sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 space-y-2">
            <button onclick="app.openVivaModal(); document.getElementById('mobile-menu').classList.add('hidden')" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    SQL Lab & Viva Defense Explorer
                </span>
                <span>→</span>
            </button>
            <button onclick="app.openAddProjectModal(); document.getElementById('mobile-menu').classList.add('hidden')" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Submit New Project
                </span>
                <span>→</span>
            </button>
            <button onclick="app.openAddCourseModal(); document.getElementById('mobile-menu').classList.add('hidden')" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    Add University Course (Extensibility)
                </span>
                <span>→</span>
            </button>
        </div>
    </header>

    <!-- ====================================================================== -->
    <!-- HERO SECTION (Academic & Engineering Showcase)                         -->
    <!-- ====================================================================== -->
    <section class="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 md:py-14">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
                <!-- Academic Department Badge -->
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-3">
                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>Department of Computer Science & Engineering • United International University</span>
                </div>

                <!-- Main Hero Headline -->
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    Student Engineering Project Showcase & <span class="text-orange-600 dark:text-orange-500">Research Archive</span>
                </h1>

                <!-- Subtitle -->
                <p class="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Repository of capstone solutions and laboratory innovations across <b>SAD Lab (CSE 3412)</b>, <b>Web Programming (CSE 4165)</b>, <b>Microprocessors (CSE 4326)</b>, <b>Electronics (EEE 2124)</b>, <b>AI Lab (CSE 3812)</b>, and <b>Final Year Design Projects (CSE 4000 A & B)</b>.
                </p>

                <!-- Responsive Hero Search Bar -->
                <div class="mt-6 relative max-w-2xl">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" id="hero-search-input" placeholder="Search by title, stack (e.g. ESP32, PHP, PyTorch), or student name..." class="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white placeholder-slate-400 shadow-sm transition">
                    <button id="clear-search-btn" class="hidden absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Clear search">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Responsive Quick Metrics / KPI Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <!-- Stat 1: Total Projects -->
                <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Archived Projects</p>
                    <h3 id="stat-total-projects" class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">--</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5 truncate">Across All Trimesters</p>
                </div>

                <!-- Stat 2: FYDP Vault -->
                <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">FYDP Capstones</p>
                    <h3 id="stat-total-fydp" class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">--</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5 truncate">CSE 4000A & 4000B</p>
                </div>

                <!-- Stat 3: Award Winners -->
                <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Award Winners</p>
                    <h3 id="stat-total-winners" class="text-xl sm:text-2xl font-bold text-amber-500 dark:text-amber-400 mt-1">--</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5 truncate">1st, 2nd, Best FYDP</p>
                </div>

                <!-- Stat 4: Prize Funding -->
                <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Showcase Prize Fund</p>
                    <h3 id="stat-total-prize" class="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">--</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5 truncate">Awarded Grants</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ====================================================================== -->
    <!-- MAIN INTERACTIVE FILTER & PROJECT CATALOGUE                            -->
    <!-- ====================================================================== -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        <!-- Course Quick Filter Tabs (Horizontal Scroll on Mobile) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div id="course-pills-container" class="flex items-center gap-1.5 sm:gap-2 min-w-max">
                    <!-- Populated dynamically via TypeScript -->
                </div>
            </div>
            
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium flex-shrink-0" id="results-count-display">
                Loading archive...
            </div>
        </div>

        <!-- Filter Controls Toolbar -->
        <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                <!-- Course Selector -->
                <div>
                    <label for="course-filter" class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Course</label>
                    <select id="course-filter" class="w-full text-xs py-2 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="">All Courses</option>
                    </select>
                </div>

                <!-- Trimester Selector -->
                <div>
                    <label for="trimester-filter" class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Trimester</label>
                    <select id="trimester-filter" class="w-full text-xs py-2 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="">All Trimesters</option>
                    </select>
                </div>

                <!-- Award Filter -->
                <div>
                    <label for="award-filter" class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Award Status</label>
                    <select id="award-filter" class="w-full text-xs py-2 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="all">All Projects</option>
                        <option value="winners_only">All Award Winners</option>
                        <option value="1st_prize">1st Prize Winners</option>
                        <option value="2nd_prize">2nd Prize Winners</option>
                        <option value="3rd_prize">3rd Prize Winners</option>
                        <option value="best_fydp">Best FYDP Champions</option>
                        <option value="best_innovation">Best Innovation Winners</option>
                    </select>
                </div>

                <!-- Sort Filter -->
                <div>
                    <label for="sort-filter" class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Sort By</label>
                    <select id="sort-filter" class="w-full text-xs py-2 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="newest">Honors & Newest First</option>
                        <option value="prize_desc">Highest Prize Grant</option>
                        <option value="title_asc">Project Title (A-Z)</option>
                        <option value="oldest">Earliest Archive Date</option>
                    </select>
                </div>

                <!-- Reset Filter Button -->
                <div class="flex items-end">
                    <button id="reset-filters-btn" class="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 border border-slate-200/80 dark:border-slate-700">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>Reset Filters</span>
                    </button>
                </div>
            </div>

            <!-- Popular Tech Tag Cloud -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Popular Tech:</span>
                <div id="popular-techs-container" class="flex flex-wrap items-center gap-1.5">
                    <!-- Tech tags inserted dynamically -->
                </div>
            </div>
        </div>

        <!-- Loading Indicator -->
        <div id="loading-indicator" class="hidden py-12 text-center">
            <div class="inline-block animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mb-2"></div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Querying UIU Project Archive...</p>
        </div>

        <!-- Project Cards Grid -->
        <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <!-- Dynamic project cards rendered by compiled TypeScript app -->
        </div>

    </main>

    <!-- ====================================================================== -->
    <!-- PROJECT DETAILS MODAL                                                  -->
    <!-- ====================================================================== -->
    <div id="project-detail-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="detail-modal-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-3xl lg:max-w-4xl border border-slate-200 dark:border-slate-800 my-4 sm:my-8">
                <!-- Close Button -->
                <button id="close-detail-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition z-10" aria-label="Close modal">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <!-- Modal Body Container (Dynamically Populated) -->
                <div id="detail-modal-body">
                    <!-- Injected via TypeScript -->
                </div>
            </div>
        </div>
    </div>

    <!-- ====================================================================== -->
    <!-- DYNAMIC ADD COURSE MODAL (EXTENSIBILITY DEMO)                         -->
    <!-- ====================================================================== -->
    <div id="add-course-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="course-modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
                <button id="close-add-course-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Add New University Course</h3>
                        <p class="text-xs text-slate-500">Live Schema Extensibility Demonstration</p>
                    </div>
                </div>

                <div id="add-course-feedback" class="hidden mb-4"></div>

                <form id="add-course-form" class="space-y-4">
                    <div>
                        <label for="new-course-code" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code *</label>
                        <input type="text" id="new-course-code" required placeholder="e.g. CSE 4182 or CSE 4889" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
                    </div>

                    <div>
                        <label for="new-course-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Title *</label>
                        <input type="text" id="new-course-title" required placeholder="e.g. Artificial Intelligence Laboratory" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
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

    <!-- ====================================================================== -->
    <!-- DYNAMIC ADD PROJECT MODAL                                             -->
    <!-- ====================================================================== -->
    <div id="add-project-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="project-modal-title" role="dialog" aria-modal="true">
        <div id="add-project-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 my-4">
                <button id="close-add-project-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Submit / Archive Project</h3>
                        <p class="text-xs text-slate-500">Record a new student project into the database</p>
                    </div>
                </div>

                <div id="add-project-feedback" class="hidden mb-4"></div>

                <form id="add-project-form" class="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
                    <div>
                        <label for="new-project-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                        <input type="text" id="new-project-title" required placeholder="e.g. Smart Campus Automated Energy Ledger" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
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
                        <textarea id="new-project-abstract" rows="3" required placeholder="Brief description of the problem, architectural methodology, and key results..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none"></textarea>
                    </div>

                    <div>
                        <label for="new-project-tech" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Technologies & Architecture * (Comma-separated)</label>
                        <input type="text" id="new-project-tech" required placeholder="e.g. Next.js, FastAPI, PyTorch, Docker, MySQL" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label for="new-project-github" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Repository URL</label>
                            <input type="url" id="new-project-github" placeholder="https://github.com/..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                        </div>
                        <div>
                            <label for="new-project-demo" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo / Video URL</label>
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
                            <label for="new-project-supervisor" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty Supervisor</label>
                            <select id="new-project-supervisor" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        <div>
                            <label for="new-project-award" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Award Distinction</label>
                            <select id="new-project-award" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                                <option value="None">None (Archived Project)</option>
                                <option value="1st Prize">1st Prize</option>
                                <option value="2nd Prize">2nd Prize</option>
                                <option value="3rd Prize">3rd Prize</option>
                                <option value="Best FYDP">Best FYDP</option>
                                <option value="Best Innovation">Best Innovation</option>
                                <option value="Honorable Mention">Honorable Mention</option>
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

    <!-- ====================================================================== -->
    <!-- INTERACTIVE SQL LAB & VIVA DEFENSE EXPLORER MODAL                      -->
    <!-- ====================================================================== -->
    <div id="viva-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="viva-modal-title" role="dialog" aria-modal="true">
        <div id="viva-modal-backdrop" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-5xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] my-2 sm:my-6">
                
                <!-- Modal Header -->
                <div class="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div class="flex items-center space-x-3 min-w-0">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">CSE 3522: SQL Laboratory & Viva Explorer</h3>
                            <p class="text-xs text-slate-500 truncate">Live Execution of 12 Relational Joins, Subqueries, Aggregations & ORDER BY</p>
                        </div>
                    </div>
                    <button id="close-viva-modal-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Mobile Query Dropdown (<md screens) -->
                <div class="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 md:hidden">
                    <label for="mobile-viva-select" class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Select Query (1-12):</label>
                    <select id="mobile-viva-select" class="w-full text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg dark:text-white">
                        <!-- Populated dynamically -->
                    </select>
                </div>

                <!-- Two-Pane Layout -->
                <div class="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
                    <!-- Left: Query Catalog List (Hidden on small mobile if desired, or responsive) -->
                    <div class="hidden md:block md:col-span-4 border-r border-slate-200 dark:border-slate-800 p-3 sm:p-4 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-950/40" id="viva-queries-list">
                        <!-- Loaded dynamically via TypeScript -->
                    </div>

                    <!-- Right: Execution Engine, Code & Results -->
                    <div class="md:col-span-8 p-4 sm:p-6 overflow-y-auto" id="viva-query-output">
                        <div class="py-12 text-center text-slate-400">
                            Select a query from the catalog to execute it live against the MySQL engine.
                        </div>
                    </div>
                </div>

                <!-- Modal Footer with Relational Integrity Proofs -->
                <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div class="flex flex-wrap items-center gap-3">
                        <span>3NF Relational Schema</span>
                        <span>•</span>
                        <span>3 MySQL Views</span>
                        <span>•</span>
                        <span>6 B-Tree Indexes</span>
                        <span>•</span>
                        <span>6 Active Triggers</span>
                    </div>
                    <span class="font-mono text-[10px] text-slate-400">Database: uiu_project_showcase (MySQL 8.0+)</span>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================================================================== -->
    <!-- FOOTER                                                                 -->
    <!-- ====================================================================== -->
    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
                <p class="font-bold text-slate-800 dark:text-slate-200">UIU Project Showcase & Archive System</p>
                <p class="text-[11px] text-slate-400">CSE 3522: Database Management Systems Laboratory</p>
            </div>
            <div class="text-[11px] text-slate-400 sm:text-right">
                <p>United International University</p>
                <p class="font-mono text-[10px] text-orange-600 dark:text-orange-400">Academic Trimesters 2025 – 2026</p>
            </div>
        </div>
    </footer>

    <!-- Compiled Client-Side Application Script -->
    <script src="js/app.js"></script>
</body>
</html>
