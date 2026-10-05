/* =========================================================
   TOP GLOBALS & MODAL HANDLERS (BULLETPROOF PURE-QUOTE JS)
   ========================================================= */
var currentReceiptBookingId = null;
let cashStatusData = null;
let currentBookingDateFilter = 'today';

function setBookingDateFilter(modeOrDate) {
  currentBookingDateFilter = modeOrDate || 'today';

  const btnToday = document.getElementById('btnFilterToday');
  const btnAll = document.getElementById('btnFilterAll');
  const datePicker = document.getElementById('bookingDateFilterInput');
  const badge = document.getElementById('bookingFilterStatusBadge');

  if (btnToday) {
    btnToday.className = (currentBookingDateFilter === 'today') ? 'btn-head-action btn-green' : 'btn-head-action btn-cyan';
  }
  if (btnAll) {
    btnAll.className = (currentBookingDateFilter === 'all') ? 'btn-head-action btn-green' : 'btn-head-action btn-cyan';
  }

  if (currentBookingDateFilter === 'today') {
    if (datePicker) datePicker.value = '';
    if (badge) badge.textContent = 'Filtrado por: Reservas de Hoy (' + getTodayDateStr() + ')';
  } else if (currentBookingDateFilter === 'all') {
    if (datePicker) datePicker.value = '';
    if (badge) badge.textContent = 'Filtrado por: Todas las Reservas (' + (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData) ? bookingsData.length : 0) + ')';
  } else {
    if (datePicker) datePicker.value = currentBookingDateFilter;
    if (badge) badge.textContent = 'Filtrado por: Fecha ' + currentBookingDateFilter;
  }

  if (typeof renderBookingsTable === 'function') {
    renderBookingsTable();
  }
}

function getTodayDateStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

function isAttended(booking) {
  if (!booking) return false;
  if (booking.attended === true) return true;
  const s = (booking.status || '').toLowerCase();
  return s.indexOf('asisti') !== -1 || s.indexOf('completad') !== -1 || s.indexOf('finaliz') !== -1;
}

function isNoShow(booking) {
  if (!booking) return false;
  if (booking.noShow === true) return true;
  const s = (booking.status || '').toLowerCase();
  return s.indexOf('no asisti') !== -1 || s.indexOf('noshow') !== -1 || s.indexOf('no-show') !== -1;
}


function handleBookingTypeChange() {
  if (typeof calculateModalTotal === 'function') calculateModalTotal();
}


function getCurrentReceiptId() {
  if (typeof window !== 'undefined' && window.currentReceiptBookingId) return window.currentReceiptBookingId;
  if (currentReceiptBookingId) return currentReceiptBookingId;
  const infoDiv = document.getElementById('receiptModalBookingInfo');
  if (infoDiv && infoDiv.textContent) {
    const match = infoDiv.textContent.match(/RES-\d+/i);
    if (match) return match[0];
  }
  return null;
}

function openReceiptViewerModal(bookingId, receiptUrl) {
  if (bookingId) {
    currentReceiptBookingId = bookingId;
    window.currentReceiptBookingId = bookingId;
  }
  const modal = document.getElementById('receiptViewerModal');
  const infoDiv = document.getElementById('receiptModalBookingInfo');
  const imgEl = document.getElementById('receiptModalImage');

  let b = null;
  if (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData)) {
    b = bookingsData.find(function(x) { return x.id === bookingId; });
  }

  if (b) {
    if (infoDiv) {
      const client = typeof fixMojibake === 'function' ? fixMojibake(b.clientName || 'Cliente') : (b.clientName || 'Cliente');
      const court = typeof fixMojibake === 'function' ? fixMojibake(b.courtName || 'Cancha') : (b.courtName || 'Cancha');
      const pm = b.paymentMethod || 'Transferencia Bancaria / App';
      const statusText = b.paid ? 'PAGADO Y CONFIRMADO' : (b.receiptImage ? 'POR VALIDAR (COMPROBANTE CARGADO)' : 'PENDIENTE DE PAGO');
      const statusColor = b.paid ? '#059669' : '#D97706';

      infoDiv.innerHTML =
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
          '<strong style="font-size: 14px; color: #0F172A;">Reservaci\u00f3n #' + b.id + '</strong>' +
          '<span style="background: ' + (b.paid ? '#ECFDF5' : '#FFFBEB') + '; color: ' + statusColor + '; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 11px;">' + statusText + '</span>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #334155;">' +
          '<div><strong>Cliente:</strong> ' + client + '</div>' +
          '<div><strong>Tel\u00e9fono:</strong> ' + (b.clientPhone || b.phone || 'Sin registro') + '</div>' +
          '<div><strong>Cancha:</strong> ' + court + '</div>' +
          '<div><strong>Horario:</strong> ' + (b.date || '') + ' (' + (b.timeSlot || '') + ')</div>' +
          '<div><strong>M\u00e9todo:</strong> ' + pm + '</div>' +
          '<div><strong>Monto:</strong> <span style="font-weight: 800; color: #059669;">$' + (b.price || 300) + '.00 MXN</span></div>' +
        '</div>';
    }

    if (imgEl) {
      const proof = receiptUrl || b.receiptImage || b.receiptUrl || b.receipt;
      if (proof) {
        imgEl.src = proof;
        imgEl.alt = 'Comprobante de Pago';
      } else {
        imgEl.src = 'assets/images/cancha_padel_1.jpg';
        imgEl.alt = 'Imagen de Comprobante Pendiente de Carga';
      }
    }
  }

  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }
}

function openReceiptModal(bookingId, receiptUrl) {
  openReceiptViewerModal(bookingId, receiptUrl);
}

function viewReceiptModal(bookingId, receiptUrl) {
  openReceiptViewerModal(bookingId, receiptUrl);
}

function closeReceiptViewerModal() {
  const el = document.getElementById('receiptViewerModal');
  if (el) el.style.display = 'none';
}

function printBookingTicket(bookingId) {
  const id = bookingId || getCurrentReceiptId();
  window.print();
}

async function confirmApprovePaymentFromModal() {
  const bookingId = getCurrentReceiptId();
  closeReceiptViewerModal();
  if (!bookingId) return;

  if (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData)) {
    const item = bookingsData.find(function(x) { return x.id === bookingId; });
    if (item) {
      item.paid = true;
      item.paymentStatus = 'Pagado (Aprobado)';
    }
  }
  if (typeof renderBookingsTable === 'function') renderBookingsTable();

  try {
    let res = await fetch('api/approve-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId: bookingId })
    });
    if (!res.ok) {
      res = await fetch('api/bookings/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ bookingId: bookingId })
      });
    }
    if (typeof showNotification === 'function') {
      showNotification('success', '\u00a1Pago Aprobado! \ud83d\udcb3', 'Se aprob\u00f3 el pago de la reservaci\u00f3n #' + bookingId + '.');
    }
    if (typeof fetchAdminData === 'function') fetchAdminData();
    if (typeof fetchCashShiftStatus === 'function') fetchCashShiftStatus();
  } catch (err) {
    if (typeof showNotification === 'function') {
      showNotification('success', '\u00a1Pago Aprobado! \ud83d\udcb3', 'Se actualiz\u00f3 la reservaci\u00f3n #' + bookingId + '.');
    }
  }
}

function promptRejectPaymentFromModal() {
  closeReceiptViewerModal();
  const modal = document.getElementById('rejectReasonModalOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeRejectReasonModal() {
  const el = document.getElementById('rejectReasonModalOverlay');
  if (el) el.style.display = 'none';
}

async function confirmRejectPaymentWithReason() {
  const reasonInput = document.getElementById('rejectReasonInput');
  const reason = reasonInput ? reasonInput.value.trim() : 'Comprobante no v\u00e1lido';
  const bookingId = getCurrentReceiptId();
  closeRejectReasonModal();

  if (!bookingId) return;

  if (typeof bookingsData !== 'undefined' && Array.isArray(bookingsData)) {
    const item = bookingsData.find(function(x) { return x.id === bookingId; });
    if (item) {
      item.paid = false;
      item.paymentStatus = 'Rechazado: ' + reason;
    }
  }
  if (typeof renderBookingsTable === 'function') renderBookingsTable();

  try {
    let res = await fetch('api/reject-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId: bookingId, reason: reason })
    });
    if (!res.ok) {
      res = await fetch('api/bookings/reject-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ bookingId: bookingId, reason: reason })
      });
    }
    if (typeof showNotification === 'function') {
      showNotification('warning', 'Pago Rechazado \u274c', 'Se rechaz\u00f3 el comprobante de la reservaci\u00f3n #' + bookingId + '.');
    }
    if (typeof fetchAdminData === 'function') fetchAdminData();
  } catch (err) {
    /* silent error */
  }
}

function closeBankInfoModal() {
  const el = document.getElementById('bankInfoModalOverlay');
  if (el) el.style.display = 'none';
}

function updateFranjaHorariaChart(todayBookings) {
  const activeBookings = (todayBookings || []).filter(function(b) { return b.status !== 'Cancelada'; });

  const capacities = [6, 6, 6, 7, 6];
  const counts = [0, 0, 0, 0, 0];

  activeBookings.forEach(function(b) {
    let rawTime = (b.timeSlot || b.time || '00:00').toString().trim();
    let hour = parseInt(rawTime, 10) || 0;
    let min = 0;
    if (rawTime.indexOf(':') !== -1) {
      const parts = rawTime.split(':');
      min = parseInt(parts[1], 10) || 0;
    }

    if (hour >= 8 && hour < 11) counts[0]++;
    else if (hour >= 11 && hour < 14) counts[1]++;
    else if (hour >= 14 && hour < 17) counts[2]++;
    else if (hour >= 17 && (hour < 20 || (hour === 20 && min < 30))) counts[3]++;
    else if (hour > 20 || (hour === 20 && min >= 30)) counts[4]++;
  });

  const barHeights = [];
  for (let i = 0; i < 5; i++) {
    const idx = i + 1;
    const pEl = document.getElementById('franja' + idx + 'Percent');
    const bEl = document.getElementById('franja' + idx + 'Bar');

    const pct = Math.min(100, Math.round((counts[i] / capacities[i]) * 100));
    const displayHeight = Math.max(12, Math.min(100, pct === 0 ? 12 : pct));
    barHeights.push(displayHeight);

    if (pEl) {
      pEl.textContent = pct + '%';
      if (pct >= 80) pEl.className = 'sankey-percent text-green';
      else pEl.className = 'sankey-percent';
    }
    if (bEl) {
      bEl.style.height = displayHeight + 'px';
    }
  }

  const svgEl = document.querySelector('.sankey-svg-ribbons');
  if (svgEl) {
    const y0 = 120 - barHeights[0];
    const y1 = 120 - barHeights[1];
    const y2 = 120 - barHeights[2];
    const y3 = 120 - barHeights[3];
    const y4 = 120 - barHeights[4];

    svgEl.innerHTML =
      '<path d="M 40 ' + y0 + ' C 90 ' + y0 + ', 90 ' + y1 + ', 140 ' + y1 + '" fill="none" stroke="rgba(16, 185, 129, 0.35)" stroke-width="18" />' +
      '<path d="M 140 ' + y1 + ' C 190 ' + y1 + ', 190 ' + y2 + ', 240 ' + y2 + '" fill="none" stroke="rgba(2, 132, 199, 0.35)" stroke-width="22" />' +
      '<path d="M 240 ' + y2 + ' C 290 ' + y2 + ', 290 ' + y3 + ', 340 ' + y3 + '" fill="none" stroke="rgba(132, 204, 22, 0.35)" stroke-width="30" />' +
      '<path d="M 340 ' + y3 + ' C 390 ' + y3 + ', 390 ' + y4 + ', 440 ' + y4 + '" fill="none" stroke="rgba(239, 68, 68, 0.35)" stroke-width="28" />';
  }
}

