import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from app.models.schemas import EventCircular

def generate_invitation_service(event_data: EventCircular) -> str:
    """
    Generates a formal event invitation card (PNG) using Pillow.
    Returns the path to the generated image.
    """
    # Canvas size: 1000 x 1400 pixels
    width, height = 1000, 1400
    
    # Create background (Light elegant cream/off-white)
    bg_color = (252, 251, 245)
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)
    
    # Add a formal border
    border_margin = 40
    border_thickness = 4
    draw.rectangle([border_margin, border_margin, width - border_margin, height - border_margin], outline="#c4a484", width=border_thickness)
    draw.rectangle([border_margin + 10, border_margin + 10, width - border_margin - 10, height - border_margin - 10], outline="#c4a484", width=2)

    # Load fonts (Standard Windows paths)
    font_path = "C:\\Windows\\Fonts\\arial.ttf"
    font_path_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    # Try to use a more serif-like font if available for "INVITATION", otherwise stick to Arial
    font_path_italic = "C:\\Windows\\Fonts\\ariali.ttf"

    try:
        invitation_font = ImageFont.truetype(font_path_bold, 80)
        title_font = ImageFont.truetype(font_path_bold, 65)
        body_font = ImageFont.truetype(font_path, 35)
        italic_font = ImageFont.truetype(font_path_italic, 40)
        label_font = ImageFont.truetype(font_path_bold, 35)
        footer_font = ImageFont.truetype(font_path, 28)
    except Exception:
        invitation_font = title_font = body_font = italic_font = label_font = footer_font = ImageFont.load_default()

    current_y = 150

    # 1. "INVITATION" title
    inv_text = "INVITATION"
    bbox = draw.textbbox((0, 0), inv_text, font=invitation_font)
    w = bbox[2] - bbox[0]
    draw.text(((width - w) / 2, current_y), inv_text, font=invitation_font, fill="#8b4513")
    current_y += 120

    # Decorative line
    line_w = 400
    draw.line([(width - line_w) / 2, current_y, (width + line_w) / 2, current_y], fill="#c4a484", width=2)
    current_y += 60

    # 2. Body Intro
    intro_text = "You are cordially invited to attend"
    bbox = draw.textbbox((0, 0), intro_text, font=body_font)
    w = bbox[2] - bbox[0]
    draw.text(((width - w) / 2, current_y), intro_text, font=body_font, fill="#5a5a5a")
    current_y += 80

    # 3. Event Title (Large, Bold)
    title_lines = textwrap.wrap(event_data.event_title.upper(), width=25)
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), line, font=title_font, fill="#1a1a1a")
        current_y += 80
    
    current_y += 40

    # 4. Event Details (Date, Time, Venue)
    details = [
        ("DATE", event_data.date_time),
        ("VENUE", event_data.venue)
    ]
    
    for label, val in details:
        # Label
        bbox = draw.textbbox((0, 0), label, font=label_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), label, font=label_font, fill="#8b4513")
        current_y += 50
        # Value
        bbox = draw.textbbox((0, 0), val, font=body_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), val, font=body_font, fill="#333333")
        current_y += 80

    # 5. Description (Wrapped)
    current_y += 30
    desc_lines = textwrap.wrap(event_data.event_description, width=50)
    for line in desc_lines[:4]: # Keep it short for invitation
        bbox = draw.textbbox((0, 0), line, font=body_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), line, font=body_font, fill="#5a5a5a")
        current_y += 45

    # 6. Chief Guest (Special highlight)
    if event_data.chief_guest and event_data.chief_guest != "Not Provided":
        current_y += 60
        cg_label = "Chief Guest"
        bbox = draw.textbbox((0, 0), cg_label, font=label_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), cg_label, font=label_font, fill="#8b4513")
        current_y += 50
        
        cg_val = event_data.chief_guest
        bbox = draw.textbbox((0, 0), cg_val, font=italic_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), cg_val, font=italic_font, fill="#1a1a1a")
        current_y += 80

    # Decorative divider
    current_y = height - 250
    draw.line([width*0.25, current_y, width*0.75, current_y], fill="#c4a484", width=1)
    current_y += 40

    # 7. Coordinators & Convenor
    coord_text = f"Coordinators: {', '.join(event_data.coordinators)}" if event_data.coordinators else ""
    if coord_text:
        bbox = draw.textbbox((0, 0), coord_text, font=footer_font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) / 2, current_y), coord_text, font=footer_font, fill="#5a5a5a")
        current_y += 40
        
    convenor_text = f"Convenor: {event_data.convenor}"
    bbox = draw.textbbox((0, 0), convenor_text, font=footer_font)
    w = bbox[2] - bbox[0]
    draw.text(((width - w) / 2, current_y), convenor_text, font=footer_font, fill="#5a5a5a")

    # Ensure output directory exists
    output_dir = "generated"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, "invitation.png")
    image.save(output_path)
    
    return output_path
