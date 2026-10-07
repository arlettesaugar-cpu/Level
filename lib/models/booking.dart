enum BookingStatus { confirmed, pending, completed, cancelled }

class Booking {
  final String id;
  final String courtId;
  final String courtName;
  final String courtLocation;
  final String imagePath;
  final DateTime date;
  final String timeSlot;
  final List<String> bookedSlots; // All consecutive hours locked (e.g. ['16:00', '17:00'])
  final double durationHours;
  final double totalPrice;
  final String paymentMethod; // 'Efectivo en Mostrador', 'Transferencia BBVA / SPEI'
  final BookingStatus status;
  final String qrCode;
  final String clientName;
  final String clientPhone;
  final bool paid;

  Booking({
    required this.id,
    required this.courtId,
    required this.courtName,
    required this.courtLocation,
    required this.imagePath,
    required this.date,
    required this.timeSlot,
    this.bookedSlots = const [],
    this.durationHours = 1.0,
    required this.totalPrice,
    required this.paymentMethod,
    required this.status,
    required this.qrCode,
    this.clientName = 'Cliente',
    this.clientPhone = '459 102 3849',
    this.paid = false,
  });

  static List<Booking> get initialBookings => [
    Booking(
      id: 'RES-5611',
      courtId: 'c1',
      courtName: 'Cancha 1: Padel Cristal Pro (Azul)',
      courtLocation: 'Tacambaro, Michoacan',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      date: DateTime.now().add(const Duration(days: 1)),
      timeSlot: '17:00 (1 hrs)',
      bookedSlots: ['17:00'],
      durationHours: 1.0,
      totalPrice: 300.0,
      paymentMethod: 'Efectivo en Mostrador',
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-PADEL-RES-5611',
      clientName: 'Administrador 2',
      clientPhone: '4591161880',
      paid: false,
    ),
    Booking(
      id: 'RES-6263',
      courtId: 'c1',
      courtName: 'Cancha 1: Padel Cristal Pro (Azul)',
      courtLocation: 'Tacambaro, Michoacan',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      date: DateTime.now().add(const Duration(days: 1)),
      timeSlot: '19:00 - 21:00 (2 hrs)',
      bookedSlots: ['19:00', '20:00'],
      durationHours: 2.0,
      totalPrice: 600.0,
      paymentMethod: 'Efectivo en Mostrador',
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-PADEL-RES-6263',
      clientName: 'Administrador Level Tacambaro',
      clientPhone: '459 000 1122',
      paid: false,
    ),
    Booking(
      id: 'RES-8188',
      courtId: 'c1',
      courtName: 'Cancha 1: Padel Cristal Pro (Azul)',
      courtLocation: 'Tacambaro, Michoacan',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      date: DateTime.now(),
      timeSlot: '12:00 (1 hrs)',
      bookedSlots: ['12:00'],
      durationHours: 1.0,
      totalPrice: 300.0,
      paymentMethod: 'Efectivo en Mostrador',
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-PADEL-RES-8188',
      clientName: 'Administrador 2',
      clientPhone: '4591161880',
      paid: true,
    ),
  ];
}
