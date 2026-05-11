from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.schemas import EventInput, EventCircular
from app.services.circular_service import generate_circular_service
from app.services.docx_generator import create_circular_docx
from app.services.poster_service import generate_poster_service
from app.services.invitation_service import generate_invitation_service
from app.services.reel_service import generate_reel_service
import os
import tempfile

router = APIRouter()

@router.post("/generate-circular")
async def generate_circular(input_data: EventInput):
    try:
        # Generate structured content using LLM
        circular = await generate_circular_service(input_data.final_text)
        
        # Create temporary file for the Word document
        temp_dir = tempfile.gettempdir()
        output_filename = "event_circular.docx"
        output_path = os.path.join(temp_dir, output_filename)
        
        # Generate Word document
        create_circular_docx(circular, output_path)
        
        # Return as downloadable file
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-poster")
async def generate_poster(input_data: EventInput):
    try:
        # 1. Reuse Gemini extraction logic
        event_data = await generate_circular_service(input_data.final_text)
        
        # 2. Generate poster image
        poster_path = generate_poster_service(event_data)
        
        # 3. Return the generated PNG
        if os.path.exists(poster_path):
            return FileResponse(
                path=poster_path,
                filename="poster.png",
                media_type="image/png"
            )
        else:
            raise HTTPException(status_code=500, detail="Poster generation failed.")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-invitation")
async def generate_invitation(input_data: EventInput):
    try:
        # 1. Reuse Gemini extraction logic
        event_data = await generate_circular_service(input_data.final_text)
        
        # 2. Generate invitation image
        invitation_path = generate_invitation_service(event_data)
        
        # 3. Return the generated PNG
        if os.path.exists(invitation_path):
            return FileResponse(
                path=invitation_path,
                filename="invitation.png",
                media_type="image/png"
            )
        else:
            raise HTTPException(status_code=500, detail="Invitation generation failed.")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-reel")
async def generate_reel(input_data: EventInput):
    try:
        # 1. Reuse Gemini extraction logic
        event_data = await generate_circular_service(input_data.final_text)
        
        # 2. Generate reel video
        reel_path = generate_reel_service(event_data)
        
        # 3. Return the generated video URL
        if os.path.exists(reel_path):
            # Construct URL for the static file
            video_url = f"http://127.0.0.1:8000/generated/{os.path.basename(reel_path)}"
            return {"video_url": video_url}
        else:
            raise HTTPException(status_code=500, detail="Reel generation failed.")
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok"}
