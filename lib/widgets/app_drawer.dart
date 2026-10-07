import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class AppDrawer extends StatefulWidget {
  final int selectedIndex;
  final Function(int) onSelectTab;

  const AppDrawer({
    Key? key,
    required this.selectedIndex,
    required this.onSelectTab,
  }) : super(key: key);

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  bool _padelExpanded = true;

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final user = appState.currentUser;
    final userName = user?.name ?? 'Carlos Palacios';
    final userRole = user?.role ?? 'Cliente';
    final userPhone = user?.phone ?? '459 102 3849';

    return Drawer(
      backgroundColor: Colors.white,
      child: SafeArea(
        child: Column(
          children: [
            // Brand Header: {LEVEL} CENTRO DEPORTIVO
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: const BoxDecoration(
                color: Color(0xFF0F172A),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          'assets/images/logo.jpeg',
                          width: 34,
                          height: 34,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            width: 34,
                            height: 34,
                            color: const Color(0xFF10B981),
                            child: const Icon(Icons.sports_tennis, color: Colors.white, size: 20),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          RichText(
                            text: const TextSpan(
                              text: '{',
                              style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 16),
                              children: [
                                TextSpan(
                                  text: 'LEVEL',
                                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                                ),
                                TextSpan(
                                  text: '}',
                                  style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                          const Text(
                            'CENTRO DEPORTIVO',
                            style: TextStyle(
                              color: Color(0xFF84CC16),
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70, size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            // Real User Profile Card
            Container(
              margin: const EdgeInsets.all(14),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFF0284C7).withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person, color: Color(0xFF0284C7), size: 24),
                      ),
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: appState.hasDebt ? Colors.redAccent : const Color(0xFF10B981),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userName,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Color(0xFF0F172A),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(
                              appState.hasDebt ? Icons.warning_amber_rounded : Icons.verified_user,
                              size: 13,
                              color: appState.hasDebt ? Colors.orange : const Color(0xFF10B981),
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                appState.hasDebt ? 'Adeudo pendiente' : '$userRole • $userPhone',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: appState.hasDebt ? Colors.redAccent : const Color(0xFF64748B),
                                  fontWeight: FontWeight.w600,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Navigation Menu
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                children: [
                  // 1. Quiénes Somos
                  _buildBrandItem(
                    icon: Icons.auto_stories_rounded,
                    iconColor: const Color(0xFF0284C7),
                    title: 'Quiénes Somos',
                    subtitle: 'Conoce nuestro club',
                    isSelected: widget.selectedIndex == 0,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onSelectTab(0);
                    },
                  ),

                  // 2. Pádel (Expandible con Reserva y Torneos)
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withOpacity(0.12),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.sports_tennis_rounded, color: Color(0xFF10B981), size: 20),
                          ),
                          title: const Text(
                            'Pádel',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                          ),
                          subtitle: const Text(
                            'Reserva tu cancha & Torneos',
                            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                          trailing: Icon(
                            _padelExpanded ? Icons.keyboard_arrow_down : Icons.keyboard_arrow_right,
                            color: const Color(0xFF64748B),
                          ),
                          onTap: () => setState(() => _padelExpanded = !_padelExpanded),
                        ),
                        if (_padelExpanded) ...[
                          const Divider(height: 1, color: Color(0xFFE2E8F0)),
                          _buildSubItem(
                            icon: Icons.calendar_month_rounded,
                            title: 'Reserva tu cancha',
                            isSelected: widget.selectedIndex == 1,
                            onTap: () {
                              Navigator.pop(context);
                              widget.onSelectTab(1);
                            },
                          ),
                          _buildSubItem(
                            icon: Icons.emoji_events_rounded,
                            title: 'Torneos de Pádel',
                            isSelected: widget.selectedIndex == 2,
                            onTap: () {
                              Navigator.pop(context);
                              widget.onSelectTab(2);
                            },
                          ),
                        ],
                      ],
                    ),
                  ),

                  // 3. Fútbol
                  _buildBrandItem(
                    icon: Icons.sports_soccer_rounded,
                    iconColor: const Color(0xFF059669),
                    title: 'Fútbol',
                    subtitle: 'Cancha sintética de Fútbol 7',
                    isSelected: false,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onSelectTab(1); // Abre canchas
                    },
                  ),

                  // 4. Gimnasio
                  _buildBrandItem(
                    icon: Icons.fitness_center_rounded,
                    iconColor: const Color(0xFFD97706),
                    title: 'Gimnasio',
                    subtitle: 'Área de pesas y acondicionamiento',
                    isSelected: false,
                    onTap: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('🏋️ Área de Gimnasio abierta de 6:00 AM a 10:00 PM.')),
                      );
                    },
                  ),

                  // 5. Alimentos y Bebidas (Productos / Pro Shop)
                  _buildBrandItem(
                    icon: Icons.restaurant_rounded,
                    iconColor: const Color(0xFFDC2626),
                    title: 'Alimentos y Bebidas',
                    subtitle: 'Cafetería, hidratación y tienda',
                    isSelected: widget.selectedIndex == 3,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onSelectTab(3);
                    },
                  ),

                  // 6. Contáctanos
                  _buildBrandItem(
                    icon: Icons.call_rounded,
                    iconColor: const Color(0xFF25D366),
                    title: 'Contáctanos',
                    subtitle: 'Tacámbaro, Michoacán • WhatsApp',
                    isSelected: widget.selectedIndex == 4,
                    onTap: () {
                      Navigator.pop(context);
                      widget.onSelectTab(4);
                    },
                  ),
                ],
              ),
            ),

            // Logout Button
            const Divider(color: Color(0xFFE2E8F0)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              child: ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                leading: const Icon(Icons.logout_rounded, color: Colors.redAccent),
                title: const Text(
                  'Cerrar Sesión',
                  style: TextStyle(fontWeight: FontWeight.bold, color: Colors.redAccent, fontSize: 14),
                ),
                onTap: () {
                  Navigator.pop(context);
                  appState.logout();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBrandItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 3),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFF0F172A).withOpacity(0.06) : Colors.transparent,
        borderRadius: BorderRadius.circular(14),
        border: isSelected ? Border.all(color: const Color(0xFF0284C7), width: 1.5) : null,
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
            fontSize: 14,
            color: const Color(0xFF0F172A),
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
        ),
        trailing: const Icon(Icons.chevron_right, size: 18, color: Color(0xFF94A3B8)),
        onTap: onTap,
      ),
    );
  }

  Widget _buildSubItem({
    required IconData icon,
    required String title,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Container(
      color: isSelected ? const Color(0xFF10B981).withOpacity(0.1) : Colors.transparent,
      child: ListTile(
        dense: true,
        contentPadding: const EdgeInsets.only(left: 36, right: 16),
        leading: Icon(icon, size: 18, color: isSelected ? const Color(0xFF10B981) : const Color(0xFF64748B)),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? const Color(0xFF10B981) : const Color(0xFF0F172A),
          ),
        ),
        onTap: onTap,
      ),
    );
  }
}
