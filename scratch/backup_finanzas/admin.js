let courtsData = [
  { id: 'c1', name: 'Pista 1 - Pádel Cristal Pro ($300 MXN/h)', slotStatuses: {} },
  { id: 'c2', name: 'Pista 2 - Pádel Panorámica VIP ($300 MXN/h)', slotStatuses: {} }
];
let bookingsData = [];
const _nowInit = new Date();
let selectedModalDay = _nowInit.getDate();
let selectedModalFullDate = `${_nowInit.getFullYear()}-${String(_nowInit.getMonth() + 1).padStart(2, '0')}-${String(_nowInit.getDate()).padStart(2, '0')}`;
let currentDayModalCourt = 'c1';
let currentSelectedStartHour = '12:00';

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

let currentYear = _nowInit.getFullYear();
let currentMonthIndex = _nowInit.getMonth(); // 0-indexed

let usersData = [
  { id: 'USR-1001', name: 'Carlos Palacios', phone: '459 102 3849', role: 'Cliente', tempPassword: 'TAC-7842', mustChangePassword: true, status: 'Pendiente Cambio Password', createdAt: '2026-09-05' },
  { id: 'USR-1002', name: 'Sofia Valdes', phone: '459 987 1234', role: 'Cliente', tempPassword: 'TAC-9103', mustChangePassword: false, status: 'Activo (Password Personalizada)', createdAt: '2026-09-04' },
  { id: 'USR-1003', name: 'Alejandro Ruiz', phone: '459 410 2938', role: 'Cliente', tempPassword: 'TAC-5521', mustChangePassword: true, status: 'Pendiente Cambio Password', createdAt: '2026-09-05' },
  { id: 'USR-1004', name: 'Administrador Club Tacambaro', phone: '459 000 1122', role: 'Administrador', tempPassword: 'ADMIN-TAC', mustChangePassword: false, status: 'Activo (Administrador)', createdAt: '2026-09-01' }
];

let financesData = [];
let productsData = [];
let productCategories = ['Pelotas & Accesorios', 'Snacks & Bebidas', 'Indumentaria'];
let currentTpvFilter = 'all';

function fixMojibake(str) {
  if (typeof str !== 'string' || !str) return str || '';
  return str
    .replace(/PÃ;del|PÃ¡del|PÃdel|Pádel/gi, 'Padel')
    .replace(/TacÃ;mbaro|TacÃ¡mbaro|TacÃmbaro|Tacámbaro|TacAmbaro/gi, 'Tacambaro')
    .replace(/MichoacÃ;n|MichoacÃ¡n|MichoacÃn|Michoacán/gi, 'Michoacan')
    .replace(/PanorÃ;mica|PanorÃ¡mica|Panorámica/gi, 'Panoramica')
    .replace(/CategorÃ;a|CategorÃa|Categoría/gi, 'Categoria')
    .replace(/PrÃ;ximamente|PrÃ³ximamente|PrÃximamente|Próximamente/gi, 'Proximamente')
    .replace(/ContraseÃ±a|Contraseña/gi, 'Contrasena')
    .replace(/PArez|PÃ©rez|PÃ@rez|Pérez/g, 'Perez')
    .replace(/SofÃa|Sofía/gi, 'Sofia')
    .replace(/ValdÃ©s|Valdés/gi, 'Valdes')
    .replace(/Asistió/gi, 'Asistio')
    .replace(/Ã;/g, 'a')
    .replace(/Ã¡/g, 'a')
    .replace(/Ã©/g, 'e')
    .replace(/Ã­/g, 'i')
    .replace(/Ã\u00AD/g, 'i')
    .replace(/Ã³/g, 'o')
    .replace(/Ãº/g, 'u')
    .replace(/Ã±/g, 'n')
    .replace(/Ã/g, 'A')
    .replace(/Âª|Ãª|ª/g, 'a')
    .replace(/Âº|º/g, 'o')
    .replace(/Â©|Ã©|©/g, 'e')
    .replace(/Â/g, '')
    .replace(/[áäàâ]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòô]/g, 'o')
    .replace(/[úüùû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[ÁÄÀÂ]/g, 'A')
    .replace(/[ÉËÈÊ]/g, 'E')
    .replace(/[ÍÏÌÎ]/g, 'I')
    .replace(/[ÓÖÒÔ]/g, 'O')
    .replace(/[ÚÜÙÛ]/g, 'U')
    .replace(/Ñ/g, 'N');
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminSession();
  updateMonthLabels();
  renderMonthlyCalendar();
  fetchAdminData();
  fetchAdminUsers();
  fetchAdminFinances();
  fetchAdminProducts();
  fetchAdminTournaments();
  fetchHistoryData();
  fetchCashShiftStatus();
  setupRealtimeEvents();
  setInterval(fetchAdminData, 8000);

  const savedTab = localStorage.getItem('adminActiveTab');
  if (savedTab) {
    switchAdminTab(savedTab);
  }
});

function switchAdminTab(tabName) {
  if (tabName) {
    try { localStorage.setItem('adminActiveTab', tabName); } catch (e) { }
  }
  document.querySelectorAll('.admin-sidebar .nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.querySelector(`.admin-sidebar .nav-btn[onclick*="'${tabName}'"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  const paneMap = {
    reservas: 'adminTabReservas',
    planning: 'adminTabPlanning',
    canchas: 'adminTabCanchas',
    reservas_list: 'adminTabReservasList',
    historia: 'adminTabHistoria',
    torneos: 'adminTabTorneos',
    productos: 'adminTabProductos',
    tpv: 'adminTabTpv',
    usuarios: 'adminTabUsuarios',
    finanzas: 'adminTabFinanzas',
    caja: 'adminTabCaja'
  };

  const targetPaneId = paneMap[tabName] || 'adminTabReservas';
  const pane = document.getElementById(targetPaneId);
  if (pane) {
    pane.classList.add('active');
  }

  if (tabName === 'canchas') {
    renderAdminCourtsGrid();
  } else if (tabName === 'tpv') {
    renderTpvGrid();
  } else if (tabName === 'planning') {
    renderMonthlyCalendar();
  } else if (tabName === 'caja') {
    fetchCashShiftStatus();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

let _adminCourtsJson = '';
let _adminBookingsJson = '';

async function fetchAdminData() {
  try {
    const resCourts = await fetch('/api/courts');
    if (resCourts.ok) {
      const data = await resCourts.json();
      const str = JSON.stringify(data || []);
      if (str !== _adminCourtsJson) {
        _adminCourtsJson = str;
        courtsData = data;
        renderAdminCourtsGrid();
        renderDayModalCourtTabs();
        populateCourtDropdowns();
      }
    }

    const resBookings = await fetch('/api/bookings');
    if (resBookings.ok) {
      const data = await resBookings.json();
      const str = JSON.stringify(data || []);
      if (str !== _adminBookingsJson) {
        _adminBookingsJson = str;
        bookingsData = data;
        updateMonthLabels();
        renderMonthlyCalendar();
        renderBookingsTable();
        updateKPIs();
      }
    }
  } catch (err) { }
}

let sseSource = null;
let sseRetryTimer = null;

function setupRealtimeEvents() {
  if (sseSource) {
    try { sseSource.close(); } catch (e) { }
    sseSource = null;
  }
  if (!window.EventSource) {
    setInterval(fetchAdminData, 3000);
    return;
  }

  try {
    sseSource = new EventSource('/api/events');
    sseSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        handleRealtimeEvent(payload);
      } catch (e) { }
    };
    sseSource.onerror = () => {
      // Native browser EventSource reconnects automatically
    };
  } catch (e) { }
}

function getBookingDuration(timeSlotStr) {
  if (!timeSlotStr) return 1;
  const rangeMatch = timeSlotStr.match(/(\d{1,2}):00\s*(?:a|-|hasta)\s*(\d{1,2}):00/i);
  const durMatch = timeSlotStr.match(/(\d+)\s*(?:hrs?|horas?)/i);

  if (rangeMatch) {
    const sH = parseInt(rangeMatch[1], 10);
    let eH = parseInt(rangeMatch[2], 10);
    if (eH <= sH) eH += 24;
    return eH - sH;
  } else if (durMatch) {
    return parseInt(durMatch[1], 10);
  }
  return 1;
}

function getBookingForSlot(courtId, hourStr, bookings, targetDateISO) {
  if (!bookings || !Array.isArray(bookings)) return null;
  const targetHour = parseInt(hourStr.split(':')[0], 10);

  return bookings.find(b => {
    if (b.courtId !== courtId || !b.timeSlot) return false;

    if (targetDateISO) {
      if (!b.date) return false;
      const bISO = String(b.date).trim().substring(0, 10);
      if (bISO !== targetDateISO) return false;
    }

    const startMatch = b.timeSlot.match(/(\d{1,2}):00/);
    if (!startMatch) return false;
    const startHour = parseInt(startMatch[1], 10);

    const duration = getBookingDuration(b.timeSlot);
    const endHour = startHour + duration;

    return targetHour >= startHour && targetHour < endHour;
  });
}

function handleRealtimeEvent(event) {
  if (event.type === 'BOOKING_CREATED') {
    const existingIdx = bookingsData.findIndex(b => b.id === event.booking.id);
    if (existingIdx !== -1) {
      bookingsData[existingIdx] = event.booking;
    } else {
      bookingsData.unshift(event.booking);
    }

    renderMonthlyCalendar();
    if (document.getElementById('dayAvailabilityModalOverlay') && document.getElementById('dayAvailabilityModalOverlay').style.display !== 'none') {
      renderDay24hGrid();
    }
    renderBookingsTable();
    updateKPIs();
  } else if (event.type === 'BOOKING_UPDATED') {
    const idx = bookingsData.findIndex(b => b.id === event.booking.id);
    if (idx !== -1) {
      bookingsData[idx] = event.booking;
    } else {
      bookingsData.unshift(event.booking);
    }
    renderBookingsTable();
    updateKPIs();
  } else if (event.type === 'FINANCE_CREATED') {
    financesData.unshift(event.finance);
    renderFinancesTable();
    renderFinancesKPIs();
  } else if (event.type === 'PRODUCT_CREATED') {
    productsData.unshift(event.product);
    renderProductsTable();
  } else if (event.type === 'PRODUCT_UPDATED') {
    const idx = productsData.findIndex(p => p.id === event.product.id);
    if (idx !== -1) productsData[idx] = event.product;
    else productsData.unshift(event.product);
    renderProductsTable();
  } else if (event.type === 'PRODUCT_DELETED') {
    productsData = productsData.filter(p => p.id !== event.id);
    renderProductsTable();
  } else if (event.type === 'HISTORY_UPDATED') {
    if (event.history) {
      clubHistoryData = { ...clubHistoryData, ...event.history };
      populateHistoryFields();
    }
  } else if (event.type === 'TOURNAMENT_CREATED' || event.type === 'TOURNAMENT_UPDATED' || event.type === 'TOURNAMENT_DELETED' || event.type === 'TOURNAMENT_REGISTERED') {
    fetchAdminTournaments();
  } else if (event.type === 'COURT_CREATED' || event.type === 'COURT_UPDATED' || event.type === 'COURT_DELETED') {
    fetchAdminData();
    renderAdminCourtsGrid();
    renderDayModalCourtTabs();
    populateCourtDropdowns();
  } else if (event.type === 'USER_CREATED' || event.type === 'USER_UPDATED' || event.type === 'USERS_UPDATED') {
    fetchAdminUsers();
  } else if (event.type === 'SLOT_TOGGLED') {
    const court = courtsData.find(c => c.id === event.courtId);
    if (court) {
      court.slotStatuses = court.slotStatuses || {};
      court.slotStatuses[event.slot] = event.status;
    }
    renderMonthlyCalendar();
    if (document.getElementById('dayAvailabilityModalOverlay') && document.getElementById('dayAvailabilityModalOverlay').style.display === 'flex') {
      renderDay24hGrid();
    }
  }
}

/* ==========================================
   NAVEGACIÓN DE MESES Y CALENDARIO MENSUAL
   ========================================== */

function navigateCalendarMonth(delta) {
  currentMonthIndex += delta;
  if (currentMonthIndex < 0) {
    currentMonthIndex = 11;
    currentYear--;
  } else if (currentMonthIndex > 11) {
    currentMonthIndex = 0;
    currentYear++;
  }
  updateMonthLabels();
  renderMonthlyCalendar();
}

function goToTodayMonth() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonthIndex = now.getMonth();
  updateMonthLabels();
  renderMonthlyCalendar();

  setTimeout(() => {
    const todayCard = document.querySelector('.calendar-day-card.today');
    if (todayCard) {
      todayCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      todayCard.classList.add('pulse-highlight');
      setTimeout(() => todayCard.classList.remove('pulse-highlight'), 2000);
    }
  }, 100);
}

function updateMonthLabels() {
  const currentLabel = document.getElementById('currentMonthLabel');
  const prevLabel = document.getElementById('prevMonthLabel');
  const nextLabel = document.getElementById('nextMonthLabel');

  const prevIdx = (currentMonthIndex - 1 + 12) % 12;
  const nextIdx = (currentMonthIndex + 1) % 12;
  const prevYr = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
  const nextYr = currentMonthIndex === 11 ? currentYear + 1 : currentYear;

  if (currentLabel) currentLabel.textContent = `${monthNames[currentMonthIndex]} ${currentYear}`;
  if (prevLabel) prevLabel.textContent = `${monthNames[prevIdx]} ${prevYr}`;
  if (nextLabel) nextLabel.textContent = `${monthNames[nextIdx]} ${nextYr}`;
}

function getDaysInMonth(year, monthIdx) {
  return new Date(year, monthIdx + 1, 0).getDate();
}

function getFirstWeekdayOffset(year, monthIdx) {
  const jsDay = new Date(year, monthIdx, 1).getDay(); // 0 = Sun
  return (jsDay + 6) % 7; // Convert to Mon = 0
}

