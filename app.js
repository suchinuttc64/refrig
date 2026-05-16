/* =====================================================
   TECHVOC LMS — app.js
   Main application logic (Frontend)
   วิชา: ช่างแอร์และเครื่องทำความเย็น ปวช.1
   ===================================================== */

'use strict';

// =====================================================
// CONFIGURATION
// =====================================================
const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzNR9NSAVcGX0zUil1jprat4YY7uCdQeoz4ErWKgJmEOIvzuIBjG-OfpCHWL_N1nlYB/exec',
  VERSION: '2.1.0',
  XP_REWARDS: {
    watchVideo:     25,
    completeQuiz:   50,
    passQuiz:       100,
    submitAssignment: 80,
    completeReflection: 20,
    completeLab:    60,
    safetyCheck:    5,
    earnBadge:      150,
  },
  LEVEL_THRESHOLDS: [0, 500, 1200, 2000, 3000, 4500, 6000, 8000, 10000],
  LEVEL_NAMES: ['มือใหม่','ช่างฝึกหัด','เทคนิเชียน','ช่างผู้ชำนาญ','ผู้เชี่ยวชาญ','ปรมาจารย์','อาจารย์','ปรมาจารย์สูงสุด'],
};

// =====================================================
// APPLICATION STATE
// =====================================================
const STATE = {
  student: {
    id: 'STD001',
    name: 'นายสมชาย ใจดี',
    shortName: 'สมชาย',
    avatar: 'สช',
    section: '1/1',
    year: 1,
  },
  xp: 2450,
  level: 4,
  currentPage: 'dashboard',
  currentUnit: 5,
  selectedAnswers: {},
  safetyChecked: {},
  labRunning: false,
  labInterval: null,
  labTemp: 25.0,
  completedTopics: new Set([0, 1]),  // topic indices completed
  portfolioItems: [],
  reflections: [],
  attendance: {},
  notifications: [
    { id:1, text:'ใบงานที่ 9 ใกล้ครบกำหนด', time:'2 ชั่วโมงที่แล้ว', read: false },
    { id:2, text:'ครูให้ feedback ใบงานที่ 8', time:'เมื่อวาน', read: false },
    { id:3, text:'คุณได้รับป้าย Safety Champion!', time:'3 วันที่แล้ว', read: true },
  ],
};

