/**
 * UIU Project Showcase & Archive System
 * Client-Side TypeScript Application
 * 
 * Handles dynamic filtering, live search with debounce, modals,
 * asynchronous API requests, and interactive SQL Viva Explorer.
 */

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

interface TeamMember {
    user_id: number;
    student_id: string;
    full_name: string;
    name?: string;
    role: 'Leader' | 'Member';
    dept?: string;
    contribution?: string;
}

interface Award {
    award_id: number;
    award_title: string;
    prize_money: number;
    remarks: string;
    event_title: string;
    event_date: string;
    venue?: string;
}

interface Course {
    course_id: number;
    course_code: string;
    course_title: string;
    dept_code: string;
    project_count?: number;
}

interface Trimester {
    trimester_id: number;
    trimester_code: string;
    term_name: string;
    year: number;
    session_label: string;
    project_count?: number;
}

interface Project {
    project_id: number;
    title: string;
    abstract: string;
    tech_stack: string;
    tech_tags: string[];
    github_url: string | null;
    demo_url: string | null;
    submission_date: string;
    status: string;
    course: {
        course_id: number;
        course_code: string;
        course_title: string;
        dept_code: string;
    };
    trimester: {
        trimester_id: number;
        trimester_code: string;
        term_name: string;
        year: number;
        session: string;
    };
    supervisor: {
        name: string;
        email: string;
    } | null;
    award: Award | null;
    leader: {
        name: string;
        student_id: string;
    };
    members: TeamMember[];
}

interface AuditLog {
    log_id: number;
    action_type: string;
    timestamp: string;
    details: string;
    performed_by_name: string | null;
    performed_by_role: string | null;
}

interface ProjectDetailResponse {
    success: boolean;
    project: Project & {
        created_at: string;
        updated_at: string;
        members: Array<TeamMember & { email?: string; joined_at?: string; name: string }>;
        audit_trail: AuditLog[];
    };
    message?: string;
}

interface MetaStats {
    total_projects: number;
    total_fydp: number;
    total_award_winners: number;
    total_prize_distributed: number;
    total_student_innovators: number;
}

interface SupervisorItem {
    user_id: number;
    full_name: string;
    student_or_faculty_id: string;
    email: string;
}

interface ProjectsApiResponse {
    success: boolean;
    count: number;
    projects: Project[];
    meta: {
        stats: MetaStats;
        courses: Course[];
        trimesters: Trimester[];
        supervisors?: SupervisorItem[];
        popular_techs: string[];
        award_types: Record<string, string>;
    };
    message?: string;
}

interface QueryCatalogItem {
    id: number;
    category: string;
    title: string;
    description: string;
    sql: string;
}

interface QueryResultResponse {
    success: boolean;
    meta: QueryCatalogItem;
    execution_ms: number;
    row_count: number;
    columns: string[];
    rows: Array<Record<string, any>>;
    message?: string;
}

// ==============================================================================
// APPLICATION STATE
// ==============================================================================

class ShowcaseApp {
    private apiBase: string = 'api';
    private currentFilters = {
        course_id: '',
        trimester_id: '',
        award: 'all',
        tech: '',
        search: '',
        sort: 'newest'
    };

    private searchDebounceTimer: number | null = null;
    private coursesList: Course[] = [];
    private trimestersList: Trimester[] = [];
    private supervisorsList: SupervisorItem[] = [];
    private isDarkTheme: boolean = false;

    constructor() {
        this.initTheme();
        this.initEventListeners();
        this.loadProjectsAndMeta();
    }

    // --------------------------------------------------------------------------
    // THEME MANAGEMENT (DARK / LIGHT MODE)
    // --------------------------------------------------------------------------
    private initTheme(): void {
        const savedTheme = localStorage.getItem('uiu_showcase_theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            this.isDarkTheme = true;
        } else {
            document.documentElement.classList.remove('dark');
            this.isDarkTheme = false;
        }
        this.updateThemeToggleIcon();
    }

