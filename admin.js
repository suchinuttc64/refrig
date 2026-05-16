/* =====================================================
   TECHVOC LMS — admin.js
   Teacher / Admin Dashboard Logic
   วิชา: ช่างแอร์และเครื่องทำความเย็น ปวช.1
   ===================================================== */

'use strict';

// =====================================================
// ADMIN STATE
// =====================================================
const ADMIN_STATE = {
  currentTab: 'overview',
  selectedStudent: null,
  selectedUnit: null,
  editingLesson: null,
  editingQuiz: null,
  grading: null,
  searchQuery: '',
  filterStatus: 'all',
  notifications: [],
};

// =====================================================
// ADMIN DATA
// =====================================================
const ADMIN_DATA = {
  teacher: {
    name: 'อาจารย์ประยูร มีชัย',
    avatar: 'ปย',
    subject: 'ช่างแอร์และเครื่องทำความเย็น',
    section: '1/1',
    year: 2568,
  },

  classStats: {
    totalStudents: 32,
    activeToday: 28,
    avgProgress: 62,
    avgScore: 74,
    submissionsToday: 15,
    pendingGrade: 7,
    atRisk: 4,
    completedAll: 3,
  },

  students: [
    { id:'STD001', name:'นายสมชาย ใจดี',      no:1,  avatar:'สช', color:'#1565c0', progress:68, score:78, assignments:11, xp:2450, attendance:94, status:'good',      lastActive:'วันนี้ 10:32' },
    { id:'STD002', name:'นางสาวพิมพ์ใจ รัก',  no:2,  avatar:'พร', color:'#880e4f', progress:75, score:82, assignments:12, xp:2780, attendance:97, status:'good',      lastActive:'วันนี้ 09:15' },
    { id:'STD003', name:'นายประเสริฐ ดีมาก',  no:3,  avatar:'ปด', color:'#1b5e20', progress:90, score:91, assignments:15, xp:3420, attendance:100,status:'excellent', lastActive:'วันนี้ 11:00' },
    { id:'STD004', name:'นางสาวสุดใจ มี',      no:4,  avatar:'สม', color:'#4e342e', progress:45, score:62, assignments:8,  xp:1640, attendance:78, status:'risk',      lastActive:'3 วันที่แล้ว' },
    { id:'STD005', name:'นายวิชัย ชาญ',        no:5,  avatar:'วช', color:'#4a148c', progress:83, score:88, assignments:14, xp:3100, attendance:96, status:'good',      lastActive:'วันนี้ 08:50' },
    { id:'STD006', name:'นางสาวอรุณี สว่าง',   no:6,  avatar:'อส', color:'#006064', progress:30, score:55, assignments:6,  xp:1200, attendance:65, status:'risk',      lastActive:'5 วันที่แล้ว' },
    { id:'STD007', name:'นายสิทธิชัย กล้า',    no:7,  avatar:'สก', color:'#e65100', progress:72, score:79, assignments:12, xp:2200, attendance:91, status:'good',      lastActive:'วันนี้ 09:45' },
    { id:'STD008', name:'นางสาวรุ่งทิพย์ งาม', no:8,  avatar:'รง', color:'#00695c', progress:65, score:75, assignments:11, xp:1950, attendance:88, status:'good',      lastActive:'เมื่อวาน' },
    { id:'STD009', name:'นายอนุชา ดี',          no:9,  avatar:'อด', color:'#37474f', progress:58, score:70, assignments:10, xp:1800, attendance:85, status:'good',      lastActive:'เมื่อวาน' },
    { id:'STD010', name:'นางสาวมาลี สุข',       no:10, avatar:'มส', color:'#6a1b9a', progress:40, score:60, assignments:7,  xp:1400, attendance:72, status:'risk',      lastActive:'4 วันที่แล้ว' },
  ],

  pendingAssignments: [
    { id:'PA001', studentName:'นายสมชาย ใจดี',    studentId:'STD001', assignmentTitle:'ใบงานที่ 9 — การวิเคราะห์วงจรไฟฟ้า', unit:5, submittedAt:'14 พ.ค. 68 14:32', files:2, status:'pending' },
    { id:'PA002', studentName:'นางสาวพิมพ์ใจ รัก', studentId:'STD002', assignmentTitle:'ใบงานที่ 8 — การวัดแรงดันระบบ',        unit:4, submittedAt:'13 พ.ค. 68 10:15', files:3, status:'pending' },
    { id:'PA003', studentName:'นายประเสริฐ ดีมาก', studentId:'STD003', assignmentTitle:'ใบงานที่ 9 — การวิเคราะห์วงจรไฟฟ้า', unit:5, submittedAt:'14 พ.ค. 68 08:45', files:1, status:'pending' },
    { id:'PA004', studentName:'นายวิชัย ชาญ',       studentId:'STD005', assignmentTitle:'ใบงานที่ 8 — การวัดแรงดันระบบ',        unit:4, submittedAt:'13 พ.ค. 68 15:20', files:4, status:'pending' },
    { id:'PA005', studentName:'นายสิทธิชัย กล้า',   studentId:'STD007', assignmentTitle:'ใบงานที่ 9 — การวิเคราะห์วงจรไฟฟ้า', unit:5, submittedAt:'14 พ.ค. 68 11:30', files:2, status:'pending' },
  ],

  lessons: [
    { id:'L001', unitId:1, title:'หลักการถ่ายเทความร้อน', type:'video', duration:12, status:'published' },
    { id:'L002', unitId:1, title:'วัฏจักรการทำความเย็น',   type:'video', duration:15, status:'published' },
    { id:'L003', unitId:1, title:'สารทำความเย็น R134a',    type:'interactive', duration:10, status:'published' },
    { id:'L004', unitId:2, title:'คอมเพรสเซอร์',          type:'video', duration:18, status:'published' },
    { id:'L005', unitId:2, title:'คอนเดนเซอร์',           type:'video', duration:14, status:'published' },
    { id:'L006', unitId:5, title:'วงจรไฟฟ้าพื้นฐาน',     type:'video', duration:12, status:'published' },
    { id:'L007', unitId:5, title:'รีเลย์และสตาร์ทเตอร์',  type:'lab', duration:20, status:'draft' },
    { id:'L008', unitId:6, title:'การล้างระบบ',            type:'video', duration:16, status:'draft' },
  ],

  quizBank: [
    { id:'Q001', unitId:1, title:'แบบทดสอบหน่วยที่ 1', questions:10, avgScore:82, attempts:28, status:'published' },
    { id:'Q002', unitId:2, title:'แบบทดสอบหน่วยที่ 2', questions:10, avgScore:79, attempts:30, status:'published' },
    { id:'Q003', unitId:3, title:'แบบทดสอบหน่วยที่ 3', questions:10, avgScore:85, attempts:27, status:'published' },
    { id:'Q004', unitId:4, title:'แบบทดสอบหน่วยที่ 4', questions:10, avgScore:76, attempts:25, status:'published' },
    { id:'Q005', unitId:5, title:'แบบทดสอบหน่วยที่ 5', questions:5,  avgScore:71, attempts:18, status:'published' },
    { id:'Q006', unitId:6, title:'แบบทดสอบหน่วยที่ 6', questions:10, avgScore:0,  attempts:0,  status:'draft' },
  ],

  announcements: [
    { id:'A001', title:'กำหนดส่งใบงานที่ 9', body:'นักเรียนทุกคนต้องส่งใบงานที่ 9 ภายในวันพฤหัสบดีที่ 14 พฤษภาคม 2568 เวลา 17:00 น.', date:'12 พ.ค. 68', priority:'high' },
    { id:'A002', title:'ทดสอบหน่วยที่ 5 สัปดาห์หน้า', body:'จะมีการสอบหน่วยที่ 5 ในวันพุธที่ 21 พฤษภาคม 2568 ขอให้เตรียมตัวให้พร้อม', date:'13 พ.ค. 68', priority:'medium' },
    { id:'A003', title:'เปิดห้องแล็บเสมือนใหม่', body:'ได้เพิ่มโมดูลจำลองการวินิจฉัยปัญหาในห้องแล็บเสมือน ขอให้นักเรียนลองใช้งาน', date:'10 พ.ค. 68', priority:'low' },
  ],
};

