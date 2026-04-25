import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ─── FIREBASE CONFIG ─── */
const firebaseConfig = {
  apiKey: "AIzaSyDGnmUH1gxYKqhNEyjacmhXO5JnfbK_xD0",
  authDomain: "peoplepleasuredahsyat.firebaseapp.com",
  projectId: "peoplepleasuredahsyat",
  storageBucket: "peoplepleasuredahsyat.firebasestorage.app",
  messagingSenderId: "1013787661296",
  appId: "1:1013787661296:web:d86ea3ee22eae70f230335",
  measurementId: "G-YERNWESJD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ─── CONSTANTS ─── */
const SUBDIV_COLORS = {
  'fotografer':'#f59e0b',
  'videografer':'#3b82f6',
  'desainer grafis':'#a855f7',
  'content creator':'#ec4899',
  'editor':'#10b981'
};

/* ─── STATE ─── */
let members = [], events = [], tasks = [], announcements = [], notes = [], portfolio = [];

/* ─── INITIALIZATION ─── */
function init() {
  try {
    // Check Portal Auth
  if(document.getElementById('portalLoginOverlay')) {
    if(sessionStorage.getItem('portalAuth') === 'true') {
      document.getElementById('portalLoginOverlay').style.display = 'none';
    }
  }

  initRealtime();
  } catch (err) {
    console.error("Firebase Init Error:", err);
  }
  setupNavbar();
  setupHeroTyping();
  setupParticles();
  setupScrollObserver();
  setupQuoteRotator();
}

function initRealtime() {
  onSnapshot(collection(db, "members"), snap => {
    members = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderTeam();
    updateStats();
  });
  onSnapshot(collection(db, "events"), snap => {
    events = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderEvents();
    updateStats();
  });
  onSnapshot(collection(db, "tasks"), snap => {
    tasks = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderTasks();
    renderSubdivOverview();
    updateStats();
  });
  onSnapshot(collection(db, "announcements"), snap => {
    announcements = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderAnnouncements();
  });
  onSnapshot(collection(db, "notes"), snap => {
    notes = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderNotes();
  });
  onSnapshot(collection(db, "siteContent"), snap => {
    portfolio = snap.docs.map(d => ({id: d.id, ...d.data()}));
    renderGallery();
    renderVideos();
    renderMusic();
  });
}

/* ─── UI COMPONENTS ─── */
function setupNavbar() {
  const nav = document.getElementById('navbar');
  if(!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  const burger = document.getElementById('navHamburger');
  const mobile = document.getElementById('navMobile');
  if(burger && mobile) {
    burger.addEventListener('click', () => {
      mobile.classList.toggle('open');
      burger.classList.toggle('active');
    });
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobile.classList.remove('open');
        burger.classList.remove('active');
      });
    });
  }
}

function setupScrollObserver() {
  const options = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-link').forEach(link => {
          const href = link.getAttribute('href');
          if(href === `#${id}`) link.classList.add('active');
          else if(href && href.startsWith('#')) link.classList.remove('active');
        });
      }
    });
  }, options);

  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

function setupHeroTyping() {
  const text = document.getElementById('typingText');
  if(!text) return;
  
  // Custom words for Personal vs Portal
  const isPortal = window.location.pathname.includes('portal.html');
  const words = isPortal 
    ? ['Kreatif.', 'Inovatif.', 'Profesional.', 'Satu Visi.']
    : ['Ruang Piska.', 'Pusat Kreatif.', 'Dunia Digital.', 'Realitaku.'];
    
  let i=0, j=0, current='', isDeleting=false;
  
  function type() {
    const full = words[i % words.length];
    if(isDeleting) current = full.substring(0, j--);
    else current = full.substring(0, j++);
    text.textContent = current;
    
    let speed = isDeleting ? 100 : 200;
    if(!isDeleting && current === full) { speed = 2000; isDeleting = true; }
    else if(isDeleting && current === '') { isDeleting = false; i++; speed = 500; }
    setTimeout(type, speed);
  }
  type();
}

