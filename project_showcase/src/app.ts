/**
 * UIU Project Showcase & Research Archive
 * Student Project for CSE 3522: Database Management Systems Laboratory
 * Department of Computer Science & Engineering, United International University
 * 
 * Handles client-side state, live search, dynamic filtering, modal dialogs,
 * interactive canvas background animation, and live SQL execution against MySQL.
 */

// Model Interfaces
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

interface SupervisorItem {
  user_id: number;
  full_name: string;
  student_or_faculty_id?: string;
  email: string;
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
}

interface ProjectDetailResponse {
  success: boolean;
  project: Project & {
    created_at: string;
    updated_at: string;
    audit_trail: AuditLog[];
  };
  message?: string;
}

interface MetaStats {
  total_projects: number;
  total_fydp: number;
  total_award_winners: number;
  total_prize_distributed: number;
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

// Application State Controller
class ShowcaseApp {
  private apiBase = 'api';
  private filters = {
    course_id: '',
    trimester_id: '',
    award: 'all',
    tech: '',
    search: '',
    sort: 'newest'
  };

  private debounceTimer: number | null = null;
  private isDark = false;
  private courses: Course[] = [];
  private trimesters: Trimester[] = [];
  private supervisors: SupervisorItem[] = [];

  constructor() {
    this.initTheme();
    this.initAmbientCanvas();
    this.bindEvents();
    this.loadInitialData();
  }

  // Theme setup (Dark / Light)
  private initTheme(): void {
    const saved = localStorage.getItem('uiu_theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      this.isDark = true;
    } else {
      document.documentElement.classList.remove('dark');
      this.isDark = false;
    }
    this.updateThemeIcon();
  }

