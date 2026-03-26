from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

app = FastAPI(title="ClipMaker AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

storage_dir = Path(__file__).parent / "storage"
for sub in ["uploads", "projects", "thumbnails", "exports"]:
    (storage_dir / sub).mkdir(parents=True, exist_ok=True)

app.mount("/api/files/uploads", StaticFiles(directory=storage_dir / "uploads"), name="uploads")
app.mount("/api/files/thumbnails", StaticFiles(directory=storage_dir / "thumbnails"), name="thumbnails")
app.mount("/api/files/exports", StaticFiles(directory=storage_dir / "exports"), name="exports")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0"}
