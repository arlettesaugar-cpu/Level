import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/booking.dart';
import '../services/app_state.dart';
import '../theme/app_theme.dart';

class MyBookingsScreen extends StatelessWidget {
  const MyBookingsScreen({Key? key}) : super(key: key);

  void _confirmCancel(BuildContext context, Booking booking) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.orange),
            SizedBox(width: 8),
            Text('Cancelar Reserva'),
          ],
        ),
        content: Text(
          '¿Estás seguro de cancelar tu reserva ${booking.id} (${booking.courtName} - ${booking.timeSlot})?\n\n*Recuerda que la política del club exige mínimo 24 horas de anticipación para cancelaciones sin costo.*',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Volver'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              final appState = Provider.of<AppState>(context, listen: false);
              final result = appState.cancelBooking(booking.id);

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(result['message']),
                  backgroundColor: result['success'] ? const Color(0xFF10B981) : Colors.redAccent,
                  duration: const Duration(seconds: 4),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            child: const Text('Sí, Cancelar', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final bookings = appState.bookings;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Reservas 🎟️'),
      ),
      body: bookings.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.confirmation_number_outlined, size: 70, color: Colors.grey.shade400),
                  const SizedBox(height: 16),
                  const Text(
                    'Aún no tienes reservas activas',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '¡Elige tu cancha favorita y aparta tu turno!',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: bookings.length,
              itemBuilder: (context, index) {
                final booking = bookings[index];
                final isCancelled = booking.status == BookingStatus.cancelled;

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isCancelled ? Colors.red.shade100 : Colors.grey.shade200,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0284C7).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                booking.id,
                                style: const TextStyle(
                                  color: Color(0xFF0284C7),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isCancelled ? Colors.red.shade50 : const Color(0xFFD1FAE5),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    isCancelled ? Icons.cancel_outlined : Icons.check_circle,
                                    size: 13,
                                    color: isCancelled ? Colors.redAccent : const Color(0xFF059669),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    isCancelled ? 'Cancelada' : 'Confirmada',
                                    style: TextStyle(
                                      color: isCancelled ? Colors.redAccent : const Color(0xFF059669),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          booking.courtName,
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: isCancelled ? Colors.grey : AppTheme.textPrimary,
                            decoration: isCancelled ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.textSecondary),
                            const SizedBox(width: 4),
                            Text(
                              DateFormat('dd/MM/yyyy').format(booking.date),
                              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                            ),
                            const SizedBox(width: 12),
                            const Icon(Icons.access_time_filled, color: Color(0xFF10B981), size: 14),
                            const SizedBox(width: 4),
                            Text(
                              booking.timeSlot,
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Método: ${booking.paymentMethod}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                            Text(
                              '\$${booking.totalPrice.toStringAsFixed(0)} MXN',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: isCancelled ? Colors.grey : const Color(0xFF10B981),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Divider(height: 1),
                        const SizedBox(height: 10),

                        // Action Buttons: QR Ticket and Cancel Button
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.qr_code_rounded, size: 16, color: Color(0xFF0F172A)),
                                    SizedBox(width: 6),
                                    Text(
                                      'Ticket QR',
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            if (!isCancelled) ...[
                              const SizedBox(width: 10),
                              OutlinedButton.icon(
                                onPressed: () => _confirmCancel(context, booking),
                                icon: const Icon(Icons.close, size: 14, color: Colors.redAccent),
                                label: const Text('Cancelar', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.redAccent),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