// =====================================================
// DATA STORE
// =====================================================
const DATA = {
  units: [
    { id:1, title:'หลักการทำความเย็นเบื้องต้น', desc:'ทฤษฎีการถ่ายเทความร้อน วัฏจักรทำความเย็น หลักการอุณหพลศาสตร์', progress:100, status:'done', worksheets:2, videos:4, color:'var(--blue-400)', icon:'❄️',
      topics:['หลักการถ่ายเทความร้อน','วัฏจักรการทำความเย็น','สารทำความเย็น R134a','การประเมินผลก่อนเรียน'],
      objectives:['อธิบายหลักการทำความเย็นได้','คำนวณค่า COP ได้','ระบุสารทำความเย็นแต่ละประเภทได้'] },
    { id:2, title:'ส่วนประกอบระบบทำความเย็น', desc:'คอมเพรสเซอร์ คอนเดนเซอร์ อีวาโปเรเตอร์ วาล์วขยาย และอุปกรณ์เสริม', progress:100, status:'done', worksheets:2, videos:5, color:'var(--orange-400)', icon:'🔧',
      topics:['คอมเพรสเซอร์','คอนเดนเซอร์','อีวาโปเรเตอร์','วาล์วขยายและอุปกรณ์อื่น'],
      objectives:['ระบุส่วนประกอบทุกชิ้นได้','อธิบายหน้าที่แต่ละส่วนได้','บำรุงรักษาเบื้องต้นได้'] },
    { id:3, title:'สารทำความเย็น', desc:'ประเภทสารทำความเย็น R22 R410A R32 คุณสมบัติ การจัดการ', progress:100, status:'done', worksheets:2, videos:3, color:'var(--green-400)', icon:'🧪',
      topics:['ประเภทสารทำความเย็น','คุณสมบัติสาร','การเติมและปล่อยสาร','ความปลอดภัย'],
      objectives:['จำแนกสารทำความเย็นได้','เติมสารได้อย่างปลอดภัย','ทดสอบการรั่วได้'] },
    { id:4, title:'เครื่องมือวัดและทดสอบ', desc:'มัลติมิเตอร์ เกจวัดแรงดัน Clamp meter เทอร์โมมิเตอร์', progress:100, status:'done', worksheets:2, videos:4, color:'var(--purple-400)', icon:'⚡',
      topics:['มัลติมิเตอร์','เกจวัดความดัน','เทอร์โมมิเตอร์','Clamp meter'],
      objectives:['ใช้มัลติมิเตอร์วัดค่าไฟฟ้าได้','ใช้เกจวัดแรงดันได้','อ่านค่าและแปลความหมายได้'] },
    { id:5, title:'ระบบไฟฟ้าเครื่องทำความเย็น', desc:'วงจรไฟฟ้า คอมเพรสเซอร์ รีเลย์ คาปาซิเตอร์ เทอร์โมสตัท', progress:60, status:'active', worksheets:2, videos:5, color:'var(--teal-400)', icon:'🔌',
      topics:['วงจรไฟฟ้าพื้นฐาน','คอมเพรสเซอร์และมอเตอร์','รีเลย์และสตาร์ทเตอร์','คาปาซิเตอร์','เทอร์โมสตัท'],
      objectives:['อธิบายวงจรไฟฟ้าตู้เย็นได้','ทดสอบรีเลย์ได้','วัดค่าคาปาซิเตอร์ได้'] },
    { id:6, title:'การซ่อมบำรุงระบบ', desc:'การตรวจสอบ ล้างระบบ เติมสาร ทดสอบรั่ว', progress:0, status:'locked', worksheets:2, videos:4, color:'var(--pink-400)', icon:'🛠️',
      topics:['การตรวจสอบเบื้องต้น','การล้างระบบ','การเติมสารทำความเย็น','การทดสอบรั่ว'],
      objectives:['ตรวจสอบระบบได้','ล้างระบบได้','เติมสารทำความเย็นได้'] },
    { id:7, title:'การวิเคราะห์และแก้ไขปัญหา', desc:'ขั้นตอนการแก้ปัญหา การวินิจฉัยความผิดปกติ กรณีศึกษา', progress:0, status:'locked', worksheets:2, videos:6, color:'#ff5722', icon:'🔍',
      topics:['หลักการวินิจฉัยปัญหา','อาการผิดปกติและสาเหตุ','ขั้นตอนแก้ไข','กรณีศึกษา'],
      objectives:['วินิจฉัยปัญหาได้','แก้ไขปัญหาเบื้องต้นได้','เขียนรายงานการซ่อมได้'] },
    { id:8, title:'โปรเจกต์สิ้นปี', desc:'ออกแบบและบำรุงรักษาระบบทำความเย็นจริง นำเสนอผลงาน', progress:0, status:'locked', worksheets:2, videos:3, color:'var(--amber-400)', icon:'🏆',
      topics:['วางแผนโปรเจกต์','การออกแบบระบบ','การติดตั้งและทดสอบ','นำเสนอผลงาน'],
      objectives:['วางแผนโปรเจกต์ได้','ออกแบบระบบได้','นำเสนอผลงานได้'] },
  ],

  assignments: [
    { id:1,  unit:1, title:'ใบงานที่ 1 — วาดวัฏจักรการทำความเย็น', due:'1 ม.ค. 68', status:'graded', score:92, icon:'📐', desc:'วาดและอธิบายวัฏจักรการทำความเย็นแบบอัดไอ' },
    { id:2,  unit:1, title:'ใบงานที่ 2 — คำนวณค่าสัมประสิทธิ์ COP', due:'8 ม.ค. 68', status:'graded', score:85, icon:'🧮', desc:'คำนวณค่า COP ของระบบทำความเย็น' },
    { id:3,  unit:2, title:'ใบงานที่ 3 — ระบุส่วนประกอบระบบ', due:'15 ม.ค. 68', status:'graded', score:90, icon:'🔧', desc:'ระบุและอธิบายส่วนประกอบทุกชิ้น' },
    { id:4,  unit:2, title:'ใบงานที่ 4 — บำรุงรักษาคอมเพรสเซอร์', due:'22 ม.ค. 68', status:'graded', score:88, icon:'⚙️', desc:'เขียนแผนการบำรุงรักษาคอมเพรสเซอร์' },
    { id:5,  unit:3, title:'ใบงานที่ 5 — จำแนกสารทำความเย็น', due:'1 ก.พ. 68', status:'graded', score:95, icon:'🧪', desc:'จำแนกสารทำความเย็นตามประเภท' },
    { id:6,  unit:3, title:'ใบงานที่ 6 — การเติมสารและทดสอบ', due:'8 ก.พ. 68', status:'graded', score:78, icon:'🔩', desc:'ปฏิบัติการเติมสารทำความเย็น' },
    { id:7,  unit:4, title:'ใบงานที่ 7 — การใช้มัลติมิเตอร์', due:'15 ก.พ. 68', status:'graded', score:82, icon:'⚡', desc:'วัดค่าความต้านทาน แรงดัน กระแส' },
    { id:8,  unit:4, title:'ใบงานที่ 8 — การวัดแรงดันระบบ', due:'22 ก.พ. 68', status:'submitted', icon:'📊', desc:'วัดและบันทึกแรงดันระบบทำความเย็น', feedback:'อยู่ระหว่างตรวจ' },
    { id:9,  unit:5, title:'ใบงานที่ 9 — การวิเคราะห์วงจรไฟฟ้า', due:'14 พ.ค. 68', status:'pending', icon:'🔌', desc:'วิเคราะห์วงจรไฟฟ้าของตู้เย็น' },
    { id:10, unit:5, title:'ใบงานที่ 10 — ทดสอบรีเลย์คอมเพรสเซอร์', due:'21 พ.ค. 68', status:'pending', icon:'🔘', desc:'ทดสอบและบันทึกค่ารีเลย์' },
    { id:11, unit:6, title:'ใบงานที่ 11 — แผนการบำรุงรักษา', due:'ยังไม่เปิด', status:'locked', icon:'📋', desc:'จัดทำแผนการบำรุงรักษา PM' },
    { id:12, unit:6, title:'ใบงานที่ 12 — รายงานการล้างระบบ', due:'ยังไม่เปิด', status:'locked', icon:'📄', desc:'รายงานการล้างระบบทำความเย็น' },
    { id:13, unit:7, title:'ใบงานที่ 13 — วิเคราะห์กรณีศึกษา', due:'ยังไม่เปิด', status:'locked', icon:'🔍', desc:'วิเคราะห์กรณีศึกษาการแก้ไขปัญหา' },
    { id:14, unit:7, title:'ใบงานที่ 14 — แผนผังการแก้ปัญหา', due:'ยังไม่เปิด', status:'locked', icon:'📌', desc:'สร้าง Flowchart การแก้ปัญหา' },
    { id:15, unit:8, title:'ใบงานที่ 15 — รายงานโปรเจกต์', due:'ยังไม่เปิด', status:'locked', icon:'📁', desc:'รายงานโปรเจกต์สิ้นปี' },
    { id:16, unit:8, title:'ใบงานที่ 16 — นำเสนอผลงานสุดท้าย', due:'ยังไม่เปิด', status:'locked', icon:'🎤', desc:'นำเสนอโปรเจกต์ต่ออาจารย์และเพื่อน' },
  ],

  quizzes: {
    unit5: [
      { q:'ส่วนประกอบใดทำหน้าที่อัดสารทำความเย็น?', options:['คอนเดนเซอร์','คอมเพรสเซอร์','อีวาโปเรเตอร์','วาล์วขยาย'], answer:1 },
      { q:'หากวัดความต้านทานขดลวดได้ "∞" (OL) หมายความว่าอะไร?', options:['ทำงานปกติ','ขดลวดลัดวงจร','ขดลวดขาด','แรงดันต่ำ'], answer:2 },
      { q:'ค่าความจุคาปาซิเตอร์มีหน่วยเป็นอะไร?', options:['โอห์ม (Ω)','วัตต์ (W)','ไมโครฟารัด (μF)','แอมแปร์ (A)'], answer:2 },
      { q:'ขั้นตอนแรกก่อนซ่อมระบบไฟฟ้าตู้เย็นคืออะไร?', options:['วัดคาปาซิเตอร์','ตัดไฟและล็อกสวิตช์','เติมสารทำความเย็น','ตรวจสอบอุณหภูมิ'], answer:1 },
      { q:'รีเลย์คอมเพรสเซอร์ทำหน้าที่อะไร?', options:['ควบคุมอุณหภูมิ','ช่วยสตาร์ทคอมเพรสเซอร์','กรองสารทำความเย็น','วัดแรงดัน'], answer:1 },
    ],
  },

  students: [
    {id:'STD001', name:'นายสมชาย ใจดี',      progress:68, score:78, assignments:11, xp:2450, status:'good',      avatar:'สช', color:'#1565c0'},
    {id:'STD002', name:'นางสาวพิมพ์ใจ รัก',  progress:75, score:82, assignments:12, xp:2780, status:'good',      avatar:'พร', color:'#880e4f'},
    {id:'STD003', name:'นายประเสริฐ ดีมาก',  progress:90, score:91, assignments:15, xp:3420, status:'excellent', avatar:'ปด', color:'#1b5e20'},
    {id:'STD004', name:'นางสาวสุดใจ มี',      progress:45, score:62, assignments:8,  xp:1640, status:'risk',      avatar:'สม', color:'#4e342e'},
    {id:'STD005', name:'นายวิชัย ชาญ',        progress:83, score:88, assignments:14, xp:3100, status:'good',      avatar:'วช', color:'#4a148c'},
    {id:'STD006', name:'นางสาวอรุณี สว่าง',   progress:30, score:55, assignments:6,  xp:1200, status:'risk',      avatar:'อส', color:'#006064'},
    {id:'STD007', name:'นายสิทธิชัย กล้า',    progress:72, score:79, assignments:12, xp:2200, status:'good',      avatar:'สก', color:'#e65100'},
    {id:'STD008', name:'นางสาวรุ่งทิพย์ งาม', progress:65, score:75, assignments:11, xp:1950, status:'good',      avatar:'รง', color:'#00695c'},
  ],

  badges: [
    { id:'apprentice', name:'ช่างฝึกหัด',  emoji:'🔧', earned:true,  desc:'เสร็จหน่วยแรก' },
    { id:'electric',   name:'นักไฟฟ้า',    emoji:'⚡', earned:true,  desc:'ผ่านแบบทดสอบหน่วยที่ 4' },
    { id:'expert',     name:'ผู้เชี่ยวชาญ',emoji:'❄️', earned:true,  desc:'ผ่านหน่วยที่ 1-3' },
    { id:'safety',     name:'Safety Champion',emoji:'🛡️',earned:true, desc:'ผ่านการฝึกความปลอดภัย' },
    { id:'analyst',    name:'นักวิเคราะห์',emoji:'🔍', earned:true,  desc:'ผ่านใบงานที่ 1-8' },
    { id:'speedster',  name:'ผู้เรียนเร็ว', emoji:'⚡', earned:false, desc:'ส่งงานก่อนกำหนด 5 ครั้ง' },
    { id:'master',     name:'ปรมาจารย์',   emoji:'🏆', earned:false, desc:'เสร็จหน่วยทั้งหมด' },
    { id:'project',    name:'Project Star', emoji:'⭐', earned:false, desc:'ผ่านโปรเจกต์สิ้นปี' },
  ],

  competencies: [
    { name:'หลักการทำความเย็น', pct:95, color:'#4caf50' },
    { name:'ส่วนประกอบระบบ',    pct:90, color:'#2196f3' },
    { name:'สารทำความเย็น',     pct:88, color:'#00bcd4' },
    { name:'เครื่องมือวัด',     pct:82, color:'#9c27b0' },
    { name:'ระบบไฟฟ้า',         pct:65, color:'#ff9800' },
    { name:'การซ่อมบำรุง',      pct:40, color:'#f44336' },
    { name:'การแก้ปัญหา',       pct:30, color:'#795548' },
    { name:'ความปลอดภัย',       pct:92, color:'#009688' },
  ],

  portfolio: [
    { title:'รายงานวัฏจักรทำความเย็น', icon:'📄', type:'PDF', date:'10 ม.ค. 68', unit:1 },
    { title:'วิดีโอการวัดค่าไฟฟ้า',   icon:'🎥', type:'VDO', date:'18 ก.พ. 68', unit:4 },
    { title:'แผนผังวงจรไฟฟ้าตู้เย็น', icon:'📐', type:'IMG', date:'5 มี.ค. 68',  unit:5 },
    { title:'โปรเจกต์ตรวจสอบระบบ',  icon:'🔧', type:'PDF', date:'20 มี.ค. 68', unit:4 },
    { title:'สมุดบันทึกการปฏิบัติ',   icon:'📓', type:'PDF', date:'1 เม.ย. 68',  unit:5 },
    { title:'ภาพถ่ายการบำรุงรักษา',  icon:'📷', type:'IMG', date:'15 เม.ย. 68', unit:6 },
  ],

  safety: [
    { title:'ความปลอดภัยทางไฟฟ้า', icon:'⚡', checks:[
      'ตัดไฟฟ้าก่อนเริ่มทำงานทุกครั้ง',
      'สวมถุงมือยางกันไฟเมื่อทำงานกับระบบไฟฟ้า',
      'ตรวจสอบสายดินให้ครบถ้วน',
      'ห้ามทำงานคนเดียวกับระบบไฟแรงสูง',
      'ติดป้ายเตือน "อย่าเปิดสวิตช์" ระหว่างซ่อม',
    ]},
    { title:'ความปลอดภัยกับสารทำความเย็น', icon:'❄️', checks:[
      'สวมแว่นนิรภัยและถุงมือเมื่อจัดการสาร',
      'ทำงานในพื้นที่อากาศถ่ายเทได้สะดวก',
      'เก็บสารให้ห่างจากแหล่งความร้อน',
      'รู้วิธีปฐมพยาบาลเมื่อสัมผัสสาร',
      'ไม่สูดดมสารทำความเย็นโดยตรง',
    ]},
    { title:'อุปกรณ์ป้องกันส่วนบุคคล (PPE)', icon:'🦺', checks:[
      'สวมชุด PPE ครบก่อนเริ่มปฏิบัติงาน',
      'ใส่รองเท้านิรภัยตลอดเวลา',
      'สวมหมวกแข็งในพื้นที่ก่อสร้าง',
      'ใช้แว่นตานิรภัยเมื่อตัดหรือเจาะ',
      'ตรวจสอบสภาพ PPE ก่อนใช้งาน',
    ]},
  ],

  weekScores: [45, 62, 58, 75, 80, 72, 85],
  weekLabels: ['จ','อ','พ','พฤ','ศ','ส','อา'],

  pastReflections: [
    { date:'13 พ.ค. 68', topic:'หน่วย 5 — วงจรไฟฟ้า', learned:'เรียนรู้การวัดค่าด้วยมัลติมิเตอร์ ฝึกการต่อวงจรง่าย' },
    { date:'12 พ.ค. 68', topic:'หน่วย 4 — เครื่องมือวัด', learned:'เข้าใจวิธีการใช้เกจวัดแรงดัน อ่านค่าได้แม่นยำขึ้น' },
    { date:'10 พ.ค. 68', topic:'หน่วย 4 — การทดสอบ', learned:'ทดสอบคาปาซิเตอร์ด้วยมัลติมิเตอร์ได้ครั้งแรก' },
  ],
};