function updateLiveCourtsWidget(todayBookings) {
  const activeBookings = (todayBookings || []).filter(function(b) { return b.status !== 'Cancelada'; });

  const c1Bookings = activeBookings.filter(function(b) { return (b.courtId === 'c1' || (b.courtName && b.courtName.toLowerCase().indexOf('1') !== -1)); });
  const c2Bookings = activeBookings.filter(function(b) { return (b.courtId === 'c2' || (b.courtName && b.courtName.toLowerCase().indexOf('2') !== -1)); });

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  function renderCourtBadge(courtIdNum, bookings) {
    const infoEl = document.getElementById('liveCourt' + courtIdNum + 'Info');
    if (!infoEl) return;

    if (!bookings || bookings.length === 0) {
      infoEl.innerHTML = '<span class="tag-pista-num">PISTA ' + courtIdNum + '</span><span>Sin Reservas Hoy</span><span class="badge-status-available">DISPONIBLE</span>';
      return;
    }

    bookings.sort(function(a, b) {
      let hA = parseInt(a.timeSlot || a.time || '0', 10);
      let hB = parseInt(b.timeSlot || b.time || '0', 10);
      return hA - hB;
    });

    let playingBooking = null;
    let upcomingBooking = null;

    for (let i = 0; i < bookings.length; i++) {
      let b = bookings[i];
      let rawTime = (b.timeSlot || b.time || '00:00').toString();
      let startH = parseInt(rawTime, 10) || 0;
      let startM = 0;
      if (rawTime.indexOf(':') !== -1) {
        let parts = rawTime.split(':');
        startM = parseInt(parts[1], 10) || 0;
      }
      let durationHours = 1;
      if (rawTime.indexOf('2 hora') !== -1 || rawTime.indexOf('2h') !== -1) durationHours = 2;

      let startMin = startH * 60 + startM;
      let endMin = startMin + durationHours * 60;

      if (currentMinutes >= startMin && currentMinutes < endMin) {
        playingBooking = { booking: b, remMin: endMin - currentMinutes };
        break;
      } else if (currentMinutes < startMin && !upcomingBooking) {
        upcomingBooking = b;
      }
    }

    const selected = playingBooking ? playingBooking.booking : (upcomingBooking || bookings[bookings.length - 1]);
    const clientName = selected.clientName || 'Cliente Padel';
    const slotStr = selected.timeSlot || selected.time || 'Hoy';

    if (playingBooking) {
      infoEl.innerHTML = '<span class="tag-pista-num">PISTA ' + courtIdNum + '</span><span>' + clientName + '</span><span class="badge-status-playing">EN JUEGO (' + playingBooking.remMin + ' min restantes)</span>';
    } else {
      const isPaidStr = selected.paid ? 'PAGADO' : 'PENDIENTE PAGO';
      const statusClass = selected.paid ? 'badge-status-playing' : 'badge-status-reserved';
      infoEl.innerHTML = '<span class="tag-pista-num">PISTA ' + courtIdNum + '</span><span>' + clientName + '</span><span class="' + statusClass + '">RESERVADA ' + slotStr + ' (' + isPaidStr + ')</span>';
    }
  }

  renderCourtBadge(1, c1Bookings);
  renderCourtBadge(2, c2Bookings);
}


let courtsData = [
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


function updateCashUI() {
  const isShiftOpen = !!(cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta');
  const activeShift = isShiftOpen ? cashStatusData.activeShift : null;

  const navDot = document.getElementById('navbarCashDot');
  const navText = document.getElementById('navbarCashText');
  if (navDot) {
    navDot.className = isShiftOpen ? 'dot-green' : 'dot-red';
  }
  if (navText) {
    navText.textContent = isShiftOpen ? 'Caja Abierta' : 'Caja Cerrada';
  }

  const bannerTitle = document.getElementById('cashBannerTitle');
  const bannerSubtitle = document.getElementById('cashBannerSubtitle');

  if (isShiftOpen && activeShift) {
    if (bannerTitle) {
      bannerTitle.textContent = '🟢 Caja Abierta (Turno Activo)';
      bannerTitle.style.color = '#166534';
    }
    if (bannerSubtitle) {
      const openTime = (activeShift.openTime || 'Hoy').replace('T', ' ');
      const resp = activeShift.responsible || 'Administrador Level Tacámbaro';
      bannerSubtitle.textContent = 'Apertura: ' + openTime + ' | Responsable: ' + resp;
      bannerSubtitle.style.color = '#15803D';
    }
  } else {
    if (bannerTitle) {
      bannerTitle.textContent = '🔒 Caja Cerrada (Sin Turno Activo)';
      bannerTitle.style.color = '#991B1B';
    }
    if (bannerSubtitle) {
      bannerSubtitle.textContent = 'No hay un turno de caja abierto actualmente. Presiona "Abrir Caja / Turno" para comenzar.';
      bannerSubtitle.style.color = '#991B1B';
    }
  }

  if (typeof renderFinancesTable === 'function') renderFinancesTable();
  if (typeof renderFinancesKPIs === 'function') renderFinancesKPIs();
}

async function fetchCashShiftStatus() {
  try {
    const res = await fetch('api/cash/status');
    if (res.ok) {
      cashStatusData = await res.json();
      if (typeof updateCashUI === 'function') updateCashUI();
    }
  } catch (err) {
    console.warn('Error fetching cash status:', err);
  }
}


async function handleMarkAttendance(bookingId, attendance) {
  if (!bookingId) return;
  try {
    const res = await fetch('api/bookings/mark-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId: bookingId, attendance: attendance })
    });
    const text = await res.text();
    let data = {};
    try {
      const cleanText = text ? text.trim().replace(/^\uFEFF/, '') : '{}';
      data = JSON.parse(cleanText);
    } catch (e) {
      console.warn('JSON parse warning in handleMarkAttendance:', e, text);
    }
    if ((res.ok || data.success) && data.success !== false) {
      const isNoShow = (attendance || '').toLowerCase().includes('no');
      if (isNoShow) {
        showNotification('warning', 'Inasistencia Registrada', 'Se marco inasistencia (No-Show) para la reserva ' + bookingId + '. Se registro el adeudo correspondiente al cliente.');
      } else {
        showNotification('success', 'Asistencia Confirmada', 'Se confirmo la asistencia y pago de la reserva ' + bookingId + '.');
      }
      if (typeof fetchAdminData === 'function') fetchAdminData();
      if (typeof fetchAdminUsers === 'function') fetchAdminUsers();
      if (typeof fetchAdminFinances === 'function') fetchAdminFinances();
    } else {
      showNotification('error', 'Error al Actualizar', data.message || 'No se pudo actualizar la asistencia.');
    }
  } catch (err) {
    console.error('Error in handleMarkAttendance:', err);
    showNotification('error', 'Error Servidor', 'Ocurrio un detalle al conectar con el servidor.');
  }
}

async function handleMarkPaid(bookingId, paymentMethod) {
  if (!bookingId) return;
  if (!isCashShiftOpen()) {
    showNotification('warning', 'Caja Cerrada 🔒', 'Debes abrir un turno de caja antes de registrar el cobro de la reserva.');
    if (typeof openOpenCashModal === 'function') openOpenCashModal();
    return;
  }
  const pm = paymentMethod || 'Efectivo en Mostrador';
  try {
    const res = await fetch('api/bookings/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId: bookingId, paymentMethod: pm })
    });
    const text = await res.text();
    let data = {};
    try {
      const cleanText = text ? text.trim().replace(/^\uFEFF/, '') : '{}';
      data = JSON.parse(cleanText);
    } catch (e) {
      console.warn('JSON parse warning in handleMarkPaid:', e, text);
    }
    if ((res.ok || data.success) && data.success !== false) {
      const amt = data.booking ? data.booking.price : 300;
      showNotification('success', 'Pago Registrado', 'Se registro el pago de $' + amt + '.00 MXN para la reserva ' + bookingId + '.');
      if (typeof fetchAdminData === 'function') fetchAdminData();
      if (typeof fetchAdminFinances === 'function') fetchAdminFinances();
      if (typeof fetchAdminUsers === 'function') fetchAdminUsers();
    } else {
      showNotification('error', 'Error al Registrar Pago', data.message || 'No se pudo registrar el pago.');
    }
  } catch (err) {
    console.error('Error in handleMarkPaid:', err);
    showNotification('error', 'Error Servidor', 'Ocurrio un detalle al conectar con el servidor.');
  }
}

function handleAdminLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const userEl = document.getElementById('loginUsername') || document.getElementById('loginEmail');
  const passwordEl = document.getElementById('loginPassword');
  const alertBox = document.getElementById('loginAlertBox');
  const alertText = document.getElementById('loginAlertText');

  if (alertBox) alertBox.style.display = 'none';

  const username = userEl ? userEl.value.trim().toLowerCase() : '';
  const password = passwordEl ? passwordEl.value.trim() : '';

  if (!username || !password) {
    if (alertBox && alertText) {
      alertText.textContent = 'Por favor ingresa tu usuario y contraseÃ±a.';
      alertBox.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }
    if (typeof showNotification === 'function') showNotification('error', 'Campos Incompletos âš ï¸', 'Por favor ingresa tu usuario y contraseÃ±a.');
    return;
  }

  const savedPass = localStorage.getItem('adminPassword') || 'admin123';
  const validUsernames = ['admin', 'admin@level.com', 'administrador', 'admin_tacambaro', 'gerente'];

  const isValidUser = validUsernames.includes(username) || username.startsWith('admin');
  const isValidPass = (password === savedPass);

  if (isValidUser && isValidPass) {
    if (alertBox) alertBox.style.display = 'none';
    localStorage.setItem('adminLoggedIn', 'true');
    const overlay = document.getElementById('adminLoginOverlay') || document.getElementById('adminLoginModalOverlay');
    if (overlay) overlay.style.display = 'none';
    if (typeof showNotification === 'function') showNotification('success', 'Â¡Bienvenido! ðŸ‘‹', 'Has iniciado sesiÃ³n exitosamente en el Panel Administrador Level TacÃ¡mbaro.');
    if (typeof fetchAdminData === 'function') fetchAdminData();
  } else {
    if (alertBox && alertText) {
      alertText.textContent = 'Usuario o contraseÃ±a incorrectos. Por favor verifica tus datos.';
      alertBox.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }
    if (typeof showNotification === 'function') showNotification('error', 'Usuario o contraseÃ±a incorrectos âŒ', 'El usuario o la contraseÃ±a ingresados no son vÃ¡lidos. Por favor verifica tus datos.');
  }
}
function openChangePasswordModal() {
  const modal = document.getElementById('modalChangeAdminPasswordOverlay');
  if (modal) {
    modal.style.display = 'flex';
    const passNew = document.getElementById('changePassNew');
    const passConfirm = document.getElementById('changePassConfirm');
    const alertBox = document.getElementById('changePassAlertBox');
    if (passNew) passNew.value = '';
    if (passConfirm) passConfirm.value = '';
    if (alertBox) alertBox.style.display = 'none';
  }
}

