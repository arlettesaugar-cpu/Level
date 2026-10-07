import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> galleryPhotos = [
      {'title': 'Pista 1: Pádel Cristal Pro (Azul)', 'url': 'assets/images/cancha_padel_1.jpg'},
      {'title': 'Pista 2: Pádel Panorámica VIP (Verde)', 'url': 'assets/images/cancha_padel_2.jpg'},
      {'title': 'Cancha Grama Sintética Pro', 'url': 'assets/images/cancha_grama_7.jpg'},
      {'title': 'Cancha de Entrenamientos 5', 'url': 'assets/images/cancha_sintetica_5.jpg'},
      {'title': 'Cancha Techada & Alumbrado LED', 'url': 'assets/images/cancha_techada.jpg'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiénes Somos 📜'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Card with Logo & Tacámbaro Badge
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, 4)),
                ],
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.asset(
                      'assets/images/logo.jpeg',
                      width: 70,
                      height: 70,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 70,
                        height: 70,
                        color: const Color(0xFF10B981),
                        child: const Icon(Icons.sports_tennis, color: Colors.white, size: 36),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Level Tacámbaro',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '📍 Valentín Gómez Farías #3, Tacámbaro, Mich.',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Centro Deportivo de Alto Nivel',
                          style: TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'Nuestra Historia y Visión',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
            const SizedBox(height: 12),
            const Text(
              'Level Tacámbaro nació con la visión de consolidar el primer centro deportivo de pádel de alto nivel en Tacámbaro, Michoacán. Nuestro club cuenta con 2 pistas de tecnología profesional (Pádel Cristal Pro y Panorámica VIP), cancha reglamentaria de Fútbol 7, iluminación LED nocturna de alta definición, área de espectadores, servicio de pro shop con alquiler de palas y pelotas, y atención personalizada las 24 horas del día.',
              style: TextStyle(fontSize: 14, height: 1.6, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 16),
            const Text(
              'Ubicados estratégicamente en Valentín Gómez Farías #3 (frente a las instalaciones de Protección Civil en Tacámbaro de Codallos), fomentamos la sana convivencia, clínicas deportivas, torneos locales y pasión por el deporte en Michoacán.',
              style: TextStyle(fontSize: 14, height: 1.6, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 24),

            // Facilities Photo Gallery
            const Text(
              'Nuestras Instalaciones',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 160,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: galleryPhotos.length,
                separatorBuilder: (c, i) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final photo = galleryPhotos[index];
                  return Container(
                    width: 220,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.asset(
                            photo['url']!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              color: const Color(0xFF0F172A),
                              child: const Icon(Icons.image, color: Colors.white54),
                            ),
                          ),
                          Container(
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                colors: [Colors.transparent, Colors.black87],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 10,
                            left: 10,
                            right: 10,
                            child: Text(
                              photo['title']!,
                              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                              maxLines: 2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),

            // Values & Commitments
            _buildFeatureTile(Icons.verified_rounded, 'Calidad Profesional', 'Pistas de cristal templado 12mm y medidas FIP oficiales'),
            _buildFeatureTile(Icons.nights_stay_rounded, 'Horarios Extendidos', 'Abierto de 8:00 AM a 11:00 PM todos los días'),
            _buildFeatureTile(Icons.sports_tennis_rounded, 'Pro Shop & Alquiler', 'Palas oficiales, tubos de pelotas, grips y bebidas'),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureTile(IconData icon, String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: const Color(0xFF10B981), size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(desc, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
