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
  final String paymentMethod; // 'Yape/Plin', 'Tarjeta de Crédito/Débito', 'Efectivo en Cancha'
  final BookingStatus status;
  final String qrCode;

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
  });

  static List<Booking> mockBookings = [
    Booking(
      id: 'RES-8921',
      courtId: 'c1',
      courtName: 'Cancha 1: Pádel Cristal Pro (Azul)',
      courtLocation: 'Tacámbaro, Michoacán',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      date: DateTime.now().add(const Duration(days: 1)),
      timeSlot: '19:00 - 20:30',
      totalPrice: 350.0,
      paymentMethod: 'Transferencia SPEI / QR',
      status: BookingStatus.confirmed,
      qrCode: 'LEVEL-PADEL-RES-8921-VERIFIED',
    ),
  ];
}
