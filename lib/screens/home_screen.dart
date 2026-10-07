import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/court.dart';
import '../services/app_state.dart';
import '../widgets/court_card.dart';
import '../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  final Function(Court) onSelectCourt;
  const HomeScreen({Key? key, required this.onSelectCourt}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String selectedCategory = 'Todas';
  String searchQuery = '';
  final List<String> categories = ['Todas', 'Pádel Cristal Pro', 'Pádel Panorámica VIP', 'Fútbol 7 Profesional'];

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
                          hintText: 'Buscar cancha (Azul, Negra, Fútbol)...',
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
                          'Tacámbaro • Horarios de 1h',
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
