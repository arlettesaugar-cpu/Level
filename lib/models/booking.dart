enum BookingStatus { confirmed, pending, completed, cancelled }

class Booking {
  final String id;
  final String courtId;
  final String courtName;
  final String courtLocation;
  final String imagePath;
  final DateTime date;
  final String timeSlot;
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
    required this.totalPrice,
    required this.paymentMethod,
    required this.status,
    required this.qrCode,
    this.clientName = 'Cliente',
    this.clientPhone = '459 102 3849',
    this.paid = false,
  });

  static List<Booking> mockBookings = [
    Booking(
      id: 'RES-1001',
      courtId: 'c1',
      courtName: 'Cancha 2: Azul (Pádel Cristal Pro)',
      courtLocation: 'Tacámbaro, Michoacán',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      date: DateTime.now().add(const Duration(days: 1)),
      timeSlot: '08:00 (1 hora)',
      totalPrice: 300.0,
      paymentMethod: 'Efectivo en Mostrador',
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-PADEL-RES-1001',
      clientName: 'Carlos Palacios',
      clientPhone: '459 1116 18 80',
      paid: true,
    ),
  ];
}
