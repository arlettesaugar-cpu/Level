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
    plist_data["ITSAppUsesNonExemptEncryption"] = False
    plist_data["LSApplicationQueriesSchemes"] = ["https", "http", "tel", "mailto"]
    with open(info_plist_path, "wb") as f:
        plistlib.dump(plist_data, f)
    print("Info.plist configurado con nombre Level Pádel.")

# Configurar Iconos oficiales
try:
    from PIL import Image
    import json
    icon_dir = "ios/Runner/Assets.xcassets/AppIcon.appiconset"
    contents_path = os.path.join(icon_dir, "Contents.json")
    logo_path = "assets/images/logo.jpeg"
    if os.path.exists(contents_path) and os.path.exists(logo_path):
        with open(contents_path, "r") as f:
            contents = json.load(f)
        logo = Image.open(logo_path).convert("RGB")
        bg_color = (30, 30, 30)
        master = Image.new("RGB", (1024, 1024), bg_color)
        target_w = 850
        target_h = int(logo.height * (target_w / logo.width))
        scaled_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
        pos_x = (1024 - target_w) // 2
        pos_y = (1024 - target_h) // 2
        master.paste(scaled_logo, (pos_x, pos_y))
        for item in contents.get("images", []):
            fn = item.get("filename")
            if fn:
                size_parts = item["size"].split("x")
                w = float(size_parts[0])
                scale = float(item["scale"].replace("x", ""))
                px = int(round(w * scale))
                resized = master.resize((px, px), Image.Resampling.LANCZOS)
                resized.save(os.path.join(icon_dir, fn), "PNG")
        print("Iconos de iOS generados exitosamente con logo oficial.")
except Exception as e:
    print(f"Aviso iconos: {e}")

