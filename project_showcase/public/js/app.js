"use strict";
/**
 * UIU Project Showcase & Archive System
 * Client-Side TypeScript Application
 *
 * Course: CSE 3522: Database Management Systems Laboratory
 * Target: United International University
 *
 * Safe client-side logic for dynamic filtering, live search with debounce,
 * responsive modal workflows, dynamic course & project insertion, and
 * interactive SQL query execution against MySQL.
 */
// ==============================================================================
// APPLICATION CONTROLLER
// ==============================================================================
class ShowcaseApp {
    constructor() {
        this.apiBase = 'api';
        this.currentFilters = {
            course_id: '',
            trimester_id: '',
            award: 'all',
            tech: '',
            search: '',
            sort: 'newest'
        };
        this.searchDebounceTimer = null;
        this.coursesList = [];
        this.trimestersList = [];
        this.supervisorsList = [];
        this.queryCatalog = [];
        this.isDarkTheme = false;
        this.initTheme();
        this.initEventListeners();
        this.loadProjectsAndMeta();
    }
    // --------------------------------------------------------------------------
    // THEME MANAGEMENT (DARK / LIGHT MODE)
    // --------------------------------------------------------------------------
    initTheme() {
        const savedTheme = localStorage.getItem('uiu_showcase_theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            this.isDarkTheme = true;
        }
        else {
            document.documentElement.classList.remove('dark');
            this.isDarkTheme = false;
        }
        this.updateThemeToggleIcon();
    }
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('uiu_showcase_theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('uiu_showcase_theme', 'light');
        }
        this.updateThemeToggleIcon();
    }
    updateThemeToggleIcon() {
        const iconContainer = document.getElementById('theme-toggle-icon');
        if (iconContainer) {
            iconContainer.innerHTML = this.isDarkTheme
                ? `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
                : `<svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
        }
    }
    // --------------------------------------------------------------------------
    // EVENT LISTENERS BINDING
    // --------------------------------------------------------------------------
    initEventListeners() {
        // Theme button
        document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuBtn?.addEventListener('click', () => {
            mobileMenu?.classList.toggle('hidden');
        });
        // Search inputs & clear button
        const heroSearchInput = document.getElementById('hero-search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        heroSearchInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            if (clearSearchBtn) {
                if (val.length > 0) {
                    clearSearchBtn.classList.remove('hidden');
                }
                else {
                    clearSearchBtn.classList.add('hidden');
                }
            }
            this.handleSearchInput(val);
        });
        clearSearchBtn?.addEventListener('click', () => {
            if (heroSearchInput) {
                heroSearchInput.value = '';
                clearSearchBtn.classList.add('hidden');
                this.handleSearchInput('');
            }
        });
        // Filter Dropdowns
        document.getElementById('course-filter')?.addEventListener('change', (e) => {
            this.currentFilters.course_id = e.target.value;
            this.syncCoursePills();
            this.loadProjects();
        });
        document.getElementById('trimester-filter')?.addEventListener('change', (e) => {
            this.currentFilters.trimester_id = e.target.value;
            this.loadProjects();
        });
        document.getElementById('award-filter')?.addEventListener('change', (e) => {
            this.currentFilters.award = e.target.value;
            this.loadProjects();
        });
        document.getElementById('sort-filter')?.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.loadProjects();
        });
        document.getElementById('reset-filters-btn')?.addEventListener('click', () => this.resetFilters());
        // Modal triggers
        document.getElementById('open-add-project-btn')?.addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('close-add-project-btn')?.addEventListener('click', () => this.closeAddProjectModal());
        document.getElementById('add-project-backdrop')?.addEventListener('click', () => this.closeAddProjectModal());
        document.getElementById('open-add-course-btn')?.addEventListener('click', () => this.openAddCourseModal());
        document.getElementById('close-add-course-btn')?.addEventListener('click', () => this.closeAddCourseModal());
        document.getElementById('open-viva-btn')?.addEventListener('click', () => this.openVivaModal());
        document.getElementById('close-viva-modal-btn')?.addEventListener('click', () => this.closeVivaModal());
        document.getElementById('viva-modal-backdrop')?.addEventListener('click', () => this.closeVivaModal());
        document.getElementById('close-detail-modal-btn')?.addEventListener('click', () => this.closeProjectModal());
        document.getElementById('detail-modal-backdrop')?.addEventListener('click', () => this.closeProjectModal());
        // Mobile Viva Query select
        document.getElementById('mobile-viva-select')?.addEventListener('change', (e) => {
            const qid = parseInt(e.target.value, 10);
            if (qid)
                this.executeVivaQuery(qid);
        });
        // Forms submission
        document.getElementById('add-project-form')?.addEventListener('submit', (e) => this.handleProjectSubmit(e));
        document.getElementById('add-course-form')?.addEventListener('submit', (e) => this.handleCourseSubmit(e));
        // Keyboard navigation (Escape closes modals)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
                this.closeAddProjectModal();
                this.closeAddCourseModal();
                this.closeVivaModal();
            }
        });
    }
    // --------------------------------------------------------------------------
    // DEBOUNCED SEARCH HANDLER
    // --------------------------------------------------------------------------
    handleSearchInput(query) {
        if (this.searchDebounceTimer) {
            window.clearTimeout(this.searchDebounceTimer);
        }
        this.searchDebounceTimer = window.setTimeout(() => {
            this.currentFilters.search = query.trim();
            this.loadProjects();
        }, 250);
    }
    // --------------------------------------------------------------------------
    // DATA LOADING (PROJECTS & METADATA)
    // --------------------------------------------------------------------------
    async loadProjectsAndMeta() {
        this.renderLoading(true);
        try {
            const queryParams = new URLSearchParams({
                course_id: this.currentFilters.course_id,
                trimester_id: this.currentFilters.trimester_id,
                award: this.currentFilters.award,
                tech: this.currentFilters.tech,
                search: this.currentFilters.search,
                sort: this.currentFilters.sort
            });
            const res = await fetch(`${this.apiBase}/projects.php?${queryParams.toString()}`);
            if (!res.ok)
                throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            if (data.success) {
                this.coursesList = data.meta.courses;
                this.trimestersList = data.meta.trimesters;
                if (data.meta.supervisors) {
                    this.supervisorsList = data.meta.supervisors;
                }
                this.renderMetaStats(data.meta.stats);
                this.renderDropdowns(data.meta.courses, data.meta.trimesters);
                this.renderCoursePills(data.meta.courses);
                this.renderPopularTechs(data.meta.popular_techs);
                this.renderProjectCards(data.projects);
            }
            else {
                this.showErrorNotice(data.message || 'Failed to retrieve archive.');
            }
        }
        catch (err) {
            this.showErrorNotice(err.message || 'Database connection required.');
        }
        finally {
            this.renderLoading(false);
        }
    }
    async loadProjects() {
        this.renderLoading(true);
        try {
            const queryParams = new URLSearchParams({
                course_id: this.currentFilters.course_id,
                trimester_id: this.currentFilters.trimester_id,
                award: this.currentFilters.award,
                tech: this.currentFilters.tech,
                search: this.currentFilters.search,
                sort: this.currentFilters.sort
            });
            const res = await fetch(`${this.apiBase}/projects.php?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                this.renderProjectCards(data.projects);
            }
        }
        catch (err) {
            console.error('Filtering error:', err);
        }
        finally {
            this.renderLoading(false);
        }
    }
    // --------------------------------------------------------------------------
    // RENDERING UI COMPONENTS
    // --------------------------------------------------------------------------
    renderMetaStats(stats) {
        const totalElem = document.getElementById('stat-total-projects');
        const fydpElem = document.getElementById('stat-total-fydp');
        const winnersElem = document.getElementById('stat-total-winners');
        const prizeElem = document.getElementById('stat-total-prize');
        if (totalElem)
            totalElem.textContent = String(stats.total_projects);
        if (fydpElem)
            fydpElem.textContent = String(stats.total_fydp);
        if (winnersElem)
            winnersElem.textContent = String(stats.total_award_winners);
        if (prizeElem) {
            prizeElem.textContent = '৳ ' + Number(stats.total_prize_distributed).toLocaleString();
        }
    }
    renderDropdowns(courses, trimesters) {
        // Course filter
        const courseSelect = document.getElementById('course-filter');
        if (courseSelect) {
            const current = this.currentFilters.course_id;
            let html = '<option value="">All Courses</option>';
            courses.forEach(c => {
                html += `<option value="${c.course_id}" ${current === String(c.course_id) ? 'selected' : ''}>${c.course_code} - ${c.course_title}</option>`;
            });
            courseSelect.innerHTML = html;
        }
        // Add project modal course selector
        const newProjCourse = document.getElementById('new-project-course');
        if (newProjCourse) {
            let html = '<option value="">Select University Course</option>';
            courses.forEach(c => {
                html += `<option value="${c.course_id}">${c.course_code}: ${c.course_title}</option>`;
            });
            newProjCourse.innerHTML = html;
        }
        // Trimester filter
        const trimesterSelect = document.getElementById('trimester-filter');
        if (trimesterSelect) {
            const current = this.currentFilters.trimester_id;
            let html = '<option value="">All Trimesters</option>';
            trimesters.forEach(t => {
                html += `<option value="${t.trimester_id}" ${current === String(t.trimester_id) ? 'selected' : ''}>${t.term_name} ${t.year}</option>`;
            });
            trimesterSelect.innerHTML = html;
        }
        // Add project modal trimester selector
        const newProjTrimester = document.getElementById('new-project-trimester');
        if (newProjTrimester) {
            let html = '<option value="">Select Trimester Session</option>';
            trimesters.forEach(t => {
                html += `<option value="${t.trimester_id}">${t.term_name} ${t.year} (${t.trimester_code})</option>`;
            });
            newProjTrimester.innerHTML = html;
        }
        // Add project modal supervisor selector
        const newProjSupervisor = document.getElementById('new-project-supervisor');
        if (newProjSupervisor) {
            let html = '<option value="">Select Faculty Supervisor (Optional)</option>';
            this.supervisorsList.forEach(s => {
                html += `<option value="${s.user_id}">${s.full_name} (${s.email})</option>`;
            });
            newProjSupervisor.innerHTML = html;
        }
    }
    renderCoursePills(courses) {
        const container = document.getElementById('course-pills-container');
        if (!container)
            return;
        let html = `
            <button data-course-id="" class="course-pill px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${this.currentFilters.course_id === ''
            ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-600'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}">
                All Courses
            </button>
        `;
        courses.forEach(c => {
            const isSelected = this.currentFilters.course_id === String(c.course_id);
            html += `
                <button data-course-id="${c.course_id}" class="course-pill px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${isSelected
                ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}">
                    ${c.course_code}
                </button>
            `;
        });
        container.innerHTML = html;
        container.querySelectorAll('.course-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const courseId = target.getAttribute('data-course-id') || '';
                this.currentFilters.course_id = courseId;
                // Sync dropdown select
                const select = document.getElementById('course-filter');
                if (select)
                    select.value = courseId;
                this.syncCoursePills();
                this.loadProjects();
            });
        });
    }
    syncCoursePills() {
        document.querySelectorAll('.course-pill').forEach(btn => {
            const cid = btn.getAttribute('data-course-id') || '';
            if (cid === this.currentFilters.course_id) {
                btn.className = 'course-pill px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap bg-orange-600 text-white shadow-sm ring-1 ring-orange-600';
            }
            else {
                btn.className = 'course-pill px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';
            }
        });
    }
    renderPopularTechs(techs) {
        const container = document.getElementById('popular-techs-container');
        if (!container)
            return;
        let html = '';
        techs.forEach(t => {
            const isSelected = this.currentFilters.tech.toLowerCase() === t.toLowerCase();
            html += `
                <button data-tech="${t}" class="tech-tag-pill px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${isSelected
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-300'}">
                    #${t}
                </button>
            `;
        });
        container.innerHTML = html;
        container.querySelectorAll('.tech-tag-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.currentTarget.getAttribute('data-tech') || '';
                if (this.currentFilters.tech.toLowerCase() === tag.toLowerCase()) {
                    this.currentFilters.tech = '';
                }
                else {
                    this.currentFilters.tech = tag;
                }
                this.renderPopularTechs(techs);
                this.loadProjects();
            });
        });
    }
    // --------------------------------------------------------------------------
    // RENDERING PROJECT CARDS (NO TEXT CUTOFF, FULL RESPONSIVENESS)
    // --------------------------------------------------------------------------
    renderProjectCards(projects) {
        const grid = document.getElementById('projects-grid');
        const countDisplay = document.getElementById('results-count-display');
        if (!grid)
            return;
        if (countDisplay) {
            countDisplay.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;
        }
        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-16 h-16 mx-auto mb-3 text-slate-300 dark:text-slate-700">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                        No projects match your current filters. Try resetting or using different keywords.
                    </p>
                    <button id="empty-state-reset-btn" class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 transition">
                        Clear All Filters
                    </button>
                </div>
            `;
            document.getElementById('empty-state-reset-btn')?.addEventListener('click', () => this.resetFilters());
            return;
        }
        let cardsHtml = '';
        projects.forEach(p => {
            const courseBadgeClass = this.getCourseColor(p.course.course_code);
            const awardBadgeHtml = this.getAwardBadgeHtml(p.award);
            const techPills = p.tech_tags.slice(0, 4).map(t => `<span class="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded">${t}</span>`).join('');
            cardsHtml += `
                <div class="project-card flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:border-orange-300 dark:hover:border-orange-500/50">
                    <div>
                        <!-- Top Metadata Row -->
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${courseBadgeClass}">
                                ${p.course.course_code}
                            </span>
                            <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                ${p.trimester.term_name} ${p.trimester.year}
                            </span>
                        </div>

                        <!-- Award Distinction Ribbon (if awarded) -->
                        ${awardBadgeHtml ? `<div class="mb-3">${awardBadgeHtml}</div>` : ''}

                        <!-- Project Title (Full Title, NEVER Truncated Awkwardly) -->
                        <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug break-words hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer" onclick="app.openProjectDetail(${p.project_id})">
                            ${this.escapeHtml(p.title)}
                        </h3>

                        <!-- Abstract Excerpt -->
                        <p class="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed break-words">
                            ${this.escapeHtml(p.abstract)}
                        </p>

                        <!-- Tech Stack Tags -->
                        <div class="flex flex-wrap gap-1.5 mt-3.5">
                            ${techPills}
                            ${p.tech_tags.length > 4 ? `<span class="px-1.5 py-0.5 text-[10px] text-slate-400 dark:text-slate-500">+${p.tech_tags.length - 4} more</span>` : ''}
                        </div>
                    </div>

                    <!-- Card Footer: Team Leader & Action Button (Responsive, No Text Overflow) -->
                    <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <div class="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                ${p.leader.name.charAt(0)}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title="${this.escapeHtml(p.leader.name)}">
                                    ${this.escapeHtml(p.leader.name)}
                                </p>
                                <p class="text-[10px] text-slate-400">
                                    ${p.members.length} team members
                                </p>
                            </div>
                        </div>

                        <button onclick="app.openProjectDetail(${p.project_id})" class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition flex-shrink-0">
                            <span>Details</span>
                            <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = cardsHtml;
    }
    getCourseColor(courseCode) {
        if (courseCode.includes('3412') || courseCode.includes('3411')) {
            return 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
        }
        else if (courseCode.includes('4165')) {
            return 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
        }
        else if (courseCode.includes('4326') || courseCode.includes('4325')) {
            return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        }
        else if (courseCode.includes('2124') || courseCode.includes('2123')) {
            return 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
        }
        else if (courseCode.includes('3812') || courseCode.includes('3811')) {
            return 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800';
        }
        else if (courseCode.includes('4000 A') || courseCode.includes('4000A')) {
            return 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
        }
        else if (courseCode.includes('4000 B') || courseCode.includes('4000B')) {
            return 'bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
        }
        else {
            return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
        }
    }
    getAwardBadgeHtml(award) {
        if (!award)
            return '';
        let badgeClass = 'badge-award-2nd';
        let iconSvg = `<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`;
        if (award.award_title === '1st Prize') {
            badgeClass = 'badge-award-1st';
            iconSvg = `<svg class="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
        }
        else if (award.award_title === '2nd Prize') {
            badgeClass = 'badge-award-2nd';
        }
        else if (award.award_title === '3rd Prize') {
            badgeClass = 'badge-award-3rd';
        }
        else if (award.award_title === 'Best FYDP') {
            badgeClass = 'badge-award-best';
        }
        else if (award.award_title === 'Best Innovation') {
            badgeClass = 'badge-award-innovation';
        }
        return `
            <div class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${badgeClass}">
                ${iconSvg}
                <span>${award.award_title}</span>
                ${award.prize_money > 0 ? `<span class="ml-1 opacity-80 font-normal">• ৳ ${Number(award.prize_money).toLocaleString()}</span>` : ''}
            </div>
        `;
    }
    // --------------------------------------------------------------------------
    // PROJECT DETAILS MODAL (RESPONSIVE FOR ALL SCREEN SIZES)
    // --------------------------------------------------------------------------
    async openProjectDetail(projectId) {
        const modal = document.getElementById('project-detail-modal');
        const modalContent = document.getElementById('detail-modal-body');
        if (!modal || !modalContent)
            return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        modalContent.innerHTML = `
            <div class="py-16 text-center">
                <div class="inline-block animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mb-3"></div>
                <p class="text-xs text-slate-500 font-medium">Retrieving project dossier...</p>
            </div>
        `;
        try {
            const res = await fetch(`${this.apiBase}/project-detail.php?id=${projectId}`);
            const data = await res.json();
            if (!data.success || !data.project) {
                modalContent.innerHTML = `<p class="p-6 text-red-500 text-xs">Error: ${data.message || 'Project not found.'}</p>`;
                return;
            }
            const p = data.project;
            const courseColor = this.getCourseColor(p.course.course_code);
            const awardBadge = this.getAwardBadgeHtml(p.award);
            // Members list (responsive rows)
            const membersListHtml = p.members.map(m => `
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
                    <div class="flex items-center space-x-2.5 min-w-0">
                        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            ${(m.full_name || m.name || 'S').charAt(0)}
                        </div>
                        <div class="min-w-0">
                            <p class="font-bold text-slate-900 dark:text-white truncate">
                                ${this.escapeHtml(m.full_name || m.name || '')}
                            </p>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">ID: ${m.student_id}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        ${m.role === 'Leader'
                ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">Team Leader</span>'
                : '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Member</span>'}
                    </div>
                </div>
            `).join('');
            // Audit Trail items
            const auditItems = p.audit_trail.map(a => `
                <li class="relative pl-5 pb-3 last:pb-0 text-xs border-l border-slate-200 dark:border-slate-700">
                    <span class="absolute -left-1.5 top-0.5 w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <div class="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span class="font-bold text-slate-700 dark:text-slate-300">${a.action_type}</span>
                        <span>${a.timestamp}</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400">${this.escapeHtml(a.details)}</p>
                </li>
            `).join('');
            modalContent.innerHTML = `
                <!-- Modal Header -->
                <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded text-xs font-bold ${courseColor}">${p.course.course_code}</span>
                            <span class="text-xs text-slate-500 font-medium">${p.course.course_title}</span>
                        </div>
                        <span class="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-medium">
                            ${p.trimester.session}
                        </span>
                    </div>

                    <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug break-words pr-8">
                        ${this.escapeHtml(p.title)}
                    </h2>

                    ${awardBadge ? `
                        <div class="mt-3 p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-center justify-between">
                            <div>
                                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-200">${p.award?.award_title} Distinction</h4>
                                <p class="text-[11px] text-amber-800 dark:text-amber-400">${p.award?.remarks || 'Awarded at UIU Showcase'}</p>
                            </div>
                            ${p.award?.prize_money ? `
                                <div class="text-right">
                                    <span class="text-[10px] text-amber-700 dark:text-amber-400 block font-semibold">Prize Grant</span>
                                    <span class="text-sm font-bold text-amber-900 dark:text-amber-100">৳ ${Number(p.award.prize_money).toLocaleString()}</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>

                <!-- Modal Body -->
                <div class="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
                    <!-- Project Abstract -->
                    <div>
                        <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Project Abstract</h4>
                        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 break-words">
                            ${this.escapeHtml(p.abstract)}
                        </p>
                    </div>

                    <!-- Tech Stack Tags -->
                    <div>
                        <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Technologies & Architecture</h4>
                        <div class="flex flex-wrap gap-2">
                            ${p.tech_tags.map(t => `<span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">${t}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Student Team List -->
                    <div>
                        <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Student Engineering Team (${p.members.length} Members)</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            ${membersListHtml}
                        </div>
                    </div>

                    <!-- Repositories & External Links -->
                    <div>
                        <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Repository & Artifacts</h4>
                        <div class="flex flex-wrap gap-2.5">
                            ${p.github_url ? `
                                <a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-800 transition">
                                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                                    GitHub Repository
                                </a>
                            ` : ''}

                            ${p.demo_url ? `
                                <a href="${p.demo_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700 transition">
                                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    Live Demo URL
                                </a>
                            ` : ''}

                            ${!p.github_url && !p.demo_url ? '<p class="text-xs text-slate-400">Institutional offline archive entry.</p>' : ''}
                        </div>
                    </div>

                    <!-- Audit Trail Accordion -->
                    ${p.audit_trail.length > 0 ? `
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
                            <details class="group">
                                <summary class="flex items-center justify-between cursor-pointer text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 select-none">
                                    <span>Database Institutional Audit Trail (${p.audit_trail.length} Records)</span>
                                    <span class="transition group-open:rotate-180">▼</span>
                                </summary>
                                <div class="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <ul class="space-y-2.5">
                                        ${auditItems}
                                    </ul>
                                </div>
                            </details>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        catch (err) {
            modalContent.innerHTML = `<p class="p-6 text-red-500 text-xs">Failed to load project details.</p>`;
        }
    }
    closeProjectModal() {
        const modal = document.getElementById('project-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    // --------------------------------------------------------------------------
    // DYNAMIC ADD COURSE MODAL
    // --------------------------------------------------------------------------
    openAddCourseModal() {
        const modal = document.getElementById('add-course-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            document.getElementById('new-course-code')?.focus();
        }
    }
    closeAddCourseModal() {
        const modal = document.getElementById('add-course-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            const feedback = document.getElementById('add-course-feedback');
            if (feedback)
                feedback.classList.add('hidden');
        }
    }
    async handleCourseSubmit(e) {
        e.preventDefault();
        const codeInput = document.getElementById('new-course-code');
        const titleInput = document.getElementById('new-course-title');
        const deptSelect = document.getElementById('new-course-dept');
        const submitBtn = document.getElementById('submit-course-btn');
        const feedback = document.getElementById('add-course-feedback');
        if (!codeInput || !titleInput || !deptSelect)
            return;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inserting Course...';
        try {
            const res = await fetch(`${this.apiBase}/add-course.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_code: codeInput.value.trim(),
                    course_title: titleInput.value.trim(),
                    dept_id: parseInt(deptSelect.value, 10) || 1
                })
            });
            const data = await res.json();
            if (feedback) {
                feedback.classList.remove('hidden');
                if (data.success) {
                    feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                    feedback.textContent = `Course "${data.course.course_code}" added successfully!`;
                    codeInput.value = '';
                    titleInput.value = '';
                    this.coursesList = data.courses;
                    this.renderDropdowns(data.courses, this.trimestersList);
                    this.renderCoursePills(data.courses);
                    setTimeout(() => {
                        this.closeAddCourseModal();
                    }, 1400);
                }
                else {
                    feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
                    feedback.textContent = data.message || 'Failed to add course.';
                }
            }
        }
        catch (err) {
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-red-100 text-red-800';
                feedback.textContent = 'Server connection error.';
            }
        }
        finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Course into Database';
        }
    }
    // --------------------------------------------------------------------------
    // DYNAMIC ADD PROJECT MODAL
    // --------------------------------------------------------------------------
    openAddProjectModal() {
        const modal = document.getElementById('add-project-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            document.getElementById('new-project-title')?.focus();
        }
    }
    closeAddProjectModal() {
        const modal = document.getElementById('add-project-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            const feedback = document.getElementById('add-project-feedback');
            if (feedback)
                feedback.classList.add('hidden');
        }
    }
    async handleProjectSubmit(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-project-btn');
        const feedback = document.getElementById('add-project-feedback');
        const titleInput = document.getElementById('new-project-title');
        const courseSelect = document.getElementById('new-project-course');
        const trimesterSelect = document.getElementById('new-project-trimester');
        const abstractInput = document.getElementById('new-project-abstract');
        const techInput = document.getElementById('new-project-tech');
        const githubInput = document.getElementById('new-project-github');
        const demoInput = document.getElementById('new-project-demo');
        const leaderNameInput = document.getElementById('new-project-leader-name');
        const leaderIdInput = document.getElementById('new-project-leader-id');
        const supervisorSelect = document.getElementById('new-project-supervisor');
        const awardSelect = document.getElementById('new-project-award');
        const prizeInput = document.getElementById('new-project-prize');
        if (!titleInput || !courseSelect || !trimesterSelect || !abstractInput || !techInput || !leaderNameInput || !leaderIdInput) {
            return;
        }
        const payload = {
            title: titleInput.value.trim(),
            course_id: parseInt(courseSelect.value, 10),
            trimester_id: parseInt(trimesterSelect.value, 10),
            abstract: abstractInput.value.trim(),
            tech_stack: techInput.value.trim(),
            github_url: githubInput ? githubInput.value.trim() : '',
            demo_url: demoInput ? demoInput.value.trim() : '',
            leader_name: leaderNameInput.value.trim(),
            leader_id: leaderIdInput.value.trim(),
            supervisor_id: supervisorSelect && supervisorSelect.value ? parseInt(supervisorSelect.value, 10) : null,
            award_title: awardSelect ? awardSelect.value : 'None',
            prize_money: prizeInput ? parseFloat(prizeInput.value) || 0 : 0
        };
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving Project...';
        }
        try {
            const res = await fetch(`${this.apiBase}/add-project.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (feedback) {
                feedback.classList.remove('hidden');
                if (data.success) {
                    feedback.className = 'p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl mb-4';
                    feedback.textContent = 'Project registered into database successfully!';
                    document.getElementById('add-project-form')?.reset();
                    await this.loadProjectsAndMeta();
                    setTimeout(() => {
                        this.closeAddProjectModal();
                    }, 1400);
                }
                else {
                    feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
                    feedback.textContent = data.message || 'Failed to add project.';
                }
            }
        }
        catch (err) {
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
                feedback.textContent = err.message || 'Could not connect to server.';
            }
        }
        finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register & Archive Project';
            }
        }
    }
    // --------------------------------------------------------------------------
    // VIVA & EVALUATION SQL EXPLORER
    // --------------------------------------------------------------------------
    openVivaModal() {
        const modal = document.getElementById('viva-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.loadVivaCatalog();
        }
    }
    closeVivaModal() {
        const modal = document.getElementById('viva-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
    async loadVivaCatalog() {
        const container = document.getElementById('viva-queries-list');
        const mobileSelect = document.getElementById('mobile-viva-select');
        if (!container)
            return;
        try {
            const res = await fetch(`${this.apiBase}/queries.php`);
            const data = await res.json();
            if (data.success && data.catalog) {
                this.queryCatalog = data.catalog;
                let html = '';
                let selectOptions = '';
                data.catalog.forEach((q) => {
                    html += `
                        <button onclick="app.executeVivaQuery(${q.id})" class="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-slate-800/80 transition flex items-start justify-between group">
                            <div class="min-w-0 pr-2">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">${q.category}</span>
                                <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition truncate">${q.id}. ${q.title}</h5>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${q.description}</p>
                            </div>
                            <span class="text-slate-400 group-hover:text-orange-500 text-xs font-bold flex-shrink-0 mt-1">▶</span>
                        </button>
                    `;
                    selectOptions += `<option value="${q.id}">Query ${q.id}: ${q.title} (${q.category})</option>`;
                });
                container.innerHTML = html;
                if (mobileSelect)
                    mobileSelect.innerHTML = selectOptions;
                // Auto-run query 1 on first load
                this.executeVivaQuery(1);
            }
        }
        catch (err) {
            container.innerHTML = `<p class="p-4 text-xs text-red-500">Could not load SQL catalogue.</p>`;
        }
    }
    async executeVivaQuery(queryId) {
        const outputContainer = document.getElementById('viva-query-output');
        if (!outputContainer)
            return;
        // Sync mobile select if open
        const mobileSelect = document.getElementById('mobile-viva-select');
        if (mobileSelect && mobileSelect.value !== String(queryId)) {
            mobileSelect.value = String(queryId);
        }
        outputContainer.innerHTML = `
            <div class="py-12 text-center">
                <div class="inline-block animate-spin w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full mb-2"></div>
                <p class="text-xs text-slate-500">Executing prepared SQL query in MySQL engine...</p>
            </div>
        `;
        try {
            const res = await fetch(`${this.apiBase}/queries.php?id=${queryId}`);
            const data = await res.json();
            if (!data.success) {
                outputContainer.innerHTML = `<p class="p-4 text-xs text-red-500">Execution Error: ${data.message}</p>`;
                return;
            }
            // Headers
            const ths = data.columns.map(c => `<th class="py-2.5 px-3 text-left font-mono font-bold text-[11px] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap bg-slate-100 dark:bg-slate-800">${c}</th>`).join('');
            // Rows (NO TRUNCATION in table cells so instructor can inspect entire result)
            const trs = data.rows.map(r => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
                    ${data.columns.map(c => `<td class="py-2 px-3 text-slate-700 dark:text-slate-300 break-words max-w-xs">${this.escapeHtml(String(r[c] ?? 'NULL'))}</td>`).join('')}
                </tr>
            `).join('');
            outputContainer.innerHTML = `
                <div>
                    <!-- Query Info Bar -->
                    <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
                        <div class="min-w-0">
                            <span class="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">${data.meta.category}</span>
                            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${data.meta.id}. ${data.meta.title}</h4>
                            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${data.meta.description}</p>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <span class="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold font-mono">
                                ⚡ ${data.execution_ms} ms
                            </span>
                            <span class="px-2 py-0.5 rounded text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold font-mono">
                                ${data.row_count} rows
                            </span>
                        </div>
                    </div>

                    <!-- SQL Code Box with Copy Option -->
                    <div class="mb-3 relative group">
                        <pre class="p-3 bg-slate-900 text-amber-300 dark:bg-black rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed select-all">${this.escapeHtml(data.meta.sql)}</pre>
                        <button onclick="navigator.clipboard.writeText('${this.escapeJsString(data.meta.sql)}'); this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy SQL', 1500);" class="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-700 opacity-90 hover:opacity-100 transition">
                            Copy SQL
                        </button>
                    </div>

                    <!-- Result Data Table (Fully Scrollable) -->
                    <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl max-h-[380px] overflow-y-auto">
                        <table class="w-full border-collapse">
                            <thead class="sticky top-0 z-10 shadow-sm">
                                <tr>${ths}</tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                ${trs}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
        catch (err) {
            outputContainer.innerHTML = `<p class="p-4 text-xs text-red-500">Failed to execute query.</p>`;
        }
    }
    // --------------------------------------------------------------------------
    // UTILITY HELPERS
    // --------------------------------------------------------------------------
    resetFilters() {
        this.currentFilters = {
            course_id: '',
            trimester_id: '',
            award: 'all',
            tech: '',
            search: '',
            sort: 'newest'
        };
        const heroInput = document.getElementById('hero-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        if (heroInput)
            heroInput.value = '';
        if (clearBtn)
            clearBtn.classList.add('hidden');
        const courseSelect = document.getElementById('course-filter');
        if (courseSelect)
            courseSelect.value = '';
        const trimesterSelect = document.getElementById('trimester-filter');
        if (trimesterSelect)
            trimesterSelect.value = '';
        const awardSelect = document.getElementById('award-filter');
        if (awardSelect)
            awardSelect.value = 'all';
        const sortSelect = document.getElementById('sort-filter');
        if (sortSelect)
            sortSelect.value = 'newest';
        this.syncCoursePills();
        this.loadProjects();
    }
    renderLoading(isLoading) {
        const spinner = document.getElementById('loading-indicator');
        if (spinner) {
            if (isLoading) {
                spinner.classList.remove('hidden');
            }
            else {
                spinner.classList.add('hidden');
            }
        }
    }
    showErrorNotice(message) {
        const grid = document.getElementById('projects-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-center">
                    <h3 class="text-sm font-bold text-red-900 dark:text-red-200">Database Connection Required</h3>
                    <p class="text-xs text-red-700 dark:text-red-300 mt-1 max-w-md mx-auto">${message}</p>
                    <div class="mt-3 text-xs font-mono bg-white dark:bg-black p-3 rounded-lg text-slate-700 dark:text-slate-300 inline-block text-left">
                        1. Start MySQL in XAMPP<br>
                        2. Open phpMyAdmin: http://localhost/phpmyadmin<br>
                        3. Database: <b>uiu_project_showcase</b>
                    </div>
                </div>
            `;
        }
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    escapeJsString(str) {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '');
    }
}
// Global instantiation
window.addEventListener('DOMContentLoaded', () => {
    window.app = new ShowcaseApp();
});