function setupQuoteRotator() {
  const qEl = document.getElementById('piskaQuote');
  if(!qEl) return;
  const quotes = [
    "\"Cara terbaik memprediksi masa depan adalah dengan menciptakannya.\"",
    "\"Desain bukan hanya tampilan, desain adalah cara kerjanya.\"",
    "\"Kesederhanaan adalah kecanggihan tertinggi.\"",
    "\"Teruslah lapar, teruslah merasa bodoh untuk terus belajar.\""
  ];
  let qIdx = 0;
  setInterval(() => {
    qEl.style.opacity = '0';
    setTimeout(() => {
      qIdx = (qIdx + 1) % quotes.length;
      qEl.textContent = quotes[qIdx];
      qEl.style.opacity = '1';
    }, 500);
  }, 6000);
}

function updateStats() {
  const today = new Date().toISOString().slice(0,10);
  const upCount = events.filter(e => e.date >= today).length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const activeCount = tasks.filter(t => t.status !== 'done').length;
  
  const elUp = document.getElementById('statEvents');
  const elDone = document.getElementById('statDone');
  const elMem = document.getElementById('statMembers');
  const elActive = document.getElementById('statActive');
  
  if(elUp) elUp.textContent = upCount;
  if(elDone) elDone.textContent = doneCount;
  if(elMem) elMem.textContent = members.length || 0;
  if(elActive) elActive.textContent = activeCount;
}

/* ─── RENDER EVENTS ─── */
let currentEventFilter = 'all';
window.filterEvents = function(filter, btn) {
  currentEventFilter = filter;
  document.querySelectorAll('#eventFilter .filter-btn').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderEvents();
};

function renderEvents() {
  const grid = document.getElementById('scheduleGrid');
  if (!grid) return;
  
  const today = new Date().toISOString().slice(0,10);
  let filtered = [...events];
  
  if(currentEventFilter === 'upcoming') filtered = events.filter(e => e.date > today);
  else if(currentEventFilter === 'today') filtered = events.filter(e => e.date === today);
  else if(currentEventFilter === 'past') filtered = events.filter(e => e.date < today);

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-data"><p>Tidak ada event untuk kategori "${currentEventFilter}".</p></div>`;
    return;
  }
  
  const sorted = filtered.sort((a,b)=>b.date.localeCompare(a.date));
  grid.innerHTML = sorted.map((e, i) => {
    let day = '??', month = '???';
    try {
      if(e.date) {
        const d = new Date(e.date + 'T00:00:00');
        day = d.getDate(); month = d.toLocaleDateString('id-ID', {month:'short'}).toUpperCase();
      }
    } catch(err) {}
    const eventTasks = tasks.filter(t => t.eventId === e.id);
    let plottingHtml = '';
    if(eventTasks.length > 0) {
      plottingHtml = `<div class="event-plotting"><div class="plotting-title">Tugas & Crew:</div><div class="plotting-list">
          ${eventTasks.map(t => {
            const names = (t.assignedTo || []).map(id => { const m = members.find(x => x.id === id); return m ? m.name : 'Unknown'; }).slice(0, 3).join(', ');
            const tSubdivs = t.subdivs || (t.subdiv ? [t.subdiv] : []);
            return `<div class="plotting-item"><span class="p-sub" style="color:${SUBDIV_COLORS[tSubdivs[0]] || '#7c3aed'}">${tSubdivs.join(' & ')}:</span> <span class="p-names">${names || 'Belum diplot'}</span></div>`;
          }).join('')}
        </div></div>`;
    }
    return `<div class="event-card animate-on-scroll" style="--i:${i}" onclick="showEventDetail('${e.id}')">
      <div class="event-date-badge"><div class="event-day">${day}</div><div class="event-month">${month}</div></div>
      <span class="event-type">${e.type || 'EVENT'}</span><h3 class="event-title">${e.title}</h3>
      <div class="event-meta">
        <div class="event-meta-item">🕒 ${e.time || 'TBA'}</div>
        <div class="event-meta-item">📍 ${e.location || 'TBA'}</div>
      </div>
      ${plottingHtml}
    </div>`;
  }).join('');
  observeAnimations();
}