// =====================================================
// API SERVICE (Google Apps Script)
// =====================================================
const API = {
  async post(action, payload = {}) {
    try {
      const body = JSON.stringify({ action, studentId: STATE.student.id, ...payload });
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Offline or error:', err.message);
      return { success: false, offline: true };
    }
  },

  async saveProgress(unitId, topicIdx, percent) {
    return this.post('saveProgress', { unitId, topicIdx, percent });
  },

  async submitAssignment(assignmentId, files) {
    return this.post('submitAssignment', { assignmentId, files });
  },

  async saveQuizScore(unitId, score, total) {
    return this.post('saveQuizScore', { unitId, score, total });
  },

  async saveReflection(unitId, answers) {
    return this.post('saveReflection', { unitId, answers });
  },

  async saveAttendance() {
    return this.post('saveAttendance', { date: new Date().toISOString() });
  },

  async getStudentData() {
    return this.post('getStudentData');
  },
};

// =====================================================
// XP & LEVEL SYSTEM
// =====================================================
const XPSystem = {
  add(amount, reason = '') {
    STATE.xp += amount;
    this.updateDisplays();
    UI.showXPToast(amount, reason);
    this.checkLevelUp();
    // Auto-save to backend
    API.post('updateXP', { xp: STATE.xp, reason, amount });
  },

  getCurrentLevel() {
    const thresholds = CONFIG.LEVEL_THRESHOLDS;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (STATE.xp >= thresholds[i]) return i + 1;
    }
    return 1;
  },

  getProgressToNext() {
    const level = this.getCurrentLevel();
    const cur = CONFIG.LEVEL_THRESHOLDS[level - 1] || 0;
    const nxt = CONFIG.LEVEL_THRESHOLDS[level] || CONFIG.LEVEL_THRESHOLDS[CONFIG.LEVEL_THRESHOLDS.length - 1];
    return Math.min(((STATE.xp - cur) / (nxt - cur)) * 100, 100);
  },

  checkLevelUp() {
    const newLevel = this.getCurrentLevel();
    if (newLevel > STATE.level) {
      STATE.level = newLevel;
      UI.showLevelUpModal(newLevel);
    }
  },

  updateDisplays() {
    document.querySelectorAll('.xp-display').forEach(el => el.textContent = STATE.xp.toLocaleString());
    const pct = this.getProgressToNext();
    document.querySelectorAll('.xp-progress-fill').forEach(el => el.style.width = pct + '%');
    document.querySelectorAll('.xp-progress-label').forEach(el => el.textContent = `${Math.round(pct)}%`);
  },
};