function renderMonthlyCalendar() {
  const container = document.getElementById('monthlyCalendarDaysContainer');
  if (!container) return;

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const offset = getFirstWeekdayOffset(currentYear, currentMonthIndex);

  const realNow = new Date();
  const realYr = realNow.getFullYear();
  const realMo = realNow.getMonth();
  const realDay = realNow.getDate();

  let html = '';

  for (let i = 0; i < offset; i++) {
    html += `<div style="background: transparent; border: none;"></div>`;
  }

  const moStr = String(currentMonthIndex + 1).padStart(2, '0');

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (currentYear === realYr && currentMonthIndex === realMo && day === realDay);
    const dayName = getDayNameForDate(currentYear, currentMonthIndex, day);
    const dateStr = `${dayName}, ${day} de ${monthNames[currentMonthIndex]} ${currentYear}`;
    const dStr = String(day).padStart(2, '0');
    const dayISO = `${currentYear}-${moStr}-${dStr}`;

    const matchCount = bookingsData.filter(b => b.date && String(b.date).startsWith(dayISO)).length;

    let occClass = 'occ-low';
    let occText = `🟢 ${matchCount} Partido${matchCount !== 1 ? 's' : ''}`;

    if (isToday) {
      occClass = 'occ-high';
      occText = `⚡ ${matchCount} Partido${matchCount !== 1 ? 's' : ''} (HOY)`;
    } else if (matchCount >= 24) {
      occClass = 'occ-full';
      occText = '🔥 Al 100% Ocupado';
    } else if (matchCount > 0) {
      occClass = 'occ-medium';
      occText = `🟢 ${matchCount} Partido${matchCount !== 1 ? 's' : ''}`;
    } else {
      occClass = 'occ-low';
      occText = `🟢 0 Partidos`;
    }

    html += `
      <div class="calendar-day-card ${isToday ? 'today' : ''}" onclick="openDayModal(${day}, '${dateStr}')">
        <div class="day-number-row">
          <span class="day-num">${day}</span>
          ${isToday ? '<span class="today-badge">HOY</span>' : ''}
        </div>
        <div class="day-occupancy-pill ${occClass}">
          ${occText}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function getDayNameForDate(yr, monthIdx, day) {
  const names = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const jsDay = new Date(yr, monthIdx, day).getDay();
  return names[jsDay];
}

/* ==========================================
   MODAL DE DISPONIBILIDAD DEL DÍA (24 HORAS)
   ========================================== */

function renderDayModalCourtTabs() {
  const container = document.getElementById('dayModalCourtsTabs');
  if (!container) return;

  if (!courtsData || courtsData.length === 0) {
    container.innerHTML = `<button class="court-tab-btn active">🎾 Cancha Principal</button>`;
    return;
  }

  if (!currentDayModalCourt || !courtsData.some(c => c.id === currentDayModalCourt)) {
    currentDayModalCourt = courtsData[0].id;
  }

  container.innerHTML = courtsData.map(court => {
    const isActive = court.id === currentDayModalCourt;
    const priceText = court.price ? `$${court.price} MXN/h` : '$300 MXN/h';
    const cleanName = fixMojibake(court.name || `Pista ${court.id}`);

    return `
      <button class="court-tab-btn ${isActive ? 'active' : ''}" onclick="switchDayModalCourt('${court.id}')">
        🎾 ${cleanName} (${priceText})
      </button>
    `;
  }).join('');
}

function populateCourtDropdowns() {
  const courtSelect = document.getElementById('modalCourtSelect');
  if (!courtSelect) return;

  if (!courtsData || courtsData.length === 0) {
    courtSelect.innerHTML = `<option value="c1">Pista 1 - Pádel Cristal Pro ($300 MXN/h)</option>`;
    return;
  }

  const currentVal = courtSelect.value;
  courtSelect.innerHTML = courtsData.map(court => {
    const priceText = court.price ? `$${court.price} MXN/h` : '$300 MXN/h';
    const cleanName = fixMojibake(court.name || `Pista ${court.id}`);
    return `<option value="${court.id}">🎾 ${cleanName} (${priceText})</option>`;
  }).join('');

  if (currentVal && courtsData.some(c => c.id === currentVal)) {
    courtSelect.value = currentVal;
  } else if (currentDayModalCourt && courtsData.some(c => c.id === currentDayModalCourt)) {
    courtSelect.value = currentDayModalCourt;
  }
}

function openDayModal(dayNum, dateStr) {
  selectedModalDay = dayNum;
  const moStr = String(currentMonthIndex + 1).padStart(2, '0');
  const dStr = String(dayNum).padStart(2, '0');
  selectedModalFullDate = `${currentYear}-${moStr}-${dStr}`;

  if (!courtsData || courtsData.length === 0) {
    currentDayModalCourt = 'c1';
  } else if (!currentDayModalCourt || !courtsData.some(c => c.id === currentDayModalCourt)) {
    currentDayModalCourt = courtsData[0].id;
  }

  const modal = document.getElementById('dayAvailabilityModalOverlay');
  const title = document.getElementById('dayModalTitle');

  if (title) title.textContent = `Disponibilidad: ${dateStr}`;

  switchDayModalCourt(currentDayModalCourt);

  if (modal) modal.style.display = 'flex';
}

function closeDayModal() {
  const modal = document.getElementById('dayAvailabilityModalOverlay');
  if (modal) modal.style.display = 'none';
}

function switchDayModalCourt(courtId) {
  currentDayModalCourt = courtId;
  renderDayModalCourtTabs();
  renderDay24hGrid();
}

function renderDay24hGrid() {
  const container = document.getElementById('day24hGridContainer');
  if (!container) return;

  const court = (courtsData && courtsData.length > 0 ? courtsData.find(c => c.id === currentDayModalCourt) : null) || {
    id: currentDayModalCourt || 'c1',
    name: currentDayModalCourt === 'c2' ? 'Pista 2 - Pádel Panorámica VIP' : 'Pista 1 - Pádel Cristal Pro',
    slotStatuses: {}
  };

  const hoursList = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const moStr = String(currentMonthIndex + 1).padStart(2, '0');
  const dStr = String(selectedModalDay).padStart(2, '0');
  const targetDateISO = selectedModalFullDate || `${currentYear}-${moStr}-${dStr}`;

  container.innerHTML = hoursList.map(h => {
    const realBooking = getBookingForSlot(court.id, h, bookingsData, targetDateISO);
    const isBlockedSlot = court && court.slotStatuses && (court.slotStatuses[`${targetDateISO}_${h}`] === 'blocked' || court.slotStatuses[h] === 'blocked');
    const isBooked = !!realBooking;

    if (isBooked) {
      const clientName = realBooking ? (realBooking.clientName || 'Jugador Tacámbaro') : 'Jugador Tacámbaro';
      const infoText = realBooking && realBooking.clientPhone ? `Tel: ${realBooking.clientPhone}` : 'Confirmada';
      const cleanClientName = fixMojibake(clientName);

      return `
        <div class="time-slot-card booked" onclick="openBookingModal('${court.id}', '${h}')" title="Clic para ver reserva de ${cleanClientName}">
          <div>🔴 ${h}</div>
          <small>${cleanClientName} (${infoText})</small>
        </div>
      `;
    } else if (isBlockedSlot) {
      return `
        <div class="time-slot-card blocked" onclick="openBookingModal('${court.id}', '${h}')" title="Clic para desbloquear">
          <div>⚪ ${h}</div>
          <small>Bloqueado</small>
        </div>
      `;
    } else {
      return `
        <div class="time-slot-card free" onclick="openBookingModal('${court.id}', '${h}')" title="Clic para reservar a las ${h}">
          <div>🟢 ${h}</div>
          <small>Disponible</small>
        </div>
      `;
    }
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderBookingsTable() {
  const tbodyDashboard = document.getElementById('adminBookingsTableBody');
  const tbodyFull = document.getElementById('adminFullBookingsTableBody');

  if (tbodyDashboard) {
    tbodyDashboard.innerHTML = bookingsData.length === 0
      ? `<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 16px;">No hay reservas registradas aun.</td></tr>`
      : bookingsData.map(b => {
          const cleanCourt = fixMojibake(b.courtName || '');
          const cleanClient = fixMojibake(b.clientName || 'Cliente Tacambaro');
          return `
            <tr>
              <td><strong>${b.id}</strong></td>
              <td>${cleanCourt}</td>
              <td><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ${b.timeSlot}</span></td>
              <td>
                <strong style="color:#0F172A;">${cleanClient}</strong>
                <small style="display:block; color:#64748B; font-size:10px;"><i data-lucide="phone" style="width:10px; height:10px; color:#64748B;"></i> ${b.clientPhone || 'Sin telefono'}</small>
              </td>
              <td style="color: #059669; font-weight: 800;">$${b.price}.00 MXN</td>
            </tr>
          `;
        }).join('');
  }

  if (tbodyFull) {
    const _now = new Date();
    const todayStr = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

    let todayBookings = (bookingsData || []).filter(b => (b.date || todayStr) <= todayStr);
    if (todayBookings.length === 0) {
      todayBookings = (bookingsData || []).slice(0, 10);
    }

    tbodyFull.innerHTML = todayBookings.length === 0
      ? `<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 24px; font-weight: 600;">No hay reservas registradas para el día de hoy. 🎾</td></tr>`
      : todayBookings.map(b => {
          const attLower = (b.attendance || '').toLowerCase();
          const isConfirmedAtt = attLower.includes('asistio') || attLower.includes('asistió');
          const isNoShow = attLower.includes('no asist') || attLower.includes('deuda');

          let attPill = `<span class="badge-status-pill" style="background:#FFFBEB; color:#D97706; border:1px solid #FDE68A; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="clock" style="width:12px; height:12px;"></i> Pendiente</span>`;
          if (isConfirmedAtt) {
            attPill = `<span class="badge-status-pill" style="background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="check-circle-2" style="width:12px; height:12px;"></i> Asistió</span>`;
          } else if (isNoShow) {
            attPill = `<span class="badge-status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="user-x" style="width:12px; height:12px;"></i> No Asistió</span>`;
          }

          let paidPill = `<span class="badge-status-pill" style="background:#FFF1F2; color:#E11D48; border:1px solid #FECDD3; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="alert-circle" style="width:12px; height:12px;"></i> Pendiente</span>`;
          if (b.paid) {
            const pm = (b.paymentMethod || '').toLowerCase();
            if (pm.includes('tarjeta')) {
              paidPill = `<span class="badge-status-pill" style="background:#F5F3FF; color:#7C3AED; border:1px solid #DDD6FE; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="credit-card" style="width:12px; height:12px;"></i> Tarjeta</span>`;
            } else if (pm.includes('transferencia')) {
              paidPill = `<span class="badge-status-pill" style="background:#F0FDF4; color:#166534; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="landmark" style="width:12px; height:12px;"></i> Transferencia</span>`;
            } else {
              paidPill = `<span class="badge-status-pill" style="background:#F0F9FF; color:#0284C7; border:1px solid #BAE6FD; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="banknote" style="width:12px; height:12px;"></i> Efectivo</span>`;
            }
          }

          let actionButtons = [];
          if (!isConfirmedAtt) {
            actionButtons.push(`
              <button class="btn-head-action" style="padding: 6px 12px; font-size: 11px; background: #059669; color: #FFF; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="handleMarkAttendance('${b.id}', 'Asistio')" title="Confirmar asistencia y marcar pagado automáticamente">
                <i data-lucide="user-check" style="width: 13px; height: 13px;"></i> ${b.paid ? 'Asistió' : 'Asistió y Pagado'}
              </button>
            `);
          }

          if (!b.paid) {
            actionButtons.push(`
              <button class="btn-head-action" style="padding: 6px 12px; font-size: 11px; background: #0284C7; color: #FFF; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="handleMarkPaid('${b.id}')" title="Registrar pago/cobro en caja">
                <i data-lucide="dollar-sign" style="width: 13px; height: 13px;"></i> Registrar Pago
              </button>
            `);
          }

          if (!isNoShow) {
            actionButtons.push(`
              <button class="btn-head-action" style="padding: 6px 12px; font-size: 11px; background: #EF4444; color: #FFF; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="handleMarkAttendance('${b.id}', 'No Asistio')" title="Marcar inasistencia (aplica deuda y bloqueo)">
                <i data-lucide="user-x" style="width: 13px; height: 13px;"></i> No Asistió
              </button>
            `);
          }

          if (isConfirmedAtt && b.paid) {
            actionButtons.push(`
              <span style="font-size: 11px; color: #059669; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> Completado</span>
            `);
          }

          const actionContent = `<div style="display: flex; gap: 6px; flex-wrap: wrap;">${actionButtons.join('')}</div>`;

          const cleanCourt = fixMojibake(b.courtName || '');
          const cleanClient = fixMojibake(b.clientName || 'Cliente Tacambaro');

          return `
            <tr>
              <td><strong>${b.id}</strong></td>
              <td>${cleanCourt}</td>
              <td><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ${b.timeSlot}</span></td>
              <td>
                <strong style="color:#0F172A;">${cleanClient}</strong>
                <small style="display:block; color:#64748B; font-size:10px;"><i data-lucide="phone" style="width:10px; height:10px; color:#64748B;"></i> ${b.clientPhone || 'Sin telefono'}</small>
              </td>
              <td style="color: #10B981; font-weight: bold;">$${b.price}.00 MXN</td>
              <td>${attPill}</td>
              <td>${paidPill}</td>
              <td>${actionContent}</td>
            </tr>
          `;
        }).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function updateKPIs() {
  const totalIncome = bookingsData.reduce((acc, b) => acc + (parseInt(b.price, 10) || 0), 0);
  const incomeEl = document.getElementById('kpiTotalIncome');
  if (incomeEl) incomeEl.innerHTML = `$${totalIncome}.00 <small>MXN</small>`;

  const activeEl = document.getElementById('kpiActiveBookings');
  if (activeEl) activeEl.innerHTML = `${bookingsData.length} <small>Partidos</small>`;

  const occupancyPercent = (bookingsData.length > 0)
    ? ((bookingsData.length / 48) * 100).toFixed(1)
    : '0.0';
  const occupancyEl = document.getElementById('kpiCourtOccupancy');
  if (occupancyEl) occupancyEl.textContent = `${occupancyPercent}%`;

  const shopSales = (financesData || []).reduce((acc, f) => acc + (parseInt(f.amount, 10) || 0), 0);
  const shopEl = document.getElementById('kpiShopIncome');
  if (shopEl) shopEl.innerHTML = `$${shopSales}.00 <small>MXN</small>`;
}

async function toggleAdminSlot(courtId, slot) {
  try {
    const res = await fetch('/api/admin/toggle-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ courtId, slot })
    });
    if (res.ok) fetchAdminData();
  } catch (err) {
    /* silent error */
  }
}

/* ==========================================
   MODAL DE NUEVA RESERVA DIRECTA / CONTROL
   ========================================== */

function openBookingModal(courtId, startHour) {
  const modal = document.getElementById('bookingModalOverlay');
  if (!modal) return;

  currentSelectedStartHour = startHour || '12:00';

  populateClientDropdown();
  populateCourtDropdowns();

  const courtSelect = document.getElementById('modalCourtSelect');
  const nameInput = document.getElementById('modalClientName');
  const phoneInput = document.getElementById('modalClientPhone');

  if (courtSelect && courtId) courtSelect.value = courtId;

  if (nameInput) {
    nameInput.value = '';
    nameInput.readOnly = false;
  }
  if (phoneInput) {
    phoneInput.value = '';
    phoneInput.readOnly = false;
  }

  const targetDateISO = selectedModalFullDate || `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(selectedModalDay).padStart(2, '0')}`;
  const timeTextEl = document.getElementById('modalSelectedTimeText');
  if (timeTextEl) {
    timeTextEl.textContent = `📅 Fecha: ${targetDateISO} | 🕒 Hora elegida: ${currentSelectedStartHour} hrs`;
  }

  calculateModalTotal();
  modal.style.display = 'flex';

  setTimeout(() => {
    const clientSelect = document.getElementById('modalClientSelect');
    if (clientSelect) clientSelect.focus();
  }, 100);
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModalOverlay');
  if (modal) modal.style.display = 'none';

  const dayModal = document.getElementById('dayAvailabilityModalOverlay');
  if (dayModal && dayModal.style.display !== 'none') {
    renderDay24hGrid();
  }
}

function calculateModalTotal() {
  const courtSelect = document.getElementById('modalCourtSelect');
  const durationSelect = document.getElementById('modalDurationSelect');
  const totalEl = document.getElementById('modalTotalPrice');
  const rangeEl = document.getElementById('modalRangeText');

  if (!courtSelect || !durationSelect || !totalEl) return;

  const courtPrice = 300;
  const hours = parseInt(durationSelect.value, 10) || 1;
  const total = courtPrice * hours;

  const startHourNum = parseInt(currentSelectedStartHour.split(':')[0], 10) || 12;
  const endHourNum = (startHourNum + hours) % 24;

  const startStr = `${String(startHourNum).padStart(2, '0')}:00`;
  const endStr = `${String(endHourNum).padStart(2, '0')}:00`;

  if (rangeEl) {
    rangeEl.textContent = `Horario: ${startStr} a ${endStr} (${hours} hora${hours > 1 ? 's continuas' : ' continua'})`;
  }

  Array.from(durationSelect.options).forEach(opt => {
    const h = parseInt(opt.value, 10);
    const endH = (startHourNum + h) % 24;
    const endFormatted = `${String(endH).padStart(2, '0')}:00`;
    opt.textContent = `${h} hora${h > 1 ? 's' : ''} (${startStr} a ${endFormatted})`;
  });

  totalEl.textContent = `$${total.toFixed(2)} MXN`;
}

/* ==========================================
   TOAST NOTIFICATION SYSTEM (NO BROWSER ALERTS)
   ========================================== */

function showNotification(type, title, message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  container.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  const iconMap = {
    success: '✨',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  const cleanTitle = fixMojibake(title || 'Notificación');
  const cleanMessage = fixMojibake(message || '');

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || '🔔'}</div>
    <div class="toast-content">
      <h4>${cleanTitle}</h4>
      <p>${cleanMessage}</p>
      <button class="toast-close-btn" onclick="this.closest('.toast-item').remove()">Aceptar</button>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'scale(0.9)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
    }
  }, 4000);
}

