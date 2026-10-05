import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'models/court.dart';
import 'models/booking.dart';
import 'widgets/app_drawer.dart';
import 'screens/home_screen.dart';
import 'screens/court_detail_screen.dart';
import 'screens/history_screen.dart';
import 'screens/tournaments_screen.dart';
import 'screens/products_screen.dart';
import 'screens/contact_screen.dart';

import 'screens/my_bookings_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(const CanchasYaApp());
}

class CanchasYaApp extends StatelessWidget {
  const CanchasYaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pádel Club Tacámbaro',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainNavigationWrapper(),
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
  final List<Booking> _myBookings = List.from(Booking.mockBookings);

  @override
  Widget build(BuildContext context) {
    if (_selectedCourt != null) {
      return CourtDetailScreen(
        court: _selectedCourt!,
        onBack: () => setState(() => _selectedCourt = null),
        onConfirmBooking: (newBooking) {
          setState(() {
            _myBookings.insert(0, newBooking);
            _selectedCourt = null;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('¡Reserva confirmada en Pádel Club Tacámbaro! 🎾'),
              backgroundColor: AppTheme.primaryGreen,
              duration: Duration(seconds: 4),
            ),
          );
        },
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
              child: Image.asset('assets/images/logo.jpeg', width: 32, height: 32, fit: BoxFit.cover),
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
                if (_myBookings.isNotEmpty)
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
                        '${_myBookings.length}',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => MyBookingsScreen(bookings: _myBookings)),
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
      // NO BottomNavigationBar! Navigation is 100% via Drawer.
    );
  }
}
