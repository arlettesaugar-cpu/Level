import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/court.dart';
import '../models/tournament.dart';
import '../models/booking.dart';

class AppState extends ChangeNotifier {
  AppUser? _currentUser;
  List<Court> _courts = List.from(Court.mockCourts);
  List<Tournament> _tournaments = List.from(Tournament.mockTournaments);
  List<Booking> _bookings = List.from(Booking.initialBookings);
  List<AppUser> _allUsers = List.from(AppUser.initialUsers);

  // Live Stream URL (Transmisión en vivo configurable)
  String liveStreamUrl = 'https://www.youtube.com/@levelpadeltacambaro';

  // Bank Info from data/bank_info.json (CLEAN: without street address or physical references)
  final Map<String, String> bankInfo = {
    'bankName': 'BBVA México',
    'accountHolder': 'Level Centro Deportivo',
    'clabe': '012 320 00112233456',
    'cardNumber': '4152 3138 9012 1234',
    'instructions': 'Al realizar tu transferencia o depósito, ingresa tu Nombre y el Folio de tu reserva como concepto de pago.',
  };

  // History & Philosophy from data/history.json
  final Map<String, dynamic> historyData = {
    'name': 'Level',
    'locationPill': 'Tacambaro, Michoacan Mexico',
    'title': 'QUIENES SOMOS & FILOSOFIA',
    'description':
        'Level Tacambaro nacio con la vision de consolidar el primer centro deportivo de padel de alto nivel en Tacambaro, Michoacan. Nuestro club cuenta con 2 pistas de tecnologia profesional (Padel Cristal Pro y Panoramica VIP), iluminacion LED nocturna de alta definicion, area de espectadores, servicio de pro shop con alquiler de palas y pelotas.',
    'gallery': [
      {
        'title': 'Pista 2: Padel Panoramica',
        'url': 'assets/images/cancha_padel_2.jpg',
      },
      {
        'title': 'images (1)',
        'url': 'assets/images/cancha_padel_1.jpg',
      },
    ],
  };

  AppState() {
    // Default to Administrador 2 for direct instant testing
    _currentUser = _allUsers.firstWhere(
      (u) => u.username == 'admin2',
      orElse: () => _allUsers.first,
    );
  }

  AppUser? get currentUser => _currentUser;
  List<Court> get courts => _courts;
  List<Tournament> get tournaments => _tournaments;
  List<Booking> get bookings => _bookings;
  bool get isLoggedIn => _currentUser != null;

  void setLiveStreamUrl(String url) {
    liveStreamUrl = url;
    notifyListeners();
  }

  // Login
  Map<String, dynamic> login(String userInput, String password) {
    final cleanInput = userInput.trim().toLowerCase().replaceAll(RegExp(r'\s+'), '').replaceAll(RegExp(r'^@'), '');
    final cleanPhone = userInput.replaceAll(RegExp(r'\D'), '');

    final user = _allUsers.firstWhere(
      (u) =>
          u.username.toLowerCase() == cleanInput ||
          (cleanPhone.isNotEmpty && u.phone.replaceAll(RegExp(r'\D'), '') == cleanPhone),
      orElse: () => AppUser(id: '', username: '', name: '', phone: '', role: '', password: ''),
    );

    if (user.id.isEmpty) {
      return {'success': false, 'message': 'Usuario o teléfono no encontrado.'};
    }

    final pInput = password.trim();
    final matchPass = (user.password.isNotEmpty && user.password == pInput);
    final matchTemp = (user.tempPassword.isNotEmpty && user.tempPassword.toLowerCase() == pInput.toLowerCase());

    if (matchPass || matchTemp) {
      _currentUser = user;
      notifyListeners();
      return {'success': true, 'user': user};
    } else {
      return {'success': false, 'message': 'Contraseña incorrecta. Por favor verifica tus credenciales.'};
    }
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }

  bool get hasDebt => _currentUser?.hasDebt == true;
  double get debtAmount => _currentUser?.debtAmount ?? 0.0;
  String get debtReason => _currentUser?.debtReason ?? '';

  // Multi-Hour Booking: records and locks ALL chosen consecutive slots
  Map<String, dynamic> createBooking({
    required Court court,
    required DateTime date,
    required List<String> slots, // Multi-slot list: e.g. ['16:00', '17:00']
    required String paymentMethod,
  }) {
    if (hasDebt) {
      return {
        'success': false,
        'message': 'Tienes un saldo pendiente de \$$debtAmount MXN por inasistencia. Debes liquidar en recepción antes de agendar nuevas reservas.',
      };
    }

    if (slots.isEmpty) {
      return {'success': false, 'message': 'Por favor selecciona al menos un horario.'};
    }

    // Verify NONE of the selected slots is already booked
    for (final slot in slots) {
      if (court.slotStatuses[slot] == 'booked') {
        return {
          'success': false,
          'message': 'El horario $slot ya está ocupado. Elige otro horario continuo.',
        };
      }
    }

    final durationHours = slots.length.toDouble();
    final totalPrice = court.pricePerHour * durationHours;
    final timeSlotLabel = slots.length == 1
        ? '${slots.first} (1 hrs)'
        : '${slots.first} - ${_calculateEndTime(slots.last)} (${slots.length} hrs)';

    final newId = 'RES-${1000 + _bookings.length + 1}';
    final newBooking = Booking(
      id: newId,
      courtId: court.id,
      courtName: court.name,
      courtLocation: court.location,
      imagePath: court.imagePath,
      date: date,
      timeSlot: timeSlotLabel,
      bookedSlots: List.from(slots),
      durationHours: durationHours,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-$newId',
      clientName: _currentUser?.name ?? 'Cliente',
      clientPhone: _currentUser?.phone ?? '4591161880',
      paid: paymentMethod.contains('BBVA') || paymentMethod.contains('SPEI'),
    );

    // Update court slot statuses: lock ALL slots in the list
    final courtIndex = _courts.indexWhere((c) => c.id == court.id);
    if (courtIndex != -1) {
      final updatedStatuses = Map<String, String>.from(_courts[courtIndex].slotStatuses);
      for (final slot in slots) {
        updatedStatuses[slot] = 'booked';
      }

      _courts[courtIndex] = Court(
        id: court.id,
        name: court.name,
        category: court.category,
        location: court.location,
        pricePerHour: court.pricePerHour,
        rating: court.rating,
        reviewsCount: court.reviewsCount,
        imagePath: court.imagePath,
        features: court.features,
        availableSlots: court.availableSlots,
        slotStatuses: updatedStatuses,
        dimensions: court.dimensions,
        surfaceType: court.surfaceType,
      );
    }

    _bookings.insert(0, newBooking);
    notifyListeners();
    return {'success': true, 'booking': newBooking};
  }