async function handleModalSubmit(event) {
  event.preventDefault();

  const courtId = document.getElementById('modalCourtSelect').value;
  const clientName = document.getElementById('modalClientName').value.trim();
  const clientPhone = document.getElementById('modalClientPhone').value.trim();
  const durationHours = parseInt(document.getElementById('modalDurationSelect').value, 10);
  const paymentMethod = document.getElementById('modalPaymentMethod').value;
  const targetDateISO = selectedModalFullDate || `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(selectedModalDay).padStart(2, '0')}`;

  if (!clientName || !clientPhone) {
    showNotification('warning', 'Campos Requeridos', 'Por favor selecciona un cliente registrado o ingresa Nombre y Teléfono.');
    return;
  }

  try {
    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        courtId,
        timeSlot: currentSelectedStartHour,
        selectedDate: targetDateISO,
        clientName,
        clientPhone,
        durationHours,
        paymentMethod,
        isAdmin: true
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      if (data.booking && !bookingsData.some(b => b.id === data.booking.id)) {
        bookingsData.unshift(data.booking);
      }

      const startHourNum = parseInt(currentSelectedStartHour.split(':')[0], 10) || 12;
      const endHourNum = (startHourNum + durationHours) % 24;
      const rangeStr = `${currentSelectedStartHour} a ${String(endHourNum).padStart(2, '0')}:00`;

      showNotification('success', '¡Se Guardó la Reserva Correctamente! 📅', `Cliente: ${clientName}\nFecha: ${targetDateISO}\nHorario: ${rangeStr} (${durationHours} hrs continuas)\nTotal: $${data.booking.price}.00 MXN`);
      closeBookingModal();
      renderDay24hGrid();
      renderMonthlyCalendar();
      renderBookingsTable();
      updateKPIs();
      fetchAdminData();
    } else {
      showNotification('error', 'Reserva No Disponible', data.message || 'El horario seleccionado ya no está disponible.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleModalBlockSlot() {
  const courtId = document.getElementById('modalCourtSelect').value;
  await toggleAdminSlot(courtId, currentSelectedStartHour);
  closeBookingModal();
  showNotification('info', 'Horario Actualizado', `Se modificó el estado del horario a las ${currentSelectedStartHour}.`);
}

/* ==========================================
   GESTIÓN DE USUARIOS, WHATSAPP Y EDICIÓN
   ========================================== */

function populateClientDropdown() {
  const select = document.getElementById('modalClientSelect');
  if (!select) return;

  let html = `<option value="">-- Seleccionar Cliente Registrado --</option>`;
  const clients = usersData.filter(u => u.role === 'Cliente');

  clients.forEach(c => {
    const cleanName = fixMojibake(c.name);
    html += `<option value="${c.id}">${cleanName} (📱 ${c.phone})</option>`;
  });

  html += `<option value="custom">+ Registrar cliente no en lista...</option>`;
  select.innerHTML = html;
}

function handleClientDropdownChange() {
  const select = document.getElementById('modalClientSelect');
  const nameInput = document.getElementById('modalClientName');
  const phoneInput = document.getElementById('modalClientPhone');

  if (!select || !nameInput || !phoneInput) return;

  const val = select.value;
  if (!val || val === 'custom') {
    nameInput.value = '';
    phoneInput.value = '';
    nameInput.readOnly = false;
    phoneInput.readOnly = false;
    if (val === 'custom') nameInput.focus();
    return;
  }

  const client = usersData.find(u => u.id === val);
  if (client) {
    nameInput.value = client.name;
    phoneInput.value = client.phone;
    nameInput.readOnly = true;
    phoneInput.readOnly = true;
  }
}

function openCreateUserModal() {
  const modal = document.getElementById('createUserModalOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeCreateUserModal() {
  const modal = document.getElementById('createUserModalOverlay');
  if (modal) modal.style.display = 'none';
}

async function handleCreateUserSubmit(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('newUsername');
  const username = usernameInput ? usernameInput.value.trim() : '';
  const name = document.getElementById('newUserName').value.trim();
  const phone = document.getElementById('newUserPhone').value.trim();
  const role = document.getElementById('newUserRole').value;

  if (!name || !phone || !username) {
    showNotification('warning', 'Campos Incompletos', 'Ingresa Usuario, Nombre y Teléfono.');
    return;
  }

  try {
    const res = await fetch('/api/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ username, name, phone, role })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      closeCreateUserModal();
      document.getElementById('createUserModalForm').reset();
      fetchAdminUsers();

      showNotification('success', '¡Se Registró el Usuario Correctamente! 👤', `Usuario: ${data.user.username}\nCliente: ${data.user.name}\nClave Temporal: ${data.user.tempPassword}`);

      // Auto open WhatsApp chat with client
      sendWhatsAppCredentials(data.user.id);
    } else {
      showNotification('error', 'Error al Crear', 'No se pudo crear el usuario.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function sendWhatsAppCredentials(userId) {
  const user = usersData.find(u => u.id === userId);
  if (!user) return;

  let rawPhone = (user.phone || '').replace(/\D/g, '');
  if (rawPhone.length === 10 && !rawPhone.startsWith('52')) {
    rawPhone = '52' + rawPhone;
  }
  const cleanPhone = rawPhone;
  const usernameDisplay = user.username || user.phone;

  const message = `🎾 *Level Tacámbaro*\n\n¡Hola *${user.name}*! Te enviamos tus credenciales de acceso para la App Móvil:\n\n👤 *Usuario:* ${usernameDisplay}\n🔑 *Contraseña Temporal:* ${user.tempPassword}\n\n⚠️ *Importante:* Al ingresar por primera vez a la aplicación, se te solicitará cambiar tu contraseña por seguridad.\n\n📍 Level Tacámbaro, Michoacán.`;

  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  showNotification('info', 'WhatsApp Abierto', `Se abrió el chat con ${user.name} para enviar sus credenciales.`);
}

function openEditUserModal(userId) {
  const user = usersData.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  const editUsernameInput = document.getElementById('editUsername');
  if (editUsernameInput) editUsernameInput.value = user.username || '';
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserPhone').value = user.phone;
  document.getElementById('editUserRole').value = user.role;

  const modal = document.getElementById('editUserModalOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeEditUserModal() {
  const modal = document.getElementById('editUserModalOverlay');
  if (modal) modal.style.display = 'none';
}

async function handleEditUserSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('editUserId').value;
  const usernameInput = document.getElementById('editUsername');
  const username = usernameInput ? usernameInput.value.trim() : '';
  const name = document.getElementById('editUserName').value.trim();
  const phone = document.getElementById('editUserPhone').value.trim();
  const role = document.getElementById('editUserRole').value;

  if (!name || !phone || !username) {
    showNotification('warning', 'Campos Incompletos', 'Completa Usuario, Nombre y Teléfono.');
    return;
  }

  try {
    const res = await fetch('/api/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ id, username, name, phone, role })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      const idx = usersData.findIndex(u => u.id === id);
      if (idx !== -1) {
        usersData[idx] = { ...usersData[idx], ...data.user };
      }
      showNotification('success', '¡Se Editó el Usuario Correctamente! ✏️', `Se guardaron los cambios para @${data.user.username || data.user.name}.`);
      closeEditUserModal();
      fetchAdminUsers();
    } else {
      showNotification('error', 'Error al Actualizar', 'No se pudo actualizar el usuario.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleResetUserPassword(userId) {
  const user = usersData.find(u => u.id === userId);
  if (!user) return;

  try {
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ id: userId })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      showNotification('success', '¡Se Restableció la Clave Correctamente! 🔑', `Nueva clave temporal para ${data.user.name}: ${data.user.tempPassword}`);
      fetchAdminUsers();
      sendWhatsAppCredentials(userId);
    } else {
      showNotification('error', 'Error al Resetear', 'No se pudo resetear la clave.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function fetchAdminUsers() {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      usersData = await res.json();
      renderUsersTable();
      populateClientDropdown();
    }
  } catch (err) { }
}

async function handleDeleteUser(userId) {
  const user = usersData.find(u => u.id === userId);
  const cleanName = user ? fixMojibake(user.name) : 'este usuario';

  showConfirmModal(
    '¿Eliminar Usuario?',
    `¿Estás seguro de que deseas eliminar permanentemente a ${cleanName}? Se borrará su acceso a la App.`,
    'Sí, Eliminar Usuario',
    async () => {
      try {
        const res = await fetch('/api/users/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ id: userId })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showNotification('success', 'Usuario Eliminado', `Se eliminó a ${cleanName} correctamente.`);
          fetchAdminUsers();
        } else {
          showNotification('error', 'Error al Eliminar', data.message || 'No se pudo eliminar el usuario.');
        }
      } catch (err) {
        showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
      }
    }
  );
}

function renderUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  if (usersData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 16px;">No hay usuarios registrados aún.</td></tr>`;
    return;
  }

  tbody.innerHTML = usersData.map(u => {
    const cleanName = fixMojibake(u.name || '');
    let statusPills = '';
    
    if (u.mustChangePassword) {
      statusPills += `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap;">
          <i data-lucide="alert-triangle" style="width: 13px; height: 13px; color: #D97706;"></i> Clave Temporal (Exige Cambio)
        </span>
      `;
    } else {
      statusPills += `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap;">
          <i data-lucide="check-circle-2" style="width: 13px; height: 13px; color: #059669;"></i> Activo (Password Personalizada)
        </span>
      `;
    }

    if (u.hasDebt) {
      statusPills += `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap; margin-top: 4px;">
          <i data-lucide="alert-circle" style="width: 13px; height: 13px; color: #DC2626;"></i> Adeudo: $${u.debtAmount || 300}.00 MXN
        </span>
      `;
    }

    let debtBtn = '';
    if (u.hasDebt) {
      debtBtn = `
        <button class="btn-head-action" style="padding: 5px 10px; font-size: 11px; background: #DC2626; color: #FFF; display: inline-flex; align-items: center; gap: 4px;" onclick="openPosSaleForUser('${cleanName}', ${u.debtAmount || 300})" title="Cobrar adeudo atrasado en Finanzas">
          <i data-lucide="credit-card" style="width: 13px; height: 13px;"></i> Cobrar Deuda ($${u.debtAmount || 300})
        </button>
      `;
    }

    return `
    <tr>
      <td><strong>${u.id}</strong></td>
      <td><span style="font-weight: 700; color: #0284C7; background: #F0F9FF; padding: 3px 8px; border-radius: 6px; font-family: monospace;">@${u.username || u.phone}</span></td>
      <td><strong>${cleanName}</strong></td>
      <td style="white-space: nowrap;">
        <i data-lucide="phone" style="width: 13px; height: 13px; color: #0284C7; vertical-align: middle; margin-right: 4px;"></i>${u.phone}
      </td>
      <td>
        <span class="badge-status-pill ${u.role === 'Administrador' ? 'status-playing' : 'status-reserved'}">${u.role}</span>
      </td>
      <td><code style="background: #F1F5F9; padding: 4px 8px; border-radius: 6px; font-weight: 800; color: #0284C7; font-family: monospace;">${u.tempPassword || 'TAC-****'}</code></td>
      <td>
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
          ${statusPills}
        </div>
      </td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          ${debtBtn}
          <button class="btn-head-action btn-cyan" style="padding: 5px 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="sendWhatsAppCredentials('${u.id}')" title="Enviar clave por WhatsApp">
            <i data-lucide="message-square" style="width: 13px; height: 13px;"></i> WhatsApp
          </button>
          <button class="btn-head-action btn-dark" style="padding: 5px 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="openEditUserModal('${u.id}')" title="Editar Nombre/Teléfono/Rol">
            <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i> Editar
          </button>
          <button class="btn-head-action btn-green" style="padding: 5px 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="handleResetUserPassword('${u.id}')" title="Generar nueva clave temporal">
            <i data-lucide="key" style="width: 13px; height: 13px;"></i> Nueva Clave
          </button>
          <button class="btn-head-action btn-danger" style="padding: 5px 10px; font-size: 11px; background: #EF4444; color: #FFF; display: inline-flex; align-items: center; gap: 4px;" onclick="handleDeleteUser('${u.id}')" title="Eliminar usuario permanentemente">
            <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i> Eliminar
          </button>
        </div>
      </td>
    </tr>
  `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

/* ==========================================
   MÓDULO DE FINANZAS & CONTROL DE CAJA
   ========================================== */

let currentFinanceFilter = 'all';

function setFinanceFilter(filter, btnEl) {
  currentFinanceFilter = filter;
  document.querySelectorAll('.fin-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderFinancesTable();
}

async function fetchAdminFinances() {
  try {
    const res = await fetch('/api/finances');
    if (res.ok) {
      financesData = await res.json();
      renderFinancesTable();
      renderFinancesKPIs();
    }
  } catch (err) {
    /* silent error */
  }
}

function renderFinancesTable() {
  const tbody = document.getElementById('adminFinancesTableBody');
  if (!tbody) return;

  let filtered = financesData;
  if (currentFinanceFilter === 'canchas') {
    filtered = financesData.filter(f => f.category === 'Reserva Canchas');
  } else if (currentFinanceFilter === 'tienda') {
    filtered = financesData.filter(f => f.category !== 'Reserva Canchas');
  } else if (currentFinanceFilter === 'efectivo') {
    filtered = financesData.filter(f => f.paymentMethod && f.paymentMethod.toLowerCase().includes('efectivo'));
  } else if (currentFinanceFilter === 'tarjeta') {
    filtered = financesData.filter(f => f.paymentMethod && !f.paymentMethod.toLowerCase().includes('efectivo'));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 20px;">No hay movimientos financieros registrados para este filtro.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(f => {
    let methodBadge = `<span class="badge-status-pill" style="background:#F0F9FF; color:#0284C7; border:1px solid #BAE6FD; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="banknote" style="width:12px; height:12px;"></i> Efectivo</span>`;
    if (f.paymentMethod && f.paymentMethod.toLowerCase().includes('tarjeta')) {
      methodBadge = `<span class="badge-status-pill" style="background:#F5F3FF; color:#7C3AED; border:1px solid #DDD6FE; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="credit-card" style="width:12px; height:12px;"></i> Tarjeta</span>`;
    } else if (f.paymentMethod && f.paymentMethod.toLowerCase().includes('transferencia')) {
      methodBadge = `<span class="badge-status-pill" style="background:#F0FDF4; color:#166534; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="landmark" style="width:12px; height:12px;"></i> Transferencia</span>`;
    }

    const cat = (f.category || '').toLowerCase();
    let catBadge = `<span class="badge-status-pill" style="background:#FEF3C7; color:#B45309; border:1px solid #FDE68A; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="shopping-bag" style="width:12px; height:12px;"></i> Tienda</span>`;
    if (cat.includes('cancha') || cat.includes('reserva')) {
      catBadge = `<span class="badge-status-pill" style="background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="calendar" style="width:12px; height:12px;"></i> Cancha</span>`;
    } else if (cat.includes('adeudo') || cat.includes('deuda')) {
      catBadge = `<span class="badge-status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FCA5A5; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="alert-circle" style="width:12px; height:12px;"></i> Adeudo</span>`;
    }

    const cleanConcept = fixMojibake(f.concept || '');
    const cleanClient = fixMojibake(f.clientName || 'Cliente Mostrador');

    return `
      <tr>
        <td><strong style="font-family: monospace; color: #475569;">${f.id}</strong></td>
        <td style="white-space: nowrap;"><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ${f.date}</span></td>
        <td><strong>${cleanClient}</strong></td>
        <td>${cleanConcept}</td>
        <td>${catBadge}</td>
        <td>${methodBadge}</td>
        <td style="color: #10B981; font-weight: 800; font-size: 14px;">+$${f.amount}.00 MXN</td>
        <td><span class="badge-status-pill" style="background:#F0FDF4; color:#15803D; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="check-circle" style="width:12px; height:12px;"></i> Ingresado</span></td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function renderFinancesKPIs() {
  const totalIngresos = financesData.reduce((acc, f) => acc + (f.amount || 0), 0);
  const totalEfectivo = financesData.filter(f => f.paymentMethod && f.paymentMethod.toLowerCase().includes('efectivo')).reduce((acc, f) => acc + (f.amount || 0), 0);
  const totalDigital = totalIngresos - totalEfectivo;
  const totalAdeudos = (usersData || []).reduce((acc, u) => acc + (u.debtAmount || 0), 0);

  const elIngresos = document.getElementById('finTotalIngresos');
  const elEfectivo = document.getElementById('finTotalEfectivo');
  const elDigital = document.getElementById('finTotalDigital');
  const elAdeudos = document.getElementById('finTotalAdeudos');

  if (elIngresos) elIngresos.innerHTML = `$${totalIngresos}.00 <small>MXN</small>`;
  if (elEfectivo) elEfectivo.innerHTML = `$${totalEfectivo}.00 <small>MXN</small>`;
  if (elDigital) elDigital.innerHTML = `$${totalDigital}.00 <small>MXN</small>`;
  if (elAdeudos) elAdeudos.innerHTML = `$${totalAdeudos}.00 <small>MXN</small>`;
}

/* ==========================================
   COBRO MANUAL EN MOSTRADOR (VENTA TIENDA / POS)
========================================== */
function openPosSaleModal() {
  const overlay = document.getElementById('posSaleModalOverlay');
  if (!overlay) return;

  overlay.style.display = 'flex';
  const debtorSel = document.getElementById('posDebtorSelect');
  if (debtorSel) {
    const debtorList = [];

    (usersData || []).forEach(u => {
      if (u.hasDebt || (u.debtAmount && u.debtAmount > 0)) {
        debtorList.push({
          name: u.name,
          phone: u.phone,
          amount: u.debtAmount || 300,
          reason: u.debtReason || 'Inasistencia No-Show'
        });
      }
    });

    (bookingsData || []).forEach(b => {
      const att = (b.attendance || '').toLowerCase();
      if ((att.includes('no asist') || att.includes('deuda')) && !b.paid) {
        const exists = debtorList.find(d => d.name && b.clientName && d.name.toLowerCase() === b.clientName.toLowerCase());
        if (!exists) {
          debtorList.push({
            name: b.clientName,
            phone: b.clientPhone,
            amount: b.price || 300,
            reason: `Inasistencia ${b.id}`
          });
        }
      }
    });

    if (debtorList.length === 0) {
      debtorSel.innerHTML = '<option value="">-- No hay deudores pendientes registrados --</option>';
    } else {
      debtorSel.innerHTML = '<option value="">-- Seleccionar cliente deudor --</option>' +
        debtorList.map(d => `<option value="${d.name}" data-amount="${d.amount}">${d.name} — Adeudo: $${d.amount}.00 MXN (${d.reason})</option>`).join('');
    }
  }

  document.getElementById('posConceptInput').value = '';
  document.getElementById('posAmountInput').value = '300';
  document.getElementById('posPaymentMethodSelect').value = 'Efectivo en Mostrador';
  document.getElementById('posClientInput').value = '';

  if (window.lucide) lucide.createIcons();
}

function closePosSaleModal() {
  const overlay = document.getElementById('posSaleModalOverlay');
  if (overlay) overlay.style.display = 'none';
}

function openPosSaleForUser(userName, debtAmount) {
  openPosSaleModal();
  const presetSel = document.getElementById('posPresetSelect');
  if (presetSel) presetSel.value = 'adeudo';
  const conceptInp = document.getElementById('posConceptInput');
  if (conceptInp) conceptInp.value = `Recuperación de Adeudo Atrasado: ${userName} (No-Show)`;
  const amountInp = document.getElementById('posAmountInput');
  if (amountInp) amountInp.value = debtAmount || 300;
  const categorySel = document.getElementById('posCategorySelect');
  if (categorySel) categorySel.value = 'Recuperación de Adeudo';
  const clientInp = document.getElementById('posClientInput');
  if (clientInp) clientInp.value = userName;
}

function handlePosPresetChange(selectEl) {
  const selectedOpt = selectEl.options[selectEl.selectedIndex];
  const conceptInput = document.getElementById('posConceptInput');
  const amountInput = document.getElementById('posAmountInput');
  const categorySelect = document.getElementById('posCategorySelect');

  if (selectEl.value === 'custom') {
    if (conceptInput) conceptInput.value = '';
    if (amountInput) amountInput.value = '';
  } else {
    const concept = selectedOpt.getAttribute('data-concept');
    const price = selectedOpt.getAttribute('data-price');
    if (conceptInput && concept) conceptInput.value = concept;
    if (amountInput && price) amountInput.value = price;

    if (selectEl.value === 'adeudo') {
      if (categorySelect) categorySelect.value = 'Recuperación de Adeudo';
    } else if (selectEl.value === 'pala' || selectEl.value === 'overgrip') {
      if (categorySelect) categorySelect.value = 'Alquiler Equipo';
    } else if (selectEl.value === 'bebida' || selectEl.value === 'agua') {
      if (categorySelect) categorySelect.value = 'Snacks & Bebidas';
    } else {
      if (categorySelect) categorySelect.value = 'Tienda / Pro Shop';
    }
  }
}

async function handlePosSaleSubmit(e) {
  e.preventDefault();
  const concept = document.getElementById('posConceptInput').value.trim();
  const amount = parseFloat(document.getElementById('posAmountInput').value);
  const categoryEl = document.getElementById('posCategorySelect');
  const category = categoryEl ? categoryEl.value : 'Recuperación de Adeudo';
  const paymentMethod = document.getElementById('posPaymentMethodSelect').value;
  const clientName = document.getElementById('posClientInput').value.trim() || 'Cliente Mostrador';

  if (!concept || isNaN(amount) || amount <= 0) {
    showNotification('error', 'Datos Inválidos', 'Por favor ingresa un concepto y monto válido mayor a $0.');
    return;
  }

  try {
    const res = await fetch('/api/finances/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ concept, amount, category, paymentMethod, clientName })
    });
    const text = await res.text();
    let data = {};
    try {
      const cleanText = text ? text.trim().replace(/^\uFEFF/, '') : '{}';
      data = JSON.parse(cleanText);
    } catch (e) {
      console.warn('Response JSON parse warning:', e);
    }

    if ((res.ok || data.success || data.finance) && data.success !== false) {
      if (data.finance) {
        financesData.unshift(data.finance);
      }
      renderFinancesTable();
      renderFinancesKPIs();
      closePosSaleModal();

      if (category === 'Recuperación de Adeudo' || category === 'Recuperacion de Adeudo' || concept.toLowerCase().includes('adeudo') || concept.toLowerCase().includes('deuda')) {
        showNotification('success', '¡Adeudo Cobrado Correctamente! 💳', `Se ingresaron $${amount}.00 MXN a caja por cobro de adeudo atrasado. El cliente "${clientName}" ha sido desbloqueado.`);
      } else {
        showNotification('success', '¡Venta Registrada Correctamente! 🛒', `Se ingresaron $${amount}.00 MXN a caja por: ${concept}`);
      }
      fetchAdminData();
      fetchAdminUsers();
      fetchAdminFinances();
    } else {
      showNotification('error', 'Error al Registrar', data.message || 'No se pudo guardar la transacción.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleMarkAttendance(bookingId, attendance) {
  try {
    const res = await fetch('/api/bookings/mark-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId, attendance })
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (e) { }

    if (res.ok && data.success) {
      const idx = bookingsData.findIndex(b => b.id === bookingId);
      if (idx !== -1 && data.booking) {
        bookingsData[idx] = data.booking;
      }
      renderBookingsTable();

      if (String(attendance).toLowerCase().includes('no')) {
        showNotification('error', '¡Inasistencia Registrada! 🛑', `Se marco inasistencia para la reserva ${bookingId}. El cliente adquirio un saldo pendiente y quedo bloqueado en la App.`);
      } else {
        showNotification('success', '¡Asistencia y Pago Confirmados! 🎯', `Se confirmo la asistencia del cliente para la reserva ${bookingId} y se registro el pago correspondientes.`);
      }
      fetchAdminData();
      fetchAdminUsers();
      fetchAdminFinances();
    } else {
      showNotification('error', 'Error al Marcar', data.message || 'No se pudo registrar la asistencia.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleMarkPaid(bookingId) {
  try {
    const res = await fetch('/api/bookings/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId, paymentMethod: 'Efectivo en Mostrador' })
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (e) { }

    if (res.ok && data.success) {
      const idx = bookingsData.findIndex(b => b.id === bookingId);
      if (idx !== -1 && data.booking) {
        bookingsData[idx] = data.booking;
      }
      renderBookingsTable();
      const amountStr = (data.booking && data.booking.price) ? `$${data.booking.price}.00 MXN` : '';
      showNotification('success', '¡Pago Registrado!', `Pago de ${amountStr} registrado y enviado automáticamente al módulo de Finanzas.`);
      fetchAdminData();
      fetchAdminFinances();
      fetchAdminUsers();
    } else {
      showNotification('error', 'Error al Pagar', data.message || 'No se pudo registrar el pago.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

/* ==========================================
   MÓDULO DE HISTORIA, MARCA Y GALERÍA MULTIMEDIA
   ========================================== */

let clubHistoryData = {
  name: 'Level Tacámbaro',
  address: 'Valentín Gómez Farías #3, Tacámbaro, Michoacán (frente a Protección Civil)',
  phone: '459 102 3849',
  logo: 'assets/images/logo.jpeg',
  description: 'Level Tacámbaro nació con la visión de consolidar el primer centro deportivo de pádel de alto nivel en Tacámbaro, Michoacán. Nuestro club cuenta con 2 pistas de tecnología profesional (Pádel Cristal Pro y Panorámica VIP), iluminación LED nocturna de alta definición, área de espectadores, servicio de pro shop con alquiler de palas y pelotas, y atención personalizada las 24 horas del día.',
  gallery: [
    { title: 'Pista 1: Pádel Cristal Pro (Azul)', url: 'assets/images/cancha_padel_1.jpg' },
    { title: 'Pista 2: Pádel Panorámica VIP (Verde)', url: 'assets/images/cancha_padel_2.jpg' },
    { title: 'Cancha Grama Sintética Pro', url: 'assets/images/cancha_grama_7.jpg' },
    { title: 'Cancha de Entrenamientos 5', url: 'assets/images/cancha_sintetica_5.jpg' },
    { title: 'Cancha Techada & Alumbrado LED', url: 'assets/images/cancha_techada.jpg' }
  ]
};

async function fetchHistoryData() {
  try {
    const res = await fetch('/api/history');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        clubHistoryData = { ...clubHistoryData, ...data };
        populateHistoryFields();
      }
    }
  } catch (err) {
    populateHistoryFields();
  }
}

function populateHistoryFields() {
  const elName = document.getElementById('historyClubName');
  const elAddress = document.getElementById('historyClubAddress');
  const elPhone = document.getElementById('historyClubPhone');
  const elDesc = document.getElementById('historyDescriptionText');
  const elLogo = document.getElementById('historyLogoPreview');
  const elCover = document.getElementById('historyCoverPreview');
  const elTitle = document.getElementById('historyClubTitleHeader');

  if (elName) elName.value = clubHistoryData.name || '';
  if (elAddress) elAddress.value = clubHistoryData.address || '';
  if (elPhone) elPhone.value = clubHistoryData.phone || '';
  if (elDesc) elDesc.value = clubHistoryData.description || '';
  if (elLogo && clubHistoryData.logo) elLogo.src = clubHistoryData.logo;
  if (elCover && clubHistoryData.coverImage) elCover.src = clubHistoryData.coverImage;
  if (elTitle) elTitle.textContent = clubHistoryData.name || 'Level Tacámbaro';

  renderHistoryGallery();
}

function renderHistoryGallery() {
  const container = document.getElementById('historyGalleryContainer');
  const titleCountEl = document.getElementById('adminGalleryTitleCount');
  const count = (clubHistoryData.gallery || []).length;

  if (titleCountEl) {
    titleCountEl.innerHTML = `🖼️ Galería Fotográfica de Instalaciones <span style="font-size: 12px; font-weight: 700; color: #0284C7; background: rgba(2,132,199,0.1); padding: 2px 8px; border-radius: 10px;">(${count} fotos cargadas)</span>`;
  }

  if (!container) return;

  if (!clubHistoryData.gallery || clubHistoryData.gallery.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #94A3B8; padding: 24px; border: 2px dashed #E2E8F0; border-radius: 12px;">No hay imágenes en la galería aún. Haz clic en "+ Subir Nuevas Imágenes".</div>`;
    return;
  }

  container.innerHTML = clubHistoryData.gallery.map((item, index) => `
    <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
      <div style="position: relative; width: 100%; height: 140px; overflow: hidden; background: #0F172A;">
        <img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/cancha_padel_1.jpg'">
      </div>
      <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <input type="text" style="width: 100%; padding: 6px 8px; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 11px; font-weight: 700; margin-bottom: 8px;" value="${item.title || 'Foto de Instalación'}" onchange="updateGalleryTitle(${index}, this.value)">
        <button class="btn-head-action btn-danger" style="padding: 4px 8px; font-size: 11px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 4px;" onclick="removeGalleryItem(${index})">
          <i data-lucide="trash-2"></i> Eliminar Foto
        </button>
      </div>
    </div>
  `).join('');
}

function updateGalleryTitle(index, newTitle) {
  if (clubHistoryData.gallery && clubHistoryData.gallery[index]) {
    clubHistoryData.gallery[index].title = newTitle;
    handleSaveHistory(true);
  }
}

function removeGalleryItem(index) {
  if (clubHistoryData.gallery) {
    clubHistoryData.gallery.splice(index, 1);
    renderHistoryGallery();
    handleSaveHistory(true);
    showNotification('info', 'Foto Eliminada', 'Se eliminó la imagen de la galería y se guardó en el servidor.');
  }
}

function handleLogoFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const logoUrl = e.target.result;
    clubHistoryData.logo = logoUrl;
    const elLogo = document.getElementById('historyLogoPreview');
    if (elLogo) elLogo.src = logoUrl;
    handleSaveHistory(true);
    showNotification('success', 'Nuevo Logo Cargado', 'Se guardó el nuevo logo en el servidor.');
  };
  reader.readAsDataURL(file);
}

function handleCoverFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const coverUrl = e.target.result;
    clubHistoryData.coverImage = coverUrl;
    const elCover = document.getElementById('historyCoverPreview');
    if (elCover) elCover.src = coverUrl;
    handleSaveHistory(true);
    showNotification('success', 'Nueva Foto de Portada', 'Se guardó la nueva foto de fondo en el servidor y se actualizó la App.');
  };
  reader.readAsDataURL(file);
}

function handleGalleryFilesSelect(event) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  let loadedCount = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgUrl = e.target.result;
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (!clubHistoryData.gallery) clubHistoryData.gallery = [];
      clubHistoryData.gallery.push({ title, url: imgUrl });
      loadedCount++;
      if (loadedCount === files.length) {
        renderHistoryGallery();
        handleSaveHistory(true);
        showNotification('success', 'Imágenes Agregadas', `Se agregaron y guardaron ${files.length} nueva(s) imagen(es).`);
      }
    };
    reader.readAsDataURL(file);
  });
}

async function handleSaveHistory(isSilent = false) {
  const elName = document.getElementById('historyClubName');
  const elAddress = document.getElementById('historyClubAddress');
  const elPhone = document.getElementById('historyClubPhone');
  const elDesc = document.getElementById('historyDescriptionText');

  if (elName && elName.value.trim()) clubHistoryData.name = elName.value.trim();
  if (elAddress && elAddress.value.trim()) clubHistoryData.address = elAddress.value.trim();
  if (elPhone && elPhone.value.trim()) clubHistoryData.phone = elPhone.value.trim();
  if (elDesc && elDesc.value.trim()) clubHistoryData.description = elDesc.value.trim();

  try {
    const res = await fetch('/api/history/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(clubHistoryData)
    });
    const text = await res.text();
    let data = {};
    try {
      const cleanText = text ? text.trim().replace(/^\uFEFF/, '') : '{}';
      data = JSON.parse(cleanText);
    } catch (e) { }

    if ((res.ok || data.success) && data.success !== false) {
      if (data.history) {
        clubHistoryData = { ...clubHistoryData, ...data.history };
      }
      populateHistoryFields();
      if (!isSilent) {
        showNotification('success', '¡Quienes Somos & Galeria Guardados! 💾', 'Los cambios se guardaron exitosamente y ya estan sincronizados en tiempo real.');
      }
    } else {
      if (!isSilent) showNotification('error', 'Error al Guardar', 'No se pudieron guardar los cambios de historia.');
    }
  } catch (err) {
    if (!isSilent) showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

/* ==========================================
   MÓDULO DE GESTIÓN DE PRODUCTOS E INVENTARIO
   ========================================== */

let currentProductFilter = 'all';

async function fetchAdminProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      const map = new Map();
      (data || []).forEach(item => {
        if (item && item.id) map.set(item.id, item);
      });
      productsData = Array.from(map.values());
      updateCategoryDropdowns();
      renderProductsTable();
      renderTpvGrid();
    }
  } catch (err) {
    /* silent error */
  }
}

