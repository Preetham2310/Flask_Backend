let editMode = false;
let editId = null;
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// 🔥 CLICK OUTSIDE TO CLOSE
overlay.addEventListener('click', function () {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});
const captchas = { login:'', signup:'', forgot:'' };
function generateCaptcha(type) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    captchas[type] = code;
    document.getElementById(type + 'CaptchaText').textContent = code;
}
generateCaptcha('login');
generateCaptcha('signup');
generateCaptcha('forgot');

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.form-page').forEach(p => p.classList.remove('active'));
    setTimeout(() => document.getElementById(pageId).classList.add('active'), 50);
    document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('input').forEach(i => i.classList.remove('error'));
}

function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.innerHTML = isPass
        ? '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

// ===== HELPERS =====
function showError(id, msg) {
    const el = document.getElementById(id);
    if (msg) el.querySelector('span').textContent = msg;
    el.classList.add('show');
}
function clearAllErrors(formId) {
    document.querySelectorAll('#' + formId + ' .error-msg').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('#' + formId + ' input').forEach(i => i.classList.remove('error'));
}
function shakeForm(formId) {
    const form = document.getElementById(formId);
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 400);
}
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function showToast(msg) {
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toast').classList.add('show');
    setTimeout(() => document.getElementById('toast').classList.remove('show'), 3000);
}

function checkStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const labels = ['','Weak','Medium','Strong','Very Strong'];
    const classes = ['','weak','medium','strong','very-strong'];
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById('str' + i);
        bar.className = 'strength-bar';
        if (i <= score) bar.classList.add(classes[score]);
    }
    document.getElementById('strengthLabel').textContent = val.length > 0 ? labels[score] : '';
}

// ===== SHOW DASHBOARD =====
function showDashboard(email) {
    document.getElementById('authWrapper').style.display = 'none';
    document.getElementById('dashboardWrapper').classList.add('active');
    document.body.style.alignItems = 'stretch';

    // Personalize
    const name = email.split('@')[0];
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('dashName').textContent = displayName;
    document.getElementById('dashAvatar').textContent = displayName.substring(0, 2).toUpperCase();

    // Show menu toggle on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('menuToggle').style.display = 'flex';
    }
}

function handleLogout() {
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_email");
    document.getElementById('dashboardWrapper').classList.remove('active');
    document.getElementById('authWrapper').style.display = 'flex';
    document.body.style.alignItems = '';
    showToast('Signed out successfully');
    showPage('loginPage');
}

// ===== NAV ITEMS =====
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
        
        // Show selected section
        if (page === 'dashboard') {
            document.getElementById('dashboardSection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Dashboard';
        } else if (page === 'learner') {
            document.getElementById('learnerSection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Learner Management';
        } else if (page === 'verifier') {
            document.getElementById('verifierSection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Verifier Management';
        } else if (page === 'collaborator') {
            document.getElementById('collaboratorSection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Collaborator Management';
        } else if (page === 'opportunity') {
            document.getElementById('opportunitySection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Opportunity Management';
        } else if (page === 'reports') {
            document.getElementById('reportsSection').classList.add('active');
            document.getElementById('pageTitle').textContent = 'Reports and Analytics';
        }
    });
});

// ===== TABS =====
function changeChartPeriod(period) {
    // Update active tab
    document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === period) {
            btn.classList.add('active');
        }
    });

    // Chart data for different periods
    const chartData = {
        daily: 'M0,120 Q50,110 100,90 T200,70 T300,50 T400,40',
        weekly: 'M0,110 Q50,95 100,85 T200,65 T300,45 T400,35',
        monthly: 'M0,100 Q50,85 100,75 T200,55 T300,40 T400,30',
        quarterly: 'M0,90 Q50,75 100,65 T200,50 T300,35 T400,25',
        yearly: 'M0,80 Q50,65 100,55 T200,40 T300,30 T400,20'
    };

    const linePath = document.getElementById('linePath');
    const lineArea = document.getElementById('lineArea');
    
    const path = chartData[period];
    linePath.setAttribute('d', path);
    lineArea.setAttribute('d', path + ' L400,150 L0,150 Z');
}

