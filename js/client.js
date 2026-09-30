/**
 * Client Portal - WEBZER_SERVICES
 * Pure vanilla JS, ES6+
 * Data stored in localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    initClientApp();
});

// --- UTILITIES ---
function getData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// --- INITIALIZATION ---
function initClientApp() {
    // 1. Mock Data Initialization
    const defaultClientData = {
        client: { name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', company: 'Kumar Enterprises' },
        projects: [
            { id: 1, name: 'Business Website', status: 'progress', progress: 75, startDate: '2026-09-01', estimatedDelivery: '2026-10-15', currentPhase: 'development', description: 'Professional business website with modern design.', notes: 'Design approved. Development in progress. Homepage and About page completed.' },
            { id: 2, name: 'Logo Design', status: 'completed', progress: 100, startDate: '2026-08-15', estimatedDelivery: '2026-09-01', currentPhase: 'launch', description: 'Professional logo design for Kumar Enterprises.', notes: 'Logo delivered. All files shared via email.' }
        ],
        messages: [
            { id: 1, sender: 'webzer', text: 'Hi Rahul! Welcome to Webzer. We are excited to work with you!', time: '2026-09-01 10:00' },
            { id: 2, sender: 'client', text: 'Thank you! I need a professional business website for my company.', time: '2026-09-01 10:15' },
            { id: 3, sender: 'webzer', text: 'Great! We have started working on the design. Will share mockups by this week.', time: '2026-09-03 14:30' },
            { id: 4, sender: 'webzer', text: 'Hi Rahul, the homepage design is ready. Please check and share your feedback.', time: '2026-09-10 11:00' },
            { id: 5, sender: 'client', text: 'The design looks amazing! Please proceed with development.', time: '2026-09-10 16:45' }
        ],
        invoices: [
            { id: 'INV-001', project: 'Logo Design', amount: 15000, date: '2026-08-15', dueDate: '2026-08-30', status: 'paid', items: [{ service: 'Logo Design', description: 'Professional logo - 3 concepts', amount: 10000 }, { service: 'Brand Guidelines', description: 'Basic brand color palette', amount: 5000 }] },
            { id: 'INV-002', project: 'Business Website', amount: 25000, date: '2026-09-15', dueDate: '2026-10-15', status: 'pending', items: [{ service: 'Website Design', description: '5-page website design', amount: 10000 }, { service: 'Website Development', description: 'Frontend development', amount: 12000 }, { service: 'SEO Setup', description: 'Basic on-page SEO', amount: 3000 }] }
        ]
    };

    if (!localStorage.getItem('webzer_client_data')) {
        saveData('webzer_client_data', defaultClientData);
    }

    // Check login status
    if (sessionStorage.getItem('webzer_client_logged') === 'true') {
        showClientDashboard();
    } else {
        showClientLogin();
    }

    setupClientEventListeners();
}

let clientData = {};

function loadClientData() {
    clientData = getData('webzer_client_data', {});
}

// --- LOGIN ---
function setupClientEventListeners() {
    const loginForm = document.getElementById('clientLoginForm');
    if (loginForm) loginForm.addEventListener('submit', handleClientLogin);

    // Navigation
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute('data-target');
            if(targetPage) navigateClientTo(targetPage, item);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('clientLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleClientLogout);

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });
    }
}

function handleClientLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (email === 'rahul@example.com' && password === 'client123') {
        sessionStorage.setItem('webzer_client_logged', 'true');
        showClientDashboard();
    } else {
        if (loginError) {
            loginError.textContent = 'Invalid credentials';
            loginError.style.display = 'block';
            loginError.classList.add('shake');
            setTimeout(() => loginError.classList.remove('shake'), 500);
        }
    }
}

function handleClientLogout(e) {
    if(e) e.preventDefault();
    sessionStorage.removeItem('webzer_client_logged');
    showClientLogin();
}

function showClientLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('clientDashboardArea').style.display = 'none';
}

function showClientDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('clientDashboardArea').style.display = 'block';
    loadClientData();
    navigateClientTo('page-dashboard');
}

// --- NAVIGATION ---
function navigateClientTo(pageId, navElement = null) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.style.display = 'none');

    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';

    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (navElement) {
        navElement.classList.add('active');
        const title = navElement.querySelector('span').textContent;
        const pageTitle = document.getElementById('topbarPageTitle');
        if (pageTitle) pageTitle.textContent = title;
    }

    switch (pageId) {
        case 'page-dashboard': renderClientDashboard(); break;
        case 'page-projects': renderClientProjects(); break;
        case 'page-messages': renderClientMessages(); break;
        case 'page-invoices': renderClientInvoices(); break;
        case 'page-profile': renderClientProfile(); break;
    }

    document.getElementById('sidebar')?.classList.remove('active');
}

// --- DASHBOARD ---
function renderClientDashboard() {
    loadClientData();
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${clientData.client.name}!`;

    // Active project
    const activeProject = clientData.projects.find(p => p.status === 'progress') || clientData.projects[0];
    if (activeProject && document.getElementById('activeProjectContainer')) {
        const phases = ['idea', 'design', 'development', 'review', 'launch'];
        let phaseHtml = '';
        let phasePassed = true;
        
        phases.forEach(p => {
            const isActive = p === activeProject.currentPhase;
            const statusClass = isActive ? 'active' : (phasePassed ? 'completed' : 'pending');
            if (isActive) phasePassed = false;
            
            phaseHtml += `<div class="phase-step ${statusClass}">${p.charAt(0).toUpperCase() + p.slice(1)}</div>`;
        });

        document.getElementById('activeProjectContainer').innerHTML = `
            <h3>${activeProject.name}</h3>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${activeProject.progress}%"></div>
            </div>
            <p>${activeProject.progress}% Completed</p>
            <div class="phase-timeline">${phaseHtml}</div>
        `;
    }
}

// --- PROJECTS ---
function renderClientProjects() {
    loadClientData();
    const container = document.getElementById('clientProjectsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    clientData.projects.forEach(proj => {
        container.innerHTML += `
            <div class="project-card">
                <h3>${proj.name}</h3>
                <p>Status: <span class="badge badge-${proj.status}">${proj.status}</span></p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${proj.progress}%"></div>
                </div>
                <p>${proj.progress}%</p>
                <button onclick="viewClientProject(${proj.id})" class="btn-sm">View Details</button>
            </div>
        `;
    });
}

window.viewClientProject = function(id) {
    const proj = clientData.projects.find(p => p.id === id);
    if (!proj) return;
    
    document.getElementById('projModalName').textContent = proj.name;
    document.getElementById('projModalDesc').textContent = proj.description;
    document.getElementById('projModalNotes').textContent = proj.notes;
    
    showModal('clientProjectModal');
};

// --- MESSAGES ---
function renderClientMessages() {
    loadClientData();
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) return;
    
    chatBox.innerHTML = '';
    clientData.messages.forEach(msg => {
        const isClient = msg.sender === 'client';
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isClient ? 'chat-right' : 'chat-left'}`;
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <p>${msg.text}</p>
                <small>${formatDate(msg.time)}</small>
            </div>
        `;
        chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;

    const form = document.getElementById('messageForm');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const input = document.getElementById('messageInput');
            if (input.value.trim() === '') return;
            
            clientData.messages.push({
                id: Date.now(),
                sender: 'client',
                text: input.value,
                time: new Date().toISOString()
            });
            saveData('webzer_client_data', clientData);
            input.value = '';
            renderClientMessages();
        };
    }
}

// --- INVOICES ---
function renderClientInvoices() {
    loadClientData();
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    clientData.invoices.forEach(inv => {
        tbody.innerHTML += `
            <tr>
                <td>${inv.id}</td>
                <td>${inv.project}</td>
                <td>${formatCurrency(inv.amount)}</td>
                <td><span class="badge badge-${inv.status}">${inv.status}</span></td>
                <td><button onclick="viewInvoice('${inv.id}')" class="btn-sm">View</button></td>
            </tr>
        `;
    });
}

window.viewInvoice = function(id) {
    const inv = clientData.invoices.find(i => i.id === id);
    if(!inv) return;
    
    document.getElementById('invModalId').textContent = inv.id;
    document.getElementById('invModalProject').textContent = inv.project;
    document.getElementById('invModalAmount').textContent = formatCurrency(inv.amount);
    
    const itemsTbody = document.getElementById('invModalItems');
    itemsTbody.innerHTML = '';
    inv.items.forEach(item => {
        itemsTbody.innerHTML += `
            <tr>
                <td>${item.service}</td>
                <td>${item.description}</td>
                <td>${formatCurrency(item.amount)}</td>
            </tr>
        `;
    });
    
    showModal('invoiceModal');
};

// --- PROFILE ---
function renderClientProfile() {
    loadClientData();
    const p = clientData.client;
    if(document.getElementById('profName')) document.getElementById('profName').value = p.name;
    if(document.getElementById('profEmail')) document.getElementById('profEmail').value = p.email;
    if(document.getElementById('profPhone')) document.getElementById('profPhone').value = p.phone;
    if(document.getElementById('profCompany')) document.getElementById('profCompany').value = p.company;

    const form = document.getElementById('profileForm');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            clientData.client = {
                name: document.getElementById('profName').value,
                email: document.getElementById('profEmail').value,
                phone: document.getElementById('profPhone').value,
                company: document.getElementById('profCompany').value
            };
            saveData('webzer_client_data', clientData);
            alert('Profile updated successfully!');
            renderClientDashboard(); // Refresh welcome message
        };
    }
}