/* ─── RENDER TASKS ─── */
let currentFilter = 'all';
window.filterTasks = function(subdiv, btn) {
  currentFilter = subdiv;
  const fWrap = document.getElementById('tasksFilter');
  if(fWrap) {
    fWrap.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.style.borderColor = '';
      b.style.background = '';
      b.style.color = '';
    });
  }
  if(btn) {
    btn.classList.add('active');
    const color = SUBDIV_COLORS[subdiv] || '#7c3aed';
    if(subdiv !== 'all') {
      btn.style.borderColor = color + '66';
      btn.style.background = color + '1a';
      btn.style.color = color;
    }
  }
  renderTasks();
  renderSubdivOverview(); // Sync the cards above
};

function renderTasks() {
  const board = document.getElementById('tasksBoard');
  const doneBoard = document.getElementById('doneTasksBoard');
  if (!board) return;
  
  const subdivFiltered = currentFilter === 'all' ? tasks : tasks.filter(t => (t.subdivs || (t.subdiv ? [t.subdiv] : [])).includes(currentFilter));
  
  const activeTasks = subdivFiltered.filter(t => t.status !== 'done');
  const doneTasks = subdivFiltered.filter(t => t.status === 'done');
  
  const STATUS_LABEL = {todo:'To Do',inprogress:'In Progress',done:'Selesai'};
  
  const taskToHtml = (t, i) => {
    const tSubdivs = t.subdivs || (t.subdiv ? [t.subdiv] : []);
    const badges = tSubdivs.map(s => `<div class="task-subdiv"><div class="subdiv-dot" style="background:${SUBDIV_COLORS[s] || '#7c3aed'}"></div>${s}</div>`).join('');
    const assignees = (t.assignedTo || []).map(id => members.find(x => x.id === id)).filter(m => !!m);
    let filteredAssignees = assignees;
    if (currentFilter !== 'all') {
      filteredAssignees = assignees.filter(m => (m.roles || (m.role ? [m.role] : [])).includes(currentFilter));
    }
    const names = filteredAssignees.map(m => m.name).join(', ');
    return `<div class="task-card animate-on-scroll" style="--i:${i}" onclick="showTaskDetail('${t.id}')">
      <div class="task-header"><div class="task-title">${t.title}</div><span class="task-status status-${t.status}">${STATUS_LABEL[t.status]||t.status}</span></div>
      <p class="task-desc">${t.description ? t.description.substring(0,80)+'...' : 'No description.'}</p>
      <div class="task-footer" style="flex-direction:column; align-items:flex-start; gap:8px;">
        <div style="display:flex; flex-wrap:wrap; gap:8px;">${badges}</div>
        <div class="task-due" style="font-size:12px; color:var(--text3);">📅 ${t.dueDate || 'No Deadline'}</div>
      </div>
      <div class="task-assignees" style="font-size:11px; color:var(--text2); border-top:1px solid rgba(255,255,255,0.05); padding-top:10px; margin-top:10px; width:100%;">👥 ${names || 'Belum ditugaskan'}</div>
    </div>`;
  };

  board.innerHTML = activeTasks.length 
    ? activeTasks.map((t, i) => taskToHtml(t, i)).join('')
    : '<div class="no-data"><p>Tidak ada tugas aktif.</p></div>';
    
  if(doneBoard) {
    doneBoard.innerHTML = doneTasks.length 
      ? doneTasks.map((t, i) => taskToHtml(t, i)).join('')
      : '<div class="no-data"><p>Belum ada tugas selesai.</p></div>';
  }
  
  const doneBadge = document.getElementById('doneCountBadge');
  if(doneBadge) doneBadge.textContent = doneTasks.length;

  observeAnimations();
}

let isDoneVisible = false;
window.toggleDoneTasks = function() {
  const board = document.getElementById('doneTasksBoard');
  const text = document.getElementById('doneToggleText');
  const icon = document.getElementById('doneToggleIcon');
  if(!board) return;
  
  isDoneVisible = !isDoneVisible;
  board.style.display = isDoneVisible ? 'grid' : 'none';
  if(text) text.textContent = isDoneVisible ? 'Sembunyikan Tugas Selesai' : 'Tampilkan Tugas Selesai';
  if(icon) icon.textContent = isDoneVisible ? '🙈' : '👁️';
};

