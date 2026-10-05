class Tournament {
  final String id;
  final String title;
  final String category; // '2ª Categoría', '3ª Categoría', 'Mixto Open'
  final String dates;
  final double prizePool;
  final int registeredTeams;
  final int maxTeams;
  final String status; // 'Inscripciones Abiertas', 'En Disputa', 'Finalizado'

  Tournament({
    required this.id,
    required this.title,
    required this.category,
    required this.dates,
    required this.prizePool,
    required this.registeredTeams,
    required this.maxTeams,
    required this.status,
  });

  static List<Tournament> mockTournaments = [
    Tournament(
      id: 'TOR-01',
      title: '1er Torneo Abierto de Pádel Tacámbaro 2026 🎾',
      category: '2ª Categoría Libre',
      dates: '15 - 18 de Octubre, 2026',
      prizePool: 15000.0,
      registeredTeams: 12,
      maxTeams: 16,
      status: 'Inscripciones Abiertas',
    ),
    Tournament(
      id: 'TOR-02',
      title: 'Copa Level Tacámbaro Pádel Nocturno 🌙',
      category: '3ª Categoría & Mixto',
      dates: '01 - 03 de Noviembre, 2026',
      prizePool: 8000.0,
      registeredTeams: 8,
      maxTeams: 12,
      status: 'Inscripciones Abiertas',
    ),
  ];
}