// ===== NOTIFICATIONS =====
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
}

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    showToast('All notifications marked as read');
}

// Close notification dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notificationDropdown');
    const btn = document.getElementById('notifBtn');
    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ===== THEME TOGGLE =====
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    
    // Update icon
    const icon = document.getElementById('themeIcon');
    if (newTheme === 'dark') {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}

// ===== SEARCH =====
function openSearch() {
    document.getElementById('searchContainer').classList.add('active');
    document.getElementById('searchInput').focus();
}

function closeSearch() {
    document.getElementById('searchContainer').classList.remove('active');
}

// Close search on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeCourseModal();
        closeOpportunityModal();
        closeOpportunityDetailsModal();
        closeCollaboratorCoursesModal();
        closeQuickAddModal();
        closeBulkUploadModal();
        closeQuickAddVerifierModal();
        closeBulkUploadVerifierModal();
        closeVerifierDetailsModal();
    }
});

// Close search when clicking outside
document.getElementById('searchContainer').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSearch();
    }
});

// ===== COURSE MODAL =====
function openCourseDetails(courseName, stats) {
    document.getElementById('modalCourseTitle').textContent = courseName;
    document.getElementById('modalEnrolled').textContent = stats.enrolled;
    document.getElementById('modalCompleted').textContent = stats.completed;
    document.getElementById('modalInProgress').textContent = stats.inProgress;
    document.getElementById('modalHalfDone').textContent = stats.halfDone;
    document.getElementById('courseModal').classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('courseModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCourseModal();
    }
});

// ===== OPPORTUNITY DETAILS MODAL =====
function openOpportunityDetails(title, details) {
    document.getElementById('opportunityDetailTitle').textContent = title;
    document.getElementById('opportunityDetailDuration').textContent = details.duration;
    document.getElementById('opportunityDetailStartDate').textContent = details.startDate;
    document.getElementById('opportunityDetailApplicants').textContent = details.applicants;
    document.getElementById('opportunityDetailDescription').textContent = details.description;
    document.getElementById('opportunityDetailFuture').textContent = details.futureOpportunities;
    document.getElementById('opportunityDetailPrereqs').textContent = details.prerequisites;
    
    const skillsContainer = document.getElementById('opportunityDetailSkills');
    skillsContainer.innerHTML = '';
    details.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });
    
    document.getElementById('opportunityDetailsModal').classList.add('active');
}

function closeOpportunityDetailsModal() {
    document.getElementById('opportunityDetailsModal').classList.remove('active');
}

function applyToOpportunity() {
    showToast('Application submitted successfully!');
    closeOpportunityDetailsModal();
}

document.getElementById('opportunityDetailsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeOpportunityDetailsModal();
    }
});

// ===== COLLABORATOR COURSES MODAL =====
function openCollaboratorCourses(name, role) {
    document.getElementById('collaboratorName').textContent = name + "'s Submitted Courses";
    document.getElementById('collaboratorRole').textContent = 'Role: ' + role;
    document.getElementById('collaboratorCoursesModal').classList.add('active');
}

function closeCollaboratorCoursesModal() {
    document.getElementById('collaboratorCoursesModal').classList.remove('active');
}

function approveCourse(courseName) {
    showToast(courseName + ' has been approved!');
    // In a real app, you would update the course status here
}

function rejectCourse(courseName) {
    showToast(courseName + ' has been rejected.');
    // In a real app, you would update the course status here
}

function viewCourseDetails(courseName) {
    showToast('Viewing details for ' + courseName);
    // In a real app, you would open a detailed course modal
}

document.getElementById('collaboratorCoursesModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCollaboratorCoursesModal();
    }
});

// ===== OPPORTUNITY MODAL =====
function openOpportunityModal() {
    document.getElementById('opportunityModal').classList.add('active');
}