// =====================================================
// UI UTILITIES
// =====================================================
const UI = {
  showXPToast(amount, reason = '') {
    document.querySelectorAll('.xp-toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.textContent = `+${amount} XP ⚡${reason ? ' — ' + reason : ''}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  showLevelUpModal(level) {
    const name = CONFIG.LEVEL_NAMES[level - 1] || `ระดับ ${level}`;
    UI.showToast(`🎉 เลื่อนระดับ! คุณเป็น ${name} แล้ว!`, 'success', 4000);
  },

  showToast(message, type = 'info', duration = 2500) {
    const colors = { info:'var(--blue-600)', success:'var(--green-600)', warning:'var(--orange-600)', error:'var(--red-600)' };
    document.querySelectorAll('.app-toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    Object.assign(toast.style, {
      position:'fixed', top:'78px', right:'18px', zIndex:'301',
      background: colors[type] || colors.info,
      color:'#fff', padding:'10px 18px',
      borderRadius:'var(--radius-md)', fontSize:'0.85rem', fontWeight:'600',
      boxShadow:'0 4px 16px rgba(0,0,0,0.4)',
      animation:'toastIn 0.3s ease',
    });
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  showBadgeEarned(badgeId) {
    const badge = DATA.badges.find(b => b.id === badgeId);
    if (!badge || badge.earned) return;
    badge.earned = true;
    XPSystem.add(CONFIG.XP_REWARDS.earnBadge, `ป้าย ${badge.name}`);
    UI.showToast(`🏅 ได้รับป้าย: ${badge.emoji} ${badge.name}!`, 'success', 4000);
  },

  confirm(message) {
    return window.confirm(message);
  },
};

// =====================================================
// ROUTER / PAGE MANAGER
// =====================================================
const Router = {
  pageTitles: {
    dashboard:'แดชบอร์ด', lesson:'บทเรียน', units:'หน่วยการเรียน',
    assignments:'ใบงาน', portfolio:'แฟ้มสะสมผลงาน', progress:'ความก้าวหน้า',
    safety:'ความปลอดภัย', reflection:'บันทึกสะท้อนคิด', certificates:'ประกาศนียบัตร',
    leaderboard:'การจัดอันดับ', admin:'แผงผู้สอน', analytics:'วิเคราะห์การเรียน',
    virtuallab:'ห้องปฏิบัติการเสมือน',
  },

  go(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('page-' + page);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick')?.includes(`'${page}'`)) n.classList.add('active');
    });
    const title = this.pageTitles[page] || page;
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = title;
    STATE.currentPage = page;
    PageRenderers.render(page);
    document.getElementById('sidebar')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ page }, title, '#' + page);
  },
};

