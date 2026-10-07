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
  final String category; // '2ª Categoría Libre', '3ª Categoría & Mixto'
  final String dates;
  final String prize;
  final int maxTeams;
  final String status; // 'Inscripciones Abiertas', 'Próximamente'
  final List<TournamentTeam> teams;

  Tournament({
    required this.id,
    required this.title,
    required this.category,
    required this.dates,
    required this.prize,
    required this.maxTeams,
    required this.status,
    required this.teams,
  });

  int get registeredCount => teams.length;

  static List<Tournament> get mockTournaments => [
    Tournament(
      id: 'TOURN-101',
      title: '1er Torneo Abierto Tacámbaro 2026',
      category: '2ª Categoría Libre',
      dates: '15 - 18 Octubre, 2026',
      prize: '\$15,000 MXN',
      maxTeams: 16,
      status: 'Inscripciones Abiertas',
      teams: [
        TournamentTeam(
          id: 'REG-101',
          teamName: 'Los Ases de Tacámbaro',
          participants: 'Carlos Palacios y Juan Pérez',
          registeredAt: '2026-09-05 10:15',
        ),
        TournamentTeam(
          id: 'REG-102',
          teamName: 'Pádel Volea VIP',
          participants: 'Sofía Valdés y María Silva',
          registeredAt: '2026-09-05 11:30',
        ),
      ],
    ),
    Tournament(
      id: 'TOURN-102',
      title: 'Copa Level Tacámbaro Pádel Nocturno',
      category: '3ª Categoría & Mixto',
      dates: '01 - 03 Noviembre, 2026',
      prize: '\$8,000 MXN',
      maxTeams: 12,
      status: 'Próximamente',
      teams: [],
    ),
  ];
}
