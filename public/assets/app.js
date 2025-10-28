(function(){
  const SESSION_KEY = 'ticketapp_session';
  const TICKETS_KEY = 'ticketapp_tickets';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function showToast(msg){
    const t = $('#toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 1800);
  }

  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e){ return null; }
  }
  function setSession(data){ localStorage.setItem(SESSION_KEY, JSON.stringify(data)); }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  function getTickets(){
    try { return JSON.parse(localStorage.getItem(TICKETS_KEY)) || []; } catch(e){ return []; }
  }
  function setTickets(arr){ localStorage.setItem(TICKETS_KEY, JSON.stringify(arr)); }

  // ===== Helper: Refresh Dashboard if visible =====
  function refreshDashboardIfVisible() {
    const kpiTotal = document.getElementById('kpiTotal');
    if (kpiTotal) {
      initDashboard();
    }
  }

  // ===== Guards & Navigation =====
  function applyGuards(){
    const session = getSession();
    const isAuthed = !!session;

    const userLine = $('#userLine');
    if (userLine) userLine.textContent = isAuthed ? `Logged in as ${session.email}` : '';

    $$('[data-guard="auth-only"]').forEach(el => el.style.display = isAuthed ? '' : 'none');
    $$('[data-guard="guest-only"]').forEach(el => el.style.display = isAuthed ? 'none' : '');

    const logoutBtn = $('#logoutBtn');
    if (logoutBtn){
      logoutBtn.onclick = () => {
        clearSession();
        showToast('Logged out');
        window.location.href='/?page=landing';
      };
    }

    const url = new URL(window.location.href);
    const page = url.searchParams.get('page') || 'landing';
    const protectedPages = ['dashboard','tickets'];
    if (protectedPages.includes(page) && !isAuthed){
      showToast('Your session has expired — please log in again.');
      window.location.href='/?page=login';
    }
  }

  // ===== Inline Errors =====
  function setFieldError(form, name, message=''){
    const f = form.querySelector(`[name="${name}"]`);
    const err = form.querySelector(`[data-error-for="${name}"]`);
    if (err) err.textContent = message;
    if (f) f.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
  function clearErrors(form){
    $$('.error', form).forEach(e=>e.textContent='');
    $$('input,select,textarea', form).forEach(f=>f.removeAttribute('aria-invalid'));
  }

  // ===== Auth Pages =====
  function initAuthPages(){
    const loginForm = $('#loginForm');
    if (loginForm){
      loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const fd = new FormData(loginForm);
        const email = (fd.get('email')||'').trim();
        const password = (fd.get('password')||'').trim();

        setFieldError(loginForm,'email','');
        setFieldError(loginForm,'password','');

        let valid = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          setFieldError(loginForm,'email','Enter a valid email.');
          valid = false;
        }
        if (!password || password.length < 6){
          setFieldError(loginForm,'password','Password must be at least 6 characters.');
          valid = false;
        }
        if (!valid){ showToast('Invalid credentials'); return; }

        setSession({ email, token: 'fake-token' });
        showToast('Login successful');
        window.location.href='/?page=dashboard';
      });
    }

    const signupForm = $('#signupForm');
    if (signupForm){
      signupForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        const fd = new FormData(signupForm);
        const email = (fd.get('email')||'').trim();
        const password = (fd.get('password')||'').trim();

        setFieldError(signupForm,'email','');
        setFieldError(signupForm,'password','');

        let valid = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          setFieldError(signupForm,'email','Enter a valid email.');
          valid = false;
        }
        if (!password || password.length < 6){
          setFieldError(signupForm,'password','Password must be at least 6 characters.');
          valid = false;
        }
        if (!valid){ showToast('Please fix the errors'); return; }

        setSession({ email, token: 'fake-token' });
        showToast('Account created');
        window.location.href='/?page=dashboard';
      });
    }
  }

  // ===== Dashboard KPIs =====
  function initDashboard(){
    const totalEl = $('#kpiTotal');
    if (!totalEl) return; // not on dashboard page

    const tickets = getTickets();

    const openCount = tickets.filter(t => t.status === 'open').length;
    const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
    const closedCount = tickets.filter(t => t.status === 'closed').length;

    $('#kpiTotal').textContent = tickets.length;
    $('#kpiOpen').textContent = openCount;
    const inProgEl = $('#kpiInProgress');
    if (inProgEl) inProgEl.textContent = inProgressCount;
    $('#kpiClosed').textContent = closedCount;
  }

  // ===== Ticket Management =====
  function escapeHTML(s){
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function renderTickets(){
    const list = $('#ticketsList');
    if (!list) return;
    const tickets = getTickets();
    list.innerHTML = '';

    if (tickets.length === 0){
      list.innerHTML = '<p class="muted">No tickets yet. Create one above.</p>';
      return;
    }

    tickets.forEach(t=>{
      const card = document.createElement('div');
      card.className = 'ticket-card';
      card.innerHTML = `
        <div class="ticket-title">${escapeHTML(t.title)}</div>
        <div><span class="chip ${t.status}">${t.status}</span></div>
        ${t.description ? `<p>${escapeHTML(t.description)}</p>` : ''}
        <div class="ticket-actions">
          <button class="btn-secondary" data-edit="${t.id}">Edit</button>
          <button class="btn-outline" data-del="${t.id}">Delete</button>
        </div>
      `;
      list.appendChild(card);
    });

    $$('#ticketsList [data-edit]').forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute('data-edit');
        loadTicketIntoForm(id);
      };
    });
    $$('#ticketsList [data-del]').forEach(btn=>{
      btn.onclick = ()=>{
        const id = btn.getAttribute('data-del');
        if (confirm('Delete this ticket?')){
          const all = getTickets().filter(t=>String(t.id)!==String(id));
          setTickets(all);
          showToast('Ticket deleted');
          renderTickets();
          refreshDashboardIfVisible(); // update if dashboard is open
        }
      };
    });
  }

  function loadTicketIntoForm(id){
    const form = $('#ticketForm');
    if (!form) return;
    const t = getTickets().find(x=>String(x.id)===String(id));
    if (!t) return;
    form.querySelector('[name="id"]').value = t.id;
    form.querySelector('[name="title"]').value = t.title;
    form.querySelector('[name="status"]').value = t.status;
    form.querySelector('[name="description"]').value = t.description || '';
    $('#formTitle').textContent = 'Edit Ticket';
  }

  function initTicketsPage(){
    const form = $('#ticketForm');
    if (!form) return;

    renderTickets();

    $('#resetFormBtn').onclick = ()=>{
      form.reset();
      form.querySelector('[name="id"]').value = '';
      $('#formTitle').textContent = 'Create Ticket';
      clearErrors(form);
    };

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      clearErrors(form);

      const fd = new FormData(form);
      const id = (fd.get('id')||'').trim();
      const title = (fd.get('title')||'').trim();
      const status = (fd.get('status')||'').trim();
      const description = (fd.get('description')||'').trim();

      let ok = true;
      if (!title){
        setFieldError(form,'title','Title is required.');
        ok = false;
      } else if (title.length > 100){
        setFieldError(form,'title','Max length is 100 characters.');
        ok = false;
      }
      const allowed = ['open','in_progress','closed'];
      if (!status || !allowed.includes(status)){
        setFieldError(form,'status','Status must be open, in_progress, or closed.');
        ok = false;
      }
      if (description.length > 500){
        setFieldError(form,'description','Max length is 500 characters.');
        ok = false;
      }
      if (!ok){ showToast('Please fix the errors'); return; }

      const all = getTickets();

      if (id){
        const idx = all.findIndex(t=>String(t.id)===String(id));
        if (idx > -1){
          all[idx] = { ...all[idx], title, status, description };
          setTickets(all);
          showToast('Ticket updated');
        } else {
          showToast('Failed to update ticket. Please retry.');
        }
      } else {
        const newTicket = { id: Date.now(), title, status, description };
        all.unshift(newTicket);
        setTickets(all);
        showToast('Ticket created');
      }

      form.reset();
      form.querySelector('[name="id"]').value = '';
      $('#formTitle').textContent = 'Create Ticket';
      renderTickets();
      refreshDashboardIfVisible(); // keep dashboard synced
    });
  }

  // ===== Boot =====
  document.addEventListener('DOMContentLoaded', ()=>{
    applyGuards();
    initAuthPages();
    initTicketsPage();

    // detect which page we’re on
    const url = new URL(window.location.href);
    const page = url.searchParams.get('page') || 'landing';
    if (page === 'dashboard') {
      // delay ensures localStorage is ready
      setTimeout(() => initDashboard(), 100);
    } else {
      initDashboard();
    }

    // live sync if data changes in localStorage
    window.addEventListener('storage', (e)=>{
      if (e.key === TICKETS_KEY) initDashboard();
    });
  });
})();
