import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AppDrawer extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onSelectTab;

  const AppDrawer({
    Key? key,
    required this.selectedIndex,
    required this.onSelectTab,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFF0F172A),
      child: Column(
        children: [
          // Drawer Header with Logo & Tacámbaro Location
          Container(
            padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF1E293B),
                  AppTheme.primary.withOpacity(0.3),
                ],
              ),
              border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: Image.asset(
                    'assets/images/logo.jpeg',
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      width: 60, height: 60, color: AppTheme.primary,
                      child: const Icon(Icons.sports_tennis, color: Colors.white, size: 30),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Level Pádel',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Centro Deportivo',
                        style: TextStyle(
                          color: AppTheme.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // Drawer Navigation Items (5 Modules)
          _buildDrawerItem(
            context,
            index: 0,
            icon: Icons.auto_stories_rounded,
            title: 'Historia',
            subtitle: 'Conoce nuestro club en Tacámbaro',
          ),
          _buildDrawerItem(
            context,
            index: 1,
            icon: Icons.sports_tennis_rounded,
            title: 'Reserva tu cancha',
            subtitle: '2 Canchas Pro en tiempo real',
          ),
          _buildDrawerItem(
            context,
            index: 2,
            icon: Icons.emoji_events_rounded,
            title: 'Torneos',
            subtitle: 'Ligas y Tabla de Posiciones',
          ),
          _buildDrawerItem(
            context,
            index: 3,
            icon: Icons.shopping_bag_rounded,
            title: 'Productos',
            subtitle: 'Palas, Pelotas y Bebidas',
          ),
          _buildDrawerItem(
            context,
            index: 4,
            icon: Icons.location_on_rounded,
            title: 'Contáctanos',
            subtitle: 'Tacámbaro, Michoacán',
          ),

          const Spacer(),
          const Divider(color: Colors.white12),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                const Icon(Icons.shield_outlined, color: AppTheme.primary, size: 16),
                const SizedBox(width: 8),
                Text(
                  'CanchasYa v2.0 • Tacámbaro',
                  style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(
    BuildContext context, {
    required int index,
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    final isSelected = selectedIndex == index;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: isSelected ? Colors.white.withOpacity(0.12) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: isSelected 
          ? Border(left: BorderSide(color: AppTheme.primary, width: 4), top: BorderSide(color: Colors.white24), right: BorderSide(color: Colors.white24), bottom: BorderSide(color: Colors.white24))
          : null,
      ),
      child: ListTile(
        leading: Icon(icon, color: isSelected ? AppTheme.primary : Colors.white70),
        title: Text(
          title,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white70,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            fontSize: 14,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: isSelected ? AppTheme.primary : Colors.white38, fontSize: 11),
        ),
        onTap: () {
          Navigator.pop(context); // Close drawer
          onSelectTab(index);
        },
      ),
    );
  }
}
