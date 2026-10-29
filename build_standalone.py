import os
import re
import base64

base_dir = r"C:\Users\Santhosh MR\.gemini\antigravity-ide\scratch\quantum-lab"
dist_dir = os.path.join(base_dir, "dist")
os.makedirs(dist_dir, exist_ok=True)

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

with open(os.path.join(base_dir, "css", "main.css"), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(base_dir, "js", "experiments.js"), "r", encoding="utf-8") as f:
    exp_js = f.read()

with open(os.path.join(base_dir, "js", "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace css link with inlined <style>
css_link = '<link rel="stylesheet" href="css/main.css">'
if css_link in html:
    html = html.replace(css_link, f'<style>\n{css}\n</style>')
else:
    html = re.sub(r'<link\s+rel=[\'"]stylesheet[\'"]\s+href=[\'"]css/main\.css[\'"]>', lambda m: f'<style>\n{css}\n</style>', html)

# Replace script links with inlined <script>
script_tags = '<script src="js/experiments.js"></script>\n  <script src="js/app.js"></script>'
inlined_scripts = f"""<script>
{exp_js}
</script>
<script>
{app_js}
</script>"""

if script_tags in html:
    html = html.replace(script_tags, inlined_scripts)
else:
    html = re.sub(r'<script\s+src=[\'"]js/experiments\.js[\'"]></script>\s*<script\s+src=[\'"]js/app\.js[\'"]></script>', lambda m: inlined_scripts, html)

# Create two versions:
# Version A: standalone HTML using relative ./audio/ (fastest load, cleanest)
standalone_path = os.path.join(dist_dir, "index.html")
with open(standalone_path, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Created standalone distribution index.html: {len(html)} bytes")

# Version B: completely self-contained all-in-one with embedded base64 audio
# Embed intro and all 10 experiment audios
audio_dir = os.path.join(base_dir, "audio")
html_all_in_one = html

def get_base64_audio(filename):
    p = os.path.join(audio_dir, filename)
    if os.path.exists(p):
        with open(p, "rb") as af:
            return "data:audio/mpeg;base64," + base64.b64encode(af.read()).decode("ascii")
    return ""

intro_b64 = get_base64_audio("intro.mp3")
html_all_in_one = html_all_in_one.replace('src="audio/intro.mp3"', f'src="{intro_b64}"')

for i in range(1, 11):
    exp_b64 = get_base64_audio(f"exp{i}.mp3")
    html_all_in_one = html_all_in_one.replace(f'src="audio/exp{i}.mp3"', f'src="{exp_b64}"')

all_in_one_path = os.path.join(dist_dir, "Quantum_Computing_Lab_Standalone_Pro.html")
with open(all_in_one_path, "w", encoding="utf-8") as f:
    f.write(html_all_in_one)

print(f"Created all-in-one single-file distribution: {len(html_all_in_one)} bytes (~{len(html_all_in_one)/1024/1024:.2f} MB)")