  String _calculateEndTime(String startSlot) {
    try {
      final hour = int.parse(startSlot.split(':').first);
      final endHour = (hour + 1).toString().padLeft(2, '0');
      return '$endHour:00';
    } catch (_) {
      return startSlot;
    }
  }

  // Cancel Booking (Frees ALL consecutive booked slots)
  Map<String, dynamic> cancelBooking(String bookingId) {
    final bookingIndex = _bookings.indexWhere((b) => b.id == bookingId);
    if (bookingIndex == -1) {
      return {'success': false, 'message': 'Reserva no encontrada.'};
    }

    final booking = _bookings[bookingIndex];
    final now = DateTime.now();
    final difference = booking.date.difference(now);

    if (difference.inHours < 24 && booking.date.isAfter(now)) {
      return {
        'success': false,
        'message': 'Política de Cancelación: Las cancelaciones sin costo requieren mínimo 24 horas de anticipación. Con menos de 24 horas se mantendrá el cobro del turno.',
      };
    }

    _bookings[bookingIndex] = Booking(
      id: booking.id,
      courtId: booking.courtId,
      courtName: booking.courtName,
      courtLocation: booking.courtLocation,
      imagePath: booking.imagePath,
      date: booking.date,
      timeSlot: booking.timeSlot,
      bookedSlots: booking.bookedSlots,
      durationHours: booking.durationHours,
      totalPrice: booking.totalPrice,
      paymentMethod: booking.paymentMethod,
      status: BookingStatus.cancelled,
      qrCode: booking.qrCode,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      paid: booking.paid,
    );

    // Free ALL slots associated with this reservation
    final courtIndex = _courts.indexWhere((c) => c.id == booking.courtId);
    if (courtIndex != -1) {
      final updatedStatuses = Map<String, String>.from(_courts[courtIndex].slotStatuses);
      for (final s in booking.bookedSlots) {
        updatedStatuses.remove(s);
      }
      // Also fallback to parsing timeSlot if bookedSlots was empty
      if (booking.bookedSlots.isEmpty) {
        final slot = booking.timeSlot.split(' ').first;
        updatedStatuses.remove(slot);
      }

      final c = _courts[courtIndex];
      _courts[courtIndex] = Court(
        id: c.id,
        name: c.name,
        category: c.category,
        location: c.location,
        pricePerHour: c.pricePerHour,
        rating: c.rating,
        reviewsCount: c.reviewsCount,
        imagePath: c.imagePath,
        features: c.features,
        availableSlots: c.availableSlots,
        slotStatuses: updatedStatuses,
        dimensions: c.dimensions,
        surfaceType: c.surfaceType,
      );
    }

    notifyListeners();
    return {'success': true, 'message': 'Tu reservación ha sido cancelada correctamente.'};
  }

  // Tournament Registration
  Map<String, dynamic> registerTournament({
    required String tournamentId,
    required String teamName,
    required String participants,
  }) {
    final tIndex = _tournaments.indexWhere((t) => t.id == tournamentId);
    if (tIndex == -1) {
      return {'success': false, 'message': 'Torneo no encontrado.'};
    }

    final tourn = _tournaments[tIndex];
    if (tourn.teams.length >= tourn.maxTeams) {
      return {'success': false, 'message': 'Este torneo ya ha alcanzado el cupo máximo.'};
    }

    final newTeam = TournamentTeam(
      id: 'REG-${100 + tourn.teams.length + 1}',
      teamName: teamName,
      participants: participants,
      registeredAt: DateTime.now().toString().substring(0, 16),
    );

    final updatedTeams = List<TournamentTeam>.from(tourn.teams)..add(newTeam);
    _tournaments[tIndex] = Tournament(
      id: tourn.id,
      title: tourn.title,
      category: tourn.category,
      dates: tourn.dates,
      prize: tourn.prize,
      sport: tourn.sport,
      imageUrl: tourn.imageUrl,
      maxTeams: tourn.maxTeams,
      status: tourn.status,
      teams: updatedTeams,
    );

    notifyListeners();
    return {'success': true, 'message': '¡Inscripción exitosa para "$teamName"!'};
  }

  void setLiveStreamUrl(String newUrl) {
    liveStreamUrl = newUrl;
    notifyListeners();
  }
}