/* Categorías Dinámicas */
function openAddCategoryModal() {
  const overlay = document.getElementById('modalAddCategoryOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    const input = document.getElementById('newCategoryNameInput');
    if (input) input.value = '';
  }
}

function closeAddCategoryModal() {
  const overlay = document.getElementById('modalAddCategoryOverlay');
  if (overlay) overlay.style.display = 'none';
}

function handleAddCategorySubmit(e) {
  e.preventDefault();
  const input = document.getElementById('newCategoryNameInput');
  const catName = input ? input.value.trim() : '';
  if (!catName) return;

  if (!productCategories.includes(catName)) {
    productCategories.push(catName);
  }

  updateCategoryDropdowns();
  closeAddCategoryModal();

  const prodCatSelect = document.getElementById('prodCategorySelect');
  if (prodCatSelect) prodCatSelect.value = catName;

  showNotification('success', 'Categoría Creada', `Se agregó "${catName}" a la lista de categorías.`);
}

function updateCategoryDropdowns() {
  const prodCatSelect = document.getElementById('prodCategorySelect');
  if (prodCatSelect) {
    const currentVal = prodCatSelect.value;
    prodCatSelect.innerHTML = productCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    if (productCategories.includes(currentVal)) prodCatSelect.value = currentVal;
  }
}

