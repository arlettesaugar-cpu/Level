import 'package:flutter/material.dart';
import '../models/court.dart';
import '../models/booking.dart';
import '../widgets/time_slot_picker.dart';
import '../theme/app_theme.dart';

class CourtDetailScreen extends StatefulWidget {
  final Court court;
  final VoidCallback onBack;
  final Function(Booking) onConfirmBooking;

  const CourtDetailScreen({
    Key? key,
    required this.court,
    required this.onBack,
    required this.onConfirmBooking,
  }) : super(key: key);

  @override
  State<CourtDetailScreen> createState() => _CourtDetailScreenState();
}

class _CourtDetailScreenState extends State<CourtDetailScreen> {
  String? selectedSlot;
  String selectedPaymentMethod = 'Transferencia SPEI / QR';
  DateTime selectedDate = DateTime.now().add(const Duration(days: 1));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Hero Image Header
              SliverAppBar(
                expandedHeight: 240,
                pinned: true,
                leading: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.arrow_back, color: AppTheme.textPrimary, size: 20),
                  ),
                  onPressed: widget.onBack,
                ),
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.asset(
                        widget.court.imagePath,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: AppTheme.primaryDark,
                          child: const Icon(Icons.sports_tennis, size: 80, color: Colors.white),
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withOpacity(0.3),
                              Colors.transparent,
                              Colors.black.withOpacity(0.6),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Details Body
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
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
                              color: AppTheme.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              widget.court.category,
                              style: const TextStyle(
                                color: AppTheme.primaryDark,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.star_rounded, color: Colors.amber, size: 20),
                              const SizedBox(width: 4),
                              Text(
                                '${widget.court.rating}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              Text(
                                ' (${widget.court.reviewsCount} opiniones)',
                                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        widget.court.name,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.location_on_outlined, color: AppTheme.textSecondary, size: 16),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              widget.court.location,
                              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Specs Row
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildSpecItem(Icons.square_foot_rounded, 'Medidas', widget.court.dimensions),
                            Container(width: 1, height: 30, color: Colors.grey.shade300),
                            _buildSpecItem(Icons.grass_rounded, 'Superficie', widget.court.surfaceType),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Equipment Features
                      const Text(
                        'Equipamiento e Instalaciones',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: widget.court.features.map((f) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.check_circle_rounded, color: AppTheme.primary, size: 16),
                              const SizedBox(width: 6),
                              Text(f, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        )).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Time Slot Selector
                      TimeSlotPicker(
                        slots: widget.court.availableSlots,
                        selectedSlot: selectedSlot,
                        onSlotSelected: (slot) => setState(() => selectedSlot = slot),
                      ),
                      const SizedBox(height: 20),

                      // Payment Method Selector
                      const Text(
                        'Método de Pago',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      _buildPaymentOption('Transferencia SPEI / QR', Icons.qr_code_2_rounded, 'Pago rápido con SPEI o QR'),
                      _buildPaymentOption('Tarjeta de Crédito / Débito', Icons.credit_card_rounded, 'Visa, Mastercard'),
                      _buildPaymentOption('Efectivo en Cancha', Icons.payments_rounded, 'Pagas al llegar'),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Bottom Booking Floating Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 20,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Total a Pagar',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                      ),
                      Text(
                        '\$${widget.court.pricePerHour.toStringAsFixed(0)}.00 MXN',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: selectedSlot == null
                          ? null
                          : () {
                              final newBooking = Booking(
                                id: 'RES-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                                courtId: widget.court.id,
                                courtName: widget.court.name,
                                courtLocation: widget.court.location,
                                imagePath: widget.court.imagePath,
                                date: selectedDate,
                                timeSlot: selectedSlot!,
                                totalPrice: widget.court.pricePerHour,
                                paymentMethod: selectedPaymentMethod,
                                status: BookingStatus.confirmed,
                                qrCode: 'CANCHASYA-QR-VERIFIED',
                              );
                              widget.onConfirmBooking(newBooking);
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: selectedSlot != null ? AppTheme.primary : Colors.grey.shade400,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        selectedSlot == null ? 'Elige un Horario' : 'Confirmar Reserva',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecItem(IconData icon, String title, String value) {
    return Column(
      children: [
        Icon(icon, color: AppTheme.primary, size: 20),
        const SizedBox(height: 4),
        Text(title, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildPaymentOption(String title, IconData icon, String subtitle) {
    final isSelected = selectedPaymentMethod == title;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppTheme.primary.withOpacity(0.05) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppTheme.primary : Colors.grey.shade200,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: ListTile(
        onTap: () => setState(() => selectedPaymentMethod = title),
        leading: Icon(icon, color: isSelected ? AppTheme.primary : AppTheme.textSecondary),
        title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
        trailing: Radio<String>(
          value: title,
          groupValue: selectedPaymentMethod,
          activeColor: AppTheme.primary,
          onChanged: (val) => setState(() => selectedPaymentMethod = val!),
        ),
      ),
    );
  }
}