function renderSubdivOverview() {
  const wrap = document.getElementById('subdivOverview');
  if(!wrap) return;
  const subdivs = Object.keys(SUBDIV_COLORS);
  wrap.innerHTML = subdivs.map(s => {
    const subTasks = tasks.filter(t => (t.subdivs || (t.subdiv ? [t.subdiv] : [])).includes(s));
    const done = subTasks.filter(t => t.status === 'done').length;
    const prog = subTasks.length ? Math.round((done/subTasks.length)*100) : 0;
    const color = SUBDIV_COLORS[s] || '#7c3aed';
    const isActive = currentFilter === s;
    
    return `<div class="subdiv-card ${isActive ? 'active' : ''}" 
                 onclick="filterTasks('${s}', this)"
                 style="${isActive ? `border-color:${color}66; background:${color}08;` : ''}">
      <div class="subdiv-name" style="color:${color}">${s}</div>
      <div class="subdiv-count">${subTasks.length} Tugas</div>
      <div class="subdiv-progress">
        <div class="subdiv-progress-fill" style="width:${prog}%; background:${color}"></div>
      </div>
    </div>`;
  }).join('');
}

/* ─── MODALS ─── */
window.showTaskDetail = function(id) {
  const t = tasks.find(x=>x.id===id); if(!t) return;
  const STATUS_LABEL = {todo:'To Do',inprogress:'In Progress',done:'Selesai'};
  
  if(document.getElementById('m-title')) document.getElementById('m-title').textContent = t.title;
  if(document.getElementById('m-desc')) document.getElementById('m-desc').textContent = t.description || 'No description.';
  if(document.getElementById('m-due')) document.getElementById('m-due').textContent = t.dueDate || 'No Deadline';
  if(document.getElementById('m-date-label')) document.getElementById('m-date-label').textContent = 'Deadline';
  
  // Badges
  const subdivEl = document.getElementById('m-subdiv');
  const statusEl = document.getElementById('m-status');
  if(subdivEl) {
    const tSubdivs = t.subdivs || (t.subdiv ? [t.subdiv] : []);
    subdivEl.textContent = tSubdivs.join(' & ') || 'Umum';
    subdivEl.style.display = 'inline-block';
  }
  if(statusEl) {
    statusEl.textContent = STATUS_LABEL[t.status] || t.status;
    statusEl.className = `status-badge status-${t.status}`;
    statusEl.style.display = 'inline-block';
  }

  // Assignees
  const assignList = document.getElementById('m-assignees');
  if(assignList) {
    const names = (t.assignedTo || []).map(uid => {
      const m = members.find(x => x.id === uid);
      return m ? m.name : 'Unknown';
    });
    assignList.innerHTML = names.map(n => `<div class="member-role" style="background:rgba(255,255,255,0.05); color:var(--text2);">${n}</div>`).join('');
  }

  // Visibility
  toggleModalSections({ due:true, loc:false, assign:true, ev:!!t.eventId, plot:false });
  
  if(t.eventId) {
    const e = events.find(x => x.id === t.eventId);
    if(document.getElementById('m-event')) document.getElementById('m-event').textContent = e ? e.title : 'Event tidak ditemukan';
  }

  const modal = document.getElementById('taskModal');
  if(modal) modal.classList.add('open');
};

window.showEventDetail = function(id) {
  const e = events.find(x=>x.id===id); if(!e) return;
  if(document.getElementById('m-title')) document.getElementById('m-title').textContent = e.title;
  if(document.getElementById('m-desc')) document.getElementById('m-desc').textContent = e.description || 'No description.';
  if(document.getElementById('m-due')) document.getElementById('m-due').textContent = `${e.date} · ${e.time || 'TBA'}`;
  if(document.getElementById('m-location')) document.getElementById('m-location').textContent = e.location || 'TBA';
  if(document.getElementById('m-date-label')) document.getElementById('m-date-label').textContent = 'Waktu & Tanggal';

  // Plotting (Tasks for this event)
  const plotList = document.getElementById('m-plotting-items');
  const eventTasks = tasks.filter(t => t.eventId === e.id);
  if(plotList) {
    if(eventTasks.length > 0) {
      plotList.innerHTML = eventTasks.map(t => {
        const names = (t.assignedTo || []).map(uid => {
          const m = members.find(x => x.id === uid);
          return m ? m.name : 'Unknown';
        }).join(', ');
        const tSubdivs = t.subdivs || (t.subdiv ? [t.subdiv] : []);
        return `<div class="plotting-item" style="padding:12px; background:rgba(255,255,255,0.03); border-radius:12px; margin-bottom:8px;">
          <div style="font-weight:700; color:var(--purple-l); font-size:13px; margin-bottom:4px;">${tSubdivs.join(' & ')}</div>
          <div style="font-size:14px; margin-bottom:4px; color:#fff;">${t.title}</div>
          <div style="font-size:11px; color:var(--text3);">👥 ${names || 'Belum diplot'}</div>
        </div>`;
      }).join('');
    } else {
      plotList.innerHTML = '<p style="font-size:13px; color:var(--text3); opacity:0.6;">Belum ada tugas terplot untuk event ini.</p>';
    }
  }

  // Visibility
  toggleModalSections({ due:true, loc:true, assign:false, ev:false, plot:true });
  
  const subdivEl = document.getElementById('m-subdiv');
  const statusEl = document.getElementById('m-status');
  if(subdivEl) subdivEl.style.display = 'none';
  if(statusEl) statusEl.style.display = 'none';

  const modal = document.getElementById('taskModal');
  if(modal) modal.classList.add('open');
};

