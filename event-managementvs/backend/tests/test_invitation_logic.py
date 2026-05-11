import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.invitation_service import generate_invitation_service
from app.models.schemas import EventCircular

def test_invitation_generation():
    dummy_data = EventCircular(
        event_title="Global Sustainability Summit 2026",
        date_time="November 12, 2026 | 9:00 AM - 5:00 PM",
        venue="Grand Ballroom, Windsor Plaza",
        event_description="A gathering of world leaders and innovators to discuss sustainable solutions for the next decade. The summit features keynotes, workshops, and networking sessions.",
        number_of_participants="500",
        event_type="Summit",
        duration="8 hours",
        rules=["Business formal attire required", "Pre-registration mandatory"],
        judging_criteria=["Not Applicable"],
        coordinators=["Alice Green", "Bob White"],
        convenor="Ms. Sarah Jenkins",
        chief_guest="Honorable Minister of Environment, Dr. Emily Stone"
    )
    
    print("Generating invitation...")
    try:
        output_path = generate_invitation_service(dummy_data)
        if os.path.exists(output_path):
            print(f"Success! Invitation generated at: {output_path}")
            print(f"File size: {os.path.getsize(output_path)} bytes")
        else:
            print("Failed: Invitation file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_invitation_generation()