function closeChangePasswordModal() {
  const modal = document.getElementById('modalChangeAdminPasswordOverlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

async function handleSaveNewPassword(e) {
  if (e && e.preventDefault) e.preventDefault();
  const passNewEl = document.getElementById('changePassNew');
  const passConfirmEl = document.getElementById('changePassConfirm');
  const alertBox = document.getElementById('changePassAlertBox');
  const alertText = document.getElementById('changePassAlertText');

  if (alertBox) alertBox.style.display = 'none';

  const newPass = passNewEl ? passNewEl.value.trim() : '';
  const confirmPass = passConfirmEl ? passConfirmEl.value.trim() : '';

  if (!newPass || newPass.length < 4) {
    if (alertBox && alertText) {
      alertText.textContent = 'La contraseña debe tener al menos 4 caracteres.';
      alertBox.style.display = 'flex';
    }
    if (typeof showNotification === 'function') {
      showNotification('error', 'Clave Muy Corta ⚠️', 'La contraseña debe tener al menos 4 caracteres.');
    }
    return;
  }

  if (newPass !== confirmPass) {
    if (alertBox && alertText) {
      alertText.textContent = 'Las contraseñas no coinciden. Por favor verifica.';
      alertBox.style.display = 'flex';
    }
    if (typeof showNotification === 'function') {
      showNotification('error', 'No Coinciden ⚠️', 'Las contraseñas no coinciden.');
    }
    return;
  }

  try {
    const res = await fetch('api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'USR-1004', username: 'admin', newPassword: newPass })
    });
    const data = await res.json();
    if (data && data.success) {
      localStorage.setItem('adminPassword', newPass);
      closeChangePasswordModal();
      if (typeof showNotification === 'function') {
        showNotification('success', '¡Contraseña Actualizada! 🔑', 'La clave del Administrador fue cambiada con éxito.');
      }
    } else {
      localStorage.setItem('adminPassword', newPass);
      closeChangePasswordModal();
      if (typeof showNotification === 'function') {
        showNotification('success', '¡Contraseña Actualizada! 🔑', 'La clave del Administrador fue actualizada.');
      }
    }
  } catch (err) {
    localStorage.setItem('adminPassword', newPass);
    closeChangePasswordModal();
    if (typeof showNotification === 'function') {
      showNotification('success', '¡Contraseña Actualizada! 🔑', 'La clave del Administrador fue actualizada.');
    }
  }
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
  // Throttled via setupRealtimeEvents

  const savedTab = localStorage.getItem('adminActiveTab');
  if (savedTab) {
    switchAdminTab(savedTab);
  }
});

function switchAdminTab(tabName) {
  if (tabName) {
    try { localStorage.setItem('adminActiveTab', tabName); } catch (e) { }
  }
  const key = (tabName || '').toLowerCase();
  document.querySelectorAll('.admin-sidebar .nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.querySelector(`.admin-sidebar .nav-btn[onclick*="'${tabName}'"]`) || document.querySelector(`.admin-sidebar .nav-btn[onclick*="'${key}'"]`);
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
    caja: 'adminTabCaja',
    cancelaciones: 'adminTabCancelaciones'
  };

  const targetPaneId = paneMap[key] || 'adminTabReservas';
  const pane = document.getElementById(targetPaneId);
  if (pane) {
    pane.classList.add('active');
  }

  if (key === 'canchas') {
    renderAdminCourtsGrid();
  } else if (key === 'tpv') {
    renderTpvGrid();
  } else if (key === 'planning') {
    renderMonthlyCalendar();
  } else if (key === 'caja') {
    fetchCashShiftStatus();
  } else if (key === 'cancelaciones') {
    fetchCancelledBookings();
  } else if (key === 'usuarios') {
    if (typeof fetchAdminUsers === 'function') fetchAdminUsers();
    else if (typeof renderUsersTable === 'function') renderUsersTable();
  } else if (key === 'torneos') {
    if (typeof fetchAdminTournaments === 'function') fetchAdminTournaments();
    else if (typeof renderTournamentsTable === 'function') renderTournamentsTable();
  } else if (key === 'productos') {
    if (typeof renderProductsTable === 'function') renderProductsTable();
  } else if (key === 'finanzas') {
    if (typeof renderFinancesTable === 'function') renderFinancesTable();
    if (typeof renderFinancesKPIs === 'function') renderFinancesKPIs();
  } else if (key === 'reservas' || key === 'reservas_list') {
    if (typeof renderBookingsTable === 'function') renderBookingsTable();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

let _adminCourtsJson = '';
let _adminBookingsJson = '';
let isFetchingAdminData = false;

async function fetchAdminData() {
  if (isFetchingAdminData) return;
  isFetchingAdminData = true;
  try {
    const resCourts = await fetch('api/courts');
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

    const resBookings = await fetch('api/bookings');
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
        const dayModal = document.getElementById('dayAvailabilityModalOverlay') || document.getElementById('modalDay24hOverlay');
        if (dayModal && dayModal.style.display !== 'none' && typeof renderDay24hGrid === 'function') { renderDay24hGrid(); }
      }
    }
  } catch (err) {
  } finally {
    isFetchingAdminData = false;
  }
}

let sseSource = null;
let sseRetryTimer = null;

let adminPollInterval = null;