window.showAnnDetail = function(id) {
  const a = announcements.find(x=>x.id===id); if(!a) return;
  if(document.getElementById('m-title')) document.getElementById('m-title').textContent = a.title;
  if(document.getElementById('m-desc')) document.getElementById('m-desc').textContent = a.content || 'No content.';
  if(document.getElementById('m-due')) document.getElementById('m-due').textContent = `${a.date} · ${a.time || 'TBA'}`;
  if(document.getElementById('m-location')) document.getElementById('m-location').textContent = a.location || 'TBA';
  if(document.getElementById('m-date-label')) document.getElementById('m-date-label').textContent = 'Waktu & Tanggal';

  // Visibility
  toggleModalSections({ due:true, loc:!!a.location, assign:false, ev:false, plot:false });
  
  const subdivEl = document.getElementById('m-subdiv');
  const statusEl = document.getElementById('m-status');
  if(subdivEl) subdivEl.style.display = 'none';
  if(statusEl) {
    statusEl.textContent = a.priority === 'high' ? 'Penting' : 'Info';
    statusEl.className = `status-badge status-${a.priority === 'high' ? 'high' : 'info'}`;
    statusEl.style.display = 'inline-block';
  }

  const modal = document.getElementById('taskModal');
  if(modal) modal.classList.add('open');
};

function toggleModalSections(config) {
  const due = document.getElementById('m-due')?.parentElement;
  const loc = document.getElementById('m-location-section');
  const assign = document.getElementById('m-assignees-section');
  const ev = document.getElementById('m-event-section');
  const plot = document.getElementById('m-plotting-list');

  if(due) due.style.display = config.due ? 'block' : 'none';
  if(loc) loc.style.display = config.loc ? 'block' : 'none';
  if(assign) assign.style.display = config.assign ? 'block' : 'none';
  if(ev) ev.style.display = config.ev ? 'block' : 'none';
  if(plot) plot.style.display = config.plot ? 'block' : 'none';
}

window.closeTaskModal = function() {
  const modal = document.getElementById('taskModal');
  if(modal) modal.classList.remove('open');
};

window.toggleSSMode = function() {
  const modal = document.getElementById('taskModal');
  const content = modal?.querySelector('.modal-content');
  if(content) content.classList.toggle('ss-mode');
};

/* ─── RENDERERS ─── */
function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid || !members.length) return;
  grid.innerHTML = members.map((m, i) => {
    const initials = m.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const mRoles = m.roles || (m.role ? [m.role] : []);
    const badges = mRoles.map(r => `<div class="member-role role-${r.split(' ')[0].toLowerCase()}">${r}</div>`).join('');
    return `<div class="member-card animate-on-scroll" style="--i:${i}"><div class="member-avatar">${initials}</div><div class="member-name">${m.name}</div><div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center;">${badges}</div></div>`;
  }).join('');
  observeAnimations();
}