// =====================================================
// ADMIN API
// =====================================================
const AdminAPI = {
  baseUrl: (typeof CONFIG !== 'undefined') ? CONFIG.APPS_SCRIPT_URL : 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',

  async post(action, payload = {}) {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify({ action, role: 'teacher', ...payload }),
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      console.warn('[AdminAPI] Offline:', err.message);
      return { success: false, offline: true };
    }
  },

  async gradeAssignment(submissionId, score, feedback) {
    return this.post('gradeAssignment', { submissionId, score, feedback });
  },

  async sendAnnouncement(title, body, priority) {
    return this.post('sendAnnouncement', { title, body, priority });
  },

  async exportReport(type) {
    return this.post('exportReport', { type });
  },

  async updateLesson(lessonId, data) {
    return this.post('updateLesson', { lessonId, ...data });
  },

  async toggleLessonStatus(lessonId, status) {
    return this.post('toggleLessonStatus', { lessonId, status });
  },
};

// =====================================================
// ADMIN UI RENDERER
// =====================================================
const AdminUI = {

  // ── Overview Stats ──────────────────────────────
  renderOverviewStats() {
    const s = ADMIN_DATA.classStats;
    const container = document.getElementById('admin-overview-stats');
    if (!container) return;
    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(33,150,243,0.12)">👥</div>
        <div>
          <div class="stat-label">นักเรียนทั้งหมด</div>
          <div class="stat-value">${s.totalStudents}</div>
          <div class="stat-delta up">↑ ออนไลน์วันนี้ ${s.activeToday} คน</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(76,175,80,0.12)">📊</div>
        <div>
          <div class="stat-label">ความก้าวหน้าเฉลี่ย</div>
          <div class="stat-value">${s.avgProgress}%</div>
          <div class="stat-delta up">↑ +3% จากสัปดาห์ที่แล้ว</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,152,0,0.12)">📝</div>
        <div>
          <div class="stat-label">รอตรวจ</div>
          <div class="stat-value">${s.pendingGrade}</div>
          <div class="stat-delta">ส่งวันนี้ ${s.submissionsToday} ใบ</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(244,67,54,0.12)">⚠️</div>
        <div>
          <div class="stat-label">นักเรียนเสี่ยง</div>
          <div class="stat-value">${s.atRisk}</div>
          <div class="stat-delta down">ต้องติดตาม ${s.atRisk} คน</div>
        </div>
      </div>`;
  },

  // ── Student Table ────────────────────────────────
  renderStudentTable(filter = 'all', search = '') {
    const tbody = document.getElementById('admin-student-tbody');
    if (!tbody) return;
    let students = ADMIN_DATA.students;
    if (filter !== 'all') students = students.filter(s => s.status === filter);
    if (search) students = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const statusLabel = { excellent:'⭐ เยี่ยม', good:'✅ ดี', risk:'⚠️ เสี่ยง' };
    const statusBadge = { excellent:'badge-green', good:'badge-blue', risk:'badge-orange' };

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px">ไม่พบข้อมูล</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => `
      <tr>
        <td style="font-weight:700;color:var(--text-muted)">${s.no}</td>
        <td>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:30px;height:30px;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff;flex-shrink:0">${s.avatar}</div>
            <div>
              <div style="font-size:0.82rem;font-weight:600">${s.name}</div>
              <div style="font-size:0.68rem;color:var(--text-muted)">${s.lastActive}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar" style="width:80px">
              <div class="progress-fill ${s.progress >= 70 ? 'prog-green' : s.progress >= 40 ? 'prog-blue' : 'prog-orange'}" style="width:${s.progress}%"></div>
            </div>
            <span style="font-size:0.72rem;color:var(--text-muted)">${s.progress}%</span>
          </div>
        </td>
        <td style="font-weight:600">${s.score}%</td>
        <td>${s.assignments}/16</td>
        <td style="color:${s.attendance < 80 ? 'var(--red-400)' : 'var(--text-primary)'}">
          ${s.attendance}%
        </td>
        <td style="color:var(--orange-400);font-weight:700;font-family:var(--font-mono);font-size:0.82rem">${s.xp.toLocaleString()}</td>
        <td>
          <div style="display:flex;gap:6px;align-items:center">
            <span class="badge ${statusBadge[s.status]}">${statusLabel[s.status]}</span>
            <button class="btn btn-ghost btn-sm" onclick="AdminActions.viewStudent('${s.id}')">ดู</button>
            ${s.status === 'risk' ? `<button class="btn btn-outline-orange btn-sm" onclick="AdminActions.sendAlert('${s.id}')">แจ้ง</button>` : ''}
          </div>
        </td>
      </tr>`).join('');
  },

  // ── Pending Assignments ──────────────────────────
  renderPendingAssignments() {
    const container = document.getElementById('admin-pending-list');
    if (!container) return;
    if (ADMIN_DATA.pendingAssignments.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted)">✅ ตรวจงานครบแล้ว!</div>`;
      return;
    }
    container.innerHTML = ADMIN_DATA.pendingAssignments.map(pa => `
      <div style="display:flex;align-items:center;gap:14px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px;background:var(--bg-card2)">
        <div style="width:36px;height:36px;border-radius:50%;background:${ADMIN_DATA.students.find(s=>s.id===pa.studentId)?.color||'#333'};display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff;flex-shrink:0">
          ${ADMIN_DATA.students.find(s=>s.id===pa.studentId)?.avatar||'??'}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.82rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pa.assignmentTitle}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${pa.studentName} • ${pa.submittedAt} • ${pa.files} ไฟล์</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="AdminActions.openGradeModal('${pa.id}')">ตรวจ</button>
      </div>`).join('');
  },

  // ── Lesson Manager ───────────────────────────────
  renderLessonManager() {
    const container = document.getElementById('admin-lessons-list');
    if (!container) return;
    const typeIcon = { video:'🎬', interactive:'🖱️', lab:'🔬', pdf:'📄' };
    const typeColor = { video:'var(--blue-400)', interactive:'var(--purple-400)', lab:'var(--teal-400)', pdf:'var(--orange-400)' };
    container.innerHTML = ADMIN_DATA.lessons.map(l => `
      <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:7px;background:var(--bg-card2)">
        <div style="font-size:1.2rem">${typeIcon[l.type] || '📄'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.82rem;font-weight:600">${l.title}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">หน่วยที่ ${l.unitId} • ${l.duration} นาที • <span style="color:${typeColor[l.type]||'var(--text-muted)'}">${l.type}</span></div>
        </div>
        <span class="badge ${l.status === 'published' ? 'badge-green' : 'badge-gray'}">${l.status === 'published' ? '✓ เผยแพร่แล้ว' : '✎ ร่าง'}</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="AdminActions.editLesson('${l.id}')">แก้ไข</button>
          <button class="btn ${l.status==='published'?'btn-secondary':'btn-primary'} btn-sm" 
                  onclick="AdminActions.toggleLessonStatus('${l.id}','${l.status === 'published' ? 'draft' : 'published'}')">
            ${l.status === 'published' ? 'ยกเลิกเผยแพร่' : 'เผยแพร่'}
          </button>
        </div>
      </div>`).join('');
  },

  // ── Quiz Manager ─────────────────────────────────
  renderQuizManager() {
    const container = document.getElementById('admin-quiz-list');
    if (!container) return;
    container.innerHTML = ADMIN_DATA.quizBank.map(q => `
      <div style="display:flex;align-items:center;gap:12px;padding:11px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:7px;background:var(--bg-card2)">
        <div style="font-size:1.2rem">❓</div>
        <div style="flex:1">
          <div style="font-size:0.82rem;font-weight:600">${q.title}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">${q.questions} ข้อ • คะแนนเฉลี่ย: ${q.avgScore || '--'}% • ทำไปแล้ว ${q.attempts} ครั้ง</div>
        </div>
        <span class="badge ${q.status === 'published' ? 'badge-green' : 'badge-gray'}">${q.status === 'published' ? '✓ เปิดใช้' : '✎ ร่าง'}</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="AdminActions.editQuiz('${q.id}')">แก้ไข</button>
          <button class="btn btn-ghost btn-sm" onclick="AdminActions.viewQuizStats('${q.id}')">สถิติ</button>
        </div>
      </div>`).join('');
  },

  // ── Announcements ────────────────────────────────
  renderAnnouncements() {
    const container = document.getElementById('admin-announcements');
    if (!container) return;
    const pColor = { high:'var(--red-400)', medium:'var(--orange-400)', low:'var(--blue-400)' };
    const pLabel = { high:'🔴 ด่วน', medium:'🟡 ปกติ', low:'🔵 ทั่วไป' };
    container.innerHTML = ADMIN_DATA.announcements.map(a => `
      <div style="padding:14px;border:1px solid var(--border);border-left:4px solid ${pColor[a.priority]||'var(--border)'};border-radius:var(--radius-sm);margin-bottom:10px;background:var(--bg-card2)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-size:0.85rem;font-weight:600">${a.title}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:0.68rem;color:var(--text-muted)">${a.date}</span>
            <span class="badge badge-gray" style="font-size:0.62rem">${pLabel[a.priority]}</span>
          </div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.6">${a.body}</div>
      </div>`).join('');
  },

  // ── Class Progress Chart ─────────────────────────
  renderClassProgressChart() {
    const container = document.getElementById('admin-class-chart');
    if (!container || container.dataset.rendered) return;
    container.dataset.rendered = '1';
    const bars = [
      { label:'หน่วย 1', val:96 }, { label:'หน่วย 2', val:94 },
      { label:'หน่วย 3', val:92 }, { label:'หน่วย 4', val:88 },
      { label:'หน่วย 5', val:56 }, { label:'หน่วย 6', val:8  },
      { label:'หน่วย 7', val:0  }, { label:'หน่วย 8', val:0  },
    ];
    container.innerHTML = bars.map(b => `
      <div class="chart-bar-wrap">
        <div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:4px">${b.val}%</div>
        <div class="chart-bar" style="height:${Math.max(4, Math.round((b.val/100)*130))}px;
             background:${b.val>80?'linear-gradient(180deg,#4caf50,#2e7d32)':b.val>40?'linear-gradient(180deg,#2196f3,#1565c0)':'linear-gradient(180deg,#9e9e9e,#616161)'}"></div>
        <div class="chart-bar-lbl">${b.label}</div>
      </div>`).join('');
  },

  // ── Risk Alert Cards ─────────────────────────────
  renderRiskAlerts() {
    const container = document.getElementById('admin-risk-list');
    if (!container) return;
    const riskStudents = ADMIN_DATA.students.filter(s => s.status === 'risk');
    if (riskStudents.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:16px;color:var(--green-400)">✅ ไม่มีนักเรียนที่น่าเป็นห่วง</div>`;
      return;
    }
    container.innerHTML = riskStudents.map(s => `
      <div style="padding:12px;border:1px solid rgba(244,67,54,0.2);border-radius:var(--radius-sm);margin-bottom:8px;background:rgba(244,67,54,0.04)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:28px;height:28px;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff">${s.avatar}</div>
            <div style="font-size:0.82rem;font-weight:600">${s.name}</div>
          </div>
          <button class="btn btn-outline-orange btn-sm" onclick="AdminActions.sendAlert('${s.id}')">📨 แจ้งเตือน</button>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <span style="font-size:0.72rem;color:var(--red-400)">⚠️ ความก้าวหน้า: ${s.progress}%</span>
          <span style="font-size:0.72rem;color:var(--orange-400)">📅 เข้าเรียน: ${s.attendance}%</span>
          <span style="font-size:0.72rem;color:var(--text-muted)">📝 ส่งงาน: ${s.assignments}/16</span>
        </div>
      </div>`).join('');
  },

  // ── Grade Modal ──────────────────────────────────
  renderGradeModal(submissionId) {
    const sub = ADMIN_DATA.pendingAssignments.find(p => p.id === submissionId);
    if (!sub) return;
    ADMIN_STATE.grading = sub;
    document.getElementById('grade-modal-title').textContent = `ตรวจ: ${sub.assignmentTitle}`;
    document.getElementById('grade-modal-body').innerHTML = `
      <div style="background:var(--bg-card2);border-radius:var(--radius-sm);padding:12px;margin-bottom:14px">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:4px">นักเรียน</div>
        <div style="font-size:0.9rem;font-weight:600">${sub.studentName}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px">ส่งเมื่อ: ${sub.submittedAt}</div>
      </div>

      <div style="margin-bottom:14px">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px">ไฟล์ที่ส่ง (${sub.files} ไฟล์)</div>
        ${Array.from({length: sub.files}, (_, i) => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-xs);margin-bottom:5px;font-size:0.78rem">
            <span>${i === 0 ? '📄' : '📷'}</span>
            <span>ไฟล์_${i+1}_${sub.studentId}.${i===0?'pdf':'jpg'}</span>
            <button class="btn btn-ghost btn-sm" style="margin-left:auto">ดาวน์โหลด</button>
          </div>`).join('')}
      </div>

      <div class="form-group" style="margin-bottom:14px">
        <label class="form-label">คะแนน (0–100)</label>
        <input type="number" id="grade-score-input" class="form-input" min="0" max="100" placeholder="กรอกคะแนน" value="80">
      </div>

      <div class="form-group" style="margin-bottom:16px">
        <label class="form-label">ความคิดเห็น / Feedback</label>
        <textarea id="grade-feedback-input" class="form-textarea" rows="4" placeholder="เขียน feedback ให้นักเรียน...">ผลงานดี ควรเพิ่มเติมรายละเอียดการวัดค่าให้ครบถ้วน</textarea>
      </div>

      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-full" onclick="AdminActions.submitGrade()">✓ บันทึกคะแนน</button>
        <button class="btn btn-ghost" onclick="AdminActions.closeGradeModal()">ยกเลิก</button>
      </div>`;
    document.getElementById('grade-modal').classList.add('open');
  },
};

// =====================================================
// ADMIN ACTIONS
// =====================================================
const AdminActions = {

  viewStudent(studentId) {
    const s = ADMIN_DATA.students.find(x => x.id === studentId);
    if (!s) return;
    ADMIN_STATE.selectedStudent = s;
    document.getElementById('student-modal-title').textContent = s.name;
    document.getElementById('student-modal-body').innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
        <div style="width:52px;height:52px;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:#fff">${s.avatar}</div>
        <div>
          <div style="font-size:1rem;font-weight:700">${s.name}</div>
          <div style="font-size:0.78rem;color:var(--text-muted)">ID: ${s.id} • เข้าเรียนล่าสุด: ${s.lastActive}</div>
        </div>
      </div>
      <div class="grid-2" style="gap:10px;margin-bottom:14px">
        <div style="background:var(--bg-card2);border-radius:var(--radius-sm);padding:12px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--blue-400)">${s.progress}%</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">ความก้าวหน้า</div>
        </div>
        <div style="background:var(--bg-card2);border-radius:var(--radius-sm);padding:12px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--green-400)">${s.score}%</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">คะแนนเฉลี่ย</div>
        </div>
        <div style="background:var(--bg-card2);border-radius:var(--radius-sm);padding:12px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:var(--orange-400)">${s.assignments}/16</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">ใบงาน</div>
        </div>
        <div style="background:var(--bg-card2);border-radius:var(--radius-sm);padding:12px;text-align:center">
          <div style="font-size:1.4rem;font-weight:700;color:${s.attendance<80?'var(--red-400)':'var(--teal-400)'}">${s.attendance}%</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">การเข้าเรียน</div>
        </div>
      </div>
      <div style="margin-bottom:14px">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px">ความก้าวหน้ารายหน่วย</div>
        ${[100,100,100,100,60,0,0,0].map((p,i)=>`
          <div class="progress-wrap" style="margin-bottom:6px">
            <div class="progress-label"><span style="font-size:0.72rem">หน่วย ${i+1}</span><span style="font-size:0.72rem">${p}%</span></div>
            <div class="progress-bar"><div class="progress-fill ${p===100?'prog-green':'prog-blue'}" style="width:${p}%"></div></div>
          </div>`).join('')}
      </div>
      ${s.status === 'risk' ? `
        <div style="background:rgba(244,67,54,0.08);border:1px solid rgba(244,67,54,0.2);border-radius:var(--radius-sm);padding:12px;margin-bottom:14px">
          <div style="font-size:0.82rem;font-weight:600;color:var(--red-400);margin-bottom:4px">⚠️ จุดที่ต้องพัฒนา</div>
          <ul style="font-size:0.78rem;color:var(--text-secondary);padding-left:16px;line-height:2">
            <li>การเข้าเรียนต่ำกว่าเกณฑ์ (${s.attendance}%)</li>
            <li>ส่งใบงานไม่ครบ (${s.assignments}/16)</li>
            <li>คะแนนต่ำกว่า 70% ในหลายวิชา</li>
          </ul>
        </div>` : ''}
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-full" onclick="AdminActions.sendAlert('${s.id}')">📨 ส่งข้อความ</button>
        <button class="btn btn-ghost" onclick="AdminActions.closeStudentModal()">ปิด</button>
      </div>`;
    document.getElementById('student-modal').classList.add('open');
  },

  closeStudentModal() {
    document.getElementById('student-modal')?.classList.remove('open');
  },

  openGradeModal(submissionId) {
    AdminUI.renderGradeModal(submissionId);
  },

  async submitGrade() {
    const score = parseInt(document.getElementById('grade-score-input')?.value || '0');
    const feedback = document.getElementById('grade-feedback-input')?.value || '';
    if (isNaN(score) || score < 0 || score > 100) {
      alert('กรุณากรอกคะแนน 0-100'); return;
    }
    const sub = ADMIN_STATE.grading;
    if (!sub) return;
    // Remove from pending
    const idx = ADMIN_DATA.pendingAssignments.findIndex(p => p.id === sub.id);
    if (idx !== -1) ADMIN_DATA.pendingAssignments.splice(idx, 1);
    ADMIN_DATA.classStats.pendingGrade = Math.max(0, ADMIN_DATA.classStats.pendingGrade - 1);
    // Update student score
    const student = ADMIN_DATA.students.find(s => s.id === sub.studentId);
    if (student) student.score = Math.round((student.score * 0.7 + score * 0.3));
    // Send to API
    await AdminAPI.gradeAssignment(sub.id, score, feedback);
    this.closeGradeModal();
    AdminUI.renderPendingAssignments();
    AdminUI.renderStudentTable(ADMIN_STATE.filterStatus, ADMIN_STATE.searchQuery);
    AdminUI.renderOverviewStats();
    showAdminToast(`✓ บันทึกคะแนน ${score}% สำหรับ ${sub.studentName}`, 'success');
  },

  closeGradeModal() {
    document.getElementById('grade-modal')?.classList.remove('open');
    ADMIN_STATE.grading = null;
  },

  sendAlert(studentId) {
    const s = ADMIN_DATA.students.find(x => x.id === studentId);
    if (!s) return;
    showAdminToast(`📨 ส่งการแจ้งเตือนถึง ${s.name} แล้ว`, 'info');
    AdminActions.closeStudentModal();
  },

  editLesson(lessonId) {
    const l = ADMIN_DATA.lessons.find(x => x.id === lessonId);
    if (!l) return;
    showAdminToast(`📝 เปิดแก้ไขบทเรียน: ${l.title}`, 'info');
  },

  toggleLessonStatus(lessonId, newStatus) {
    const l = ADMIN_DATA.lessons.find(x => x.id === lessonId);
    if (!l) return;
    l.status = newStatus;
    AdminUI.renderLessonManager();
    AdminAPI.toggleLessonStatus(lessonId, newStatus);
    showAdminToast(`${newStatus === 'published' ? '✓ เผยแพร่' : '✎ เปลี่ยนเป็นร่าง'}: ${l.title}`, 'success');
  },

  editQuiz(quizId) {
    const q = ADMIN_DATA.quizBank.find(x => x.id === quizId);
    if (!q) return;
    showAdminToast(`📝 เปิดแก้ไขแบบทดสอบ: ${q.title}`, 'info');
  },

  viewQuizStats(quizId) {
    const q = ADMIN_DATA.quizBank.find(x => x.id === quizId);
    if (!q) return;
    showAdminToast(`📊 สถิติ ${q.title}: เฉลี่ย ${q.avgScore}% จาก ${q.attempts} ครั้ง`, 'info');
  },

  async sendAnnouncement() {
    const title = document.getElementById('announce-title')?.value?.trim();
    const body  = document.getElementById('announce-body')?.value?.trim();
    const priority = document.getElementById('announce-priority')?.value || 'medium';
    if (!title || !body) { showAdminToast('กรุณากรอกชื่อและเนื้อหาประกาศ', 'warning'); return; }
    const newAnnounce = {
      id: 'A' + Date.now(), title, body, priority,
      date: new Date().toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'2-digit' }),
    };
    ADMIN_DATA.announcements.unshift(newAnnounce);
    await AdminAPI.sendAnnouncement(title, body, priority);
    document.getElementById('announce-title').value = '';
    document.getElementById('announce-body').value = '';
    AdminUI.renderAnnouncements();
    showAdminToast('✓ ส่งประกาศสำเร็จ', 'success');
  },

  async exportReport(type) {
    showAdminToast(`📥 กำลังส่งออก${type === 'csv' ? ' CSV' : type === 'pdf' ? ' PDF' : ' Excel'}...`, 'info');
    const result = await AdminAPI.exportReport(type);
    setTimeout(() => showAdminToast('✓ Export สำเร็จ — ตรวจสอบโฟลเดอร์ Google Drive', 'success'), 1500);
  },

  filterStudents(status) {
    ADMIN_STATE.filterStatus = status;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('btn-primary', btn.dataset.filter === status);
      btn.classList.toggle('btn-ghost',   btn.dataset.filter !== status);
    });
    AdminUI.renderStudentTable(status, ADMIN_STATE.searchQuery);
  },

  searchStudents(query) {
    ADMIN_STATE.searchQuery = query;
    AdminUI.renderStudentTable(ADMIN_STATE.filterStatus, query);
  },
};

