import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tournament.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class TournamentsScreen extends StatefulWidget {
  final String? initialSport;

  const TournamentsScreen({
    Key? key,
    this.initialSport,
  }) : super(key: key);

  @override
  State<TournamentsScreen> createState() => _TournamentsScreenState();
}

class _TournamentsScreenState extends State<TournamentsScreen> {
  late String selectedSport;

  @override
  void initState() {
    super.initState();
    selectedSport = widget.initialSport ?? 'padel';
  }

  @override
  void didUpdateWidget(covariant TournamentsScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialSport != null && widget.initialSport != oldWidget.initialSport) {
      setState(() => selectedSport = widget.initialSport!);
    }
  }

  void _showRegisterModal(BuildContext context, Tournament tournament) {
    final teamController = TextEditingController();
    final participantsController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.emoji_events_rounded, color: Color(0xFF10B981)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Inscripción: ${tournament.title}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Categoría: ${tournament.category}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
              Text('Premio: ${tournament.prize}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
              const SizedBox(height: 14),
              TextField(
                controller: teamController,
                decoration: InputDecoration(
                  labelText: 'Nombre del Equipo / Pareja',
                  hintText: 'ej. Los Ases de Tacámbaro',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: participantsController,
                decoration: InputDecoration(
                  labelText: 'Nombres de los 2 Jugadores',
                  hintText: 'ej. Carlos Palacios y Juan Pérez',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              final teamName = teamController.text.trim();
              final participants = participantsController.text.trim();
              if (teamName.isEmpty || participants.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Por favor completa todos los campos.')),
                );
                return;
              }

              final appState = Provider.of<AppState>(context, listen: false);
              final res = appState.registerTournament(
                tournamentId: tournament.id,
                teamName: teamName,
                participants: participants,
              );

              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(res['message'] ?? 'Registro completado.'),
                  backgroundColor: res['success'] ? const Color(0xFF10B981) : Colors.redAccent,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Confirmar Inscripción', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final tournaments = appState.tournaments.where((t) {
      if (selectedSport == 'todos') return true;
      return t.sport.toLowerCase() == selectedSport.toLowerCase();
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(selectedSport == 'futbol' ? 'Torneos de Fútbol ⚽' : 'Torneos de Pádel 🏆'),
      ),
      body: Column(
        children: [
          // Sport selector tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Center(child: Text('🎾 Torneos de Pádel')),
                    selected: selectedSport == 'padel',
                    onSelected: (val) => setState(() => selectedSport = 'padel'),
                    selectedColor: const Color(0xFF10B981),
                    labelStyle: TextStyle(
                      color: selectedSport == 'padel' ? Colors.white : const Color(0xFF0F172A),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    showCheckmark: false,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Center(child: Text('⚽ Torneos de Fútbol')),
                    selected: selectedSport == 'futbol',
                    onSelected: (val) => setState(() => selectedSport = 'futbol'),
                    selectedColor: const Color(0xFF0284C7),
                    labelStyle: TextStyle(
                      color: selectedSport == 'futbol' ? Colors.white : const Color(0xFF0F172A),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    showCheckmark: false,
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: tournaments.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          selectedSport == 'futbol' ? Icons.sports_soccer : Icons.sports_tennis,
                          size: 60,
                          color: Colors.grey.shade400,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'No hay torneos de $selectedSport programados actualmente.',
                          style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: tournaments.length,
                    itemBuilder: (context, index) {
                      final tor = tournaments[index];
                      final isRegistrationOpen = tor.status == 'Inscripciones Abiertas';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.grey.shade200),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF0284C7).withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      tor.category,
                                      style: const TextStyle(
                                        color: Color(0xFF0284C7),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: isRegistrationOpen ? const Color(0xFFD1FAE5) : Colors.amber.shade100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      tor.status,
                                      style: TextStyle(
                                        color: isRegistrationOpen ? const Color(0xFF065F46) : Colors.brown,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                tor.title,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.textSecondary),
                                  const SizedBox(width: 6),
                                  Text(tor.dates, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                                ],
                              ),
                              const SizedBox(height: 12),
                              // Progress Bar for Slots
                              ClipRRect(
                                borderRadius: BorderRadius.circular(6),
                                child: LinearProgressIndicator(
                                  value: tor.registeredCount / tor.maxTeams,
                                  backgroundColor: Colors.grey.shade200,
                                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                                  minHeight: 6,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${tor.registeredCount} de ${tor.maxTeams} Parejas / Equipos',
                                    style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w600),
                                  ),
                                  Text(
                                    'Premio: ${tor.prize}',
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF10B981)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 14),
                              const Divider(height: 1),
                              const SizedBox(height: 12),

                              // Registered Teams Preview
                              if (tor.teams.isNotEmpty) ...[
                                const Text('Equipos Registrados:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                                const SizedBox(height: 6),
                                Wrap(
                                  spacing: 6,
                                  runSpacing: 4,
                                  children: tor.teams.map((team) => Chip(
                                    avatar: const Icon(Icons.people_alt_rounded, size: 14, color: Color(0xFF0284C7)),
                                    label: Text('${team.teamName} (${team.participants})', style: const TextStyle(fontSize: 10)),
                                    backgroundColor: const Color(0xFFF1F5F9),
                                    padding: EdgeInsets.zero,
                                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  )).toList(),
                                ),
                                const SizedBox(height: 12),
                              ],

                              // Action Button
                              SizedBox(
                                width: double.infinity,
                                height: 42,
                                child: ElevatedButton.icon(
                                  onPressed: isRegistrationOpen ? () => _showRegisterModal(context, tor) : null,
                                  icon: const Icon(Icons.person_add_alt_1_rounded, size: 16),
                                  label: Text(
                                    isRegistrationOpen ? 'Inscribirme al Torneo' : 'Próximamente',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF10B981),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