function closeOpportunityModal() {
    document.getElementById('opportunityModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('opportunityModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeOpportunityModal();
    }
});
// ================= OPPORTUNITY CREATE =================
// document.getElementById('opportunityForm').addEventListener('submit', async function(e) {
//     e.preventDefault();

//     const name = document.getElementById('oppName').value.trim();
//     const duration = document.getElementById('oppDuration').value.trim();
//     const startDate = document.getElementById('oppStartDate').value;
//     const description = document.getElementById('oppDescription').value.trim();
//     const skills = document.getElementById('oppSkills').value.trim();
//     const category = document.getElementById('oppCategory').value;
//     const future = document.getElementById('oppFuture').value.trim();
//     const maxApplicants = document.getElementById('oppMaxApplicants').value;

//     if (!name || !duration || !startDate || !description || !skills || !category || !future) {
//         showToast("Fill all required fields");
//         return;
//     }

//     const data = {
//         name,
//         duration,
//         start_date: startDate,
//         description,
//         skills,
//         category,
//         future_opportunities: future,
//         max_applicants: maxApplicants,
//         admin_id: 1
//     };

//     try {
//         const res = await fetch("http://127.0.0.1:5000/opportunities", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify(data)
//         });

//         const result = await res.json();

//         if (res.ok) {
//             showToast("Opportunity created!");
//             addOpportunityToUI(data);
//             closeOpportunityModal();
//             this.reset();
//         } else {
//             showToast(result.error);
//         }

//     } catch (err) {
//         console.error(err);
//         showToast("Server error");
//     }
// });
document.getElementById('opportunityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("ADMIN ID (Submit):", localStorage.getItem("admin_id"));

    const data = {
        name: document.getElementById('oppName').value,
        duration: document.getElementById('oppDuration').value.trim(),
        start_date: document.getElementById('oppStartDate').value,
        description: document.getElementById('oppDescription').value.trim(),
        skills: document.getElementById('oppSkills').value.trim(),
        category: document.getElementById('oppCategory').value,
        future_opportunities: document.getElementById('oppFuture').value.trim(),
        max_applicants: document.getElementById('oppMaxApplicants').value,
        admin_id: localStorage.getItem("admin_id")
    };
    console.log("Category:", data.category);

    // Validation
    if (!data.name || !data.duration || !data.start_date || !data.description || !data.skills || !data.category || !data.future_opportunities) {
        showToast("Fill all required fields");
        return;
    }

    try {
        let url = "http://127.0.0.1:5000/opportunities";
        let method = "POST";

        //  EDIT MODE (IMPORTANT)
        if (editMode) {
            url = `http://127.0.0.1:5000/opportunities/${editId}`;
            method = "PUT";
        }

        const res = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            showToast(editMode ? "Updated successfully!" : "Created successfully!");

            // Reset edit state
            editMode = false;
            editId = null;

            closeOpportunityModal();

            // Reload from DB (important)
            loadOpportunities();

        } else {
            showToast(result.error);
        }

    } catch (err) {
        console.error(err);
        showToast("Server error");
    }
});