function renderAnnouncements() {
  const list = document.getElementById('annList');
  if (!list) return;
  if(!announcements.length) {
    list.innerHTML = '<div class="no-data"><p>Belum ada pengumuman.</p></div>';
    return;
  }
  list.innerHTML = announcements.sort((a,b)=>b.date.localeCompare(a.date)).map(a => {
    const isHigh = a.priority === 'high';
    const badgeClass = isHigh ? 'status-high' : 'status-info';
    const badgeLabel = isHigh ? 'Penting' : 'Info';
    return `<div class="ann-card animate-on-scroll" onclick="showAnnDetail('${a.id}')">
      <div class="ann-content">
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
          <h3 class="ann-title" style="margin:0; font-size:16px;">${a.title}</h3>
          <span class="status-badge ${badgeClass}" style="font-size:9px; padding:2px 8px;">${badgeLabel}</span>
        </div>
        <p class="ann-text" style="font-size:13px; opacity:0.8;">${a.content.substring(0,100)}${a.content.length > 100 ? '...' : ''}</p>
        <div class="ann-date" style="margin-top:10px; font-size:11px; opacity:0.6;">📅 ${a.date} ${a.time ? '· ⏰ '+a.time : ''}</div>
      </div>
    </div>`;
  }).join('');
  observeAnimations();
}

function renderNotes() {
  const grid = document.getElementById('notesList');
  if (!grid) return;
  if(!notes.length) {
    grid.innerHTML = '<div class="no-data"><p>Belum ada notulensi rapat.</p></div>';
    return;
  }
  grid.innerHTML = notes.sort((a,b)=>b.date.localeCompare(a.date)).map(n => `
    <div class="event-card animate-on-scroll" onclick="showNoteDetail('${n.id}')">
      <div class="event-type">${n.topic || 'NOTULENSI'}</div>
      <h3 class="event-title">${n.title}</h3>
      <p style="font-size:13px; color:var(--text2); margin-top:8px; line-height:1.5;">${n.content.substring(0,120)}...</p>
      <div style="margin-top:15px; font-size:11px; color:var(--text3); font-weight:600;">📅 ${n.date}</div>
    </div>`).join('');
  observeAnimations();
}

window.showNoteDetail = function(id) {
  const n = notes.find(x=>x.id===id); if(!n) return;
  if(document.getElementById('m-title')) document.getElementById('m-title').textContent = n.title;
  if(document.getElementById('m-desc')) document.getElementById('m-desc').textContent = n.content || 'No content.';
  if(document.getElementById('m-due')) document.getElementById('m-due').textContent = n.date;
  if(document.getElementById('m-date-label')) document.getElementById('m-date-label').textContent = 'Tanggal Rapat';

  // Visibility
  toggleModalSections({ due:true, loc:false, assign:false, ev:false, plot:false });
  
  const subdivEl = document.getElementById('m-subdiv');
  const statusEl = document.getElementById('m-status');
  if(subdivEl) {
    subdivEl.textContent = n.topic || 'Umum';
    subdivEl.style.display = 'inline-block';
  }
  if(statusEl) statusEl.style.display = 'none';

  const modal = document.getElementById('taskModal');
  if(modal) modal.classList.add('open');
};

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if(!grid) return;
  const items = portfolio.filter(p => p.category === 'gallery');
  if(!items.length) {
    grid.innerHTML = '<p style="color:var(--text3); font-size:13px; grid-column:1/-1; text-align:center;">Belum ada foto.</p>';
    return;
  }
  grid.innerHTML = items.map(p => `
    <div class="gallery-item" title="${p.title}" onclick="openImage('${p.url}', '${p.title}')">
      <img src="${p.url}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=300'">
    </div>
  `).join('');
}

function renderVideos() {
  const grid = document.getElementById('videoGrid');
  if(!grid) return;
  const items = portfolio.filter(p => p.category === 'video');
  if(!items.length) {
    grid.innerHTML = '<p style="color:var(--text3); font-size:13px; grid-column:1/-1; text-align:center;">Belum ada video.</p>';
    return;
  }
  grid.innerHTML = items.map((p, i) => `
    <div class="video-card animate-on-scroll" style="--i:${i}" onclick="playVideo('${p.url}', '${p.title}')">
      <div class="video-thumb">
        <img src="${p.cover || 'assets/malang_cover.png'}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400'">
        <div class="video-play-overlay">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      <div class="video-info">
        <h3 class="video-title">${p.title}</h3>
        <p class="video-category">${p.extra || 'Motion Work'}</p>
      </div>
    </div>
  `).join('');
  observeAnimations();
}

