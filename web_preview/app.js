// Application Data & Real-Time Sync Logic for Pádel Club Tacámbaro
let courtsData = [];
let userBookings = [];
let allBookingsData = [];
let tournamentsData = [];
let productsData = [];
let bankInfoData = {
  bankName: 'BBVA México',
  accountHolder: 'Level Centro Deportivo S.A. de C.V.',
  clabe: '012 320 001122334455 6',
  cardNumber: '4152 3138 9012 3456',
  instructions: 'Al realizar tu transferencia o depósito, ingresa tu Nombre y el Folio de tu reserva como concepto de pago.'
};
let clubHistoryData = {
  name: 'Level Tacámbaro',
  address: 'Valentín Gómez Farías #3, Tacámbaro, Michoacán',
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
let activeRegisterTournamentId = null;
let currentViewMode = 'single'; // 'single', 'admin', 'concurrency'

// Code Snippets Cache for Left Panel
const codeSnippets = {
  main: `void main() {
  runApp(const CanchasYaApp());
}`,
  drawer: `class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(child: Image.asset('assets/images/logo.jpeg')),
          ListTile(title: Text('1. Nuestra Historia')),
          ListTile(title: Text('2. Reservar Canchas')),
          ListTile(title: Text('3. Torneos de Pádel')),
          ListTile(title: Text('4. Tienda & Alquiler')),
          ListTile(title: Text('5. Contacto & Ubicación')),
        ],
      ),
    );
  }
}`,
  court: `class Court {
  final String id;
  final String name; // Cancha 1 Azul / Cancha 2 Verde
  final List<String> availableSlots;
}`
};

// Initialize App
let _lastCourtsJson = '';
let _lastBookingsJson = '';
let _lastTournamentsJson = '';
let _lastProductsJson = '';
let _lastHistoryJson = '';
let _lastBankInfoJson = '';

document.addEventListener('DOMContentLoaded', () => {
  fetchCourtsData();
  fetchBookingsData();
  fetchTournamentsData();
  fetchProductsData();
  fetchHistoryData();
  updateClocks();
  setInterval(updateClocks, 10000);
  setInterval(() => {
    fetchCourtsData(true);
    fetchBookingsData(true);
    fetchTournamentsData(true);
    fetchProductsData(true);
  }, 3000);
});

async function fetchCourtsData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/courts').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const str = JSON.stringify(data || []);
        if (str !== _lastCourtsJson) {
          _lastCourtsJson = str;
          courtsData = data;
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

async function fetchBookingsData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/bookings').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const str = JSON.stringify(data || []);
        if (str !== _lastBookingsJson) {
          _lastBookingsJson = str;
          allBookingsData = data;
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

async function fetchTournamentsData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/tournaments').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const cleaned = (data || []).map(t => ({
          ...t,
          title: fixMojibake(t.title || ''),
          category: fixMojibake(t.category || ''),
          dates: fixMojibake(t.dates || ''),
          prize: fixMojibake(t.prize || ''),
          status: fixMojibake(t.status || '')
        }));
        const str = JSON.stringify(cleaned);
        if (str !== _lastTournamentsJson) {
          _lastTournamentsJson = str;
          tournamentsData = cleaned;
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

async function fetchProductsData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/products').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const str = JSON.stringify(data || []);
        if (str !== _lastProductsJson) {
          _lastProductsJson = str;
          productsData = data;
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

async function fetchHistoryData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/history').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const str = JSON.stringify(data || {});
        if (str !== _lastHistoryJson) {
          _lastHistoryJson = str;
          clubHistoryData = { ...clubHistoryData, ...data };
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

async function fetchBankInfoData(isBackgroundPolling = false) {
  try {
    const res = await fetch('api/bank-info').catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data) {
        const str = JSON.stringify(data || {});
        if (str !== _lastBankInfoJson) {
          _lastBankInfoJson = str;
          if (data && data.bankName) {
            bankInfoData = data;
          }
          renderAllInstances(isBackgroundPolling);
        }
      }
    }
  } catch (e) { }
}

let appSSESource = null;
let appSSERetryTimer = null;

function setupSSE() {
  if (appSSERetryTimer) {
    clearTimeout(appSSERetryTimer);
    appSSERetryTimer = null;
  }
  if (appSSESource) {
    try { appSSESource.close(); } catch (e) { }
    appSSESource = null;
  }
  if (!!window.EventSource) {
    try {
      appSSESource = new EventSource('api/events');
      appSSESource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'BOOKING_CREATED' || payload.type === 'SLOT_TOGGLED' || (payload.type && payload.type.startsWith('COURT_'))) {
            fetchCourtsData();
            fetchBookingsData();
          } else if (payload.type && payload.type.startsWith('TOURNAMENT_')) {
            fetchTournamentsData();
          } else if (payload.type === 'HISTORY_UPDATED') {
            fetchHistoryData();
          } else if (payload.type === 'BANK_INFO_UPDATED') {
            fetchBankInfoData();
          } else if (payload.type && payload.type.startsWith('PRODUCT_')) {
            fetchProductsData();
          }
        } catch (err) { }
      };
      appSSESource.onerror = () => {
        if (appSSESource) {
          try { appSSESource.close(); } catch (e) { }
          appSSESource = null;
        }
        if (!appSSERetryTimer) {
          appSSERetryTimer = setTimeout(() => {
            appSSERetryTimer = null;
            setupSSE();
          }, 5000);
        }
      };
    } catch (e) { }
  }
}

function updateClocks() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  document.querySelectorAll('.liveClock').forEach(el => el.textContent = timeStr);
}

function switchViewMode(mode) {
  currentViewMode = mode;
  document.querySelectorAll('.view-mode-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mode-view').forEach(view => view.classList.remove('active'));

  if (mode === 'single') {
    document.getElementById('btnModeSingle').classList.add('active');
    document.getElementById('modeSingleContainer').classList.add('active');
  } else if (mode === 'admin') {
    document.getElementById('btnModeAdmin').classList.add('active');
    document.getElementById('modeAdminContainer').classList.add('active');
  } else if (mode === 'concurrency') {
    document.getElementById('btnModeConcurrency').classList.add('active');
    document.getElementById('modeConcurrencyContainer').classList.add('active');
  }

  renderAllInstances();
}

// Instance States for Multi-Phone View (Default isLoggedOut: true for strict security)
const instanceStates = {
  single: { selectedCourt: null, bookingStep: 'calendar', selectedDate: '2026-09-05', calendarMonth: 8, calendarYear: 2026, selectedSlot: null, durationHours: 1, activeTab: 'canchas', drawerOpen: false, paymentMethod: 'Efectivo en Mostrador', search: '', category: 'Todas', activeAlert: null, isLoggedOut: (sessionStorage.getItem('isLoggedIn_single') !== 'true'), needsPasswordChange: false, loggedInUser: null },
  phoneA: { selectedCourt: null, bookingStep: 'calendar', selectedDate: '2026-09-05', calendarMonth: 8, calendarYear: 2026, selectedSlot: null, durationHours: 1, activeTab: 'canchas', drawerOpen: false, paymentMethod: 'Efectivo en Mostrador', search: '', category: 'Todas', activeAlert: null, isLoggedOut: (sessionStorage.getItem('isLoggedIn_phoneA') !== 'true'), needsPasswordChange: false, loggedInUser: null },
  phoneB: { selectedCourt: null, bookingStep: 'calendar', selectedDate: '2026-09-05', calendarMonth: 8, calendarYear: 2026, selectedSlot: null, durationHours: 1, activeTab: 'canchas', drawerOpen: false, paymentMethod: 'Efectivo en Mostrador', search: '', category: 'Todas', activeAlert: null, isLoggedOut: (sessionStorage.getItem('isLoggedIn_phoneB') !== 'true'), needsPasswordChange: false, loggedInUser: null }
};

function renderAllInstances(isBackgroundPolling = false) {
  if (currentViewMode === 'single') {
    renderPhoneInstance('appRoot1', instanceStates.single, 'single', isBackgroundPolling);
  } else if (currentViewMode === 'concurrency') {
    renderPhoneInstance('appRootA', instanceStates.phoneA, 'phoneA', isBackgroundPolling);
    renderPhoneInstance('appRootB', instanceStates.phoneB, 'phoneB', isBackgroundPolling);
  }
  try { if (typeof lucide !== 'undefined') lucide.createIcons(); } catch (e) { }
}

function showAppAlert(instKey, title, message, icon = 'success', buttonText = '¡Entendido! ⚡') {
  if (instanceStates[instKey]) {
    instanceStates[instKey].activeAlert = { title, message, icon, buttonText };
  } else {
    instanceStates.single.activeAlert = { title, message, icon, buttonText };
  }
  renderAllInstances();
}

function closeAppAlert(instKey) {
  if (instanceStates[instKey]) {
    instanceStates[instKey].activeAlert = null;
  } else {
    instanceStates.single.activeAlert = null;
  }
  renderAllInstances();
}

function renderAppAlertOverlay(state, instKey) {
  if (!state.activeAlert) return '';
  const alert = state.activeAlert;

  let iconName = 'check-circle';
  let iconBg = 'rgba(16, 185, 129, 0.15)';
  let borderColor = 'rgba(16, 185, 129, 0.3)';
  let iconColor = '#10B981';

  if (alert.icon === 'warning') {
    iconName = 'alert-triangle';
    iconBg = 'rgba(245, 158, 11, 0.15)';
    borderColor = 'rgba(245, 158, 11, 0.3)';
    iconColor = '#F59E0B';
  } else if (alert.icon === 'error') {
    iconName = 'alert-circle';
    iconBg = 'rgba(239, 68, 68, 0.15)';
    borderColor = 'rgba(239, 68, 68, 0.3)';
    iconColor = '#EF4444';
  }

  return `
    <div style="position: absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(8px); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease;">
      <div style="background: #FFFFFF; border-radius: 20px; padding: 22px 18px; width: 100%; max-width: 290px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px ${borderColor}; animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <div style="width: 54px; height: 54px; border-radius: 50%; background: ${iconBg}; border: 2px solid ${borderColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; color: ${iconColor};">
          <i data-lucide="${iconName}" style="width: 28px; height: 28px;"></i>
        </div>

        <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">
          ${fixMojibake(alert.title)}
        </h3>

        <p style="font-size: 12px; color: #475569; line-height: 1.5; margin: 0 0 18px 0; font-weight: 500;">
          ${fixMojibake(alert.message)}
        </p>

        <button onclick="closeAppAlert('${instKey}')" style="width: 100%; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFF; border: none; padding: 11px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <span>${alert.buttonText || '¡Entendido!'}</span>
        </button>
      </div>
    </div>
  `;
}

function openTermsModal(instKey) {
  instanceStates[instKey].showTermsModal = true;
  renderAllInstances();
}

function closeTermsModal(instKey) {
  instanceStates[instKey].showTermsModal = false;
  renderAllInstances();
}

