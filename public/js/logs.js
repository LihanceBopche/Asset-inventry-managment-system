const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.username;
document.getElementById('userRole').textContent = `System ${user.role}`;

let allLogs = [];

// Initialize Socket.io
const socket = io();
socket.on('material_updated', () => {
    fetchLogs();
});

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

// Data Handling
async function fetchLogs() {
    try {
        const res = await fetch('/api/materials/logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allLogs = await res.json();
        renderLogs(allLogs);
    } catch (err) {
        showToast('Failed to load logs', 'error');
    }
}

function renderLogs(logs) {
    const tbody = document.getElementById('logTableBody');
    tbody.innerHTML = '';
    
    logs.forEach(log => {
        const tr = document.createElement('tr');
        
        // Formatting date safely
        let dateObj = new Date(log.issue_date);
        let formattedDate = isNaN(dateObj) ? log.issue_date : dateObj.toLocaleDateString();

        tr.innerHTML = `
            <td style="opacity: 0.8;">${formattedDate}</td>
            <td style="font-weight: 600; color: var(--primary);">${log.material_name || '-'}</td>
            <td style="font-weight: bold;">${log.quantity || '-'}</td>
            <td>${log.department || '-'}</td>
            <td>${log.emp_name ? log.emp_name : (log.manual_receiver_name ? log.manual_receiver_name + ' (M)' : (log.receiver_name ? log.receiver_name : (log.pc_name ? 'Asset: ' + log.pc_name : '-')))}</td>
            <td style="opacity: 0.7;">${log.issuer_name || '-'}</td>
            <td style="opacity: 0.7; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${log.remarks || ''}">${log.remarks || '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Search
document.getElementById('logSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allLogs.filter(l => 
        (l.material_name && l.material_name.toLowerCase().includes(term)) || 
        (l.department && l.department.toLowerCase().includes(term)) ||
        (l.remarks && l.remarks.toLowerCase().includes(term)) ||
        (l.issuer_name && l.issuer_name.toLowerCase().includes(term)) ||
        (l.emp_name && l.emp_name.toLowerCase().includes(term)) ||
        (l.manual_receiver_name && l.manual_receiver_name.toLowerCase().includes(term)) ||
        (l.pc_name && l.pc_name.toLowerCase().includes(term))
    );
    renderLogs(filtered);
});

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    if (id === 'issueModal') {
        fetchMaterialsForSelect();
        fetchDepartmentsForSelect();
        loadEmployeesForIssue(); // Initial load
        document.getElementById('manualEmpLogName').style.display = 'none';
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

async function fetchDepartmentsForSelect() {
    const res = await fetch('/api/entities/departments', { headers: { 'Authorization': `Bearer ${token}` }});
    const depts = await res.json();
    const select = document.getElementById('issueDept');
    select.innerHTML = '<option value="">-- Select Department --</option>';
    depts.forEach(d => {
        select.innerHTML += `<option value="${d.dept_name}">${d.dept_name}</option>`;
    });
}

let allEmployees = [];

async function loadEmployeesForIssue(deptName = '') {
    try {
        if (allEmployees.length === 0) {
            const res = await fetch('/api/entities/employees', { headers: { 'Authorization': `Bearer ${token}` }});
            allEmployees = await res.json();
        }
        
        currentEmployees = deptName ? allEmployees.filter(e => e.dept_name === deptName) : allEmployees;
        
        const datalist = document.getElementById('employeeList');
        datalist.innerHTML = '';
        currentEmployees.forEach(e => {
            const option = document.createElement('option');
            option.value = `${e.emp_name} (${e.emp_id})`;
            datalist.appendChild(option);
        });
        
        // Only reset if it's a department change, not initial load
        if (deptName) {
            document.getElementById('employeeSearch').value = '';
            document.getElementById('selectedEmployeeId').value = '';
            document.getElementById('manualReceiverName').value = '';
        }
    } catch (err) {
        console.error('Error loading employees:', err);
    }
}

function handleEmployeeInput(input) {
    const val = input.value;
    const selectedEmp = currentEmployees.find(e => `${e.emp_name} (${e.emp_id})` === val);
    
    if (selectedEmp) {
        document.getElementById('selectedEmployeeId').value = selectedEmp.id;
        document.getElementById('manualReceiverName').value = '';
    } else {
        document.getElementById('selectedEmployeeId').value = '';
        document.getElementById('manualReceiverName').value = val;
    }
}

async function fetchMaterialsForSelect() {
    try {
        const res = await fetch('/api/materials', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const materials = await res.json();
        const select = document.getElementById('materialSelect');
        select.innerHTML = '<option value="">-- Choose Material --</option>';
        materials.forEach(m => {
            if (m.available_quantity > 0) {
                select.innerHTML += `<option value="${m.id}">${m.material_name} (Available: ${m.available_quantity})</option>`;
            }
        });
    } catch (err) {
        showToast('Failed to load materials', 'error');
    }
}

document.getElementById('issueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data.user_id = null;
    data.asset_id = null;

    // Validation
    if (!data.employee_id && !data.manual_receiver_name) {
        showToast('Please select an employee or enter a name', 'error');
        return;
    }

    try {
        const res = await fetch('/api/materials/issue', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeModal('issueModal');
            e.target.reset();
            showToast('Material issued successfully', 'success');
            fetchLogs();
        } else {
            const errData = await res.json();
            showToast(errData.message || 'Error issuing material', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
});

fetchLogs();
