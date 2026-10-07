import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/court.dart';
import '../services/app_state.dart';
import '../widgets/time_slot_picker.dart';
import '../theme/app_theme.dart';

class CourtDetailScreen extends StatefulWidget {
  final Court court;
  final VoidCallback onBack;

  const CourtDetailScreen({
    Key? key,
    required this.court,
    required this.onBack,
  }) : super(key: key);

  @override
  State<CourtDetailScreen> createState() => _CourtDetailScreenState();
}

class _CourtDetailScreenState extends State<CourtDetailScreen> {
  String? selectedSlot;
  String selectedPaymentMethod = 'Efectivo en Mostrador';
  DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
  bool _acceptedTerms = true;

  void _showTermsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.gavel_rounded, color: Color(0xFF10B981)),
            SizedBox(width: 8),
            Text('Políticas del Club', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '1. Compromiso de Pago & No-Show',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
              ),
              SizedBox(height: 2),
              Text(
                'Toda reservación aparta el horario seleccionado. Si reservas y no asistes (No-Show), te comprometes a saldar el monto del turno (\$300.00 MXN / hora). El sistema registrará el adeudo y bloqueará nuevas reservas hasta liquidar en mostrador.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.3),
              ),
              SizedBox(height: 12),
              Text(
                '2. Política de Cancelación (Mínimo 24h)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
              ),
              SizedBox(height: 2),
              Text(
                'Las cancelaciones sin penalización aplican únicamente con un mínimo de 24 horas de anticipación desde la opción "Mis Reservaciones". Cancelaciones con menos de 24 horas mantendrán el cobro.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.3),
              ),
            ],
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Entendido y Acepto', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _confirmBooking() {
    if (selectedSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor selecciona un horario disponible.'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final appState = Provider.of<AppState>(context, listen: false);
    final result = appState.createBooking(
      court: widget.court,
      date: selectedDate,
      slot: selectedSlot!,
      paymentMethod: selectedPaymentMethod,
    );

    if (result['success'] == true) {
      final booking = result['booking'];
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 28),
              SizedBox(width: 8),
              Text('¡Reserva Exitosa!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Folio: ${booking.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 6),
              Text('Pista: ${widget.court.name}'),
              Text('Fecha: ${DateFormat('dd/MM/yyyy').format(selectedDate)}'),
              Text('Horario: $selectedSlot (1 hora)'),
              Text('Total: \$${widget.court.pricePerHour.toStringAsFixed(0)} MXN'),
              Text('Método: $selectedPaymentMethod'),
              if (selectedPaymentMethod.contains('BBVA')) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.blue.shade200),
                  ),
                  child: const Text(
                    'CLABE BBVA: 012 320 001122334455 6\nConcepto: Tu Nombre y Folio de reserva',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF0369A1)),
                  ),
                ),
              ],
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                widget.onBack();
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
              child: const Text('Aceptar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 28),
              SizedBox(width: 8),
              Text('No se pudo reservar'),
            ],
          ),
          content: Text(result['message'] ?? 'Error al procesar la reserva.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Entendido'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    // Find current court in appState to get live slotStatuses
    final currentCourt = appState.courts.firstWhere((c) => c.id == widget.court.id, orElse: () => widget.court);

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Image Header
              SliverAppBar(
                expandedHeight: 220,
                pinned: true,
                leading: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    child: const Icon(Icons.arrow_back, color: AppTheme.textPrimary, size: 20),
                  ),
                  onPressed: widget.onBack,
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Image.asset(
                    widget.court.imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: AppTheme.primaryDark,
                      child: const Icon(Icons.sports_tennis, size: 60, color: Colors.white),
                    ),
                  ),
                ),
              ),

              // Body Details
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 110),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryBlue.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              widget.court.category,
                              style: const TextStyle(
                                color: AppTheme.primaryBlue,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          Text(
                            '\$${widget.court.pricePerHour.toStringAsFixed(0)} MXN / hora',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF10B981)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.court.name,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text(widget.court.location, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Features
                      Wrap(
                        spacing: 8,
                        runSpacing: 6,
                        children: widget.court.features.map((f) => Chip(
                          label: Text(f, style: const TextStyle(fontSize: 11)),
                          backgroundColor: const Color(0xFFF1F5F9),
                          padding: EdgeInsets.zero,
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        )).toList(),
                      ),
                      const SizedBox(height: 20),

                      // Date Selector
                      const Text(
                        'Selecciona Fecha',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              DateFormat('EEEE d MMMM, yyyy', 'es').format(selectedDate),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            IconButton(
                              icon: const Icon(Icons.calendar_today_rounded, color: AppTheme.primaryBlue, size: 20),
                              onPressed: () async {
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: selectedDate,
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime.now().add(const Duration(days: 30)),
                                );
                                if (picked != null) setState(() => selectedDate = picked);
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Slot Picker
                      TimeSlotPicker(
                        slots: currentCourt.availableSlots,
                        selectedSlot: selectedSlot,
                        slotStatuses: currentCourt.slotStatuses,
                        onSlotSelected: (slot) => setState(() => selectedSlot = slot),
                      ),
                      const SizedBox(height: 20),

                      // Payment Method Selector
                      const Text(
                        'Método de Pago',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Column(
                          children: [
                            RadioListTile<String>(
                              title: const Text('Efectivo en Mostrador', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              subtitle: const Text('Liquidación al llegar al club en Tacámbaro', style: TextStyle(fontSize: 11)),
                              value: 'Efectivo en Mostrador',
                              groupValue: selectedPaymentMethod,
                              onChanged: (val) => setState(() => selectedPaymentMethod = val!),
                            ),
                            const Divider(height: 1),
                            RadioListTile<String>(
                              title: const Text('Transferencia BBVA / SPEI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              subtitle: const Text('Pago instantáneo con CLABE interbancaria', style: TextStyle(fontSize: 11)),
                              value: 'Transferencia BBVA / SPEI',
                              groupValue: selectedPaymentMethod,
                              onChanged: (val) => setState(() => selectedPaymentMethod = val!),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Terms Link
                      InkWell(
                        onTap: _showTermsDialog,
                        child: const Row(
                          children: [
                            Icon(Icons.info_outline_rounded, size: 16, color: Color(0xFF10B981)),
                            SizedBox(width: 6),
                            Text(
                              'Ver Políticas de Cancelación (24h) y No-Show',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF10B981), decoration: TextDecoration.underline),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Bottom Bar Confirm
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 10, offset: const Offset(0, -4)),
                ],
              ),
              child: SafeArea(
                top: false,
                child: Row(
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Total a pagar', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        Text(
                          '\$${widget.court.pricePerHour.toStringAsFixed(0)} MXN',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _confirmBooking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text(
                          'Confirmar Reserva',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