// ================= UI UPDATE =================
function addOpportunityToUI(opp) {
    const grid = document.querySelector('.opportunities-grid');

    const card = document.createElement('div');
    card.className = 'opportunity-card';
    const skillsArray = opp.skills ? opp.skills.split(',') : [];

    card.innerHTML = `
        <div class="opportunity-card-header">
            <h5>${opp.name}</h5>
            <div class="opportunity-meta">
                <span>${opp.duration}</span>
                <span>${opp.start_date}</span>
            </div>
        </div>

        <p class="opportunity-description">${opp.description}</p>

        <div class="opportunity-footer">
            <span>${opp.category}</span>
            <div class="btn-group">
              <button class="view-course-btn">View Details</button>
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
              </div>
        </div>
    `;

    //  ADD CLICK EVENT HERE
    card.querySelector('.view-course-btn').addEventListener('click', function () {
        openOpportunityDetails(opp.name, {
            duration: opp.duration,
            startDate: opp.start_date,
            description: opp.description,
            skills: skillsArray,
            applicants: opp.max_applicants || 0,
            futureOpportunities: opp.future_opportunities,
            prerequisites: opp.category   // optional mapping
        });
    });
    card.querySelector('.edit-btn').addEventListener('click', function () {

    editMode = true;
    editId = opp.id;

    // Pre-fill form
    document.getElementById('oppName').value = opp.name;
    document.getElementById('oppDuration').value = opp.duration;
    document.getElementById('oppStartDate').value = opp.start_date;
    document.getElementById('oppDescription').value = opp.description;
    document.getElementById('oppSkills').value = opp.skills;
    document.getElementById('oppCategory').value = opp.category;
    document.getElementById('oppFuture').value = opp.future_opportunities;
    document.getElementById('oppMaxApplicants').value = opp.max_applicants || '';

    openOpportunityModal();
});
    card.querySelector('.delete-btn').addEventListener('click', async function () {

    const confirmDelete = confirm("Are you sure you want to delete this opportunity?");

    if (!confirmDelete) return;

    try {
        const admin_id = localStorage.getItem("admin_id");

        const res = await fetch(`http://127.0.0.1:5000/opportunities/${opp.id}?admin_id=${admin_id}`, {
            method: "DELETE"
        });

        const result = await res.json();

        if (res.ok) {
            showToast("Deleted successfully!");

            //  Remove from UI instantly
            card.remove();

        } else {
            showToast(result.error);
        }

    } catch (err) {
        console.error(err);
        showToast("Server error");
    }
});

    grid.appendChild(card);
}
// function addOpportunityToUI(data) {
//     const grid = document.querySelector('.opportunities-grid');

//     const card = document.createElement('div');
//     card.className = 'opportunity-card';

//     card.innerHTML = `
//         <h5>${data.name}</h5>
//         <p>${data.description}</p>
//         <span>${data.duration}</span>
//     `;

//     grid.appendChild(card);
// }
// Handle opportunity form submission
        // document.getElementById('opportunityForm').addEventListener('submit', function(e) {
        //     e.preventDefault();

        //     // collect values
        //     const name = document.getElementById('oppName').value.trim();
        //     const duration = document.getElementById('oppDuration').value.trim();
        //     const startDate = document.getElementById('oppStartDate').value;
        //     const description = document.getElementById('oppDescription').value.trim();
        //     const skillsRaw = document.getElementById('oppSkills').value.trim();
        //     const category = document.getElementById('oppCategory').value;
        //     const futureOpportunities = document.getElementById('oppFuture').value.trim();
        //     const maxApplicants = document.getElementById('oppMaxApplicants').value.trim();

        //     // basic validation
        //     if (!name || !duration || !startDate || !description || !skillsRaw || !category || !futureOpportunities) {
        //         showToast('Please fill all required fields');
        //         return;
        //     }

        //     // parse skills
        //     const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

        //     // create opportunity card element
        //     const card = document.createElement('div');
        //     card.className = 'opportunity-card';

        //     // header and meta
        //     const headerHtml = `
        //         <div class="opportunity-card-header">
        //             <h5>${escapeHtml(name)}</h5>
        //             <div class="opportunity-meta">
        //                 <span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${escapeHtml(duration)}</span>
        //                 <span><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${escapeHtml(startDate)}</span>
        //             </div>
        //         </div>
        //         <p class="opportunity-description">${escapeHtml(description)}</p>
        //     `;

        //     // skills tags
        //     const skillsHtml = `<div class="opportunity-skills"><div class="opportunity-skills-label">Skills You'll Gain</div><div class="skills-tags">
        //         ${skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
        //     </div></div>`;

        //     // footer
        //     const applicantsCount = maxApplicants ? `${parseInt(maxApplicants,10)} applicants` : '0 applicants';
        //     const footerHtml = `
        //         <div class="opportunity-footer">
        //             <span class="applicants-count">${escapeHtml(applicantsCount)}</span>
        //             <button class="view-course-btn" style="width: auto; padding: 8px 16px;">View Details</button>
        //         </div>
        //     `;

        //     card.innerHTML = headerHtml + skillsHtml + footerHtml;

        //     // wire up the View Details button to open details modal
        //     const viewBtn = card.querySelector('.view-course-btn');
        //     viewBtn.addEventListener('click', function() {
        //         openOpportunityDetails(name, {
        //             duration: duration,
        //             startDate: startDate,
        //             description: description,
        //             skills: skills,
        //             applicants: maxApplicants ? parseInt(maxApplicants,10) : 0,
        //             futureOpportunities: futureOpportunities,
        //             prerequisites: ''
        //         });
        //     });

        //     // append to grid
        //     const grid = document.querySelector('.opportunities-grid');
        //     if (grid) grid.appendChild(card);

        //     showToast('Opportunity created successfully!');
        //     closeOpportunityModal();
        //     this.reset();
        // });

        // small helper to avoid HTML injection when inserting text
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

