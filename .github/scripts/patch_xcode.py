import re
import sys
import plistlib
import os

project_path = "ios/Runner.xcodeproj/project.pbxproj"

if os.path.exists(project_path):
    with open(project_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Asegurar Bundle Identifier = com.levelpadel.app
    content = re.sub(
        r'PRODUCT_BUNDLE_IDENTIFIER\s*=\s*[^;]+;',
        'PRODUCT_BUNDLE_IDENTIFIER = com.levelpadel.app;',
        content
    )

    # 2. Asignar Team y Firma Manual con Perfil
    settings_patch = (
        'DEVELOPMENT_TEAM = 2VY7U35749;\n'
        '\t\t\t\tCODE_SIGN_STYLE = Manual;\n'
        '\t\t\t\tCODE_SIGN_IDENTITY = "Apple Distribution";\n'
        '\t\t\t\t"CODE_SIGN_IDENTITY[sdk=iphoneos*]" = "Apple Distribution";\n'
        '\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "Level Profile";\n'
        '\t\t\t\tPROVISIONING_PROFILE = "1e21bde1-5eb7-4e4f-aa66-02e4e7610db8";\n'
    )
    content = re.sub(
        r'(buildSettings\s*=\s*\{)',
        r'\1\n\t\t\t\t' + settings_patch,
        content
    )

    with open(project_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Runner.xcodeproj/project.pbxproj configurado para firma con Apple Distribution y Level Profile.")

# Configurar Info.plist
info_plist_path = "ios/Runner/Info.plist"
if os.path.exists(info_plist_path):
    with open(info_plist_path, "rb") as f:
        plist_data = plistlib.load(f)
    plist_data["CFBundleDisplayName"] = "Level Pádel"
    plist_data["CFBundleName"] = "Level Pádel"
    with open(info_plist_path, "wb") as f:
        plistlib.dump(plist_data, f)
    print("Info.plist actualizado con el nombre oficial Level Pádel.")
