class Court {
  final String id;
  final String name;
  final String category; // 'Pádel Cristal Pro', 'Pádel Panorámica VIP'
  final String location;
  final double pricePerHour; // En Pesos Mexicanos (MXN)
  final double rating;
  final int reviewsCount;
  final String imagePath;
  final List<String> features; // ['Cristal Templado 12mm', 'Césped Sintético Azul', 'Iluminación LED 400W', 'Alquiler de Palas']
  final List<String> availableSlots;
  final String dimensions; // '10m x 20m (Reglamentaria FIP)'
  final String surfaceType; // 'Césped Sintético de Pádel Monofilamento'

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
    required this.dimensions,
    required this.surfaceType,
  });

  static List<Court> get mockCourts => [
    Court(
      id: 'c1',
      name: 'Cancha 1: Pádel Cristal Pro (Azul)',
      category: 'Pádel Cristal Pro',
      location: 'Tacámbaro, Michoacán',
      pricePerHour: 350.0,
      rating: 4.9,
      reviewsCount: 156,
      imagePath: 'assets/images/cancha_padel_1.jpg',
      features: ['Cristal Templado 12mm', 'Césped Sintético Azul Pro', 'Iluminación LED 400W', 'Alquiler de Palas'],
      availableSlots: [
        '07:00 - 08:30',
        '08:30 - 10:00',
        '16:00 - 17:30',
        '17:30 - 19:00',
        '19:00 - 20:30',
        '20:30 - 22:00'
      ],
      dimensions: '10m x 20m (Oficial FIP)',
      surfaceType: 'Césped Sintético Monofilamento Azul WPT',
    ),
    Court(
      id: 'c2',
      name: 'Cancha 2: Pádel Panorámica VIP (Verde)',
      category: 'Pádel Panorámica VIP',
      location: 'Tacámbaro, Michoacán',
      pricePerHour: 380.0,
      rating: 4.8,
      reviewsCount: 112,
      imagePath: 'assets/images/cancha_padel_2.jpg',
      features: ['Vista Panorámica Sin Postes', 'Césped Sintético Verde', 'Iluminación LED Pro', 'Zona Lounge'],
      availableSlots: [
        '07:30 - 09:00',
        '09:00 - 10:30',
        '16:30 - 18:00',
        '18:00 - 19:30',
        '19:30 - 21:00',
        '21:00 - 22:30'
      ],
      dimensions: '10m x 20m (Oficial FIP)',
      surfaceType: 'Césped Sintético Texturizado Verde Pro',
    ),
  ];
}