  public toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uiu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uiu_theme', 'light');
    }
    this.updateThemeIcon();
  }

  private updateThemeIcon(): void {
    const el = document.getElementById('theme-toggle-icon');
    if (!el) return;
    el.innerHTML = this.isDark
      ? `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
      : `<svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
  }

  // ==========================================
  // Interactive Floating Particles Background (Like UCAM Cloud)
  // ==========================================
  private initAmbientCanvas(): void {
    const canvas = document.getElementById('ambient-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 640);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    const count = Math.min(32, Math.max(16, Math.floor(width / 38)));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.25
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const nodeColor = isDark ? '249, 115, 22' : '234, 88, 12'; // UIU Orange

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * 0.16;
            ctx.strokeStyle = `rgba(${nodeColor}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Move & draw nodes
      particles.forEach((p) => {
        // Mouse reaction
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 90 && mDist > 0) {
          p.x += (mdx / mDist) * 1.2;
          p.y += (mdy / mDist) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(${nodeColor}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 640;
    });
  }

  // Event Listeners Binding
  private bindEvents(): void {
    // Theme
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

    // Search input with clear button
    const heroSearch = document.getElementById('hero-search-input') as HTMLInputElement | null;
    const clearBtn = document.getElementById('clear-search-btn');

    heroSearch?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      if (clearBtn) {
        if (val.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
      this.handleSearchDebounced(val);
    });

    clearBtn?.addEventListener('click', () => {
      if (heroSearch) {
        heroSearch.value = '';
        clearBtn.classList.add('hidden');
        this.handleSearchDebounced('');
      }
    });

    // Dropdown filters
    document.getElementById('course-filter')?.addEventListener('change', (e) => {
      this.filters.course_id = (e.target as HTMLSelectElement).value;
      this.fetchProjects();
    });

    document.getElementById('trimester-filter')?.addEventListener('change', (e) => {
      this.filters.trimester_id = (e.target as HTMLSelectElement).value;
      this.fetchProjects();
    });

    document.getElementById('award-filter')?.addEventListener('change', (e) => {
      this.filters.award = (e.target as HTMLSelectElement).value;
      this.fetchProjects();
    });

    document.getElementById('sort-filter')?.addEventListener('change', (e) => {
      this.filters.sort = (e.target as HTMLSelectElement).value;
      this.fetchProjects();
    });

    document.getElementById('reset-filters-btn')?.addEventListener('click', () => this.resetFilters());

    // Modals
    document.getElementById('open-add-project-btn')?.addEventListener('click', () => this.openAddProject());
    document.getElementById('close-add-project-btn')?.addEventListener('click', () => this.closeAddProject());
    document.getElementById('add-project-backdrop')?.addEventListener('click', () => this.closeAddProject());

    document.getElementById('open-add-course-btn')?.addEventListener('click', () => this.openAddCourse());
    document.getElementById('close-add-course-btn')?.addEventListener('click', () => this.closeAddCourse());

    document.getElementById('open-viva-btn')?.addEventListener('click', () => this.openVivaModal());
    document.getElementById('close-viva-modal-btn')?.addEventListener('click', () => this.closeVivaModal());
    document.getElementById('viva-modal-backdrop')?.addEventListener('click', () => this.closeVivaModal());

    document.getElementById('close-detail-modal-btn')?.addEventListener('click', () => this.closeDetailModal());
    document.getElementById('detail-modal-backdrop')?.addEventListener('click', () => this.closeDetailModal());

    // Mobile query dropdown
    document.getElementById('mobile-viva-select')?.addEventListener('change', (e) => {
      const qid = parseInt((e.target as HTMLSelectElement).value, 10);
      if (qid) this.runVivaQuery(qid);
    });

    // Form submits
    document.getElementById('add-project-form')?.addEventListener('submit', (e) => this.submitProject(e));
    document.getElementById('add-course-form')?.addEventListener('submit', (e) => this.submitCourse(e));

    // Keyboard ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDetailModal();
        this.closeAddProject();
        this.closeAddCourse();
        this.closeVivaModal();
      }
    });
  }

  // Debounced search
  private handleSearchDebounced(query: string): void {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.filters.search = query.trim();
      this.fetchProjects();
    }, 250);
  }

  // Initial Load: Projects + Dropdowns + Stats
  private async loadInitialData(): Promise<void> {
    this.toggleLoading(true);

    try {
      const params = new URLSearchParams({
        course_id: this.filters.course_id,
        trimester_id: this.filters.trimester_id,
        award: this.filters.award,
        tech: this.filters.tech,
        search: this.filters.search,
        sort: this.filters.sort
      });

      const res = await fetch(`${this.apiBase}/projects.php?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data: ProjectsApiResponse = await res.json();

      if (data.success) {
        this.courses = data.meta.courses;
        this.trimesters = data.meta.trimesters;
        if (data.meta.supervisors) {
          this.supervisors = data.meta.supervisors;
        }

        this.renderStats(data.meta.stats);
        this.renderFilterDropdowns(data.meta.courses, data.meta.trimesters);
        this.renderPopularTech(data.meta.popular_techs);
        this.renderProjects(data.projects);
      } else {
        this.showDatabaseError(data.message || 'Unable to retrieve projects from database.');
      }
    } catch (err: any) {
      this.showDatabaseError(err.message || 'MySQL database connection failed.');
    } finally {
      this.toggleLoading(false);
    }
  }

  // Reload filtered projects
  private async fetchProjects(): Promise<void> {
    this.toggleLoading(true);

    try {
      const params = new URLSearchParams({
        course_id: this.filters.course_id,
        trimester_id: this.filters.trimester_id,
        award: this.filters.award,
        tech: this.filters.tech,
        search: this.filters.search,
        sort: this.filters.sort
      });

      const res = await fetch(`${this.apiBase}/projects.php?${params.toString()}`);
      const data: ProjectsApiResponse = await res.json();

      if (data.success) {
        this.renderProjects(data.projects);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      this.toggleLoading(false);
    }
  }

  // Render Stats Strip
  private renderStats(stats: MetaStats): void {
    const totalEl = document.getElementById('stat-total-projects');
    const fydpEl = document.getElementById('stat-total-fydp');
    const winnersEl = document.getElementById('stat-total-winners');
    const prizeEl = document.getElementById('stat-total-prize');

    if (totalEl) totalEl.textContent = String(stats.total_projects);
    if (fydpEl) fydpEl.textContent = String(stats.total_fydp);
    if (winnersEl) winnersEl.textContent = String(stats.total_award_winners);
    if (prizeEl) prizeEl.textContent = '৳ ' + Number(stats.total_prize_distributed).toLocaleString();
  }

  // Render Dropdown options dynamically
  private renderFilterDropdowns(courses: Course[], trimesters: Trimester[]): void {
    // Course filter dropdown
    const courseSelect = document.getElementById('course-filter') as HTMLSelectElement | null;
    if (courseSelect) {
      let html = '<option value="">All Courses</option>';
      courses.forEach(c => {
        html += `<option value="${c.course_id}" ${this.filters.course_id === String(c.course_id) ? 'selected' : ''}>${c.course_code} - ${c.course_title}</option>`;
      });
      courseSelect.innerHTML = html;
    }

    // Modal course dropdown
    const modalCourseSelect = document.getElementById('new-project-course') as HTMLSelectElement | null;
    if (modalCourseSelect) {
      let html = '<option value="">Select University Course</option>';
      courses.forEach(c => {
        html += `<option value="${c.course_id}">${c.course_code}: ${c.course_title}</option>`;
      });
      modalCourseSelect.innerHTML = html;
    }

    // Modal supervisor dropdown
    const modalSupervisorSelect = document.getElementById('new-project-supervisor') as HTMLSelectElement | null;
    if (modalSupervisorSelect) {
      let html = '<option value="">Select Faculty Advisor (Optional)</option>';
      this.supervisors.forEach(s => {
        html += `<option value="${s.user_id}">${s.full_name} (${s.email})</option>`;
      });
      modalSupervisorSelect.innerHTML = html;
    }

    // Trimester filter dropdown
    const trimesterSelect = document.getElementById('trimester-filter') as HTMLSelectElement | null;
    if (trimesterSelect) {
      let html = '<option value="">All Trimesters</option>';
      trimesters.forEach(t => {
        html += `<option value="${t.trimester_id}" ${this.filters.trimester_id === String(t.trimester_id) ? 'selected' : ''}>${t.term_name} ${t.year}</option>`;
      });
      trimesterSelect.innerHTML = html;
    }

    // Modal trimester dropdown
    const modalTrimesterSelect = document.getElementById('new-project-trimester') as HTMLSelectElement | null;
    if (modalTrimesterSelect) {
      let html = '<option value="">Select Trimester</option>';
      trimesters.forEach(t => {
        html += `<option value="${t.trimester_id}">${t.term_name} ${t.year} (${t.trimester_code})</option>`;
      });
      modalTrimesterSelect.innerHTML = html;
    }
  }

  // Render popular tech tags
  private renderPopularTech(techs: string[]): void {
    const container = document.getElementById('popular-techs-container');
    if (!container) return;

    let html = '';
    techs.forEach(t => {
      const active = this.filters.tech.toLowerCase() === t.toLowerCase();
      html += `
        <button data-tech="${t}" class="tech-tag-btn px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
          active 
            ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-500' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700'
        }">
          #${t}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.tech-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = (e.currentTarget as HTMLButtonElement).getAttribute('data-tech') || '';
        this.filters.tech = (this.filters.tech.toLowerCase() === tag.toLowerCase()) ? '' : tag;
        this.renderPopularTech(techs);
        this.fetchProjects();
      });
    });
  }

  // Render Project Cards (Includes Faculty Advisor, Zero truncation, Clean Responsive Layout)
  private renderProjects(projects: Project[]): void {
    const grid = document.getElementById('projects-grid');
    const countDisplay = document.getElementById('results-count-display');
    if (!grid) return;

    if (countDisplay) {
      countDisplay.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;
    }

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-3 text-slate-300 dark:text-slate-700">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">No archived records match your selected criteria. Try resetting the filters.</p>
          <button id="empty-reset-btn" class="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition">
            Reset Filters
          </button>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', () => this.resetFilters());
      return;
    }

    let cardsHtml = '';
    projects.forEach(p => {
      const awardBadge = this.formatAwardBadge(p.award);
      const techTagsHtml = p.tech_tags.slice(0, 4).map(t => 
        `<span class="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">${t}</span>`
      ).join('');

      cardsHtml += `
        <div class="project-card flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-orange-300 dark:hover:border-orange-500/50">
          <div>
            <!-- Course & Trimester Row -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/80">
                ${p.course.course_code}
              </span>
              <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                ${p.trimester.term_name} ${p.trimester.year}
              </span>
            </div>

            <!-- Award Banner if awarded -->
            ${awardBadge ? `<div class="mb-3">${awardBadge}</div>` : ''}

            <!-- Project Title (Full academic title, NEVER truncated) -->
            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug break-words hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer" onclick="app.viewProjectDetail(${p.project_id})">
              ${this.escapeHtml(p.title)}
            </h3>

            <!-- Abstract Excerpt -->
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed break-words">
              ${this.escapeHtml(p.abstract)}
            </p>

            <!-- Faculty Advisor Label -->
            ${p.supervisor ? `
              <div class="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <svg class="w-3.5 h-3.5 text-orange-600 dark:text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="truncate">Advisor: <span class="font-medium text-slate-700 dark:text-slate-200">${this.escapeHtml(p.supervisor.name)}</span></span>
              </div>
            ` : ''}

            <!-- Tech Tags -->
            <div class="flex flex-wrap gap-1.5 mt-3">
              ${techTagsHtml}
              ${p.tech_tags.length > 4 ? `<span class="px-1.5 py-0.5 text-[10px] text-slate-400">+${p.tech_tags.length - 4} more</span>` : ''}
            </div>
          </div>

          <!-- Card Footer (Team Leader & Action Button) -->
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

            <button onclick="app.viewProjectDetail(${p.project_id})" class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition flex-shrink-0">
              <span>Details</span>
              <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = cardsHtml;
  }

  // Format Award Badges
  private formatAwardBadge(award: Award | null): string {
    if (!award) return '';

    let pillClass = 'award-pill-silver';
    let iconSvg = `<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`;

    if (award.award_title === '1st Prize') {
      pillClass = 'award-pill-gold';
      iconSvg = `<svg class="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else if (award.award_title === 'Best FYDP') {
      pillClass = 'award-pill-purple';
    } else if (award.award_title === 'Best Innovation') {
      pillClass = 'award-pill-green';
    }

    return `
      <div class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${pillClass}">
        ${iconSvg}
        <span>${award.award_title}</span>
        ${award.prize_money > 0 ? `<span class="ml-1 opacity-80 font-normal">• ৳ ${Number(award.prize_money).toLocaleString()}</span>` : ''}
      </div>
    `;
  }

  // ==========================================
  // Project Details Modal (With Faculty Advisor Restored)
  // ==========================================
  public async viewProjectDetail(projectId: number): Promise<void> {
    const modal = document.getElementById('project-detail-modal');
    const body = document.getElementById('detail-modal-body');
    if (!modal || !body) return;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    body.innerHTML = `
      <div class="py-16 text-center">
        <div class="inline-block animate-spin w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full mb-3"></div>
        <p class="text-xs text-slate-500 font-medium">Loading project records...</p>
      </div>
    `;

    try {
      const res = await fetch(`${this.apiBase}/project-detail.php?id=${projectId}`);
      const data: ProjectDetailResponse = await res.json();

      if (!data.success || !data.project) {
        body.innerHTML = `<p class="p-6 text-red-500 text-xs">Error: ${data.message || 'Project not found.'}</p>`;
        return;
      }

      const p = data.project;
      const awardBadge = this.formatAwardBadge(p.award);

      // Student Team Cards (Responsive Grid)
      const membersHtml = p.members.map(m => `
        <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs flex-shrink-0">
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
              : '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Member</span>'
            }
          </div>
        </div>
      `).join('');

      // Database Triggers Audit Trail
      const auditHtml = p.audit_trail.map(a => `
        <li class="relative pl-5 pb-3 last:pb-0 text-xs border-l border-slate-200 dark:border-slate-700">
          <span class="absolute -left-1.5 top-0.5 w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
            <span class="font-bold text-slate-700 dark:text-slate-300">${a.action_type}</span>
            <span>${a.timestamp}</span>
          </div>
          <p class="text-slate-600 dark:text-slate-400">${this.escapeHtml(a.details)}</p>
        </li>
      `).join('');

      body.innerHTML = `
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded text-xs font-bold bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">${p.course.course_code}</span>
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
                <p class="text-[11px] text-amber-800 dark:text-amber-400">${p.award?.remarks || 'Awarded at UIU Project Showcase'}</p>
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

        <!-- Body -->
        <div class="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          <!-- Abstract -->
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Project Abstract</h4>
            <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 break-words">
              ${this.escapeHtml(p.abstract)}
            </p>
          </div>

          <!-- Technologies -->
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Technologies & Architecture</h4>
            <div class="flex flex-wrap gap-2">
              ${p.tech_tags.map(t => `<span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">${t}</span>`).join('')}
            </div>
          </div>

          <!-- Faculty Project Advisor -->
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Faculty Project Advisor</h4>
            <div class="faculty-advisor-box p-3.5 bg-gradient-to-r from-orange-50/80 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10 rounded-xl border border-orange-200/80 dark:border-orange-800/40 flex items-center justify-between gap-3">
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-10 h-10 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                  ${(p.supervisor ? p.supervisor.name : 'F').charAt(0)}
                </div>
                <div class="min-w-0">
                  <h5 class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                    ${this.escapeHtml(p.supervisor ? p.supervisor.name : 'Faculty Advisory Committee')}
                  </h5>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">Department of Computer Science & Engineering • UIU</p>
                </div>
              </div>
              ${p.supervisor?.email ? `
                <a href="mailto:${p.supervisor.email}" class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-slate-600 hover:bg-orange-50 dark:hover:bg-slate-600 transition flex-shrink-0">
                  <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"/></svg>
                  <span>Email Advisor</span>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Student Engineering Team -->
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Student Engineering Team (${p.members.length} Members)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${membersHtml}
            </div>
          </div>

          <!-- Repositories & External Links -->
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Repositories & Artifacts</h4>
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

          <!-- Institutional Audit Trail -->
          ${p.audit_trail.length > 0 ? `
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
              <details class="group">
                <summary class="flex items-center justify-between cursor-pointer text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 select-none">
                  <span>Database Audit Trail (${p.audit_trail.length} Records)</span>
                  <span class="transition group-open:rotate-180">▼</span>
                </summary>
                <div class="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <ul class="space-y-2.5">
                    ${auditHtml}
                  </ul>
                </div>
              </details>
            </div>
          ` : ''}
        </div>
      `;
    } catch (err) {
      body.innerHTML = `<p class="p-6 text-red-500 text-xs">Failed to load project details.</p>`;
    }
  }

  public closeDetailModal(): void {
    const modal = document.getElementById('project-detail-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  // ==========================================
  // SQL Lab & Viva Explorer Modal
  // ==========================================
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
    const listContainer = document.getElementById('viva-queries-list');
    const mobileSelect = document.getElementById('mobile-viva-select') as HTMLSelectElement | null;
    if (!listContainer) return;

    try {
      const res = await fetch(`${this.apiBase}/queries.php`);
      const data = await res.json();

      if (data.success && data.catalog) {
        let listHtml = '';
        let selectHtml = '';

        data.catalog.forEach((q: QueryCatalogItem) => {
          listHtml += `
            <button onclick="app.runVivaQuery(${q.id})" class="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-slate-800/80 transition flex items-start justify-between group">
              <div class="min-w-0 pr-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">${q.category}</span>
                <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition truncate">${q.id}. ${q.title}</h5>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">${q.description}</p>
              </div>
              <span class="text-slate-400 group-hover:text-orange-500 text-xs font-bold flex-shrink-0 mt-1">▶</span>
            </button>
          `;
          selectHtml += `<option value="${q.id}">Query ${q.id}: ${q.title}</option>`;
        });

        listContainer.innerHTML = listHtml;
        if (mobileSelect) mobileSelect.innerHTML = selectHtml;

        // Auto run query 1
        this.runVivaQuery(1);
      }
    } catch (err) {
      listContainer.innerHTML = `<p class="p-4 text-xs text-red-500">Failed to load SQL catalog.</p>`;
    }
  }

  public async runVivaQuery(queryId: number): Promise<void> {
    const output = document.getElementById('viva-query-output');
    if (!output) return;

    const mobileSelect = document.getElementById('mobile-viva-select') as HTMLSelectElement | null;
    if (mobileSelect && mobileSelect.value !== String(queryId)) {
      mobileSelect.value = String(queryId);
    }

    output.innerHTML = `
      <div class="py-12 text-center">
        <div class="inline-block animate-spin w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full mb-2"></div>
        <p class="text-xs text-slate-500">Executing prepared SQL query in MySQL engine...</p>
      </div>
    `;

    try {
      const res = await fetch(`${this.apiBase}/queries.php?id=${queryId}`);
      const data: QueryResultResponse = await res.json();

      if (!data.success) {
        output.innerHTML = `<p class="p-4 text-xs text-red-500">Execution Error: ${data.message}</p>`;
        return;
      }

      // Headers
      const ths = data.columns.map(c => 
        `<th class="py-2.5 px-3 text-left font-mono font-bold text-[11px] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap bg-slate-100 dark:bg-slate-800">${c}</th>`
      ).join('');

      // Rows (Complete text, no cell truncation)
      const trs = data.rows.map(r => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 text-xs font-mono">
          ${data.columns.map(c => `<td class="py-2 px-3 text-slate-700 dark:text-slate-300 break-words max-w-xs">${this.escapeHtml(String(r[c] ?? 'NULL'))}</td>`).join('')}
        </tr>
      `).join('');

      output.innerHTML = `
        <div>
          <!-- Query Header -->
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

          <!-- SQL Code View -->
          <div class="mb-3 relative group">
            <pre class="p-3 bg-slate-900 text-amber-300 dark:bg-black rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed select-all">${this.escapeHtml(data.meta.sql)}</pre>
            <button onclick="navigator.clipboard.writeText('${this.escapeJs(data.meta.sql)}'); this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy SQL', 1500);" class="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-700">
              Copy SQL
            </button>
          </div>

          <!-- Results Table -->
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
    } catch (err) {
      output.innerHTML = `<p class="p-4 text-xs text-red-500">Execution failed.</p>`;
    }
  }

  // ==========================================
  // Add Project Modal (With Faculty Advisor Dropdown)
  // ==========================================
  public openAddProject(): void {
    const modal = document.getElementById('add-project-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      (document.getElementById('new-project-title') as HTMLInputElement)?.focus();
    }
  }

  public closeAddProject(): void {
    const modal = document.getElementById('add-project-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      const feedback = document.getElementById('add-project-feedback');
      if (feedback) feedback.classList.add('hidden');
    }
  }

  private async submitProject(e: Event): Promise<void> {
    e.preventDefault();
    const btn = document.getElementById('submit-project-btn') as HTMLButtonElement | null;
    const feedback = document.getElementById('add-project-feedback');

    const titleInput = document.getElementById('new-project-title') as HTMLInputElement | null;
    const courseSelect = document.getElementById('new-project-course') as HTMLSelectElement | null;
    const trimesterSelect = document.getElementById('new-project-trimester') as HTMLSelectElement | null;
    const supervisorSelect = document.getElementById('new-project-supervisor') as HTMLSelectElement | null;
    const abstractInput = document.getElementById('new-project-abstract') as HTMLTextAreaElement | null;
    const techInput = document.getElementById('new-project-tech') as HTMLInputElement | null;
    const githubInput = document.getElementById('new-project-github') as HTMLInputElement | null;
    const demoInput = document.getElementById('new-project-demo') as HTMLInputElement | null;
    const leaderNameInput = document.getElementById('new-project-leader-name') as HTMLInputElement | null;
    const leaderIdInput = document.getElementById('new-project-leader-id') as HTMLInputElement | null;
    const awardSelect = document.getElementById('new-project-award') as HTMLSelectElement | null;
    const prizeInput = document.getElementById('new-project-prize') as HTMLInputElement | null;

    if (!titleInput || !courseSelect || !trimesterSelect || !abstractInput || !techInput || !leaderNameInput || !leaderIdInput) {
      return;
    }

    const payload = {
      title: titleInput.value.trim(),
      course_id: parseInt(courseSelect.value, 10),
      trimester_id: parseInt(trimesterSelect.value, 10),
      supervisor_id: supervisorSelect && supervisorSelect.value ? parseInt(supervisorSelect.value, 10) : null,
      abstract: abstractInput.value.trim(),
      tech_stack: techInput.value.trim(),
      github_url: githubInput ? githubInput.value.trim() : '',
      demo_url: demoInput ? demoInput.value.trim() : '',
      leader_name: leaderNameInput.value.trim(),
      leader_id: leaderIdInput.value.trim(),
      award_title: awardSelect ? awardSelect.value : 'None',
      prize_money: prizeInput ? parseFloat(prizeInput.value) || 0 : 0
    };

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving Project...';
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

          (document.getElementById('add-project-form') as HTMLFormElement)?.reset();
          await this.loadInitialData();

          setTimeout(() => {
            this.closeAddProject();
          }, 1400);
        } else {
          feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
          feedback.textContent = data.message || 'Failed to add project.';
        }
      }
    } catch (err: any) {
      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.className = 'p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs rounded-xl mb-4';
        feedback.textContent = err.message || 'Network error.';
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Register & Archive Project';
      }
    }
  }

  // ==========================================
  // Add Course Modal (Extensibility Demo)
  // ==========================================
  public openAddCourse(): void {
    const modal = document.getElementById('add-course-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      (document.getElementById('new-course-code') as HTMLInputElement)?.focus();
    }
  }

  public closeAddCourse(): void {
    const modal = document.getElementById('add-course-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      const feedback = document.getElementById('add-course-feedback');
      if (feedback) feedback.classList.add('hidden');
    }
  }

  private async submitCourse(e: Event): Promise<void> {
    e.preventDefault();
    const codeInput = document.getElementById('new-course-code') as HTMLInputElement;
    const titleInput = document.getElementById('new-course-title') as HTMLInputElement;
    const deptSelect = document.getElementById('new-course-dept') as HTMLSelectElement;
    const btn = document.getElementById('submit-course-btn') as HTMLButtonElement;
    const feedback = document.getElementById('add-course-feedback');

    if (!codeInput || !titleInput || !deptSelect) return;

    btn.disabled = true;
    btn.textContent = 'Inserting Course...';

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
          feedback.className = 'p-3 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          feedback.textContent = `Course "${data.course.course_code}" added successfully!`;

          codeInput.value = '';
          titleInput.value = '';

          this.courses = data.courses;
          this.renderFilterDropdowns(data.courses, this.trimesters);

          setTimeout(() => {
            this.closeAddCourse();
          }, 1400);
        } else {
          feedback.className = 'p-3 rounded-xl text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
          feedback.textContent = data.message || 'Failed to add course.';
        }
      }
    } catch (err) {
      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.className = 'p-3 rounded-xl text-xs font-semibold bg-red-100 text-red-800';
        feedback.textContent = 'Server connection error.';
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save Course into Database';
    }
  }

  // ==========================================
  // Utility Helpers
  // ==========================================
  private resetFilters(): void {
    this.filters = {
      course_id: '',
      trimester_id: '',
      award: 'all',
      tech: '',
      search: '',
      sort: 'newest'
    };

    const heroInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
    const clearBtn = document.getElementById('clear-search-btn');
    if (heroInput) heroInput.value = '';
    if (clearBtn) clearBtn.classList.add('hidden');

    const courseSelect = document.getElementById('course-filter') as HTMLSelectElement | null;
    if (courseSelect) courseSelect.value = '';

    const trimesterSelect = document.getElementById('trimester-filter') as HTMLSelectElement | null;
    if (trimesterSelect) trimesterSelect.value = '';

    const awardSelect = document.getElementById('award-filter') as HTMLSelectElement | null;
    if (awardSelect) awardSelect.value = 'all';

    const sortSelect = document.getElementById('sort-filter') as HTMLSelectElement | null;
    if (sortSelect) sortSelect.value = 'newest';

    this.renderPopularTech(['Python', 'React', 'FastAPI', 'Node.js', 'ESP32', 'MySQL', 'PyTorch', 'Flutter']);
    this.fetchProjects();
  }

  private toggleLoading(show: boolean): void {
    const el = document.getElementById('loading-indicator');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  }

  private showDatabaseError(msg: string): void {
    const grid = document.getElementById('projects-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="col-span-full p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-center">
          <h3 class="text-sm font-bold text-red-900 dark:text-red-200">Database Connection Required</h3>
          <p class="text-xs text-red-700 dark:text-red-300 mt-1 max-w-md mx-auto">${msg}</p>
          <div class="mt-3 text-xs font-mono bg-white dark:bg-black p-3 rounded-lg text-slate-700 dark:text-slate-300 inline-block text-left">
            1. Start MySQL in XAMPP<br>
            2. Database: <b>uiu_project_showcase</b><br>
            3. Port: 3306
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

  private escapeJs(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  (window as any).app = new ShowcaseApp();
});