function setProductFilter(filterCategory, btnEl) {
  currentProductFilter = filterCategory;
  document.querySelectorAll('.prod-filter-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderProductsTable();
}

function getProductDefaultImage(category, name) {
  const n = (name || '').toLowerCase();
  const c = (category || '').toLowerCase();
  if (n.includes('pelota') || n.includes('head tour') || c.includes('pelota')) {
    return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';
  }
  if (n.includes('overgrip') || n.includes('babolat') || n.includes('pala')) {
    return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&auto=format&fit=crop';
  }
  if (n.includes('electrolit') || n.includes('gatorade') || n.includes('bebida') || c.includes('snack')) {
    return 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop';
  }
  if (n.includes('agua') || n.includes('1l') || n.includes('embotellada')) {
    return 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop';
  }
  if (n.includes('gorra') || c.includes('indumentaria') || n.includes('playera')) {
    return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';
}

function handleProductFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    const dataUrl = evt.target.result;
    const input = document.getElementById('prodImageInput');
    if (input) input.value = dataUrl;
    updateProductImagePreview();
  };
  reader.readAsDataURL(file);
}

function updateProductImagePreview() {
  const input = document.getElementById('prodImageInput');
  const wrapper = document.getElementById('prodImagePreviewWrapper');
  const img = document.getElementById('prodImagePreview');
  if (!input || !wrapper || !img) return;

  const val = input.value.trim();
  if (val) {
    img.src = val;
    wrapper.style.display = 'flex';
  } else {
    wrapper.style.display = 'none';
  }
}

function setProductImagePreset(type) {
  const input = document.getElementById('prodImageInput');
  if (!input) return;
  const presets = {
    pelotas: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop',
    overgrip: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&auto=format&fit=crop',
    bebida: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop',
    agua: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop',
    gorra: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&auto=format&fit=crop'
  };
  if (presets[type]) {
    input.value = presets[type];
    updateProductImagePreview();
  }
}

