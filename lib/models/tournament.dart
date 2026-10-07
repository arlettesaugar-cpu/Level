class TournamentTeam {
  final String id;
  final String teamName;
  final String participants;
  final String registeredAt;

  TournamentTeam({
    required this.id,
    required this.teamName,
    required this.participants,
    required this.registeredAt,
  });

  factory TournamentTeam.fromJson(Map<String, dynamic> json) {
    return TournamentTeam(
      id: json['id'] ?? '',
      teamName: json['teamName'] ?? '',
      participants: json['participants'] ?? '',
      registeredAt: json['registeredAt'] ?? '',
    );
  }
}

class Tournament {
  final String id;
  final String title;
  final String category;
  final String dates;
  final String prize;
  final String sport; // 'padel' or 'futbol'
  final String imageUrl;
  final int maxTeams;
  final String status;
  final List<TournamentTeam> teams;

  Tournament({
    required this.id,
    required this.title,
    required this.category,
    required this.dates,
    required this.prize,
    this.sport = 'padel',
    this.imageUrl = 'assets/images/cancha_padel_2.jpg',
    required this.maxTeams,
    required this.status,
    required this.teams,
  });

  factory Tournament.fromJson(Map<String, dynamic> json) {
    List<TournamentTeam> tms = [];
    if (json['teams'] is List) {
      for (var item in json['teams']) {
        if (item is Map<String, dynamic>) {
          tms.add(TournamentTeam.fromJson(item));
        } else if (item is Map) {
          tms.add(TournamentTeam.fromJson(Map<String, dynamic>.from(item)));
        }
      }
    }
    return Tournament(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? 'Libre',
      dates: json['dates']?.toString() ?? 'Próximamente',
      prize: json['prize']?.toString() ?? '\$0 MXN',
      sport: json['sport']?.toString() ?? 'padel',
      imageUrl: json['imageUrl']?.toString() ?? 'assets/images/cancha_padel_2.jpg',
      maxTeams: json['maxTeams'] != null ? (json['maxTeams'] as num).toInt() : 16,
      status: json['status']?.toString() ?? 'Inscripciones Abiertas',
      teams: tms,
    );
  }

  int get registeredCount => teams.length;

  static List<Tournament> get mockTournaments => [
    Tournament(
      id: 'TOURN-101',
      title: '1er Torneo Abierto Tacambaro Padel 2026',
      category: '2a Categoria Libre',
      dates: '15 - 18 Octubre, 2026',
      prize: '\$15,000 MXN',
      sport: 'padel',
      imageUrl: 'assets/images/cancha_padel_2.jpg',
      maxTeams: 16,
      status: 'Inscripciones Abiertas',
      teams: [
        TournamentTeam(
          id: 'REG-101',
          teamName: 'Los Ases de Tacambaro',
          participants: 'Carlos Palacios y Juan Perez',
          registeredAt: '2026-09-05 10:15',
        ),
        TournamentTeam(
          id: 'REG-102',
          teamName: 'Padel Volea VIP',
          participants: 'Sofia Valdes y Maria Silva',
          registeredAt: '2026-09-05 11:30',
        ),
        TournamentTeam(
          id: 'REG-736',
          teamName: 'Prueba',
          participants: 'Arlette',
          registeredAt: '2026-09-15 09:04',
        ),
      ],
    ),
    Tournament(
      id: 'TOURN-102',
      title: 'Copa Level Futbol 7 Tacambaro',
      category: 'Categoria Libre Varonil / Femenil',
      dates: '20 - 24 Octubre, 2026',
      prize: '\$20,000 MXN',
      sport: 'futbol',
      imageUrl: 'assets/images/cancha_grama_7.jpg',
      maxTeams: 12,
      status: 'Inscripciones Abiertas',
      teams: [
        TournamentTeam(
          id: 'REG-501',
          teamName: 'Galacticos Tacambaro',
          participants: 'Equipo Completo 7v7',
          registeredAt: '2026-09-10 18:00',
        ),
      ],
    ),
    Tournament(
      id: 'TOURN-695',
      title: 'Torneo Relampago Nocturno',
      category: '3a Categoria & Mixto',
      dates: '01 - 03 Noviembre, 2026',
      prize: '\$10,000 MXN',
      sport: 'padel',
      imageUrl: 'assets/images/cancha_padel_1.jpg',
      maxTeams: 16,
      status: 'Inscripciones Abiertas',
      teams: [
        TournamentTeam(
          id: 'REG-830',
          teamName: 'Prueba Relampago',
          participants: 'Equipo 1',
          registeredAt: '2026-09-19 18:42',
        ),
      ],
    ),
  ];
}
