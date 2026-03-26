"""Shared utilities for clip-maker."""

import shutil
import subprocess


def check_ffmpeg() -> str:
    """Check that FFmpeg is installed and return its path."""
    path = shutil.which("ffmpeg")
    if path is None:
        raise RuntimeError(
            "FFmpeg not found. Please install FFmpeg and ensure it is in your PATH."
        )
    return path


def run_ffmpeg(args: list[str]) -> subprocess.CompletedProcess[str]:
    """Run an FFmpeg command and return the result."""
    ffmpeg = check_ffmpeg()
    cmd = [ffmpeg, "-y", *args]
    return subprocess.run(cmd, capture_output=True, text=True, check=True)


def parse_timestamp(ts: str) -> float:
    """Parse a timestamp string (HH:MM:SS or HH:MM:SS.ms) to seconds."""
    parts = ts.split(":")
    if len(parts) != 3:
        raise ValueError(f"Invalid timestamp format: {ts}. Expected HH:MM:SS")
    hours, minutes, seconds = parts
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def format_timestamp(seconds: float) -> str:
    """Format seconds to HH:MM:SS.mmm timestamp."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"
