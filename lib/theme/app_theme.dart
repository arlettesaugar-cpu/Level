import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Logo Palette Colors
  static const Color primaryGreen = Color(0xFF10B981); // Emerald Green
  static const Color primaryBlue = Color(0xFF0284C7);  // Ocean Blue / Cyan
  static const Color accentRed = Color(0xFFEF4444);    // Vibrant Red
  
  static const Color primary = primaryBlue;
  static const Color primaryDark = Color(0xFF0369A1);
  static const Color secondary = primaryGreen;
  
  static const Color backgroundWhite = Color(0xFFF8FAFC); // Clean White Base
  static const Color cardWhite = Colors.white;
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textPrimary = textDark;
  static const Color textSecondary = textMuted;

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: backgroundWhite,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: primaryGreen,
        error: accentRed,
        surface: cardWhite,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        headlineMedium: GoogleFonts.outfit(
          fontWeight: FontWeight.bold,
          color: textDark,
          fontSize: 24,
        ),
        titleLarge: GoogleFonts.outfit(
          fontWeight: FontWeight.w700,
          color: textDark,
          fontSize: 20,
        ),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        color: cardWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(color: Colors.grey.shade200, width: 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: cardWhite,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.outfit(
          color: textDark,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: const IconThemeData(color: textDark),
      ),
    );
  }
}
