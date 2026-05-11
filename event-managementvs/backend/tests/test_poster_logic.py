import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.poster_service import generate_poster_service
from app.models.schemas import EventCircular

def test_poster_generation():
    dummy_data = EventCircular(
        event_title="AI & Quantum Computing Workshop",
        date_time="October 24, 2026 | 10:00 AM - 4:00 PM",
        venue="Tech Hub, Room 402, Science Block",
        event_description="Join us for an immersion into the future of technology. Learn how AI and Quantum Computing are merging to solve the world's most complex problems. This workshop covers basic principles to advanced applications.",
        number_of_participants="100",
        event_type="Workshop",
        duration="6 hours",
        rules=["Bring your own laptop", "Basic Python knowledge required"],
        judging_criteria=["Not Applicable"],
        coordinators=["John Doe", "Jane Smith"],
        convenor="Dr. Alan Turing"
    )
    
    print("Generating poster...")
    try:
        output_path = generate_poster_service(dummy_data)
        if os.path.exists(output_path):
            print(f"Success! Poster generated at: {output_path}")
            print(f"File size: {os.path.getsize(output_path)} bytes")
        else:
            print("Failed: Poster file not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_poster_generation()
