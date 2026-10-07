class Court {
  final String id;
  final String name;
  final String category; // 'Pádel Cristal Pro', 'Pádel Panorámica VIP', 'Fútbol 7 Profesional'
  final String location;
  final double pricePerHour; // En Pesos Mexicanos (MXN)
  final double rating;
  final int reviewsCount;
  final String imagePath;
  final List<String> features;
  final List<String> availableSlots;
  final Map<String, String> slotStatuses; // e.g. {'13:00': 'booked'}
  final String dimensions;
  final String surfaceType;

  Court({
    required this.id,
    required this.name,
    required this.category,
    required this.location,
    required this.pricePerHour,
    required this.rating,
    required this.reviewsCount,
    required this.imagePath,
    required this.features,
    required this.availableSlots,
    this.slotStatuses = const {},
    required this.dimensions,
    required this.surfaceType,
  });

  static const List<String> standardSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  static List<Court> get mockCourts => [
    Court(
      id: 'c1',
      name: 'Cancha 2: Azul',
      category: 'Pádel Cristal Pro',
      location: 'Tacámbaro, Michoacán',
      pricePerHour: 300.0,
      rating: 4.9,
      reviewsCount: 156,
      imagePath: 'assets/images/cancha_padel_1.jpg',
      features: ['Cristal Templado 12mm', 'Césped Sintético Azul Pro', 'Iluminación LED Nocturna', 'Alquiler de Palas'],
      availableSlots: standardSlots,
      slotStatuses: {
        '13:00': 'booked',
        '19:00': 'booked',
        '20:00': 'booked',
      },
      dimensions: '10m x 20m (Oficial FIP)',
      surfaceType: 'Césped Sintético Monofilamento Azul WPT',
    ),
    Court(
      id: 'c2',
      name: 'Cancha 1: Negra',
      category: 'Pádel Panorámica VIP',
      location: 'Tacámbaro, Michoacán',
      pricePerHour: 300.0,
      rating: 4.8,
      reviewsCount: 112,
      imagePath: 'assets/images/cancha_padel_2.jpg',
      features: ['Vista Panorámica Sin Postes', 'Césped Sintético Texturizado', 'Iluminación LED Pro', 'Zona Lounge'],
      availableSlots: standardSlots,
      slotStatuses: {
        '18:00': 'booked',
        '21:00': 'booked',
      },
      dimensions: '10m x 20m (Oficial FIP)',
      surfaceType: 'Césped Sintético Texturizado VIP',
    ),
    Court(
      id: 'c3',
      name: 'Cancha fútbol',
      category: 'Fútbol 7 Profesional',
      location: 'Tacámbaro, Michoacán',
      pricePerHour: 450.0,
      rating: 4.9,
      reviewsCount: 89,
      imagePath: 'assets/images/cancha_sintetica_5.jpg',
      features: ['Pasto Sintético FIFA Quality', 'Porterías Reglamentarias', 'Alumbrado LED Alto Poder', 'Balones Oficiales'],
      availableSlots: standardSlots,
      slotStatuses: {
        '19:00': 'booked',
        '20:00': 'booked',
      },
      dimensions: '50m x 30m (Fútbol 7)',
      surfaceType: 'Césped Sintético de 50mm con Caucho',
    ),
  ];
}
