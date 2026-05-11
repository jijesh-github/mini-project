import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from moviepy import ImageSequenceClip
from app.models.schemas import EventCircular

def create_slide(draw, width, height, title, content, font_bold, font_regular, bg_color="#10141d", accent_color="#00d2ff"):
    """Helper to draw a slide on an existing draw object."""
    # Background
    # Simple vertical gradient (charcoal to deep navy)
    for y in range(height):
        r = int(16 + (10 - 16) * y / height)
        g = int(20 + (15 - 20) * y / height)
        b = int(29 + (25 - 29) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Accent bars
    draw.rectangle([0, 0, width, 20], fill=accent_color)
    draw.rectangle([0, height-20, width, height], fill=accent_color)

    # Padding
    padding = 100
    current_y = 400

    # Draw Title (Centered)
    title_lines = textwrap.wrap(title.upper(), width=15)
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=font_bold)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), line, font=font_bold, fill="white")
        current_y += 120
    
    current_y += 100

    # Draw Content (Centered)
    if isinstance(content, list):
        for item in content:
            item_lines = textwrap.wrap(item, width=25)
            for line in item_lines:
                bbox = draw.textbbox((0, 0), line, font=font_regular)
                w = bbox[2] - bbox[0]
                draw.text(((width - w) / 2, current_y), line, font=font_regular, fill=accent_color)
                current_y += 70
    else:
        content_lines = textwrap.wrap(content, width=25)
        for line in content_lines:
            bbox = draw.textbbox((0, 0), line, font=font_regular)
            w = bbox[2] - bbox[0]
            draw.text(((width - w) / 2, current_y), line, font=font_regular, fill=accent_color)
            current_y += 70

def generate_reel_service(event_data: EventCircular) -> str:
    """
    Generates a vertical reel video (MP4) using Pillow and MoviePy.
    """
    width, height = 1080, 1920
    output_dir = "generated"
    slides_dir = os.path.join(output_dir, "slides")
    
    if not os.path.exists(slides_dir):
        os.makedirs(slides_dir)

    # Fonts
    font_path = "C:\\Windows\\Fonts\\arial.ttf"
    font_path_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    
    try:
        title_font = ImageFont.truetype(font_path_bold, 90)
        content_font = ImageFont.truetype(font_path, 60)
    except:
        title_font = ImageFont.load_default()
        content_font = ImageFont.load_default()

    slide_data = [
        ("EVENT TITLE", event_data.event_title),
        ("DATE & TIME", event_data.date_time),
        ("VENUE", event_data.venue),
        ("WHAT TO EXPECT", event_data.event_description),
        ("JOIN US", f"Organized by: {event_data.convenor}")
    ]

    slide_paths = []
    for i, (title, content) in enumerate(slide_data):
        img = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(img)
        create_slide(draw, width, height, title, content, title_font, content_font)
        
        slide_path = os.path.join(slides_dir, f"slide{i+1}.png")
        img.save(slide_path)
        slide_paths.append(slide_path)

    # Combine slides into video
    output_video_path = os.path.join(output_dir, "event_reel.mp4")
    
    # Each slide for 2 seconds
    clip = ImageSequenceClip(slide_paths, fps=0.5) # 0.5 fps = 2 seconds per image
    clip.write_videofile(output_video_path, fps=24, codec="libx264")
    
    return output_video_path
