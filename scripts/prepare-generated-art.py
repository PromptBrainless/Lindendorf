from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/projects/text-adventure-4676277d/generated-art")
target = Path("/home/ubuntu/projects/text-adventure-4676277d/workspace/public/art")
backgrounds = ["stranger", "chapel", "apothecary", "smithy", "mill", "evidence"]
portraits = ["kern", "sanna", "smith", "beggar"]

target.mkdir(parents=True, exist_ok=True)

for name in backgrounds:
    with Image.open(source / f"{name}.jpg") as image:
        image = image.convert("RGB").resize((1792, 1008), Image.Resampling.LANCZOS)
        image.save(target / f"{name}.jpg", quality=88, optimize=True, progressive=True)

for name in portraits:
    with Image.open(source / f"{name}.jpg") as image:
        image = image.convert("RGB").resize((896, 1344), Image.Resampling.LANCZOS)
        image.save(target / f"{name}.jpg", quality=88, optimize=True, progressive=True)

print(f"prepared={len(backgrounds) + len(portraits)}")
