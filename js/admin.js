/**
 * Admin Panel - WEBZER_SERVICES
 * Pure vanilla JS, ES6+
 * Data stored in localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// --- UTILITIES ---
function getData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// --- INITIALIZATION ---
function initApp() {
    // 1. Mock Data Initialization
    const defaultAdminData = {
        enquiries: [
            { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', service: 'Website Development', message: 'I need a professional website for my restaurant business. Looking for a modern design with online menu and reservation system.', date: '2026-09-28', status: 'new' },
            { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', service: 'Logo & Branding', message: 'Need a complete brand identity for my new fashion startup. Logo, color palette, and business cards.', date: '2026-09-27', status: 'read' },
            { id: 3, name: 'Arun Patel', email: 'arun@example.com', phone: '+91 76543 21098', service: 'Landing Page', message: 'Want a high-converting landing page for my upcoming product launch. Need it within 2 weeks.', date: '2026-09-25', status: 'replied' },
            { id: 4, name: 'Deepika Nair', email: 'deepika@example.com', phone: '+91 65432 10987', service: 'Web Design', message: 'Looking to redesign my existing portfolio website. Want a more modern and minimalist look.', date: '2026-09-24', status: 'new' },
            { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 54321 09876', service: 'Digital Solutions', message: 'Need a complete digital solution for my retail business - website, WhatsApp integration, and basic SEO.', date: '2026-09-23', status: 'new' }
        ],
        projects: [
            { id: 1, name: 'Restaurant Website', client: 'Rahul Kumar', status: 'progress', progress: 65, startDate: '2026-09-15', description: 'Modern restaurant website with online menu and reservation.' },
            { id: 2, name: 'Fashion Brand Identity', client: 'Priya Sharma', status: 'progress', progress: 40, startDate: '2026-09-20', description: 'Complete brand identity including logo and guidelines.' },
            { id: 3, name: 'Product Landing Page', client: 'Arun Patel', status: 'completed', progress: 100, startDate: '2026-09-10', description: 'High-converting landing page for product launch.' },
            { id: 4, name: 'Portfolio Redesign', client: 'Deepika Nair', status: 'hold', progress: 20, startDate: '2026-09-22', description: 'Minimalist portfolio website redesign.' }
        ],
        clients: [
            { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', projects: 1, joinDate: '2026-09-15' },
            { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', projects: 1, joinDate: '2026-09-20' },
            { id: 3, name: 'Arun Patel', email: 'arun@example.com', phone: '+91 76543 21098', projects: 1, joinDate: '2026-09-10' }
        ],
        settings: {
            companyName: 'Webzer',
            email: 'yourmail@gmail.com',
            phone: '+91 00000 00000',
            instagram: '@webzer_services',
            whatsapp: ''
        }
    };

    if (!localStorage.getItem('webzer_admin_data')) {
        saveData('webzer_admin_data', defaultAdminData);
    }

    // Check login status
    if (sessionStorage.getItem('webzer_admin_logged') === 'true') {
        showDashboard();
    } else {
        showLogin();
    }

    setupEventListeners();
}

let appData = {};

function loadData() {
    appData = getData('webzer_admin_data', {});
}

// --- LOGIN ---
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute('data-target');
            if(targetPage) navigateTo(targetPage, item);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (email === 'admin@webzer.com' && password === 'admin123') {
        sessionStorage.setItem('webzer_admin_logged', 'true');
        showDashboard();
    } else {
        if (loginError) {
            loginError.textContent = 'Invalid credentials';
            loginError.style.display = 'block';
            loginError.classList.add('shake');
            setTimeout(() => loginError.classList.remove('shake'), 500);
        }
    }
}

function handleLogout(e) {
    if(e) e.preventDefault();
    sessionStorage.removeItem('webzer_admin_logged');
    showLogin();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadData();
    navigateTo('page-dashboard');
}

// --- NAVIGATION ---
function navigateTo(pageId, navElement = null) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.style.display = 'none');

    // Show target page
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';

    // Update active class
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (navElement) {
        navElement.classList.add('active');
        const title = navElement.querySelector('span').textContent;
        const pageTitle = document.getElementById('topbarPageTitle');
        if (pageTitle) pageTitle.textContent = title;
    } else {
        const item = document.querySelector(`.sidebar-nav-item[data-target="${pageId}"]`);
        if (item) {
            item.classList.add('active');
            const title = item.querySelector('span').textContent;
            const pageTitle = document.getElementById('topbarPageTitle');
            if (pageTitle) pageTitle.textContent = title;
        }
    }

    // Render page content
    switch (pageId) {
        case 'page-dashboard': renderDashboard(); break;
        case 'page-enquiries': renderEnquiries(); break;
        case 'page-projects': renderProjects(); break;
        case 'page-clients': renderClients(); break;
        case 'page-settings': renderSettings(); break;
    }

    // Close mobile sidebar if open
    document.getElementById('sidebar')?.classList.remove('active');
}

// --- DASHBOARD ---
function renderDashboard() {
    loadData();
    // Update stats
    const statsEnquiries = document.getElementById('statsEnquiries');
    const statsProjects = document.getElementById('statsProjects');
    const statsClients = document.getElementById('statsClients');

    if(statsEnquiries) statsEnquiries.textContent = appData.enquiries.length;
    if(statsProjects) statsProjects.textContent = appData.projects.filter(p => p.status === 'progress').length;
    if(statsClients) statsClients.textContent = appData.clients.length;

    // Render recent enquiries (last 5)
    const recentEnquiriesTable = document.getElementById('recentEnquiriesTableBody');
    if (recentEnquiriesTable) {
        recentEnquiriesTable.innerHTML = '';
        const recent = [...appData.enquiries].reverse().slice(0, 5);
        recent.forEach(enq => {
            recentEnquiriesTable.innerHTML += `
                <tr>
                    <td>${enq.name}</td>
                    <td>${enq.service}</td>
                    <td><span class="badge badge-${enq.status}">${enq.status}</span></td>
                </tr>
            `;
        });
    }
}

// --- ENQUIRIES ---
function renderEnquiries(filter = 'all') {
    loadData();
    const tableBody = document.getElementById('enquiriesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    let filtered = appData.enquiries;
    if (filter !== 'all') {
        filtered = filtered.filter(e => e.status === filter);
    }

    filtered.reverse().forEach(enq => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(enq.date)}</td>
            <td>${enq.name}</td>
            <td>${enq.service}</td>
            <td><span class="badge badge-${enq.status}">${enq.status}</span></td>
            <td>
                <button onclick="viewEnquiry(${enq.id})" class="btn-sm">View</button>
                <button onclick="deleteEnquiry(${enq.id})" class="btn-sm btn-danger">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    const filterSelect = document.getElementById('enquiryFilter');
    if (filterSelect) {
        filterSelect.onchange = (e) => renderEnquiries(e.target.value);
    }
}

window.viewEnquiry = function(id) {
    const enq = appData.enquiries.find(e => e.id === id);
    if (!enq) return;

    // Populate modal
    document.getElementById('enqModalName').textContent = enq.name;
    document.getElementById('enqModalEmail').textContent = enq.email;
    document.getElementById('enqModalPhone').textContent = enq.phone;
    document.getElementById('enqModalService').textContent = enq.service;
    document.getElementById('enqModalMessage').textContent = enq.message;
    document.getElementById('enqModalStatus').textContent = enq.status;

    // Set up status buttons
    const statusBtns = document.getElementById('enqStatusButtons');
    statusBtns.innerHTML = `
        <button onclick="updateEnquiryStatus(${id}, 'read')" class="btn">Mark Read</button>
        <button onclick="updateEnquiryStatus(${id}, 'replied')" class="btn">Mark Replied</button>
    `;

    showModal('enquiryModal');
};

window.updateEnquiryStatus = function(id, status) {
    const idx = appData.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
        appData.enquiries[idx].status = status;
        saveData('webzer_admin_data', appData);
        renderEnquiries(document.getElementById('enquiryFilter')?.value || 'all');
        hideModal('enquiryModal');
    }
};

window.deleteEnquiry = function(id) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
        appData.enquiries = appData.enquiries.filter(e => e.id !== id);
        saveData('webzer_admin_data', appData);
        renderEnquiries(document.getElementById('enquiryFilter')?.value || 'all');
    }
};

// --- PROJECTS ---
function renderProjects() {
    loadData();
    const projectsContainer = document.getElementById('projectsContainer');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    appData.projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.innerHTML = `
            <h3>${proj.name}</h3>
            <p>Client: ${proj.client}</p>
            <p>Status: ${proj.status}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${proj.progress}%"></div>
            </div>
            <p>${proj.progress}%</p>
            <div class="card-actions">
                <button onclick="editProject(${proj.id})" class="btn-sm">Edit</button>
                <button onclick="deleteProject(${proj.id})" class="btn-sm btn-danger">Delete</button>
            </div>
        `;
        projectsContainer.appendChild(div);
    });

    const addBtn = document.getElementById('addProjectBtn');
    if(addBtn) {
        addBtn.onclick = () => {
            document.getElementById('projectForm').reset();
            document.getElementById('projectId').value = '';
            showModal('projectModal');
        };
    }

    const form = document.getElementById('projectForm');
    if(form) {
        form.onsubmit = saveProject;
    }
}

window.editProject = function(id) {
    const proj = appData.projects.find(p => p.id === id);
    if (!proj) return;
    
    document.getElementById('projectId').value = proj.id;
    document.getElementById('projectName').value = proj.name;
    document.getElementById('projectClient').value = proj.client;
    document.getElementById('projectStatus').value = proj.status;
    document.getElementById('projectProgress').value = proj.progress;
    document.getElementById('projectDesc').value = proj.description;
    
    showModal('projectModal');
};

function saveProject(e) {
    e.preventDefault();
    const id = document.getElementById('projectId').value;
    const newProj = {
        name: document.getElementById('projectName').value,
        client: document.getElementById('projectClient').value,
        status: document.getElementById('projectStatus').value,
        progress: parseInt(document.getElementById('projectProgress').value),
        description: document.getElementById('projectDesc').value,
        startDate: new Date().toISOString().split('T')[0]
    };

    if (id) {
        // Edit
        const idx = appData.projects.findIndex(p => p.id == id);
        if (idx !== -1) {
            newProj.id = parseInt(id);
            newProj.startDate = appData.projects[idx].startDate; // preserve start date
            appData.projects[idx] = newProj;
        }
    } else {
        // Add
        newProj.id = Date.now();
        appData.projects.push(newProj);
    }
    
    saveData('webzer_admin_data', appData);
    hideModal('projectModal');
    renderProjects();
}

window.deleteProject = function(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        appData.projects = appData.projects.filter(p => p.id !== id);
        saveData('webzer_admin_data', appData);
        renderProjects();
    }
};

// --- CLIENTS ---
function renderClients() {
    loadData();
    const tableBody = document.getElementById('clientsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    appData.clients.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.projects}</td>
            <td>
                <button onclick="editClient(${client.id})" class="btn-sm">Edit</button>
                <button onclick="deleteClient(${client.id})" class="btn-sm btn-danger">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.editClient = function(id) {
    // Add logic here to open client modal
    alert('Edit client ' + id + ' functionality to be implemented with modal');
};

window.deleteClient = function(id) {
    if (confirm('Are you sure you want to delete this client?')) {
        appData.clients = appData.clients.filter(c => c.id !== id);
        saveData('webzer_admin_data', appData);
        renderClients();
    }
};

// --- SETTINGS ---
function renderSettings() {
    loadData();
    const s = appData.settings;
    if(document.getElementById('setCompanyName')) document.getElementById('setCompanyName').value = s.companyName;
    if(document.getElementById('setEmail')) document.getElementById('setEmail').value = s.email;
    if(document.getElementById('setPhone')) document.getElementById('setPhone').value = s.phone;
    if(document.getElementById('setInstagram')) document.getElementById('setInstagram').value = s.instagram;

    const form = document.getElementById('settingsForm');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            appData.settings = {
                companyName: document.getElementById('setCompanyName').value,
                email: document.getElementById('setEmail').value,
                phone: document.getElementById('setPhone').value,
                instagram: document.getElementById('setInstagram').value,
                whatsapp: ''
            };
            saveData('webzer_admin_data', appData);
            alert('Settings saved successfully!');
        };
    }
}
