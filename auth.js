/* =====================================================
   TECHVOC LMS — auth.js
   จัดการ Session / Login / Logout ทุกหน้า
   ใส่ <script src="auth.js"></script> ใน index.html
   ===================================================== */

'use strict';

// =====================================================
// SESSION MANAGEMENT
// =====================================================
var Auth = {

  // ── อ่านข้อมูล user ปัจจุบัน ──
  getUser: function() {
    try {
      var data = sessionStorage.getItem('lms_user');
      return data ? JSON.parse(data) : null;
    } catch (_) { return null; }
  },

  // ── ตรวจว่า login อยู่ไหม ──
  isLoggedIn: function() {
    return !!this.getUser();
  },

  // ── ตรวจว่าเป็นครูไหม ──
  isTeacher: function() {
    var u = this.getUser();
    return u && u.role === 'teacher';
  },

  // ── ตรวจว่าเป็นนักเรียนไหม ──
  isStudent: function() {
    var u = this.getUser();
    return u && u.role === 'student';
  },

  // ── Logout ──
  logout: function() {
    if (!confirm('ต้องการออกจากระบบหรือไม่?')) return;
    sessionStorage.removeItem('lms_user');
    window.location.href = 'login.html';
  },

  // ── Guard: ถ้าไม่ได้ login ให้กลับไปหน้า login ──
  requireLogin: function() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // ── Guard: เฉพาะครูเท่านั้น ──
  requireTeacher: function() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    if (!this.isTeacher()) {
      alert('หน้านี้สำหรับครูเท่านั้น');
      window.location.href = 'index.html#dashboard';
      return false;
    }
    return true;
  },

  // ── แสดงชื่อ user ใน UI ──
  renderUserInfo: function() {
    var u = this.getUser();
    if (!u) return;

    // ชื่อ sidebar
    var nameEl = document.getElementById('sidebar-username');
    if (nameEl) nameEl.textContent = u.name;

    // Avatar (2 ตัวอักษรแรก)
    var avatarEl = document.getElementById('user-avatar-sidebar');
    if (avatarEl) {
      var words = u.name.replace('นาย','').replace('นางสาว','').replace('นาง','').trim().split(' ');
      avatarEl.textContent = words.length >= 2 ? words[0][0] + words[1][0] : u.name.slice(0,2);
    }

    // Welcome name ใน dashboard
    var welcomeEl = document.getElementById('welcome-name');
    if (welcomeEl) {
      var short = u.name.replace('นาย','').replace('นางสาว','').replace('นาง','').trim().split(' ')[0];
      welcomeEl.textContent = short;
    }

    // Role badge
    var roleEl = document.getElementById('user-role-label');
    if (roleEl) roleEl.textContent = u.role === 'teacher' ? '👨‍🏫 ครูผู้สอน' : '🎓 นักเรียน ปวช.1';

    // XP
    var xpEl = document.getElementById('xp-display');
    if (xpEl && u.xp) xpEl.textContent = Number(u.xp).toLocaleString();

    // ซ่อน/แสดงเมนูครู
    var adminNav = document.querySelector('[data-role="teacher"]');
    if (adminNav) adminNav.style.display = u.role === 'teacher' ? 'block' : 'none';
  },
};

// =====================================================
// INIT — รันทันทีเมื่อโหลดหน้า index.html
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
  // ถ้าไม่ได้ login → ไปหน้า login ทันที
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // แสดงข้อมูล user
  Auth.renderUserInfo();

  // ถ้าเป็นครู เปิดหน้า admin อัตโนมัติ
  var hash = location.hash.replace('#', '');
  if (Auth.isTeacher() && (!hash || hash === 'dashboard')) {
    if (typeof showPage === 'function') showPage('admin');
  }
});
