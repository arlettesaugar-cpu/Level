import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/court.dart';
import '../models/tournament.dart';
import '../models/booking.dart';

class AppState extends ChangeNotifier {
  AppUser? _currentUser;
  List<Court> _courts = List.from(Court.mockCourts);
  List<Tournament> _tournaments = List.from(Tournament.mockTournaments);
  List<Booking> _bookings = List.from(Booking.mockBookings);
  List<AppUser> _allUsers = List.from(AppUser.initialUsers);

  // Bank Info for SPEI / BBVA
  final Map<String, String> bankInfo = {
    'bankName': 'BBVA México',
    'accountHolder': 'Level Centro Deportivo S.A. de C.V.',
    'clabe': '012 320 001122334455 6',
    'cardNumber': '4152 3138 9012 3456',
    'instructions': 'Al realizar tu transferencia, ingresa tu Nombre y el Folio de reserva como concepto.',
  };

  AppUser? get currentUser => _currentUser;
  List<Court> get courts => _courts;
  List<Tournament> get tournaments => _tournaments;
  List<Booking> get bookings => _bookings;
  bool get isLoggedIn => _currentUser != null;

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

  // Debt Limitation Check
  bool get hasDebt => _currentUser?.hasDebt == true;
  double get debtAmount => _currentUser?.debtAmount ?? 0.0;
  String get debtReason => _currentUser?.debtReason ?? '';

  // Booking Creation
  Map<String, dynamic> createBooking({
    required Court court,
    required DateTime date,
    required String slot,
    required String paymentMethod,
  }) {
    if (hasDebt) {
      return {
        'success': false,
        'message': 'Tienes un saldo pendiente de \$$debtAmount MXN por inasistencia. Debes liquidar en recepción antes de agendar nuevas reservas.',
      };
    }

    // Check if slot is already booked
    if (court.slotStatuses[slot] == 'booked') {
      return {
        'success': false,
        'message': 'El horario $slot ya ha sido reservado por otro usuario.',
      };
    }

    final newId = 'RES-${1000 + _bookings.length + 1}';
    final newBooking = Booking(
      id: newId,
      courtId: court.id,
      courtName: court.name,
      courtLocation: court.location,
      imagePath: court.imagePath,
      date: date,
      timeSlot: '$slot (1 hora)',
      totalPrice: court.pricePerHour,
      paymentMethod: paymentMethod,
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-$newId',
      clientName: _currentUser?.name ?? 'Cliente',
      clientPhone: _currentUser?.phone ?? '459 102 3849',
      paid: paymentMethod == 'Transferencia BBVA / SPEI',
    );

    // Update court slot status
    final courtIndex = _courts.indexWhere((c) => c.id == court.id);
    if (courtIndex != -1) {
      final updatedStatuses = Map<String, String>.from(_courts[courtIndex].slotStatuses);
      updatedStatuses[slot] = 'booked';
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

  // 24-Hour Cancellation Policy
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

    // Cancel booking and free slot
    _bookings[bookingIndex] = Booking(
      id: booking.id,
      courtId: booking.courtId,
      courtName: booking.courtName,
      courtLocation: booking.courtLocation,
      imagePath: booking.imagePath,
      date: booking.date,
      timeSlot: booking.timeSlot,
      totalPrice: booking.totalPrice,
      paymentMethod: booking.paymentMethod,
      status: BookingStatus.cancelled,
      qrCode: booking.qrCode,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      paid: booking.paid,
    );

    // Free the slot in the court
    final slot = booking.timeSlot.split(' ').first;
    final courtIndex = _courts.indexWhere((c) => c.id == booking.courtId);
    if (courtIndex != -1) {
      final updatedStatuses = Map<String, String>.from(_courts[courtIndex].slotStatuses);
      updatedStatuses.remove(slot);
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
      maxTeams: tourn.maxTeams,
      status: tourn.status,
      teams: updatedTeams,
    );

    notifyListeners();
    return {'success': true, 'message': '¡Inscripción exitosa para "$teamName"!'};
  }
}