// =====================================================
// PAGE RENDERERS
// =====================================================
const PageRenderers = {
  rendered: new Set(),

  render(page) {
    // Render on every visit (data may change)
    const map = {
      dashboard:    () => this.dashboard(),
      units:        () => this.units(),
      assignments:  () => this.assignments(),
      portfolio:    () => this.portfolio(),
      progress:     () => this.progress(),
      safety:       () => this.safety(),
      analytics:    () => this.analytics(),
      leaderboard:  () => this.leaderboard(),
      reflection:   () => this.reflection(),
      lesson:       () => this.lesson(),
    };
    if (map[page]) map[page]();
  },

  dashboard() {
    Render.leaderboardMini();
    Render.progressBarsAnimate();
  },

  units() {
    const container = document.getElementById('units-full-list');
    if (!container) return;
    container.innerHTML = DATA.units.map(u => {
      const statusIcon = u.status === 'done' ? '✅' : u.status === 'active' ? '📖' : '🔒';
      const borderColor = u.status === 'done' ? 'var(--green-400)' : u.status === 'active' ? 'var(--blue-400)' : 'rgba(255,255,255,0.1)';
      const prog = u.status === 'done' ? 'prog-green' : 'prog-blue';
      return `
        <div class="assignment-card" style="border-left:4px solid ${borderColor};opacity:${u.status==='locked'?0.55:1}" onclick="${u.status!=='locked'?`openUnitModal(${u.id})`:''}">
          <div class="assignment-icon" style="background:rgba(33,150,243,0.1);font-size:1.4rem">${statusIcon}</div>
          <div style="flex:1">
            <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:3px">หน่วยที่ ${u.id}</div>
            <div class="assignment-title">${u.title}</div>
            <div class="assignment-meta">${u.desc}</div>
            <div style="margin-top:8px;display:flex;gap:7px;flex-wrap:wrap">
              <span class="tag">📝 ${u.worksheets} ใบงาน</span>
              <span class="tag">🎬 ${u.videos} วิดีโอ</span>
              <span class="tag">📖 ${u.topics.length} หัวข้อ</span>
            </div>
          </div>
          <div style="min-width:130px">
            <div class="progress-wrap">
              <div class="progress-label"><span>${u.status==='done'?'เสร็จสมบูรณ์':u.status==='active'?'กำลังเรียน':'ล็อค'}</span><span>${u.progress}%</span></div>
              <div class="progress-bar"><div class="progress-fill ${prog}" style="width:${u.progress}%"></div></div>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  assignments() {
    const container = document.getElementById('assignments-list');
    if (!container) return;
    const statusConfig = {
      graded:    { label: a => `✓ ตรวจแล้ว ${a.score}%`, badge:'badge-green' },
      submitted: { label: () => '📤 ส่งแล้ว รอตรวจ',   badge:'badge-blue' },
      pending:   { label: () => '⏰ รอส่ง',              badge:'badge-orange' },
      locked:    { label: () => '🔒 ยังไม่เปิด',         badge:'badge-gray' },
    };
    container.innerHTML = DATA.assignments.map(a => {
      const s = statusConfig[a.status];
      const locked = a.status === 'locked';
      return `
        <div class="assignment-card" style="opacity:${locked?0.5:1};cursor:${locked?'not-allowed':'pointer'}"
             onclick="${!locked?`openAssignmentModal(${a.id})`:''}">
          <div class="assignment-icon" style="background:rgba(33,150,243,0.1)">${a.icon}</div>
          <div style="flex:1">
            <div class="assignment-title">${a.title}</div>
            <div class="assignment-meta">หน่วยที่ ${a.unit} • ครบกำหนด: ${a.due}</div>
            <div class="assignment-meta" style="margin-top:4px">${a.desc}</div>
            <div style="margin-top:8px"><span class="badge ${s.badge}">${s.label(a)}</span></div>
          </div>
          ${a.status === 'pending' ? `<button class="btn btn-primary btn-sm" style="align-self:center" onclick="event.stopPropagation();submitAssignment(${a.id})">ส่งงาน</button>` : ''}
        </div>`;
    }).join('');
  },

  portfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    const typeBg = { PDF:'rgba(244,67,54,0.08)', VDO:'rgba(33,150,243,0.08)', IMG:'rgba(76,175,80,0.08)' };
    grid.innerHTML = DATA.portfolio.map(p => `
      <div class="portfolio-card" onclick="openPortfolioItem('${p.title}')">
        <div class="portfolio-thumb" style="background:${typeBg[p.type]||'var(--bg-card2)'}">
          <span>${p.icon}</span>
          <span class="portfolio-thumb-badge"><span class="badge badge-blue">${p.type}</span></span>
        </div>
        <div class="portfolio-body">
          <div class="portfolio-title">${p.title}</div>
          <div class="portfolio-meta">📅 ${p.date} • หน่วยที่ ${p.unit}</div>
        </div>
      </div>`).join('');
  },

  progress() {
    // Bar chart
    const chart = document.getElementById('week-chart');
    if (chart && !chart.dataset.rendered) {
      chart.dataset.rendered = '1';
      chart.innerHTML = DATA.weekScores.map((s, i) => `
        <div class="chart-bar-wrap">
          <div class="chart-bar" style="height:${Math.round((s / 100) * 155)}px" title="${s}%"></div>
          <div class="chart-bar-lbl">${DATA.weekLabels[i]}</div>
        </div>`).join('');
    }
    // Competency matrix
    const cm = document.getElementById('comp-matrix');
    if (cm && !cm.dataset.rendered) {
      cm.dataset.rendered = '1';
      cm.innerHTML = DATA.competencies.map(c => `
        <div class="comp-row">
          <div class="comp-name">${c.name}</div>
          <div class="comp-bar-wrap">
            <div class="comp-fill" style="width:0%;background:${c.color}" data-pct="${c.pct}"></div>
          </div>
          <div class="comp-pct" style="color:${c.color}">${c.pct}%</div>
        </div>`).join('');
      setTimeout(() => {
        document.querySelectorAll('.comp-fill[data-pct]').forEach(el => {
          el.style.width = el.dataset.pct + '%';
        });
      }, 100);
    }
    // Unit progress list
    const upl = document.getElementById('unit-progress-list');
    if (upl && !upl.dataset.rendered) {
      upl.dataset.rendered = '1';
      upl.innerHTML = DATA.units.map(u => `
        <div class="progress-wrap">
          <div class="progress-label">
            <span>หน่วย ${u.id}: ${u.title}</span>
            <span style="color:${u.progress===100?'var(--green-400)':u.progress>0?'var(--blue-400)':'var(--text-muted)'}">${u.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${u.progress===100?'prog-green':'prog-blue'}" style="width:${u.progress}%"></div>
          </div>
        </div>`).join('');
    }
  },

  safety() {
    const list = document.getElementById('safety-list');
    if (!list) return;
    list.innerHTML = DATA.safety.map((s, si) => `
      <div class="safety-card">
        <div class="safety-header">
          <div class="safety-icon">${s.icon}</div>
          <div class="safety-title">${s.title}</div>
        </div>
        <div>
          ${s.checks.map((c, ci) => {
            const key = `${si}-${ci}`;
            const checked = STATE.safetyChecked[key];
            return `
              <div class="safety-check-item ${checked ? 'checked' : ''}" onclick="toggleSafetyCheck('${key}', this)">
                <div class="safety-checkbox ${checked ? 'checked' : ''}" id="sc-${key}">${checked ? '✓' : ''}</div>
                <span>${c}</span>
              </div>`;
          }).join('')}
        </div>
      </div>`).join('');
  },

  analytics() {
    const tbody = document.getElementById('student-table-body');
    if (!tbody) return;
    const statusLabel = { excellent:'⭐ เยี่ยม', good:'✅ ดี', risk:'⚠️ เสี่ยง' };
    const statusBadge = { excellent:'badge-green', good:'badge-blue', risk:'badge-orange' };
    tbody.innerHTML = DATA.students.map((s, i) => `
      <tr>
        <td style="font-weight:700;color:var(--text-muted)">${i + 1}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:28px;height:28px;border-radius:50%;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#fff;flex-shrink:0">${s.avatar}</div>
            <strong style="font-size:0.82rem">${s.name}</strong>
          </div>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar" style="width:80px;display:inline-block">
              <div class="progress-fill prog-blue" style="width:${s.progress}%"></div>
            </div>
            <span style="font-size:0.72rem;color:var(--text-muted)">${s.progress}%</span>
          </div>
        </td>
        <td style="font-weight:600">${s.score}%</td>
        <td>${s.assignments}/16</td>
        <td style="color:var(--orange-400);font-weight:700;font-family:var(--font-mono)">${s.xp.toLocaleString()}</td>
        <td><span class="badge ${statusBadge[s.status]}">${statusLabel[s.status]}</span></td>
      </tr>`).join('');
  },

  leaderboard() {
    const container = document.getElementById('full-leaderboard');
    if (!container) return;
    const sorted = [...DATA.students].sort((a, b) => b.xp - a.xp);
    container.innerHTML = sorted.map((s, i) => {
      const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
      return `
        <div class="leaderboard-item">
          <div class="lb-rank ${rankClass}">${medal || `#${i + 1}`}</div>
          <div class="lb-avatar" style="background:${s.color}">${s.avatar}</div>
          <div class="lb-name">${s.name}</div>
          <div class="lb-level">Lv.${Math.max(1, Math.floor(s.xp / 800))}</div>
          <div class="lb-xp">${s.xp.toLocaleString()} XP</div>
        </div>`;
    }).join('');
  },

  reflection() {
    const container = document.getElementById('past-reflections');
    if (!container) return;
    container.innerHTML = DATA.pastReflections.map(r => `
      <div style="padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <div style="font-size:0.8rem;font-weight:600">${r.topic}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">${r.date}</div>
        </div>
        <div style="font-size:0.78rem;color:var(--text-secondary)">${r.learned}</div>
      </div>`).join('');
  },

  lesson() {
    Render.topicsList();
    Render.quizQuestions();
  },
};

// =====================================================
// RENDER HELPERS
// =====================================================
const Render = {
  leaderboardMini() {
    const container = document.getElementById('leaderboard-mini');
    if (!container) return;
    const sorted = [...DATA.students].sort((a, b) => b.xp - a.xp).slice(0, 5);
    container.innerHTML = sorted.map((s, i) => {
      const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
      return `
        <div class="leaderboard-item">
          <div class="lb-rank ${rankClass}" style="font-size:0.78rem">${medal || `#${i + 1}`}</div>
          <div class="lb-avatar" style="background:${s.color};width:28px;height:28px;font-size:0.65rem">${s.avatar}</div>
          <div class="lb-name" style="font-size:0.78rem">${s.name}</div>
          <div class="lb-xp" style="font-size:0.78rem">${s.xp.toLocaleString()}</div>
        </div>`;
    }).join('');
  },

  topicsList() {
    const el = document.getElementById('topics-list');
    if (!el) return;
    const unit = DATA.units.find(u => u.id === STATE.currentUnit);
    if (!unit) return;
    el.innerHTML = unit.topics.map((t, i) => {
      const done = STATE.completedTopics.has(i);
      const active = i === STATE.completedTopics.size;
      return `
        <div class="topic-item ${done ? 'done' : ''} ${active ? 'active' : ''}" onclick="selectTopic(${i})">
          <div class="topic-num" style="${done ? 'background:var(--green-600);border-color:var(--green-600);color:#fff' : ''}">
            ${done ? '✓' : i + 1}
          </div>
          <div class="topic-info">
            <div class="topic-name">${t}</div>
            <div class="topic-dur">${[12, 15, 18, 10, 8][i] || 10} นาที</div>
          </div>
        </div>`;
    }).join('');
  },

  quizQuestions() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    const questions = DATA.quizzes['unit' + STATE.currentUnit] || DATA.quizzes.unit5;
    STATE.selectedAnswers = {};
    container.innerHTML = questions.map((q, i) => `
      <div class="quiz-question">
        <div class="q-num">ข้อที่ ${i + 1} จาก ${questions.length}</div>
        <div class="q-text">${q.q}</div>
        <div class="q-options">
          ${q.options.map((o, j) => `
            <div class="q-option" id="q${i}-opt${j}" onclick="selectQuizAnswer(${i}, ${j})">
              <div class="q-radio"></div> ${o}
            </div>`).join('')}
        </div>
      </div>`).join('');
  },

  progressBarsAnimate() {
    setTimeout(() => {
      document.querySelectorAll('.progress-fill[style*="width"]').forEach(el => {
        const target = el.style.width;
        el.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { el.style.width = target; });
        });
      });
    }, 50);
  },
};

// =====================================================
// QUIZ LOGIC
// =====================================================
function selectQuizAnswer(qIdx, optIdx) {
  STATE.selectedAnswers[qIdx] = optIdx;
  const questions = DATA.quizzes['unit' + STATE.currentUnit] || DATA.quizzes.unit5;
  questions[qIdx].options.forEach((_, j) => {
    const el = document.getElementById(`q${qIdx}-opt${j}`);
    if (el) el.classList.toggle('selected', j === optIdx);
  });
}

function submitQuiz() {
  const questions = DATA.quizzes['unit' + STATE.currentUnit] || DATA.quizzes.unit5;
  let correct = 0;
  questions.forEach((q, i) => {
    if (STATE.selectedAnswers[i] === q.answer) correct++;
    q.options.forEach((_, j) => {
      const el = document.getElementById(`q${i}-opt${j}`);
      if (!el) return;
      el.classList.remove('selected');
      if (j === q.answer) el.classList.add('correct');
      else if (j === STATE.selectedAnswers[i]) el.classList.add('wrong');
    });
  });

  const pct = Math.round((correct / questions.length) * 100);
  const passed = pct >= 60;
  const xpEarned = passed ? CONFIG.XP_REWARDS.passQuiz + Math.round((pct - 60) * 3) : CONFIG.XP_REWARDS.completeQuiz;
  XPSystem.add(xpEarned, 'แบบทดสอบ');
  API.saveQuizScore(STATE.currentUnit, correct, questions.length);

  const modal = document.getElementById('quiz-result-modal');
  const content = document.getElementById('quiz-result-content');
  if (content) {
    content.innerHTML = `
      <div style="font-size:3rem;margin-bottom:12px">${pct >= 80 ? '🏆' : pct >= 60 ? '✅' : '📚'}</div>
      <div style="font-size:1.35rem;font-weight:700;margin-bottom:8px">${pct >= 80 ? 'ยอดเยี่ยม!' : pct >= 60 ? 'ผ่านแล้ว!' : 'ต้องปรับปรุง'}</div>
      <div style="font-size:2.5rem;font-weight:700;color:var(--blue-400);margin-bottom:8px">${pct}%</div>
      <div style="color:var(--text-secondary);font-size:0.9rem">ตอบถูก ${correct} จาก ${questions.length} ข้อ</div>
      <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <span class="badge badge-orange">+${xpEarned} XP</span>
        ${passed ? '<span class="badge badge-green">✓ ผ่านแล้ว</span>' : '<span class="badge badge-red">✗ ยังไม่ผ่าน</span>'}
      </div>`;
  }
  if (modal) modal.classList.add('open');
}

// =====================================================
// VIRTUAL LAB
// =====================================================
const Lab = {
  addLog(msg, type = 'normal') {
    const log = document.getElementById('lab-log');
    if (!log) return;
    const line = document.createElement('div');
    line.className = `lab-log-line ${type === 'warn' ? 'warn' : type === 'ok' ? 'ok' : type === 'err' ? 'err' : ''}`;
    line.textContent = `$ ${msg}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  },

  toggle() {
    const sw = document.getElementById('comp-switch');
    STATE.labRunning = sw ? sw.checked : !STATE.labRunning;
    const status = document.getElementById('power-status');
    const indicator = document.getElementById('comp-indicator');
    if (STATE.labRunning) {
      if (status) { status.textContent = 'ON'; status.style.color = '#4caf50'; }
      if (indicator) indicator.style.fill = '#4caf50';
      document.getElementById('voltage-val') && (document.getElementById('voltage-val').textContent = '220');
      document.getElementById('current-val') && (document.getElementById('current-val').textContent = '4.8');
      this.addLog('เริ่มระบบ — แรงดัน 220V / กระแส 4.8A / มอเตอร์หมุน', 'ok');
      this.startAnimation();
      XPSystem.add(10, 'เปิดแล็บ');
    } else {
      if (status) { status.textContent = 'OFF'; status.style.color = '#f44336'; }
      if (indicator) indicator.style.fill = '#333';
      ['voltage-val','current-val','real-temp'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = '--';
      });
      this.addLog('หยุดระบบ', 'warn');
      this.stopAnimation();
    }
  },

  startAnimation() {
    STATE.labTemp = 25;
    let t = 0;
    if (STATE.labInterval) clearInterval(STATE.labInterval);
    STATE.labInterval = setInterval(() => {
      t += 0.04;
      const flow1 = document.getElementById('flow1');
      const flow2 = document.getElementById('flow2');
      const realTemp = document.getElementById('real-temp');
      if (flow1) {
        const p = t % 1;
        if (p < 0.5) {
          flow1.setAttribute('cx', 140 + (270 - 140) * (p / 0.5));
          flow1.setAttribute('cy', 110 + (100 - 110) * (p / 0.5));
        } else {
          flow1.setAttribute('cx', 270);
          flow1.setAttribute('cy', 100 + (65 - 100) * ((p - 0.5) / 0.5));
        }
      }
      if (flow2) {
        const p2 = (t + 0.5) % 1;
        if      (p2 < 0.25) { flow2.setAttribute('cx', 270); flow2.setAttribute('cy', 205 + (240 - 205) * (p2 / 0.25)); }
        else if (p2 < 0.5)  { flow2.setAttribute('cx', 270 + (90 - 270) * ((p2 - 0.25) / 0.25)); flow2.setAttribute('cy', 240); }
        else                 { flow2.setAttribute('cx', 90); flow2.setAttribute('cy', 240 + (170 - 240) * ((p2 - 0.5) / 0.5)); }
      }
      if (STATE.labTemp > 5) STATE.labTemp -= 0.03;
      if (realTemp) realTemp.textContent = STATE.labTemp.toFixed(1);
    }, 50);
  },

  stopAnimation() {
    if (STATE.labInterval) { clearInterval(STATE.labInterval); STATE.labInterval = null; }
  },

  measureVoltage() {
    if (!STATE.labRunning) { this.addLog('⚠️ ระบบปิด — เปิดระบบก่อนวัด', 'warn'); return; }
    const v = (219 + Math.random() * 4).toFixed(1);
    this.addLog(`วัดแรงดัน AC ที่ขั้ว L-N: ${v}V — สถานะ: ปกติ ✓`, 'ok');
    XPSystem.add(CONFIG.XP_REWARDS.completeLab / 4, 'วัดแรงดัน');
  },

  measureCurrent() {
    if (!STATE.labRunning) { this.addLog('⚠️ ระบบปิด — เปิดระบบก่อนวัด', 'warn'); return; }
    const a = (4.5 + Math.random() * 0.8).toFixed(2);
    this.addLog(`วัดกระแส AC: ${a}A — โหลด: ปกติ ✓`, 'ok');
    XPSystem.add(CONFIG.XP_REWARDS.completeLab / 4, 'วัดกระแส');
  },

  testRelay() {
    this.addLog('ทดสอบรีเลย์...');
    setTimeout(() => {
      this.addLog('ขดลวดรีเลย์: 10.4Ω ✓ | หน้าสัมผัส: 0.0Ω ✓ — ปกติ', 'ok');
      XPSystem.add(CONFIG.XP_REWARDS.completeLab / 3, 'ทดสอบรีเลย์');
    }, 800);
  },

  testCapacitor() {
    this.addLog('ทดสอบคาปาซิเตอร์...');
    setTimeout(() => {
      const cap = (24.5 + Math.random() * 1.5).toFixed(1);
      this.addLog(`คาปาซิเตอร์: ${cap}μF (พิกัด 25μF ±5%) ✓`, 'ok');
      XPSystem.add(CONFIG.XP_REWARDS.completeLab / 3, 'ทดสอบคาปาซิเตอร์');
    }, 600);
  },

  injectFault() {
    if (!STATE.labRunning) { this.addLog('⚠️ เปิดระบบก่อน', 'warn'); return; }
    const faults = [
      { msg:'รีเลย์ขาด — คอมเพรสเซอร์ไม่ทำงาน', tip:'ทดแทนรีเลย์ใหม่ ตรวจสอบขั้วต่อ' },
      { msg:'คาปาซิเตอร์เสื่อม — มอเตอร์สตาร์ทไม่ได้', tip:'เปลี่ยนคาปาซิเตอร์ให้ตรงพิกัด' },
      { msg:'เทอร์โมสตัทขัดข้อง — ระบบเย็นไม่หยุด', tip:'ตรวจสอบและปรับค่าเทอร์โมสตัท' },
    ];
    const f = faults[Math.floor(Math.random() * faults.length)];
    this.addLog(`⚠️ จำลองความผิดปกติ: ${f.msg}`, 'warn');
    setTimeout(() => this.addLog(`💡 คำแนะนำ: ${f.tip}`, 'ok'), 1500);
    const v = document.getElementById('current-val'); if (v) v.textContent = '0.0';
    XPSystem.add(CONFIG.XP_REWARDS.completeLab / 2, 'วินิจฉัยปัญหา');
  },

  saveLog() {
    XPSystem.add(CONFIG.XP_REWARDS.completeLab, 'บันทึกผลแล็บ');
    this.addLog('บันทึกผลการทดลองเรียบร้อย ✓', 'ok');
    UI.showBadgeEarned('analyst');
  },
};

// =====================================================
// MODAL MANAGEMENT
// =====================================================
function openUnitModal(id) {
  const u = DATA.units.find(x => x.id === id);
  if (!u) return;
  const cycleSteps = ['แรงจูงใจ','ทฤษฎี','สาธิต','จำลอง','ฝึกปฏิบัติ','โปรเจกต์','สะท้อนคิด','ประเมิน','Feedback'];
  document.getElementById('modal-unit-title').textContent = `หน่วยที่ ${u.id} — ${u.title}`;
  document.getElementById('modal-unit-content').innerHTML = `
    <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;margin-bottom:14px">${u.desc}</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
      <span class="badge badge-blue">📝 ${u.worksheets} ใบงาน</span>
      <span class="badge badge-orange">🎬 ${u.videos} วิดีโอ</span>
      <span class="badge badge-purple">📖 ${u.topics.length} หัวข้อ</span>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:0.8rem;font-weight:600;margin-bottom:8px">🎯 จุดประสงค์การเรียนรู้</div>
      ${u.objectives.map(o => `<div style="font-size:0.78rem;color:var(--text-secondary);padding:4px 0;border-bottom:1px solid var(--border)">• ${o}</div>`).join('')}
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:0.8rem;font-weight:600;margin-bottom:8px">🔄 วงจรการเรียนรู้</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${cycleSteps.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    </div>
    <div style="margin-bottom:14px">
      <div style="font-size:0.8rem;font-weight:600;margin-bottom:8px">📚 หัวข้อการเรียน</div>
      ${u.topics.map((t, i) => `<div style="font-size:0.8rem;padding:6px 0;border-bottom:1px solid var(--border);color:var(--text-secondary)"><span style="color:var(--text-muted);margin-right:8px">${i+1}.</span>${t}</div>`).join('')}
    </div>
    <div style="margin-bottom:16px">
      <div class="progress-wrap">
        <div class="progress-label"><span>ความก้าวหน้า</span><span>${u.progress}%</span></div>
        <div class="progress-bar progress-bar-lg"><div class="progress-fill ${u.progress===100?'prog-green':'prog-blue'}" style="width:${u.progress}%"></div></div>
      </div>
    </div>
    <button class="btn btn-primary btn-full" onclick="closeModal();${u.status!=='locked'?`showPage('lesson')`:''}">
      ${u.status==='done'?'📖 ทบทวนบทเรียน':u.status==='active'?'▶ เรียนต่อ':'🔒 ต้องเสร็จหน่วยก่อนหน้า'}
    </button>`;
  document.getElementById('unit-modal').classList.add('open');
}

function openAssignmentModal(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;
  UI.showToast(`เปิดใบงาน: ${a.title}`, 'info');
}

function openPortfolioItem(title) {
  UI.showToast(`เปิด: ${title}`, 'info');
}

function closeModal() {
  document.querySelectorAll('.overlay').forEach(m => m.classList.remove('open'));
}

function closeQuizModal() {
  document.getElementById('quiz-result-modal')?.classList.remove('open');
}

// =====================================================
// MISC HANDLERS
// =====================================================
function showPage(page) { Router.go(page); }

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

function toggleSafetyCheck(key, row) {
  STATE.safetyChecked[key] = !STATE.safetyChecked[key];
  const cb = document.getElementById('sc-' + key);
  if (STATE.safetyChecked[key]) {
    cb?.classList.add('checked'); if (cb) cb.textContent = '✓';
    row?.classList.add('checked');
    XPSystem.add(CONFIG.XP_REWARDS.safetyCheck, 'ตรวจสอบความปลอดภัย');
  } else {
    cb?.classList.remove('checked'); if (cb) cb.textContent = '';
    row?.classList.remove('checked');
  }
}

function switchTab(btn, tabId) {
  const wrap = btn.closest('.lesson-tabs');
  wrap?.querySelectorAll('.lesson-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById(tabId);
  if (content) {
    content.closest('.page-content, .card')?.querySelectorAll('.lesson-tab-content')
      .forEach(c => c.classList.remove('active'));
    // Broader search
    document.querySelectorAll('.lesson-tab-content').forEach(c => {
      if (c.id === tabId) c.classList.add('active');
      else c.classList.remove('active');
    });
  }
}

function selectTopic(idx) {
  if (STATE.completedTopics.has(idx)) return;
  STATE.completedTopics.add(idx);
  Render.topicsList();
  XPSystem.add(CONFIG.XP_REWARDS.watchVideo, 'ดูวิดีโอบทเรียน');
  API.saveProgress(STATE.currentUnit, idx, Math.round((STATE.completedTopics.size / 5) * 100));
}

function submitAssignment(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;
  a.status = 'submitted';
  XPSystem.add(CONFIG.XP_REWARDS.submitAssignment, 'ส่งใบงาน');
  API.submitAssignment(id, []);
  UI.showToast(`ส่งใบงานสำเร็จ: ${a.title}`, 'success');
  PageRenderers.assignments();
}

function submitReflection() {
  const areas = document.querySelectorAll('.reflection-textarea');
  const answers = Array.from(areas).map(el => el.value.trim()).filter(Boolean);
  if (answers.length === 0) { UI.showToast('กรุณากรอกข้อมูลก่อนบันทึก', 'warning'); return; }
  XPSystem.add(CONFIG.XP_REWARDS.completeReflection, 'สะท้อนคิด');
  API.saveReflection(STATE.currentUnit, answers);
  UI.showToast('บันทึกสะท้อนคิดเรียบร้อย ✓', 'success');
}

function showPartInfo(part) {
  const info = {
    relay:  '🟣 <strong>รีเลย์ (Relay)</strong> — ช่วยสตาร์ทคอมเพรสเซอร์ ความต้านทานขดลวด 8-15Ω',
    cap:    '🔵 <strong>คาปาซิเตอร์ (Capacitor)</strong> — สะสมและจ่ายกระแสขดสตาร์ท ค่าพิกัด 15-35μF',
    comp:   '🔴 <strong>คอมเพรสเซอร์ (Compressor)</strong> — อัดสารทำความเย็น ใช้ 220V / 4-6A',
    thermo: '🟢 <strong>เทอร์โมสตัท (Thermostat)</strong> — ควบคุมอุณหภูมิ ตัดวงจรเมื่อถึงค่าที่ตั้ง',
  };
  const el = document.getElementById('part-info');
  if (el) el.innerHTML = info[part] || '';
}

// Lab global wrappers
function toggleCompressor() { Lab.toggle(); }
function measureVoltage()   { Lab.measureVoltage(); }
function measureCurrent()   { Lab.measureCurrent(); }
function testRelay()        { Lab.testRelay(); }
function testCapacitor()    { Lab.testCapacitor(); }
function injectFault()      { Lab.injectFault(); }
function saveLabLog()       { Lab.saveLog(); }

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 'b') toggleSidebar();
});

// Close overlay on backdrop click
document.querySelectorAll?.('.overlay')?.forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(); });
});

// =====================================================
// BROWSER HISTORY
// =====================================================
window.addEventListener('popstate', e => {
  if (e.state?.page) Router.go(e.state.page);
});

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  // Record attendance
  API.saveAttendance();

  // Init displays
  XPSystem.updateDisplays();

  // Init mini leaderboard on dashboard
  Render.leaderboardMini();

  // Init lesson page
  Render.topicsList();
  Render.quizQuestions();

  // Animate progress bars
  setTimeout(() => Render.progressBarsAnimate(), 200);

  // Hash routing
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    Router.go(hash);
  }

  console.log(`[TechVoc LMS v${CONFIG.VERSION}] Initialized ✓`);
});