// =====================================================
// ADMIN TABS
// =====================================================
function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('btn-primary', btn.dataset.tab === tabId);
    btn.classList.toggle('btn-ghost',   btn.dataset.tab !== tabId);
  });
  const el = document.getElementById('admin-tab-' + tabId);
  if (el) { el.classList.add('active'); }
  ADMIN_STATE.currentTab = tabId;

  // Lazy render
  if (tabId === 'lessons')    AdminUI.renderLessonManager();
  if (tabId === 'quizzes')    AdminUI.renderQuizManager();
  if (tabId === 'reports')    AdminUI.renderClassProgressChart();
  if (tabId === 'alerts')     AdminUI.renderRiskAlerts();
  if (tabId === 'announce')   AdminUI.renderAnnouncements();
}

// =====================================================
// TOAST (Admin-specific)
// =====================================================
function showAdminToast(message, type = 'info') {
  const colors = { info:'var(--blue-600)', success:'var(--green-600)', warning:'var(--orange-600)', error:'var(--red-600)' };
  document.querySelectorAll('.admin-toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  Object.assign(toast.style, {
    position:'fixed', top:'78px', right:'18px', zIndex:'400',
    background: colors[type] || colors.info, color:'#fff',
    padding:'10px 18px', borderRadius:'8px',
    fontSize:'0.85rem', fontWeight:'600',
    boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
    animation:'toastIn 0.3s ease',
  });
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// =====================================================
// ADMIN PAGE INIT
// =====================================================
function initAdminPage() {
  // Check if we're on the admin page section
  const adminEl = document.getElementById('page-admin');
  if (!adminEl) return;

  // Inject admin HTML structure if not already present
  if (!document.getElementById('admin-overview-stats')) {
    injectAdminHTML();
  }

  AdminUI.renderOverviewStats();
  AdminUI.renderStudentTable();
  AdminUI.renderPendingAssignments();
  AdminUI.renderClassProgressChart();
}