function renderProductsTable() {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  let filtered = productsData;
  if (currentProductFilter !== 'all') {
    filtered = productsData.filter(p => p.category === currentProductFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 20px;">No hay productos registrados en esta categoría.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isOut = (p.stock <= 0);
    const isLow = (p.stock > 0 && p.stock <= 10);

    let stockBadge = '';
    if (isOut) {
      stockBadge = `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap;">
          <i data-lucide="x-circle" style="width: 13px; height: 13px; color: #DC2626;"></i> Agotado (0 Uds)
        </span>
      `;
    } else if (isLow) {
      stockBadge = `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap;">
          <i data-lucide="alert-triangle" style="width: 13px; height: 13px; color: #D97706;"></i> Stock Bajo (${p.stock} Uds)
        </span>
      `;
    } else {
      stockBadge = `
        <span style="display: inline-flex; align-items: center; gap: 5px; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; padding: 4px 9px; border-radius: 8px; font-size: 11px; font-weight: 800; white-space: nowrap;">
          <i data-lucide="check-circle-2" style="width: 13px; height: 13px; color: #059669;"></i> ${p.stock} Uds En Stock
        </span>
      `;
    }

    const cleanName = fixMojibake(p.name || '');
    const cleanCategory = fixMojibake(p.category || '');
    const imgUrl = p.imageUrl || getProductDefaultImage(cleanCategory, cleanName);

    return `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${imgUrl}" alt="${cleanName}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #E2E8F0; flex-shrink: 0;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';">
            <div>
              <strong style="color: #0F172A; font-size: 13px; display: block;">${cleanName}</strong>
            </div>
          </div>
        </td>
        <td><span class="badge-status-pill status-reserved" style="background:#F1F5F9; color:#475569;">${cleanCategory}</span></td>
        <td style="color: #10B981; font-weight: 800; font-size: 15px;">$${p.price}.00 MXN</td>
        <td>${stockBadge}</td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn-head-action btn-dark" style="padding: 5px 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="openEditProductModal('${p.id}')" title="Editar nombre, precio o stock">
              <i data-lucide="edit-3" style="width: 13px; height: 13px;"></i> Editar
            </button>
            <button class="btn-head-action btn-danger" style="padding: 5px 10px; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;" onclick="handleDeleteProduct('${p.id}')" title="Eliminar producto">
              <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
  renderTpvGrid();
}

/* ==========================================
   TICKET & CARRITO DE PUNTO DE VENTA (TPV)
   ========================================== */
let tpvTicketCart = [];

function addToTpvTicket(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;

  if (p.stock <= 0) {
    showNotification('error', 'Stock Agotado', `El producto "${p.name}" no tiene unidades disponibles.`);
    return;
  }

  const existing = tpvTicketCart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty < p.stock) {
      existing.qty++;
    } else {
      showNotification('error', 'Límite de Stock', `Solo hay ${p.stock} unidades disponibles de ${p.name}.`);
    }
  } else {
    tpvTicketCart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      imageUrl: p.imageUrl || getProductDefaultImage(p.category, p.name),
      qty: 1
    });
  }

  renderTpvTicket();
}

function updateTicketItemQty(productId, delta) {
  const item = tpvTicketCart.find(i => i.id === productId);
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    removeFromTpvTicket(productId);
    return;
  }

  const p = productsData.find(prod => prod.id === productId);
  if (p && newQty > p.stock) {
    showNotification('error', 'Límite de Stock', `Supera el stock disponible (${p.stock} uds).`);
    return;
  }

  item.qty = newQty;
  renderTpvTicket();
}

function removeFromTpvTicket(productId) {
  tpvTicketCart = tpvTicketCart.filter(i => i.id !== productId);
  renderTpvTicket();
}

function clearTpvTicket() {
  tpvTicketCart = [];
  renderTpvTicket();
}

function renderTpvTicket() {
  const container = document.getElementById('tpvTicketItemsContainer');
  const subtotalEl = document.getElementById('tpvSubtotalDisplay');
  const totalEl = document.getElementById('tpvTotalDisplay');
  if (!container) return;

  if (tpvTicketCart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: #94A3B8; padding: 40px 10px; font-size: 13px;">
        🛒 El ticket está vacío.<br>Haz clic en los productos para agregarlos.
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00 MXN';
    if (totalEl) totalEl.textContent = '$0.00 MXN';
    return;
  }

  let total = 0;
  container.innerHTML = tpvTicketCart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    const imgUrl = item.imageUrl || getProductDefaultImage(item.category, item.name);
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 10px; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; flex: 1; padding-right: 8px; overflow: hidden;">
          <img src="${imgUrl}" alt="${item.name}" style="width: 36px; height: 36px; border-radius: 8px; object-fit: cover; border: 1px solid #CBD5E1; margin-right: 10px; flex-shrink: 0;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';">
          <div style="overflow: hidden; text-overflow: ellipsis;">
            <div style="font-weight: 700; font-size: 12px; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
            <div style="font-size: 11px; color: #64748B;">$${item.price}.00 MXN c/u</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <button type="button" onclick="updateTicketItemQty('${item.id}', -1)" style="background: #E2E8F0; border: none; border-radius: 4px; width: 22px; height: 22px; font-weight: 900; cursor: pointer;">-</button>
          <span style="font-weight: 800; font-size: 13px; width: 18px; text-align: center;">${item.qty}</span>
          <button type="button" onclick="updateTicketItemQty('${item.id}', 1)" style="background: #E2E8F0; border: none; border-radius: 4px; width: 22px; height: 22px; font-weight: 900; cursor: pointer;">+</button>
          <span style="font-weight: 900; font-size: 13px; color: #16A34A; min-width: 54px; text-align: right;">$${itemTotal}.00</span>
          <button type="button" onclick="removeFromTpvTicket('${item.id}')" style="background: none; border: none; color: #EF4444; font-weight: 900; font-size: 14px; cursor: pointer; margin-left: 4px;">✕</button>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `$${total}.00 MXN`;
  if (totalEl) totalEl.textContent = `$${total}.00 MXN`;
}

let tpvCurrentTicketTotal = 0;

function openTpvCashModal() {
  if (tpvTicketCart.length === 0) {
    showNotification('error', 'Ticket Vacío', 'Agrega al menos un producto al ticket de mostrador.');
    return;
  }

  tpvCurrentTicketTotal = tpvTicketCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const overlay = document.getElementById('modalTpvCashOverlay');
  if (!overlay) return;

  document.getElementById('tpvCashTotalDisplay').textContent = `$${tpvCurrentTicketTotal}.00 MXN`;
  const paidInput = document.getElementById('tpvCashPaidInput');
  if (paidInput) {
    paidInput.value = tpvCurrentTicketTotal;
  }
  calculateTpvChange();

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function closeTpvCashModal() {
  const overlay = document.getElementById('modalTpvCashOverlay');
  if (overlay) overlay.style.display = 'none';
}

function setTpvPaidPreset(val) {
  const paidInput = document.getElementById('tpvCashPaidInput');
  if (!paidInput) return;

  if (val === 'exact') {
    paidInput.value = tpvCurrentTicketTotal;
  } else {
    paidInput.value = val;
  }
  calculateTpvChange();
}

function calculateTpvChange() {
  const paidInput = document.getElementById('tpvCashPaidInput');
  const changeDisplay = document.getElementById('tpvCashChangeDisplay');
  const btnConfirm = document.getElementById('btnConfirmTpvCash');
  if (!paidInput || !changeDisplay) return;

  const paidAmount = parseFloat(paidInput.value);
  if (isNaN(paidAmount) || paidAmount < tpvCurrentTicketTotal) {
    const diff = isNaN(paidAmount) ? tpvCurrentTicketTotal : (tpvCurrentTicketTotal - paidAmount);
    changeDisplay.textContent = `Faltan $${diff}.00 MXN`;
    changeDisplay.style.color = '#DC2626';
    if (btnConfirm) btnConfirm.disabled = true;
  } else {
    const change = paidAmount - tpvCurrentTicketTotal;
    changeDisplay.textContent = `$${change}.00 MXN`;
    changeDisplay.style.color = '#0284C7';
    if (btnConfirm) btnConfirm.disabled = false;
  }
}

async function handleTpvCashSubmit(e) {
  e.preventDefault();
  const paidAmount = parseFloat(document.getElementById('tpvCashPaidInput').value);
  if (isNaN(paidAmount) || paidAmount < tpvCurrentTicketTotal) {
    showNotification('error', 'Monto Insuficiente', 'El monto ingresado es menor al total a cobrar.');
    return;
  }

  const change = paidAmount - tpvCurrentTicketTotal;
  closeTpvCashModal();
  await checkoutTpvSale('Efectivo en Mostrador', change);
}

async function checkoutTpvSale(paymentMethod, changeAmount = 0) {
  if (tpvTicketCart.length === 0) {
    showNotification('error', 'Ticket Vacío', 'Agrega al menos un producto al ticket de mostrador.');
    return;
  }

  let totalAmount = 0;
  const itemSummary = tpvTicketCart.map(i => {
    totalAmount += (i.price * i.qty);
    return `${i.qty}x ${i.name}`;
  }).join(', ');

  let processSuccess = true;

  for (const item of tpvTicketCart) {
    try {
      const res = await fetch('/api/products/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ id: item.id, quantity: item.qty, paymentMethod })
      });
      const text = await res.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch (e) { }
      }
      if (res.ok && (data.success || data.product)) {
        if (data.product) {
          const idx = productsData.findIndex(p => p.id === item.id);
          if (idx !== -1) productsData[idx] = data.product;
        }
        if (data.finance) {
          financesData.unshift(data.finance);
        }
      } else {
        processSuccess = false;
      }
    } catch (err) {
      /* silent error */
      processSuccess = false;
    }
  }

  if (processSuccess) {
    renderProductsTable();
    renderFinancesTable();
    renderFinancesKPIs();
    renderTpvGrid();
    clearTpvTicket();
    showNotification('success', `💵 Cobro Exitoso ($${totalAmount}.00 MXN)`, `Venta cobrada. Cambio a entregar: $${changeAmount}.00 MXN. (${itemSummary})`);
    fetchAdminData();
  } else {
    showNotification('error', 'Error en Cobro', 'Ocurrió un inconveniente al procesar la venta.');
  }
}

function setTpvFilter(categoryName, btnEl) {
  currentTpvFilter = categoryName;
  const container = document.getElementById('tpvCategoryFilterGroup');
  if (container) {
    container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  }
  if (btnEl) btnEl.classList.add('active');
  renderTpvGrid();
}

function renderTpvGrid() {
  const grid = document.getElementById('tpvProductsGrid');
  const filterGroup = document.getElementById('tpvCategoryFilterGroup');
  if (!grid) return;

  if (filterGroup) {
    filterGroup.innerHTML = `
      <button class="filter-btn tpv-filter-btn ${currentTpvFilter === 'all' ? 'active' : ''}" onclick="setTpvFilter('all', this)">Todos</button>
      ${productCategories.map(c => `
        <button class="filter-btn tpv-filter-btn ${currentTpvFilter === c ? 'active' : ''}" onclick="setTpvFilter('${c}', this)">${c}</button>
      `).join('')}
    `;
  }

  let filtered = productsData;
  if (currentTpvFilter !== 'all') {
    filtered = productsData.filter(p => p.category === currentTpvFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94A3B8; padding: 40px;">No hay productos disponibles en esta categoría.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isOut = (p.stock <= 0);
    const imgUrl = p.imageUrl || getProductDefaultImage(p.category, p.name);
    return `
      <div onclick="${isOut ? '' : `addToTpvTicket('${p.id}')`}" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.03); cursor: ${isOut ? 'not-allowed' : 'pointer'}; transition: all 0.2s;" onmouseover="this.style.borderColor='#16A34A'" onmouseout="this.style.borderColor='#E2E8F0'">
        <div>
          <div style="height: 110px; width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 10px; background: #F1F5F9; position: relative;">
            <img src="${imgUrl}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';">
            <span style="position: absolute; top: 6px; left: 6px; font-size: 10px; font-weight: 700; color: #334155; background: rgba(255,255,255,0.92); padding: 2px 6px; border-radius: 6px; backdrop-filter: blur(4px);">
              ${p.category}
            </span>
            <span style="position: absolute; top: 6px; right: 6px; font-size: 10px; font-weight: 800; color: ${isOut ? '#DC2626' : '#166534'}; background: ${isOut ? 'rgba(254,242,242,0.95)' : 'rgba(240,253,244,0.95)'}; padding: 2px 6px; border-radius: 6px; backdrop-filter: blur(4px);">
              ${isOut ? 'Agotado' : `${p.stock} dispon.`}
            </span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; font-size: 14px; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.name}">${p.name}</h4>
          <div style="font-size: 17px; font-weight: 900; color: #16A34A; margin-bottom: 8px;">$${p.price}.00 <small style="font-size: 11px; color: #64748B;">MXN</small></div>
        </div>
        <button type="button" class="btn-head-action btn-green" style="width: 100%; justify-content: center; padding: 6px 8px; font-size: 11px; background: #16A34A; color: #FFF; pointer-events: none;" ${isOut ? 'disabled style="opacity:0.5;"' : ''}>
          + Agregar al Ticket
        </button>
      </div>
    `;
  }).join('');

  renderTpvTicket();
}

/* Modal Crear / Editar Producto */
function openCreateProductModal() {
  const overlay = document.getElementById('modalProductOverlay');
  if (!overlay) return;

  updateCategoryDropdowns();
  document.getElementById('modalProductTitle').textContent = 'Agregar Nuevo Producto';
  document.getElementById('prodEditId').value = '';
  document.getElementById('prodNameInput').value = '';
  if (productCategories.length > 0) {
    document.getElementById('prodCategorySelect').value = productCategories[0];
  }
  document.getElementById('prodPriceInput').value = '';
  document.getElementById('prodStockInput').value = '10';
  const imgInput = document.getElementById('prodImageInput');
  if (imgInput) imgInput.value = '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';
  updateProductImagePreview();

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function openEditProductModal(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;

  const overlay = document.getElementById('modalProductOverlay');
  if (!overlay) return;

  updateCategoryDropdowns();
  document.getElementById('modalProductTitle').textContent = 'Editar Producto';
  document.getElementById('prodEditId').value = p.id;
  document.getElementById('prodNameInput').value = p.name;
  if (!productCategories.includes(p.category)) {
    productCategories.push(p.category);
    updateCategoryDropdowns();
  }
  document.getElementById('prodCategorySelect').value = p.category;
  document.getElementById('prodPriceInput').value = p.price;
  document.getElementById('prodStockInput').value = p.stock;
  const imgInput = document.getElementById('prodImageInput');
  if (imgInput) imgInput.value = p.imageUrl || '';
  const fileInput = document.getElementById('prodFileInput');
  if (fileInput) fileInput.value = '';
  updateProductImagePreview();

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function closeProductModal() {
  const overlay = document.getElementById('modalProductOverlay');
  if (overlay) overlay.style.display = 'none';
}

async function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('prodEditId').value;
  const name = document.getElementById('prodNameInput').value.trim();
  const category = document.getElementById('prodCategorySelect').value;
  const price = parseFloat(document.getElementById('prodPriceInput').value);
  const stock = parseInt(document.getElementById('prodStockInput').value, 10);
  const imageUrl = document.getElementById('prodImageInput') ? document.getElementById('prodImageInput').value.trim() : '';

  if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
    showNotification('error', 'Datos Inválidos', 'Revisa el nombre, precio y stock del producto.');
    return;
  }

  const isEdit = !!id;
  const endpoint = isEdit ? '/api/products/update' : '/api/products/create';
  const payload = isEdit ? { id, name, category, price, stock, imageUrl } : { name, category, price, stock, imageUrl };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (err) { /* silent warn */ }
    }
    if (res.ok && (data.success || data.product)) {
      closeProductModal();
      const prod = data.product || { id: id || ('PROD-' + Date.now()), name, category, price, stock, imageUrl };
      if (isEdit) {
        const idx = productsData.findIndex(p => p.id === id);
        if (idx !== -1) productsData[idx] = prod;
        showNotification('success', '¡Se Editó el Producto Correctamente! ✏️', `Se guardaron los cambios de ${name}.`);
      } else {
        const exists = productsData.some(p => p.id === prod.id);
        if (!exists) {
          productsData.unshift(prod);
        }
        showNotification('success', '¡Se Agregó el Producto Correctamente! 📦', `Se agregó el producto ${name} al inventario.`);
      }
      renderProductsTable();
      renderTpvGrid();
      fetchAdminProducts();
    } else {
      showNotification('error', 'Error al Guardar', data.message || 'No se pudo procesar el producto.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function showConfirmModal(title, message, confirmButtonText, onConfirmCallback) {
  if (typeof confirmButtonText === 'function') {
    onConfirmCallback = confirmButtonText;
    confirmButtonText = 'Sí, Eliminar';
  }
  const overlay = document.getElementById('modalConfirmOverlay');
  if (!overlay) return;

  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalMessage').textContent = message;
  const btn = document.getElementById('confirmModalActionButton');
  if (btn) {
    btn.textContent = (typeof confirmButtonText === 'string' && confirmButtonText) ? confirmButtonText : 'Sí, Eliminar';
    btn.onclick = () => {
      closeConfirmModal();
      if (onConfirmCallback) onConfirmCallback();
    };
  }
  overlay.style.display = 'flex';
}

function closeConfirmModal() {
  const overlay = document.getElementById('modalConfirmOverlay');
  if (overlay) overlay.style.display = 'none';
}

function handleDeleteProduct(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;

  showConfirmModal(
    '¿Eliminar Producto?',
    `¿Estás seguro de eliminar "${p.name}" del catálogo de ventas e inventario?`,
    '🗑️ Sí, Eliminar',
    async () => {
      try {
        const res = await fetch('/api/products/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ id: productId })
        });
        const text = await res.text();
        let data = {};
        if (text) {
          try { data = JSON.parse(text); } catch (err) { /* silent warn */ }
        }
        if (res.ok && (data.success || data.id)) {
          productsData = productsData.filter(item => item.id !== productId);
          renderProductsTable();
          renderTpvGrid();
          showNotification('success', '¡Se Eliminó el Producto Correctamente! 🗑️', `Se eliminó "${p.name}" del catálogo.`);
        } else {
          showNotification('error', 'Error al Eliminar', data.message || 'No se pudo borrar el producto.');
        }
      } catch (err) {
        /* silent error */
        showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
      }
    }
  );
}

/* Venta Rápida en Efectivo Modal */
let activeQuickSaleProduct = null;

function openQuickSaleModal(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;

  activeQuickSaleProduct = p;
  const overlay = document.getElementById('modalQuickSaleOverlay');
  if (!overlay) return;

  document.getElementById('quickSaleProdId').value = p.id;
  document.getElementById('quickSaleProdName').textContent = `${p.icon || '📦'} ${p.name}`;
  document.getElementById('quickSaleProdPrice').textContent = `$${p.price}.00 MXN`;
  document.getElementById('quickSaleProdStock').textContent = `${p.stock} unidades`;
  document.getElementById('quickSaleQtyInput').value = '1';
  document.getElementById('quickSaleQtyInput').max = p.stock;

  updateQuickSaleTotal();
  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function updateQuickSaleTotal() {
  if (!activeQuickSaleProduct) return;
  let qty = parseInt(document.getElementById('quickSaleQtyInput').value, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  const total = activeQuickSaleProduct.price * qty;
  const display = document.getElementById('quickSaleTotalDisplay');
  if (display) display.textContent = `$${total}.00 MXN`;
}

function closeQuickSaleModal() {
  const overlay = document.getElementById('modalQuickSaleOverlay');
  if (overlay) overlay.style.display = 'none';
  activeQuickSaleProduct = null;
}

async function handleQuickSaleSubmit(e) {
  e.preventDefault();
  if (!activeQuickSaleProduct) return;

  const id = document.getElementById('quickSaleProdId').value;
  const quantity = parseInt(document.getElementById('quickSaleQtyInput').value, 10);

  if (isNaN(quantity) || quantity <= 0) {
    showNotification('error', 'Cantidad Inválida', 'Ingresa una cantidad mayor a 0.');
    return;
  }

  try {
    const res = await fetch('/api/products/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ id, quantity })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.product) {
        const idx = productsData.findIndex(p => p.id === id);
        if (idx !== -1) productsData[idx] = data.product;
      }
      if (data.finance) {
        financesData.unshift(data.finance);
      }
      renderProductsTable();
      renderFinancesTable();
      renderFinancesKPIs();
      closeQuickSaleModal();

      const totalSold = (activeQuickSaleProduct.price * quantity);
      showNotification('success', '💵 Venta en Efectivo Registrada', `Se ingresaron $${totalSold}.00 MXN a caja chica por venta de ${quantity}x ${activeQuickSaleProduct.name}.`);
      fetchAdminData();
    } else {
      showNotification('error', 'Error en Venta', data.message || 'No se pudo realizar la venta.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

/* ==========================================
   DESCARGA REAL DE INFORME FINANCIERO (CSV/EXCEL)
   ========================================== */
function exportFinancesReportCSV() {
  if (!financesData || financesData.length === 0) {
    showNotification('error', 'Sin Transacciones', 'No hay registros en el libro diario para exportar.');
    return;
  }

  const headers = ['ID Transacción', 'Fecha y Hora', 'Cliente', 'Concepto', 'Categoría', 'Método de Pago', 'Monto Cobrado ($ MXN)', 'Estado Caja'];
  const rows = financesData.map(f => [
    `"${f.id || ''}"`,
    `"${f.date || ''}"`,
    `"${(f.clientName || 'Cliente Tacámbaro').replace(/"/g, '""')}"`,
    `"${(f.concept || '').replace(/"/g, '""')}"`,
    `"${(f.category || '').replace(/"/g, '""')}"`,
    `"${(f.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${f.amount || 0}"`,
    `"${f.status || 'Completado'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const todayStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Informe_Financiero_Level_Tacambaro_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification('success', '¡Informe Exportado Correctamente! 📥', `Se descargó el archivo "Informe_Financiero_Level_Tacambaro_${todayStr}.csv" con ${financesData.length} registros para Excel.`);
}

/* Populación de Deudores para Modal Finanzas */
function handleDebtorSelectChange(selectEl) {
  const selectedOpt = selectEl.options[selectEl.selectedIndex];
  if (!selectEl.value) return;

  const clientName = selectEl.value;
  const amount = selectedOpt.getAttribute('data-amount') || '300';

  document.getElementById('posClientInput').value = clientName;
  document.getElementById('posAmountInput').value = amount;
  document.getElementById('posConceptInput').value = `Recuperación de Adeudo: ${clientName} (No-Show)`;
}

/* ==========================================
   MÓDULO TORNEOS & LIGAS (CRUD & INSCRITOS)
   ========================================== */
let tournamentsData = [];

async function fetchAdminTournaments() {
  try {
    const res = await fetch('/api/tournaments');
    if (res.ok) {
      const data = await res.json();
      tournamentsData = (data || []).map(t => {
        return {
          ...t,
          title: fixMojibake(t.title || ''),
          category: fixMojibake(t.category || ''),
          dates: fixMojibake(t.dates || ''),
          prize: fixMojibake(t.prize || ''),
          status: fixMojibake(t.status || '')
        };
      });
      renderTournamentsTable();
    }
  } catch (err) {
    /* silent error */
  }
}

function handleTournImageUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    const urlInput = document.getElementById('tournImageUrlInput');
    const previewContainer = document.getElementById('tournPreviewContainer');
    const previewImg = document.getElementById('tournImagePreview');

    if (urlInput) urlInput.value = dataUrl;
    if (previewImg) previewImg.src = dataUrl;
    if (previewContainer) previewContainer.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function renderTournamentsTable() {
  const tbody = document.getElementById('adminTournamentsTableBody');
  if (!tbody) return;

  if (tournamentsData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 20px;">No hay torneos o ligas registradas actualmente.</td></tr>`;
    return;
  }

  tbody.innerHTML = tournamentsData.map(t => {
    const teamsList = t.teams || [];
    const teamCount = teamsList.length;

    const cleanTitle = fixMojibake(t.title || '');
    const cleanCat = fixMojibake(t.category || '');
    const cleanDates = fixMojibake(t.dates || '');
    let cleanPrize = fixMojibake(t.prize || '');
    if (!cleanPrize || cleanPrize === ',000 MXN' || cleanPrize.startsWith(',')) {
      cleanPrize = (t.id === 'TOURN-101') ? '$15,000 MXN' : '$8,000 MXN';
    }
    const cleanStatus = fixMojibake(t.status || '');
    const imgUrl = t.imageUrl || 'assets/images/cancha_padel_2.jpg';

    let badgeClass = 'badge-status-pill status-playing';
    if (cleanStatus === 'Próximamente') badgeClass = 'badge-status-pill status-reserved';
    else if (cleanStatus === 'Finalizado') badgeClass = 'badge-status-pill status-maintenance';

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${imgUrl}" alt="${cleanTitle}" style="width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1px solid #CBD5E1;" onerror="this.src='assets/images/cancha_padel_2.jpg'">
            <strong>${cleanTitle}</strong>
          </div>
        </td>
        <td><span class="badge-status-pill status-reserved" style="background:#F1F5F9; color:#475569;">${cleanCat}</span></td>
        <td>${cleanDates}</td>
        <td style="color: #10B981; font-weight: 800; font-size: 15px;">${cleanPrize}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: #0F172A;">${teamCount} / ${t.maxTeams} Parejas</span>
            <button class="btn-head-action btn-cyan" style="padding: 2px 8px; font-size: 10px;" onclick="openTournamentTeamsModal('${t.id}')" title="Ver lista de parejas inscritas">
              👥 Ver Inscritos
            </button>
          </div>
        </td>
        <td><span class="${badgeClass}">${cleanStatus}</span></td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn-head-action btn-dark" style="padding: 4px 8px; font-size: 11px;" onclick="openEditTournamentModal('${t.id}')" title="Editar torneo">
              <i data-lucide="edit"></i> Editar
            </button>
            <button class="btn-head-action btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="handleDeleteTournament('${t.id}')" title="Eliminar torneo">
              <i data-lucide="trash-2"></i> Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openCreateTournamentModal() {
  const overlay = document.getElementById('modalTournamentOverlay');
  if (!overlay) return;

  document.getElementById('modalTournamentTitle').textContent = 'Crear Nuevo Torneo';
  document.getElementById('tournEditId').value = '';
  document.getElementById('tournTitleInput').value = '';
  document.getElementById('tournCategoryInput').value = '2ª Categoría Libre';
  document.getElementById('tournDatesInput').value = '';
  document.getElementById('tournPrizeInput').value = '$10,000 MXN';
  document.getElementById('tournMaxTeamsInput').value = '16';
  document.getElementById('tournStatusSelect').value = 'Inscripciones Abiertas';

  const urlInput = document.getElementById('tournImageUrlInput');
  const fileInput = document.getElementById('tournImageFileInput');
  const previewContainer = document.getElementById('tournPreviewContainer');
  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
  if (previewContainer) previewContainer.style.display = 'none';

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function openEditTournamentModal(id) {
  const t = tournamentsData.find(item => item.id === id);
  if (!t) return;

  const overlay = document.getElementById('modalTournamentOverlay');
  if (!overlay) return;

  document.getElementById('modalTournamentTitle').textContent = 'Editar Torneo';
  document.getElementById('tournEditId').value = t.id;
  document.getElementById('tournTitleInput').value = fixMojibake(t.title || '');
  document.getElementById('tournCategoryInput').value = fixMojibake(t.category || '');
  document.getElementById('tournDatesInput').value = fixMojibake(t.dates || '');
  document.getElementById('tournPrizeInput').value = fixMojibake(t.prize || '');
  document.getElementById('tournMaxTeamsInput').value = t.maxTeams;
  document.getElementById('tournStatusSelect').value = fixMojibake(t.status || 'Inscripciones Abiertas');

  const urlInput = document.getElementById('tournImageUrlInput');
  const fileInput = document.getElementById('tournImageFileInput');
  const previewContainer = document.getElementById('tournPreviewContainer');
  const previewImg = document.getElementById('tournImagePreview');

  const imgVal = t.imageUrl || '';
  if (urlInput) urlInput.value = imgVal;
  if (fileInput) fileInput.value = '';

  if (imgVal && previewContainer && previewImg) {
    previewImg.src = imgVal;
    previewContainer.style.display = 'block';
  } else if (previewContainer) {
    previewContainer.style.display = 'none';
  }

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function closeTournamentModal() {
  const overlay = document.getElementById('modalTournamentOverlay');
  if (overlay) overlay.style.display = 'none';
}

async function handleTournamentFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('tournEditId').value;
  const title = document.getElementById('tournTitleInput').value.trim();
  const category = document.getElementById('tournCategoryInput').value.trim();
  const dates = document.getElementById('tournDatesInput').value.trim();
  const prize = document.getElementById('tournPrizeInput').value.trim();
  const maxTeams = parseInt(document.getElementById('tournMaxTeamsInput').value, 10);
  const status = document.getElementById('tournStatusSelect').value;
  const imageUrl = document.getElementById('tournImageUrlInput') ? document.getElementById('tournImageUrlInput').value : '';

  if (!title || !category || !dates || isNaN(maxTeams) || maxTeams < 2) {
    showNotification('error', 'Datos Inválidos', 'Completa los campos obligatorios del torneo.');
    return;
  }

  const isEdit = !!id;
  const endpoint = isEdit ? '/api/tournaments/update' : '/api/tournaments/create';
  const payload = isEdit
    ? { id, title, category, dates, prize, maxTeams, status, imageUrl }
    : { title, category, dates, prize, maxTeams, status, imageUrl };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    let data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (err) { }
    }
    if (res.ok && (data.success || data.tournament)) {
      closeTournamentModal();
      showNotification('success', isEdit ? '¡Se Editó el Torneo Correctamente! 🏆' : '¡Se Agregó el Torneo Correctamente! 🏆', `Se guardó "${title}" exitosamente.`);
      fetchAdminTournaments();
    } else {
      showNotification('error', 'Error al Guardar', data.message || 'No se pudo guardar el torneo.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function handleDeleteTournament(id) {
  const t = tournamentsData.find(item => item.id === id);
  if (!t) return;

  showConfirmModal('¿Eliminar Torneo?', `¿Estás seguro de eliminar el torneo "${t.title}"?`, 'Sí, Eliminar Torneo', async () => {
    try {
      const res = await fetch('/api/tournaments/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showNotification('success', '¡Se Eliminó el Torneo Correctamente! 🗑️', `Se eliminó "${t.title}".`);
        fetchAdminTournaments();
      } else {
        showNotification('error', 'Error Eliminando', 'No se pudo eliminar el torneo.');
      }
    } catch (err) {
      /* silent error */
      showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
    }
  });
}

function openTournamentTeamsModal(id) {
  const t = tournamentsData.find(item => item.id === id);
  if (!t) return;

  const overlay = document.getElementById('modalTournamentTeamsOverlay');
  const container = document.getElementById('teamsListContainer');
  const title = document.getElementById('modalTeamsTitle');
  if (!overlay || !container) return;

  if (title) title.textContent = `Equipos Inscritos: ${fixMojibake(t.title || '')}`;

  const teams = t.teams || [];
  if (teams.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: #94A3B8; padding: 30px 10px;">
        👥 Aún no hay equipos inscritos en este torneo.<br>Los clientes pueden registrarse desde la App Móvil.
      </div>
    `;
  } else {
    container.innerHTML = teams.map((team, idx) => `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 10px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="color: #0F172A; font-size: 14px;">#${idx + 1} ${fixMojibake(team.teamName || '')}</strong>
          <span style="font-size: 10px; color: #64748B; background: #E2E8F0; padding: 2px 6px; border-radius: 4px;">${team.registeredAt || 'Fecha N/A'}</span>
        </div>
        <div style="font-size: 12px; color: #0284C7; font-weight: 700;">
          👥 Participantes: <span style="color: #334155; font-weight: 500;">${fixMojibake(team.participants || '')}</span>
        </div>
      </div>
    `).join('');
  }

  overlay.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function closeTournamentTeamsModal() {
  const overlay = document.getElementById('modalTournamentTeamsOverlay');
  if (overlay) overlay.style.display = 'none';
}

/* Cerrar Sesión del Administrador */
function handleLogout() {
  showConfirmModal(
    '¿Cerrar Sesión?',
    '¿Estás seguro de que deseas salir del Panel Administrador?',
    'Sí, Cerrar Sesión',
    () => {
      showNotification('info', 'Sesión Cerrada', 'Has cerrado sesión exitosamente.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  );
}

/* GESTIÓN DE CANCHAS (CRUD) */
function fixMojibake(str) {
  if (typeof str !== 'string' || !str) return str || '';
  return str
    .replace(/Pádel|Padel|PÃ¡del|PÃ;del|PÃ©del/gi, 'Padel')
    .replace(/Tacámbaro|Tacambaro|TacÃ¡mbaro|TacÃ;mbaro/gi, 'Tacambaro')
    .replace(/Michoacán|Michoacan|MichoacÃ¡n|MichoacÃ;n/gi, 'Michoacan')
    .replace(/Panorámica|Panoramica|PanorÃ¡mica|PanorÃ;mica/gi, 'Panoramica')
    .replace(/Categoría|Categoria|CategorÃa|CategorÃ;a/gi, 'Categoria')
    .replace(/Próximamente|Proximamente|PrÃ³ximamente|PrÃ;ximamente/gi, 'Proximamente')
    .replace(/Pérez|Perez|PÃ©rez/gi, 'Perez')
    .replace(/Sofía|Sofia|SofÃa/gi, 'Sofia')
    .replace(/Valdés|Valdes|ValdÃ©s/gi, 'Valdes')
    .replace(/Valentín|Valentin|ValentÃn/gi, 'Valentin')
    .replace(/Gómez|Gomez|GÃ³mez/gi, 'Gomez')
    .replace(/Farías|Farias|FarÃas/gi, 'Farias')
    .replace(/teléfono|telefono|telÃ©fono|telÃ;fono/gi, 'telefono')
    .replace(/Asistió|Asistio|AsistiÃ³/gi, 'Asistio')
    .replace(/Débito|Debito|DÃ©bito/gi, 'Debito')
    .replace(/Día|Dia|DÃa/gi, 'Dia')
    .replace(/Miércoles|Miercoles|MiÃ©rcoles/gi, 'Miercoles')
    .replace(/Sábado|Sabado|SÃ¡bado/gi, 'Sabado')
    .replace(/[\u00E0-\u00E6\u00C0-\u00C6]/g, 'a')
    .replace(/[\u00E8-\u00EB\u00C8-\u00CB]/g, 'e')
    .replace(/[\u00EC-\u00EF\u00CC-\u00CF]/g, 'i')
    .replace(/[\u00F2-\u00F6\u00D2-\u00D6]/g, 'o')
    .replace(/[\u00F9-\u00FC\u00D9-\u00DC]/g, 'u')
    .replace(/[\u00F1\u00D1]/g, 'n')
    .replace(/\u00C3[\u0080-\u00BF]/g, '')
    .replace(/\u00C2[\u0080-\u00BF]/g, '')
    .replace(/[^\x00-\x7F]+/g, '');
}

function renderAdminCourtsGrid() {
  const grid = document.getElementById('adminCourtsGrid');
  if (!grid) return;

  if (!courtsData || courtsData.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #64748B; background: #F8FAFC; border-radius: 16px; border: 2px dashed #E2E8F0;">
        <i data-lucide="info" style="width: 32px; height: 32px; color: #94A3B8; margin-bottom: 8px;"></i>
        <p style="font-weight: 700; margin: 0;">No hay canchas registradas en el sistema.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = courtsData.map(court => {
    const cleanName = fixMojibake(court.name);
    const cleanLoc = fixMojibake(court.location || 'Tacámbaro, Michoacán');
    return `
      <div class="admin-court-card" style="background: #FFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="position: relative; height: 160px; overflow: hidden; background: #0F172A;">
            <img src="${court.image || 'assets/images/cancha_padel_1.jpg'}" alt="${cleanName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/cancha_padel_1.jpg'">
            <span style="position: absolute; top: 12px; left: 12px; background: rgba(15,23,42,0.85); color: #38BDF8; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 11px; backdrop-filter: blur(4px);">
              ID: ${court.id}
            </span>
          </div>

          <div style="padding: 16px;">
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">${cleanName}</h3>
            <div style="font-size: 12px; color: #64748B; margin-bottom: 12px; display: flex; align-items: center; gap: 4px;">
              📍 <span>${cleanLoc}</span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 700; color: #64748B;">Tarifa Hora:</span>
              <span style="font-size: 16px; font-weight: 900; color: #10B981;">$ ${court.price} <span style="font-size: 10px; color: #64748B; font-weight: 600;">MXN / hr</span></span>
            </div>
          </div>
        </div>

        <div style="padding: 12px 16px; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; gap: 10px;">
          <button onclick="openCourtEditModal('${court.id}')" class="btn-head-action btn-cyan" style="flex: 1; font-size: 12px;">
            <i data-lucide="edit"></i> Editar Cancha
          </button>
          <button onclick="deleteCourtConfirm('${court.id}')" class="btn-head-action btn-danger" style="padding: 8px 12px; font-size: 12px;" title="Eliminar Cancha">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function handleCourtImageUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    showNotification('error', 'Imagen Muy Grande', 'Por favor selecciona una imagen menor a 8MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    document.getElementById('courtEditImage').value = dataUrl;

    const container = document.getElementById('courtPreviewContainer');
    const preview = document.getElementById('courtImagePreview');
    if (preview && container) {
      preview.src = dataUrl;
      container.style.display = 'block';
    }
    showNotification('success', 'Imagen Cargada 📷', 'La imagen de tu computadora se cargó exitosamente.');
  };
  reader.readAsDataURL(file);
}

function updateCourtImagePreviewFromInput() {
  const val = document.getElementById('courtEditImage').value.trim();
  const container = document.getElementById('courtPreviewContainer');
  const preview = document.getElementById('courtImagePreview');
  if (val && preview && container) {
    preview.src = val;
    container.style.display = 'block';
  } else if (container) {
    container.style.display = 'none';
  }
}

function setCourtPresetImage(path) {
  document.getElementById('courtEditImage').value = path;
  updateCourtImagePreviewFromInput();
}

function openCourtCreateModal() {
  document.getElementById('modalCourtTitle').textContent = 'Registrar Nueva Cancha';
  document.getElementById('courtEditId').value = '';
  document.getElementById('courtEditName').value = '';
  document.getElementById('courtEditPrice').value = '300';
  document.getElementById('courtEditLocation').value = 'Tacámbaro, Michoacán';
  document.getElementById('courtEditImage').value = 'assets/images/cancha_padel_1.jpg';
  document.getElementById('btnDeleteCourtModal').style.display = 'none';

  const fileInput = document.getElementById('courtImageFileInput');
  if (fileInput) fileInput.value = '';

  updateCourtImagePreviewFromInput();

  const modal = document.getElementById('modalCourtManage');
  if (modal) modal.style.display = 'flex';
}

function openCourtEditModal(id) {
  const court = courtsData.find(c => c.id === id);
  if (!court) return;

  document.getElementById('modalCourtTitle').textContent = 'Editar Cancha';
  document.getElementById('courtEditId').value = court.id;
  document.getElementById('courtEditName').value = fixMojibake(court.name || '');
  document.getElementById('courtEditPrice').value = court.price || 300;
  document.getElementById('courtEditLocation').value = fixMojibake(court.location || 'Tacámbaro, Michoacán');
  document.getElementById('courtEditImage').value = court.image || 'assets/images/cancha_padel_1.jpg';
  document.getElementById('btnDeleteCourtModal').style.display = 'inline-flex';

  const fileInput = document.getElementById('courtImageFileInput');
  if (fileInput) fileInput.value = '';

  updateCourtImagePreviewFromInput();

  const modal = document.getElementById('modalCourtManage');
  if (modal) modal.style.display = 'flex';
}

function closeCourtModal() {
  const modal = document.getElementById('modalCourtManage');
  if (modal) modal.style.display = 'none';
}

async function saveCourtForm(e) {
  e.preventDefault();
  const id = document.getElementById('courtEditId').value.trim();
  const name = document.getElementById('courtEditName').value.trim();
  const price = parseInt(document.getElementById('courtEditPrice').value) || 300;
  const location = document.getElementById('courtEditLocation').value.trim();
  const image = document.getElementById('courtEditImage').value.trim();

  if (!name) return;

  const isEdit = !!id;
  const endpoint = isEdit ? '/api/courts/update' : '/api/courts/create';
  const payload = { id, name, price, location, image };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      closeCourtModal();
      await fetchAdminData();
      renderAdminCourtsGrid();
      showNotification('success', isEdit ? '¡Se Editó la Cancha Correctamente! 🎾' : '¡Se Agregó la Cancha Correctamente! 🎾', isEdit ? `La cancha "${name}" fue guardada correctamente.` : `La nueva cancha "${name}" ya está disponible.`);
    } else {
      showNotification('error', 'Error al Guardar', 'No se pudo guardar la cancha.');
    }
  } catch (err) {
    /* silent error */
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function deleteCourtConfirm(id) {
  const court = courtsData.find(c => c.id === id);
  if (!court) return;

  const cleanName = fixMojibake(court.name);

  showConfirmModal(
    '¿Eliminar Cancha?',
    `¿Estás seguro de eliminar "${cleanName}"? Esta acción removerá la pista del catálogo del club.`,
    'Sí, Eliminar Cancha',
    async () => {
      try {
        const res = await fetch('/api/courts/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ id })
        });

        if (res.ok) {
          closeCourtModal();
          await fetchAdminData();
          renderAdminCourtsGrid();
          showNotification('success', '¡Se Eliminó la Cancha Correctamente! 🗑️', `La cancha "${cleanName}" fue eliminada del sistema.`);
        } else {
          showNotification('error', 'Error al Eliminar', 'No se pudo eliminar la cancha.');
        }
      } catch (err) {
        /* silent error */
        showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
      }
    }
  );
}

function deleteCourtCurrent() {
  const id = document.getElementById('courtEditId').value;
  if (id) deleteCourtConfirm(id);
}

/* ==========================================
   GESTIÓN DE SESIÓN & LOGIN / CERRAR SESIÓN ADMIN
   ========================================== */

function checkAdminSession() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  const overlay = document.getElementById('adminLoginOverlay');
  if (isLoggedIn === 'true') {
    if (overlay) overlay.style.display = 'none';
  } else {
    if (overlay) {
      overlay.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }
  }
}

function handleAdminLoginSubmit(e) {
  if (e) e.preventDefault();
  const userEl = document.getElementById('loginUsername') || document.getElementById('loginEmail');
  const passwordEl = document.getElementById('loginPassword');

  const username = userEl ? userEl.value.trim().toLowerCase() : '';
  const password = passwordEl ? passwordEl.value.trim() : '';

  if (!username || !password) {
    showNotification('error', 'Campos Incompletos ⚠️', 'Por favor ingresa tu usuario y contraseña.');
    return;
  }

  const savedPass = localStorage.getItem('adminPassword') || 'admin123';
  const validUsernames = ['admin', 'admin@level.com', 'administrador', 'admin_tacambaro'];

  const isValidUser = validUsernames.includes(username) || username === 'admin';
  const isValidPass = (password === savedPass) || (savedPass === 'admin123' && (password === 'admin123' || password === 'admin'));

  if (isValidUser && isValidPass) {
    localStorage.setItem('adminLoggedIn', 'true');
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay) overlay.style.display = 'none';
    showNotification('success', '¡Bienvenido! 🎾', 'Has iniciado sesión exitosamente en el Panel Administrador Level Tacámbaro.');
  } else {
    showNotification('error', 'Usuario o contraseña incorrectos ❌', 'El usuario o la contraseña ingresados no son válidos. Por favor verifica tus datos.');
  }
}

/* ==========================================
   GESTIÓN DE CAMBIO DE CONTRASEÑA ADMIN
   ========================================== */

function openChangePasswordModal() {
  const modal = document.getElementById('modalChangeAdminPasswordOverlay');
  if (modal) {
    modal.style.display = 'flex';
    const n = document.getElementById('changePassNew');
    const cf = document.getElementById('changePassConfirm');
    if (n) n.value = '';
    if (cf) cf.value = '';
    if (window.lucide) lucide.createIcons();
  }
}

function closeChangePasswordModal() {
  const modal = document.getElementById('modalChangeAdminPasswordOverlay');
  if (modal) modal.style.display = 'none';
}

function handleSaveNewPassword(e) {
  if (e) e.preventDefault();
  const newVal = (document.getElementById('changePassNew') ? document.getElementById('changePassNew').value.trim() : '');
  const confirmVal = (document.getElementById('changePassConfirm') ? document.getElementById('changePassConfirm').value.trim() : '');

  if (!newVal || newVal.length < 4) {
    showNotification('error', 'Contraseña Muy Corta ⚠️', 'La nueva contraseña debe tener al menos 4 caracteres.');
    return;
  }

  if (newVal !== confirmVal) {
    showNotification('error', 'Contraseñas No Coinciden ❌', 'La nueva contraseña y su confirmación no coinciden.');
    return;
  }

  localStorage.setItem('adminPassword', newVal);
  closeChangePasswordModal();
  showNotification('success', '¡Contraseña Actualizada! 🔒', 'La clave de acceso del Administrador ha sido cambiada exitosamente.');
}

function handleAdminLogout() {
  const modal = document.getElementById('adminLogoutConfirmModalOverlay');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }
}

function closeAdminLogoutModal() {
  const modal = document.getElementById('adminLogoutConfirmModalOverlay');
  if (modal) modal.style.display = 'none';
}

function confirmAdminLogout() {
  closeAdminLogoutModal();
  try {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminActiveTab');
    localStorage.removeItem('adminToken');
  } catch (e) { }

  showNotification('info', 'Sesión Cerrada 🔒', 'Has cerrado sesión exitosamente. Redirigiendo al inicio de sesión...');

  setTimeout(() => {
    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      const passInp = document.getElementById('loginPassword');
      if (passInp) passInp.value = '';
      if (window.lucide) lucide.createIcons();
    } else {
      window.location.reload();
    }
  }, 1000);
}

