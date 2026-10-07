import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'models/court.dart';
import 'services/app_state.dart';
import 'widgets/app_drawer.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/court_detail_screen.dart';
import 'screens/history_screen.dart';
import 'screens/tournaments_screen.dart';
import 'screens/products_screen.dart';
import 'screens/contact_screen.dart';
import 'screens/my_bookings_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const CanchasYaApp(),
    ),
  );
}

class CanchasYaApp extends StatelessWidget {
  const CanchasYaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Level Pádel Tacámbaro',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: Consumer<AppState>(
        builder: (context, appState, _) {
          if (!appState.isLoggedIn) {
            return const LoginScreen();
          }
          return const MainNavigationWrapper();
        },
      ),
    );
  }
}

class MainNavigationWrapper extends StatefulWidget {
  const MainNavigationWrapper({Key? key}) : super(key: key);

  @override
  State<MainNavigationWrapper> createState() => _MainNavigationWrapperState();
}

class _MainNavigationWrapperState extends State<MainNavigationWrapper> {
  int _currentIndex = 1; // Default to Courts / Reservations
  Court? _selectedCourt;

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);

    if (_selectedCourt != null) {
      return CourtDetailScreen(
        court: _selectedCourt!,
        onBack: () => setState(() => _selectedCourt = null),
      );
    }

    final List<Widget> pages = [
      const HistoryScreen(),
      HomeScreen(onSelectCourt: (court) => setState(() => _selectedCourt = court)),
      const TournamentsScreen(),
      const ProductsScreen(),
      const ContactScreen(),
    ];

    final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppTheme.primaryBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.menu_rounded, color: AppTheme.primaryBlue, size: 24),
          ),
          onPressed: () => scaffoldKey.currentState?.openDrawer(),
        ),
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                'assets/images/logo.jpeg',
                width: 32,
                height: 32,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 32,
                  height: 32,
                  color: const Color(0xFF10B981),
                  child: const Icon(Icons.sports_tennis, color: Colors.white, size: 18),
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Text(
                'Level Pádel',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Mis Reservas',
            icon: Stack(
              children: [
                const Icon(Icons.confirmation_number_outlined, color: AppTheme.primaryBlue, size: 24),
                if (appState.bookings.isNotEmpty)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: AppTheme.accentRed,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '${appState.bookings.length}',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const MyBookingsScreen()),
              );
            },
          ),
          IconButton(
            tooltip: 'Mi Perfil',
            icon: const Icon(Icons.account_circle_outlined, color: AppTheme.textDark, size: 24),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfileScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      drawer: AppDrawer(
        selectedIndex: _currentIndex,
        onSelectTab: (index) => setState(() => _currentIndex = index),
      ),
      body: pages[_currentIndex],
    );
  }
}
