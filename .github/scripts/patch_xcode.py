import sys

path = "ios/Runner.xcodeproj/project.pbxproj"

with open(path, "r") as f:
    content = f.read()

inject = (
    "buildSettings = {\n"
    "\t\t\t\tDEVELOPMENT_TEAM = AAAAAAAAAA;\n"
    "\t\t\t\tCODE_SIGNING_ALLOWED = NO;\n"
    "\t\t\t\tCODE_SIGNING_REQUIRED = NO;\n"
    '\t\t\t\tCODE_SIGN_IDENTITY = "";\n'
    '\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = "";\n'
)

content = content.replace("buildSettings = {", inject)

with open(path, "w") as f:
    f.write(content)

print("project.pbxproj parcheado correctamente.")