async function handleAdminCancelBooking(bookingId) {
  showConfirmModal(
    '¿Cancelar Reserva?',
    `¿Estás seguro de que deseas cancelar definitivamente la reserva ${bookingId}? El horario quedará liberado.`,
    'Sí, Cancelar Reserva',
    async () => {
      try {
        const res = await fetch('/api/bookings/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ bookingId })
        });
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text.trim().replace(/^\uFEFF/, '')) : {}; } catch (e) { }

        if ((res.ok || data.success) && data.success !== false) {
          const idx = bookingsData.findIndex(b => b.id === bookingId);
          if (idx !== -1) bookingsData.splice(idx, 1);
          renderBookingsTable();
          renderMonthlyCalendar();
          updateKPIs();
          showNotification('success', '¡Reserva Cancelada! 🗑️', `La reserva ${bookingId} fue cancelada correctamente y el horario ha quedado libre.`);
        } else {
          showNotification('error', 'Error al Cancelar', data.message || 'No se pudo cancelar la reserva.');
        }
      } catch (err) {
        showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
      }
    }
  );
}

/* ==========================================
   MÓDULO DE CAJAS & CORTES DE CAJA (ARQUEOS)
   ========================================== */

let cashStatusData = null;
let cashHistoryData = [];

async function fetchCashShiftStatus() {
  try {
    const res = await fetch('/api/cash/status');
    if (res.ok) {
      cashStatusData = await res.json();
      updateCashUI();
    }
  } catch (err) { /* silent catch */ }
}

