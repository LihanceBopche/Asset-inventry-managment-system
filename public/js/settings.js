const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.username;
document.getElementById('userRole').textContent = `System ${user.role}`;

let allUsers = [];
let allDepts = [];
let allEmps = [];

// Initialize Socket.io
const socket = io();
socket.on('user_updated', fetchUsers);
socket.on('entity_updated', () => { fetchDepts(); fetchEmps(); });

// UI Setup
if (user.role !== 'Admin') {
    document.querySelectorAll('.admin-only, #adminActions, #adminStats').forEach(el => el.style.display = 'none');
}

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    if (id === 'empModal') loadDeptSelect();
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    const form = document.querySelector(`#${id} form`);
    if (form) form.reset();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show toast-${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}Section`).style.display = 'block';
    event.currentTarget.classList.add('active');
    
    if (tab === 'users') fetchUsers();
    if (tab === 'departments') fetchDepts();
    if (tab === 'employees') fetchEmps();
}

// --- USER MANAGEMENT ---
async function fetchUsers() {
    try {
        const res = await fetch('/api/auth/users', { headers: { 'Authorization': `Bearer ${token}` }});
        allUsers = await res.json();
        renderUsers(allUsers);
    } catch (err) { showToast('Error loading users', 'error'); }
}

function renderUsers(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    // Update Stats
    const total = users.length;
    const admins = users.filter(u => u.role === 'Admin').length;
    const managers = users.filter(u => u.role === 'Manager').length;
    
    const totalEl = document.getElementById('totalUsers');
    const adminEl = document.getElementById('adminCount');
    const managerEl = document.getElementById('managerCount');
    
    if (totalEl) totalEl.textContent = total;
    if (adminEl) adminEl.textContent = admins;
    if (managerEl) managerEl.textContent = managers;

    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:600;">${u.username} ${u.id === user.id ? '<small>(You)</small>' : ''}</td>
            <td>${u.email}</td>
            <td><span class="role-badge role-${u.role}">${u.role}</span></td>
            <td>${new Date(u.created_at).toLocaleDateString()}</td>
            <td class="admin-only">
                <button onclick="changeRole(${u.id}, '${u.role}')" class="btn-icon"><i class="fas fa-sync" title="Change Role"></i></button>
                ${u.id !== user.id ? `<button onclick="deleteUser(${u.id})" class="btn-icon error" title="Delete User"><i class="fas fa-trash"></i></button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- DEPARTMENT MANAGEMENT ---
async function fetchDepts() {
    try {
        const res = await fetch('/api/entities/departments', { headers: { 'Authorization': `Bearer ${token}` }});
        allDepts = await res.json();
        renderDepts(allDepts);
    } catch (err) { showToast('Error loading departments', 'error'); }
}

function renderDepts(depts) {
    const tbody = document.getElementById('deptTableBody');
    tbody.innerHTML = '';
    depts.forEach(d => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.id}</td>
            <td style="font-weight:600;">${d.dept_name}</td>
            <td class="admin-only">
                <button onclick="editDept(${d.id}, '${d.dept_name}')" class="btn-icon"><i class="fas fa-edit"></i></button>
                <button onclick="deleteDept(${d.id})" class="btn-icon error"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- EMPLOYEE MANAGEMENT ---
async function fetchEmps() {
    try {
        const res = await fetch('/api/entities/employees', { headers: { 'Authorization': `Bearer ${token}` }});
        allEmps = await res.json();
        renderEmps(allEmps);
    } catch (err) { showToast('Error loading employees', 'error'); }
}

function renderEmps(emps) {
    const tbody = document.getElementById('empTableBody');
    tbody.innerHTML = '';
    emps.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:700; color:var(--primary);">${e.emp_id}</td>
            <td style="font-weight:600;">${e.emp_name}</td>
            <td>${e.dept_name || 'N/A'}</td>
            <td class="admin-only">
                <button onclick="editEmp(${e.id}, '${e.emp_name}', '${e.emp_id}', ${e.dept_id})" class="btn-icon"><i class="fas fa-edit"></i></button>
                <button onclick="deleteEmp(${e.id})" class="btn-icon error"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- CRUD OPERATIONS ---

// User Form
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
    });
    if (res.ok) { closeModal('userModal'); fetchUsers(); showToast('User created', 'success'); }
});

// Dept Form
document.getElementById('deptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editDeptId').value;
    const data = Object.fromEntries(new FormData(e.target));
    const url = id ? `/api/entities/departments/${id}` : '/api/entities/departments';
    const method = id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
    });
    if (res.ok) { closeModal('deptModal'); fetchDepts(); showToast('Department saved', 'success'); }
});

// Emp Form
document.getElementById('empForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editEmpId').value;
    const data = Object.fromEntries(new FormData(e.target));
    const url = id ? `/api/entities/employees/${id}` : '/api/entities/employees';
    const method = id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
    });
    if (res.ok) { closeModal('empModal'); fetchEmps(); showToast('Employee saved', 'success'); }
});

// Helpers
function editDept(id, name) {
    document.getElementById('editDeptId').value = id;
    document.querySelector('#deptForm input[name="dept_name"]').value = name;
    document.getElementById('deptModalTitle').textContent = 'Edit Department';
    openModal('deptModal');
}

async function deleteDept(id) {
    if (confirm('Delete department?')) {
        await fetch(`/api/entities/departments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
        fetchDepts();
    }
}

function editEmp(id, name, eid, did) {
    document.getElementById('editEmpId').value = id;
    document.querySelector('#empForm input[name="emp_name"]').value = name;
    document.querySelector('#empForm input[name="emp_id"]').value = eid;
    loadDeptSelect(did);
    document.getElementById('empModalTitle').textContent = 'Edit Employee';
    openModal('empModal');
}

async function deleteEmp(id) {
    if (confirm('Delete employee?')) {
        await fetch(`/api/entities/employees/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
        fetchEmps();
    }
}

async function loadDeptSelect(selectedId = null) {
    const res = await fetch('/api/entities/departments', { headers: { 'Authorization': `Bearer ${token}` }});
    const depts = await res.json();
    const select = document.getElementById('empDeptSelect');
    select.innerHTML = '<option value="">-- Select Department --</option>';
    depts.forEach(d => {
        select.innerHTML += `<option value="${d.id}" ${d.id == selectedId ? 'selected' : ''}>${d.dept_name}</option>`;
    });
}

async function changeRole(id, currentRole) {
    const nextRole = currentRole === 'Admin' ? 'Manager' : (currentRole === 'Manager' ? 'User' : 'Admin');
    await fetch(`/api/auth/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role: nextRole })
    });
    fetchUsers();
}

async function deleteUser(id) {
    if (confirm('Delete user?')) {
        await fetch(`/api/auth/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
        fetchUsers();
    }
}

// Initial Load
if (user.role === 'Admin') fetchUsers();
