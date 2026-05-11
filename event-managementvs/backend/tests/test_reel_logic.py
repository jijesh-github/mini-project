import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.reel_service import generate_reel_service
from app.models.schemas import EventCircular

def test_reel_generation():
    dummy_data = EventCircular(
        event_title="Future Tech Hackathon 2026",
        date_time="December 15-17, 2026 | 24/7",
        venue="Innovation Lab, Block C",
        event_description="A 48-hour hackathon where students build innovative solutions for real-world problems. Great prizes and mentorship available.",
        number_of_participants="200",
        event_type="Hackathon",
        duration="48 hours",
        rules=["Teams of 2-4 members", "Original code only", "Presentations on final day"],
        judging_criteria=["Innovation", "Functionality", "UI/UX", "Presentation"],
        coordinators=["Zoe Smith", "Mike Ross"],
        convenor="Dr. Victor Von Doom",
        chief_guest="Elon Musk (Expected)"
    )
    
    print("Generating reel video...")
    try:
        output_path = generate_reel_service(dummy_data)
        if os.path.exists(output_path):
            print(f"Success! Reel generated at: {output_path}")
            print(f"File size: {os.path.getsize(output_path)} bytes")
        else:
            print("Failed: Reel file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_reel_generation()
