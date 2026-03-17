from PIL import Image, ImageDraw, ImageFont
import os

# Kategori paket
pakets = [
    {"nama": "Paket Sembako Hemat", "kategori": "sembako"},
    {"nama": "Paket Sembako Premium", "kategori": "sembako"},
    {"nama": "Blender Elektronik", "kategori": "elektronik"},
    {"nama": "Setrika Uap Modern", "kategori": "elektronik"},
    {"nama": "Paket Baju Lebaran", "kategori": "fashion"}
]

# Direktori uploads
upload_dir = '/root/.openclaw/workspace/sipale/backend/uploads/paket'

def create_placeholder(nama, kategori):
    # Ukuran gambar
    width, height = 800, 600
    
    # Buat gambar baru
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Warna berdasarkan kategori
    colors = {
        'sembako': (76, 175, 80),    # Hijau
        'elektronik': (33, 150, 243),# Biru
        'fashion': (233, 30, 99)     # Merah muda
    }
    
    # Pilih warna
    base_color = colors.get(kategori, (158, 158, 158))  # Abu-abu default
    
    # Background gradient
    for y in range(height):
        r = int(base_color[0] * (1 - y/height) + 255 * (y/height))
        g = int(base_color[1] * (1 - y/height) + 255 * (y/height))
        b = int(base_color[2] * (1 - y/height) + 255 * (y/height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Load font
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 50)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except IOError:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Tambahkan teks
    draw.text((50, height//2 - 100), nama, font=font_large, fill=(255,255,255))
    draw.text((50, height//2), f"Kategori: {kategori.upper()}", font=font_small, fill=(255,255,255))
    
    # Simpan gambar
    filename = f"{kategori.lower().replace(' ', '_')}_{nama.lower().replace(' ', '_')}.png"
    filepath = os.path.join(upload_dir, filename)
    image.save(filepath)
    print(f"Gambar dibuat: {filepath}")
    return filename

# Generate placeholder untuk setiap paket
for paket in pakets:
    create_placeholder(paket['nama'], paket['kategori'])