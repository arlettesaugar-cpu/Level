import re
import os
import plistlib

project_path = "ios/Runner.xcodeproj/project.pbxproj"

if os.path.exists(project_path):
    with open(project_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Asegurar que el Bundle Identifier sea com.levelpadel.app (solo en target Runner, no en RunnerTests)
    content = re.sub(
        r'PRODUCT_BUNDLE_IDENTIFIER\s*=\s*com\.levelpadel\.canchasYa;',
        'PRODUCT_BUNDLE_IDENTIFIER = com.levelpadel.app;',
        content
    )
    content = re.sub(
        r'PRODUCT_BUNDLE_IDENTIFIER\s*=\s*com\.example\.canchasYa;',
        'PRODUCT_BUNDLE_IDENTIFIER = com.levelpadel.app;',
        content
    )

    with open(project_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Bundle Identifier configurado a com.levelpadel.app")

# Configurar Info.plist con el nombre de la app
info_plist_path = "ios/Runner/Info.plist"
if os.path.exists(info_plist_path):
    with open(info_plist_path, "rb") as f:
        plist_data = plistlib.load(f)
    plist_data["CFBundleDisplayName"] = "Level Pádel"
    plist_data["CFBundleName"] = "Level Pádel"
    with open(info_plist_path, "wb") as f:
        plistlib.dump(plist_data, f)
    print("Info.plist configurado con nombre Level Pádel.")
