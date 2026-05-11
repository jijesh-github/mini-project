"""
seed_templates.py
Run once to insert sample Fabric.js templates into the templates table.

Usage:
    cd backend
    python seed_templates.py
"""
import sys, os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.models.template import Template

TEMPLATES = [
    {
        "name": "Modern Minimal Poster",
        "category": "poster",
        "fabric_json": {
            "version": "5.3.0",
            "objects": [
                {
                    "type": "rect",
                    "left": 0, "top": 0,
                    "width": 600, "height": 800,
                    "fill": "#0f172a",
                    "selectable": False
                },
                {
                    "type": "text",
                    "text": "EVENT TITLE",
                    "left": 60, "top": 160,
                    "fontSize": 52,
                    "fontFamily": "Inter",
                    "fontWeight": "bold",
                    "fill": "#ffffff",
                    "customType": "title"
                },
                {
                    "type": "text",
                    "text": "Your event description goes here.",
                    "left": 60, "top": 280,
                    "fontSize": 22,
                    "fontFamily": "Inter",
                    "fill": "#94a3b8",
                    "customType": "description"
                },
                {
                    "type": "text",
                    "text": "Date TBD",
                    "left": 60, "top": 680,
                    "fontSize": 20,
                    "fontFamily": "Inter",
                    "fill": "#6366f1",
                    "customType": "date"
                }
            ]
        }
    },
    {
        "name": "Neon Party Poster",
        "category": "poster",
        "fabric_json": {
            "version": "5.3.0",
            "objects": [
                {
                    "type": "rect",
                    "left": 0, "top": 0,
                    "width": 600, "height": 800,
                    "fill": "#09090b",
                    "selectable": False
                },
                {
                    "type": "text",
                    "text": "PARTY TITLE",
                    "left": 50, "top": 200,
                    "fontSize": 64,
                    "fontFamily": "Inter",
                    "fontWeight": "bold",
                    "fill": "#a855f7",
                    "customType": "title"
                },
                {
                    "type": "text",
                    "text": "Event description here.",
                    "left": 50, "top": 320,
                    "fontSize": 20,
                    "fontFamily": "Inter",
                    "fill": "#e2e8f0",
                    "customType": "description"
                },
                {
                    "type": "text",
                    "text": "Date TBD",
                    "left": 50, "top": 700,
                    "fontSize": 22,
                    "fontFamily": "Inter",
                    "fill": "#ec4899",
                    "customType": "date"
                }
            ]
        }
    },
    {
        "name": "Classic Wedding Invitation",
        "category": "invitation",
        "fabric_json": {
            "version": "5.3.0",
            "objects": [
                {
                    "type": "rect",
                    "left": 0, "top": 0,
                    "width": 600, "height": 800,
                    "fill": "#fdf6e3",
                    "selectable": False
                },
                {
                    "type": "text",
                    "text": "You Are Invited",
                    "left": 80, "top": 120,
                    "fontSize": 44,
                    "fontFamily": "Serif",
                    "fontStyle": "italic",
                    "fill": "#78350f",
                    "customType": "title"
                },
                {
                    "type": "text",
                    "text": "Join us to celebrate this special occasion.",
                    "left": 60, "top": 240,
                    "fontSize": 18,
                    "fontFamily": "Serif",
                    "fill": "#92400e",
                    "customType": "description"
                },
                {
                    "type": "text",
                    "text": "Date TBD",
                    "left": 60, "top": 680,
                    "fontSize": 20,
                    "fontFamily": "Serif",
                    "fill": "#b45309",
                    "customType": "date"
                }
            ]
        }
    },
    {
        "name": "Tech Meetup Invitation",
        "category": "invitation",
        "fabric_json": {
            "version": "5.3.0",
            "objects": [
                {
                    "type": "rect",
                    "left": 0, "top": 0,
                    "width": 600, "height": 800,
                    "fill": "#1e293b",
                    "selectable": False
                },
                {
                    "type": "text",
                    "text": "TECH MEETUP",
                    "left": 50, "top": 150,
                    "fontSize": 56,
                    "fontFamily": "Inter",
                    "fontWeight": "bold",
                    "fill": "#38bdf8",
                    "customType": "title"
                },
                {
                    "type": "text",
                    "text": "Connect, learn and grow with fellow builders.",
                    "left": 50, "top": 280,
                    "fontSize": 20,
                    "fontFamily": "Inter",
                    "fill": "#94a3b8",
                    "customType": "description"
                },
                {
                    "type": "text",
                    "text": "Date TBD",
                    "left": 50, "top": 700,
                    "fontSize": 20,
                    "fontFamily": "Inter",
                    "fill": "#0ea5e9",
                    "customType": "date"
                }
            ]
        }
    }
]


def seed():
    db = SessionLocal()
    try:
        # Clear existing templates to apply updates
        db.query(Template).delete()
        db.commit()

        for t in TEMPLATES:
            # Inject width and height to the fabric_json if not yet present
            if "width" not in t["fabric_json"]:
                t["fabric_json"]["width"] = 600
            if "height" not in t["fabric_json"]:
                t["fabric_json"]["height"] = 800

            db.add(Template(**t))
        db.commit()
        print(f"[seed] Inserted {len(TEMPLATES)} templates successfully.")
    except Exception as e:
        db.rollback()
        print(f"[seed] ERROR: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