function injectAdminHTML() {
  const page = document.getElementById('page-admin');
  if (!page) return;
  page.innerHTML = `
  <div class="page-content">
    <div class="section-header">
      <div>
        <div class="section-title">⚙️ แผงผู้สอน</div>
        <div class="section-subtitle">${ADMIN_DATA.teacher.name} • ${ADMIN_DATA.teacher.subject}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="AdminActions.exportReport('csv')">📥 CSV</button>
        <button class="btn btn-ghost btn-sm" onclick="AdminActions.exportReport('pdf')">📥 PDF</button>
        <button class="btn btn-primary btn-sm" onclick="switchAdminTab('announce')">📢 ประกาศ</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid-4 mb-20" id="admin-overview-stats"></div>

    <!-- Tabs -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
      <button class="btn btn-primary admin-tab-btn" data-tab="students" onclick="switchAdminTab('students')">👥 นักเรียน</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="grade" onclick="switchAdminTab('grade')">📝 ตรวจงาน</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="lessons" onclick="switchAdminTab('lessons')">📚 บทเรียน</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="quizzes" onclick="switchAdminTab('quizzes')">❓ แบบทดสอบ</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="reports" onclick="switchAdminTab('reports')">📊 รายงาน</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="alerts" onclick="switchAdminTab('alerts')">⚠️ เฝ้าระวัง</button>
      <button class="btn btn-ghost admin-tab-btn" data-tab="announce" onclick="switchAdminTab('announce')">📢 ประกาศ</button>
    </div>

    <!-- TAB: Students -->
    <div id="admin-tab-students" class="admin-tab-content active">
      <div class="card">
        <div class="card-header">
          <div class="card-title">รายชื่อนักเรียน</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input class="search-input" type="text" placeholder="ค้นหาชื่อ..." oninput="AdminActions.searchStudents(this.value)" style="width:180px">
            <button class="btn btn-primary filter-btn" data-filter="all"       onclick="AdminActions.filterStudents('all')">ทั้งหมด</button>
            <button class="btn btn-ghost  filter-btn" data-filter="excellent"  onclick="AdminActions.filterStudents('excellent')">⭐ เยี่ยม</button>
            <button class="btn btn-ghost  filter-btn" data-filter="good"       onclick="AdminActions.filterStudents('good')">✅ ดี</button>
            <button class="btn btn-ghost  filter-btn" data-filter="risk"       onclick="AdminActions.filterStudents('risk')">⚠️ เสี่ยง</button>
          </div>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th><th>นักเรียน</th><th>ความก้าวหน้า</th>
                <th>คะแนน</th><th>ใบงาน</th><th>เข้าเรียน</th>
                <th>XP</th><th>สถานะ / ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="admin-student-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB: Grade -->
    <div id="admin-tab-grade" class="admin-tab-content" style="display:none">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📝 ใบงานรอตรวจ</div>
          <span class="badge badge-orange" id="pending-count">${ADMIN_DATA.pendingAssignments.length} รายการ</span>
        </div>
        <div id="admin-pending-list"></div>
      </div>
    </div>

    <!-- TAB: Lessons -->
    <div id="admin-tab-lessons" class="admin-tab-content" style="display:none">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 จัดการบทเรียน</div>
          <button class="btn btn-primary btn-sm" onclick="showAdminToast('เปิดฟอร์มเพิ่มบทเรียน','info')">+ เพิ่มบทเรียน</button>
        </div>
        <div id="admin-lessons-list"></div>
      </div>
    </div>

    <!-- TAB: Quizzes -->
    <div id="admin-tab-quizzes" class="admin-tab-content" style="display:none">
      <div class="card">
        <div class="card-header">
          <div class="card-title">❓ จัดการแบบทดสอบ</div>
          <button class="btn btn-primary btn-sm" onclick="showAdminToast('เปิดฟอร์มสร้างแบบทดสอบ','info')">+ สร้างข้อสอบ</button>
        </div>
        <div id="admin-quiz-list"></div>
      </div>
    </div>

    <!-- TAB: Reports -->
    <div id="admin-tab-reports" class="admin-tab-content" style="display:none">
      <div class="grid-2" style="gap:16px">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">ความก้าวหน้าแต่ละหน่วย (เฉลี่ยทั้งชั้น)</div>
          <div class="chart-bar-chart" id="admin-class-chart"></div>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">สัดส่วนสถานะนักเรียน</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
            <div class="comp-row">
              <div class="comp-name">เยี่ยม (Excellent)</div>
              <div class="comp-bar-wrap"><div class="comp-fill" style="width:9%;background:var(--green-400)"></div></div>
              <div class="comp-pct" style="color:var(--green-400)">3</div>
            </div>
            <div class="comp-row">
              <div class="comp-name">ดี (Good)</div>
              <div class="comp-bar-wrap"><div class="comp-fill" style="width:78%;background:var(--blue-400)"></div></div>
              <div class="comp-pct" style="color:var(--blue-400)">25</div>
            </div>
            <div class="comp-row">
              <div class="comp-name">เสี่ยง (At Risk)</div>
              <div class="comp-bar-wrap"><div class="comp-fill" style="width:13%;background:var(--red-400)"></div></div>
              <div class="comp-pct" style="color:var(--red-400)">4</div>
            </div>
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" onclick="AdminActions.exportReport('csv')">📥 Export CSV</button>
            <button class="btn btn-outline btn-sm" onclick="AdminActions.exportReport('pdf')">📥 Export PDF</button>
            <button class="btn btn-outline btn-sm" onclick="AdminActions.exportReport('xlsx')">📥 Export Excel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Alerts -->
    <div id="admin-tab-alerts" class="admin-tab-content" style="display:none">
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚠️ นักเรียนที่ต้องติดตาม</div>
          <button class="btn btn-outline-orange btn-sm" onclick="showAdminToast('ส่งแจ้งเตือนทุกคนแล้ว','success')">📨 แจ้งเตือนทั้งหมด</button>
        </div>
        <div id="admin-risk-list"></div>
      </div>
    </div>

    <!-- TAB: Announce -->
    <div id="admin-tab-announce" class="admin-tab-content" style="display:none">
      <div class="grid-2" style="gap:16px">
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">📢 สร้างประกาศใหม่</div>
          <div class="form-group mb-12">
            <label class="form-label">หัวข้อประกาศ</label>
            <input type="text" id="announce-title" class="form-input" placeholder="เช่น กำหนดส่งใบงาน...">
          </div>
          <div class="form-group mb-12">
            <label class="form-label">ระดับความสำคัญ</label>
            <select id="announce-priority" class="form-select">
              <option value="high">🔴 ด่วนมาก</option>
              <option value="medium" selected>🟡 ปกติ</option>
              <option value="low">🔵 ทั่วไป</option>
            </select>
          </div>
          <div class="form-group mb-16">
            <label class="form-label">เนื้อหา</label>
            <textarea id="announce-body" class="form-textarea" rows="5" placeholder="เขียนเนื้อหาประกาศ..."></textarea>
          </div>
          <button class="btn btn-primary btn-full" onclick="AdminActions.sendAnnouncement()">📢 ส่งประกาศ</button>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:14px">ประกาศที่ผ่านมา</div>
          <div id="admin-announcements"></div>
        </div>
      </div>
    </div>

  </div><!-- end page-content -->

  <!-- Grade Modal -->
  <div class="overlay" id="grade-modal" onclick="if(event.target===this)AdminActions.closeGradeModal()">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title" id="grade-modal-title">ตรวจใบงาน</div>
        <button class="modal-close" onclick="AdminActions.closeGradeModal()">✕</button>
      </div>
      <div id="grade-modal-body"></div>
    </div>
  </div>

  <!-- Student Detail Modal -->
  <div class="overlay" id="student-modal" onclick="if(event.target===this)AdminActions.closeStudentModal()">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title" id="student-modal-title">ข้อมูลนักเรียน</div>
        <button class="modal-close" onclick="AdminActions.closeStudentModal()">✕</button>
      </div>
      <div id="student-modal-body"></div>
    </div>
  </div>
  `;

  // Apply style fix for admin-tab-content visibility
  const style = document.createElement('style');
  style.textContent = `.admin-tab-content { display:none; } .admin-tab-content.active { display:block; animation:pageIn 0.2s ease; }`;
  document.head.appendChild(style);
}

// =====================================================
// OVERRIDE showPage to hook admin init
// =====================================================
const _origShowPage = (typeof showPage !== 'undefined') ? showPage : null;
if (typeof window !== 'undefined') {
  window._adminPageHooked = false;
  const _checkAdminInit = () => {
    if (ADMIN_STATE.currentTab === 'overview' && document.getElementById('page-admin')?.classList.contains('active')) {
      if (!window._adminPageHooked) {
        window._adminPageHooked = true;
        setTimeout(initAdminPage, 50);
      }
    }
  };
  document.addEventListener('click', _checkAdminInit, { passive: true });
}

// Also init via MutationObserver for SPA navigation
if (typeof MutationObserver !== 'undefined') {
  const adminObserver = new MutationObserver(() => {
    const adminEl = document.getElementById('page-admin');
    if (adminEl?.classList.contains('active') && !document.getElementById('admin-overview-stats')) {
      initAdminPage();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    if (main) adminObserver.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  });
}

// =====================================================
// EXPORT (for module compatibility)
// =====================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AdminUI, AdminActions, ADMIN_DATA, initAdminPage };
}
