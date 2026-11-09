<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UIU Project Showcase & Archive System | Varsity Project Showcase & Idea Repository</title>
    
    <!-- Meta tags for academic presentation -->
    <meta name="description" content="United International University (UIU) Project Showcase, Awards, and Idea Repository for CSE 3522, CSE 4326, CSE 4000A, and CSE 4000B.">
    <meta name="author" content="Department of CSE, United International University">

    <!-- Tailwind CSS CDN -->
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
                            500: '#f97316',
                            600: '#ea580c',
                            700: '#c2410c',
                            800: '#9a3412',
                            900: '#7c2d12'
                        }
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
    <header class="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <!-- University & System Brand -->
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">UIU <span class="text-orange-600 dark:text-orange-500">Showcase</span></span>
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800">Archive 2.0</span>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">CSE 3522 • Varsity Project Showcase & Idea Repository</p>
                </div>
            </div>

            <!-- Header Quick Action Controls -->
            <div class="flex items-center space-x-2 sm:space-x-3">
                <!-- SQL Lab & Viva Explorer Button -->
                <button id="open-viva-btn" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition border border-blue-200 dark:border-blue-800" title="Open CSE 3522 SQL Queries and Viva Defense Explorer">
                    <span class="mr-1.5">⚡</span>
                    <span class="hidden md:inline">SQL Lab &</span> Viva Explorer
                </button>

                <!-- Dynamic Add Project Button -->
                <button id="open-add-project-btn" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition border border-orange-200 dark:border-orange-800" title="Submit and archive a new project">
                    <span class="mr-1.5">🚀</span>
                    <span>Add Project</span>
                </button>

                <!-- Dynamic Add Course Button (Extensibility Demo) -->
                <button id="open-add-course-btn" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition border border-emerald-200 dark:border-emerald-800" title="Demonstrate dynamic insertion of courses">
                    <span class="mr-1.5">➕</span>
                    <span class="hidden md:inline">Add Course</span>
                </button>

                <!-- Theme Toggle Button -->
                <button id="theme-toggle-btn" class="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="Toggle Theme">
                    <div id="theme-toggle-icon"></div>
                </button>
            </div>
        </div>
    </header>

    <!-- ====================================================================== -->
    <!-- HERO SECTION                                                           -->
    <!-- ====================================================================== -->
    <section class="relative overflow-hidden bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-12 md:py-16">
        <!-- Background Grid Pattern Accent -->
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div class="max-w-3xl">
                <!-- Badge -->
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 mb-4">
                    <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span>United International University Project Archive</span>
                </div>

                <!-- Main Hero Headline -->
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    UIU Engineering Showcase & <span class="text-gradient">Idea Repository</span>
                </h1>

                <!-- Subtitle -->
                <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    Explore past UIU project showcase winners across <b>SAD Lab (CSE 3412)</b>, <b>Web Programming (CSE 4165)</b>, <b>Microprocessors (CSE 4326)</b>, <b>Electronics Lab (EEE 2124)</b>, <b>AI Lab (CSE 3812)</b>, and <b>Final Year Design Projects (CSE 4000 A & B)</b>. Inspect real student architectures, repositories, and hardware blueprints.
                </p>

                <!-- Hero Search Bar -->
                <div class="mt-6 relative max-w-xl">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input type="text" id="hero-search-input" placeholder="Search by project title, abstract, tech stack (e.g. ESP32, PHP, PyTorch), or student name..." class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white placeholder-slate-400 shadow-sm transition">
                </div>
            </div>

            <!-- Quick Metrics / KPI Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/80">
                <!-- Stat 1 -->
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Archived Projects</p>
                    <h3 id="stat-total-projects" class="text-2xl font-black text-slate-900 dark:text-white mt-1">--</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">Across All Trimesters</p>
                </div>

                <!-- Stat 2 -->
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">FYDP Capstone Vault</p>
                    <h3 id="stat-total-fydp" class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">--</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">CSE 4000A & 4000B</p>
                </div>

                <!-- Stat 3 -->
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Award Winners</p>
                    <h3 id="stat-total-winners" class="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">--</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">1st, 2nd, Best FYDP</p>
                </div>

                <!-- Stat 4 -->
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prize Funding</p>
                    <h3 id="stat-total-prize" class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">--</h3>
                    <p class="text-[11px] text-slate-400 mt-0.5">Distributed to Champions</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ====================================================================== -->
    <!-- MAIN INTERACTIVE FILTER & PROJECT CATALOGUE                            -->
    <!-- ====================================================================== -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <!-- Course Quick Filter Tabs (Pill Navigation) -->
        <div class="flex items-center justify-between flex-wrap gap-3">
            <div id="course-pills-container" class="flex flex-wrap items-center gap-2">
                <!-- Dynamically populated course pill buttons -->
            </div>
            
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium" id="results-count-display">
                Loading projects...
            </div>
        </div>

        <!-- Filter Controls Bar -->
        <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                <!-- Course Selector Dropdown -->
                <div>
                    <label for="course-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Course</label>
                    <select id="course-filter" class="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="">All Courses</option>
                    </select>
                </div>

                <!-- Trimester Selector Dropdown -->
                <div>
                    <label for="trimester-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Trimester</label>
                    <select id="trimester-filter" class="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="">All Trimesters</option>
                    </select>
                </div>

                <!-- Award Filter -->
                <div>
                    <label for="award-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Award Status</label>
                    <select id="award-filter" class="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="all">All Projects</option>
                        <option value="winners_only">🏆 All Award Winners</option>
                        <option value="1st_prize">🥇 1st Prize Winners</option>
                        <option value="2nd_prize">🥈 2nd Prize Winners</option>
                        <option value="3rd_prize">🥉 3rd Prize Winners</option>
                        <option value="best_fydp">🌟 Best FYDP Champions</option>
                        <option value="best_innovation">💡 Best Innovation Winners</option>
                    </select>
                </div>

                <!-- Sort Filter -->
                <div>
                    <label for="sort-filter" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Sort By</label>
                    <select id="sort-filter" class="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white">
                        <option value="newest">Honors & Newest First</option>
                        <option value="prize_desc">Highest Prize Money</option>
                        <option value="title_asc">Project Title (A-Z)</option>
                        <option value="oldest">Earliest Archive Date</option>
                    </select>
                </div>

                <!-- Reset Filter Action -->
                <div class="flex items-end">
                    <button id="reset-filters-btn" class="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>Reset Filters</span>
                    </button>
                </div>
            </div>

            <!-- Popular Tech Tag Cloud -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Popular Tech:</span>
                <div id="popular-techs-container" class="flex flex-wrap items-center gap-1.5">
                    <!-- Tech tags inserted dynamically -->
                </div>
            </div>
        </div>

        <!-- Loading Indicator -->
        <div id="loading-indicator" class="hidden py-12 text-center">
            <div class="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-2"></div>
            <p class="text-xs text-slate-500 dark:text-slate-400">Querying UIU Project Archive...</p>
        </div>

        <!-- Project Cards Grid -->
        <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Dynamic project cards rendered by compiled TypeScript app -->
        </div>

    </main>

    <!-- ====================================================================== -->
    <!-- PROJECT DETAILS MODAL                                                  -->
    <!-- ====================================================================== -->
    <div id="project-detail-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop blur -->
        <div id="detail-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-200 dark:border-slate-800">
                <!-- Close Button -->
                <button id="close-detail-modal-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition z-10" aria-label="Close modal">
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
    <!-- DYNAMIC ADD COURSE MODAL (EXTENSIBILITY DEMONSTRATION)                 -->
    <!-- ====================================================================== -->
    <div id="add-course-modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="course-modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 dark:border-slate-800 p-6">
                <button id="close-add-course-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                        ➕
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Add New Course</h3>
                        <p class="text-xs text-slate-500">Extensibility Requirement Live Demonstration</p>
                    </div>
                </div>

                <div id="add-course-feedback" class="hidden mb-4"></div>

                <form id="add-course-form" class="space-y-4">
                    <div>
                        <label for="new-course-code" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Code</label>
                        <input type="text" id="new-course-code" required placeholder="e.g. CSE 4182 or CSE 4889" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
                    </div>

                    <div>
                        <label for="new-course-title" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                        <input type="text" id="new-course-title" required placeholder="e.g. Artificial Intelligence Laboratory" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
                    </div>

                    <div>
                        <label for="new-course-dept" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                        <select id="new-course-dept" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white focus:outline-none">
                            <option value="1">CSE - Computer Science & Engineering</option>
                            <option value="2">EEE - Electrical & Electronic Engineering</option>
                            <option value="3">CE - Civil Engineering</option>
                            <option value="4">SoBE - School of Business & Economics</option>
                        </select>
                    </div>

                    <div class="pt-2">
                        <button type="submit" id="submit-course-btn" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition">
                            Save Course into DB
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
        <div id="add-project-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-slate-200 dark:border-slate-800 p-6">
                <button id="close-add-project-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
                        🚀
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 dark:text-white">Submit / Archive Project</h3>
                        <p class="text-xs text-slate-500">Record a new student project with team, stack, and award info</p>
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
                        <input type="text" id="new-project-tech" required placeholder="e.g. Next.js, FastAPI, PyTorch, Docker, PostgreSQL" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label for="new-project-github" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / GitLab URL</label>
                            <input type="url" id="new-project-github" placeholder="https://github.com/..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                        </div>
                        <div>
                            <label for="new-project-demo" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL</label>
                            <input type="url" id="new-project-demo" placeholder="https://..." class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label for="new-project-leader-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Team Leader Name *</label>
                            <input type="text" id="new-project-leader-name" required placeholder="e.g. Tanvir Ahmed" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                        </div>
                        <div>
                            <label for="new-project-leader-id" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student ID *</label>
                            <input type="text" id="new-project-leader-id" required placeholder="e.g. 011 221 045" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none font-mono">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label for="new-project-supervisor" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Supervisor</label>
                            <select id="new-project-supervisor" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        <div>
                            <label for="new-project-award" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Award Distinction</label>
                            <select id="new-project-award" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none">
                                <option value="None">None (Archive only)</option>
                                <option value="1st Prize">🥇 1st Prize</option>
                                <option value="2nd Prize">🥈 2nd Prize</option>
                                <option value="3rd Prize">🥉 3rd Prize</option>
                                <option value="Best FYDP">🌟 Best FYDP</option>
                                <option value="Best Innovation">💡 Best Innovation</option>
                                <option value="Honorable Mention">🎖️ Honorable Mention</option>
                            </select>
                        </div>
                        <div>
                            <label for="new-project-prize" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Prize Money (BDT)</label>
                            <input type="number" id="new-project-prize" min="0" step="500" value="0" class="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white focus:outline-none font-mono">
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit" id="submit-project-btn" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition shadow-md shadow-orange-500/20">
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
        <div id="viva-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-5xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                
                <!-- Modal Header -->
                <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                            ⚡
                        </div>
                        <div>
                            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">CSE 3522: SQL Laboratory & Viva Explorer</h3>
                            <p class="text-xs text-slate-500">Live Execution of 12 Mandatory Joins, Subqueries, Aggregations & ORDER BY Queries</p>
                        </div>
                    </div>
                    <button id="close-viva-modal-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Modal Two-Pane Content -->
                <div class="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                    <!-- Left: Query Catalog List -->
                    <div class="md:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto max-h-[75vh] space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40" id="viva-queries-list">
                        <!-- Loaded dynamically -->
                    </div>

                    <!-- Right: Execution Engine, Code & Results -->
                    <div class="md:col-span-8 p-6 overflow-y-auto max-h-[75vh]" id="viva-query-output">
                        <div class="py-12 text-center text-slate-400">
                            Select a query from the catalog on the left to execute it live against the MySQL database.
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between text-xs text-slate-500">
                    <div class="flex items-center gap-4">
                        <span>🛡️ 3NF Relational Integrity</span>
                        <span>📑 3 Dynamic Views Active</span>
                        <span>⚡ 6 Optimized B-Tree Indexes</span>
                        <span>⚙️ 6 SQL Triggers Enforced</span>
                    </div>
                    <span class="font-mono text-[11px]">Database: uiu_project_showcase</span>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================================================================== -->
    <!-- FOOTER                                                                 -->
    <!-- ====================================================================== -->
    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
                <span class="font-extrabold text-slate-900 dark:text-white">UIU Project Showcase & Archive System</span>
                <span>•</span>
                <span>CSE 3522: Database Management Systems Laboratory</span>
            </div>
            <div class="flex items-center space-x-4">
                <span>United International University</span>
                <span>•</span>
                <span class="font-mono text-[11px] text-orange-600 dark:text-orange-400">Trimesters 2025 – 2026</span>
            </div>
        </div>
    </footer>

    <!-- Compiled Client-Side Application Script -->
    <script src="js/app.js"></script>
</body>
</html>
