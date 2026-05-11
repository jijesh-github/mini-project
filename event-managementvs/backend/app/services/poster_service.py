import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from app.models.schemas import EventCircular

def generate_poster_service(event_data: EventCircular) -> str:
    """
    Generates a professional event poster image (PNG) using Pillow.
    Returns the path to the generated image.
    """
    # Poster dimensions (1080 x 1350 for social media)
    width, height = 1080, 1350
    
    # Create background with a deep dark gradient
    image = Image.new('RGB', (width, height), color='#10141d')
    draw = ImageDraw.Draw(image)
    
    # Simple vertical gradient (charcoal to deep navy)
    for y in range(height):
        r = int(16 + (10 - 16) * y / height)
        g = int(20 + (15 - 20) * y / height)
        b = int(29 + (25 - 29) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Add some subtle accent shapes (optional, let's keep it clean first)
    draw.rectangle([0, 0, width, 15], fill="#00d2ff") # Top accent bar
    draw.rectangle([0, height-15, width, height], fill="#00d2ff") # Bottom accent bar

    # Load fonts (Standard Windows paths)
    font_path = "C:\\Windows\\Fonts\\arial.ttf"
    font_path_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    try:
        title_font = ImageFont.truetype(font_path_bold, 85)
        heading_font = ImageFont.truetype(font_path_bold, 45)
        text_font = ImageFont.truetype(font_path, 38)
        label_font = ImageFont.truetype(font_path_bold, 38)
        small_font = ImageFont.truetype(font_path, 30)
    except Exception:
        # Fallback to default if fonts not found
        title_font = ImageFont.load_default()
        heading_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Padding and initial Y position
    padding = 100
    current_y = 180

    # 1. Draw Title (Centered)
    title_text = event_data.event_title.upper()
    wrapped_title = textwrap.wrap(title_text, width=18)
    for line in wrapped_title:
        # Get text size for centering
        bbox = draw.textbbox((0, 0), line, font=title_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), line, font=title_font, fill="white")
        current_y += 100
    
    current_y += 40
    
    # 2. Draw Event Type / Tagline (Centered)
    event_type = f"— {event_data.event_type} —"
    bbox = draw.textbbox((0, 0), event_type, font=heading_font)
    w = bbox[2] - bbox[0]
    draw.text(((width - w) / 2, current_y), event_type, font=heading_font, fill="#00d2ff")
    current_y += 120

    # 3. Draw Date & Time
    draw.text((padding, current_y), "DATE & TIME", font=label_font, fill="#00d2ff")
    current_y += 50
    draw.text((padding, current_y), f"{event_data.date_time}", font=text_font, fill="white")
    current_y += 120

    # 4. Draw Venue
    draw.text((padding, current_y), "VENUE", font=label_font, fill="#00d2ff")
    current_y += 50
    draw.text((padding, current_y), f"{event_data.venue}", font=text_font, fill="white")
    current_y += 120

    # 5. Draw Description
    draw.text((padding, current_y), "WHAT TO EXPECT", font=label_font, fill="#00d2ff")
    current_y += 60
    
    desc_lines = textwrap.wrap(event_data.event_description, width=50)
    for line in desc_lines[:10]: # Limit lines to avoid overflow
        draw.text((padding, current_y), line, font=text_font, fill="#e0e0e0")
        current_y += 45

    # 6. Footer (Convenor)
    if event_data.convenor and event_data.convenor != "Not Provided":
        footer_text = f"Organized by: {event_data.convenor}"
        bbox = draw.textbbox((0, 0), footer_text, font=small_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, height - 120), footer_text, font=small_font, fill="#888888")

    # Ensure output directory exists
    output_dir = "generated"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, "poster.png")
    image.save(output_path)
    
    return output_path