function renderMusic() {
  const grid = document.getElementById('musicGrid');
  if(!grid) return;
  const items = portfolio.filter(p => p.category === 'music');
  if(!items.length) {
    grid.innerHTML = '<p style="color:var(--text3); font-size:13px; grid-column:1/-1; text-align:center;">Belum ada lagu.</p>';
    return;
  }
  grid.innerHTML = items.map((p, i) => `
    <div class="music-card animate-on-scroll" style="--i:${i}" onclick="playMusic('${p.url}', '${p.title}', '${p.extra || 'Unknown Artist'}', '${p.cover || ''}')">
      <div class="music-cover">
        <img src="${p.cover}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200'">
        <div class="music-play-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
      </div>
      <div class="music-info">
        <h3 class="music-track">${p.title}</h3>
        <p class="music-artist">${p.extra || 'Unknown Artist'}</p>
      </div>
    </div>
  `).join('');
  observeAnimations();
}

function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function setupParticles() {
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  class Particle {
    constructor() { this.reset(); }
    reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.v = Math.random() * 0.5 + 0.2; this.s = Math.random() * 1.5 + 0.5; this.a = Math.random() * 0.5; }
    update() { this.y -= this.v; if(this.y < 0) this.reset(); }
    draw() { ctx.fillStyle = `rgba(124, 58, 237, ${this.a})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI*2); ctx.fill(); }
  }
  for(let i=0; i<50; i++) particles.push(new Particle());
  function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
  animate();
}

const modalOverlay = document.getElementById('taskModal');
if(modalOverlay) modalOverlay.addEventListener('click', (e) => { if(e.target === modalOverlay) window.closeTaskModal(); });

/* ─── PORTAL LOGIN ─── */
window.doPortalLogin = function() {
  const pass = document.getElementById('portalPass').value;
  const error = document.getElementById('portalLoginError');
  const overlay = document.getElementById('portalLoginOverlay');

  if (pass === 'pdd123') {
    sessionStorage.setItem('portalAuth', 'true');
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 800);
  } else {
    error.textContent = 'Password salah! Silakan coba lagi.';
    document.getElementById('portalPass').value = '';
    setTimeout(() => { error.textContent = ''; }, 3000);
  }
};

/* ─── MEDIA HANDLERS ─── */
window.playVideo = function(src, title) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('mainVideo');
  if(modal && video) {
    modal.classList.add('open');
    
    // Gunakan encodeURI untuk menangani karakter khusus jika ada
    const encodedSrc = encodeURI(src);
    
    // Hentikan video sebelumnya
    video.pause();
    
    // Set src secara langsung
    video.src = encodedSrc;
    video.preload = "metadata"; // Bantu browser baca ukuran file besar
    
    // Load dan Play dengan sedikit delay untuk stabilitas file besar
    video.load();
    
    setTimeout(() => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.warn("Playback blocked:", error));
      }
    }, 100);

    // Penanganan error yang lebih spesifik
    video.onerror = function() {
      // Jika src kosong (saat modal ditutup), abaikan
      if(!video.src || video.src.endsWith('null') || video.src === window.location.href) return;
      
      alert(`Gagal memuat video: ${src}\n\nTips:\n1. Pastikan file ${src} benar-benar ada di folder assets.\n2. Coba ganti browser (Gunakan Chrome/Edge).\n3. Pastikan tidak ada aplikasi lain yang sedang mengunci file tersebut.`);
      window.closeVideoModal();
    };
  }
};

window.closeVideoModal = function() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('mainVideo');
  if(modal) modal.classList.remove('open');
  if(video) { video.pause(); video.src = ""; video.innerHTML = ""; }
};

window.openImage = function(src, caption) {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('modalImg');
  const cap = document.getElementById('modalCaption');
  if(modal && img) { img.src = src; if(cap) cap.textContent = caption; modal.classList.add('open'); }
};

window.closeImageModal = function() {
  const modal = document.getElementById('imageModal');
  if(modal) modal.classList.remove('open');
};



// Global initialization
document.addEventListener('DOMContentLoaded', init);
