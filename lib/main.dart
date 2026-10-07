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
  String? _selectedCategory;
  String? _selectedSport = 'padel';

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
      HomeScreen(
        key: ValueKey('home_$_selectedSport'),
        onSelectCourt: (court) => setState(() => _selectedCourt = court),
        initialCategory: _selectedSport == 'futbol' ? 'Fútbol 7 Profesional' : 'Todas',
      ),
      TournamentsScreen(
        key: ValueKey('tourn_$_selectedSport'),
        initialSport: _selectedSport ?? 'padel',
      ),
      ProductsScreen(
        key: ValueKey('prod_$_selectedCategory'),
        initialCategory: _selectedCategory ?? 'Todos',
      ),
      const ContactScreen(),
    ];

    final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();

    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded, color: Color(0xFF0F172A), size: 26),
          onPressed: () => scaffoldKey.currentState?.openDrawer(),
        ),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RichText(
              text: const TextSpan(
                text: '{',
                style: TextStyle(
                  color: Color(0xFFE11D48),
                  fontWeight: FontWeight.w900,
                  fontSize: 19,
                ),
                children: [
                  TextSpan(
                    text: 'LEVEL',
                    style: TextStyle(
                      color: Color(0xFF0F172A),
                      fontWeight: FontWeight.w900,
                      fontSize: 19,
                      letterSpacing: 2,
                    ),
                  ),
                  TextSpan(
                    text: '}',
                    style: TextStyle(
                      color: Color(0xFF0284C7),
                      fontWeight: FontWeight.w900,
                      fontSize: 19,
                    ),
                  ),
                ],
              ),
            ),
            const Text(
              'CENTRO DEPORTIVO',
              style: TextStyle(
                color: Color(0xFF65A30D),
                fontSize: 8,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.8,
              ),
            ),
          ],
        ),
        actions: [
          // Bookings quick access
          IconButton(
            tooltip: 'Mis Reservas',
            icon: Stack(
              children: [
                const Icon(Icons.confirmation_number_outlined, color: Color(0xFF0284C7), size: 22),
                if (appState.bookings.isNotEmpty)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '${appState.bookings.length}',
                        style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
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

          // Purple Shield Icon (matches Screenshot 1 top-right)
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProfileScreen()),
                );
              },
              borderRadius: BorderRadius.circular(10),
              child: Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3E8FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFC084FC), width: 1.2),
                ),
                child: const Icon(Icons.shield_outlined, color: Color(0xFF7E22CE), size: 19),
              ),
            ),
          ),
        ],
      ),
      drawer: AppDrawer(
        selectedIndex: _currentIndex,
        onSelectTab: (index, {String? subCategory, String? sport}) {
          setState(() {
            _currentIndex = index;
            _selectedCategory = subCategory;
            _selectedSport = sport ?? 'padel';
          });
        },
      ),
      body: pages[_currentIndex],
    );
  }
}