function renderTermsModalOverlay(state, instKey) {
  if (!state.showTermsModal) return '';

  return `
    <div style="position: absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.75); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(8px); animation: fadeIn 0.25s ease;">
      <div style="background: #FFFFFF; border-radius: 24px; width: 100%; max-width: 320px; max-height: 85%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(16, 185, 129, 0.25); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <!-- Modal Header -->
        <div style="background: linear-gradient(135deg, #022C22 0%, #064E3B 100%); color: #FFF; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="width: 18px; height: 18px; color: #10B981;"></i>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; margin: 0; color: #FFFFFF;">Términos & Reglamento</h3>
          </div>
          <button onclick="closeTermsModal('${instKey}')" style="background: rgba(255,255,255,0.2); border: none; color: #FFF; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 800;">✕</button>
        </div>

        <!-- Terms Body -->
        <div style="padding: 14px 16px; overflow-y: auto; font-size: 11.5px; color: #334155; line-height: 1.55;">
          <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 10px; margin-bottom: 12px; border-left: 4px solid #10B981;">
            <strong style="color: #065F46; display: block; margin-bottom: 2px;">📌 TÉRMINOS Y CONDICIONES DE RESERVA EN LA APP</strong>
            Level Tacámbaro • Sistema Digital de Reservaciones
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <strong style="color: #0F172A; display: block; margin-bottom: 2px;">1. Compromiso de Pago & No-Show (Inasistencia)</strong>
              <span>Toda reservación efectuada en la aplicación aparta el horario seleccionado. Si reservas y <strong>no te presentas (No-Show)</strong> o no utilizas la cancha, te comprometes a saldar el monto total del turno ($300.00 MXN / hora). El sistema registrará el adeudo pendiente y solicitará liquidarlo en recepción antes de permitirte nuevas reservas.</span>
            </div>

            <div>
              <strong style="color: #0F172A; display: block; margin-bottom: 2px;">2. Política de Cancelación (Mínimo 24 Horas)</strong>
              <span>Las cancelaciones son sin cobro ni penalización únicamente si se realizan con un <strong>mínimo de 24 horas de anticipación</strong> desde la opción "Mis Reservaciones" en la app. Las cancelaciones realizadas con menos de 24 horas mantendrán el cobro del turno reservado.</span>
            </div>

            <div>
              <strong style="color: #0F172A; display: block; margin-bottom: 2px;">3. Uso de Cuenta y Responsabilidad</strong>
              <span>El usuario se compromete a ingresar información verídica (nombre y teléfono) y responder por las reservaciones generadas desde su cuenta en la plataforma.</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 12px 16px; background: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
          <button onclick="closeTermsModal('${instKey}')" style="width: 100%; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFF; border: none; padding: 10px; border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
            Entendido y Acepto Términos
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderTournamentModalOverlay(instKey) {
  if (!activeRegisterTournamentId) return '';
  const activeTourn = tournamentsData.find(t => t.id === activeRegisterTournamentId);
  if (!activeTourn) return '';

  const cleanTitle = fixMojibake(activeTourn.title || '');
  const cleanCat = fixMojibake(activeTourn.category || '');
  const cleanDates = fixMojibake(activeTourn.dates || '');
  let cleanPrize = fixMojibake(activeTourn.prize || '');
  if (!cleanPrize || cleanPrize === ',000 MXN' || cleanPrize.startsWith(',')) {
    cleanPrize = (activeTourn.id === 'TOURN-101') ? '$15,000 MXN' : '$8,000 MXN';
  }
  const tournImg = activeTourn.imageUrl || 'assets/images/cancha_padel_2.jpg';

  return `
    <div style="position: absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.75); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(10px); animation: fadeIn 0.25s ease;">
      <div style="background: #FFFFFF; border-radius: 24px; width: 100%; max-width: 320px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(16, 185, 129, 0.25); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <!-- Hero Header with Tournament Image -->
        <div style="position: relative; height: 115px; background: linear-gradient(135deg, #022C22 0%, #064E3B 100%);">
          <img src="${tournImg}" alt="${cleanTitle}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%);"></div>
          
          <button onclick="closeClientRegisterModal()" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); width: 28px; height: 28px; border-radius: 50%; color: #FFF; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all 0.2s ease;">✕</button>

          <div style="position: absolute; bottom: 10px; left: 14px; right: 14px;">
            <span style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFF; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="award" style="width: 11px; height: 11px;"></i> ${cleanCat}
            </span>
            <h4 style="margin: 4px 0 0 0; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 900; color: #FFFFFF; text-shadow: 0 2px 4px rgba(0,0,0,0.5); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${cleanTitle}
            </h4>
          </div>
        </div>

        <!-- Content Body -->
        <div style="padding: 16px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 11px; color: #64748B; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="calendar" style="width: 12px; height: 12px; color: #0284C7;"></i> <span>${cleanDates}</span>
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #10B981; background: #ECFDF5; padding: 2px 8px; border-radius: 8px; border: 1px solid #A7F3D0;">
              Premio: ${cleanPrize}
            </div>
          </div>

          <form onsubmit="handleClientRegisterSubmit(event, '${activeTourn.id}', '${instKey}')">
            <div style="margin-bottom: 12px;">
              <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #0F172A; margin-bottom: 5px;">
                <i data-lucide="shield" style="width: 13px; height: 13px; color: #10B981;"></i> Nombre del Equipo / Pareja <span style="color: #EF4444;">*</span>
              </label>
              <input type="text" id="clientTeamNameInput_${instKey}" required style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 12px; font-size: 12px; font-weight: 600; outline: none; transition: all 0.2s ease; background: #F8FAFC; color: #0F172A;" placeholder="Ej. Los Ases de Tacámbaro" onfocus="this.style.borderColor='#10B981'; this.style.background='#FFF'; this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)';" onblur="this.style.borderColor='#CBD5E1'; this.style.background='#F8FAFC'; this.style.boxShadow='none';">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #0F172A; margin-bottom: 5px;">
                <i data-lucide="users" style="width: 13px; height: 13px; color: #0284C7;"></i> Nombres de los Jugadores <span style="color: #EF4444;">*</span>
              </label>
              <input type="text" id="clientParticipantsInput_${instKey}" required style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 12px; font-size: 12px; font-weight: 600; outline: none; transition: all 0.2s ease; background: #F8FAFC; color: #0F172A;" placeholder="Ej. Carlos Palacios y Juan Pérez" onfocus="this.style.borderColor='#10B981'; this.style.background='#FFF'; this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)';" onblur="this.style.borderColor='#CBD5E1'; this.style.background='#F8FAFC'; this.style.boxShadow='none';">
            </div>

            <div style="display: flex; gap: 8px;">
              <button type="button" onclick="closeClientRegisterModal()" style="flex: 1; background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; padding: 11px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;">
                Cancelar
              </button>
              <button type="submit" style="flex: 1.4; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFF; border: none; padding: 11px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Confirmar Registro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderPhoneInstance(rootId, state, instKey, isBackgroundPolling = false) {
  const root = document.getElementById(rootId);
  if (!root) return;

  // Don't interrupt user if currently typing in an input inside this root during background polling
  const activeEl = document.activeElement;
  if (isBackgroundPolling && activeEl && root.contains(activeEl) && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)) {
    return;
  }

  const logoUrl = clubHistoryData.logo || 'assets/images/logo.jpeg';
  const alertKey = JSON.stringify(state.activeAlert || null);

  // If user needs to change temporary password (Step 2 of Login)
  if (state.needsPasswordChange) {
    if (root.querySelector(`#newPasswordInput_${instKey}`) && state._renderedPassChangeAlertKey === alertKey && !state._forceRender) {
      return;
    }
    state._renderedPassChangeAlertKey = alertKey;
    state._forceRender = false;

    root.innerHTML = `
      <div class="mobile-app">
        <!-- Custom Centered App Alert Overlay -->
        ${renderAppAlertOverlay(state, instKey)}

        <div class="login-screen-overlay">
          <div class="login-card">
            <div class="login-logo-wrap">
              <span class="brand-brace-open">{</span>LEVEL<span class="brand-brace-close">}</span>
              <div class="login-subtitle">SEGURIDAD Y CUENTA • TACÁMBARO</div>
            </div>

            <div style="background: rgba(2, 132, 199, 0.08); border: 1.5px solid rgba(2, 132, 199, 0.25); border-radius: 12px; padding: 10px; margin: 12px 0 14px 0; font-size: 11px; color: #0284C7; font-weight: 700; display: flex; align-items: center; gap: 6px; text-align: left;">
              <i data-lucide="shield-alert" style="width: 18px; height: 18px; flex-shrink: 0; color: #0284C7;"></i>
              <span>Ingresaste con contraseña temporal. Define tu nueva contraseña permanente para continuar.</span>
            </div>

            <h3 class="login-title" style="margin-top: 0;">Cambiar Contraseña</h3>

            <form onsubmit="handleClientChangePasswordSubmit(event, '${instKey}')">
              <div class="login-input-group">
                <label><i data-lucide="key" style="width: 13px; height: 13px; color: #0284C7;"></i> Nueva Contraseña *</label>
                <input type="password" id="newPasswordInput_${instKey}" required placeholder="Mínimo 6 caracteres" minlength="6" value="Tacambaro2026!">
              </div>

              <div class="login-input-group">
                <label><i data-lucide="check-square" style="width: 13px; height: 13px; color: #10B981;"></i> Confirmar Nueva Contraseña *</label>
                <input type="password" id="confirmPasswordInput_${instKey}" required placeholder="Repite tu contraseña" minlength="6" value="Tacambaro2026!">
              </div>

              <button type="submit" class="btn-login-submit" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                <i data-lucide="shield-check" style="width: 16px; height: 16px;"></i> Guardar Clave y Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // If user is logged out, render Login Overlay View
  if (state.isLoggedOut) {
    if (root.querySelector(`#loginUserInput_${instKey}`) && state._renderedLoginAlertKey === alertKey && !state._forceRender) {
      return;
    }
    state._renderedLoginAlertKey = alertKey;
    state._forceRender = false;

    root.innerHTML = `
      <div class="mobile-app">
        <!-- Custom Centered App Alert Overlay -->
        ${renderAppAlertOverlay(state, instKey)}

        <div class="login-screen-overlay">
          <div class="login-card">
            <div class="login-logo-avatar-box">
              <img src="assets/images/logo.jpeg" alt="Level Tacámbaro" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
            </div>

            <div class="login-logo-wrap">
              LEVEL <span class="login-brand-highlight">TACÁMBARO</span>
              <div class="login-subtitle">⚡ CENTRO DEPORTIVO • ACCESO</div>
            </div>

            <h3 class="login-title">Bienvenido de Nuevo</h3>
            <p class="login-desc">Ingresa tu cuenta para reservar pistas y acceder a tus servicios deportivos.</p>

            <form onsubmit="handleClientLoginSubmit(event, '${instKey}')">
              <div class="login-input-group">
                <label>Usuario o Teléfono</label>
                <div class="login-input-wrapper">
                  <i data-lucide="user" class="login-input-icon" style="color: #10B981;"></i>
                  <input type="text" id="loginUserInput_${instKey}" required placeholder="ej. cpalacios o 4591023849" value="">
                </div>
              </div>

              <div class="login-input-group">
                <label>Contraseña / PIN</label>
                <div class="login-input-wrapper">
                  <i data-lucide="lock" class="login-input-icon" style="color: #0284C7;"></i>
                  <input type="password" id="loginPassInput_${instKey}" required placeholder="••••••••" value="">
                  <button type="button" class="login-toggle-pass-btn" onclick="const inp = document.getElementById('loginPassInput_${instKey}'); if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';" title="Mostrar / Ocultar">
                    <i data-lucide="eye" style="width: 15px; height: 15px;"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn-login-submit">
                <span>Entrar a mi Cuenta</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    return;
  }

  let body = '';
  if (state.selectedCourt) {
    body = renderCourtDetailView(state.selectedCourt, state, instKey);
  } else {
    if (state.activeTab === 'historia') body = renderHistoryView();
    else if (state.activeTab === 'padel_reserva' || state.activeTab === 'canchas') body = renderCourtsView(state, instKey, 'padel');
    else if (state.activeTab === 'padel_torneos' || state.activeTab === 'torneos') body = renderTournamentsView(state, instKey, 'padel');
    else if (state.activeTab === 'futbol_reserva') body = renderCourtsView(state, instKey, 'futbol');
    else if (state.activeTab === 'futbol_torneos') body = renderTournamentsView(state, instKey, 'futbol');
    else if (state.activeTab === 'former_funcional_reservas') body = renderFormerReservationsNoticeView('funcional', instKey);
    else if (state.activeTab === 'former_bungee_reservas') body = renderFormerReservationsNoticeView('bungee', instKey);
    else if (state.activeTab === 'former_reservas') body = renderFormerReservationsNoticeView('general', instKey);
    else if (state.activeTab === 'former_funcional_productos') body = renderProductsView('funcional');
    else if (state.activeTab === 'former_bungee_productos') body = renderProductsView('bungee');
    else if (state.activeTab === 'former_productos') body = renderProductsView('former');
    else if (state.activeTab === 'tienda') body = renderProductsView('general');
    else if (state.activeTab === 'contacto') body = renderContactView();
    else if (state.activeTab === 'reservas') body = renderMyBookingsView(state, instKey);
    else body = renderCourtsView(state, instKey, 'padel');
  }

  root.innerHTML = `
    <div class="mobile-app">
      <!-- Drawer Menu Overlay -->
      ${renderDrawerOverlay(state, instKey)}

      <!-- Tournament Registration Modal Overlay -->
      ${renderTournamentModalOverlay(instKey)}

      <!-- Terms & Conditions Modal Overlay -->
      ${renderTermsModalOverlay(state, instKey)}

      <!-- Custom Centered App Alert Overlay -->
      ${renderAppAlertOverlay(state, instKey)}

      <!-- App Header Bar with Menu Button & Centered Vector Brand Logo -->
      <div class="mobile-top-bar">
        <button class="btn-drawer-toggle" onclick="toggleDrawer('${instKey}')" title="Abrir Menú Lateral">
          <i data-lucide="menu"></i>
        </button>
        <div class="top-logo-container">
          <div class="header-brand-wrap">
            <div class="header-brand-text">
              <div class="brand-title"><span class="brand-brace-open">{</span>LEVEL<span class="brand-brace-close">}</span></div>
              <div class="brand-subtitle">CENTRO DEPORTIVO</div>
            </div>
          </div>
        </div>
        <button class="btn-topbar-rule" onclick="openTermsModal('${instKey}')" title="Ver Reglamento del Club">
          <i data-lucide="shield-alert" style="width: 17px; height: 17px;"></i>
        </button>
      </div>

      <div class="app-view">
        ${body}
      </div>
    </div>
  `;
}

function toggleDrawer(instKey) {
  instanceStates[instKey].drawerOpen = !instanceStates[instKey].drawerOpen;
  renderAllInstances();
}

function selectTabFromDrawer(tab, instKey) {
  instanceStates[instKey].activeTab = tab;
  instanceStates[instKey].selectedCourt = null;
  instanceStates[instKey].drawerOpen = false;
  renderAllInstances();
}

function triggerClientLogout(instKey) {
  try { sessionStorage.removeItem('isLoggedIn_' + instKey); } catch (e) { }
  instanceStates[instKey].drawerOpen = false;
  instanceStates[instKey].isLoggedOut = true;
  instanceStates[instKey].needsPasswordChange = false;
  instanceStates[instKey].loggedInUser = null;
  instanceStates[instKey]._forceRender = true;
  renderAllInstances();
}

async function handleClientLoginSubmit(e, instKey) {
  e.preventDefault();
  const userInput = (document.getElementById(`loginUserInput_${instKey}`)?.value || '').trim();
  const passVal = (document.getElementById(`loginPassInput_${instKey}`)?.value || '').trim();

  if (!userInput || !passVal) {
    showAppAlert(instKey, 'Datos Incompletos', 'Por favor ingresa tu usuario y contraseña.', 'error', 'Reintentar');
    return;
  }

  let matchedUser = null;
  let requireChange = false;
  let loginSuccess = false;

  try {
    const res = await fetch('api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ username: userInput, phone: userInput, password: passVal })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      matchedUser = data.user;
      requireChange = data.requirePasswordChange;
      loginSuccess = true;
    } else {
      showAppAlert(instKey, 'Acceso Denegado 🔒', data.message || 'Usuario o contraseña incorrectos. Por favor verifica tus credenciales.', 'error', 'Reintentar');
      return;
    }
  } catch (err) {
    /* silent error */
    // Fallback local check
    try {
      const res = await fetch('api/users');
      if (res.ok) {
        const users = await res.json();
        const cleanInput = userInput.toLowerCase().replace(/\s+/g, '').replace(/^@/, '');
        const cleanPhone = userInput.replace(/\D/g, '');
        matchedUser = users.find(u =>
          (u.username && u.username.toLowerCase().replace(/^@/, '') === cleanInput) ||
          (cleanPhone && u.phone && u.phone.replace(/\D/g, '') === cleanPhone)
        );
        if (matchedUser) {
          const userPass = matchedUser.password || '';
          const tempPass = matchedUser.tempPassword || '';
                    const tempDigits = tempPass.replace(/\D/g, '');
          const inputDigits = passVal.replace(/\D/g, '');
          if ((userPass && userPass === passVal) || (tempPass && tempPass.toLowerCase() === passVal.toLowerCase()) || (tempDigits && inputDigits && tempDigits === inputDigits)) {
            loginSuccess = true;
            requireChange = [true, 'true', 'True'].includes(matchedUser.mustChangePassword) || (tempPass && tempPass.toLowerCase() === passVal.toLowerCase());
          }
        }
      }
    } catch (e) { }
  }

  if (!loginSuccess || !matchedUser) {
    showAppAlert(instKey, 'Acceso Denegado 🔒', 'Usuario o contraseña incorrectos. Por favor verifica tus datos.', 'error', 'Reintentar');
    return;
  }

  instanceStates[instKey].loggedInUser = matchedUser;

  if (requireChange) {
    instanceStates[instKey].needsPasswordChange = true;
    instanceStates[instKey]._forceRender = true;
    const name = matchedUser ? matchedUser.name : 'Usuario';
    const tempKey = matchedUser.tempPassword || passVal;
    showAppAlert(instKey, 'Contraseña Temporal Detectada 🔑', `Hola ${name}, ingresaste con clave temporal (${tempKey}). Por tu seguridad debes definir tu nueva clave permanente.`, 'warning', 'Establecer Clave');
    renderAllInstances();
    return;
  }

  try { sessionStorage.setItem('isLoggedIn_' + instKey, 'true'); } catch (e) { }
  instanceStates[instKey].isLoggedOut = false;
  instanceStates[instKey].needsPasswordChange = false;
  instanceStates[instKey].activeTab = 'canchas';
  instanceStates[instKey]._forceRender = true;
  const name = matchedUser ? matchedUser.name : 'Carlos Palacios';
  showAppAlert(instKey, '¡Bienvenido!', `Has iniciado sesión correctamente como ${name} en Level Tacámbaro.`, 'success', '¡A Jugar!');
  renderAllInstances();
}

async function handleClientChangePasswordSubmit(e, instKey) {
  e.preventDefault();
  const newPass = (document.getElementById(`newPasswordInput_${instKey}`)?.value || '').trim();
  const confirmPass = (document.getElementById(`confirmPasswordInput_${instKey}`)?.value || '').trim();

  if (newPass !== confirmPass) {
    showAppAlert(instKey, 'Error de Contraseña', 'Las contraseñas ingresadas no coinciden. Por favor verifica.', 'error', 'Entendido');
    return;
  }

  const currentUser = instanceStates[instKey].loggedInUser;
  const userMatch = document.getElementById(`loginUserInput_${instKey}`)?.value || 'carlos.palacios@tacambaro.com';

  try {
    const res = await fetch('api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        id: currentUser ? currentUser.id : null,
        userMatch: userMatch,
        newPassword: newPass
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        instanceStates[instKey].loggedInUser = data.user;
      }
    }
  } catch (err) {
    /* silent error */
  }

  try { sessionStorage.setItem('isLoggedIn_' + instKey, 'true'); } catch (e) { }
  instanceStates[instKey].needsPasswordChange = false;
  instanceStates[instKey].isLoggedOut = false;
  instanceStates[instKey].activeTab = 'canchas';
  showAppAlert(instKey, '¡Contraseña Actualizada!', 'Tu nueva contraseña permanente ha sido guardada exitosamente en el módulo de usuarios del sistema. ¡Bienvenido a Level Tacámbaro!', 'success', '¡A Jugar!');
  renderAllInstances();
}

const drawerSubmenusState = {
  padel: false,
  futbol: false,
  former: false,
  formerFuncional: false,
  formerBungee: false
};

function toggleDrawerSubmenu(moduleName, instKey) {
  drawerSubmenusState[moduleName] = !drawerSubmenusState[moduleName];
  renderAllInstances();
}

function renderDrawerOverlay(state, instKey) {
  if (!state.drawerOpen) return '';

  const user = state.loggedInUser || {};
  const userName = user.name || 'Carlos Palacios';
  const userTag = user.username ? (user.username.startsWith('@') ? user.username : '@' + user.username) : '@cpalacios';
  const userPhone = user.phone || '459 102 3849';
  const subInfo = `${userTag} • ${userPhone}`;

  return `
    <div class="drawer-backdrop" onclick="toggleDrawer('${instKey}')"></div>
    <div class="drawer-panel open luxury-brand-theme">
      <!-- Ultra-Clean Top Bar with Brand Logo & Close Button -->
      <div class="drawer-header-brand">
        <div style="width: 32px; height: 32px; flex-shrink: 0;"></div>
        <div class="drawer-brand-wrap" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;">
          <div><span class="brand-brace-open">{</span>LEVEL<span class="brand-brace-close">}</span></div>
          <div class="brand-subtitle" style="font-size: 8px; font-weight: 800; color: #84CC16; letter-spacing: 1.8px; text-transform: uppercase; margin-top: 3px;">CENTRO DEPORTIVO</div>
        </div>
        <button class="btn-close-drawer-brand" onclick="toggleDrawer('${instKey}')" title="Cerrar Menú">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <!-- Real User Profile Card -->
      <div class="drawer-user-card">
        <div class="user-avatar-halo">
          <div class="user-avatar-icon">
            <i data-lucide="user" style="width: 20px; height: 20px;"></i>
          </div>
          <span class="user-status-dot"></span>
        </div>
        <div class="user-info">
          <div class="user-name">${userName}</div>
          <div class="user-subtext">
            <i data-lucide="user-check" style="width: 12px; height: 12px; color: #34D399;"></i> ${subInfo}
          </div>
        </div>
      </div>

      <!-- Navigation List Cards (Matches Logo Palette) -->
      <div class="drawer-menu-list-brand">
        <!-- 🏢 Quiénes Somos -->
        <div class="drawer-brand-card ${state.activeTab === 'historia' ? 'active' : ''}" onclick="selectTabFromDrawer('historia', '${instKey}')">
          <div class="brand-icon-box blue"><i data-lucide="book-open" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Quiénes Somos</span>
            <span class="brand-card-desc">Conoce nuestro club</span>
          </div>
          <i data-lucide="chevron-right" class="brand-arrow"></i>
        </div>

        <!-- 🎾 Pádel Group -->
        <div class="drawer-brand-card" onclick="toggleDrawerSubmenu('padel', '${instKey}')" style="cursor: pointer;">
          <div class="brand-icon-box green"><i data-lucide="activity" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Pádel</span>
            <span class="brand-card-desc">Reserva tu cancha & Torneos</span>
          </div>
          <i data-lucide="${drawerSubmenusState.padel ? 'chevron-down' : 'chevron-right'}" class="brand-arrow"></i>
        </div>
        ${drawerSubmenusState.padel ? `
          <div class="drawer-submenu-list">
            <div class="drawer-subitem ${state.activeTab === 'padel_reserva' || state.activeTab === 'canchas' ? 'active' : ''}" onclick="selectTabFromDrawer('padel_reserva', '${instKey}')">
              <i data-lucide="calendar" style="width: 14px; height: 14px;"></i> Reserva tu cancha
            </div>
            <div class="drawer-subitem ${state.activeTab === 'padel_torneos' ? 'active' : ''}" onclick="selectTabFromDrawer('padel_torneos', '${instKey}')">
              <i data-lucide="trophy" style="width: 14px; height: 14px;"></i> Torneos de Pádel
            </div>
          </div>
        ` : ''}

        <!-- ⚽ Fútbol Group -->
        <div class="drawer-brand-card" onclick="toggleDrawerSubmenu('futbol', '${instKey}')" style="cursor: pointer;">
          <div class="brand-icon-box amber"><i data-lucide="circle-dot" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Fútbol</span>
            <span class="brand-card-desc">Reserva tu cancha & Torneos</span>
          </div>
          <i data-lucide="${drawerSubmenusState.futbol ? 'chevron-down' : 'chevron-right'}" class="brand-arrow"></i>
        </div>
        ${drawerSubmenusState.futbol ? `
          <div class="drawer-submenu-list">
            <div class="drawer-subitem ${state.activeTab === 'futbol_reserva' ? 'active' : ''}" onclick="selectTabFromDrawer('futbol_reserva', '${instKey}')">
              <i data-lucide="calendar" style="width: 14px; height: 14px;"></i> Reserva tu cancha
            </div>
            <div class="drawer-subitem ${state.activeTab === 'futbol_torneos' ? 'active' : ''}" onclick="selectTabFromDrawer('futbol_torneos', '${instKey}')">
              <i data-lucide="trophy" style="width: 14px; height: 14px;"></i> Torneos de Fútbol
            </div>
          </div>
        ` : ''}

        <!-- 🧘‍♀️ Former Group (Funcional & Bungee) -->
        <div class="drawer-brand-card" onclick="toggleDrawerSubmenu('former', '${instKey}')" style="cursor: pointer;">
          <div class="brand-icon-box purple"><i data-lucide="flame" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Former</span>
            <span class="brand-card-desc">Reservas & Productos</span>
          </div>
          <i data-lucide="${drawerSubmenusState.former ? 'chevron-down' : 'chevron-right'}" class="brand-arrow"></i>
        </div>
        ${drawerSubmenusState.former ? `
          <div class="drawer-submenu-list">
            <!-- 🏋️‍♀️ Funcional Sub-Accordion -->
            <div class="drawer-subitem ${drawerSubmenusState.formerFuncional ? 'expanded' : ''}" onclick="toggleDrawerSubmenu('formerFuncional', '${instKey}')" style="justify-content: space-between;">
              <span style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="dumbbell" style="width: 14px; height: 14px; color: #A855F7;"></i>
                <span>Funcional</span>
              </span>
              <i data-lucide="${drawerSubmenusState.formerFuncional ? 'chevron-down' : 'chevron-right'}" style="width: 12px; height: 12px; opacity: 0.8;"></i>
            </div>
            ${drawerSubmenusState.formerFuncional ? `
              <div class="drawer-nested-list">
                <div class="drawer-subitem ${state.activeTab === 'former_funcional_reservas' ? 'active' : ''}" onclick="selectTabFromDrawer('former_funcional_reservas', '${instKey}')" style="font-size: 11.5px; padding: 8px 12px; background: rgba(168, 85, 247, 0.18); border-color: rgba(168, 85, 247, 0.3);">
                  <i data-lucide="clipboard-list" style="width: 13px; height: 13px;"></i> Reservas (Membresías)
                </div>
                <div class="drawer-subitem ${state.activeTab === 'former_funcional_productos' ? 'active' : ''}" onclick="selectTabFromDrawer('former_funcional_productos', '${instKey}')" style="font-size: 11.5px; padding: 8px 12px; background: rgba(168, 85, 247, 0.18); border-color: rgba(168, 85, 247, 0.3);">
                  <i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i> Productos
                </div>
              </div>
            ` : ''}

            <!-- 🪂 Bungee Sub-Accordion -->
            <div class="drawer-subitem ${drawerSubmenusState.formerBungee ? 'expanded' : ''}" onclick="toggleDrawerSubmenu('formerBungee', '${instKey}')" style="justify-content: space-between;">
              <span style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="zap" style="width: 14px; height: 14px; color: #EC4899;"></i>
                <span>Bungee</span>
              </span>
              <i data-lucide="${drawerSubmenusState.formerBungee ? 'chevron-down' : 'chevron-right'}" style="width: 12px; height: 12px; opacity: 0.8;"></i>
            </div>
            ${drawerSubmenusState.formerBungee ? `
              <div class="drawer-nested-list">
                <div class="drawer-subitem ${state.activeTab === 'former_bungee_reservas' ? 'active' : ''}" onclick="selectTabFromDrawer('former_bungee_reservas', '${instKey}')" style="font-size: 11.5px; padding: 8px 12px; background: rgba(236, 72, 153, 0.18); border-color: rgba(236, 72, 153, 0.3);">
                  <i data-lucide="clipboard-list" style="width: 13px; height: 13px;"></i> Reservas (Membresías)
                </div>
                <div class="drawer-subitem ${state.activeTab === 'former_bungee_productos' ? 'active' : ''}" onclick="selectTabFromDrawer('former_bungee_productos', '${instKey}')" style="font-size: 11.5px; padding: 8px 12px; background: rgba(236, 72, 153, 0.18); border-color: rgba(236, 72, 153, 0.3);">
                  <i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i> Productos
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- 🛍️ Productos (General Tienda sin Former) -->
        <div class="drawer-brand-card ${state.activeTab === 'tienda' ? 'active' : ''}" onclick="selectTabFromDrawer('tienda', '${instKey}')">
          <div class="brand-icon-box cyan"><i data-lucide="shopping-bag" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Productos General</span>
            <span class="brand-card-desc">Tienda Oficial Pro Shop</span>
          </div>
          <i data-lucide="chevron-right" class="brand-arrow"></i>
        </div>

        <!-- 📞 Contáctanos -->
        <div class="drawer-brand-card ${state.activeTab === 'contacto' ? 'active' : ''}" onclick="selectTabFromDrawer('contacto', '${instKey}')">
          <div class="brand-icon-box lime"><i data-lucide="phone-call" style="width: 18px; height: 18px;"></i></div>
          <div class="brand-card-content">
            <span class="brand-card-title">Contáctanos</span>
            <span class="brand-card-desc">Ubicación & WhatsApp</span>
          </div>
          <i data-lucide="chevron-right" class="brand-arrow"></i>
        </div>
      </div>

      <!-- Bottom Logout Button ("Cerrar Sesión") -->
      <div class="drawer-footer-logout">
        <button class="btn-logout-brand" onclick="triggerClientLogout('${instKey}')">
          <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  `;
}

/* 1. MÓDULO HISTORIA */
function fixAppImageUrl(url, defaultImg) {
  if (!url || typeof url !== 'string' || url.trim() === '') return defaultImg || '/assets/images/cancha_padel_1.jpg';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return '/' + url;
}

function renderHistoryView() {
  const logoUrl = fixAppImageUrl(clubHistoryData.logo || clubHistoryData.logoUrl, '/assets/images/logo.jpeg');
  const coverUrl = fixAppImageUrl(clubHistoryData.coverImage || clubHistoryData.coverUrl, '/assets/images/cancha_techada.jpg');
  const name = fixMojibake(clubHistoryData.name || 'Level Tacambaro');
  const address = fixMojibake(clubHistoryData.address || 'Tacambaro, Michoacan Mexico');
  const description = fixMojibake(clubHistoryData.description || 'Level Tacambaro nacio con la vision de consolidar el primer centro deportivo de padel de alto nivel en Tacambaro, Michoacan. Nuestro club cuenta con 2 pistas de tecnologia profesional (Padel Cristal Pro y Panoramica VIP), iluminacion LED nocturna de alta definicion, area de espectadores, servicio de pro shop con alquiler de palas y pelotas.');

  const galleryList = (clubHistoryData.gallery && clubHistoryData.gallery.length > 0)
    ? clubHistoryData.gallery
    : [
      { title: 'Pista 1: Padel Cristal Pro (Azul)', url: '/assets/images/cancha_padel_1.jpg' },
      { title: 'Pista 2: Padel Panoramica VIP (Verde)', url: '/assets/images/cancha_padel_2.jpg' },
      { title: 'Cancha Techada & Alumbrado LED', url: '/assets/images/cancha_techada.jpg' },
      { title: 'Cancha Grama Sintetica Pro', url: '/assets/images/cancha_grama_7.jpg' },
      { title: 'Cancha de Entrenamientos', url: '/assets/images/cancha_sintetica_5.jpg' }
    ];

  return `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <!-- Hero Banner Card (Match Reservas Style) -->
      <div style="background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; box-shadow: 0 6px 20px rgba(0,0,0,0.06); position: relative; margin-bottom: 6px;">
        <div style="position: relative; height: 140px; border-top-left-radius: 20px; border-top-right-radius: 20px; overflow: hidden; background: #064E3B;">
          <img src="${coverUrl}" alt="Instalaciones Level Tacambaro" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" onerror="this.onerror=null; this.src='/assets/images/cancha_techada.jpg';">
        </div>
        <div style="position: absolute; top: 110px; left: 50%; transform: translateX(-50%); width: 170px; height: 60px; border-radius: 16px; background: #FFFFFF; padding: 6px 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); border: 2.5px solid #10B981; display: flex; align-items: center; justify-content: center; z-index: 10;">
          <img src="${logoUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; display: block;" onerror="this.onerror=null; this.src='/assets/images/logo.jpeg';">
        </div>

        <div style="padding: 38px 16px 18px 16px; text-align: center;">
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 21px; font-weight: 900; color: #0F172A; margin: 0 0 6px 0;">
            ${name}
          </h2>
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #0284C7; background: #F0F9FF; padding: 6px 12px; border-radius: 20px; border: 1px solid #BAE6FD;">
            <i data-lucide="map-pin" style="width: 13px; height: 13px;"></i> <span>${address}</span>
          </div>
        </div>
      </div>">">
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 21px; font-weight: 900; color: #0F172A; margin: 0 0 6px 0;">
            ${name}
          </h2>
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #0284C7; background: #F0F9FF; padding: 6px 12px; border-radius: 20px; border: 1px solid #BAE6FD;">
            <i data-lucide="map-pin" style="width: 13px; height: 13px;"></i> <span>${address}</span>
          </div>
        </div>
      </div>

      <!-- Reseña Histórica Card -->
      <div style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); border-left: 4px solid #10B981;">
        <div style="font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="book-open" style="width: 14px; height: 14px; color: #10B981;"></i> Quienes Somos & Filosofia
        </div>
        <p style="font-size: 12px; color: #475569; line-height: 1.65; margin: 0;">
          ${description}
        </p>
      </div>

      <!-- Galería de Instalaciones -->
      <div style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
        <h4 style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: inline-flex; align-items: center; gap: 6px;"><i data-lucide="image" style="width: 15px; height: 15px; color: #0284C7;"></i> Galería de Instalaciones</span>
          <span style="font-size: 10px; font-weight: 700; color: #0284C7; background: #F0F9FF; padding: 3px 8px; border-radius: 10px;">${galleryList.length} Fotos</span>
        </h4>

        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; box-sizing: border-box;">
          ${galleryList.map(img => `
            <div style="border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: #0F172A; position: relative; height: 115px; border: 1px solid #CBD5E1;">
              <img src="${fixAppImageUrl(img.url, '/assets/images/cancha_padel_1.jpg')}" alt="${fixMojibake(img.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='/assets/images/cancha_padel_1.jpg';">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.3) 75%, transparent 100%); color: #FFF; font-size: 9.5px; font-weight: 700; padding: 16px 8px 6px 8px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                ${fixMojibake(img.title)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* 2. MÓDULO RESERVAS & CANCHAS (2 CANCHAS DE PÁDEL) */
function fixMojibake(str) {
  if (typeof str !== 'string' || !str) return str || '';
  return str
    .replace(/ContraseÃ±a|ContraseÃ;a|Contrasena/g, 'Contraseña')
    .replace(/contraseÃ±a|contraseÃ;a|contrasena/g, 'contraseña')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã‘/g, 'Ñ')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã\u0081/g, 'Á')
    .replace(/Ã\u0089/g, 'É')
    .replace(/Ã\u00CD/g, 'Í')
    .replace(/Ã\u00D3/g, 'Ó')
    .replace(/Ã\u00DA/g, 'Ú')
    .replace(/PÃ¡del|PÃ;del|PÃ©del/g, 'Pádel')
    .replace(/TacÃ¡mbaro|TacÃ;mbaro/g, 'Tacámbaro')
    .replace(/MichoacÃ¡n|MichoacÃ;n/g, 'Michoacán')
    .replace(/PanorÃ¡mica|PanorÃ;mica/g, 'Panorámica')
    .replace(/CategorÃa|CategorÃ;a/g, 'Categoría');
}

function getCourtSport(c) {
  if (!c) return 'padel';
  const text = ((c.category || '') + ' ' + (c.name || '')).toLowerCase();
  if (text.includes('fut') || text.includes('fat') || text.includes('fútbol') || text.includes('futbol') || text.includes('sintet') || text.includes('grama')) {
    return 'futbol';
  }
  if (c.sport) return c.sport.toLowerCase();
  return 'padel';
}

function renderCourtsView(state, instKey, sport = 'padel') {
  const filteredCourts = (courtsData || []).filter(c => getCourtSport(c) === sport);

  const titleText = (sport === 'futbol') ? 'Canchas de Fútbol' : 'Canchas de Pádel';

  return `
    <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; color: #0F172A; font-weight: 900; margin: 0;">${titleText}</h2>
        <small style="font-size: 11px; color: #64748B; font-weight: 600;">Selecciona una cancha para ver disponibilidad 24/7</small>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
        <button onclick="selectTabFromDrawer('reservas', '${instKey}')" style="background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; border-radius: 12px; padding: 7px 10px; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; transition: all 0.2s ease;">
          <i data-lucide="ticket" style="width: 13px; height: 13px; color: #059669;"></i>
          <span>Mis Reservas</span>
        </button>
      </div>
    </div>

    <div class="courts-list">
      ${filteredCourts.length === 0 ? `
        <div class="module-card" style="text-align: center; color: #94A3B8; padding: 20px;">
          No hay canchas registradas en esta disciplina.
        </div>
      ` : filteredCourts.map(court => `
        <div class="mobile-court-card" onclick="openCourtDetail('${court.id}', '${instKey}')">
          <div class="card-hero">
            <img src="${court.image}" alt="${fixMojibake(court.name)}">
          </div>
          <div class="card-body">
            <h4>${fixMojibake(court.name)}</h4>
            <div class="court-location"><i data-lucide="map-pin" style="width: 12px;"></i> ${fixMojibake(court.location)}</div>
            <div class="card-footer">
              <div class="price-text">$ ${court.price} <span style="font-size: 10px; color: #64748B;">MXN / h</span></div>
              <button class="btn-reserve-mini" style="display: inline-flex; align-items: center; gap: 4px;">Reservar <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i></button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- External Dedicated Terms & Rules Card Button -->
    <div onclick="openTermsModal('${instKey}')" style="margin-top: 16px; background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); border: 1.5px solid #CBD5E1; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="background: rgba(126, 34, 206, 0.1); border: 1px solid rgba(126, 34, 206, 0.2); padding: 8px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
          <i data-lucide="file-text" style="width: 18px; height: 18px; color: #7E22CE;"></i>
        </div>
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #0F172A;">Términos & Reglamento del Club</div>
          <div style="font-size: 10px; color: #64748B; font-weight: 600;">Conoce las políticas de reservación, cancelación e inasistencia (no-show)</div>
        </div>
      </div>
      <i data-lucide="chevron-right" style="width: 16px; height: 16px; color: #7E22CE;"></i>
    </div>
  `;
}

/* 3. MÓDULO TORNEOS */
function renderTournamentsView(state, instKey, sport = 'padel') {
  const filteredTournaments = (tournamentsData || []).filter(t => {
    if (!t.sport) return sport === 'padel';
    return t.sport === sport;
  });

  const titleText = (sport === 'futbol') ? 'Torneos de Fútbol' : 'Torneos de Pádel';

  let tournListHtml = '';
  if (!filteredTournaments || filteredTournaments.length === 0) {
    tournListHtml = `<div class="module-card" style="text-align: center; color: #94A3B8; padding: 20px;">No hay torneos de ${sport === 'futbol' ? 'Fútbol' : 'Pádel'} activos en este momento.</div>`;
  } else {
    tournListHtml = filteredTournaments.map(t => {
      const registeredCount = (t.teams || []).length;
      const isOpen = (t.status === 'Inscripciones Abiertas');
      const isFull = (registeredCount >= t.maxTeams);
      const cleanTitle = fixMojibake(t.title || '');
      const cleanCat = fixMojibake(t.category || '');
      const cleanDates = fixMojibake(t.dates || '');
      let cleanPrize = fixMojibake(t.prize || '');
      if (!cleanPrize || cleanPrize === ',000 MXN' || cleanPrize.startsWith(',')) {
        cleanPrize = (t.id === 'TOURN-101') ? '$15,000 MXN' : '$8,000 MXN';
      }
      const tournImg = t.imageUrl || 'assets/images/cancha_padel_2.jpg';

      return `
        <div class="mobile-court-card" style="margin-bottom: 16px; border: 1px solid #E2E8F0; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
          <div style="position: relative; height: 130px; background: linear-gradient(135deg, #022C22 0%, #064E3B 100%);">
            <img src="${tournImg}" alt="${cleanTitle}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.75;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
            
            <span style="position: absolute; top: 12px; left: 12px; background: rgba(2, 132, 199, 0.95); color: #FFF; font-weight: 800; font-size: 10.5px; padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: inline-flex; align-items: center; gap: 4px;">
              <i data-lucide="award" style="width: 12px; height: 12px;"></i> ${cleanCat}
            </span>

            <span style="position: absolute; top: 12px; right: 12px; background: ${isOpen ? 'rgba(16, 185, 129, 0.95)' : 'rgba(100, 116, 139, 0.95)'}; color: #FFF; font-weight: 800; font-size: 10.5px; padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: inline-flex; align-items: center; gap: 4px;">
              ${isOpen ? '<i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> Inscripciones Abiertas' : '<i data-lucide="lock" style="width: 12px; height: 12px;"></i> Próximamente'}
            </span>
          </div>

          <div style="padding: 16px;">
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">
              ${cleanTitle}
            </h3>

            <div style="font-size: 12px; color: #64748B; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="calendar" style="width: 13px; height: 13px; color: #0284C7;"></i> <span>${cleanDates}</span>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <div style="font-size: 11px; color: #475569; font-weight: 600;">
                Inscritos: <strong style="color: #0F172A; font-weight: 800;">${registeredCount} / ${t.maxTeams} Equipos</strong>
              </div>
              <div style="font-size: 13px; font-weight: 900; color: #10B981;">
                Premio: ${cleanPrize}
              </div>
            </div>

            ${isOpen ? `
              <button style="width: 100%; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFF; border: none; padding: 11px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3); display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="openClientRegisterModal('${t.id}')">
                <i data-lucide="trophy" style="width: 14px; height: 14px;"></i> Registrar Mi Equipo / Pareja
              </button>
            ` : `
              <button style="width: 100%; background: #F1F5F9; color: #94A3B8; border: 1px solid #E2E8F0; padding: 11px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: not-allowed;" disabled>
                ${isFull ? 'Cupo Lleno' : 'Inscripciones Cerradas'}
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  return `
    <div style="position: relative;">
      <div style="margin-bottom: 14px;">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; color: #0F172A; font-weight: 900; margin: 0;">${titleText}</h2>
      </div>
      ${tournListHtml}
    </div>
  `;
}

function openClientRegisterModal(tournId) {
  activeRegisterTournamentId = tournId;
  renderAllInstances();
}

function closeClientRegisterModal() {
  activeRegisterTournamentId = null;
  renderAllInstances();
}

async function handleClientRegisterSubmit(e, tournId, instKey = 'single') {
  e.preventDefault();
  const teamNameInput = document.getElementById(`clientTeamNameInput_${instKey}`) || document.getElementById('clientTeamNameInput');
  const participantsInput = document.getElementById(`clientParticipantsInput_${instKey}`) || document.getElementById('clientParticipantsInput');
  if (!teamNameInput || !participantsInput) return;

  const teamName = teamNameInput.value.trim();
  const participants = participantsInput.value.trim();
  if (!teamName || !participants) return;

  try {
    const res = await fetch('api/tournaments/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ tournamentId: tournId, teamName, participants })
    });
    if (res.ok) {
      activeRegisterTournamentId = null;
      showAppAlert(instKey, '¡Inscripción Exitosa!', `Tu equipo "${teamName}" ha sido registrado correctamente para el torneo.`, 'success', '¡Excelente!');
      fetchTournamentsData();
    } else {
      showAppAlert(instKey, 'Inscripción Fallida', 'No se pudo registrar la inscripción en este momento. Intenta de nuevo.', 'warning');
    }
  } catch (err) {
    /* silent error */
    showAppAlert(instKey, 'Error de Conexión', 'No se pudo conectar con el servidor de Tacámbaro.', 'error');
  }
}

/* 4. MÓDULO FORMER RESERVAS (AVISO) */
function renderFormerReservationsNoticeView(subType = 'general', instKey) {
  const phone = (clubHistoryData.phone || '459 102 3849').replace(/\D/g, '');
  const title = (subType === 'funcional') ? 'Former - Entrenamiento Funcional' : ((subType === 'bungee') ? 'Former - Bungee Fitness' : 'Former');
  const badgeText = (subType === 'funcional') ? 'Clases & Membresías Funcional' : ((subType === 'bungee') ? 'Clases & Membresías Bungee' : 'Membresías & Visitas');
  const gradient = (subType === 'bungee') ? 'linear-gradient(135deg, #831843 0%, #BE185D 100%)' : 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)';
  const iconEmoji = (subType === 'bungee') ? '🪂' : '🏋️‍♀️';

  return `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="margin-bottom: 2px;">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; color: #0F172A; font-weight: 900; margin: 0;">${title}</h2>
      </div>

      <div style="background: ${gradient}; border-radius: 20px; padding: 20px; color: #FFFFFF; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -10px; right: -10px; font-size: 80px; opacity: 0.15;">${iconEmoji}</div>
        
        <span style="background: rgba(255,255,255,0.2); color: #FFF; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 10px;">
          ${badgeText}
        </span>

        <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 900; margin: 0 0 8px 0; color: #FFF;">
          ${title}
        </h3>

        <p style="font-size: 12px; color: #F3E8FF; line-height: 1.6; margin: 0 0 14px 0; font-weight: 500;">
          Las sesiones de ${subType === 'bungee' ? 'Bungee Fitness' : 'Entrenamiento Funcional'} se manejan mediante paquetes de visitas y suscripciones mensuales con cupos reservados por horario.
        </p>

        <div style="background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 12px; font-size: 11px; color: #F3E8FF; margin-bottom: 16px; font-weight: 600;">
          📌 <strong>Atención en Recepción:</strong> Adquiere tu membresía o consulta la disponibilidad de horarios de clases directamente en recepción o por WhatsApp.
        </div>

        <button onclick="window.open('https://wa.me/52${phone}?text=Hola,%20quisiera%20informaci%C3%B3n%20sobre%20las%20membres%C3%ADas%20y%20clases%20de%20${encodeURIComponent(title)}', '_blank')" style="width: 100%; background: #25D366; color: #FFF; border: none; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 12.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
          <i data-lucide="message-square" style="width: 16px; height: 16px;"></i> Consultar Membresías vía WhatsApp
        </button>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 14px;">
        <h4 style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">🛍️ Productos & Equipamiento (${subType === 'bungee' ? 'Bungee' : 'Funcional'})</h4>
        <p style="font-size: 11.5px; color: #64748B; margin: 0 0 10px 0; font-weight: 500;">
          Encuentra artículos, suplementos y accesorios exclusivos para ${subType === 'bungee' ? 'Bungee' : 'Funcional'}.
        </p>
        <button onclick="selectTabFromDrawer('${subType === 'bungee' ? 'former_bungee_productos' : 'former_funcional_productos'}', '${instKey}')" style="background: #0284C7; color: #FFF; border: none; padding: 9px 14px; border-radius: 10px; font-size: 11.5px; font-weight: 800; cursor: pointer;">
          Ver Productos de ${subType === 'bungee' ? 'Bungee' : 'Funcional'} →
        </button>
      </div>
    </div>
  `;
}

/* 5. MÓDULO TIENDA & ALQUILER (CON FILTRO ESTRICTO DE FORMER VS GENERAL) */
function renderProductsView(deptFilter = 'general') {
  const filteredProducts = (productsData || []).filter(p => {
    if (deptFilter === 'funcional') {
      return p.department === 'funcional' || (p.category && p.category.toLowerCase().includes('funcional'));
    } else if (deptFilter === 'bungee') {
      return p.department === 'bungee' || (p.category && p.category.toLowerCase().includes('bungee'));
    } else if (deptFilter === 'former') {
      return p.department === 'former' || p.department === 'funcional' || p.department === 'bungee';
    } else {
      // General store MUST NOT show any Former, Funcional or Bungee products!
      return p.department !== 'former' && p.department !== 'funcional' && p.department !== 'bungee';
    }
  });

  let titleText = 'Productos Tienda General';
  let subtitleText = 'Pelotas, overgrips, accesorios e indumentaria';
  if (deptFilter === 'funcional') {
    titleText = 'Productos Former - Funcional';
    subtitleText = 'Accesorios, suplementos y equipamiento para entrenamiento funcional';
  } else if (deptFilter === 'bungee') {
    titleText = 'Productos Former - Bungee Fitness';
    subtitleText = 'Arneses, bandas elásticas y accesorios de Bungee Fitness';
  } else if (deptFilter === 'former') {
    titleText = 'Productos Former';
    subtitleText = 'Accesorios y suplementación de Former';
  }

  let productsHtml = '';
  if (filteredProducts.length === 0) {
    productsHtml = `
      <div class="module-card" style="padding: 12px; grid-column: 1 / -1; text-align: center; color: #94A3B8;">
        No hay productos en esta categoría.
      </div>
    `;
  } else {
    productsHtml = filteredProducts.map(p => {
      const isOut = (p.stock <= 0);
      const imgUrl = p.imageUrl || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';
      return `
        <div class="module-card" style="padding: 10px 8px; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; box-sizing: border-box;">
          <div>
            <div style="position: relative; width: 100%; height: 80px; border-radius: 10px; overflow: hidden; margin-bottom: 6px; background: #F1F5F9;">
              <img src="${imgUrl}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&auto=format&fit=crop';">
              <span style="position: absolute; top: 4px; left: 4px; font-size: 8.5px; font-weight: 700; color: #0284C7; background: rgba(255,255,255,0.92); padding: 2px 5px; border-radius: 4px; max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${p.category || 'Tienda'}
              </span>
            </div>
            <h4 style="font-size: 11.5px; font-weight: 700; margin: 2px 0 4px 0; color: #0F172A; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${p.name}">${p.name}</h4>
          </div>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #10B981; margin-bottom: 2px;">$ ${p.price} MXN</div>
            <div style="font-size: 9.5px; color: ${isOut ? '#DC2626' : '#64748B'}; font-weight: 700; display: inline-flex; align-items: center; gap: 3px;">
              ${isOut ? '<i data-lucide="x-circle" style="width: 11px; height: 11px; color: #DC2626;"></i> Agotado' : `<i data-lucide="box" style="width: 11px; height: 11px; color: #10B981;"></i> Stock: ${p.stock} uds`}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  return `
    <div style="margin-bottom: 14px;">
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; color: #0F172A; font-weight: 900; margin: 0;">${titleText}</h2>
      <small style="font-size: 11px; color: #64748B; font-weight: 600;">${subtitleText}</small>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; width: 100%; box-sizing: border-box;">
      ${productsHtml}
    </div>
  `;
}

/* 5. MÓDULO CONTACTO & UBICACIÓN */
function renderContactView() {
  const name = clubHistoryData.name || 'Level Tacámbaro';
  const address = clubHistoryData.address || 'Tacámbaro de Codallos, Michoacán';
  const phone = clubHistoryData.phone || '459 102 3849';
  const cleanPhone = (phone || '').replace(/\D/g, '');

  return `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <!-- Header Title -->
      <div style="margin-bottom: 2px;">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; color: #0F172A; font-weight: 900; margin: 0;">Contáctanos</h2>
      </div>

      <!-- Hero Header Card with Cover Image & Status Pill -->
      <div style="background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.06);">
        <div style="position: relative; height: 125px; background: linear-gradient(135deg, #022C22 0%, #064E3B 100%);">
          <img src="assets/images/cancha_techada.jpg" alt="Instalaciones Level Tacámbaro" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.75;" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' fill=\'%23f1f5f9\'><rect width=\'100\' height=\'100\' fill=\'%23e2e8f0\'/><text x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%2364748b\' font-size=\'12\'>Imagen</text></svg>';">
          <div style="position: absolute; top: 12px; right: 12px; background: rgba(16, 185, 129, 0.95); color: #FFF; font-weight: 800; font-size: 10px; padding: 4px 10px; border-radius: 20px; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: inline-flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #FFF; display: inline-block;"></span> PISTAS ABIERTAS 24H
          </div>
          <div style="position: absolute; bottom: 12px; left: 14px; right: 14px; color: #FFF;">
            <span style="font-size: 10px; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 0.5px;">Centro Deportivo Pro</span>
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 900; color: #FFFFFF; margin: 2px 0 0 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
              ${name}
            </h3>
          </div>
        </div>

        <!-- Contact Quick Action Grid -->
        <div style="padding: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <!-- WhatsApp Direct Button -->
          <button onclick="window.open('https://wa.me/52${cleanPhone}', '_blank')" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #FFF; border: none; padding: 12px 10px; border-radius: 14px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 4px 14px rgba(37,211,102,0.3); display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.2s ease;">
            <i data-lucide="message-square" style="width: 20px; height: 20px;"></i>
            <span>WhatsApp Directo</span>
            <span style="font-size: 9.5px; opacity: 0.9; font-weight: 600;">Respuesta Inmediata</span>
          </button>

          <!-- Call Button -->
          <button onclick="window.open('tel:${cleanPhone}', '_self')" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFF; border: none; padding: 12px 10px; border-radius: 14px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 0 4px 14px rgba(2,132,199,0.3); display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.2s ease;">
            <i data-lucide="phone-call" style="width: 20px; height: 20px;"></i>
            <span>Llamar al Club</span>
            <span style="font-size: 9.5px; opacity: 0.9; font-weight: 600;">${phone}</span>
          </button>
        </div>
      </div>

      <!-- Bank Account Details Card -->
      <div style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; padding: 18px; color: #0F172A; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border-top: 4px solid #10B981;">
        <div style="font-size: 11px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: flex; align-items: center; gap: 6px;"><i data-lucide="building-2" style="width: 16px; height: 16px; color: #10B981;"></i> Datos Bancarios Oficiales</span>
          <span style="background: rgba(16,185,129,0.1); color: #059669; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.2);">SPEI & Depósitos</span>
        </div>
        <h4 style="font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0;">${bankInfoData.bankName || 'BBVA México'}</h4>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
          <div style="background: #F8FAFC; padding: 10px 12px; border-radius: 12px; border: 1px solid #F1F5F9;">
            <div style="font-size: 9.5px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Titular de la Cuenta:</div>
            <div style="font-weight: 800; color: #0F172A; font-size: 12.5px;">${bankInfoData.accountHolder || 'Level Centro Deportivo S.A. de C.V.'}</div>
          </div>

          <div style="background: #F8FAFC; padding: 10px 12px; border-radius: 12px; border: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 9.5px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">CLABE Interbancaria (18 dígs):</div>
              <div style="font-weight: 800; color: #0284C7; font-family: 'JetBrains Mono', monospace; font-size: 13px;">${bankInfoData.clabe || '012 320 001122334455 6'}</div>
            </div>
            <button onclick="copyBankText('${(bankInfoData.clabe || '').replace(/\s/g,'')}', 'CLABE', 'single')" style="background: #10B981; color: #FFFFFF; border: none; padding: 7px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(16,185,129,0.25);">Copiar</button>
          </div>

          <div style="background: #F8FAFC; padding: 10px 12px; border-radius: 12px; border: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 9.5px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">N° de Tarjeta / Depósito OXXO:</div>
              <div style="font-weight: 800; color: #0F172A; font-family: 'JetBrains Mono', monospace; font-size: 13px;">${bankInfoData.cardNumber || '4152 3138 9012 3456'}</div>
            </div>
            <button onclick="copyBankText('${(bankInfoData.cardNumber || '').replace(/\s/g,'')}', 'Número de Tarjeta', 'single')" style="background: #10B981; color: #FFFFFF; border: none; padding: 7px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(16,185,129,0.25);">Copiar</button>
          </div>
        </div>

        <div style="font-size: 11px; color: #0369A1; line-height: 1.45; background: #F0F9FF; border: 1px solid #BAE6FD; padding: 10px 12px; border-radius: 10px; font-weight: 600; display: flex; align-items: flex-start; gap: 8px;">
          <i data-lucide="info" style="width: 16px; height: 16px; color: #0284C7; flex-shrink: 0; margin-top: 1px;"></i>
          <div><strong>Nota de Pago:</strong> Ingresa tu nombre completo y número de teléfono en el concepto de pago de tu transferencia SPEI.</div>
        </div>
      </div>

      <!-- Location & Reference Card -->
      <div style="background: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); border-left: 4px solid #0284C7;">
        <div style="font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="map-pin" style="width: 15px; height: 15px; color: #0284C7;"></i> Ubicación Exacta & Referencia
        </div>
        
        <p style="font-size: 12px; color: #334155; line-height: 1.5; margin: 0 0 8px 0; font-weight: 600;">
          ${address}
        </p>

        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 8px 10px; font-size: 11px; color: #0369A1; font-weight: 700; display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
          <i data-lucide="navigation" style="width: 14px; height: 14px; color: #0284C7;"></i> Referencia: Frente a Protección Civil Tacámbaro
        </div>

        <!-- Navigation Apps Buttons -->
        <div style="display: flex; gap: 8px;">
          <button onclick="window.open('https://maps.google.com/?q=Valent%C3%ADn+G%C3%B3mez+Far%C3%ADas+3+Tac%C3%A1mbaro+Michoac%C3%A1n', '_blank')" style="flex: 1; background: #F8FAFC; color: #0F172A; border: 1px solid #CBD5E1; padding: 9px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
            <i data-lucide="map" style="width: 13px; height: 13px; color: #10B981;"></i> Google Maps
          </button>
          <button onclick="window.open('https://waze.com/ul?q=Tacambaro+Michoacan', '_blank')" style="flex: 1; background: #F8FAFC; color: #0F172A; border: 1px solid #CBD5E1; padding: 9px; border-radius: 10px; font-size: 11px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
            <i data-lucide="navigation-2" style="width: 13px; height: 13px; color: #0284C7;"></i> Waze
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleClientContactSubmit(e) {
  e.preventDefault();
  const name = (document.getElementById('contactNameInput')?.value || '').trim();
  if (name) {
    showAppAlert('single', '¡Mensaje Enviado!', `Gracias ${name}, hemos recibido tu mensaje en Level Tacámbaro. Te responderemos a la brevedad.`, 'success', '¡Excelente!');
    document.getElementById('contactNameInput').value = '';
    document.getElementById('contactPhoneInput').value = '';
    document.getElementById('contactMessageInput').value = '';
  }
}

function formatSelectedDateText(dateStr) {
  if (!dateStr) return 'Sábado, 5 de Septiembre 2026';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const yr = parseInt(parts[0]);
  const mo = parseInt(parts[1]) - 1;
  const da = parseInt(parts[2]);

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const dObj = new Date(yr, mo, da);
  const dayName = daysOfWeek[dObj.getDay()];
  const monthName = months[mo];

  return `${dayName}, ${da} de ${monthName} ${yr}`;
}

function renderCourtDetailView(court, state, instKey) {
  const liveCourt = courtsData.find(c => c.id === court.id) || court;
  const bookingStep = state.bookingStep || 'calendar';

  if (bookingStep === 'calendar') {
    return renderCalendarStepView(liveCourt, state, instKey);
  } else {
    return renderTimeSlotsStepView(liveCourt, state, instKey);
  }
}

function changeCalendarMonth(instKey, delta) {
  const state = instanceStates[instKey];
  if (state.calendarMonth === undefined) state.calendarMonth = 8;
  if (state.calendarYear === undefined) state.calendarYear = 2026;

  state.calendarMonth += delta;
  if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear += 1;
  } else if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear -= 1;
  }
  renderAllInstances();
}

function getSlotBookingForDate(courtId, slot, dateStr) {
  if (!courtId || !slot) return null;
  const targetHour = parseInt(slot.split(':')[0], 10);
  const bookingsList = [...(allBookingsData || []), ...(userBookings || [])];

  return bookingsList.find(b => {
    if (!b || !b.timeSlot) return false;

    const matchesCourt = (
      b.courtId === courtId ||
      (b.courtId && b.courtId.toLowerCase() === String(courtId).toLowerCase()) ||
      (b.courtName && b.courtName.toLowerCase().includes(String(courtId).toLowerCase()))
    );
    if (!matchesCourt) return false;

    const bDate = b.date || b.selectedDate;
    if (dateStr) {
      if (!bDate) return false;
      const bISO = String(bDate).trim().substring(0, 10);
      if (bISO !== dateStr) return false;
    }

    const startMatch = b.timeSlot.match(/(\d{1,2}):00/);
    if (!startMatch) return false;
    const startHour = parseInt(startMatch[1], 10);
    const durMatch = b.timeSlot.match(/(\d+)\s*(?:hrs?|horas?)/i);
    const duration = durMatch ? parseInt(durMatch[1], 10) : 1;
    const endHour = startHour + duration;

    return targetHour >= startHour && targetHour < endHour;
  });
}

function getSlotsArray(slots) {
  const defaultSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
  if (!slots) return defaultSlots;
  if (Array.isArray(slots)) return slots;
  if (typeof slots === 'object') {
    if (Array.isArray(slots.value)) return slots.value;
    const vals = Object.values(slots);
    const validTimeVals = vals.filter(v => typeof v === 'string' && v.includes(':'));
    if (validTimeVals.length > 0) return validTimeVals;
  }
  return defaultSlots;
}

function getCourtDateOccupancy(court, dateStr) {
  if (!court) return 0;
  const slotsList = getSlotsArray(court.slots);
  if (!slotsList.length) return 0;
  const totalSlots = slotsList.length || 24;
  let bookedCount = 0;

  slotsList.forEach(slot => {
    if (getSlotBookingForDate(court.id, slot, dateStr)) {
      bookedCount++;
    }
  });

  return Math.min(100, Math.round((bookedCount / totalSlots) * 100));
}

function renderCalendarStepView(liveCourt, state, instKey) {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const now = new Date();
  const currentYr = now.getFullYear();
  const currentMo = now.getMonth();
  const currentDa = now.getDate();

  const yr = state.calendarYear !== undefined ? state.calendarYear : currentYr;
  const moIdx = state.calendarMonth !== undefined ? state.calendarMonth : currentMo;

  const monthName = monthNames[moIdx];
  const daysInMonth = new Date(yr, moIdx + 1, 0).getDate();
  const offset = new Date(yr, moIdx, 1).getDay();

  let calendarGridHtml = '';

  for (let i = 0; i < offset; i++) {
    calendarGridHtml += `<div style="background: transparent; border: none; height: 48px;"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (yr === currentYr && moIdx === currentMo && day === currentDa);
    const cellDate = new Date(yr, moIdx, day);
    const todayZero = new Date(currentYr, currentMo, currentDa);
    const isPast = cellDate < todayZero;
    const dateStr = `${yr}-${String(moIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = (state.selectedDate === dateStr);

    let borderStyle = isSelected ? '2px solid #10B981' : (isToday ? '2px solid #0284C7' : '1px solid #E2E8F0');
    let bgStyle = isSelected ? 'rgba(16, 185, 129, 0.12)' : (isToday ? 'rgba(2, 132, 199, 0.06)' : (isPast ? '#F8FAFC' : '#FFFFFF'));
    let textColor = isPast ? '#94A3B8' : '#0F172A';
    let cursorStyle = isPast ? 'not-allowed' : 'pointer';
    let opacityStyle = isPast ? '0.5' : '1';

    const occupancyPct = isPast ? 0 : getCourtDateOccupancy(liveCourt, dateStr);

    let statusTextHtml = '';
    if (isPast) {
      statusTextHtml = `<span style="font-size: 8px; font-weight: 600; color: #94A3B8;">—</span>`;
    } else if (occupancyPct >= 80) {
      statusTextHtml = `<span style="font-size: 7.5px; font-weight: 800; color: #DC2626; display: inline-flex; align-items: center; gap: 1px;"><i data-lucide="flame" style="width: 8px; height: 8px;"></i> ${occupancyPct}%</span>`;
    } else if (occupancyPct > 0) {
      statusTextHtml = `<span style="font-size: 7.5px; font-weight: 700; color: #D97706; display: inline-flex; align-items: center; gap: 1px;"><i data-lucide="zap" style="width: 8px; height: 8px;"></i> ${occupancyPct}%</span>`;
    } else {
      statusTextHtml = `<span style="font-size: 7.5px; font-weight: 700; color: #059669; display: inline-flex; align-items: center; gap: 1px;"><i data-lucide="check" style="width: 8px; height: 8px;"></i> Libre</span>`;
    }

    const hoyBadge = isToday ? `<span style="font-size: 7px; font-weight: 800; background: #0284C7; color: #FFF; padding: 1px 3px; border-radius: 3px; line-height: 1;">HOY</span>` : '';

    const clickAction = isPast ? '' : `onclick="instanceStates['${instKey}'].selectedDate='${dateStr}'; instanceStates['${instKey}'].bookingStep='slots'; renderAllInstances();"`;

    calendarGridHtml += `
      <div ${clickAction} style="background: ${bgStyle}; border: ${borderStyle}; border-radius: 8px; padding: 4px 2px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 48px; cursor: ${cursorStyle}; opacity: ${opacityStyle}; transition: all 0.2s ease; box-shadow: ${isSelected ? '0 4px 12px rgba(16,185,129,0.2)' : 'none'}; box-sizing: border-box; width: 100%; overflow: hidden;">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 1px;">
          <span style="font-size: 11px; font-weight: 800; color: ${textColor}; font-family: 'Outfit', sans-serif;">${day}</span>
          ${hoyBadge}
        </div>
        ${statusTextHtml}
      </div>
    `;
  }

  const cleanCourtName = fixMojibake(liveCourt.name);
  const cleanCourtLoc = fixMojibake(liveCourt.location);

  return `
    <div style="position: relative; background: #F8FAFC; min-height: 100%; padding-bottom: 70px;">
      <div style="position: relative; height: 130px;">
        <img src="${liveCourt.image}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.75) 100%);"></div>
        <button onclick="instanceStates['${instKey}'].selectedCourt=null; renderAllInstances();" style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
          <i data-lucide="arrow-left" style="width: 18px; color: #0F172A;"></i>
        </button>
        <div style="position: absolute; bottom: 10px; left: 14px; right: 14px; color: #FFF;">
          <div style="font-size: 10px; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Paso 1 de 2: Fecha de Reserva</div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; color: #FFF; margin: 0;">${cleanCourtName}</h3>
        </div>
      </div>

      <div style="padding: 12px 14px 4px 14px;">
        <div style="background: #FFF; border-radius: 12px; padding: 10px 12px; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
          <div>
            <div style="font-size: 11px; color: #64748B; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="map-pin" style="width: 12px; height: 12px; color: #0284C7;"></i> ${cleanCourtLoc}</div>
            <div style="font-size: 14px; font-weight: 800; color: #10B981; margin-top: 2px;">$ ${liveCourt.price} MXN / hora</div>
          </div>
          <span style="background: rgba(16, 185, 129, 0.1); color: #059669; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); display: inline-flex; align-items: center; gap: 4px;">
            <i data-lucide="calendar" style="width: 12px; height: 12px;"></i> Calendario
          </span>
        </div>

        <div style="background: #FFF; border-radius: 14px; padding: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); box-sizing: border-box; width: 100%; overflow: hidden;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding: 0 2px;">
            <button onclick="changeCalendarMonth('${instKey}', -1)" style="background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 8px; padding: 5px 10px; cursor: pointer; color: #0F172A; font-size: 11px; font-weight: 800; transition: all 0.2s;">‹ Prev</button>
            <h4 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800; color: #0F172A; margin: 0; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="calendar" style="width: 13px; height: 13px; color: #10B981;"></i> ${monthName} ${yr}
            </h4>
            <button onclick="changeCalendarMonth('${instKey}', 1)" style="background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 8px; padding: 5px 10px; cursor: pointer; color: #0F172A; font-size: 11px; font-weight: 800; transition: all 0.2s;">Sig ›</button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 3px; text-align: center; margin-bottom: 6px; width: 100%; box-sizing: border-box;">
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Dom</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Lun</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Mar</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Mie</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Jue</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Vie</span>
            <span style="font-size: 9.5px; font-weight: 700; color: #94A3B8;">Sab</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 3px; width: 100%; box-sizing: border-box;">
            ${calendarGridHtml}
          </div>
        </div>

        <div style="margin-top: 12px; background: rgba(2, 132, 199, 0.06); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 10px; padding: 10px 12px; text-align: center; font-size: 11px; color: #0369A1; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i data-lucide="info" style="width: 13px; height: 13px; color: #0369A1;"></i> Toca cualquier dia del calendario para ver sus horarios disponibles.
        </div>
      </div>
    </div>
  `;
}

function renderTimeSlotsStepView(liveCourt, state, instKey) {
  const selectedDate = state.selectedDate || '2026-09-05';
  const formattedDate = formatSelectedDateText(selectedDate);
  const durationHours = state.durationHours || 1;

  state.paymentMethod = state.paymentMethod || 'Efectivo en Mostrador';

  return `
    <div style="position: relative; background: #FFF; min-height: 100%;">
      <div style="position: relative; height: 120px;">
        <img src="${liveCourt.image}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.85) 100%);"></div>
        <button onclick="instanceStates['${instKey}'].bookingStep='calendar'; renderAllInstances();" style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
          <i data-lucide="arrow-left" style="width: 18px; color: #0F172A;"></i>
        </button>
        <div style="position: absolute; bottom: 10px; left: 14px; right: 14px; color: #FFF;">
          <div style="font-size: 10px; font-weight: 700; color: #34D399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Paso 2 de 2: Horarios Disponibles</div>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; color: #FFF; margin: 0;">${liveCourt.name}</h3>
        </div>
      </div>

      <div style="padding: 12px 14px 130px 14px;">
        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%); border: 1.5px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">Día Seleccionado:</div>
            <div style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800; color: #0F172A; margin-top: 1px; display: flex; align-items: center; gap: 4px;">
              <i data-lucide="calendar" style="width: 13px; height: 13px; color: #10B981;"></i> ${formattedDate}
            </div>
          </div>
          <button onclick="instanceStates['${instKey}'].bookingStep='calendar'; renderAllInstances();" style="background: #FFF; color: #0284C7; border: 1px solid #BAE6FD; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.03); display: inline-flex; align-items: center; gap: 4px;">
            <i data-lucide="edit-3" style="width: 11px; height: 11px;"></i> Cambiar Día
          </button>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="margin-bottom: 10px;">
            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Duración:</label>
            <div style="display: flex; gap: 6px;">
              <button type="button" onclick="instanceStates['${instKey}'].durationHours=1; renderAllInstances();" style="flex: 1; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 800; border: 1.5px solid ${durationHours === 1 ? '#10B981' : '#CBD5E1'}; background: ${durationHours === 1 ? '#10B981' : '#FFF'}; color: ${durationHours === 1 ? '#FFF' : '#334155'}; cursor: pointer;">1 Hora</button>
              <button type="button" onclick="instanceStates['${instKey}'].durationHours=2; renderAllInstances();" style="flex: 1; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 800; border: 1.5px solid ${durationHours === 2 ? '#10B981' : '#CBD5E1'}; background: ${durationHours === 2 ? '#10B981' : '#FFF'}; color: ${durationHours === 2 ? '#FFF' : '#334155'}; cursor: pointer;">2 Horas</button>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Método de Pago:</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;">
              <button type="button" onclick="instanceStates['${instKey}'].paymentMethod='Efectivo en Mostrador'; renderAllInstances();" style="padding: 8px 4px; border-radius: 8px; font-size: 10px; font-weight: 800; border: 1.5px solid ${state.paymentMethod === 'Efectivo en Mostrador' ? '#10B981' : '#CBD5E1'}; background: ${state.paymentMethod === 'Efectivo en Mostrador' ? '#ECFDF5' : '#FFF'}; color: ${state.paymentMethod === 'Efectivo en Mostrador' ? '#059669' : '#475569'}; cursor: pointer; text-align: center;">
                💵 Efectivo
              </button>
              <button type="button" onclick="instanceStates['${instKey}'].paymentMethod='Tarjeta de Débito'; renderAllInstances();" style="padding: 8px 4px; border-radius: 8px; font-size: 10px; font-weight: 800; border: 1.5px solid ${state.paymentMethod === 'Tarjeta de Débito' ? '#0284C7' : '#CBD5E1'}; background: ${state.paymentMethod === 'Tarjeta de Débito' ? '#F0F9FF' : '#FFF'}; color: ${state.paymentMethod === 'Tarjeta de Débito' ? '#0284C7' : '#475569'}; cursor: pointer; text-align: center;">
                💳 Tarjeta
              </button>
              <button type="button" onclick="instanceStates['${instKey}'].paymentMethod='Transferencia Bancaria'; renderAllInstances();" style="padding: 8px 4px; border-radius: 8px; font-size: 10px; font-weight: 800; border: 1.5px solid ${state.paymentMethod === 'Transferencia Bancaria' ? '#7E22CE' : '#CBD5E1'}; background: ${state.paymentMethod === 'Transferencia Bancaria' ? '#F3E8FF' : '#FFF'}; color: ${state.paymentMethod === 'Transferencia Bancaria' ? '#7E22CE' : '#475569'}; cursor: pointer; text-align: center;">
                🏦 Transferencia
              </button>
            </div>
          </div>

          ${state.paymentMethod === 'Tarjeta de Débito' ? `
            <div style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border: 1.5px solid #BAE6FD; border-radius: 16px; padding: 12px; color: #0C4A6E; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.08);">
              <div style="font-size: 11px; font-weight: 900; color: #0284C7; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="credit-card" style="width: 15px; height: 15px; color: #0284C7;"></i>
                <span>Pago con Tarjeta de Débito / Crédito</span>
              </div>

              <div style="background: #FFFFFF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 10px; font-size: 11px; margin-bottom: 10px;">
                <div style="margin-bottom: 6px;">
                  <span style="font-size: 9.5px; color: #0284C7; font-weight: 800; display: block; text-transform: uppercase; margin-bottom: 2px;">🏢 En Recepción (Terminal TPV):</span>
                  <span style="color: #334155; font-size: 10.5px; line-height: 1.3; display: block;">
                    Pagas al llegar al club en recepción usando tu tarjeta (Visa, Mastercard, AMEX).
                  </span>
                </div>

                ${bankInfoData.cardNumber ? `
                  <div style="border-top: 1px dashed #BAE6FD; padding-top: 8px; margin-top: 8px;">
                    <span style="font-size: 9.5px; color: #0284C7; font-weight: 800; display: block; text-transform: uppercase; margin-bottom: 3px;">💳 Depósito a Tarjeta (16 dígitos):</span>
                    <div style="display: flex; align-items: center; justify-content: space-between; background: #F0F9FF; border: 1px solid #BAE6FD; padding: 6px 10px; border-radius: 8px;">
                      <span style="font-family: 'JetBrains Mono', monospace; color: #0284C7; font-weight: 800; font-size: 12px; letter-spacing: 0.5px; white-space: nowrap;">${bankInfoData.cardNumber}</span>
                      <button type="button" onclick="copyBankText('${bankInfoData.cardNumber}', 'Número de Tarjeta', '${instKey}')" style="background: #0284C7; color: #FFF; border: none; padding: 4px 8px; border-radius: 6px; font-size: 9.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;">
                        📋 Copiar
                      </button>
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Cargar Comprobante / Voucher de Tarjeta -->
              <div style="background: #FFFFFF; border: 1.5px dashed #38BDF8; border-radius: 12px; padding: 10px; text-align: center;">
                <label for="receiptInput_${instKey}" style="cursor: pointer; display: block;">
                  <i data-lucide="${state.receiptImage ? 'check-circle' : 'upload-cloud'}" style="width: 20px; height: 20px; color: ${state.receiptImage ? '#16A34A' : '#0284C7'}; margin-bottom: 2px;"></i>
                  <div style="font-size: 11px; font-weight: 800; color: ${state.receiptImage ? '#15803D' : '#0284C7'};">
                    ${state.receiptImage ? '✅ Voucher / Comprobante Seleccionado' : '📸 Cargar Voucher / Foto de Pago (Opcional)'}
                  </div>
                  <small style="font-size: 9px; color: #64748B; display: block; margin-top: 2px;">Sube captura si realizaste pago digital previo</small>
                </label>
                <input type="file" id="receiptInput_${instKey}" accept="image/*,.pdf" style="display: none;" onchange="handleReceiptFileSelect(event, '${instKey}')">
              </div>

              ${state.receiptImage ? `
                <div style="text-align: center; margin-top: 8px;">
                  <img src="${state.receiptImage}" style="max-height: 85px; border-radius: 10px; border: 2px solid #38BDF8; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${state.paymentMethod === 'Transferencia Bancaria' ? `
            <div style="background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%); border: 1.5px solid #E9D5FF; border-radius: 16px; padding: 14px; color: #1E1B4B; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(126, 34, 206, 0.08);">
              <div style="font-size: 11px; font-weight: 900; color: #7E22CE; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="landmark" style="width: 15px; height: 15px; color: #7E22CE;"></i>
                <span>Datos para Transferencia SPEI / Depósito</span>
              </div>

              <div style="background: #FFFFFF; border: 1px solid #F3E8FF; border-radius: 12px; padding: 10px; font-size: 11px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed #F3E8FF; padding-bottom: 6px;">
                  <div>
                    <span style="font-size: 9px; color: #6B21A8; font-weight: 800; display: block; text-transform: uppercase;">BANCO:</span>
                    <strong style="color: #0F172A; font-weight: 800; font-size: 11.5px;">${bankInfoData.bankName || 'BBVA México'}</strong>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 9px; color: #6B21A8; font-weight: 800; display: block; text-transform: uppercase;">TITULAR:</span>
                    <span style="color: #334155; font-size: 10.5px; font-weight: 700;">${bankInfoData.accountHolder || 'Level Tacámbaro'}</span>
                  </div>
                </div>

                <div>
                  <span style="font-size: 9px; color: #6B21A8; font-weight: 800; display: block; text-transform: uppercase; margin-bottom: 3px;">CLABE INTERBANCARIA (18 DÍGITOS):</span>
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #FAF5FF; border: 1px solid #E9D5FF; padding: 6px 10px; border-radius: 8px;">
                    <span style="font-family: 'JetBrains Mono', monospace; color: #7E22CE; font-weight: 800; font-size: 12px; letter-spacing: 0.5px; white-space: nowrap;">${bankInfoData.clabe || '012 320 001122334455 6'}</span>
                    <button type="button" onclick="copyBankText('${bankInfoData.clabe || '0123200011223344556'}', 'CLABE', '${instKey}')" style="background: #7E22CE; color: #FFF; border: none; padding: 4px 8px; border-radius: 6px; font-size: 9.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;">
                      📋 Copiar
                    </button>
                  </div>
                </div>
              </div>

              <div style="background: #FFFFFF; border: 1.5px dashed #C084FC; border-radius: 12px; padding: 12px; text-align: center; margin-bottom: 10px; transition: all 0.2s ease;">
                <label for="receiptInput_${instKey}" style="cursor: pointer; display: block;">
                  <i data-lucide="${state.receiptImage ? 'check-circle' : 'upload-cloud'}" style="width: 22px; height: 22px; color: ${state.receiptImage ? '#16A34A' : '#9333EA'}; margin-bottom: 2px;"></i>
                  <div style="font-size: 11.5px; font-weight: 800; color: ${state.receiptImage ? '#15803D' : '#6B21A8'};">
                    ${state.receiptImage ? '✅ Comprobante Seleccionado' : '📸 Cargar Comprobante de Pago'}
                  </div>
                  <small style="font-size: 9.5px; color: #64748B; display: block; margin-top: 2px;">Haz clic para seleccionar foto o captura de pantalla</small>
                </label>
                <input type="file" id="receiptInput_${instKey}" accept="image/*,.pdf" style="display: none;" onchange="handleReceiptFileSelect(event, '${instKey}')">
              </div>

              ${state.receiptImage ? `
                <div style="text-align: center; margin-bottom: 10px;">
                  <img src="${state.receiptImage}" style="max-height: 85px; border-radius: 10px; border: 2px solid #A855F7; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                </div>
              ` : ''}

              <input type="text" id="refCodeInput_${instKey}" value="${state.referenceCode || ''}" oninput="instanceStates['${instKey}'].referenceCode=this.value;" placeholder="Número de Referencia SPEI (Opcional)" style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1.5px solid #E9D5FF; color: #0F172A; padding: 9px 12px; border-radius: 10px; font-size: 11px; font-weight: 600; outline: none;">
            </div>
          ` : ''}
        </div>

        <h5 style="font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Horarios Disponibles para ${formattedDate}:</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 16px;">
          ${getSlotsArray(liveCourt.slots).filter(s => {
    const h = parseInt(s.split(':')[0], 10);
    return h >= 8 && h <= 23;
  }).map(slot => {
    const booking = getSlotBookingForDate(liveCourt.id, slot, selectedDate);
    const isBlocked = liveCourt.slotStatuses && liveCourt.slotStatuses[slot] === 'blocked';
    const isSelected = state.selectedSlot === slot;

    if (booking) {
      const clientName = booking.clientName ? fixMojibake(booking.clientName) : 'OCUPADO';
      const isClass = booking.isClass || booking.bookingType === 'clase' || clientName.includes('🎓');

      if (isClass) {
        return `
                  <div style="background: #F3E8FF; color: #7E22CE; border: 1px solid #D8B4FE; padding: 6px 8px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 700; cursor: not-allowed; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                    <div><i data-lucide="award" style="width: 11px; height: 11px; color: #7E22CE;"></i> ${slot} (CLASE)</div>
                    <small style="font-size: 9px; color: #6B21A8; font-weight: 700;">${clientName}</small>
                  </div>
                `;
      }

      return `
                <div style="background: rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid #FCA5A5; padding: 6px 8px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 700; cursor: not-allowed; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                  <div><i data-lucide="slash" style="width: 11px; height: 11px;"></i> ${slot} (OCUPADO)</div>
                  <small style="font-size: 9px; opacity: 0.85; font-weight: 600;">${clientName}</small>
                </div>
              `;
    } else if (isBlocked) {
      return `
                <div style="background: #F1F5F9; color: #94A3B8; border: 1px solid #E2E8F0; padding: 8px; border-radius: 8px; text-align: center; font-size: 11px; cursor: not-allowed; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <i data-lucide="lock" style="width: 11px; height: 11px;"></i> ${slot} (Bloqueado)
                </div>
              `;
    } else {
      return `
                <div onclick="instanceStates['${instKey}'].selectedSlot='${slot}'; renderAllInstances();" style="background: ${isSelected ? '#10B981' : '#F8FAFC'}; color: ${isSelected ? '#FFF' : '#0F172A'}; border: 1.5px solid ${isSelected ? '#10B981' : '#E2E8F0'}; padding: 8px; border-radius: 8px; text-align: center; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <i data-lucide="clock" style="width: 11px; height: 11px;"></i> ${slot} ${isSelected ? '✓' : ''}
                </div>
              `;
    }
  }).join('')}
        </div>

        <!-- Terms Notice Card -->
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 10px 12px; margin-top: 12px; font-size: 11px; color: #475569; border-left: 4px solid #0284C7;">
          <div style="font-weight: 800; color: #0F172A; margin-bottom: 3px; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 5px;"><i data-lucide="shield-alert" style="width: 14px; height: 14px; color: #0284C7;"></i> Políticas & Términos de Reserva</span>
            <button onclick="openTermsModal('${instKey}')" style="background: transparent; border: none; color: #0284C7; font-size: 11px; font-weight: 800; cursor: pointer; text-decoration: underline; padding: 0;">Ver Reglamento</button>
          </div>
          <span>Al reservar aceptas acudir puntualmente. En caso de inasistencia (no-show) o cancelación fuera de tiempo (mín. 24h), te comprometes a saldar el adeudo ($300.00 MXN/h) en recepción.</span>
        </div>
      </div>

      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: #FFF; border-top: 1px solid #E2E8F0; padding: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 20;">
        <div>
          <div style="font-size: 10px; color: #64748B; font-weight: 700; text-transform: uppercase;">Total a Pagar:</div>
          <div style="font-size: 18px; font-weight: 800; color: #10B981;">$ ${liveCourt.price * durationHours} MXN</div>
        </div>
        <button onclick="processReserveApi('${liveCourt.id}', '${instKey}')" style="background: ${state.selectedSlot ? '#10B981' : '#94A3B8'}; color: #FFF; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; box-shadow: ${state.selectedSlot ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'}; display: inline-flex; align-items: center; gap: 4px;">
          <span>${state.selectedSlot ? 'Confirmar Reserva' : 'Elige Horario'}</span>
          ${state.selectedSlot ? '<i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>' : ''}
        </button>
      </div>
    </div>
  `;
}

function openCourtDetail(id, instKey) {
  const state = instanceStates[instKey];
  if (state.activeTab && state.activeTab !== 'canchas') {
    state.lastSportTab = state.activeTab;
  } else {
    const targetCourt = courtsData.find(c => c.id === id);
    if (targetCourt && targetCourt.sport === 'futbol') {
      state.lastSportTab = 'futbol_reserva';
    } else {
      state.lastSportTab = 'padel_reserva';
    }
  }
  state.selectedCourt = courtsData.find(c => c.id === id);
  state.bookingStep = 'calendar';
  state.selectedDate = state.selectedDate || '2026-09-05';
  state.selectedSlot = null;
  state.durationHours = 1;
  renderAllInstances();
}

async function processReserveApi(courtId, instKey) {
  const state = instanceStates[instKey];
  if (!state.selectedSlot) return;

  const user = state.loggedInUser || {};
  const clientName = instKey === 'phoneA' ? 'Juan (Celular 1)' : (instKey === 'phoneB' ? 'Carlos (Celular 2)' : (user.name || 'Carlos'));
  const clientPhone = user.phone || '459 102 3849';

  // Client-side check for any unpaid bookings for this user
  const cleanPhone = clientPhone.replace(/\D/g, '');
  const cleanName = clientName.toLowerCase().trim();

  const unpaidBooking = (allBookingsData || []).find(b => {
    const isPaid = b.paid === true || b.paid === 'true' || b.paid === 'True' || b.paid == 1 || b.status === 'Pagado' || b.attendance === 'Asistió & Pagado';
    if (isPaid) return false;

    const bPhone = (b.clientPhone || '').replace(/\D/g, '');
    const bName = (b.clientName || '').toLowerCase().trim();

    return (cleanPhone && bPhone && bPhone === cleanPhone) ||
      (cleanName && bName && bName === cleanName);
  });

  if (unpaidBooking) {
    const unpaidAmt = unpaidBooking.price ? `$${unpaidBooking.price}.00 MXN` : 'un saldo pendiente';
    showAppAlert(instKey, 'Pago Pendiente ⚠️', `Tienes una reservación anterior con pago pendiente (${unpaidAmt}). Por favor acude a recepción o comunícate con el administrador para liquidar tu adeudo antes de poder reservar de nuevo.`, 'warning', 'Entendido');
    return;
  }

  try {
    const chosenPayMethod = (state.receiptImage || (state.referenceCode && state.referenceCode.trim() !== '')) 
      ? 'Transferencia Bancaria' 
      : (state.paymentMethod || 'Efectivo en Mostrador');

    const res = await fetch('api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        courtId: courtId,
        timeSlot: state.selectedSlot,
        clientName: clientName,
        clientPhone: clientPhone,
        paymentMethod: chosenPayMethod,
        selectedDate: state.selectedDate || '2026-09-05',
        durationHours: state.durationHours || 1,
        receiptImage: state.receiptImage || '',
        referenceCode: state.referenceCode || ''
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      userBookings.unshift(data.booking);
      state.selectedSlot = null;
      state.selectedCourt = null;
      state.receiptImage = null;
      state.referenceCode = '';
      state.bookingStep = 'calendar';
      if (state.lastSportTab) {
        state.activeTab = state.lastSportTab;
      }

      const dateTxt = formatSelectedDateText(state.selectedDate || '2026-09-05');
      showAppAlert(instKey, '¡Reserva Exitosa!', `Se confirmó tu reserva en Level Tacámbaro para el ${dateTxt} a las ${data.booking.timeSlot}.`, 'success', '¡A Jugar!');
      fetchCourtsData();
      fetchBookingsData();
    } else {
      if (data.blocked) {
        showAppAlert(instKey, 'Reserva Bloqueada ⚠️', data.message || 'Tienes una reservación anterior con pago pendiente. Por favor liquida tu adeudo con el administrador para poder reservar.', 'error', 'Entendido');
      } else {
        showAppAlert(instKey, 'Horario No Disponible', data.message || 'Este horario acaba de ser ocupado por otro jugador.', 'warning', 'Entendido');
      }
      fetchCourtsData();
      fetchBookingsData();
    }
  } catch (err) {
    /* silent error */
    showAppAlert(instKey, 'Error de Conexión', 'Ocurrió un error al procesar tu reserva.', 'error');
  }
}

async function handleCancelBooking(bookingId, instKey = 'mobile') {
  if (!bookingId) return;
  try {
    const res = await fetch('api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ bookingId })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      userBookings = userBookings.filter(b => b.id !== bookingId);
      showAppAlert(instKey, '¡Reserva Cancelada! 🗑️', data.message || `Tu reserva ${bookingId} ha sido cancelada exitosamente y el horario se ha liberado.`, 'success', 'Entendido');
      fetchBookingsData();
      fetchCourtsData();
    } else {
      showAppAlert(instKey, 'No se pudo cancelar ⚠️', data.message || 'No fue posible cancelar la reserva.', 'error', 'Entendido');
    }
  } catch (e) {
    showAppAlert(instKey, 'Error de Conexión', 'No se pudo conectar con el servidor para cancelar.', 'error', 'Entendido');
  }
}

function renderMyBookingsView(state, instKey) {
  const user = state.loggedInUser || {};
  const userName = (user.name || 'Carlos Palacios').toLowerCase().trim();
  const userPhone = (user.phone || '459 102 3849').replace(/\D/g, '');

  const combinedBookings = [...(userBookings || []), ...(allBookingsData || [])];
  const uniqueMap = new Map();
  combinedBookings.forEach(b => {
    if (b && b.id && !uniqueMap.has(b.id)) {
      uniqueMap.set(b.id, b);
    }
  });

  const list = Array.from(uniqueMap.values()).filter(b => {
    const bName = (b.clientName || '').toLowerCase().trim();
    const bPhone = (b.clientPhone || '').replace(/\D/g, '');
    return (userPhone && bPhone && bPhone === userPhone) ||
      (userName && bName && (bName.includes(userName) || userName.includes(bName)));
  });

  const currentDate = new Date();

  return `
    <div style="padding: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; gap: 8px;">
            <div>
              <h2 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: #0F172A; margin: 0;">Mis Reservaciones</h2>
              <p style="font-size: 11.5px; color: #64748B; margin: 2px 0 0 0;">Historial y política de cancelación (mínimo 24h antes)</p>
            </div>
            <button onclick="selectTabFromDrawer('canchas', '${instKey}')" style="background: #F1F5F9; color: #0F172A; border: 1px solid #CBD5E1; border-radius: 10px; padding: 6px 12px; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0;">
              <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Volver
            </button>
          </div>

          ${list.length === 0 ? `
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 30px 20px; text-align: center; margin-top: 10px;">
              <div style="width: 50px; height: 50px; border-radius: 16px; background: #F1F5F9; color: #64748B; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
                <i data-lucide="ticket" style="width: 26px; height: 26px;"></i>
              </div>
              <h4 style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #1E293B; margin: 0 0 6px 0;">Sin Reservas Registradas</h4>
              <p style="font-size: 13px; color: #64748B; margin: 0 0 16px 0;">No tienes reservaciones registradas en este momento.</p>
              <button class="btn-brand-primary" style="padding: 10px 20px; font-size: 13px; border-radius: 12px;" onclick="selectTabFromDrawer('canchas', '${instKey}')">
                <i data-lucide="calendar" style="width: 16px; height: 16px;"></i> Reservar Una Cancha
              </button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 14px;">
                    ${list.map(b => {
                      const courtName = fixMojibake(b.courtName || 'Cancha de Pádel Level');
                      const dateStr = b.date ? b.date.substring(0, Math.min(10, b.date.length)) : '2026-09-05';
                      const timeSlot = b.timeSlot || '08:00 (1 hora)';
                      const paid = b.paid === true || b.paid === 'true' || b.paid === 'True' || b.paid == 1 || b.status === 'Pagado' || b.attendance === 'Asistió & Pagado';

                      const isPendingVerification = b.status === 'Pendiente de Verificación';
                      const isRejected = b.status === 'Pago Rechazado';

                      let badgeText = paid ? '✓ Pagado' : (isPendingVerification ? '⏳ Por Verificar' : (isRejected ? '❌ Pago Rechazado' : '⏱️ Pago Pendiente'));
                      let badgeColor = paid ? '#059669' : (isPendingVerification ? '#7E22CE' : (isRejected ? '#DC2626' : '#D97706'));
                      let badgeBg = paid ? '#ECFDF5' : (isPendingVerification ? '#F3E8FF' : (isRejected ? '#FEF2F2' : '#FEF3C7'));

                      let startHour = 0;
                      const match = (timeSlot).match(/(\d{1,2}):(\d{2})/);
                      if (match) startHour = parseInt(match[1], 10);

                      let bookingDateObj = new Date();
                      try {
                        const parts = dateStr.split('-');
                        if (parts.length === 3) {
                          bookingDateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), startHour, 0, 0);
                        }
                      } catch (e) { }

                      const diffMs = bookingDateObj.getTime() - currentDate.getTime();
                      const hoursRemaining = diffMs / (1000 * 60 * 60);

                      const canCancel = hoursRemaining >= 24;
                      const isPast = hoursRemaining <= 0;

                      return `
                        <div style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                              <span style="font-size: 11px; font-weight: 800; color: #059669; background: #ECFDF5; padding: 3px 8px; border-radius: 6px; font-family: 'JetBrains Mono', monospace;">${b.id}</span>
                              <h3 style="font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 800; color: #0F172A; margin: 6px 0 0 0;">${courtName}</h3>
                            </div>
                            <span style="font-size: 11px; font-weight: 700; color: ${badgeColor}; background: ${badgeBg}; padding: 4px 10px; border-radius: 8px;">
                              ${badgeText}
                            </span>
                          </div>

                          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #F8FAFC; padding: 10px; border-radius: 10px; margin-bottom: 12px; font-size: 12px;">
                            <div>
                              <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Fecha & Horario</div>
                              <div style="font-weight: 700; color: #1E293B;">${dateStr} | ${timeSlot}</div>
                            </div>
                            <div>
                              <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Monto & Pago</div>
                              <div style="font-weight: 700; color: #059669;">$${b.price || 300}.00 MXN (${b.paymentMethod || 'Efectivo en Mostrador'})</div>
                            </div>
                          </div>

                          ${isPendingVerification ? `
                            <div style="background: #F3E8FF; border: 1px solid #D8B4FE; border-radius: 10px; padding: 8px 10px; font-size: 11px; color: #6B21A8; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                              <i data-lucide="clock" style="width: 14px; height: 14px; color: #7E22CE;"></i>
                              <span>Comprobante recibido. El administrador está validando tu transferencia.</span>
                            </div>
                          ` : ''}

                          ${isRejected ? `
                            <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 10px; padding: 10px; font-size: 11px; color: #991B1B; margin-bottom: 10px;">
                              <div style="font-weight: 800; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                                <i data-lucide="alert-octagon" style="width: 14px; height: 14px; color: #DC2626;"></i> Comprobante Rechazado
                              </div>
                              <div style="margin-bottom: 8px; line-height: 1.4;">${b.rejectionReason || 'El comprobante no coincide con la transferencia esperada.'}</div>
                              <div style="display: flex; gap: 6px;">
                                <label for="reuploadInput_${b.id}_${instKey}" style="background: #DC2626; color: #FFF; border: none; padding: 6px 12px; border-radius: 8px; font-size: 10.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                                  <i data-lucide="upload" style="width: 12px; height: 12px;"></i> Subir Nuevo Comprobante
                                </label>
                                <input type="file" id="reuploadInput_${b.id}_${instKey}" accept="image/*,.pdf" style="display: none;" onchange="handleReuploadReceipt(event, '${b.id}', '${instKey}')">
                              </div>
                            </div>
                          ` : ''}

                          <div style="display: flex; align-items: center; justify-content: space-between;">
                            ${canCancel ? `
                              <button onclick="handleCancelBooking('${b.id}', '${instKey}')" style="background: #EF4444; color: #FFFFFF; border: none; border-radius: 10px; padding: 8px 14px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.2s;">
                                <i data-lucide="x-circle" style="width: 14px; height: 14px;"></i> Cancelar Reservación
                              </button>
                            ` : (isPast ? `
                              <div style="font-size: 11px; color: #64748B; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                                <i data-lucide="check-circle" style="width: 14px; height: 14px; color: #10B981;"></i> Reserva Concluida
                              </div>
                            ` : `
                              <div style="font-size: 11px; color: #DC2626; font-weight: 700; background: #FEF2F2; padding: 6px 12px; border-radius: 8px; width: 100%; display: flex; align-items: center; gap: 6px;">
                                <i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> Cancelación no disponible (Menos de 24 horas restantes)
                              </div>
                            `)}
                          </div>
                        </div>
                      `;
                    }).join('')}
        </div>
      `}
    </div>
  `;
}

function copyBankText(text, label, instKey) {
  try {
    navigator.clipboard.writeText(text);
    showAppAlert(instKey || 'single', '¡Copiado!', `${label} copiado al portapapeles.`, 'success', 'Entendido');
  } catch(e) {}
}

function handleReceiptFileSelect(event, instKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    instanceStates[instKey].receiptImage = e.target.result;
    instanceStates[instKey].paymentMethod = 'Transferencia Bancaria';
    renderAllInstances();
  };
  reader.readAsDataURL(file);
}

async function handleReuploadReceipt(event, bookingId, instKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Img = e.target.result;
    try {
      const res = await fetch('api/reupload-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ bookingId: bookingId, receiptImage: base64Img })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showAppAlert(instKey, 'Comprobante Re-enviado', 'Se ha actualizado tu comprobante. El administrador lo verificará a la brevedad.', 'success', 'Entendido');
        fetchBookingsData();
      } else {
        showAppAlert(instKey, 'Error', 'No se pudo actualizar el comprobante. Intenta nuevamente.', 'error', 'Reintentar');
      }
    } catch(err) {
      showAppAlert(instKey, 'Error de Conexión', 'No se pudo conectar con el servidor.', 'error', 'Entendido');
    }
  };
  reader.readAsDataURL(file);
}

function switchPanelTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  if (tab === 'structure') {
    document.querySelector('.tab-buttons button:nth-child(1)').classList.add('active');
    document.getElementById('tab-structure').classList.add('active');
  } else {
    document.querySelector('.tab-buttons button:nth-child(2)').classList.add('active');
    document.getElementById('tab-code').classList.add('active');
  }
}

function loadCodeSnippet(key) {
  switchPanelTab('code');
  document.getElementById('codeViewerContent').textContent = codeSnippets[key] || '// Código';
}

function hotReloadApp() {
  fetchCourtsData();
}
