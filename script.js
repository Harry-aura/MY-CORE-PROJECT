// Data Structure
let user = JSON.parse(localStorage.getItem('user_data')) || null;
let blocks = JSON.parse(localStorage.getItem('blocks_data')) || [];
let activities = JSON.parse(localStorage.getItem('activities_data')) || [];

// Initialization
window.onload = () => {
    if (user) {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('app-view').style.display = 'block';
        document.getElementById('ui-username').innerText = user.name.toUpperCase();
        refreshDashboard();
    }
};

// Auth Logic
function toggleAuth(type) {
    document.getElementById('form-login').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('form-register').style.display = type === 'register' ? 'block' : 'none';
}

function auth(type) {
    if (type === 'register') {
        const name = document.getElementById('reg-name').value;
        const age = document.getElementById('reg-age').value;
        const pass = document.getElementById('reg-pass').value;
        if (!name || !pass) return alert("Required fields missing.");
        user = { name, age, pass };
        localStorage.setItem('user_data', JSON.stringify(user));
        alert("Profile Registered.");
        toggleAuth('login');
    } else {
        const id = document.getElementById('log-user').value;
        const p = document.getElementById('log-pass').value;
        if (user && (id === user.name && p === user.pass)) {
            document.getElementById('login-view').style.display = 'none';
            document.getElementById('app-view').style.display = 'block';
            document.getElementById('ui-username').innerText = user.name.toUpperCase();
            refreshDashboard();
        } else {
            alert("Invalid Credentials");
        }
    }
}

function logout() {
    document.getElementById('app-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'flex';
    document.getElementById('log-pass').value = '';
}

// Navigation
function nav(viewId, el) {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + viewId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    if(viewId === 'dashboard') refreshDashboard();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// Block Logic
function assignBlock() {
    const app = document.getElementById('cfg-app').value;
    const url = document.getElementById('cfg-url').value;
    const goal = document.getElementById('cfg-goal').value;
    const duration = parseInt(document.getElementById('cfg-duration').value);

    if(!url || !goal) return alert("Fill all protocol parameters.");

    // 3 Hour un-removable lock rule constraint (3 hours from now)
    const lockedUntil = Date.now() + (3 * 60 * 60 * 1000); 
    const endTime = Date.now() + (duration * 60 * 60 * 1000);
    
    blocks.push({ 
        id: Date.now(), app, url, goal, duration, 
        lockedUntil, endTime, attempts: Math.floor(Math.random() * 5) // Mock analytics
    });

    logActivity(`Assigned ${app} restriction for ${duration}H. Reason: ${goal}`);
    saveData();
    
    alert(`RESTRICTION ENFORCED.\nUnbreakable lock active for 3 hours.`);
    
    // Navigate back to dash
    document.querySelectorAll('.nav-item')[0].click(); 
}

function removeBlock(id, lockedUntil) {
    if (Date.now() < lockedUntil) {
        const hoursLeft = ((lockedUntil - Date.now()) / (1000 * 60 * 60)).toFixed(1);
        alert(`CRITICAL: Cannot override 3-hour initial lock. ${hoursLeft} Hours remaining.`);
        return;
    }
    blocks = blocks.filter(b => b.id !== id);
    logActivity(`Removed restriction protocol.`);
    saveData();
    refreshDashboard();
}

// Dashboard & Data
function logActivity(msg) {
    activities.unshift({ time: new Date().toLocaleTimeString(), msg });
    if(activities.length > 10) activities.pop();
}

function saveData() {
    localStorage.setItem('blocks_data', JSON.stringify(blocks));
    localStorage.setItem('activities_data', JSON.stringify(activities));
}

function refreshDashboard() {
    document.getElementById('stat-active').innerText = blocks.length;
    
    let totalAttempts = 0;
    let totalTime = 0;
    
    const blockList = document.getElementById('active-blocks-list');
    blockList.innerHTML = '';
    
    if(blocks.length === 0) blockList.innerHTML = '<li class="data-item" style="color:var(--neon-dim)">No active restrictions.</li>';

    blocks.forEach(b => {
        totalAttempts += b.attempts;
        totalTime += b.duration;
        
        const isLocked = Date.now() < b.lockedUntil;
        const lockHtml = isLocked ? 
            `<span class="badge locked">LOCKED (3H Rule)</span>` : 
            `<button style="padding:4px 10px; width:auto; font-size:10px; border-color:var(--alert); color:var(--alert)" onclick="removeBlock(${b.id}, ${b.lockedUntil})">TERMINATE</button>`;

        blockList.innerHTML += `
            <li class="data-item">
                <div>
                    <div style="font-weight:bold; color:var(--text)">${b.app} <span style="font-size:10px; color:var(--neon-dim)">${b.url}</span></div>
                    <div style="font-size: 11px; color: var(--neon-dim); margin-top:4px;">Goal: ${b.goal}</div>
                </div>
                <div style="text-align:right">
                    ${lockHtml}
                </div>
            </li>
        `;
    });

    document.getElementById('stat-attempts').innerText = totalAttempts;
    document.getElementById('stat-time').innerText = totalTime + "H";

    const actList = document.getElementById('activity-list');
    actList.innerHTML = '';
    if(activities.length === 0) actList.innerHTML = '<li class="data-item" style="color:var(--neon-dim)">No recent activity.</li>';
    
    activities.forEach(a => {
        actList.innerHTML += `
            <li class="data-item">
                <span style="font-size:12px;">${a.msg}</span>
                <span style="font-size:10px; color:var(--neon-dim)">${a.time}</span>
            </li>
        `;
    });
}