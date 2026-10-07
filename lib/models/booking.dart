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

  factory Booking.fromJson(Map<String, dynamic> json) {
    DateTime parsedDate = DateTime.now();
    if (json['date'] != null) {
      try {
        parsedDate = DateTime.parse(json['date'].toString());
      } catch (_) {}
    }
    BookingStatus bStatus = BookingStatus.confirmed;
    final statusStr = json['status']?.toString().toLowerCase() ?? '';
    if (statusStr.contains('cancel')) {
      bStatus = BookingStatus.cancelled;
    } else if (statusStr.contains('pend')) {
      bStatus = BookingStatus.pending;
    } else if (statusStr.contains('complet') || statusStr.contains('asisti')) {
      bStatus = BookingStatus.completed;
    }

    List<String> bSlots = [];
    if (json['bookedSlots'] is List) {
      bSlots = List<String>.from(json['bookedSlots'].map((e) => e.toString()));
    }

    return Booking(
      id: json['id']?.toString() ?? '',
      courtId: json['courtId']?.toString() ?? 'c1',
      courtName: json['courtName']?.toString() ?? 'Cancha 1: Padel Cristal Pro (Azul)',
      courtLocation: json['location']?.toString() ?? 'Tacambaro, Michoacan',
      imagePath: json['imagePath']?.toString() ?? json['image']?.toString() ?? 'assets/images/cancha_padel_1.jpg',
      date: parsedDate,
      timeSlot: json['timeSlot']?.toString() ?? '',
      bookedSlots: bSlots,
      durationHours: json['durationHours'] != null ? (json['durationHours'] as num).toDouble() : 1.0,
      totalPrice: json['price'] != null
          ? (json['price'] as num).toDouble()
          : ((json['totalPrice'] != null) ? (json['totalPrice'] as num).toDouble() : 300.0),
      paymentMethod: json['paymentMethod']?.toString() ?? 'Efectivo en Mostrador',
      status: bStatus,
      qrCode: json['qrCode']?.toString() ?? 'LEVEL-PADEL-${json['id']}',
      clientName: json['clientName']?.toString() ?? 'Cliente',
      clientPhone: json['clientPhone']?.toString() ?? '',
      paid: json['paid'] == true || json['paid'] == 'true',
    );
  }

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
