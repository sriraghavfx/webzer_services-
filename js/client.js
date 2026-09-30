/**
 * WEBZER CLIENT PORTAL — JavaScript
 * Pure vanilla JS, ES6+, localStorage data persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    initClientApp();
});

// ── UTILITIES ──
function getClientData() {
    return JSON.parse(localStorage.getItem('webzer_client_data') || '{}');
}

function saveClientData(data) {
    localStorage.setItem('webzer_client_data', JSON.stringify(data));
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// ── DEFAULT CLIENT DATA ──
const DEFAULT_CLIENT_DATA = {
    client: {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '+91 98765 43210',
        company: 'Kumar Enterprises'
    },
    projects: [
        {
            id: 1,
            name: 'Business Website',
            status: 'progress',
            progress: 75,
            startDate: '2026-09-01',
            estimatedDelivery: '2026-10-15',
            currentPhase: 'development',
            description: 'Professional business website with modern design and mobile optimization.',
            notes: 'Design approved. Frontend development in progress. Homepage, Services, and About sections completed.'
        },
        {
            id: 2,
            name: 'Logo & Brand Identity',
            status: 'completed',
            progress: 100,
            startDate: '2026-08-15',
            estimatedDelivery: '2026-09-01',
            currentPhase: 'launch',
            description: 'Professional logo design and complete branding guidelines for Kumar Enterprises.',
            notes: 'Final assets delivered in SVG, PNG and PDF formats. Color guide shared.'
        }
    ],
    messages: [
        { id: 1, sender: 'webzer', text: 'Hi Rahul! Welcome to Webzer. We are excited to collaborate with you!', time: 'Sep 01, 10:00 AM' },
        { id: 2, sender: 'client', text: 'Thank you! I need a fast and modern website for my business.', time: 'Sep 01, 10:15 AM' },
        { id: 3, sender: 'webzer', text: 'Awesome! We have prepared the initial concept wireframe.', time: 'Sep 05, 02:30 PM' },
        { id: 4, sender: 'webzer', text: 'The development phase is 75% complete. We are on track for delivery!', time: 'Sep 28, 11:00 AM' }
    ],
    invoices: [
        {
            id: 'INV-001',
            project: 'Logo & Brand Identity',
            amount: 15000,
            date: '2026-08-15',
            dueDate: '2026-08-30',
            status: 'paid',
            items: [
                { service: 'Logo Design Concepts', description: '3 custom concept directions', amount: 10000 },
                { service: 'Brand Guidelines', description: 'Color palette and typography guide', amount: 5000 }
            ]
        },
        {
            id: 'INV-002',
            project: 'Business Website',
            amount: 25000,
            date: '2026-09-15',
            dueDate: '2026-10-15',
            status: 'pending',
            items: [
                { service: 'Modern Web UI Design', description: 'Responsive design for 5 pages', amount: 10000 },
                { service: 'Frontend Development', description: 'HTML5, CSS3, JavaScript', amount: 12000 },
                { service: 'On-Page SEO & Speed Optimization', description: 'Metadata & asset minification', amount: 3000 }
            ]
        }
    ]
};

let clientData = {};

// ── INITIALIZATION ──
function initClientApp() {
    if (!localStorage.getItem('webzer_client_data')) {
        saveClientData(DEFAULT_CLIENT_DATA);
    }
    clientData = getClientData();

    // Check login state
    if (sessionStorage.getItem('webzer_client_logged') === 'true') {
        showDashboard();
    } else {
        showLogin();
    }

    setupEventListeners();
}

// ── EVENT LISTENERS ──
function setupEventListeners() {
    // Login form — matches HTML id="loginForm"
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorEl = document.getElementById('loginError');

            if (email === 'client@example.com' && password === 'client123') {
                sessionStorage.setItem('webzer_client_logged', 'true');
                if (errorEl) errorEl.textContent = '';
                showDashboard();
            } else {
                if (errorEl) {
                    errorEl.textContent = '❌ Invalid email or password';
                }
            }
        });
    }

    // Navigation links — matches HTML .nav-item[data-target]
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (target) navigateTo(target);
        });
    });

    // Logout button — matches HTML id="logoutBtn"
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('webzer_client_logged');
            showLogin();
        });
    }

    // Mobile menu button — matches HTML id="mobileMenuBtn"
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });
    }

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal')?.classList.remove('active');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Message sending — matches HTML id="messageForm"
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('messageInput');
            const text = input.value.trim();
            if (!text) return;

            const now = new Date();
            const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' +
                            now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            clientData.messages.push({
                id: Date.now(),
                sender: 'client',
                text: text,
                time: timeStr
            });

            saveClientData(clientData);
            input.value = '';
            renderMessages();

            // Simulate support auto-reply after 1.5s
            setTimeout(() => {
                clientData.messages.push({
                    id: Date.now(),
                    sender: 'webzer',
                    text: 'Thank you for your message! Our team has received it and will get back to you shortly.',
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                });
                saveClientData(clientData);
                renderMessages();
            }, 1500);
        });
    }

    // Profile form — matches HTML id="profileForm"
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clientData.client.name = document.getElementById('profileName').value;
            clientData.client.email = document.getElementById('profileEmail').value;
            clientData.client.phone = document.getElementById('profilePhone').value;
            clientData.client.company = document.getElementById('profileCompany').value;
            saveClientData(clientData);
            updateClientProfileUI();
            alert('✅ Profile updated successfully!');
        });
    }
}

// ── SHOW / HIDE SCREENS ──
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('clientDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('clientDashboard').style.display = 'flex';
    clientData = getClientData();
    updateClientProfileUI();
    navigateTo('page-dashboard');
}

function updateClientProfileUI() {
    const c = clientData.client || {};
    const initials = (c.name || 'RK').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('sidebarClientName', c.name || 'Rahul Kumar');
    setText('sidebarClientEmail', c.email || 'rahul@example.com');
    setText('topbarClientName', c.name || 'Rahul Kumar');
    setText('welcomeMessage', `Welcome back, ${c.name || 'Rahul Kumar'}!`);
    setText('topbarAvatar', initials);
    setText('profileAvatar', initials);
}

// ── NAVIGATION ──
function navigateTo(pageId) {
    document.querySelectorAll('.page-section').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Update active nav link
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === pageId) {
            item.classList.add('active');
        }
    });

    const titles = {
        'page-dashboard': 'Dashboard',
        'page-projects': 'My Projects',
        'page-messages': 'Messages',
        'page-invoices': 'Invoices',
        'page-profile': 'Profile'
    };
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = titles[pageId] || 'Dashboard';

    // Render corresponding section
    clientData = getClientData();
    switch (pageId) {
        case 'page-dashboard': renderDashboard(); break;
        case 'page-projects': renderProjects(); break;
        case 'page-messages': renderMessages(); break;
        case 'page-invoices': renderInvoices(); break;
        case 'page-profile': renderProfile(); break;
    }

    document.getElementById('sidebar')?.classList.remove('active');
}

// ── DASHBOARD ──
function renderDashboard() {
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const activeProjs = clientData.projects.filter(p => p.status === 'progress').length;
    const pendingInvs = clientData.invoices.filter(i => i.status === 'pending').length;
    const msgCount = clientData.messages.length;

    setText('statActiveProjects', activeProjs);
    setText('statPendingInvoices', pendingInvs);
    setText('statMessages', msgCount);

    // Current Project Status Card
    const currentProj = clientData.projects.find(p => p.status === 'progress') || clientData.projects[0];
    const cardEl = document.getElementById('dashboardCurrentProject');
    if (cardEl && currentProj) {
        const phases = ['Idea', 'Design', 'Development', 'Review', 'Launch'];
        const phaseIndex = currentProj.progress >= 100 ? 4 :
                           currentProj.progress >= 75 ? 2 :
                           currentProj.progress >= 50 ? 1 : 0;

        cardEl.innerHTML = `
            <h4>${currentProj.name}</h4>
            <p>${currentProj.description}</p>
            <div class="progress-track" style="margin-top:1.25rem;">
                <div class="progress-fill" style="width:${currentProj.progress}%"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#888; margin-top:0.4rem;">
                <span>Progress: ${currentProj.progress}%</span>
                <span>Target: ${currentProj.estimatedDelivery}</span>
            </div>
            <div class="status-phases">
                ${phases.map((name, i) => `
                    <div class="phase-step ${i < phaseIndex ? 'completed' : i === phaseIndex ? 'active' : ''}">
                        <div class="phase-dot">${i < phaseIndex ? '✓' : i + 1}</div>
                        <div class="phase-label">${name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Recent Messages Preview
    const previewEl = document.getElementById('dashboardMessagesPreview');
    if (previewEl) {
        previewEl.innerHTML = '';
        const recent = [...clientData.messages].slice(-3).reverse();
        recent.forEach(m => {
            previewEl.innerHTML += `
                <div class="msg-preview-item">
                    <div>
                        <div class="msg-preview-sender">${m.sender === 'webzer' ? '⚡ Webzer Team' : '👤 You'}</div>
                        <div class="msg-preview-text">${m.text}</div>
                    </div>
                    <div class="msg-preview-time">${m.time}</div>
                </div>
            `;
        });
    }
}

// ── PROJECTS ──
function renderProjects() {
    const listEl = document.getElementById('projectsList');
    if (!listEl) return;
    listEl.innerHTML = '';

    clientData.projects.forEach(p => {
        listEl.innerHTML += `
            <div class="client-project-card">
                <h3>${p.name}</h3>
                <p class="desc">${p.description}</p>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${p.progress}%"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#888; margin:0.5rem 0 1.25rem;">
                    <span>${p.progress}% Completed</span>
                    <span style="color:#ffffff;">Delivery: ${p.estimatedDelivery}</span>
                </div>
                <button class="btn btn-outline" onclick="viewProjectDetail(${p.id})">View Details →</button>
            </div>
        `;
    });
}

window.viewProjectDetail = function(id) {
    const p = clientData.projects.find(item => item.id === id);
    if (!p) return;

    const modalContent = document.getElementById('projectModalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <h3 style="font-size:1.5rem; margin-bottom:0.75rem;">${p.name}</h3>
            <p style="color:#888; font-size:0.9rem; margin-bottom:1.5rem;">${p.description}</p>
            <div style="background:#111; padding:1.25rem; border-radius:10px; margin-bottom:1.25rem; border:1px solid rgba(255,255,255,0.06);">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <strong>Status</strong>
                    <span style="color:${p.status === 'completed' ? '#2ecc71' : '#f1c40f'}; font-weight:600; text-transform:uppercase;">${p.status}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <strong>Start Date</strong>
                    <span>${p.startDate}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <strong>Estimated Delivery</strong>
                    <span>${p.estimatedDelivery}</span>
                </div>
            </div>
            <h4 style="margin-bottom:0.5rem; font-size:1rem;">Team Notes & Updates</h4>
            <p style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:8px; font-size:0.9rem; color:#ccc; line-height:1.6;">
                ${p.notes}
            </p>
        `;
    }
    showModal('projectModal');
};

// ── MESSAGES ──
function renderMessages() {
    const chatEl = document.getElementById('chatMessages');
    if (!chatEl) return;
    chatEl.innerHTML = '';

    clientData.messages.forEach(m => {
        const isClient = m.sender === 'client';
        chatEl.innerHTML += `
            <div class="chat-bubble ${isClient ? 'sent' : 'received'}">
                <div>${m.text}</div>
                <div class="bubble-time">${m.time}</div>
            </div>
        `;
    });
    chatEl.scrollTop = chatEl.scrollHeight;
}

// ── INVOICES ──
function renderInvoices() {
    const listEl = document.getElementById('invoicesList');
    if (!listEl) return;
    listEl.innerHTML = '';

    clientData.invoices.forEach(inv => {
        listEl.innerHTML += `
            <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.project}</td>
                <td>${formatCurrency(inv.amount)}</td>
                <td>${inv.date}</td>
                <td>
                    <span class="badge ${inv.status === 'paid' ? 'badge-paid' : 'badge-pending'}">
                        ${inv.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="viewInvoiceDetail('${inv.id}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    });
}

window.viewInvoiceDetail = function(id) {
    const inv = clientData.invoices.find(item => item.id === id);
    if (!inv) return;

    const contentEl = document.getElementById('invoiceModalContent');
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="invoice-modal-card">
                <div class="invoice-modal-header">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h2>INVOICE</h2>
                        <span class="badge ${inv.status === 'paid' ? 'badge-paid' : 'badge-pending'}">${inv.status}</span>
                    </div>
                    <p style="color:#888; font-size:0.85rem; margin-top:0.3rem;">Invoice #${inv.id} • Date: ${inv.date}</p>
                </div>
                <div style="margin-bottom:1.5rem;">
                    <p style="font-size:0.85rem; color:#888;">Billed To:</p>
                    <strong>${clientData.client.name}</strong>
                    <p style="font-size:0.85rem; color:#aaa;">${clientData.client.company}</p>
                </div>
                <div style="margin-bottom:1.5rem;">
                    ${inv.items.map(item => `
                        <div class="invoice-item-row">
                            <div>
                                <strong>${item.service}</strong>
                                <div style="font-size:0.8rem; color:#777;">${item.description}</div>
                            </div>
                            <div style="font-weight:600;">${formatCurrency(item.amount)}</div>
                        </div>
                    `).join('')}
                    <div class="invoice-total-row">
                        <span>Total Amount</span>
                        <span>${formatCurrency(inv.amount)}</span>
                    </div>
                </div>
                <button class="btn" style="width:100%;" onclick="alert('PDF downloaded!')">
                    Download Invoice PDF
                </button>
            </div>
        `;
    }
    showModal('invoiceModal');
};

// ── PROFILE ──
function renderProfile() {
    const c = clientData.client || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('profileName', c.name);
    setVal('profileEmail', c.email);
    setVal('profilePhone', c.phone);
    setVal('profileCompany', c.company);
}
