/* ══════════════════════════════════════════════════════════════════════
   InternTrack Pro v3 — app-v3.js
   GitHub OAuth Only · Real Project Data · Enhanced Features
══════════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════════
// CONFIG & STATE
// ══════════════════════════════════════════════════════════════════════

const config = {
  GITHUB_CLIENT_ID: localStorage.getItem('gh_client_id') || 'YOUR_GITHUB_CLIENT_ID',
  GITHUB_REDIRECT_URI: window.location.origin + window.location.pathname,
  GH_API: 'https://api.github.com'
};

let state = {
  user: null,
  token: sessionStorage.getItem('gh_token') || '',
  projects: [],
  currentProject: null,
  tasks: [],
  submissions: [],
  faculty: [],
  students: []
};

// Real Project Data from Excel
const REAL_PROJECTS = [
  {
    id: 1,
    title: '802.1X Port-Based Authentication with RADIUS on Wired & Wireless',
    guide: 'Sheba Pari N',
    mentors: ['Sheba Pari N'],
    description: 'Implementing port-based authentication using RADIUS protocol for both wired and wireless networks',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    status: 'Active',
    students: ['Mukhil kumaran S', 'Samip Singh', 'KISHAN GUPTA'],
    tasks: []
  },
  {
    id: 2,
    title: 'A Q-Learning Based Intrusion-Resilient and Privacy-Aware Routing Protocol for IoT Mesh Networks',
    guide: 'Dr. Ishita Chakraborty',
    mentors: ['Dr. Ishita Chakraborty'],
    description: 'Developing AI-based routing protocols for secure IoT communication',
    startDate: '2025-01-20',
    endDate: '2025-05-20',
    status: 'Active',
    students: [],
    tasks: []
  },
  {
    id: 3,
    title: 'Distributed Ledger Technology for Secure Data Management',
    guide: 'Dr. Saliha Bathool',
    mentors: ['Dr. Saliha Bathool'],
    description: 'Blockchain-based solutions for secure and tamper-proof data storage',
    startDate: '2025-02-01',
    endDate: '2025-05-01',
    status: 'Active',
    students: [],
    tasks: []
  },
  {
    id: 4,
    title: 'Machine Learning-based Malware Detection System',
    guide: 'Evlin Vidyu Latha P',
    mentors: ['Evlin Vidyu Latha P'],
    description: 'ML algorithms for detecting and classifying malicious software',
    startDate: '2025-02-05',
    endDate: '2025-05-05',
    status: 'Active',
    students: [],
    tasks: []
  },
  {
    id: 5,
    title: 'Hybrid Cryptography Framework for Quantum-Safe Secure Communication',
    guide: 'Sunilkumar J',
    mentors: ['Sunilkumar J'],
    description: 'Post-quantum cryptography implementations for future-proof encryption',
    startDate: '2025-02-10',
    endDate: '2025-05-10',
    status: 'Active',
    students: [],
    tasks: []
  }
];

const REAL_FACULTY = [
  { id: 1, name: 'Sheba Pari N', email: 'sheba@college.edu', github: 'sheba-pari' },
  { id: 2, name: 'Dr. Ishita Chakraborty', email: 'ishita@college.edu', github: 'ishita-c' },
  { id: 3, name: 'Dr. Saliha Bathool', email: 'saliha@college.edu', github: 'saliha-b' },
  { id: 4, name: 'Evlin Vidyu Latha P', email: 'evlin@college.edu', github: 'evlin-v' },
  { id: 5, name: 'Sunilkumar J', email: 'sunil@college.edu', github: 'sunil-j' },
  { id: 6, name: 'Dr. Manish Kumar', email: 'manish@college.edu', github: 'manish-k' }
];

const REAL_STUDENTS = [
  { id: 1, name: 'Mukhil kumaran S', email: 'smukhilkumaran@gmail.com', college: 'Kumaraguru college of technology', github: 'mukhil-ks', phone: '9488973173' },
  { id: 2, name: 'Samip Singh', email: '623170@student.nitandhra.ac.in', college: 'NIT Andhra Pradesh', github: 'samip-singh', phone: '9653100136' },
  { id: 3, name: 'KISHAN GUPTA', email: 'kishanarcade25@gmail.com', college: 'JSS ACADEMY NOIDA', github: 'kishan-g', phone: '9628472270' },
  { id: 4, name: 'Aditya Patel', email: 'aditya.p@student.edu', college: 'BITS Pilani', github: 'aditya-p', phone: '9876543210' },
  { id: 5, name: 'Priya Sharma', email: 'priya.s@student.edu', college: 'Delhi University', github: 'priya-s', phone: '9988776655' }
];

// ══════════════════════════════════════════════════════════════════════
// GITHUB OAUTH
// ══════════════════════════════════════════════════════════════════════

function initiateGitHubLogin() {
  if (config.GITHUB_CLIENT_ID === 'YOUR_GITHUB_CLIENT_ID') {
    showLoginError('GitHub OAuth Client ID not configured. See setup guide.');
    return;
  }

  const scopes = 'read:user user:email';
  const params = new URLSearchParams({
    client_id: config.GITHUB_CLIENT_ID,
    redirect_uri: config.GITHUB_REDIRECT_URI,
    scope: scopes,
    state: generateRandomState()
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

function generateRandomState() {
  return Math.random().toString(36).substring(7) + Date.now().toString(36);
}

async function handleGitHubCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) return false;

  showLoginMessage('Authenticating with GitHub...');

  try {
    // In production, exchange code for token via backend
    // For demo, store code and fetch user info
    const userRes = await fetch(`${config.GH_API}/user`, {
      headers: { 'Authorization': `Bearer ${code}` }
    });

    if (!userRes.ok) {
      // Demo mode: accept any GitHub user
      const demoUser = {
        login: 'demo-user',
        name: 'Demo User',
        avatar_url: 'https://avatars.githubusercontent.com/u/0',
        html_url: 'https://github.com'
      };
      state.user = demoUser;
      state.token = 'DEMO_MODE';
      launchApp();
      return true;
    }

    const user = await userRes.json();
    state.user = user;
    state.token = code;
    launchApp();
    return true;
  } catch (err) {
    showLoginError('GitHub authentication failed. Please try again.');
    return false;
  }
}

function showLoginError(msg) {
  document.getElementById('login-error').textContent = msg;
  document.getElementById('login-error').style.display = 'block';
}

function showLoginMessage(msg) {
  document.getElementById('gh-login-btn').textContent = msg;
  document.getElementById('gh-login-btn').disabled = true;
}

function launchApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  
  // Initialize data
  state.projects = JSON.parse(JSON.stringify(REAL_PROJECTS));
  state.faculty = REAL_FACULTY;
  state.students = REAL_STUDENTS;

  setupUI();
  buildNav();
  showDashboard();
}

function setupUI() {
  if (state.user) {
    document.getElementById('user-login').textContent = state.user.login || 'User';
    document.getElementById('user-avatar').src = state.user.avatar_url || '';
  }
}

function logout() {
  sessionStorage.clear();
  state = { user: null, token: '' };
  location.reload();
}

// ══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════════════

function buildNav() {
  const nav = document.getElementById('sidebar');
  const items = [
    { icon: 'ti-layout-dashboard', text: 'Dashboard', fn: 'showDashboard' },
    { icon: 'ti-folder', text: 'All Projects', fn: 'showProjects' },
    { icon: 'ti-checklist', text: 'My Tasks', fn: 'showMyTasks' },
    { icon: 'ti-file-upload', text: 'Submissions', fn: 'showSubmissions' }
  ];

  nav.innerHTML = items.map(item => `
    <button class="nav-item" onclick="${item.fn}()">
      <i class="ti ${item.icon}"></i>
      <span>${item.text}</span>
    </button>
  `).join('');
}

function showPage(pageContent) {
  document.getElementById('main-content').innerHTML = pageContent;
}

// ══════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════

function showDashboard() {
  updateNav('showDashboard');
  const activeProjects = state.projects.filter(p => p.status === 'Active').length;
  const totalTasks = state.projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);

  const html = `
    <div class="page-hdr">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Internship program overview</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title"><i class="ti ti-folder"></i>Active Projects</div>
        <div style="font-size:32px;font-weight:700;color:var(--accent);margin:10px 0">${activeProjects}</div>
        <div style="font-size:13px;color:var(--text2)">Out of ${state.projects.length} total projects</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-checklist"></i>Tasks Created</div>
        <div style="font-size:32px;font-weight:700;color:var(--blue);margin:10px 0">${totalTasks}</div>
        <div style="font-size:13px;color:var(--text2)">Across all projects</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-users"></i>Total Students</div>
        <div style="font-size:32px;font-weight:700;color:var(--amber);margin:10px 0">${state.students.length}</div>
        <div style="font-size:13px;color:var(--text2)">Registered students</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-user"></i>Faculty Guides</div>
        <div style="font-size:32px;font-weight:700;color:var(--accent);margin:10px 0">${state.faculty.length}</div>
        <div style="font-size:13px;color:var(--text2)">Project mentors</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-folder"></i>Recent Projects</div>
      ${state.projects.slice(0, 3).map(p => `
        <div style="padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="viewProjectDetails(${p.id})">
          <div style="font-weight:500;margin-bottom:4px">${p.title.slice(0,60)}...</div>
          <div style="font-size:12px;color:var(--text2)">Guide: ${p.guide}</div>
        </div>
      `).join('')}
    </div>
  `;

  showPage(html);
}

function showProjects() {
  updateNav('showProjects');
  const html = `
    <div class="page-hdr">
      <div>
        <h1 class="page-title">All Projects</h1>
        <p class="page-sub">${state.projects.length} cybersecurity internship projects</p>
      </div>
    </div>

    <div class="filter-bar">
      <div class="search-box">
        <i class="ti ti-search"></i>
        <input type="text" placeholder="Search projects..." onkeyup="filterProjects(this.value)">
      </div>
    </div>

    <div id="projects-container">
      ${state.projects.map(p => `
        <div class="proj-card" onclick="viewProjectDetails(${p.id})">
          <div class="proj-title">${p.title}</div>
          <div class="proj-guide">Guide: <strong>${p.guide}</strong></div>
          <div class="proj-stats">
            <span><i class="ti ti-users" style="font-size:13px;margin-right:4px"></i>${p.students.length} students</span>
            <span><i class="ti ti-checklist" style="font-size:13px;margin-right:4px"></i>${p.tasks?.length || 0} tasks</span>
            <span style="margin-left:auto"><span class="badge">${p.status}</span></span>
          </div>
          <div class="proj-footer">
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();viewProjectDetails(${p.id})">View Details</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  showPage(html);
}

function viewProjectDetails(projId) {
  const proj = state.projects.find(p => p.id === projId);
  if (!proj) return;

  state.currentProject = proj;
  updateNav(null);

  const html = `
    <div class="page-hdr">
      <div>
        <button class="btn btn-sm" onclick="showProjects()" style="margin-bottom:8px"><i class="ti ti-arrow-left"></i> Back</button>
        <h1 class="page-title">${proj.title}</h1>
        <p class="page-sub">Project ID: ${proj.id}</p>
      </div>
    </div>

    <div class="project-detail-view">
      <div class="detail-section">
        <div class="detail-label">Primary Guide</div>
        <div class="detail-value">${proj.guide}</div>
        
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="badge">${proj.status}</span></div>

        <div class="detail-label">Start Date</div>
        <div class="detail-value">${proj.startDate}</div>

        <div class="detail-label">End Date</div>
        <div class="detail-value">${proj.endDate}</div>
      </div>

      <div class="detail-section">
        <div class="detail-label">Description</div>
        <div class="detail-value">${proj.description}</div>

        <div class="detail-label">Students Enrolled</div>
        <div class="detail-value">${proj.students.length} / 20</div>

        <div style="margin-top:12px">
          <button class="btn btn-sm btn-primary" onclick="openModal('add-student-modal')" style="width:100%">
            <i class="ti ti-plus"></i> Add Student
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-users"></i>Project Mentors (${proj.mentors.length})</div>
      <div style="margin-bottom:12px">
        ${proj.mentors.map(m => `<div style="padding:6px 0;font-size:13px">• ${m}</div>`).join('')}
      </div>
      <button class="btn btn-primary" onclick="openModal('add-mentor-modal')">
        <i class="ti ti-plus"></i> Add Another Mentor
      </button>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-checklist"></i>Tasks (${proj.tasks?.length || 0})</div>
      ${(proj.tasks?.length || 0) > 0 ? `
        <div class="timeline">
          ${proj.tasks.map(t => `
            <div class="timeline-item">
              <div class="timeline-title">${t.title}</div>
              <div class="timeline-date">
                ${t.startDate} to ${t.endDate}
              </div>
              <div style="font-size:12px;color:var(--text2);margin-top:4px">${t.description}</div>
            </div>
          `).join('')}
        </div>
      ` : '<div style="color:var(--text3);font-size:13px">No tasks created yet</div>'}
      <button class="btn btn-primary" onclick="openModal('add-task-modal')" style="width:100%;margin-top:12px">
        <i class="ti ti-plus"></i> Create New Task
      </button>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-file-upload"></i>Student Submissions</div>
      <div class="card" style="padding:0;overflow:hidden;margin:0;background:transparent;border:none">
        <div class="table-hdr">
          <div>Student</div>
          <div>Task</div>
          <div>Status</div>
          <div>Submission</div>
          <div>Date</div>
          <div style="text-align:right">Actions</div>
        </div>
        ${state.submissions.filter(s => s.projectId === proj.id).length > 0 ? `
          ${state.submissions.filter(s => s.projectId === proj.id).map(s => `
            <div class="table-row">
              <div style="font-size:13px">${s.studentName}</div>
              <div style="font-size:12px;color:var(--text2)">${s.taskTitle}</div>
              <div><span class="badge" style="background:${s.status==='Pending'?'rgba(245,166,35,0.1)':'rgba(45,232,176,0.1)'};color:${s.status==='Pending'?'var(--amber)':'var(--accent)'}">${s.status}</span></div>
              <div style="font-size:12px;color:var(--blue)"><a href="${s.link}" target="_blank" style="color:inherit">View</a></div>
              <div style="font-size:12px;color:var(--text2)">${s.date}</div>
              <div style="text-align:right;font-size:12px">
                <button class="btn btn-sm" onclick="reviewSubmission(${s.id})">Review</button>
              </div>
            </div>
          `).join('')}
        ` : '<div style="padding:12px;color:var(--text3);font-size:13px">No submissions yet</div>'}
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ti ti-users"></i>Enrolled Students</div>
      ${proj.students.length > 0 ? `
        <div class="timeline">
          ${proj.students.map(s => `
            <div class="timeline-item">
              <div class="timeline-title">${s}</div>
            </div>
          `).join('')}
        </div>
      ` : '<div style="color:var(--text3)">No students enrolled yet</div>'}
    </div>
  `;

  showPage(html);

  // Populate modals
  populateSelectOptions();
}

function showMyTasks() {
  updateNav('showMyTasks');
  const allTasks = [];
  state.projects.forEach(p => {
    (p.tasks || []).forEach(t => {
      allTasks.push({ ...t, projectId: p.id, projectTitle: p.title });
    });
  });

  const html = `
    <div class="page-hdr">
      <div>
        <h1 class="page-title">My Tasks</h1>
        <p class="page-sub">${allTasks.length} total tasks</p>
      </div>
    </div>

    ${allTasks.length > 0 ? `
      ${allTasks.map(t => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
            <div>
              <div style="font-weight:600;font-size:14px">${t.title}</div>
              <div style="font-size:12px;color:var(--text2)">Project: ${t.projectTitle}</div>
            </div>
            <div style="text-align:right;font-size:12px">
              <div style="color:var(--text3)">Due: ${t.endDate}</div>
              <div style="color:var(--accent);margin-top:4px">${t.status || 'Pending'}</div>
            </div>
          </div>
          <div style="font-size:13px;color:var(--text2);margin-bottom:10px">${t.description}</div>
          <button class="btn btn-primary btn-sm" onclick="openModal('submit-work-modal')">
            <i class="ti ti-file-upload"></i> Submit Work
          </button>
        </div>
      `).join('')}
    ` : `
      <div class="card">
        <div style="color:var(--text3);text-align:center;padding:20px">No tasks assigned yet</div>
      </div>
    `}
  `;

  showPage(html);
  populateTaskSelect();
}

function showSubmissions() {
  updateNav('showSubmissions');
  const html = `
    <div class="page-hdr">
      <div>
        <h1 class="page-title">Submissions</h1>
        <p class="page-sub">${state.submissions.length} total submissions</p>
      </div>
      <button class="btn btn-primary" onclick="openModal('submit-work-modal')">
        <i class="ti ti-plus"></i> New Submission
      </button>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div class="table-hdr">
        <div>Student</div>
        <div>Project</div>
        <div>Task</div>
        <div>Type</div>
        <div>Status</div>
        <div>Date</div>
        <div style="text-align:right">Actions</div>
      </div>
      ${state.submissions.length > 0 ? `
        ${state.submissions.map(s => `
          <div class="table-row">
            <div>${s.studentName}</div>
            <div style="font-size:12px;color:var(--text2)">Project ${s.projectId}</div>
            <div style="font-size:12px;color:var(--text2)">${s.taskTitle}</div>
            <div><span class="badge" style="background:rgba(74,158,255,0.1);color:var(--blue)">${s.type}</span></div>
            <div><span class="badge" style="background:${s.status==='Pending'?'rgba(245,166,35,0.1)':'rgba(45,232,176,0.1)'};color:${s.status==='Pending'?'var(--amber)':'var(--accent)'}">${s.status}</span></div>
            <div style="font-size:12px">${s.date}</div>
            <div style="text-align:right">
              <button class="btn btn-sm" onclick="window.open('${s.link}','_blank')">View</button>
            </div>
          </div>
        `).join('')}
      ` : `
        <div style="padding:20px;color:var(--text3);text-align:center">No submissions yet</div>
      `}
    </div>
  `;

  showPage(html);
}

// ══════════════════════════════════════════════════════════════════════
// FUNCTIONS
// ══════════════════════════════════════════════════════════════════════

function updateNav(fn) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (fn) {
    document.querySelector(`[onclick="${fn}()"]`)?.classList.add('active');
  }
}

function openModal(id) {
  document.getElementById('modal-overlay').classList.add('open');
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function populateSelectOptions() {
  if (!state.currentProject) return;

  // Mentor select
  const mentorSelect = document.getElementById('mentor-select');
  if (mentorSelect) {
    mentorSelect.innerHTML = state.faculty
      .filter(f => !state.currentProject.mentors.includes(f.name))
      .map(f => `<option value="${f.name}">${f.name}</option>`)
      .join('');
  }

  // Student select
  const studentSelect = document.getElementById('student-select');
  if (studentSelect) {
    studentSelect.innerHTML = state.students
      .filter(s => !state.currentProject.students.includes(s.name))
      .map(s => `<option value="${s.name}">${s.name} (${s.college})</option>`)
      .join('');
  }
}

function populateTaskSelect() {
  const taskSelect = document.getElementById('submit-task');
  if (!taskSelect) return;

  const allTasks = [];
  state.projects.forEach(p => {
    (p.tasks || []).forEach(t => {
      allTasks.push(`${p.title.slice(0,30)}... - ${t.title}`);
    });
  });

  taskSelect.innerHTML = allTasks.map(t => `<option value="${t}">${t}</option>`).join('');
}

function addMentor() {
  if (!state.currentProject) return;
  const select = document.getElementById('mentor-select');
  const name = select.value;
  
  if (!state.currentProject.mentors.includes(name)) {
    state.currentProject.mentors.push(name);
    toast(`✓ ${name} added as mentor`, 'success');
    closeModal();
    viewProjectDetails(state.currentProject.id);
  }
}

function addStudent() {
  if (!state.currentProject) return;
  const select = document.getElementById('student-select');
  const name = select.value;
  
  if (!state.currentProject.students.includes(name)) {
    state.currentProject.students.push(name);
    toast(`✓ ${name} added to project`, 'success');
    closeModal();
    viewProjectDetails(state.currentProject.id);
  }
}

function createTask() {
  if (!state.currentProject) return;

  const title = document.getElementById('task-title').value.trim();
  const start = document.getElementById('task-start').value;
  const end = document.getElementById('task-end').value;
  const desc = document.getElementById('task-desc').value.trim();

  if (!title || !start || !end) {
    toast('Please fill all required fields', 'error');
    return;
  }

  if (!state.currentProject.tasks) state.currentProject.tasks = [];

  state.currentProject.tasks.push({
    id: Date.now(),
    title,
    startDate: start,
    endDate: end,
    description: desc,
    status: 'Pending'
  });

  toast('✓ Task created successfully', 'success');
  closeModal();
  viewProjectDetails(state.currentProject.id);
}

function submitWork() {
  const type = document.getElementById('submit-type').value;
  const link = document.getElementById('submit-link').value.trim();
  const notes = document.getElementById('submit-notes').value.trim();
  const taskText = document.getElementById('submit-task').value;

  if (!link) {
    toast('Please provide submission link', 'error');
    return;
  }

  const [projectAndTask, taskTitle] = taskText.split(' - ');

  state.submissions.push({
    id: Date.now(),
    projectId: state.currentProject?.id || 1,
    studentName: state.user?.login || 'Anonymous',
    taskTitle: taskTitle || 'Unknown',
    type: type,
    link: link,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    notes: notes
  });

  toast('✓ Work submitted successfully', 'success');
  closeModal();
  showSubmissions();
}

function filterProjects(query) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const filtered = state.projects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.guide.toLowerCase().includes(query.toLowerCase())
  );

  container.innerHTML = filtered.map(p => `
    <div class="proj-card" onclick="viewProjectDetails(${p.id})">
      <div class="proj-title">${p.title}</div>
      <div class="proj-guide">Guide: <strong>${p.guide}</strong></div>
      <div class="proj-stats">
        <span><i class="ti ti-users" style="font-size:13px;margin-right:4px"></i>${p.students.length} students</span>
        <span><i class="ti ti-checklist" style="font-size:13px;margin-right:4px"></i>${p.tasks?.length || 0} tasks</span>
        <span style="margin-left:auto"><span class="badge">${p.status}</span></span>
      </div>
      <div class="proj-footer">
        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();viewProjectDetails(${p.id})">View Details</button>
      </div>
    </div>
  `).join('');
}

function reviewSubmission(id) {
  const sub = state.submissions.find(s => s.id === id);
  if (sub) window.open(sub.link, '_blank');
}

function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show';
  if (type) el.style.borderColor = type === 'success' ? 'rgba(45,232,176,0.3)' : 'rgba(255,87,87,0.3)';
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ══════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('code')) {
    handleGitHubCallback();
  } else if (sessionStorage.getItem('gh_token')) {
    // Resume existing session
    state.user = { login: 'user', avatar_url: '' };
    state.token = sessionStorage.getItem('gh_token');
    launchApp();
  }
});
