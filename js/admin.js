/**
 * WEBZER ADMIN PANEL — JavaScript
 * Pure vanilla JS, ES6+, localStorage for data
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ── UTILITIES ──
function getData() {
    return JSON.parse(localStorage.getItem('webzer_admin_data') || '{}');
}

function saveData(data) {
    localStorage.setItem('webzer_admin_data', JSON.stringify(data));
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function getStatusBadge(status) {
    const labels = { new: 'New', read: 'Read', replied: 'Replied', progress: 'In Progress', completed: 'Completed', hold: 'On Hold' };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ── SEED DATA ──
const DEFAULT_DATA = {
    enquiries: [],
    projects: [],
    clients: [],
    settings: {
        companyName: 'WEBZER_SERVICES',
        email: 'yourmail@gmail.com',
        phone: '+91 00000 00000',
        instagram: '@webzer_services',
        whatsapp: ''
    }
};

let appData = {};

// ── INIT ──
function initApp() {
    // Force clear any old sample data and start fresh
    if (!localStorage.getItem('webzer_data_cleared_v3')) {
        saveData(DEFAULT_DATA);
        localStorage.setItem('webzer_data_cleared_v3', 'true');
    }
    appData = getData();
    if (!appData.enquiries) appData.enquiries = [];
    if (!appData.projects) appData.projects = [];
    if (!appData.clients) appData.clients = [];

    // Auto-login check
    if (sessionStorage.getItem('webzer_admin_logged') === 'true') {
        showDashboard();
    }

    setupEvents();
}

// ── EVENT LISTENERS ──
function setupEvents() {
    // Login form — matches HTML id="loginForm", inputs id="loginEmail", id="loginPassword"
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');

            if (email === 'admin@webzer.com' && password === 'admin123') {
                sessionStorage.setItem('webzer_admin_logged', 'true');
                if (errorEl) errorEl.textContent = '';
                showDashboard();
            } else {
                if (errorEl) {
                    errorEl.textContent = '❌ Invalid email or password';
                    errorEl.style.animation = 'none';
                    errorEl.offsetHeight; // trigger reflow
                    errorEl.style.animation = 'shake 0.4s ease';
                }
            }
        });
    }

    // Sidebar navigation — matches HTML: <li data-target="page-dashboard">
    const navList = document.getElementById('navList');
    if (navList) {
        navList.addEventListener('click', (e) => {
            const li = e.target.closest('li[data-target]');
            if (!li) return;
            const target = li.getAttribute('data-target');
            navigateTo(target);
        });
    }

    // Logout — matches HTML id="logoutBtn"
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('webzer_admin_logged');
            showLogin();
        });
    }

    // Mobile sidebar toggle — matches HTML id="mobileToggle"
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });
    }

    // Close modals — matches HTML class="close-modal" and class="close-modal-btn"
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Enquiry filter — matches HTML id="enquiryFilter"
    const enquiryFilter = document.getElementById('enquiryFilter');
    if (enquiryFilter) {
        enquiryFilter.addEventListener('change', () => {
            renderEnquiries(enquiryFilter.value);
        });
    }

    // Add Project button — matches HTML id="addProjectBtn"
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            document.getElementById('projectForm')?.reset();
            document.getElementById('projId').value = '';
            document.getElementById('projProgressVal').textContent = '0%';
            document.getElementById('projectModalTitle').textContent = 'Add New Project';
            showModal('projectModal');
        });
    }

    // Project form — matches HTML id="projectForm"
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleSaveProject);
    }

    // Progress slider display — matches HTML id="projProgress" and id="projProgressVal"
    const projProgress = document.getElementById('projProgress');
    if (projProgress) {
        projProgress.addEventListener('input', () => {
            document.getElementById('projProgressVal').textContent = projProgress.value + '%';
        });
    }

    // Add Client button — matches HTML id="addClientBtn"
    const addClientBtn = document.getElementById('addClientBtn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', () => {
            document.getElementById('clientForm')?.reset();
            document.getElementById('clientId').value = '';
            document.getElementById('clientModalTitle').textContent = 'Add Client';
            showModal('clientModal');
        });
    }

    // Client form — matches HTML id="clientForm"
    const clientForm = document.getElementById('clientForm');
    if (clientForm) {
        clientForm.addEventListener('submit', handleSaveClient);
    }

    // Enquiry modal buttons — matches HTML id="markReadBtn" and id="markRepliedBtn"
    document.getElementById('markReadBtn')?.addEventListener('click', () => {
        updateEnquiryStatus('read');
    });
    document.getElementById('markRepliedBtn')?.addEventListener('click', () => {
        updateEnquiryStatus('replied');
    });

    // Settings forms — matches HTML id="settingsBusinessForm" and id="settingsSocialForm"
    document.getElementById('settingsBusinessForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appData.settings.companyName = document.getElementById('setCompany').value;
        appData.settings.email = document.getElementById('setEmail').value;
        appData.settings.phone = document.getElementById('setPhone').value;
        saveData(appData);
        alert('✅ Business settings saved!');
    });

    document.getElementById('settingsSocialForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appData.settings.instagram = document.getElementById('setInsta').value;
        appData.settings.whatsapp = document.getElementById('setWa').value;
        saveData(appData);
        alert('✅ Security & social settings saved!');
    });

    // Clear all data button — matches HTML id="clearAllDataBtn"
    document.getElementById('clearAllDataBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete ALL enquiries, projects, and clients? This cannot be undone.')) {
            appData.enquiries = [];
            appData.projects = [];
            appData.clients = [];
            saveData(appData);
            alert('✅ All enquiries, projects, and clients have been deleted.');
            renderDashboard();
        }
    });
}

// ── SHOW / HIDE SCREENS ──
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    appData = getData();
    navigateTo('page-dashboard');
}

// ── NAVIGATION ──
// Matches HTML: page sections have class="page-section", sidebar <li> elements
function navigateTo(pageId) {
    // Hide all pages, show target
    document.querySelectorAll('.page-section').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Update sidebar active
    const navList = document.getElementById('navList');
    if (navList) {
        navList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        const activeLi = navList.querySelector(`li[data-target="${pageId}"]`);
        if (activeLi) activeLi.classList.add('active');
    }

    // Update page title — matches HTML id="pageTitle"
    const titles = {
        'page-dashboard': 'Dashboard',
        'page-enquiries': 'Enquiries',
        'page-projects': 'Projects',
        'page-clients': 'Clients',
        'page-settings': 'Settings'
    };
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = titles[pageId] || 'Dashboard';

    // Render page content
    appData = getData();
    switch (pageId) {
        case 'page-dashboard': renderDashboard(); break;
        case 'page-enquiries': renderEnquiries('All'); break;
        case 'page-projects': renderProjects(); break;
        case 'page-clients': renderClients(); break;
        case 'page-settings': renderSettings(); break;
    }

    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('active');
}

// ── DASHBOARD ──
// Matches HTML ids: stat-enquiries, stat-projects, stat-clients, stat-revenue,
// recent-enquiries-body, recent-projects-list
function renderDashboard() {
    const el = (id) => document.getElementById(id);

    el('stat-enquiries').textContent = appData.enquiries?.length || 0;
    el('stat-projects').textContent = appData.projects?.filter(p => p.status === 'progress').length || 0;
    el('stat-clients').textContent = appData.clients?.length || 0;

    const revenue = (appData.projects?.filter(p => p.status === 'completed').length || 0) * 15000;
    el('stat-revenue').textContent = '₹' + revenue.toLocaleString('en-IN');

    // Recent enquiries table
    const tbody = el('recent-enquiries-body');
    if (tbody) {
        tbody.innerHTML = '';
        const recent = [...(appData.enquiries || [])].reverse().slice(0, 5);
        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:1.75rem; color:#666666;">No enquiries yet</td></tr>';
        } else {
            recent.forEach(enq => {
                tbody.innerHTML += `<tr>
                    <td>${enq.name}</td>
                    <td>${enq.service}</td>
                    <td>${getStatusBadge(enq.status)}</td>
                </tr>`;
            });
        }
    }

    // Recent projects list
    const projList = el('recent-projects-list');
    if (projList) {
        projList.innerHTML = '';
        const recentProj = [...(appData.projects || [])].slice(0, 4);
        if (recentProj.length === 0) {
            projList.innerHTML = '<li style="justify-content:center; color:#666666; padding:1.25rem 0;">No active projects</li>';
        } else {
            recentProj.forEach(proj => {
                projList.innerHTML += `<li>
                    <span>${proj.name}</span>
                    ${getStatusBadge(proj.status)}
                </li>`;
            });
        }
    }
}

// ── ENQUIRIES ──
// Matches HTML id="enquiries-body"
let currentEnquiryId = null;

function renderEnquiries(filter) {
    const tbody = document.getElementById('enquiries-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    let list = [...(appData.enquiries || [])].reverse();

    if (filter && filter !== 'All') {
        list = list.filter(e => e.status === filter.toLowerCase());
    }

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:3rem; color:#666666;">No enquiries found</td></tr>';
        return;
    }

    list.forEach((enq, i) => {
        tbody.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td>${enq.name}</td>
            <td>${enq.email}</td>
            <td>${enq.service}</td>
            <td>${formatDate(enq.date)}</td>
            <td>${getStatusBadge(enq.status)}</td>
            <td>
                <button class="action-btn" onclick="viewEnquiry(${enq.id})">👁</button>
                <button class="action-btn delete" onclick="deleteEnquiry(${enq.id})">🗑</button>
            </td>
        </tr>`;
    });
}

window.viewEnquiry = function(id) {
    const enq = appData.enquiries.find(e => e.id === id);
    if (!enq) return;
    currentEnquiryId = id;

    const content = document.getElementById('enquiryDetailsContent');
    if (content) {
        content.innerHTML = `
            <div class="enquiry-detail">
                <p><strong>Name:</strong> ${enq.name}</p>
                <p><strong>Email:</strong> ${enq.email}</p>
                <p><strong>Phone:</strong> ${enq.phone}</p>
                <p><strong>Service:</strong> ${enq.service}</p>
                <p><strong>Date:</strong> ${formatDate(enq.date)}</p>
                <p><strong>Status:</strong> ${getStatusBadge(enq.status)}</p>
                <p><strong>Message:</strong><br>${enq.message}</p>
            </div>
        `;
    }
    showModal('enquiryModal');
};

function updateEnquiryStatus(status) {
    if (!currentEnquiryId) return;
    const idx = appData.enquiries.findIndex(e => e.id === currentEnquiryId);
    if (idx !== -1) {
        appData.enquiries[idx].status = status;
        saveData(appData);
        renderEnquiries(document.getElementById('enquiryFilter')?.value || 'All');
        hideModal('enquiryModal');
        if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
    }
}

window.deleteEnquiry = function(id) {
    if (!confirm('Delete this enquiry?')) return;
    appData.enquiries = appData.enquiries.filter(e => e.id !== id);
    saveData(appData);
    renderEnquiries(document.getElementById('enquiryFilter')?.value || 'All');
};

// ── PROJECTS ──
// Matches HTML id="projects-grid"
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const projs = appData.projects || [];
    if (projs.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; color: #777777; background: #0d0d0d; border-radius: 14px; border: 1px dashed rgba(255,255,255,0.1);"><p style="font-size:1.1rem; margin-bottom:0.5rem; color:#ffffff;">No projects yet</p><p style="font-size:0.85rem;">Click "Add New Project" above to create your first project.</p></div>';
        return;
    }

    projs.forEach(proj => {
        grid.innerHTML += `<div class="project-card">
            <h4>${proj.name}</h4>
            <p class="client-name">Client: ${proj.client}</p>
            ${getStatusBadge(proj.status)}
            <div class="progress-bar"><div class="progress-fill" style="width:${proj.progress}%"></div></div>
            <div class="project-meta">
                <span>${proj.progress}% complete</span>
                <span>${formatDate(proj.startDate)}</span>
            </div>
            <div class="project-actions">
                <button class="action-btn" onclick="editProject(${proj.id})">✏️ Edit</button>
                <button class="action-btn delete" onclick="deleteProject(${proj.id})">🗑 Delete</button>
            </div>
        </div>`;
    });
}

window.editProject = function(id) {
    const proj = appData.projects.find(p => p.id === id);
    if (!proj) return;
    document.getElementById('projId').value = proj.id;
    document.getElementById('projName').value = proj.name;
    document.getElementById('projClient').value = proj.client;
    document.getElementById('projStatus').value = proj.status === 'progress' ? 'In Progress' : proj.status === 'completed' ? 'Completed' : 'On Hold';
    document.getElementById('projProgress').value = proj.progress;
    document.getElementById('projProgressVal').textContent = proj.progress + '%';
    document.getElementById('projStart').value = proj.startDate;
    document.getElementById('projDesc').value = proj.description || '';
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    showModal('projectModal');
};

function handleSaveProject(e) {
    e.preventDefault();
    const id = document.getElementById('projId').value;
    const statusMap = { 'In Progress': 'progress', 'Completed': 'completed', 'On Hold': 'hold' };
    const newProj = {
        name: document.getElementById('projName').value,
        client: document.getElementById('projClient').value,
        status: statusMap[document.getElementById('projStatus').value] || 'progress',
        progress: parseInt(document.getElementById('projProgress').value),
        startDate: document.getElementById('projStart').value || new Date().toISOString().split('T')[0],
        description: document.getElementById('projDesc').value
    };

    if (id) {
        const idx = appData.projects.findIndex(p => p.id == id);
        if (idx !== -1) { newProj.id = parseInt(id); appData.projects[idx] = newProj; }
    } else {
        newProj.id = Date.now();
        appData.projects.push(newProj);
    }

    saveData(appData);
    hideModal('projectModal');
    renderProjects();
}

window.deleteProject = function(id) {
    if (!confirm('Delete this project?')) return;
    appData.projects = appData.projects.filter(p => p.id !== id);
    saveData(appData);
    renderProjects();
};

// ── CLIENTS ──
// Matches HTML id="clients-body"
function renderClients() {
    const tbody = document.getElementById('clients-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const clients = appData.clients || [];
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:3rem; color:#666666;">No clients found. Click "Add Client" above to add one.</td></tr>';
        return;
    }

    clients.forEach((client, i) => {
        tbody.innerHTML += `<tr>
            <td>${i + 1}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.projects}</td>
            <td>${formatDate(client.joinDate)}</td>
            <td>
                <button class="action-btn" onclick="editClient(${client.id})">✏️</button>
                <button class="action-btn delete" onclick="deleteClient(${client.id})">🗑</button>
            </td>
        </tr>`;
    });
}

window.editClient = function(id) {
    const client = appData.clients.find(c => c.id === id);
    if (!client) return;
    document.getElementById('clientId').value = client.id;
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientModalTitle').textContent = 'Edit Client';
    showModal('clientModal');
};

function handleSaveClient(e) {
    e.preventDefault();
    const id = document.getElementById('clientId').value;
    const newClient = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        projects: 0,
        joinDate: new Date().toISOString().split('T')[0]
    };

    if (id) {
        const idx = appData.clients.findIndex(c => c.id == id);
        if (idx !== -1) {
            newClient.id = parseInt(id);
            newClient.projects = appData.clients[idx].projects;
            newClient.joinDate = appData.clients[idx].joinDate;
            appData.clients[idx] = newClient;
        }
    } else {
        newClient.id = Date.now();
        appData.clients.push(newClient);
    }

    saveData(appData);
    hideModal('clientModal');
    renderClients();
}

window.deleteClient = function(id) {
    if (!confirm('Delete this client?')) return;
    appData.clients = appData.clients.filter(c => c.id !== id);
    saveData(appData);
    renderClients();
};

// ── SETTINGS ──
function renderSettings() {
    const s = appData.settings || {};
    const el = (id) => document.getElementById(id);
    if (el('setCompany')) el('setCompany').value = s.companyName || '';
    if (el('setEmail')) el('setEmail').value = s.email || '';
    if (el('setPhone')) el('setPhone').value = s.phone || '';
    if (el('setInsta')) el('setInsta').value = s.instagram || '';
    if (el('setWa')) el('setWa').value = s.whatsapp || '';
}

// ── Shake animation (inline keyframe) ──
const style = document.createElement('style');
style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
document.head.appendChild(style);
