import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/court.dart';
import '../services/app_state.dart';
import '../widgets/court_card.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  final Function(Court) onSelectCourt;
  final String? initialCategory;

  const HomeScreen({
    Key? key,
    required this.onSelectCourt,
    this.initialCategory,
  }) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late String selectedCategory;
  String searchQuery = '';
  final List<String> categories = ['Todas', 'Pádel Cristal Pro', 'Pádel Panorámica VIP', 'Fútbol 7 Profesional'];

  @override
  void initState() {
    super.initState();
    selectedCategory = widget.initialCategory ?? 'Todas';
  }

  @override
  void didUpdateWidget(covariant HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialCategory != null && widget.initialCategory != oldWidget.initialCategory) {
      setState(() => selectedCategory = widget.initialCategory!);
    }
  }

  Future<void> _openLiveStream(BuildContext context, String streamUrl) async {
    try {
      final uri = Uri.parse(streamUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return;
      }
    } catch (_) {}

    if (context.mounted) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.live_tv_rounded, color: Colors.redAccent, size: 26),
              SizedBox(width: 8),
              Text('Transmisión en Vivo 🔴', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Sigue los partidos y torneos en vivo a través del enlace oficial:',
                style: TextStyle(fontSize: 13, color: Color(0xFF475569)),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                ),
                child: SelectableText(
                  streamUrl,
                  style: const TextStyle(
                    color: Color(0xFF0284C7),
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'Nota: Este enlace puede configurarse también desde el panel administrativo de la web.',
                style: TextStyle(fontSize: 11, color: Colors.grey, fontStyle: FontStyle.italic),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cerrar'),
            ),
            ElevatedButton.icon(
              onPressed: () async {
                Navigator.pop(ctx);
                try {
                  final uri = Uri.parse(streamUrl);
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                } catch (_) {}
              },
              icon: const Icon(Icons.open_in_new, size: 16),
              label: const Text('Abrir en Plataforma'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEF4444),
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final user = appState.currentUser;
    final userName = user?.name.split(' ').first ?? 'Padelero';

    final filteredCourts = appState.courts.where((court) {
      final matchesCategory = selectedCategory == 'Todas' || court.category == selectedCategory;
      final matchesSearch = court.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
                            court.location.toLowerCase().contains(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Header
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 10),
              sliver: SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hola, $userName 👋',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey.shade600,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const Text(
                              'Reserva tu Cancha 🎾',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryBlue.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.sports_tennis_rounded,
                            color: AppTheme.primaryBlue,
                            size: 24,
                          ),
                        ),
                      ],
                    ),

                    // Debt Alert Banner (If user has pending debt)
                    if (appState.hasDebt) ...[
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF87171)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 24),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Adeudo Pendiente por Inasistencia',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      color: Color(0xFF991B1B),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Tienes un saldo de \$${appState.debtAmount.toStringAsFixed(0)} MXN pendiente. Debes liquidar en mostrador para desbloquear nuevas reservas.',
                                    style: const TextStyle(fontSize: 11, color: Color(0xFFB91C1C), height: 1.3),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 14),

                    // LIVE STREAM CARD (Transmisión en vivo YouTube / Facebook)
                    InkWell(
                      onTap: () => _openLiveStream(context, appState.liveStreamUrl),
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF881337), Color(0xFF0F172A)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(18),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.redAccent.withOpacity(0.2),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.12),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.live_tv_rounded, color: Colors.white, size: 24),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width: 8,
                                        height: 8,
                                        decoration: const BoxDecoration(
                                          color: Color(0xFFEF4444),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      const Text(
                                        'TRANSMISIÓN EN VIVO 🔴',
                                        style: TextStyle(
                                          color: Color(0xFFFCA5A5),
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 1.0,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  const Text(
                                    'Ver Partidos & Torneos en Directo',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  const Text(
                                    'Clic para abrir YouTube / Facebook',
                                    style: TextStyle(color: Colors.white70, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEF4444),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Row(
                                children: [
                                  Text('Ver', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                  SizedBox(width: 4),
                                  Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 10),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Search Input
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.03),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: TextField(
                        onChanged: (val) => setState(() => searchQuery = val),
                        decoration: const InputDecoration(
                          hintText: 'Buscar cancha (Azul, Panorámica, Fútbol)...',
                          border: InputBorder.none,
                          icon: Icon(Icons.search_rounded, color: AppTheme.textSecondary),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Category Pill Filters
                    SizedBox(
                      height: 40,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: categories.length,
                        separatorBuilder: (c, i) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final cat = categories[index];
                          final isSelected = selectedCategory == cat;
                          return ChoiceChip(
                            label: Text(cat),
                            selected: isSelected,
                            onSelected: (val) => setState(() => selectedCategory = cat),
                            selectedColor: AppTheme.primaryBlue,
                            backgroundColor: Colors.white,
                            labelStyle: TextStyle(
                              color: isSelected ? Colors.white : AppTheme.textPrimary,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              fontSize: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                              side: BorderSide(
                                color: isSelected ? AppTheme.primaryBlue : Colors.grey.shade300,
                              ),
                            ),
                            showCheckmark: false,
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Section Title
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Pistas Disponibles (${filteredCourts.length})',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        Text(
                          'Tacámbaro • 08:00 a 23:00 hrs',
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Courts List
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final court = filteredCourts[index];
                    return CourtCard(
                      court: court,
                      onTap: () => widget.onSelectCourt(court),
                    );
                  },
                  childCount: filteredCourts.length,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