function updateCashUI() {
  if (!cashStatusData) return;

  const activeShift = cashStatusData.activeShift;
  const isShiftOpen = !!(activeShift && activeShift.status === 'abierta');

  // 1. Badges
  const navbarBadge = document.getElementById('navbarCashBadge');
  const navbarDot = document.getElementById('navbarCashDot');
  const navbarText = document.getElementById('navbarCashText');
  const sidebarBadge = document.getElementById('sidebarCashBadge');

  const expectedVal = isShiftOpen ? (cashStatusData.expectedCash || 0) : 0;
  const expectedStr = `$${expectedVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

  if (isShiftOpen) {
    if (navbarBadge) navbarBadge.style.background = '#ECFDF5';
    if (navbarDot) navbarDot.className = 'dot-green';
    if (navbarText) navbarText.textContent = `Caja Abierta (${expectedStr})`;
    if (sidebarBadge) {
      sidebarBadge.className = 'nav-badge badge-green';
      sidebarBadge.textContent = 'Abierta';
    }
  } else {
    if (navbarBadge) navbarBadge.style.background = '#FEF2F2';
    if (navbarDot) navbarDot.className = 'dot-red';
    if (navbarText) navbarText.textContent = 'Caja Cerrada';
    if (sidebarBadge) {
      sidebarBadge.className = 'nav-badge badge-red';
      sidebarBadge.textContent = 'Cerrada';
    }
  }

  // 2. Action Buttons
  const btnOpen = document.getElementById('btnOpenCashModal');
  const btnAddMov = document.getElementById('btnAddMovementModal');
  const btnClose = document.getElementById('btnCloseCashModal');

  if (btnOpen) btnOpen.style.display = isShiftOpen ? 'none' : 'inline-flex';
  if (btnAddMov) btnAddMov.style.display = isShiftOpen ? 'inline-flex' : 'none';
  if (btnClose) btnClose.style.display = isShiftOpen ? 'inline-flex' : 'none';

  // 3. Banner Status
  const banner = document.getElementById('cashBannerStatus');
  const bannerTitle = document.getElementById('cashBannerTitle');
  const bannerSub = document.getElementById('cashBannerSubtitle');
  const bannerAmt = document.getElementById('cashBannerAmount');

  if (banner && isShiftOpen) {
    banner.style.borderLeftColor = '#10B981';
    banner.style.background = '#F0FDF4';
    if (bannerTitle) { bannerTitle.textContent = 'Caja Abierta (Turno Activo)'; bannerTitle.style.color = '#166534'; }
    if (bannerSub) { bannerSub.textContent = `Apertura: ${activeShift.openTime || 'Hoy'} | Responsable: Administrador Level Tacámbaro`; bannerSub.style.color = '#15803D'; }
    if (bannerAmt) { bannerAmt.textContent = expectedStr; bannerAmt.style.color = '#166534'; }
  } else if (banner) {
    banner.style.borderLeftColor = '#EF4444';
    banner.style.background = '#FEF2F2';
    if (bannerTitle) { bannerTitle.textContent = 'Caja Cerrada'; bannerTitle.style.color = '#991B1B'; }
    if (bannerSub) { bannerSub.textContent = 'No hay turno activo. Haz clic en "Abrir Caja / Turno" para iniciar operaciones.'; bannerSub.style.color = '#991B1B'; }
    if (bannerAmt) { bannerAmt.textContent = '$0.00 MXN'; bannerAmt.style.color = '#991B1B'; }
  }

  // 4. KPI Cards
  const initAmt = isShiftOpen ? (activeShift.initialAmount || 0) : 0;
  const cashSales = isShiftOpen ? (cashStatusData.cashIncomes || 0) : 0;
  const mEntradas = isShiftOpen ? (cashStatusData.manualEntradas || 0) : 0;
  const mSalidas = isShiftOpen ? (cashStatusData.manualSalidas || 0) : 0;

  const kpiInit = document.getElementById('cashKpiInitial');
  const kpiSales = document.getElementById('cashKpiVentasEfectivo');
  const kpiManuals = document.getElementById('cashKpiManuals');
  const kpiExp = document.getElementById('cashKpiExpected');

  if (kpiInit) kpiInit.innerHTML = `$${initAmt.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <small>MXN</small>`;
  if (kpiSales) kpiSales.innerHTML = `$${cashSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <small>MXN</small>`;
  if (kpiManuals) kpiManuals.textContent = `+$${mEntradas.toLocaleString('es-MX')} / -$${mSalidas.toLocaleString('es-MX')}`;
  if (kpiExp) kpiExp.innerHTML = `${expectedStr}`;

  // 5. Cut Summary Values
  const cutInit = document.getElementById('cutSummaryInitial');
  const cutVentas = document.getElementById('cutSummaryVentas');
  const cutEntradas = document.getElementById('cutSummaryEntradas');
  const cutSalidas = document.getElementById('cutSummarySalidas');
  const cutExpected = document.getElementById('cutSummaryExpected');

  if (cutInit) cutInit.textContent = `$${initAmt.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  if (cutVentas) cutVentas.textContent = `+$${cashSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  if (cutEntradas) cutEntradas.textContent = `+$${mEntradas.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  if (cutSalidas) cutSalidas.textContent = `-$${mSalidas.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  if (cutExpected) cutExpected.textContent = expectedStr;

  // 6. Tables
  renderCashMovementsTable();
  fetchCashHistory();
}

function renderCashMovementsTable() {
  const tbody = document.getElementById('cashMovementsTableBody');
  if (!tbody) return;

  const movements = (cashStatusData && cashStatusData.movements) ? cashStatusData.movements : [];
  if (movements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 20px;">No hay movimientos de efectivo registrados en el turno activo.</td></tr>`;
    return;
  }

  tbody.innerHTML = movements.map(m => {
    const isEntrada = m.type === 'entrada';
    const badgeColor = isEntrada ? 'background: #DCFCE7; color: #15803D;' : 'background: #FEE2E2; color: #B91C1C;';
    const typeLabel = isEntrada ? '🟢 Entrada' : '🔴 Salida / Gasto';
    const sign = isEntrada ? '+' : '-';
    const amtColor = isEntrada ? '#166534' : '#DC2626';

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">${m.id}</td>
        <td>${m.timestamp || '-'}</td>
        <td><span style="padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 12px; ${badgeColor}">${typeLabel}</span></td>
        <td style="font-weight: 700; color: #0F172A;">${fixMojibake(m.concept || '')}</td>
        <td><span style="background: #F1F5F9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">${m.category || 'General'}</span></td>
        <td>${m.responsible || 'Administrador Level Tacámbaro'}</td>
        <td style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15px; color: ${amtColor};">${sign}$${(m.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</td>
      </tr>
    `;
  }).join('');
}

async function fetchCashHistory() {
  try {
    const res = await fetch('/api/cash/history');
    if (res.ok) {
      cashHistoryData = await res.json();
      renderCashHistoryTable();
    }
  } catch (err) { }
}

function renderCashHistoryTable() {
  const tbody = document.getElementById('cashHistoryTableBody');
  if (!tbody) return;

  if (!cashHistoryData || cashHistoryData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #94A3B8; padding: 20px;">No hay historial de cierres de caja registrados aún.</td></tr>`;
    return;
  }

  tbody.innerHTML = cashHistoryData.map(c => {
    const isOpen = c.status === 'abierta';
    const statusBadge = isOpen ? '<span style="background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 12px;">🟢 Abierta</span>' : '<span style="background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 12px;">🔒 Cerrada</span>';
    
    const diff = c.difference || 0;
    let diffMarkup = '<span style="color: #64748B;">$0.00</span>';
    if (diff > 0) {
      diffMarkup = `<span style="color: #10B981; font-weight: 800;">+$${diff.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Sobrante)</span>`;
    } else if (diff < 0) {
      diffMarkup = `<span style="color: #EF4444; font-weight: 800;">-$${Math.abs(diff).toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Faltante)</span>`;
    }

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">${c.id}</td>
        <td>${c.openTime || '-'}</td>
        <td>${c.closeTime || 'Turno Activo'}</td>
        <td style="font-weight: 700;">${c.responsible || 'Administrador'}</td>
        <td>$${(c.initialAmount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        <td style="color: #10B981; font-weight: 700;">+$${(c.cashIncomes || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        <td style="font-weight: 700;">$${(c.expectedCash || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        <td style="font-weight: 800; color: #0F172A;">$${(c.physicalCash || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        <td>${diffMarkup}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

function switchCashSubTab(tabKey, btn) {
  document.querySelectorAll('.cash-tab-sub-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const subMovements = document.getElementById('cashSubTabMovements');
  const subCut = document.getElementById('cashSubTabCut');
  const subHistory = document.getElementById('cashSubTabHistory');

  if (subMovements) subMovements.style.display = (tabKey === 'movements') ? 'block' : 'none';
  if (subCut) subCut.style.display = (tabKey === 'cut') ? 'block' : 'none';
  if (subHistory) subHistory.style.display = (tabKey === 'history') ? 'block' : 'none';

  if (tabKey === 'history') fetchCashHistory();
}

function openOpenCashModal() {
  const modal = document.getElementById('modalOpenCashOverlay');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('openCashInitialAmount').value = '1000';
    document.getElementById('openCashNotes').value = '';
    if (window.lucide) lucide.createIcons();
  }
}

function closeOpenCashModal() {
  const modal = document.getElementById('modalOpenCashOverlay');
  if (modal) modal.style.display = 'none';
}

async function handleOpenCashSubmit(e) {
  if (e) e.preventDefault();
  const initAmt = parseFloat(document.getElementById('openCashInitialAmount').value) || 0;
  const notes = document.getElementById('openCashNotes').value.trim();

  try {
    const res = await fetch('/api/cash/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ initialAmount: initAmt, notes })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      closeOpenCashModal();
      showNotification('success', '¡Caja Abierta! 🔓', `Se inició el turno de caja con un fondo inicial de $${initAmt.toLocaleString('es-MX')} MXN.`);
      fetchCashShiftStatus();
    } else {
      showNotification('error', 'Error al Abrir Caja', data.message || 'No se pudo abrir la caja.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function openCashMovementModal() {
  const modal = document.getElementById('modalCashMovementOverlay');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('movAmount').value = '';
    document.getElementById('movConcept').value = '';
    if (window.lucide) lucide.createIcons();
  }
}

function closeCashMovementModal() {
  const modal = document.getElementById('modalCashMovementOverlay');
  if (modal) modal.style.display = 'none';
}

async function handleCashMovementSubmit(e) {
  if (e) e.preventDefault();
  const type = document.getElementById('movType').value;
  const amount = parseFloat(document.getElementById('movAmount').value) || 0;
  const concept = document.getElementById('movConcept').value.trim();
  const category = document.getElementById('movCategory').value;

  if (amount <= 0 || !concept) {
    showNotification('error', 'Campos Incompletos', 'Ingresa un monto válido y el concepto del movimiento.');
    return;
  }

  try {
    const res = await fetch('/api/cash/movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ type, amount, concept, category })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      closeCashMovementModal();
      showNotification('success', '¡Movimiento Registrado! 💵', `Se guardó el movimiento de ${type === 'entrada' ? 'entrada' : 'salida'} por $${amount.toLocaleString('es-MX')} MXN.`);
      fetchCashShiftStatus();
    } else {
      showNotification('error', 'Error al Registrar', data.message || 'No se pudo registrar el movimiento.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function openCashCutModal() {
  switchCashSubTab('cut', document.querySelectorAll('.cash-tab-sub-btn')[1]);
}

function calculateCutDifferenceLive() {
  const physVal = parseFloat(document.getElementById('cutPhysicalCash').value) || 0;
  const expVal = cashStatusData ? (cashStatusData.expectedCash || 0) : 0;
  const diff = physVal - expVal;

  const box = document.getElementById('cutDifferenceBox');
  const amtEl = document.getElementById('cutDifferenceAmount');

  if (box && amtEl) {
    box.style.display = 'block';
    if (diff === 0) {
      box.style.background = '#ECFDF5';
      amtEl.style.color = '#059669';
      amtEl.textContent = '✓ Sin diferencia ($0.00 MXN)';
    } else if (diff > 0) {
      box.style.background = '#ECFDF5';
      amtEl.style.color = '#059669';
      amtEl.textContent = `+ $${diff.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN (Sobrante)`;
    } else {
      box.style.background = '#FEF2F2';
      amtEl.style.color = '#DC2626';
      amtEl.textContent = `- $${Math.abs(diff).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN (Faltante)`;
    }
  }
}

async function handleCashCutSubmit(e) {
  if (e) e.preventDefault();
  const physCash = parseFloat(document.getElementById('cutPhysicalCash').value) || 0;
  const notes = document.getElementById('cutNotes').value.trim();

  try {
    const res = await fetch('/api/cash/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ physicalCash: physCash, notes })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const shift = data.shift;
      const diff = shift.difference || 0;
      let diffMsg = 'Cierre exacto sin diferencias.';
      if (diff > 0) diffMsg = `Sobrante de +$${diff.toFixed(2)} MXN en caja.`;
      if (diff < 0) diffMsg = `Faltante de -$${Math.abs(diff).toFixed(2)} MXN en caja.`;

      showNotification('success', '¡Cierre de Caja Procesado! 🔒', `Turno cerrado correctamente. ${diffMsg}`);
      document.getElementById('cutPhysicalCash').value = '';
      document.getElementById('cutNotes').value = '';
      if (document.getElementById('cutDifferenceBox')) document.getElementById('cutDifferenceBox').style.display = 'none';

      fetchCashShiftStatus();
      switchCashSubTab('history', document.querySelectorAll('.cash-tab-sub-btn')[2]);
    } else {
      showNotification('error', 'Error al Cerrar Caja', data.message || 'No se pudo procesar el cierre.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}





