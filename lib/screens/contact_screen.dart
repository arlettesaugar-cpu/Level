import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({Key? key}) : super(key: key);

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _msgController = TextEditingController();

  void _sendMessage() {
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();
    final msg = _msgController.text.trim();

    if (name.isEmpty || phone.isEmpty || msg.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor llena todos los campos para enviar tu mensaje.')),
      );
      return;
    }

    _nameController.clear();
    _phoneController.clear();
    _msgController.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('¡Mensaje enviado a la administración de Tacámbaro! Te contactaremos pronto. ✉️'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contáctanos 📞'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Location Header Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10),
                ],
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.location_on_rounded, color: Color(0xFF10B981), size: 24),
                      SizedBox(width: 10),
                      Text(
                        'Level Tacámbaro',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    '📍 Valentín Gómez Farías #3, Col. Jardines de la Purísima, Tacámbaro de Codallos, Michoacán.',
                    style: TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
                  ),
                  SizedBox(height: 6),
                  Text(
                    '📍 Referencia: Frente a las instalaciones de Protección Civil.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0284C7)),
                  ),
                  SizedBox(height: 6),
                  Text(
                    '📞 Teléfono Club: 459 102 3849',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Quick Contact Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Abriendo WhatsApp directo de Level Tacámbaro (459 102 3849)... 💬'),
                          backgroundColor: Color(0xFF25D366),
                        ),
                      );
                    },
                    icon: const Icon(Icons.chat_bubble_rounded, color: Colors.white),
                    label: const Text('WhatsApp', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF25D366),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Llamando a recepción: 459 102 3849 📞'),
                          backgroundColor: Color(0xFF0284C7),
                        ),
                      );
                    },
                    icon: const Icon(Icons.phone_rounded, color: Colors.white),
                    label: const Text('Llamar Club', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Contact Form
            const Text(
              'Envíanos un Mensaje Directo',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildInputField('Tu Nombre Completo', Icons.person_outline, _nameController),
            const SizedBox(height: 12),
            _buildInputField('Teléfono / WhatsApp', Icons.phone_android_outlined, _phoneController),
            const SizedBox(height: 12),
            _buildInputField('Mensaje o Reserva Especial', Icons.message_outlined, _msgController, maxLines: 3),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _sendMessage,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Enviar Mensaje', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField(String hint, IconData icon, TextEditingController controller, {int maxLines = 1}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          hintText: hint,
          icon: Icon(icon, color: AppTheme.textSecondary, size: 20),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
