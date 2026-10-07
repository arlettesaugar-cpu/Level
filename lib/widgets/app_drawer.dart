import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';

class AppDrawer extends StatefulWidget {
  final int selectedIndex;
  final Function(int tabIndex, {String? subCategory, String? sport}) onSelectTab;

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
  bool _futbolExpanded = false;
  bool _formerExpanded = false;

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final user = appState.currentUser;
    final userName = user?.name ?? 'Administrador 2';
    final userHandle = user?.username ?? 'admin2';
    final userPhone = user?.phone ?? '4591161880';

    return Drawer(
      backgroundColor: Colors.transparent,
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF0E382E), // Dark emerald green
              Color(0xFF114A57), // Teal
              Color(0xFF143B5C), // Ocean blue
              Color(0xFF0F1E2E), // Deep navy
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // 1. Top White Header with {LEVEL} CENTRO DEPORTIVO & Close Button
              Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(width: 36), // Balance close button
                    // Brand Logo
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        RichText(
                          text: const TextSpan(
                            text: '{',
                            style: TextStyle(
                              color: Color(0xFFE11D48), // Red bracket
                              fontWeight: FontWeight.w900,
                              fontSize: 22,
                              letterSpacing: 1,
                            ),
                            children: [
                              TextSpan(
                                text: 'LEVEL',
                                style: TextStyle(
                                  color: Color(0xFF0F172A), // Black text
                                  fontWeight: FontWeight.w900,
                                  fontSize: 22,
                                  letterSpacing: 2,
                                ),
                              ),
                              TextSpan(
                                text: '}',
                                style: TextStyle(
                                  color: Color(0xFF0284C7), // Blue bracket
                                  fontWeight: FontWeight.w900,
                                  fontSize: 22,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 1),
                        const Text(
                          'CENTRO DEPORTIVO',
                          style: TextStyle(
                            color: Color(0xFF65A30D), // Lime green
                            fontSize: 9,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2.0,
                          ),
                        ),
                      ],
                    ),
                    // Circular Close Button
                    InkWell(
                      onTap: () => Navigator.pop(context),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.close, color: Color(0xFF0F172A), size: 18),
                      ),
                    ),
                  ],
                ),
              ),

              // 2. Scrollable Body
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  children: [
                    // User Profile Card
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF142B30).withOpacity(0.95),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF234B4F), width: 1.2),
                      ),
                      child: Row(
                        children: [
                          Stack(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFF34D399), width: 2),
                                  color: const Color(0xFF064E3B),
                                ),
                                child: const Icon(Icons.person, color: Color(0xFF6EE7B7), size: 24),
                              ),
                              Positioned(
                                right: 0,
                                bottom: 0,
                                child: Container(
                                  width: 11,
                                  height: 11,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: const Color(0xFF142B30), width: 2),
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
                                    color: Colors.white,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 3),
                                Row(
                                  children: [
                                    const Icon(Icons.check_circle, size: 13, color: Color(0xFF10B981)),
                                    const SizedBox(width: 4),
                                    Expanded(
                                      child: Text(
                                        '@$userHandle • $userPhone',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: Color(0xFFA7F3D0),
                                          fontWeight: FontWeight.w500,
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
                    const SizedBox(height: 12),

                    // Item 1: Quiénes Somos
                    _buildMenuItem(
                      backgroundColor: const Color(0xFF183B40),
                      icon: Icons.menu_book_rounded,
                      iconBgColor: const Color(0xFF0F5A63),
                      iconColor: const Color(0xFF38BDF8),
                      title: 'Quiénes Somos',
                      subtitle: 'Conoce nuestro club',
                      trailing: const Icon(Icons.chevron_right, color: Colors.white70, size: 18),
                      onTap: () {
                        Navigator.pop(context);
                        widget.onSelectTab(0);
                      },
                    ),
                    const SizedBox(height: 8),

                    // Item 2: Pádel (Expandible)
                    _buildExpandableGroup(
                      backgroundColor: const Color(0xFF279667),
                      icon: Icons.monitor_heart_outlined,
                      iconBgColor: const Color(0xFF1A6B48),
                      iconColor: Colors.white,
                      title: 'Pádel',
                      subtitle: 'Reserva tu cancha & Torneos',
                      isExpanded: _padelExpanded,
                      onToggle: () => setState(() => _padelExpanded = !_padelExpanded),
                      children: [
                        _buildSubMenuItem(
                          icon: Icons.calendar_month_outlined,
                          title: 'Reserva tu cancha',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(1, sport: 'padel');
                          },
                        ),
                        _buildSubMenuItem(
                          icon: Icons.emoji_events_outlined,
                          title: 'Torneos de Pádel',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(2, sport: 'padel');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Item 3: Fútbol (Expandible)
                    _buildExpandableGroup(
                      backgroundColor: const Color(0xFF163E4B),
                      icon: Icons.sports_soccer_rounded,
                      iconBgColor: const Color(0xFF112D38),
                      iconColor: const Color(0xFFFBBF24), // Yellow soccer icon
                      title: 'Fútbol',
                      subtitle: 'Reserva tu cancha & Torneos',
                      isExpanded: _futbolExpanded,
                      onToggle: () => setState(() => _futbolExpanded = !_futbolExpanded),
                      children: [
                        _buildSubMenuItem(
                          icon: Icons.calendar_month_outlined,
                          title: 'Reserva tu cancha',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(1, sport: 'futbol');
                          },
                        ),
                        _buildSubMenuItem(
                          icon: Icons.emoji_events_outlined,
                          title: 'Torneos de Fútbol',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(2, sport: 'futbol');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Item 4: Former (Expandible)
                    _buildExpandableGroup(
                      backgroundColor: const Color(0xFF1C2A44),
                      icon: Icons.local_fire_department_rounded,
                      iconBgColor: const Color(0xFF273859),
                      iconColor: const Color(0xFFA78BFA), // Lavender flame
                      title: 'Former',
                      subtitle: 'Reservas & Productos',
                      isExpanded: _formerExpanded,
                      onToggle: () => setState(() => _formerExpanded = !_formerExpanded),
                      children: [
                        _buildSubMenuItem(
                          icon: Icons.shopping_bag_outlined,
                          title: 'Productos Former',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(3, subCategory: 'Former');
                          },
                        ),
                        _buildSubMenuItem(
                          icon: Icons.fitness_center_rounded,
                          title: 'Entrenamiento Funcional',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(3, subCategory: 'Entrenamiento Funcional');
                          },
                        ),
                        _buildSubMenuItem(
                          icon: Icons.sports_gymnastics_rounded,
                          title: 'Bungee Fitness',
                          onTap: () {
                            Navigator.pop(context);
                            widget.onSelectTab(3, subCategory: 'Bungee Fitness');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Item 5: Productos General
                    _buildMenuItem(
                      backgroundColor: const Color(0xFF2E9B6C),
                      icon: Icons.shopping_bag_outlined,
                      iconBgColor: const Color(0xFF207551),
                      iconColor: Colors.white,
                      title: 'Productos General',
                      subtitle: 'Tienda Oficial Pro Shop',
                      trailing: const Icon(Icons.chevron_right, color: Colors.white70, size: 18),
                      onTap: () {
                        Navigator.pop(context);
                        widget.onSelectTab(3, subCategory: 'General');
                      },
                    ),
                    const SizedBox(height: 8),

                    // Item 6: Contáctanos
                    _buildMenuItem(
                      backgroundColor: const Color(0xFF14293D),
                      icon: Icons.call_rounded,
                      iconBgColor: const Color(0xFF104432),
                      iconColor: const Color(0xFF22C55E),
                      title: 'Contáctanos',
                      subtitle: 'Ubicación & WhatsApp',
                      trailing: const Icon(Icons.chevron_right, color: Colors.white70, size: 18),
                      onTap: () {
                        Navigator.pop(context);
                        widget.onSelectTab(4);
                      },
                    ),
                    const SizedBox(height: 16),

                    // Item 7: Cerrar Sesión
                    InkWell(
                      onTap: () {
                        Navigator.pop(context);
                        appState.logout();
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2D171C),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFF5A1F28), width: 1.2),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.logout_rounded, color: Color(0xFFF87171), size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Cerrar Sesión',
                              style: TextStyle(
                                color: Color(0xFFF87171),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required Color backgroundColor,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String title,
    required String subtitle,
    required Widget trailing,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(9),
              decoration: BoxDecoration(
                color: iconBgColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            trailing,
          ],
        ),
      ),
    );
  }

  Widget _buildExpandableGroup({
    required Color backgroundColor,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool isExpanded,
    required VoidCallback onToggle,
    required List<Widget> children,
  }) {
    return Column(
      children: [
        InkWell(
          onTap: onToggle,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.12),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                  color: Colors.white70,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
        if (isExpanded)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Column(
              children: children,
            ),
          ),
      ],
    );
  }

  Widget _buildSubMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
          decoration: BoxDecoration(
            color: const Color(0xFF153F4C).withOpacity(0.85),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.12), width: 1),
          ),
          child: Row(
            children: [
              Icon(icon, color: const Color(0xFF6EE7B7), size: 17),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
