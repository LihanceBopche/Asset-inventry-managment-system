const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('userName').textContent = user.username;
document.getElementById('userRole').textContent = `System ${user.role}`;

let allMaterials = [];

// Initialize Socket.io
const socket = io();
socket.on('material_updated', () => {
    console.log('Real-time material update received...');
    fetchMaterials();
});

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
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

// Data Handling
async function fetchMaterials() {
    try {
        const res = await fetch('/api/materials', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            if (res.status === 401) logout();
            throw new Error('API error');
        }

        const data = await res.json();
        allMaterials = Array.isArray(data) ? data : [];
        renderMaterials(allMaterials);
    } catch (err) {
        console.error('Fetch error:', err);
        showToast('Failed to load material data', 'error');
    }
}

function renderMaterials(materials) {
    const tbody = document.getElementById('materialTableBody');
    tbody.innerHTML = '';

    let totalItems = materials.length;
    let totalQty = 0;
    let availableQty = 0;
    let lowStockCount = 0;

    materials.forEach(m => {
        totalQty += m.total_quantity;
        availableQty += m.available_quantity;
        if (m.available_quantity < 5) lowStockCount++;

        const tr = document.createElement('tr');
        const statusClass = m.available_quantity < 5 ? 'stock-low' : 'stock-good';
        const statusText = m.available_quantity < 5 ? 'LOW STOCK' : 'GOOD';

        const locationStr = `R: ${m.rack || '-'} | C: ${m.col_name || '-'} | B: ${m.part_name || '-'}`;
        tr.innerHTML = `
            <td style="font-weight: 600; color: var(--primary);">${m.material_name}</td>
            <td style="opacity: 0.8; font-size: 0.8rem;">${locationStr}</td>
            <td style="opacity: 0.8;">${m.total_quantity}</td>
            <td style="font-weight: bold; color: ${m.available_quantity < 5 ? '#ff755e' : '#00e6c3'};">${m.available_quantity}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button onclick="openIssueModal(${m.id}, ${m.available_quantity}, '${m.material_name.replace(/'/g, "\\'")}')" style="color:var(--primary); background:rgba(0,210,255,0.1); border:1px solid rgba(0,210,255,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;" ${m.available_quantity === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}><i class="fas fa-share-square"></i> Issue</button>
                    <button onclick="openRefillModal(${m.id}, '${m.material_name.replace(/'/g, "\\'")}')" style="color:var(--success); background:rgba(0,176,155,0.1); border:1px solid rgba(0,176,155,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;"><i class="fas fa-plus"></i></button>
                    <button onclick="openEditModal(${m.id}, '${m.material_name.replace(/'/g, "\\'")}', '${m.rack || ''}', '${m.col_name || ''}', '${m.part_name || ''}')" style="color:#f39c12; background:rgba(243,156,18,0.1); border:1px solid rgba(243,156,18,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteMaterial(${m.id})" style="color:var(--error); background:rgba(255,75,43,0.1); border:1px solid rgba(255,75,43,0.3); padding: 5px 10px; border-radius: 8px; cursor:pointer; font-weight:600; transition:0.3s;"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('totalMaterials').textContent = totalItems;
    document.getElementById('totalQty').textContent = totalQty;
    document.getElementById('availableQty').textContent = availableQty;
    document.getElementById('lowStockCount').textContent = lowStockCount;
}

// Search
document.getElementById('materialSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMaterials.filter(m =>
        m.material_name.toLowerCase().includes(term)
    );
    renderMaterials(filtered);
});

// Add Material
document.getElementById('materialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/materials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeModal('materialModal');
            e.target.reset();
            showToast('Material added to stock!', 'success');
            // Real-time socket will fetch
        } else {
            showToast('Error adding material', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
});

// Edit Material Setup
async function openEditModal(id, name, rack, col, part) {
    document.getElementById('editMaterialId').value = id;
    document.getElementById('editMaterialName').value = name;

    const editRack = document.getElementById('editRack');
    const editCol = document.getElementById('editColName');
    const editPart = document.getElementById('editPartName');

    editRack.value = rack || '';

    if (rack) {
        await loadColumns('edit');
        editCol.value = col || '';

        if (col) {
            await loadParts('edit');
            editPart.value = part || '';
        }
    }

    openModal('editMaterialModal');
}

// Submit Edit
document.getElementById('editMaterialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const id = data.id;

    try {
        const res = await fetch(`/api/materials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeModal('editMaterialModal');
            showToast('Material updated successfully!', 'success');
            fetchMaterials(); // or rely on socket
        } else {
            showToast('Error updating material', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
});

// Delete Material
async function deleteMaterial(id) {
    if (!confirm('Are you sure you want to delete this material and all its data?')) return;
    try {
        const res = await fetch(`/api/materials/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Material deleted!', 'success');
            fetchMaterials();
        } else {
            showToast('Error deleting material', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

// Issue Material Setup
async function openIssueModal(id, maxQty, name) {
    document.getElementById('issueMaterialId').value = id;
    document.getElementById('issueQtyMax').max = maxQty;
    document.getElementById('issueModal').querySelector('h2').innerHTML = `<i class="fas fa-share-square"></i> Issue ${name}`;

    // Load Departments
    const res = await fetch('/api/entities/departments', { headers: { 'Authorization': `Bearer ${token}` } });
    const depts = await res.json();
    const deptSelect = document.getElementById('issueDept');
    deptSelect.innerHTML = '<option value="">-- Select Department --</option>';
    depts.forEach(d => {
        deptSelect.innerHTML += `<option value="${d.dept_name}">${d.dept_name}</option>`;
    });

    openModal('issueModal');
    loadEmployeesForIssue(); // Initial load for all employees or empty
}

let allEmployees = [];

async function loadEmployeesForIssue(deptName = '') {
    try {
        if (allEmployees.length === 0) {
            const res = await fetch('/api/entities/employees', { headers: { 'Authorization': `Bearer ${token}` } });
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

// Submit Issue
document.getElementById('issueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

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
            showToast('Material issued successfully!', 'success');
            // Real-time socket will fetch
        } else {
            const error = await res.json();
            showToast(error.message || 'Error issuing material', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
});

// Refill Setup
function openRefillModal(id, name) {
    document.getElementById('refillMaterialId').value = id;
    document.getElementById('refillTitle').innerHTML = `<i class="fas fa-plus-square"></i> Refill ${name}`;
    openModal('refillModal');
}

// Submit Refill
document.getElementById('refillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('refillMaterialId').value;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(`/api/materials/${id}/refill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            closeModal('refillModal');
            e.target.reset();
            showToast('Stock refilled successfully!', 'success');
        } else {
            showToast('Error refilling stock', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
});

async function exportToExcel() {
    try {
        const res = await fetch('/api/materials/export-excel', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('API Error');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Storage_Inventory.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast('Excel Downloaded Successfully!', 'success');
    } catch (err) {
        console.error('Export error:', err);
        showToast('Error downloading Excel', 'error');
    }
}

fetchMaterials();
loadRacks();

// ----------------------------------------
// Dynamic Location Dropdowns
// ----------------------------------------
async function loadRacks() {
    try {
        const res = await fetch('/api/locations/racks', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const racks = await res.json();
            const addRack = document.getElementById('addRack');
            const editRack = document.getElementById('editRack');
            const opts = '<option value="">Select Rack</option>' +
                racks.map(r => `<option value="${r.name}" data-id="${r.id}">${r.name}</option>`).join('');
            if (addRack) addRack.innerHTML = opts;
            if (editRack) editRack.innerHTML = opts;
        }
    } catch (err) { console.error('Error fetching racks'); }
}

window.loadColumns = async function (mode) {
    const rackSelect = document.getElementById(mode === 'add' ? 'addRack' : 'editRack');
    const colSelect = document.getElementById(mode === 'add' ? 'addCol' : 'editColName');
    const partSelect = document.getElementById(mode === 'add' ? 'addPart' : 'editPartName');

    if (!rackSelect || !rackSelect.options[rackSelect.selectedIndex]) return;

    const selectedOption = rackSelect.options[rackSelect.selectedIndex];
    const rackId = selectedOption.getAttribute('data-id');

    colSelect.innerHTML = '<option value="">Select Column</option>';
    partSelect.innerHTML = '<option value="">Select Part</option>';

    if (!rackId) return;

    try {
        const res = await fetch(`/api/locations/columns/${rackId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const cols = await res.json();
            colSelect.innerHTML += cols.map(c => `<option value="${c.name}" data-id="${c.id}">${c.name}</option>`).join('');
        }
    } catch (err) { console.error('Error fetching columns'); }
};

window.loadParts = async function (mode) {
    const colSelect = document.getElementById(mode === 'add' ? 'addCol' : 'editColName');
    const partSelect = document.getElementById(mode === 'add' ? 'addPart' : 'editPartName');

    if (!colSelect || !colSelect.options[colSelect.selectedIndex]) return;

    const selectedOption = colSelect.options[colSelect.selectedIndex];
    const colId = selectedOption.getAttribute('data-id');

    partSelect.innerHTML = '<option value="">Select Part</option>';
    if (!colId) return;

    try {
        const res = await fetch(`/api/locations/parts/${colId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const parts = await res.json();
            partSelect.innerHTML += parts.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
        }
    } catch (err) { console.error('Error fetching parts'); }
};
