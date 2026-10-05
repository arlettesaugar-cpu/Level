class Product {
  final String id;
  final String name;
  final String category; // 'Alquiler de Pala', 'Pelotas', 'Bebidas', 'Accesorios'
  final double price; // MXN
  final String type; // 'Venta' o 'Alquiler'
  final String imagePath;
  final int stock;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.type,
    required this.imagePath,
    required this.stock,
  });

  static List<Product> mockProducts = [
    Product(
      id: 'p1',
      name: 'Alquiler de Pala Pro (Bullpadel / Head / Babolat)',
      category: 'Alquiler de Pala',
      price: 80.0,
      type: 'Alquiler por juego',
      imagePath: 'assets/images/cancha_padel_2.jpg',
      stock: 10,
    ),
    Product(
      id: 'p2',
      name: 'Tubo de Pelotas Head Padel Pro (3 Uds)',
      category: 'Pelotas',
      price: 160.0,
      type: 'Venta',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      stock: 25,
    ),
    Product(
      id: 'p3',
      name: 'Overgrip Babolat Pro Tacky (Pack x 3)',
      category: 'Accesorios',
      price: 120.0,
      type: 'Venta',
      imagePath: 'assets/images/cancha_padel_1.jpg',
      stock: 18,
    ),
    Product(
      id: 'p4',
      name: 'Bebida Electrolit / Powerade 625ml',
      category: 'Bebidas',
      price: 35.0,
      type: 'Venta',
      imagePath: 'assets/images/cancha_padel_2.jpg',
      stock: 50,
    ),
  ];
}