// ===== QUICK ADD STUDENT MODAL =====
function openQuickAddModal() {
    document.getElementById('quickAddModal').classList.add('active');
}

function closeQuickAddModal() {
    document.getElementById('quickAddModal').classList.remove('active');
}

document.getElementById('quickAddModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeQuickAddModal();
    }
});

document.getElementById('quickAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Student added successfully! Email invitation sent.');
    closeQuickAddModal();
    this.reset();
});

// ===== BULK UPLOAD MODAL =====
function openBulkUploadModal() {
    document.getElementById('bulkUploadModal').classList.add('active');
}

function closeBulkUploadModal() {
    document.getElementById('bulkUploadModal').classList.remove('active');
}

document.getElementById('bulkUploadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBulkUploadModal();
    }
});

document.getElementById('bulkUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('csvFileInput');
    if (fileInput.files.length === 0) {
        showToast('Please select a CSV file');
        return;
    }
    showToast('Students uploaded successfully! Email invitations sent.');
    closeBulkUploadModal();
    this.reset();
    document.getElementById('fileName').textContent = '';
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = '✓ Selected: ' + file.name;
    }
}

function downloadSampleCSV() {
    const csvContent = 'First Name,Last Name,Email\nJohn,Doe,john.doe@example.com\nJane,Smith,jane.smith@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== QUICK ADD VERIFIER MODAL =====
function openQuickAddVerifierModal() {
    document.getElementById('quickAddVerifierModal').classList.add('active');
}

function closeQuickAddVerifierModal() {
    document.getElementById('quickAddVerifierModal').classList.remove('active');
}

document.getElementById('quickAddVerifierModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeQuickAddVerifierModal();
    }
});

document.getElementById('quickAddVerifierForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Verifier added successfully! Email invitation sent.');
    closeQuickAddVerifierModal();
    this.reset();
});

// ===== BULK UPLOAD VERIFIER MODAL =====
function openBulkUploadVerifierModal() {
    document.getElementById('bulkUploadVerifierModal').classList.add('active');
}

function closeBulkUploadVerifierModal() {
    document.getElementById('bulkUploadVerifierModal').classList.remove('active');
}

document.getElementById('bulkUploadVerifierModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBulkUploadVerifierModal();
    }
});

document.getElementById('bulkUploadVerifierForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('csvVerifierFileInput');
    if (fileInput.files.length === 0) {
        showToast('Please select a CSV file');
        return;
    }
    showToast('Verifiers uploaded successfully! Email invitations sent.');
    closeBulkUploadVerifierModal();
    this.reset();
    document.getElementById('verifierFileName').textContent = '';
});

function handleVerifierFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('verifierFileName').textContent = '✓ Selected: ' + file.name;
    }
}

