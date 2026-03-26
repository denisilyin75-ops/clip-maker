import uuid
import subprocess
import json
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(prefix="/api/upload", tags=["upload"])

STORAGE_DIR = Path(__file__).parent.parent / "storage"
UPLOADS_DIR = STORAGE_DIR / "uploads"

ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".wav", ".ogg", ".flac", ".m4a"}
MAX_FILE_SIZE = 500 * 1024 * 1024  # 500MB


def get_duration(filepath: Path) -> float:
    """Get audio duration in seconds via ffprobe."""
    result = subprocess.run(
        [
            "ffprobe", "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            str(filepath),
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffprobe failed: {result.stderr}")
    info = json.loads(result.stdout)
    return float(info["format"]["duration"])


def generate_waveform_peaks(filepath: Path, num_peaks: int = 500) -> list[float]:
    """Generate normalized waveform peaks (0..1) using ffmpeg."""
    # Extract raw PCM mono audio at 8kHz, 16-bit signed
    result = subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(filepath),
            "-ac", "1",           # mono
            "-ar", "8000",        # 8kHz sample rate
            "-f", "s16le",        # raw 16-bit signed little-endian
            "-acodec", "pcm_s16le",
            "pipe:1",
        ],
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg waveform extraction failed: {result.stderr.decode()}")

    raw = result.stdout
    if len(raw) < 2:
        return [0.0] * num_peaks

    # Convert raw bytes to samples
    import struct
    num_samples = len(raw) // 2
    samples = struct.unpack(f"<{num_samples}h", raw[:num_samples * 2])

    # Divide into buckets and take peak of each
    bucket_size = max(1, num_samples // num_peaks)
    peaks: list[float] = []
    max_val = 32768.0

    for i in range(num_peaks):
        start = i * bucket_size
        end = min(start + bucket_size, num_samples)
        if start >= num_samples:
            peaks.append(0.0)
            continue
        bucket = samples[start:end]
        peak = max(abs(s) for s in bucket) / max_val
        peaks.append(min(peak, 1.0))

    return peaks


@router.post("/audio")
async def upload_audio(file: UploadFile = File(...)):
    # Validate extension
    original_name = file.filename or "audio.mp3"
    ext = Path(original_name).suffix.lower()
    if ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(400, f"Unsupported audio format: {ext}")

    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOADS_DIR / unique_name

    # Save file
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 500MB)")
    dest.write_bytes(content)

    try:
        duration = get_duration(dest)
        waveform_data = generate_waveform_peaks(dest)
    except Exception as e:
        dest.unlink(missing_ok=True)
        raise HTTPException(500, f"Failed to process audio: {e}")

    return {
        "filename": unique_name,
        "originalName": original_name,
        "duration": duration,
        "waveformData": waveform_data,
    }
