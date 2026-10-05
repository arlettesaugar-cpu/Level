# 📱 Guía Completa para Compilar y Ejecutar en iOS (iPhone / Mac)

Esta guía te explica paso a paso cómo llevar este proyecto de Flutter a tu Mac y compilarlo para iPhone sin alterar ni descomponer la página web ni la app de Android.

---

## 1. 🛠️ Aplicaciones y Herramientas que debes instalar en la Mac

1. **Xcode** (Obligatorio para iOS):
   - Descárgalo gratis desde la **App Store** de tu Mac.
   - Una vez descargado, ábrelo por primera vez para que instale los componentes adicionales.
   - Abre la aplicación **Terminal** en tu Mac y ejecuta estos dos comandos para aceptar licencias y habilitar herramientas:
     ```bash
     sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
     sudo xcodebuild -runFirstLaunch
     ```

2. **CocoaPods** (Gestor de dependencias de iOS):
   - En la Terminal de Mac, escribe:
     ```bash
     sudo gem install cocoapods
     ```

3. **Flutter SDK para macOS**:
   - Descarga Flutter para macOS desde [https://docs.flutter.dev/get-started/install/macos](https://docs.flutter.dev/get-started/install/macos) (elige Apple Silicon M1/M2/M3 si tu Mac tiene chip M, o Intel según corresponda).
   - Descomprime y agrega la ruta de Flutter a tu PATH.
   - En la Terminal, ejecuta `flutter doctor` para verificar que Xcode y Flutter tengan palomita verde (✅).

4. **Visual Studio Code o Android Studio para Mac** (Opcional):
   - Para editar código si lo deseas, con la extensión de Flutter instalada.

---

## 2. 📂 ¿Qué archivos debes copiar a la Mac?

Puedes copiar la carpeta completa del proyecto mediante una memoria USB, AirDrop, Google Drive o Git, pero con las siguientes precauciones:

### ✅ SÍ debes incluir:
- `lib/` (Todo el código Dart de la app)
- `assets/` (Imágenes y logos)
- `pubspec.yaml` y `pubspec.lock` (Configuración de la app)
- `analysis_options.yaml`
- `web/` y `android/` (Para que el proyecto se mantenga unificado)
- `Compilar_iOS.command` (El script automático que te preparamos)
- `web_admin/`, `data/`, `index.php` (Si deseas conservar el panel web)

### ❌ NO debes copiar (o borrarlos si se copian):
- `build/` (Archivos temporales generados en Windows; en Mac causan error de caché)
- `.dart_tool/` (Caché local de Windows)
- Archivos `.bat` o `.exe` (Son solo para Windows)

---

## 3. ⚡ Pasos para Compilar y Ejecutar en tu iPhone

### Método 1: Automático (Un solo clic)
1. En tu Mac, abre la carpeta del proyecto.
2. Haz **doble clic** sobre el archivo `Compilar_iOS.command`.
3. El script revisará Flutter, creará la plataforma iOS si no existe, descargará los paquetes y abrirá **Xcode** automáticamente.

---

### Método 2: Por Terminal (Paso a Paso)
Si prefieres hacerlo por comandos en la Terminal de la Mac:

1. Abre la Terminal y dirígete a la carpeta del proyecto:
   ```bash
   cd /ruta/a/tu/carpeta/Level
   ```

2. Genera los archivos nativos de iOS (esto NO toca Android ni Web):
   ```bash
   flutter create . --platforms=ios
   ```

3. Descarga las dependencias e instala los Pods:
   ```bash
   flutter pub get
   cd ios
   pod install
   cd ..
   ```

4. Abre el proyecto en Xcode:
   ```bash
   open ios/Runner.xcworkspace
   ```

---

## 4. 🔏 Configuración de Firma en Xcode (Signing & Apple ID)

Para poder instalar la app en tu iPhone físico (incluso con una cuenta gratuita de Apple ID):

1. En Xcode, en el panel izquierdo haz clic en **Runner** (el icono azul arriba a la izquierda).
2. Selecciona el target **Runner** en el centro.
3. Ve a la pestaña **Signing & Capabilities**.
4. Marca la casilla **Automatically manage signing**.
5. En **Team**, selecciona tu cuenta de Apple (si no aparece, da clic en *Add Account...* e inicia sesión con tu Apple ID personal).
6. En **Bundle Identifier**, pon un identificador único (por ejemplo: `com.levelpadel.tacambaro`).

---

## 5. 📲 Probar en tu iPhone Físico

1. Conecta tu iPhone a la Mac con un cable USB.
2. Desbloquea tu iPhone y selecciona **"Confiar en este equipo"**.
3. En tu iPhone con iOS 16 o superior, activa el modo desarrollador:
   - Ve a: **Ajustes > Privacidad y seguridad > Modo de desarrollador** (actívalo y reinicia el iPhone).
4. En Xcode, en la barra superior selecciona tu **iPhone** como dispositivo de destino.
5. Presiona el botón **Play (▶)** para compilar e instalar la app en tu iPhone.

---

## 6. 📦 ¿Cómo sacar el archivo para distribución?

- **Para probar en simuladores / desarrollo:** Xcode instala directo en tu iPhone con el botón Play.
- **Para generar paquete de producción (.ipa) o subir a TestFlight / App Store:**
  - En Xcode: Menú superior **Product > Archive**.
  - Cuando termine, se abrirá el Organizador de Xcode para que elijas **Distribute App** (App Store Connect, TestFlight o Ad-Hoc).