function downloadSampleVerifierCSV() {
    const csvContent = 'First Name,Last Name,Email,Subject\nDr. John,Doe,john.doe@qf.edu.qa,Mathematics\nProf. Jane,Smith,jane.smith@qf.edu.qa,Physics';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_verifiers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== VERIFIER DETAILS MODAL =====
function openVerifierDetails(name, stats) {
    document.getElementById('verifierName').textContent = name;
    document.getElementById('verifierTotalStudents').textContent = stats.totalStudents;
    document.getElementById('verifierCertified').textContent = stats.certified;
    document.getElementById('verifierInProgress').textContent = stats.inProgress;
    
    // Populate subjects
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    stats.subjects.forEach(subject => {
        const div = document.createElement('div');
        div.className = 'subject-item';
        div.innerHTML = `
            <span class="subject-name">${subject.name}</span>
            <span class="subject-students">${subject.students} students</span>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('verifierDetailsModal').classList.add('active');
}

function closeVerifierDetailsModal() {
    document.getElementById('verifierDetailsModal').classList.remove('active');
}

document.getElementById('verifierDetailsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeVerifierDetailsModal();
    }
});

// ===== STUDENT FILTERS =====
function filterStudents() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    const rows = document.querySelectorAll('#studentsTableBody tr');
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        let showRow = true;
        
        // Status filter
        if (statusFilter !== 'all' && rowStatus !== statusFilter) {
            showRow = false;
        }
        
        // Date filters would be implemented here with actual date data
        
        row.style.display = showRow ? '' : 'none';
    });
}

// ===== VERIFIER FILTERS =====
function filterVerifiers() {
    const statusFilter = document.getElementById('verifierStatusFilter').value;
    const dateFrom = document.getElementById('verifierDateFrom').value;
    const dateTo = document.getElementById('verifierDateTo').value;
    
    const rows = document.querySelectorAll('#verifiersTableBody tr');
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        let showRow = true;
        
        // Status filter
        if (statusFilter !== 'all' && rowStatus !== statusFilter) {
            showRow = false;
        }
        
        // Date filters would be implemented here with actual date data
        
        row.style.display = showRow ? '' : 'none';
    });
}

// // ===== LOGIN =====
// document.getElementById('loginForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     clearAllErrors('loginForm');
//     let valid = true;
//     const email = document.getElementById('loginEmail').value.trim();
//     const password = document.getElementById('loginPassword').value.trim();
//     const captchaInput = document.getElementById('loginCaptchaInput').value.trim();

//     if (!email || !isValidEmail(email)) { showError('loginEmailErr'); document.getElementById('loginEmail').classList.add('error'); valid = false; }
//     if (!password) { showError('loginPasswordErr','Please enter your password'); document.getElementById('loginPassword').classList.add('error'); valid = false; }
//     if (!captchaInput) { showError('loginCaptchaErr','Please enter the captcha code'); valid = false; }
//     else if (captchaInput !== captchas.login) { showError('loginCaptchaErr','Captcha does not match. Please try again.'); valid = false; generateCaptcha('login'); }

//     if (!valid) { shakeForm('loginForm'); return; }

//     showToast('Login successful! Redirecting...');
//     setTimeout(() => showDashboard(email), 1200);
//     generateCaptcha('login');
// });

// // ===== SIGNUP =====
// document.getElementById('signupForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     clearAllErrors('signupForm');
//     let valid = true;
//     const name = document.getElementById('signupName').value.trim();
//     const email = document.getElementById('signupEmail').value.trim();
//     const password = document.getElementById('signupPassword').value.trim();
//     const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
//     const captchaInput = document.getElementById('signupCaptchaInput').value.trim();

//     if (!name) { showError('signupNameErr'); document.getElementById('signupName').classList.add('error'); valid = false; }
//     if (!email || !isValidEmail(email)) { showError('signupEmailErr'); document.getElementById('signupEmail').classList.add('error'); valid = false; }
//     if (!password || password.length < 8) { showError('signupPasswordErr'); document.getElementById('signupPassword').classList.add('error'); valid = false; }
//     if (!confirmPassword || password !== confirmPassword) { showError('signupConfirmPasswordErr'); document.getElementById('signupConfirmPassword').classList.add('error'); valid = false; }
//     if (!captchaInput) { showError('signupCaptchaErr','Please enter the captcha code'); valid = false; }
//     else if (captchaInput !== captchas.signup) { showError('signupCaptchaErr','Captcha does not match.'); valid = false; generateCaptcha('signup'); }

//     if (!valid) { shakeForm('signupForm'); return; }
//     showToast('Account created successfully!');
//     generateCaptcha('signup');
//     this.reset(); checkStrength('');
//     setTimeout(() => showPage('loginPage'), 1500);
// });

// // ===== FORGOT =====
// document.getElementById('forgotForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     clearAllErrors('forgotForm');
//     let valid = true;
//     const email = document.getElementById('forgotEmail').value.trim();
//     const captchaInput = document.getElementById('forgotCaptchaInput').value.trim();

//     if (!email || !isValidEmail(email)) { showError('forgotEmailErr'); document.getElementById('forgotEmail').classList.add('error'); valid = false; }
//     if (!captchaInput) { showError('forgotCaptchaErr','Please enter the captcha code'); valid = false; }
//     else if (captchaInput !== captchas.forgot) { showError('forgotCaptchaErr','Captcha does not match.'); valid = false; generateCaptcha('forgot'); }

//     if (!valid) { shakeForm('forgotForm'); return; }
//     showToast('Reset link sent to your email!');
//     generateCaptcha('forgot');
//     this.reset();
// });

// // Clear errors on input
// document.querySelectorAll('input').forEach(input => {
//     input.addEventListener('input', function() {
//         this.classList.remove('error');
//         const err = this.closest('.form-group')?.querySelector('.error-msg');
//         if (err) err.classList.remove('show');
//     });
// });

// Responsive sidebar
window.addEventListener('resize', () => {
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
});
// ===== SIGNUP API INTEGRATION =====
document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        full_name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value,
        confirm_password: document.getElementById("signupConfirmPassword").value
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast("Signup successful!");
            showPage('loginPage'); // go to login
        } else {
            showToast(result.error);
        }

    } catch (error) {
        console.error(error);
        showToast("Server error");
    }
});
// ===== LOGIN API INTEGRATION =====
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast("Login successful!");
            // ✅ STORE ADMIN ID (CRITICAL FOR US-2.3)
            localStorage.setItem("admin_id", result.user.id);
            localStorage.setItem("admin_email", result.user.email);
            showDashboard(result.user.email); // already exists in your JS
            loadOpportunities(); // load opportunities after login
        } else {
            showToast(result.error);
        }

    } catch (error) {
        console.error(error);
        showToast("Server error");
    }
});
// ===== FORGOT PASSWORD API INTEGRATION =====//
// ===== FORGOT PASSWORD API =====
document.getElementById("forgotForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        showToast(result.message);

    } catch (error) {
        console.error(error);
        showToast("Server error");
    }
});
// ===== LOAD OPPORTUNITIES (US-2.3) =====
async function loadOpportunities() {
    console.log("ADMIN ID (Load):", localStorage.getItem("admin_id"));
    const admin_id = localStorage.getItem("admin_id");

    if (!admin_id) return;

    try {
        const res = await fetch(`http://127.0.0.1:5000/opportunities?admin_id=${admin_id}`);
        const data = await res.json();

        const grid = document.querySelector('.opportunities-grid');
        grid.innerHTML = ""; // clear old UI

        if (data.message) return;

        data.forEach(opp => {
            addOpportunityToUI(opp);
        });

    } catch (err) {
        console.error(err);
        showToast("Error loading opportunities");
    }
}
window.addEventListener("load", () => {
    const admin_id = localStorage.getItem("admin_id");

    if (admin_id) {
        loadOpportunities();
    }
});