function setupRealtimeEvents() {
  if (sseSource) {
    try { sseSource.close(); } catch (e) { }
    sseSource = null;
  }
  if (adminPollInterval) {
    clearInterval(adminPollInterval);
    adminPollInterval = null;
  }

  if (window.EventSource) {
    try {
      sseSource = new EventSource('api/events');
      sseSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          handleRealtimeEvent(payload);
        } catch (e) { }
      };
      sseSource.onerror = () => { };
    } catch (e) { }
  }

  adminPollInterval = setInterval(fetchAdminData, 10000);
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
    renderMonthlyCalendar();
    const dayModalOverlay = document.getElementById('dayAvailabilityModalOverlay');
    if (dayModalOverlay && dayModalOverlay.style.display !== 'none' && typeof renderDay24hGrid === 'function') {
      renderDay24hGrid();
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
  } else if (event.type === 'BOOKING_CANCELLED' || event.type === 'BOOKING_REFUNDED') {
    if (typeof fetchCancelledBookings === 'function') fetchCancelledBookings();
    if (typeof fetchAdminData === 'function') fetchAdminData();
  } else if (event.type === 'BOOKING_DELETED') {
    if (event.id) {
      bookingsData = bookingsData.filter(b => b.id !== event.id);
      renderMonthlyCalendar();
      if (document.getElementById('dayAvailabilityModalOverlay') && document.getElementById('dayAvailabilityModalOverlay').style.display !== 'none') {
        renderDay24hGrid();
      }
      renderBookingsTable();
      updateKPIs();
    }
    if (typeof fetchCancelledBookings === 'function') fetchCancelledBookings();
  } else if (event.type === 'CASH_SHIFT_UPDATED') {
    if (typeof fetchCashShiftStatus === 'function') fetchCashShiftStatus();
  } else if (event.type === 'FINANCES_UPDATED') {
    if (typeof fetchAdminData === 'function') fetchAdminData();
  } else if (event.type === 'BANK_INFO_UPDATED') {
    if (typeof fetchBankInfo === 'function') fetchBankInfo();
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
      ? '<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 16px;">No hay reservas registradas aun.</td></tr>'
      : bookingsData.map(function(b) {
          const cleanCourt = typeof fixMojibake === 'function' ? fixMojibake(b.courtName || '') : (b.courtName || '');
          const cleanClient = typeof fixMojibake === 'function' ? fixMojibake(b.clientName || 'Cliente Tacambaro') : (b.clientName || 'Cliente Tacambaro');

          let paidPill = '<span class="badge-status-pill" style="background:#FFF1F2; color:#E11D48; border:1px solid #FECDD3; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="alert-circle" style="width:12px; height:12px;"></i> Pendiente</span>';
          if (b.paid) {
            const pm = (b.paymentMethod || '').toLowerCase();
            if (pm.indexOf('tarjeta') !== -1) {
              paidPill = '<span class="badge-status-pill" style="background:#F5F3FF; color:#7C3AED; border:1px solid #DDD6FE; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="credit-card" style="width:12px; height:12px;"></i> Pagada (Tarjeta)</span>';
            } else if (pm.indexOf('transferencia') !== -1) {
              paidPill = '<span class="badge-status-pill" style="background:#F0FDF4; color:#166534; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="landmark" style="width:12px; height:12px;"></i> Pagada (Transfer)</span>';
            } else {
              paidPill = '<span class="badge-status-pill" style="background:#F0F9FF; color:#0284C7; border:1px solid #BAE6FD; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="banknote" style="width:12px; height:12px;"></i> Pagada (Efectivo)</span>';
            }
          }

          let receiptBtn = '';
          const hasReceipt = b.receiptUrl || b.receiptImage || b.receipt;
          if (hasReceipt) {
            receiptBtn = '<button class="btn-sm btn-secondary" onclick="openReceiptModal(\'' + b.id + '\')" style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; background:#F1F5F9; color:#334155; border:1px solid #CBD5E1;"><i data-lucide="eye" style="width:12px; height:12px;"></i> Ver Comprobante</button>';
          } else if (!b.paid) {
            receiptBtn = '<button class="btn-sm btn-primary" onclick="handleMarkPaid(\'' + b.id + '\')" style="display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; background:#059669; color:#FFF; border:none;"><i data-lucide="check" style="width:12px; height:12px;"></i> Marcar Pagado</button>';
          } else {
            receiptBtn = '<span style="color:#94A3B8; font-size:11px;"><i data-lucide="check-circle-2" style="width:12px; height:12px; color:#10B981;"></i> Sin comprobante</span>';
          }

          return '<tr>' +
            '<td><strong>' + b.id + '</strong></td>' +
            '<td>' + cleanCourt + '</td>' +
            '<td><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ' + (b.timeSlot || b.time || '') + '</span></td>' +
            '<td><strong style="color:#0F172A;">' + cleanClient + '</strong><small style="display:block; color:#64748B; font-size:10px;"><i data-lucide="phone" style="width:10px; height:10px; color:#64748B;"></i> ' + (b.clientPhone || 'Sin telefono') + '</small></td>' +
            '<td style="color: #059669; font-weight: 800;">$' + ((b.price !== undefined && b.price !== null) ? b.price : (b.totalPrice || b.amount || 300)) + '.00 MXN</td>' +
            '<td>' + paidPill + '</td>' +
            '<td>' + receiptBtn + '</td>' +
          '</tr>';
        }).join('');
  }

  if (tbodyFull) {
    const todayStr = getTodayDateStr();
    let displayBookings = (bookingsData || []);

    if (currentBookingDateFilter === 'today') {
      displayBookings = (bookingsData || []).filter(b => b.date && String(b.date).startsWith(todayStr));
    } else if (currentBookingDateFilter === 'all') {
      displayBookings = (bookingsData || []);
    } else if (currentBookingDateFilter && currentBookingDateFilter.length >= 8) {
      displayBookings = (bookingsData || []).filter(b => b.date && String(b.date).startsWith(currentBookingDateFilter));
    }

    tbodyFull.innerHTML = displayBookings.length === 0
      ? `<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 24px; font-weight: 600;">No hay reservas registradas para el filtro seleccionado. 🎾</td></tr>`
      : displayBookings.map(b => {
          const attLower = (b.attendance || '').toLowerCase();
          const isConfirmedAtt = attLower.includes('asistio') || attLower.includes('asistió');
          const isNoShow = attLower.includes('no asist') || attLower.includes('deuda');

          let attPill = `<span class="badge-status-pill" style="background:#FFFBEB; color:#D97706; border:1px solid #FDE68A; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="clock" style="width:12px; height:12px;"></i> Pendiente</span>`;
          if (isNoShow) {
            attPill = `<span class="badge-status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="user-x" style="width:12px; height:12px;"></i> No Asistió</span>`;
          } else if (isConfirmedAtt) {
            attPill = `<span class="badge-status-pill" style="background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="check-circle-2" style="width:12px; height:12px;"></i> Asistió</span>`;
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

          const pmLower = (b.paymentMethod || '').toLowerCase();
          const hasReceipt = b.receiptUrl || b.receiptImage || b.receipt || pmLower.includes('transferencia') || pmLower.includes('deposito') || pmLower.includes('depósito') || pmLower.includes('tarjeta');
          let receiptBtn = '';
          if (hasReceipt) {
            receiptBtn = `
              <div style="margin-top: 4px;">
                <button class="btn-head-action" style="padding: 3px 8px; font-size: 10px; background: #F0F9FF; color: #0284C7; border: 1px solid #BAE6FD; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="openReceiptViewerModal('${b.id}')" title="Ver comprobante de pago subido">
                  <i data-lucide="eye" style="width: 11px; height: 11px;"></i> Ver Comprobante
                </button>
              </div>
            `;
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
              <td><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ${b.date || ''} (${b.timeSlot || ''})</span></td>
              <td>
                <strong style="color:#0F172A;">${cleanClient}</strong>
                <small style="display:block; color:#64748B; font-size:10px;"><i data-lucide="phone" style="width:10px; height:10px; color:#64748B;"></i> ${b.clientPhone || 'Sin telefono'}</small>
              </td>
              <td style="color: #10B981; font-weight: bold;">$${(b.price !== undefined && b.price !== null) ? b.price : (b.totalPrice || b.amount || 300)}.00 MXN</td>
              <td>${attPill}</td>
              <td><div>${paidPill}</div>${receiptBtn}</td>
              <td>${actionContent}</td>
            </tr>
          `;
        }).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function updateKPIs() {
  const todayStr = getTodayDateStr();

  const todayBookings = (bookingsData || []).filter(function(b) { return b.date === todayStr && b.status !== 'Cancelada'; });
  const activeEl = document.getElementById('kpiActiveBookings');
  if (activeEl) activeEl.innerHTML = todayBookings.length + ' <small>Partidos</small>';

  const todayBookingIncome = todayBookings.filter(function(b) { return b.paid; }).reduce(function(acc, b) { return acc + (parseFloat(b.price) || 0); }, 0);
  const todayFinances = (financesData || []).filter(function(f) { return f.date && f.date.indexOf(todayStr) !== -1; });
  const todayFinanceIncome = todayFinances.reduce(function(acc, f) { return acc + (parseFloat(f.amount) || 0); }, 0);
  const totalIncome = todayBookingIncome + todayFinanceIncome;

  const incomeEl = document.getElementById('kpiTotalIncome');
  if (incomeEl) incomeEl.innerHTML = '$' + totalIncome.toFixed(2) + ' <small>MXN</small>';

  const maxSlots = 28;
  const occupancyPercent = ((todayBookings.length / maxSlots) * 100).toFixed(1);
  const occupancyEl = document.getElementById('kpiCourtOccupancy');
  if (occupancyEl) occupancyEl.textContent = occupancyPercent + '%';

  const shopSales = todayFinances.filter(function(f) { return f.category !== 'Reserva Canchas'; }).reduce(function(acc, f) { return acc + (parseFloat(f.amount) || 0); }, 0);
  const shopEl = document.getElementById('kpiShopIncome');
  if (shopEl) shopEl.innerHTML = '$' + shopSales.toFixed(2) + ' <small>MXN</small>';

  if (typeof updateFranjaHorariaChart === 'function') updateFranjaHorariaChart(todayBookings);
  if (typeof updateLiveCourtsWidget === 'function') updateLiveCourtsWidget(todayBookings);
}

async function toggleAdminSlot(courtId, slot) {
  try {
    const res = await fetch('api/admin/toggle-slot', {
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
    const res = await fetch('api/reserve', {
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
    const res = await fetch('api/users/create', {
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
    const res = await fetch('api/users/update', {
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
    const res = await fetch('api/users/reset-password', {
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
    const res = await fetch('api/users');
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
        const res = await fetch('api/users/delete', {
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
    const res = await fetch('api/finances');
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

  const activeShift = (cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta')
    ? cashStatusData.activeShift
    : null;

  if (!activeShift) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 28px; font-size: 14px; font-weight: 600;"><i data-lucide="lock" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 6px; color: #EF4444;"></i> No hay un turno de caja abierto actualmente. Abre caja para registrar o visualizar movimientos del turno.</td></tr>';
    if (window.lucide) lucide.createIcons();
    return;
  }

  const openTimeRaw = (activeShift.openTime || '').replace('T', ' ');
  const openDateOnly = openTimeRaw.split(' ')[0] || '';

  let shiftItems = (financesData || []).filter(function(f) {
    if (!f.date) return false;
    const fDateRaw = (f.date || '').replace('T', ' ');
    if (openTimeRaw) return fDateRaw >= openTimeRaw;
    return true;
  }).map(function(f) {
    return {
      id: f.id,
      date: f.date,
      clientName: f.clientName || 'Cliente Mostrador',
      concept: f.concept || f.description || f.reason || 'Devolución Cancelación',
      category: f.category || 'General',
      paymentMethod: f.paymentMethod || 'Efectivo',
      amount: f.amount || 0,
      type: f.type || 'ingreso',
      isManualMovement: false,
      movementType: f.type === 'egreso' ? 'salida' : 'entrada'
    };
  });

  const manualMovements = (cashStatusData && Array.isArray(cashStatusData.movements)) ? cashStatusData.movements : [];
  manualMovements.forEach(function(m) {
    if (m.origin === 'finance') return;
    const mConcept = (m.concept || '').toLowerCase();
    if (mConcept.includes('venta tpv:') || mConcept.includes('pago reserva')) return;
    const mTime = (m.timestamp || m.date || '').replace('T', ' ');
    if (openTimeRaw && mTime && mTime < openTimeRaw) return;

    shiftItems.push({
      id: m.id,
      date: m.timestamp || m.date || activeShift.openTime,
      clientName: m.responsible || 'Administrador Level Tacambaro',
      concept: m.concept || 'Movimiento Manual',
      category: m.category || 'Caja Chica',
      paymentMethod: 'Efectivo',
      amount: m.amount || 0,
      isManualMovement: true,
      movementType: m.type || 'entrada'
    });
  });

  shiftItems.sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });

  let filtered = shiftItems;
  if (currentFinanceFilter === 'canchas') {
    filtered = shiftItems.filter(function(f) { return (f.category || '').toLowerCase().includes('cancha') || (f.category || '').toLowerCase().includes('reserva'); });
  } else if (currentFinanceFilter === 'tienda') {
    filtered = shiftItems.filter(function(f) { return !(f.category || '').toLowerCase().includes('cancha') && !(f.category || '').toLowerCase().includes('reserva'); });
  } else if (currentFinanceFilter === 'efectivo') {
    filtered = shiftItems.filter(function(f) { return (f.paymentMethod || '').toLowerCase().includes('efectivo'); });
  } else if (currentFinanceFilter === 'tarjeta') {
    filtered = shiftItems.filter(function(f) { return !(f.paymentMethod || '').toLowerCase().includes('efectivo'); });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94A3B8; padding: 24px; font-weight: 600;">No hay movimientos o transacciones registradas durante el turno activo actual.</td></tr>';
    return;
  }

  let htmlRows = '';
  filtered.forEach(function(f) {
    let methodBadge = '<span class="badge-status-pill" style="background:#F0F9FF; color:#0284C7; border:1px solid #BAE6FD; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="banknote" style="width:12px; height:12px;"></i> Efectivo</span>';
    const pmLower = (f.paymentMethod || '').toLowerCase();
    if (pmLower.includes('tarjeta')) {
      methodBadge = '<span class="badge-status-pill" style="background:#F5F3FF; color:#7C3AED; border:1px solid #DDD6FE; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="credit-card" style="width:12px; height:12px;"></i> Tarjeta</span>';
    } else if (pmLower.includes('transferencia')) {
      methodBadge = '<span class="badge-status-pill" style="background:#F0FDF4; color:#166534; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="landmark" style="width:12px; height:12px;"></i> Transferencia</span>';
    }

    const cat = (f.category || '').toLowerCase();
    const conceptLower = (f.concept || '').toLowerCase();
    let catBadge = '<span class="badge-status-pill" style="background:#FEF3C7; color:#B45309; border:1px solid #FDE68A; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="shopping-bag" style="width:12px; height:12px;"></i> Tienda</span>';
    
    if (cat.includes('devoluc') || cat.includes('cancelac') || conceptLower.includes('devoluc')) {
      catBadge = '<span class="badge-status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FCA5A5; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="rotate-ccw" style="width:12px; height:12px;"></i> Devolución Cancelación</span>';
    } else if (f.id && f.id.indexOf('MOV-') === 0) {
      if (f.movementType === 'salida') {
        catBadge = '<span class="badge-status-pill" style="background:#FEE2E2; color:#B91C1C; border:1px solid #FCA5A5; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-up-right" style="width:12px; height:12px;"></i> Salida / Gasto</span>';
      } else {
        catBadge = '<span class="badge-status-pill" style="background:#EFF6FF; color:#1D4ED8; border:1px solid #BFDBFE; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-down-left" style="width:12px; height:12px;"></i> Entrada Manual</span>';
      }
    } else if (cat.includes('cancha') || cat.includes('reserva')) {
      catBadge = '<span class="badge-status-pill" style="background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="calendar" style="width:12px; height:12px;"></i> Cancha</span>';
    } else if (cat.includes('adeudo') || cat.includes('deuda')) {
      catBadge = '<span class="badge-status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FCA5A5; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="alert-circle" style="width:12px; height:12px;"></i> Adeudo</span>';
    } else if (cat.includes('movimiento') || cat.includes('manual') || cat.includes('entrada') || cat.includes('salida') || cat.includes('gasto')) {
      catBadge = '<span class="badge-status-pill" style="background:#F1F5F9; color:#475569; border:1px solid #CBD5E1; padding:4px 8px; border-radius:12px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right-left" style="width:12px; height:12px;"></i> Operacion</span>';
    }

    const cleanConcept = fixMojibake(f.concept || f.description || 'Devolución Cancelación');
    const cleanClient = fixMojibake(f.clientName || 'Cliente Mostrador');
    const isSalida = f.type === 'egreso' || cat.includes('devoluc') || conceptLower.includes('devoluc') || (f.isManualMovement && f.movementType === 'salida');
    
    const amountVal = Math.abs(parseFloat(f.amount || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 });
    const amountStr = isSalida ? ('-$' + amountVal + ' MXN') : ('+$' + amountVal + ' MXN');
    const amountColor = isSalida ? '#DC2626' : '#10B981';
    
    let statusPill = '<span class="badge-status-pill" style="background:#F0FDF4; color:#15803D; border:1px solid #86EFAC; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="check-circle" style="width:12px; height:12px;"></i> Ingresado</span>';
    if (isSalida) {
      statusPill = '<span class="badge-status-pill" style="background:#FEF2F2; color:#B91C1C; border:1px solid #FCA5A5; padding:4px 10px; border-radius:20px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-up-right" style="width:12px; height:12px;"></i> Devolución</span>';
    }

    htmlRows += '<tr>' +
      '<td><strong style="font-family: monospace; color: #475569;">' + f.id + '</strong></td>' +
      '<td style="white-space: nowrap;"><span style="display:inline-flex; align-items:center; gap:4px; font-weight:600; color:#334155;"><i data-lucide="clock" style="width:12px; height:12px; color:#0284C7;"></i> ' + f.date + '</span></td>' +
      '<td><strong>' + cleanClient + '</strong></td>' +
      '<td>' + cleanConcept + '</td>' +
      '<td>' + catBadge + '</td>' +
      '<td>' + methodBadge + '</td>' +
      '<td style="color: ' + amountColor + '; font-weight: 800; font-size: 14px;">' + amountStr + '</td>' +
      '<td>' + statusPill + '</td>' +
      '</tr>';
  });

  tbody.innerHTML = htmlRows;
  if (window.lucide) lucide.createIcons();
}

function renderFinancesKPIs() {
  let ventasEfectivo = 0;
  let cobrosDigitales = 0;
  let entradasManuales = 0;
  let salidasManuales = 0;
  let totalEnCaja = 0;

  if (cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta') {
    ventasEfectivo = cashStatusData.cashIncomes || 0;
    cobrosDigitales = cashStatusData.cardIncomes || 0;
    entradasManuales = cashStatusData.manualEntradas || 0;
    salidasManuales = cashStatusData.manualSalidas || 0;
    totalEnCaja = cashStatusData.expectedCash || 0;
  } else {
    const activeFinances = (financesData || []);
    activeFinances.forEach(function(f) {
      const amt = f.amount || 0;
      const pm = (f.paymentMethod || '').toLowerCase();
      if (pm.includes('efectivo')) {
        ventasEfectivo += amt;
      } else {
        cobrosDigitales += amt;
      }
    });
    totalEnCaja = ventasEfectivo;
  }

  const elShiftEfectivo = document.getElementById('cashKpiVentasEfectivo');
  const elShiftDigital = document.getElementById('cashKpiDigitalTurno');
  const elShiftManuals = document.getElementById('cashKpiManualsTurno');
  const elShiftTotal = document.getElementById('cashKpiTotalTurno');

  if (elShiftEfectivo) elShiftEfectivo.innerHTML = '$' + ventasEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' <small>MXN</small>';
  if (elShiftDigital) elShiftDigital.innerHTML = '$' + cobrosDigitales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' <small>MXN</small>';
  if (elShiftManuals) elShiftManuals.innerHTML = '+$' + entradasManuales + ' / -$' + salidasManuales;
  if (elShiftTotal) elShiftTotal.innerHTML = '$' + totalEnCaja.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' <small>MXN</small>';

  const totalIngresos = (financesData || []).reduce(function(acc, f) { return acc + (f.amount || 0); }, 0);
  const totalEfectivoAll = (financesData || []).filter(function(f) { return f.paymentMethod && f.paymentMethod.toLowerCase().includes('efectivo'); }).reduce(function(acc, f) { return acc + (f.amount || 0); }, 0);
  const totalDigitalAll = totalIngresos - totalEfectivoAll;
  const totalAdeudosAll = (usersData || []).reduce(function(acc, u) { return acc + (u.debtAmount || 0); }, 0);

  const elIngresos = document.getElementById('finTotalIngresos');
  const elEfectivo = document.getElementById('finTotalEfectivo');
  const elDigital = document.getElementById('finTotalDigital');
  const elAdeudos = document.getElementById('finTotalAdeudos');

  if (elIngresos) elIngresos.innerHTML = '$' + totalIngresos + '.00 <small>MXN</small>';
  if (elEfectivo) elEfectivo.innerHTML = '$' + totalEfectivoAll + '.00 <small>MXN</small>';
  if (elDigital) elDigital.innerHTML = '$' + totalDigitalAll + '.00 <small>MXN</small>';
  if (elAdeudos) elAdeudos.innerHTML = '$' + totalAdeudosAll + '.00 <small>MXN</small>';
}

function openPosSaleModal() {
  if (!isCashShiftOpen()) {
    showNotification('warning', 'Caja Cerrada 🔒', 'Debes abrir un turno de caja antes de realizar el cobro de adeudos.');
    if (typeof openOpenCashModal === 'function') openOpenCashModal();
    return;
  }
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
  if (e && e.preventDefault) e.preventDefault();
  const conceptInp = document.getElementById('posConceptInput');
  const amountInp = document.getElementById('posAmountInput');
  const categoryEl = document.getElementById('posCategorySelect');
  const pmSel = document.getElementById('posPaymentMethodSelect');
  const clientInp = document.getElementById('posClientInput');

  const concept = conceptInp ? conceptInp.value.trim() : '';
  const amount = amountInp ? parseFloat(amountInp.value) : 0;
  const category = categoryEl ? categoryEl.value : 'RecuperaciÃ³n de Adeudo';
  const paymentMethod = pmSel ? pmSel.value : 'Efectivo en Mostrador';
  const clientName = clientInp ? (clientInp.value.trim() || 'Cliente Mostrador') : 'Cliente Mostrador';

  if (!concept || isNaN(amount) || amount <= 0) {
    showNotification('error', 'Datos InvÃ¡lidos', 'Por favor ingresa un concepto y monto vÃ¡lido mayor a $0.');
    return;
  }

  try {
    const res = await fetch('api/finances/create', {
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

      const isDebt = category.includes('Adeudo') || concept.toLowerCase().includes('adeudo') || concept.toLowerCase().includes('deuda');
      if (isDebt) {
        showNotification('success', 'Â¡Adeudo Cobrado Correctamente! ðŸ’³', `Se ingresaron $${amount}.00 MXN a caja por cobro de adeudo atrasado. El cliente "${clientName}" ha sido desbloqueado.`);
      } else {
        showNotification('success', 'Â¡Venta Registrada Correctamente! ðŸ›’', `Se ingresaron $${amount}.00 MXN a caja por: ${concept}`);
      }
      if (typeof fetchAdminData === 'function') fetchAdminData();
      if (typeof fetchAdminUsers === 'function') fetchAdminUsers();
      if (typeof fetchAdminFinances === 'function') fetchAdminFinances();
    } else {
      showNotification('error', 'Error al Registrar', data.message || 'No se pudo guardar la transacciÃ³n.');
    }
  } catch (err) {
    console.error('Error in handlePosSaleSubmit:', err);
    showNotification('error', 'Error Servidor', 'OcurriÃ³Ã³ un detalle: ' + (err.message || 'No se pudo conectar con el servidor.'));
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
    const res = await fetch('api/history');
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
        <img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
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
    const res = await fetch('api/history/update', {
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
    const res = await fetch('api/products');
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
  if (currentProductFilter && currentProductFilter !== 'all' && currentProductFilter !== 'Todos') {
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
  if (!isCashShiftOpen()) {
    showNotification('warning', 'Caja Cerrada 🔒', 'Debes abrir un turno de caja antes de realizar cobros en el Punto de Venta.');
    if (typeof openOpenCashModal === 'function') openOpenCashModal();
    return;
  }

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
      const res = await fetch('api/products/sell', {
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
    showNotification('error', 'Error en Cobro', 'OcurriÃ³ó un inconveniente al procesar la venta.');
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
  const endpoint = isEdit ? 'api/products/update' : 'api/products/create';
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
        const res = await fetch('api/products/delete', {
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
  const isShiftOpen = !!(cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta');
  if (!isShiftOpen) {
    showNotification('warning', 'Caja Cerrada ðŸ”’', 'No hay un turno de caja abierto para registrar ventas en la tienda.');
    openOpenCashModal();
    return;
  }
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
    const res = await fetch('api/products/sell', {
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
    const res = await fetch('api/tournaments');
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
    const teamCount = (teamsList && teamsList.length > 0) ? teamsList.length : (t.registeredTeams || 0);

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
            <img src="${imgUrl}" alt="${cleanTitle}" style="width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1px solid #CBD5E1;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
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
  const endpoint = isEdit ? 'api/tournaments/update' : 'api/tournaments/create';
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
      const res = await fetch('api/tournaments/delete', {
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
            <img src="${court.image || 'assets/images/cancha_padel_1.jpg'}" alt="${cleanName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
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
  const endpoint = isEdit ? 'api/courts/update' : 'api/courts/create';
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
        const res = await fetch('api/courts/delete', {
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



function renderCashMovementsTable() {
  const tbody = document.getElementById('cashMovementsTableBody');
  if (!tbody) return;

  const activeShift = (cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta') ? cashStatusData.activeShift : null;
  if (!activeShift) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 20px;">No hay un turno de caja abierto actualmente.</td></tr>';
    return;
  }
  const openTimeRaw = (activeShift.openTime || '').replace('T', ' ');

  const rawMovements = (cashStatusData && Array.isArray(cashStatusData.movements)) ? cashStatusData.movements : [];
  const movements = rawMovements.filter(m => {
    const mTime = (m.timestamp || m.date || '').replace('T', ' ');
    if (openTimeRaw && mTime && mTime < openTimeRaw) return false;
    return true;
  });

  if (movements.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 20px;">No hay movimientos de efectivo registrados en el turno activo.</td></tr>';
    return;
  }

  tbody.innerHTML = movements.map(m => {
    const isEntrada = m.type === 'entrada';
    const badgeColor = isEntrada ? 'background: #DCFCE7; color: #15803D;' : 'background: #FEE2E2; color: #B91C1C;';
    const typeLabel = isEntrada ? 'Entrada' : 'Salida / Gasto';
    const sign = isEntrada ? '+' : '-';
    const amtColor = isEntrada ? '#166534' : '#DC2626';

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">${m.id}</td>
        <td>${m.timestamp || m.date || '-'}</td>
        <td><span style="padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 12px; ${badgeColor}">${typeLabel}</span></td>
        <td style="font-weight: 700; color: #0F172A;">${fixMojibake(m.concept || '')}</td>
        <td><span style="background: #F1F5F9; color: #475569; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">${fixMojibake(m.category || 'General')}</span></td>
        <td>${fixMojibake(m.responsible || 'Administrador Level Tacambaro')}</td>
        <td style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15px; color: ${amtColor};">${sign}$${(m.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</td>
      </tr>
    `;
  }).join('');
}

async function fetchCashHistory() {
  try {
    const res = await fetch('api/cash/history');
    if (res.ok) {
      cashHistoryData = await res.json();
      renderCashHistoryTable();
    }
  } catch (err) { console.warn('Error fetching cash history:', err); }
}

function renderCashHistoryTable() {
  const tbody = document.getElementById('cashHistoryTableBody');
  if (!tbody) return;

  if (!cashHistoryData || cashHistoryData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: #94A3B8; padding: 20px;">No hay historial de cierres de caja registrados aÃºn.</td></tr>';
    return;
  }

  tbody.innerHTML = cashHistoryData.map(c => {
    const isOpen = c.status === 'abierta';
    const statusBadge = isOpen
      ? '<span style="background: #DCFCE7; color: #15803D; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11.5px; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i> Abierta</span>'
      : '<span style="background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11.5px; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="lock" style="width: 12px; height: 12px;"></i> Cerrada</span>';

    const diff = c.difference || 0;
    let diffMarkup = '<span style="color: #64748B; font-weight: 600;">$0.00</span>';
    if (diff > 0) {
      diffMarkup = `<span style="color: #10B981; font-weight: 800;">+$${diff.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Sobrante)</span>`;
    } else if (diff < 0) {
      diffMarkup = `<span style="color: #EF4444; font-weight: 800;">-$${Math.abs(diff).toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Faltante)</span>`;
    }

    const initAmt = (c.initialAmount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cashInc = (c.cashIncomes || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const expCash = (c.expectedCash || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const physCash = (c.physicalCash || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cleanResp = fixMojibake(c.responsible || 'Administrador Level Tacambaro');

    return `
      <tr>
        <td><strong style="font-family: monospace; color: #0F172A; font-weight: 800;">${c.id}</strong></td>
        <td style="white-space: nowrap;"><span style="font-weight: 600; color: #334155;">${c.openTime || '-'}</span></td>
        <td style="white-space: nowrap;"><span style="font-weight: 600; color: #334155;">${c.closeTime || 'Turno Activo'}</span></td>
        <td><strong>${cleanResp}</strong></td>
        <td style="font-weight: 700; color: #475569;">$${initAmt}</td>
        <td style="color: #10B981; font-weight: 700;">+$${cashInc}</td>
        <td style="font-weight: 700; color: #059669;">$${expCash}</td>
        <td style="font-weight: 800; color: #0F172A;">$${physCash}</td>
        <td>${diffMarkup}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn-head-action" style="padding: 5px 10px; font-size: 11px; background: #0284C7; color: #FFF; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" onclick="openShiftDetailsModal('${c.id}')" title="Ver movimientos de este turno">
            <i data-lucide="eye" style="width: 12px; height: 12px;"></i> Ver Movimientos
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

async function openShiftDetailsModal(shiftId) {
  const modal = document.getElementById('modalShiftDetailsOverlay');
  if (!modal) return;

  let shift = (cashHistoryData || []).find(s => s.id === shiftId);
  if (!shift && cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.id === shiftId) {
    shift = cashStatusData.activeShift;
  }

  const titleEl = document.getElementById('shiftDetailModalTitle');
  const openTimeEl = document.getElementById('sdOpenTime');
  const closeTimeEl = document.getElementById('sdCloseTime');
  const respEl = document.getElementById('sdResponsible');
  const expEl = document.getElementById('sdExpected');
  const diffEl = document.getElementById('sdDiff');
  const notesBox = document.getElementById('sdNotesBox');
  const notesText = document.getElementById('sdNotesText');
  const tbody = document.getElementById('shiftDetailsTableBody');

  if (titleEl) titleEl.textContent = `Detalles del Turno ${shiftId}`;
  if (openTimeEl) openTimeEl.textContent = shift ? (shift.openTime || '-') : '-';
  if (closeTimeEl) closeTimeEl.textContent = shift ? (shift.closeTime || 'Turno Activo') : '-';
  if (respEl) respEl.textContent = shift ? fixMojibake(shift.responsible || 'Administrador') : '-';
  if (expEl) expEl.textContent = shift ? `$${(shift.expectedCash || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN` : '$0.00 MXN';

  if (diffEl && shift) {
    const d = shift.difference || 0;
    if (d === 0) {
      diffEl.style.color = '#059669';
      diffEl.textContent = 'Sin diferencia ($0.00 MXN)';
    } else if (d > 0) {
      diffEl.style.color = '#10B981';
      diffEl.textContent = `+$${d.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN (Sobrante)`;
    } else {
      diffEl.style.color = '#EF4444';
      diffEl.textContent = `-$${Math.abs(d).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN (Faltante)`;
    }
  }

  if (notesBox && notesText) {
    if (shift && shift.notes) {
      notesText.textContent = shift.notes;
      notesBox.style.display = 'block';
    } else {
      notesBox.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();

  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 20px;">Cargando movimientos del turno...</td></tr>';
  }

  try {
    const res = await fetch(`api/cash/shift-details?shiftId=${encodeURIComponent(shiftId)}`);
    if (res.ok) {
      const data = await res.json();
      const movements = data.movements || [];
      if (tbody) {
        if (movements.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 20px;">No hay movimientos o transacciones en este turno.</td></tr>';
        } else {
          tbody.innerHTML = movements.map(m => {
            const cat = fixMojibake(m.category || 'General');
            const concept = fixMojibake(m.concept || m.clientName || 'Movimiento');
            const pm = m.paymentMethod || 'Efectivo';
            const isSalida = m.type === 'salida';
            const color = isSalida ? '#EF4444' : '#10B981';
            const prefix = isSalida ? '-' : '+';

            return `
              <tr>
                <td style="white-space: nowrap; font-size: 12px; font-weight: 600; color: #334155;">${m.date || m.timestamp || '-'}</td>
                <td style="font-size: 12px; font-weight: 600; color: #0F172A;">${concept}</td>
                <td style="font-size: 11.5px; font-weight: 700; color: #475569;">${cat}</td>
                <td style="font-size: 11.5px; font-weight: 700; color: #0284C7;">${pm}</td>
                <td style="font-size: 13px; font-weight: 800; color: ${color};">${prefix}$${m.amount}.00 MXN</td>
              </tr>
            `;
          }).join('');
        }
      }
    }
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #EF4444; padding: 20px;">No se pudieron cargar los movimientos.</td></tr>';
    }
  }

  if (window.lucide) lucide.createIcons();
}

function closeShiftDetailsModal() {
  const modal = document.getElementById('modalShiftDetailsOverlay');
  if (modal) modal.style.display = 'none';
}

function switchCashSubTab(tabKey, btn) {
  document.querySelectorAll('.cash-tab-sub-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const subDiario = document.getElementById('cashSubTabDiario');
  const subHistory = document.getElementById('cashSubTabHistory');

  if (subDiario) subDiario.style.display = (tabKey === 'diario') ? 'block' : 'none';
  if (subHistory) subHistory.style.display = (tabKey === 'history') ? 'block' : 'none';

  if (tabKey === 'history') fetchCashHistory();
}

function isCashShiftOpen() {
  return !!(cashStatusData && cashStatusData.activeShift && cashStatusData.activeShift.status === 'abierta');
}

function openOpenCashModal() {
  if (isCashShiftOpen()) {
    showNotification('warning', 'Caja Ya Abierta 🟢', 'Ya existe un turno de caja abierto en el sistema.');
    return;
  }
  const modal = document.getElementById('modalOpenCashOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeOpenCashModal() {
  const modal = document.getElementById('modalOpenCashOverlay');
  if (modal) modal.style.display = 'none';
}

function openCashMovementModal() {
  if (!isCashShiftOpen()) {
    showNotification('warning', 'Caja Cerrada 🔒', 'Debes abrir un turno de caja antes de registrar movimientos de entradas o salidas.');
    openOpenCashModal();
    return;
  }
  const modal = document.getElementById('modalCashMovementOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeCashMovementModal() {
  const modal = document.getElementById('modalCashMovementOverlay');
  if (modal) modal.style.display = 'none';
}

/* ==========================================
   HANDLERS DE MODALES DE CAJA (ABRIR, MOVIMIENTOS, CORTE)
   ========================================== */
async function handleOpenCashSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const initAmtInput = document.getElementById('openInitialCashInput');
  const notesInput = document.getElementById('openCashNotesInput');

  const initialAmount = initAmtInput ? (parseFloat(initAmtInput.value) || 0) : 0;
  const notes = notesInput ? notesInput.value.trim() : '';

  try {
    const res = await fetch('api/cash/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ initialAmount: initialAmount, notes: notes, responsible: 'Administrador Level Tacambaro' })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof closeOpenCashModal === 'function') closeOpenCashModal();
      showNotification('success', '¡Caja Abierta Correctamente! 🔓', 'Se abrio el turno de caja con fondo inicial de $' + initialAmount + '.00 MXN.');
      await fetchCashShiftStatus();
    } else {
      showNotification('error', 'Error al Abrir Caja', data.message || 'No se pudo abrir la caja.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleCashMovementSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const typeSelect = document.getElementById('movType');
  const amtInput = document.getElementById('movAmount');
  const catInput = document.getElementById('movCategory');
  const conceptInput = document.getElementById('movConcept');

  const type = typeSelect ? typeSelect.value : 'salida';
  const amount = amtInput ? (parseFloat(amtInput.value) || 0) : 0;
  const category = catInput ? catInput.value.trim() : 'Manual';
  const concept = conceptInput ? conceptInput.value.trim() : 'Movimiento de Caja';

  if (amount <= 0) {
    showNotification('error', 'Monto Invalido', 'Ingresa un monto mayor a  MXN.');
    return;
  }

  try {
    const res = await fetch('api/cash/movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ type: type, amount: amount, category: category, concept: concept, responsible: 'Administrador Level Tacambaro' })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof closeCashMovementModal === 'function') closeCashMovementModal();
      const typeLabel = type === 'salida' ? 'Salida / Gasto' : 'Entrada / Deposito';
      showNotification('success', '¡Movimiento Registrado! 💰', 'Se registro la ' + typeLabel + ' de $' + amount + '.00 MXN por: ' + concept);
      await fetchCashShiftStatus();
    } else {
      showNotification('error', 'Error en Movimiento', data.message || 'No se pudo registrar el movimiento.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function handleCashCutSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const physInput = document.getElementById('cutPhysicalCash') || document.getElementById('cutPhysicalCashInput');
  const notesInput = document.getElementById('cutNotesInput');

  const physicalCash = physInput ? (parseFloat(physInput.value) || 0) : 0;
  const notes = notesInput ? notesInput.value.trim() : '';

  try {
    const res = await fetch('api/cash/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ physicalCash: physicalCash, notes: notes })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof closeCashCutModal === 'function') closeCashCutModal();
      const diff = data.shift ? data.shift.difference : 0;
      const diffStr = diff >= 0 ? ('+$' + diff + '.00 MXN') : ('-$' + Math.abs(diff) + '.00 MXN');
      showNotification('success', '¡Corte de Caja Exitoso! 🔒', 'Se cerro el turno de caja. Diferencia en arqueo: ' + diffStr);
      await fetchCashShiftStatus();
    } else {
      showNotification('error', 'Error al Cerrar Caja', data.message || 'No se pudo cerrar la caja.');
    }
  } catch (err) {
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

async function openCashCutModal() {
  if (typeof fetchCashShiftStatus === 'function') {
    try { await fetchCashShiftStatus(); } catch (e) { }
  }

  if (!isCashShiftOpen()) {
    showNotification('warning', 'Caja Cerrada 🔒', 'No hay un turno de caja abierto para realizar el corte de caja.');
    return;
  }

  const modal = document.getElementById('modalCashCutOverlay');
  if (!modal) return;

  const shift = (cashStatusData && cashStatusData.activeShift) ? cashStatusData.activeShift : {};
  const initAmt = parseFloat(shift.initialAmount || 0);
  const cashSales = parseFloat(cashStatusData ? cashStatusData.cashIncomes || 0 : 0);
  const mEntradas = parseFloat(cashStatusData ? cashStatusData.manualEntradas || 0 : 0);
  const mSalidas = parseFloat(cashStatusData ? cashStatusData.manualSalidas || 0 : 0);
  const expectedVal = cashStatusData ? parseFloat(cashStatusData.expectedCash || (initAmt + cashSales + mEntradas - mSalidas)) : initAmt;

  const elInit = document.getElementById('cutSummaryInitial');
  const elVentas = document.getElementById('cutSummaryVentas');
  const elEntradas = document.getElementById('cutSummaryEntradas');
  const elSalidas = document.getElementById('cutSummarySalidas');
  const elExpected = document.getElementById('cutSummaryExpected');
  const physInput = document.getElementById('cutPhysicalCash') || document.getElementById('cutPhysicalCashInput');

  if (elInit) elInit.textContent = `$${initAmt.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  if (elVentas) elVentas.textContent = `+$${cashSales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  if (elEntradas) elEntradas.textContent = `+$${mEntradas.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  if (elSalidas) elSalidas.textContent = `-$${mSalidas.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  if (elExpected) elExpected.textContent = `$${expectedVal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

  if (physInput) {
    physInput.value = expectedVal > 0 ? expectedVal.toString() : '0';
  }

  calculateCutDifferenceLive();
  modal.style.display = 'flex';
}

function calculateCutDifferenceLive() {
  const physInput = document.getElementById('cutPhysicalCash') || document.getElementById('cutPhysicalCashInput');
  const physVal = physInput ? (parseFloat(physInput.value) || 0) : 0;
  const shift = (cashStatusData && cashStatusData.activeShift) ? cashStatusData.activeShift : {};
  const initAmt = parseFloat(shift.initialAmount || 0);
  const cashSales = parseFloat(cashStatusData ? cashStatusData.cashIncomes || 0 : 0);
  const mEntradas = parseFloat(cashStatusData ? cashStatusData.manualEntradas || 0 : 0);
  const mSalidas = parseFloat(cashStatusData ? cashStatusData.manualSalidas || 0 : 0);
  const expectedVal = cashStatusData ? parseFloat(cashStatusData.expectedCash || (initAmt + cashSales + mEntradas - mSalidas)) : initAmt;
  const diff = physVal - expectedVal;

  const diffEl = document.getElementById('cutDifferenceDisplay');
  if (!diffEl) return;

  if (diff === 0) {
    diffEl.style.color = '#10B981';
    diffEl.textContent = '$0.00 (Cuadre Perfecto)';
  } else if (diff > 0) {
    diffEl.style.color = '#059669';
    diffEl.textContent = `+$${diff.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Sobrante)`;
  } else {
    diffEl.style.color = '#EF4444';
    diffEl.textContent = `-$${Math.abs(diff).toLocaleString('es-MX', { minimumFractionDigits: 2 })} (Faltante)`;
  }
}

function handleAdminLogout() {
  const modal = document.getElementById('adminLogoutConfirmModalOverlay');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    confirmAdminLogout();
  }
}

function closeAdminLogoutModal() {
  const modal = document.getElementById('adminLogoutConfirmModalOverlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

function confirmAdminLogout() {
  closeAdminLogoutModal();
  sessionStorage.clear();
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('currentUser');
  localStorage.setItem('adminLoggedIn', 'false');

  const overlay = document.getElementById('adminLoginOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }
  showNotification('info', 'Sesión Cerrada 🔒', 'Has cerrado sesión del panel de administración.');
  setTimeout(() => {
    window.location.reload();
  }, 400);
}

let bankInfoData = null;

async function fetchBankInfo() {
  try {
    const res = await fetch('api/bank-info');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        bankInfoData = data;
        populateBankInfoFields(data);
      }
    }
  } catch (err) {
    console.warn('Error fetching bank info:', err);
  }
}

function populateBankInfoFields(data) {
  if (!data) return;
  const bankName = data.bankName || '';
  const holder = data.accountHolder || '';
  const clabe = data.clabe || '';
  const card = data.cardNumber || '';
  const instructions = data.instructions || '';

  const b1 = document.getElementById('bankInfoBankName');
  if (b1) b1.value = bankName;
  const h1 = document.getElementById('bankInfoAccountHolder');
  if (h1) h1.value = holder;
  const c1 = document.getElementById('bankInfoClabe');
  if (c1) c1.value = clabe;
  const card1 = document.getElementById('bankInfoCardNumber');
  if (card1) card1.value = card;
  const inst1 = document.getElementById('bankInfoInstructions');
  if (inst1) inst1.value = instructions;

  const b2 = document.getElementById('bankNameInput');
  if (b2) b2.value = bankName;
  const h2 = document.getElementById('bankHolderInput');
  if (h2) h2.value = holder;
  const c2 = document.getElementById('bankClabeInput');
  if (c2) c2.value = clabe;
  const card2 = document.getElementById('bankAccountInput');
  if (card2) card2.value = card;
}

async function openBankInfoModal() {
  await fetchBankInfo();
  const m1 = document.getElementById('bankInfoModalOverlay');
  if (m1) m1.style.display = 'flex';
  const m2 = document.getElementById('modalBankInfoOverlay');
  if (m2) m2.style.display = 'flex';
}

function closeBankInfoModal() {
  const m1 = document.getElementById('bankInfoModalOverlay');
  if (m1) m1.style.display = 'none';
  const m2 = document.getElementById('modalBankInfoOverlay');
  if (m2) m2.style.display = 'none';
}

async function handleSaveBankInfo(event) {
  if (event && event.preventDefault) event.preventDefault();

  const bankName = (document.getElementById('bankInfoBankName') || document.getElementById('bankNameInput') || {}).value || '';
  const accountHolder = (document.getElementById('bankInfoAccountHolder') || document.getElementById('bankHolderInput') || {}).value || '';
  const clabe = (document.getElementById('bankInfoClabe') || document.getElementById('bankClabeInput') || {}).value || '';
  const cardNumber = (document.getElementById('bankInfoCardNumber') || document.getElementById('bankAccountInput') || {}).value || '';
  const instructions = (document.getElementById('bankInfoInstructions') || {}).value || '';

  try {
    const res = await fetch('api/bank-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bankName, accountHolder, clabe, cardNumber, instructions })
    });

    const data = await res.json();
    if (res.ok && (data.success || data.bankInfo)) {
      bankInfoData = data.bankInfo || { bankName, accountHolder, clabe, cardNumber, instructions };
      populateBankInfoFields(bankInfoData);
      showNotification('success', '¡Datos Bancarios Guardados! 🏦', 'La información de transferencia ha sido actualizada en la app y panel.');
      closeBankInfoModal();
    } else {
      showNotification('error', 'Error al Guardar', data.message || 'No se pudieron guardar los datos bancarios.');
    }
  } catch (err) {
    console.error('Error saving bank info:', err);
    showNotification('error', 'Error Servidor', 'No se pudo conectar con el servidor.');
  }
}

function saveBankInfoForm(event) {
  handleSaveBankInfo(event);
}

let activeRefundBookingId = null;
let activeRefundAmount = 0;

function openCancelledBookingsModal() {
  const modal = document.getElementById('cancelledBookingsModalOverlay');
  if (modal) {
    modal.style.display = 'flex';
    fetchCancelledBookings();
  }
}

function closeCancelledBookingsModal() {
  const modal = document.getElementById('cancelledBookingsModalOverlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

function openRefundModal(bookingId, price, clientName) {
  activeRefundBookingId = bookingId;
  activeRefundAmount = price;

  const infoEl = document.getElementById('refundModalInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase;">Reserva Cancelada</span>
          <h4 style="margin: 2px 0 0 0; font-size: 16px; font-weight: 800; color: #0F172A;">${bookingId}</h4>
          <span style="font-size: 12px; color: #475569;">Cliente: <strong>${fixMojibake(clientName || 'Cliente')}</strong></span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase;">Monto Aprobado</span>
          <h3 style="margin: 2px 0 0 0; font-size: 18px; font-weight: 900; color: #DC2626;">$${(price || 0).toLocaleString('es-MX')} MXN</h3>
        </div>
      </div>
    `;
  }

  const overlay = document.getElementById('modalRefundMethodOverlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function closeRefundMethodModal() {
  const overlay = document.getElementById('modalRefundMethodOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  activeRefundBookingId = null;
  activeRefundAmount = 0;
}

async function confirmRefundWithMethod(method) {
  if (!activeRefundBookingId) {
    showNotification('error', 'Error', 'No hay una reserva seleccionada para devolución.');
    return;
  }

  try {
    const res = await fetch('api/bookings/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: activeRefundBookingId,
        method: method
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showNotification('success', 'Devolución Registrada', `Devolución de $${activeRefundAmount.toLocaleString('es-MX')} MXN procesada con éxito (${method.toUpperCase()}).`);
      closeRefundMethodModal();
      await fetchCancelledBookings();
      if (typeof fetchCashShiftStatus === 'function') fetchCashShiftStatus();
      if (typeof fetchAdminData === 'function') fetchAdminData();
    } else {
      showNotification('error', 'Error', data.message || 'Error al procesar la devolución.');
    }
  } catch (err) {
    console.error('Error confirming refund:', err);
    showNotification('error', 'Error', 'Error de conexión al procesar la devolución.');
  }
}

async function fetchCancelledBookings() {
  try {
    const res = await fetch('api/bookings/cancelled');
    if (res.ok) {
      const data = await res.json();
      renderCancelledBookingsTable(data);
    }
  } catch (err) { console.warn('Error fetching cancelled bookings:', err); }
}

function renderCancelledBookingsTable(cancelledList) {
  const tbodyList = document.querySelectorAll('#cancelledBookingsTableBody');
  if (!tbodyList || tbodyList.length === 0) return;

  const contentHtml = (!cancelledList || cancelledList.length === 0) 
    ? '<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 24px; font-weight: 600;">No hay reservaciones canceladas en el sistema.</td></tr>'
    : cancelledList.map(b => {
        const court = fixMojibake(b.courtName || b.courtId || 'Cancha');
        const client = fixMojibake(b.clientName || 'Cliente');
        const phone = b.clientPhone || '-';
        const method = b.paymentMethod || 'Efectivo';
        const isPaid = (b.paid === true || b.paid === 'true' || b.paid === 1);
        const refStatus = b.refundStatus || (isPaid ? 'Pendiente de Devolución' : 'Sin Pago Previo (No Aplica)');

        let refundBadgeHtml = '';
        let actionBtnHtml = '';

        if (refStatus.includes('Devuelto') || refStatus.includes('Procesada')) {
          refundBadgeHtml = `<span style="background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle" style="width:12px; height:12px;"></i> Devuelto (${refStatus.includes('efectivo') ? 'Efectivo' : 'Digital'})</span>`;
          actionBtnHtml = `<span style="color: #059669; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-check" style="width:14px; height:14px;"></i> Reembolsado</span>`;
        } else if (!isPaid || refStatus.includes('Sin Pago')) {
          refundBadgeHtml = `<span style="background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 11px;">Sin Pago Previo (No Aplica)</span>`;
          actionBtnHtml = `<span style="color: #94A3B8; font-size: 12px; font-style: italic;">Sin acciones</span>`;
        } else {
          refundBadgeHtml = `<span style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="alert-triangle" style="width:12px; height:12px;"></i> Devolución Pendiente</span>`;
          actionBtnHtml = `<button type="button" class="btn-head-action" style="background: #10B981; color: #FFF; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(16,185,129,0.25);" onclick="openRefundModal('${b.id}', ${b.price || 0}, '${client.replace(/'/g, "\\'")}')"><i data-lucide="hand-coins" style="width: 14px; height: 14px;"></i> Devolución</button>`;
        }

        return `
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 12px 16px;"><strong style="font-family: monospace; color: #0F172A; font-size: 13px;">${b.id}</strong></td>
            <td style="padding: 12px 16px;"><span style="font-weight: 700; color: #334155;">${court}</span></td>
            <td style="padding: 12px 16px;"><strong>${client}</strong><br><small style="color: #64748B;">${phone}</small></td>
            <td style="padding: 12px 16px; font-size: 12.5px; color: #334155;"><strong>${b.date || '-'}</strong><br><small style="color: #64748B;">${b.timeSlot || '-'}</small></td>
            <td style="padding: 12px 16px;"><strong style="color: #0F172A; font-size: 13px;">$${(b.price || 0).toLocaleString('es-MX')} MXN</strong><br><small style="color: #64748B;">${method}</small></td>
            <td style="padding: 12px 16px;">${refundBadgeHtml}</td>
            <td style="padding: 12px 16px;">${actionBtnHtml}</td>
          </tr>
        `;
      }).join('');

  tbodyList.forEach(tb => {
    tb.innerHTML = contentHtml;
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Global Window Exports (100% Crash-Proof)
const safeExportsMap = {
  handleAdminLoginSubmit: typeof handleAdminLoginSubmit !== 'undefined' ? handleAdminLoginSubmit : null,
  fetchCashShiftStatus: typeof fetchCashShiftStatus !== 'undefined' ? fetchCashShiftStatus : null,
  openShiftDetailsModal: typeof openShiftDetailsModal !== 'undefined' ? openShiftDetailsModal : null,
  closeShiftDetailsModal: typeof closeShiftDetailsModal !== 'undefined' ? closeShiftDetailsModal : null,
  switchCashSubTab: typeof switchCashSubTab !== 'undefined' ? switchCashSubTab : null,
  openOpenCashModal: typeof openOpenCashModal !== 'undefined' ? openOpenCashModal : null,
  closeOpenCashModal: typeof closeOpenCashModal !== 'undefined' ? closeOpenCashModal : null,
  openCashMovementModal: typeof openCashMovementModal !== 'undefined' ? openCashMovementModal : null,
  closeCashMovementModal: typeof closeCashMovementModal !== 'undefined' ? closeCashMovementModal : null,
  handleOpenCashSubmit: typeof handleOpenCashSubmit !== 'undefined' ? handleOpenCashSubmit : null,
    handleCashMovementSubmit: typeof handleCashMovementSubmit !== 'undefined' ? handleCashMovementSubmit : null,
    handleCashCutSubmit: typeof handleCashCutSubmit !== 'undefined' ? handleCashCutSubmit : null,
    openCashCutModal: typeof openCashCutModal !== 'undefined' ? openCashCutModal : null,
  calculateCutDifferenceLive: typeof calculateCutDifferenceLive !== 'undefined' ? calculateCutDifferenceLive : null,
  openBankInfoModal: typeof openBankInfoModal !== 'undefined' ? openBankInfoModal : null,
  closeBankInfoModal: typeof closeBankInfoModal !== 'undefined' ? closeBankInfoModal : null,
  saveBankInfoForm: typeof saveBankInfoForm !== 'undefined' ? saveBankInfoForm : null,
  saveBankInfoModal: typeof saveBankInfoForm !== 'undefined' ? saveBankInfoForm : null,
  closeCashCutModal: typeof closeCashCutModal !== 'undefined' ? closeCashCutModal : null,
  openCashCutModal: typeof openCashCutModal !== 'undefined' ? openCashCutModal : null,
  fetchCancelledBookings: typeof fetchCancelledBookings !== 'undefined' ? fetchCancelledBookings : null,
  openReceiptViewerModal: typeof openReceiptViewerModal !== 'undefined' ? openReceiptViewerModal : null,
  closeReceiptViewerModal: typeof closeReceiptViewerModal !== 'undefined' ? closeReceiptViewerModal : null,
  openPosSaleForUser: typeof openPosSaleForUser !== 'undefined' ? openPosSaleForUser : null,
  handleDebtorSelectChange: typeof handleDebtorSelectChange !== 'undefined' ? handleDebtorSelectChange : null,
  getTodayDateStr: typeof getTodayDateStr !== 'undefined' ? getTodayDateStr : null,
  isAttended: typeof isAttended !== 'undefined' ? isAttended : null,
  isNoShow: typeof isNoShow !== 'undefined' ? isNoShow : null,
  handleBookingTypeChange: typeof handleBookingTypeChange !== 'undefined' ? handleBookingTypeChange : null
};

Object.keys(safeExportsMap).forEach(key => {
  if (safeExportsMap[key]) {
    window[key] = safeExportsMap[key];
  }
});
window.handleMarkAttendance = handleMarkAttendance;
window.handleMarkPaid = handleMarkPaid;
window.openCancelledBookingsModal = openCancelledBookingsModal;
window.closeCancelledBookingsModal = closeCancelledBookingsModal;
window.fetchCancelledBookings = fetchCancelledBookings;
window.openRefundModal = openRefundModal;
window.closeRefundMethodModal = closeRefundMethodModal;
window.confirmRefundWithMethod = confirmRefundWithMethod;
window.handleAdminLogout = handleAdminLogout;
window.closeAdminLogoutModal = closeAdminLogoutModal;
window.confirmAdminLogout = confirmAdminLogout;
window.fetchBankInfo = fetchBankInfo;
window.openBankInfoModal = openBankInfoModal;
window.closeBankInfoModal = closeBankInfoModal;
window.handleSaveBankInfo = handleSaveBankInfo;
window.saveBankInfoForm = saveBankInfoForm;


function closeCashCutModal() {
  const modal = document.getElementById('modalCashCutOverlay');
  if (modal) modal.style.display = 'none';
}



/* ==========================================
   AUTO-REFRESH POLLING SYSTEM (REALTIME SYNC)
   ========================================== */
if (!window.levelAutoRefreshInterval) {
  window.levelAutoRefreshInterval = setInterval(async function() {
    try {
      if (typeof fetchAdminData === 'function') await fetchAdminData();
      if (typeof fetchAdminTournaments === 'function') await fetchAdminTournaments();
      if (typeof fetchCancelledBookings === 'function') await fetchCancelledBookings();
      if (typeof fetchCashShiftStatus === 'function') await fetchCashShiftStatus();
      if (typeof fetchAdminFinances === 'function') await fetchAdminFinances();

      const dayModal = document.getElementById('dayAvailabilityModalOverlay') || document.getElementById('modalDay24hOverlay');
      if (dayModal && dayModal.style.display !== 'none' && dayModal.style.display !== '') {
        if (typeof renderDay24hGrid === 'function') renderDay24hGrid();
      }
    } catch (e) { }
  }, 3000);
}