    public toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('uiu_showcase_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('uiu_showcase_theme', 'light');
        }
        this.updateThemeToggleIcon();
    }

    private updateThemeToggleIcon(): void {
        const iconContainer = document.getElementById('theme-toggle-icon');
        if (iconContainer) {
            iconContainer.innerHTML = this.isDarkTheme
                ? `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
                : `<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
        }
    }

    // --------------------------------------------------------------------------
    // EVENT LISTENERS BINDING
    // --------------------------------------------------------------------------
    private initEventListeners(): void {
        // Theme button
        document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

        // Search inputs (Hero + Filter bar)
        const heroSearchInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
        heroSearchInput?.addEventListener('input', (e) => this.handleSearchInput((e.target as HTMLInputElement).value));

        const filterSearchInput = document.getElementById('filter-search-input') as HTMLInputElement | null;
        filterSearchInput?.addEventListener('input', (e) => this.handleSearchInput((e.target as HTMLInputElement).value));

        // Filter Dropdowns
        document.getElementById('course-filter')?.addEventListener('change', (e) => {
            this.currentFilters.course_id = (e.target as HTMLSelectElement).value;
            this.syncCoursePills();
            this.loadProjects();
        });

        document.getElementById('trimester-filter')?.addEventListener('change', (e) => {
            this.currentFilters.trimester_id = (e.target as HTMLSelectElement).value;
            this.loadProjects();
        });

        document.getElementById('award-filter')?.addEventListener('change', (e) => {
            this.currentFilters.award = (e.target as HTMLSelectElement).value;
            this.loadProjects();
        });

        document.getElementById('sort-filter')?.addEventListener('change', (e) => {
            this.currentFilters.sort = (e.target as HTMLSelectElement).value;
            this.loadProjects();
        });

        // Reset Filters Button
        document.getElementById('reset-filters-btn')?.addEventListener('click', () => this.resetFilters());

        // Modals close triggers
        document.getElementById('close-detail-modal-btn')?.addEventListener('click', () => this.closeProjectModal());
        document.getElementById('detail-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeProjectModal();
        });

        document.getElementById('close-add-course-btn')?.addEventListener('click', () => this.closeAddCourseModal());
        document.getElementById('open-add-course-btn')?.addEventListener('click', () => this.openAddCourseModal());
        document.getElementById('add-course-form')?.addEventListener('submit', (e) => this.handleCourseSubmit(e));

        // Add Project Modal triggers
        document.getElementById('close-add-project-btn')?.addEventListener('click', () => this.closeAddProjectModal());
        document.getElementById('open-add-project-btn')?.addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('add-project-backdrop')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeAddProjectModal();
        });
        document.getElementById('add-project-form')?.addEventListener('submit', (e) => this.handleProjectSubmit(e));

        // Viva SQL Explorer triggers
        document.getElementById('open-viva-btn')?.addEventListener('click', () => this.openVivaModal());
        document.getElementById('close-viva-modal-btn')?.addEventListener('click', () => this.closeVivaModal());
        document.getElementById('viva-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeVivaModal();
        });

        // Close on ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
                this.closeAddCourseModal();
                this.closeAddProjectModal();
                this.closeVivaModal();
            }
        });
    }

    // --------------------------------------------------------------------------
    // LIVE SEARCH WITH DEBOUNCE
    // --------------------------------------------------------------------------
    private handleSearchInput(value: string): void {
        if (this.searchDebounceTimer) {
            window.clearTimeout(this.searchDebounceTimer);
        }

        this.searchDebounceTimer = window.setTimeout(() => {
            this.currentFilters.search = value.trim();

            // Synchronize both search input fields
            const heroInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
            const filterInput = document.getElementById('filter-search-input') as HTMLInputElement | null;
            if (heroInput && heroInput.value !== value) heroInput.value = value;
            if (filterInput && filterInput.value !== value) filterInput.value = value;

            this.loadProjects();
        }, 280);
    }

    // --------------------------------------------------------------------------
    // FETCH PROJECTS & METADATA
    // --------------------------------------------------------------------------
    public async loadProjectsAndMeta(): Promise<void> {
        this.renderLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (this.currentFilters.course_id) queryParams.set('course_id', this.currentFilters.course_id);
            if (this.currentFilters.trimester_id) queryParams.set('trimester_id', this.currentFilters.trimester_id);
            if (this.currentFilters.award && this.currentFilters.award !== 'all') queryParams.set('award', this.currentFilters.award);
            if (this.currentFilters.tech) queryParams.set('tech', this.currentFilters.tech);
            if (this.currentFilters.search) queryParams.set('search', this.currentFilters.search);
            if (this.currentFilters.sort) queryParams.set('sort', this.currentFilters.sort);

            const res = await fetch(`${this.apiBase}/projects.php?${queryParams.toString()}`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);

            const data: ProjectsApiResponse = await res.json();
            if (data.success) {
                this.coursesList = data.meta.courses;
                this.trimestersList = data.meta.trimesters;
                if (data.meta.supervisors) {
                    this.supervisorsList = data.meta.supervisors;
                }

                this.renderStats(data.meta.stats);
                this.renderDropdowns(data.meta.courses, data.meta.trimesters, data.meta.supervisors);
                this.renderCoursePills(data.meta.courses);
                this.renderPopularTechs(data.meta.popular_techs);
                this.renderProjectCards(data.projects);
            } else {
                this.showErrorNotice(data.message || 'Unable to retrieve projects.');
            }
        } catch (err: any) {
            console.error('Fetch Projects Error:', err);
            this.showErrorNotice('Database connection failed. Please ensure XAMPP MySQL is active and `uiu_project_showcase` schema is imported.');
        } finally {
            this.renderLoading(false);
        }
    }

    public async loadProjects(): Promise<void> {
        this.renderLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (this.currentFilters.course_id) queryParams.set('course_id', this.currentFilters.course_id);
            if (this.currentFilters.trimester_id) queryParams.set('trimester_id', this.currentFilters.trimester_id);
            if (this.currentFilters.award && this.currentFilters.award !== 'all') queryParams.set('award', this.currentFilters.award);
            if (this.currentFilters.tech) queryParams.set('tech', this.currentFilters.tech);
            if (this.currentFilters.search) queryParams.set('search', this.currentFilters.search);
            if (this.currentFilters.sort) queryParams.set('sort', this.currentFilters.sort);

            const res = await fetch(`${this.apiBase}/projects.php?${queryParams.toString()}`);
            const data: ProjectsApiResponse = await res.json();

            if (data.success) {
                this.renderProjectCards(data.projects);
            }
        } catch (err) {
            console.error('Failed to reload projects:', err);
        } finally {
            this.renderLoading(false);
        }
    }

    // --------------------------------------------------------------------------
    // RENDERING STATS & METADATA
    // --------------------------------------------------------------------------
    private renderStats(stats: MetaStats): void {
        const totalProjectsEl = document.getElementById('stat-total-projects');
        const totalFydpEl = document.getElementById('stat-total-fydp');
        const totalWinnersEl = document.getElementById('stat-total-winners');
        const totalPrizeEl = document.getElementById('stat-total-prize');

        if (totalProjectsEl) totalProjectsEl.textContent = stats.total_projects.toString();
        if (totalFydpEl) totalFydpEl.textContent = stats.total_fydp.toString();
        if (totalWinnersEl) totalWinnersEl.textContent = stats.total_award_winners.toString();
        if (totalPrizeEl) totalPrizeEl.textContent = `৳ ${Number(stats.total_prize_distributed).toLocaleString('en-US')}`;
    }

    private renderDropdowns(courses: Course[], trimesters: Trimester[], supervisors?: SupervisorItem[]): void {
        const courseSelect = document.getElementById('course-filter') as HTMLSelectElement | null;
        if (courseSelect) {
            const currentVal = courseSelect.value;
            courseSelect.innerHTML = `<option value="">All Courses</option>`;
            courses.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.course_id.toString();
                opt.textContent = `${c.course_code}: ${c.course_title}`;
                courseSelect.appendChild(opt);
            });
            courseSelect.value = currentVal;
        }

        const trimesterSelect = document.getElementById('trimester-filter') as HTMLSelectElement | null;
        if (trimesterSelect) {
            const currentVal = trimesterSelect.value;
            trimesterSelect.innerHTML = `<option value="">All Trimesters</option>`;
            trimesters.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.trimester_id.toString();
                opt.textContent = `${t.term_name} ${t.year} (${t.trimester_code})`;
                trimesterSelect.appendChild(opt);
            });
            trimesterSelect.value = currentVal;
        }

        // Add Project Course Dropdown
        const newProjCourse = document.getElementById('new-project-course') as HTMLSelectElement | null;
        if (newProjCourse) {
            const curVal = newProjCourse.value;
            newProjCourse.innerHTML = `<option value="">-- Select Showcase Course --</option>`;
            courses.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.course_id.toString();
                opt.textContent = `${c.course_code}: ${c.course_title}`;
                newProjCourse.appendChild(opt);
            });
            if (curVal) newProjCourse.value = curVal;
        }

        // Add Project Trimester Dropdown
        const newProjTrimester = document.getElementById('new-project-trimester') as HTMLSelectElement | null;
        if (newProjTrimester) {
            const curVal = newProjTrimester.value;
            newProjTrimester.innerHTML = `<option value="">-- Select Trimester --</option>`;
            trimesters.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.trimester_id.toString();
                opt.textContent = `${t.term_name} ${t.year} (${t.trimester_code})`;
                newProjTrimester.appendChild(opt);
            });
            if (curVal) newProjTrimester.value = curVal;
        }

        // Add Project Supervisor Dropdown
        const newProjSupervisor = document.getElementById('new-project-supervisor') as HTMLSelectElement | null;
        const sups = supervisors || this.supervisorsList;
        if (newProjSupervisor && sups.length > 0) {
            const curVal = newProjSupervisor.value;
            newProjSupervisor.innerHTML = `<option value="">-- Unassigned / Optional --</option>`;
            sups.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.user_id.toString();
                opt.textContent = `${s.full_name} (${s.student_or_faculty_id})`;
                newProjSupervisor.appendChild(opt);
            });
            if (curVal) newProjSupervisor.value = curVal;
        }

        // Also update Add Course Dept Select if present
        const deptSelect = document.getElementById('new-course-dept') as HTMLSelectElement | null;
        if (deptSelect && deptSelect.children.length === 0) {
            deptSelect.innerHTML = `
                <option value="1">CSE - Computer Science & Engineering</option>
                <option value="2">EEE - Electrical & Electronic Engineering</option>
                <option value="3">CE - Civil Engineering</option>
                <option value="4">SoBE - School of Business & Economics</option>
            `;
        }
    }

    private renderCoursePills(courses: Course[]): void {
        const container = document.getElementById('course-pills-container');
        if (!container) return;

        let html = `
            <button data-course-id="" class="course-pill px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                this.currentFilters.course_id === ''
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }">
                All Courses
            </button>
        `;

        courses.forEach(c => {
            const isSelected = this.currentFilters.course_id === c.course_id.toString();
            html += `
                <button data-course-id="${c.course_id}" class="course-pill px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isSelected
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }" title="${c.course_title}">
                    ${c.course_code}
                </button>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.course-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const courseId = target.getAttribute('data-course-id') || '';
                this.currentFilters.course_id = courseId;
                
                // Sync select
                const select = document.getElementById('course-filter') as HTMLSelectElement | null;
                if (select) select.value = courseId;

                this.syncCoursePills();
                this.loadProjects();
            });
        });
    }

    private syncCoursePills(): void {
        document.querySelectorAll('.course-pill').forEach(btn => {
            const cid = btn.getAttribute('data-course-id') || '';
            if (cid === this.currentFilters.course_id) {
                btn.className = 'course-pill px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all bg-orange-600 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/20';
            } else {
                btn.className = 'course-pill px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';
            }
        });
    }

    private renderPopularTechs(techs: string[]): void {
        const container = document.getElementById('popular-techs-container');
        if (!container) return;

        let html = '';
        techs.forEach(t => {
            const isSelected = this.currentFilters.tech.toLowerCase() === t.toLowerCase();
            html += `
                <button data-tech="${t}" class="tech-tag-pill px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400'
                }">
                    #${t}
                </button>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.tech-tag-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = (e.currentTarget as HTMLButtonElement).getAttribute('data-tech') || '';
                if (this.currentFilters.tech === tag) {
                    this.currentFilters.tech = '';
                } else {
                    this.currentFilters.tech = tag;
                }
                this.renderPopularTechs(techs);
                this.loadProjects();
            });
        });
    }

    // --------------------------------------------------------------------------
    // RENDERING PROJECT CARDS
    // --------------------------------------------------------------------------
    private renderProjectCards(projects: Project[]): void {
        const grid = document.getElementById('projects-grid');
        const countDisplay = document.getElementById('results-count-display');
        if (!grid) return;

        if (countDisplay) {
            countDisplay.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;
        }

        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center">
                    <div class="w-20 h-20 mx-auto mb-4 text-slate-400 dark:text-slate-600">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                        No projects match your current filter criteria. Try resetting the filters or searching with different keywords.
                    </p>
                    <button id="empty-state-reset-btn" class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
                        Clear All Filters
                    </button>
                </div>
            `;
            document.getElementById('empty-state-reset-btn')?.addEventListener('click', () => this.resetFilters());
            return;
        }

        let cardsHtml = '';
        projects.forEach(p => {
            const courseColor = this.getCourseColor(p.course.course_code);
            const awardBadge = this.getAwardBadgeHtml(p.award);
            const techPills = p.tech_tags.slice(0, 4).map(t => 
                `<span class="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded">${t}</span>`
            ).join('');

            cardsHtml += `
                <div class="project-card flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-orange-300 dark:hover:border-orange-500/40 relative">
                    <div>
                        <!-- Header with Course & Award Ribbon -->
                        <div class="flex items-start justify-between gap-2 mb-3">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${courseColor}">
                                ${p.course.course_code}
                            </span>
                            <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
                                ${p.trimester.term_name} '${p.trimester.year.toString().slice(-2)}
                            </span>
                        </div>

                        ${awardBadge ? `<div class="mb-3">${awardBadge}</div>` : ''}

                        <!-- Project Title -->
                        <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer" onclick="app.openProjectDetail(${p.project_id})">
                            ${this.escapeHtml(p.title)}
                        </h3>

                        <!-- Abstract Excerpt -->
                        <p class="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                            ${this.escapeHtml(p.abstract)}
                        </p>

                        <!-- Tech Stack Tags -->
                        <div class="flex flex-wrap gap-1.5 mt-4">
                            ${techPills}
                            ${p.tech_tags.length > 4 ? `<span class="px-1.5 py-0.5 text-[10px] text-slate-400">+${p.tech_tags.length - 4}</span>` : ''}
                        </div>
                    </div>

                    <!-- Card Footer: Team Leader & Action Button -->
                    <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <div class="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs uppercase">
                                ${p.leader.name.charAt(0)}
                            </div>
                            <div class="text-left">
                                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">${p.leader.name}</p>
                                <p class="text-[10px] text-slate-400">${p.members.length} team members</p>
                            </div>
                        </div>

                        <button onclick="app.openProjectDetail(${p.project_id})" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition">
                            <span>Details</span>
                            <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = cardsHtml;
    }

    private getCourseColor(courseCode: string): string {
        if (courseCode.includes('3412') || courseCode.includes('3411')) {
            // SAD Lab
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
        } else if (courseCode.includes('4165')) {
            // Web Programming
            return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800';
        } else if (courseCode.includes('4326') || courseCode.includes('4325')) {
            // Microprocessors Lab
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
        } else if (courseCode.includes('2124') || courseCode.includes('2123')) {
            // Electronics Lab
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
        } else if (courseCode.includes('3812') || courseCode.includes('3811')) {
            // AI Lab
            return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 dark:border-teal-800';
        } else if (courseCode.includes('4000 A') || courseCode.includes('4000A')) {
            // FYDP-1
            return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800';
        } else if (courseCode.includes('4000 B') || courseCode.includes('4000B')) {
            // FYDP-2
            return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800';
        } else {
            // DBMS Lab or others
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800';
        }
    }

    private getAwardBadgeHtml(award: Award | null): string {
        if (!award) return '';

        let badgeClass = 'badge-gold';
        let icon = '🏆';

        if (award.award_title === '1st Prize') {
            badgeClass = 'badge-gold';
            icon = '🥇';
        } else if (award.award_title === '2nd Prize') {
            badgeClass = 'badge-silver';
            icon = '🥈';
        } else if (award.award_title === '3rd Prize') {
            badgeClass = 'badge-bronze';
            icon = '🥉';
        } else if (award.award_title === 'Best FYDP') {
            badgeClass = 'badge-purple';
            icon = '🌟';
        } else if (award.award_title === 'Best Innovation') {
            badgeClass = 'badge-emerald';
            icon = '💡';
        } else {
            badgeClass = 'badge-silver';
            icon = '🎖️';
        }

        return `
            <div class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeClass}">
                <span class="mr-1">${icon}</span>
                <span>${award.award_title}</span>
                ${award.prize_money > 0 ? `<span class="ml-1 opacity-75 font-normal">(৳ ${Number(award.prize_money).toLocaleString()})</span>` : ''}
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // PROJECT DETAILS MODAL
    // --------------------------------------------------------------------------
    public async openProjectDetail(projectId: number): Promise<void> {
        const modal = document.getElementById('project-detail-modal');
        const modalContent = document.getElementById('detail-modal-body');
        if (!modal || !modalContent) return;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        modalContent.innerHTML = `
            <div class="py-16 text-center">
                <div class="inline-block animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-3"></div>
                <p class="text-sm text-slate-500">Retrieving project archival dossier...</p>
            </div>
        `;

        try {
            const res = await fetch(`${this.apiBase}/project-detail.php?id=${projectId}`);
            const data: ProjectDetailResponse = await res.json();

            if (!data.success || !data.project) {
                modalContent.innerHTML = `<p class="p-6 text-red-500">Error: ${data.message || 'Project not found.'}</p>`;
                return;
            }

            const p = data.project;
            const courseColor = this.getCourseColor(p.course.course_code);
            const awardBadge = this.getAwardBadgeHtml(p.award);

            // Members Table Rows
            const membersRows = p.members.map(m => `
                <tr class="border-b border-slate-100 dark:border-slate-800 text-xs">
                    <td class="py-2.5 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>${this.escapeHtml(m.full_name || m.name || '')}</span>
                        ${m.role === 'Leader' ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-bold">Leader</span>' : ''}
                    </td>
                    <td class="py-2.5 text-slate-600 dark:text-slate-400 font-mono">${m.student_id}</td>
                    <td class="py-2.5 text-slate-600 dark:text-slate-400 text-[11px]">${this.escapeHtml(m.contribution || 'Project contributor & lab partner')}</td>
                </tr>
            `).join('');

            // Audit Trail items
            const auditItems = p.audit_trail.map(a => `
                <li class="relative pl-6 pb-3 last:pb-0 text-xs border-l border-slate-200 dark:border-slate-700">
                    <span class="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900"></span>
                    <div class="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                        <span class="font-bold text-slate-700 dark:text-slate-300">${a.action_type}</span>
                        <span>${a.timestamp}</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400">${this.escapeHtml(a.details)}</p>
                </li>
            `).join('');

            modalContent.innerHTML = `
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center justify-between gap-3 mb-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-md text-xs font-bold ${courseColor}">${p.course.course_code}</span>
                            <span class="text-xs text-slate-500 font-medium">${p.course.course_title}</span>
                        </div>
                        <span class="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded font-semibold">
                            ${p.trimester.session}
                        </span>
                    </div>

                    <h2 class="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                        ${this.escapeHtml(p.title)}
                    </h2>

                    ${awardBadge ? `
                        <div class="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <span class="text-2xl">🏆</span>
                                <div>
                                    <h4 class="text-xs font-bold text-amber-950 dark:text-amber-200">${p.award?.award_title} Distinction</h4>
                                    <p class="text-[11px] text-amber-800 dark:text-amber-400">${p.award?.remarks || 'Awarded at University Showcase'}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-xs text-amber-700 dark:text-amber-400 font-semibold block">Prize Money</span>
                                <span class="text-sm font-extrabold text-amber-900 dark:text-amber-100">৳ ${Number(p.award?.prize_money).toLocaleString()}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <!-- Project Abstract -->
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Project Abstract</h4>
                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            ${this.escapeHtml(p.abstract)}
                        </p>
                    </div>

                    <!-- Tech Stack Tags -->
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Technologies & Architecture</h4>
                        <div class="flex flex-wrap gap-2">
                            ${p.tech_tags.map(t => `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700">${t}</span>`).join('')}
                        </div>
                    </div>

                    <!-- Team Members & Supervisor Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Student Engineering Team (${p.members.length} Members)</h4>
                            <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                                <table class="w-full text-left border-collapse px-4">
                                    <thead>
                                        <tr class="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                                            <th class="py-2 px-3">Student Name</th>
                                            <th class="py-2 px-3">ID</th>
                                            <th class="py-2 px-3">Role & Contribution</th>
                                        </tr>
                                    </thead>
                                    <tbody class="px-3 divide-y divide-slate-100 dark:divide-slate-800">
                                        ${membersRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Supervisor Card -->
                        <div>
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Faculty Supervisor</h4>
                            <div class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                                    ${p.supervisor ? p.supervisor.name.charAt(0) : 'F'}
                                </div>
                                <h5 class="text-xs font-bold text-slate-900 dark:text-white">${p.supervisor ? p.supervisor.name : 'Supervision Committee'}</h5>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${p.supervisor?.email || 'N/A'}</p>
                                <span class="inline-block mt-3 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold rounded">
                                    CSE Faculty Advisor
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Repositories & External Links -->
                    <div>
                        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Repositories & Live Deployments</h4>
                        <div class="flex flex-wrap gap-3">
                            ${p.github_url ? `
                                <a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-800 transition">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                                    GitHub Repository
                                </a>
                            ` : ''}

                            ${p.demo_url ? `
                                <a href="${p.demo_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Live Demo URL
                                </a>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Audit Trail Accordion -->
                    ${p.audit_trail.length > 0 ? `
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <details class="group">
                                <summary class="flex items-center justify-between cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 select-none">
                                    <span>Database Institutional Audit Trail (${p.audit_trail.length} Records)</span>
                                    <span class="transition group-open:rotate-180">▼</span>
                                </summary>
                                <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <ul class="space-y-3">
                                        ${auditItems}
                                    </ul>
                                </div>
                            </details>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (err) {
            modalContent.innerHTML = `<p class="p-6 text-red-500">Failed to load project details.</p>`;
        }
    }

    public closeProjectModal(): void {
        const modal = document.getElementById('project-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // --------------------------------------------------------------------------
    // DYNAMIC ADD COURSE MODAL (EXTENSIBILITY DEMONSTRATION)
    // --------------------------------------------------------------------------
    public openAddCourseModal(): void {
        const modal = document.getElementById('add-course-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            (document.getElementById('new-course-code') as HTMLInputElement)?.focus();
        }
    }

    public closeAddCourseModal(): void {
        const modal = document.getElementById('add-course-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            const feedback = document.getElementById('add-course-feedback');
            if (feedback) feedback.classList.add('hidden');
        }
    }

    private async handleCourseSubmit(e: Event): Promise<void> {
        e.preventDefault();
        const codeInput = document.getElementById('new-course-code') as HTMLInputElement;
        const titleInput = document.getElementById('new-course-title') as HTMLInputElement;
        const deptSelect = document.getElementById('new-course-dept') as HTMLSelectElement;
        const submitBtn = document.getElementById('submit-course-btn') as HTMLButtonElement;
        const feedback = document.getElementById('add-course-feedback');

        if (!codeInput || !titleInput || !deptSelect) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Inserting Course...';

        try {
            const res = await fetch(`${this.apiBase}/add-course.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_code: codeInput.value.trim(),
                    course_title: titleInput.value.trim(),
                    dept_id: parseInt(deptSelect.value) || 1
                })
            });

            const data = await res.json();

            if (feedback) {
                feedback.classList.remove('hidden');
                if (data.success) {
                    feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                    feedback.textContent = `Success: Course "${data.course.course_code}" has been dynamically inserted! Dropdowns updated.`;

                    // Reset form fields
                    codeInput.value = '';
                    titleInput.value = '';

                    // Refresh course dropdowns and pills
                    this.coursesList = data.courses;
                    this.renderDropdowns(data.courses, this.trimestersList);
                    this.renderCoursePills(data.courses);

                    // Automatically close modal after brief delay
                    setTimeout(() => {
                        this.closeAddCourseModal();
                    }, 1500);
                } else {
                    feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
                    feedback.textContent = data.message || 'Failed to add course.';
                }
            }
        } catch (err) {
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3 rounded-lg text-xs font-semibold bg-red-100 text-red-800';
                feedback.textContent = 'Server connection error.';
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Course into DB';
        }
    }

    // --------------------------------------------------------------------------
    // DYNAMIC ADD PROJECT MODAL
    // --------------------------------------------------------------------------
    public openAddProjectModal(): void {
        const modal = document.getElementById('add-project-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            (document.getElementById('new-project-title') as HTMLInputElement)?.focus();
        }
    }

    public closeAddProjectModal(): void {
        const modal = document.getElementById('add-project-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            const feedback = document.getElementById('add-project-feedback');
            if (feedback) feedback.classList.add('hidden');
        }
    }

    private async handleProjectSubmit(e: Event): Promise<void> {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-project-btn') as HTMLButtonElement | null;
        const feedback = document.getElementById('add-project-feedback');

        const titleInput = document.getElementById('new-project-title') as HTMLInputElement | null;
        const courseSelect = document.getElementById('new-project-course') as HTMLSelectElement | null;
        const trimesterSelect = document.getElementById('new-project-trimester') as HTMLSelectElement | null;
        const abstractInput = document.getElementById('new-project-abstract') as HTMLTextAreaElement | null;
        const techInput = document.getElementById('new-project-tech') as HTMLInputElement | null;
        const githubInput = document.getElementById('new-project-github') as HTMLInputElement | null;
        const demoInput = document.getElementById('new-project-demo') as HTMLInputElement | null;
        const leaderNameInput = document.getElementById('new-project-leader-name') as HTMLInputElement | null;
        const leaderIdInput = document.getElementById('new-project-leader-id') as HTMLInputElement | null;
        const supervisorSelect = document.getElementById('new-project-supervisor') as HTMLSelectElement | null;
        const awardSelect = document.getElementById('new-project-award') as HTMLSelectElement | null;
        const prizeInput = document.getElementById('new-project-prize') as HTMLInputElement | null;

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
                    feedback.innerHTML = `<strong>Success!</strong> ${this.escapeHtml(data.message || 'Project registered successfully.')}`;

                    // Reset form
                    (document.getElementById('add-project-form') as HTMLFormElement)?.reset();

                    // Reload projects, stats, and popular tech tags
                    await this.loadProjectsAndMeta();

                    // Close modal after brief delay
                    setTimeout(() => {
                        this.closeAddProjectModal();
                    }, 1400);
                } else {
                    feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
                    feedback.innerHTML = `<strong>Submission Error:</strong> ${this.escapeHtml(data.message || 'Failed to add project.')}`;
                }
            }
        } catch (err: any) {
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
                feedback.innerHTML = `<strong>Network Error:</strong> ${this.escapeHtml(err.message || 'Could not connect to server.')}`;
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register & Archive Project';
            }
        }
    }

    // --------------------------------------------------------------------------
    // VIVA & EVALUATION SQL EXPLORER
    // --------------------------------------------------------------------------
    public openVivaModal(): void {
        const modal = document.getElementById('viva-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.loadVivaCatalog();
        }
    }

    public closeVivaModal(): void {
        const modal = document.getElementById('viva-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    private async loadVivaCatalog(): Promise<void> {
        const container = document.getElementById('viva-queries-list');
        if (!container) return;

        try {
            const res = await fetch(`${this.apiBase}/queries.php`);
            const data = await res.json();

            if (data.success && data.catalog) {
                let html = '';
                data.catalog.forEach((q: QueryCatalogItem) => {
                    html += `
                        <button onclick="app.executeVivaQuery(${q.id})" class="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-slate-800/80 transition flex items-start justify-between group">
                            <div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">${q.category}</span>
                                <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition">${q.id}. ${q.title}</h5>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${q.description}</p>
                            </div>
                            <span class="text-slate-400 group-hover:text-orange-500 text-xs font-bold ml-2">Run ▶</span>
                        </button>
                    `;
                });
                container.innerHTML = html;

                // Auto-run query 1 on first load
                this.executeVivaQuery(1);
            }
        } catch (err) {
            container.innerHTML = `<p class="p-4 text-xs text-red-500">Could not load SQL catalogue.</p>`;
        }
    }

    public async executeVivaQuery(queryId: number): Promise<void> {
        const outputContainer = document.getElementById('viva-query-output');
        if (!outputContainer) return;

        outputContainer.innerHTML = `
            <div class="py-12 text-center">
                <div class="inline-block animate-spin w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full mb-2"></div>
                <p class="text-xs text-slate-500">Executing prepared SQL query in MySQL engine...</p>
            </div>
        `;

        try {
            const res = await fetch(`${this.apiBase}/queries.php?id=${queryId}`);
            const data: QueryResultResponse = await res.json();

            if (!data.success) {
                outputContainer.innerHTML = `<p class="p-4 text-xs text-red-500">Execution Error: ${data.message}</p>`;
                return;
            }

            // Headers
            const ths = data.columns.map(c => `<th class="py-2 px-3 text-left font-mono font-bold text-[11px] text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">${c}</th>`).join('');

            // Rows
            const trs = data.rows.map(r => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
                    ${data.columns.map(c => `<td class="py-2 px-3 text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title="${this.escapeHtml(String(r[c] ?? 'NULL'))}">${this.escapeHtml(String(r[c] ?? 'NULL'))}</td>`).join('')}
                </tr>
            `).join('');

            outputContainer.innerHTML = `
                <div>
                    <!-- Query Info Bar -->
                    <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
                        <div>
                            <span class="text-[10px] font-bold text-orange-600 uppercase tracking-wider">${data.meta.category}</span>
                            <h4 class="text-xs font-bold text-slate-900 dark:text-white">${data.meta.id}. ${data.meta.title}</h4>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                ⚡ ${data.execution_ms} ms
                            </span>
                            <span class="px-2 py-0.5 rounded text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                                ${data.row_count} rows
                            </span>
                        </div>
                    </div>

                    <!-- SQL Code Box -->
                    <div class="mb-4">
                        <pre class="p-3 bg-slate-900 text-amber-300 dark:bg-black rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">${this.escapeHtml(data.meta.sql)}</pre>
                    </div>

                    <!-- Result Data Table -->
                    <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl max-h-[360px] overflow-y-auto">
                        <table class="w-full border-collapse">
                            <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800">
                                <tr>${ths}</tr>
                            </thead>
                            <tbody>
                                ${trs}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (err) {
            outputContainer.innerHTML = `<p class="p-4 text-xs text-red-500">Failed to execute query.</p>`;
        }
    }

    // --------------------------------------------------------------------------
    // UTILITY HELPERS
    // --------------------------------------------------------------------------
    private resetFilters(): void {
        this.currentFilters = {
            course_id: '',
            trimester_id: '',
            award: 'all',
            tech: '',
            search: '',
            sort: 'newest'
        };

        const heroInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
        const filterInput = document.getElementById('filter-search-input') as HTMLInputElement | null;
        if (heroInput) heroInput.value = '';
        if (filterInput) filterInput.value = '';

        const courseSelect = document.getElementById('course-filter') as HTMLSelectElement | null;
        if (courseSelect) courseSelect.value = '';

        const trimesterSelect = document.getElementById('trimester-filter') as HTMLSelectElement | null;
        if (trimesterSelect) trimesterSelect.value = '';

        const awardSelect = document.getElementById('award-filter') as HTMLSelectElement | null;
        if (awardSelect) awardSelect.value = 'all';

        const sortSelect = document.getElementById('sort-filter') as HTMLSelectElement | null;
        if (sortSelect) sortSelect.value = 'newest';

        this.syncCoursePills();
        this.loadProjects();
    }

    private renderLoading(isLoading: boolean): void {
        const spinner = document.getElementById('loading-indicator');
        if (spinner) {
            if (isLoading) {
                spinner.classList.remove('hidden');
            } else {
                spinner.classList.add('hidden');
            }
        }
    }

    private showErrorNotice(message: string): void {
        const grid = document.getElementById('projects-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                    <span class="text-3xl">⚠️</span>
                    <h3 class="text-base font-bold text-red-900 dark:text-red-200 mt-2">Database Connection Required</h3>
                    <p class="text-xs text-red-700 dark:text-red-300 mt-1 max-w-lg mx-auto">${message}</p>
                    <div class="mt-4 text-xs font-mono bg-white dark:bg-black p-3 rounded-lg text-slate-700 dark:text-slate-300 inline-block text-left">
                        1. Start Apache & MySQL in XAMPP<br>
                        2. Open phpMyAdmin: http://localhost/phpmyadmin<br>
                        3. Import <b>database/schema.sql</b>
                    </div>
                </div>
            `;
        }
    }

    private escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Global instantiation
window.addEventListener('DOMContentLoaded', () => {
    (window as any).app = new ShowcaseApp();
});
