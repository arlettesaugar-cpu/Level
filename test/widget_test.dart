import 'package:flutter_test/flutter_test.dart';
import 'package:canchas_ya/main.dart';

void main() {
  testWidgets('App loads LoginScreen with Level Tacámbaro brand', (WidgetTester tester) async {
    await tester.pumpWidget(const CanchasYaApp());

    // Verify login title exists
    expect(find.textContaining('LEVEL'), findsWidgets);
    expect(find.text('Entrar a mi Cuenta'), findsOneWidget);
  });
}
