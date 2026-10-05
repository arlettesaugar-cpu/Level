import 'package:flutter/material.dart';
import '../models/court.dart';
import '../widgets/court_card.dart';
import '../theme/app_theme.dart';
import 'court_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  final Function(Court) onSelectCourt;
  const HomeScreen({Key? key, required this.onSelectCourt}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String selectedCategory = 'Todas';
  String searchQuery = '';
  final List<String> categories = ['Todas', 'Pádel Cristal Pro', 'Pádel Panorámica VIP'];

  @override
  Widget build(BuildContext context) {
    final filteredCourts = Court.mockCourts.where((court) {
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
                              'Hola, Padelero 👋',
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
                            color: AppTheme.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.notifications_none_rounded,
                            color: AppTheme.primaryDark,
                            size: 24,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

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
                          hintText: 'Buscar cancha por nombre o distrito...',
                          border: InputBorder.none,
                          icon: Icon(Icons.search_rounded, color: AppTheme.textSecondary),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Category Pill Bar
                    SizedBox(
                      height: 38,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: categories.length,
                        itemBuilder: (context, index) {
                          final cat = categories[index];
                          final isSelected = selectedCategory == cat;
                          return Container(
                            margin: const EdgeInsets.only(right: 10),
                            child: FilterChip(
                              label: Text(cat),
                              selected: isSelected,
                              selectedColor: AppTheme.primary,
                              backgroundColor: Colors.white,
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppTheme.textPrimary,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                fontSize: 13,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                                side: BorderSide(
                                  color: isSelected ? AppTheme.primary : Colors.grey.shade300,
                                ),
                              ),
                              onSelected: (val) {
                                setState(() => selectedCategory = cat);
                              },
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Canchas Disponibles Hoy',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Court Cards List
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: filteredCourts.isEmpty
                  ? SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: Center(
                          child: Column(
                            children: [
                              Icon(Icons.sports_tennis_rounded, size: 60, color: Colors.grey.shade400),
                              const SizedBox(height: 10),
                              Text(
                                'No se encontraron canchas',
                                style: TextStyle(color: Colors.grey.shade600, fontSize: 16),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  : SliverList(
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
