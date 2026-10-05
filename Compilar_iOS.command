#!/bin/bash

# ==============================================================================
# Script de preparación y compilación iOS para macOS - Level Tacámbaro
# Para ejecutar: Doble clic en este archivo desde Finder en tu Mac
# ==============================================================================

cd "$(dirname "$0")"

echo "=========================================================="
echo "   PREPARANDO PROYECTO FLUTTER PARA iOS - LEVEL TACAMBARO"
echo "=========================================================="
echo ""

# 1. Verificar si Flutter está instalado en el sistema
if ! command -v flutter &> /dev/null
then
    echo "❌ Error: Flutter no se encuentra en el PATH de tu Mac."
    echo "Por favor instala Flutter y configuralo en tu ~/.zshrc o ~/.bash_profile"
    echo "Presiona cualquier tecla para salir..."
    read -n 1
    exit 1
fi

echo "✅ [1/5] Verificando version de Flutter..."
flutter --version

echo ""
echo "📱 [2/5] Verificando/Creando plataforma iOS..."
# Crea la carpeta ios solo si no existe, sin alterar lib/ ni web/ ni android/
if [ ! -d "ios" ]; then
    echo "Generando carpeta nativa iOS..."
    flutter create . --platforms=ios
else
    echo "Carpeta ios/ ya existe."
fi

echo ""
echo "📦 [3/5] Descargando dependencias de Flutter..."
flutter pub get

echo ""
echo "🍏 [4/5] Instalando CocoaPods (Pods nativos de iOS)..."
if command -v pod &> /dev/null
then
    cd ios
    pod install
    cd ..
else
    echo "CocoaPods no esta instalado globalmente. Continuando..."
fi

echo ""
echo "🚀 [5/5] Abriendo el proyecto en Xcode..."
if [ -d "ios/Runner.xcworkspace" ]; then
    open ios/Runner.xcworkspace
    echo ""
    echo "=========================================================="
    echo " ¡LISTO! Xcode se ha abierto con tu proyecto."
    echo " Pasos siguientes en Xcode:"
    echo " 1. Ve a la pestana 'Signing & Capabilities'."
    echo " 2. En 'Team', selecciona tu Apple ID o cuenta de Desarrollador."
    echo " 3. Conecta tu iPhone o selecciona un simulador y dale a ▶ (Play)."
    echo "=========================================================="
else
    echo "Abriendo carpeta del proyecto..."
    open .
fi

echo ""
echo "Presiona Enter para cerrar esta ventana..."
read
