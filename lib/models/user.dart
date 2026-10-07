class AppUser {
  final String id;
  final String username;
  final String name;
  final String phone;
  final String role; // 'Administrador' o 'Cliente'
  final String password;
  final String tempPassword;
  final bool mustChangePassword;
  final bool hasDebt;
  final double debtAmount;
  final String debtReason;
  final String status;
  final String createdAt;

  AppUser({
    required this.id,
    required this.username,
    required this.name,
    required this.phone,
    required this.role,
    required this.password,
    this.tempPassword = '',
    this.mustChangePassword = false,
    this.hasDebt = false,
    this.debtAmount = 0.0,
    this.debtReason = '',
    this.status = 'Activo',
    this.createdAt = '2026-09-01',
  });

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'Cliente',
      password: json['password'] ?? '',
      tempPassword: json['tempPassword'] ?? '',
      mustChangePassword: json['mustChangePassword'] == true || json['mustChangePassword'] == 'true',
      hasDebt: json['hasDebt'] == true || json['hasDebt'] == 'true',
      debtAmount: (json['debtAmount'] != null) ? double.tryParse(json['debtAmount'].toString()) ?? 0.0 : 0.0,
      debtReason: json['debtReason'] ?? '',
      status: json['status'] ?? 'Activo',
      createdAt: json['createdAt'] ?? '2026-09-01',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'name': name,
      'phone': phone,
      'role': role,
      'password': password,
      'tempPassword': tempPassword,
      'mustChangePassword': mustChangePassword,
      'hasDebt': hasDebt,
      'debtAmount': debtAmount,
      'debtReason': debtReason,
      'status': status,
      'createdAt': createdAt,
    };
  }

  static List<AppUser> get initialUsers => [
    AppUser(
      id: 'USR-6229',
      username: 'arlette',
      name: 'Arlette Saucedo',
      phone: '4591161880',
      role: 'Administrador',
      password: '1234',
      status: 'Activo (Password Personalizada)',
      createdAt: '2026-09-07',
    ),
    AppUser(
      id: 'USR-1001',
      username: 'cpalacios',
      name: 'Carlos Palacios',
      phone: '45911161880',
      role: 'Cliente',
      password: '123456',
      status: 'Activo (Password Personalizada)',
      createdAt: '2026-09-05',
    ),
    AppUser(
      id: 'USR-1335',
      username: 'christian',
      name: 'CHRISTIAN ABURTO',
      phone: '4432011889',
      role: 'Cliente',
      password: '123456',
      tempPassword: 'TAC-8550',
      mustChangePassword: true,
      status: 'Activo (Password Temporal)',
      createdAt: '2026-09-05',
    ),
    AppUser(
      id: 'USR-3511',
      username: 'admin2',
      name: 'Administrador 2',
      phone: '4591161880',
      role: 'Cliente',
      password: '123456',
      status: 'Activo (Password Personalizada)',
      createdAt: '2026-09-14',
    ),
    AppUser(
      id: 'USR-1007',
      username: 'admin',
      name: 'Administrador Level Tacámbaro',
      phone: '4590001122',
      role: 'Administrador',
      password: 'ADMIN-TAC',
      tempPassword: 'ADMIN-TAC',
      status: 'Activo (Administrador)',
      createdAt: '2026-09-01',
    ),
    AppUser(
      id: 'USR-1003',
      username: 'aruiz',
      name: 'Alejandro Ruiz',
      phone: '4594102938',
      role: 'Cliente',
      password: 'TAC-5521',
      hasDebt: true,
      debtAmount: 300.0,
      debtReason: 'Inasistencia Reserva RES-1001 (No-Show)',
      status: 'Pendiente Saldo',
      createdAt: '2026-09-05',
    ),
  ];
}
