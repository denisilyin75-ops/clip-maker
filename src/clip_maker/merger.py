"""Video merging functionality."""

import tempfile
from pathlib import Path

from .utils import run_ffmpeg


def merge(input_paths: list[str], output_path: str) -> Path:
    """Merge multiple video clips into one.

    Uses FFmpeg's concat demuxer for fast concatenation of compatible files.

    Args:
        input_paths: List of paths to input video files.
        output_path: Path for the merged output file.

    Returns:
        Path to the created output file.
    """
    if len(input_paths) < 2:
        raise ValueError("At least two input files are required for merging.")

    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        for path in input_paths:
            f.write(f"file '{path}'\n")
        concat_list = f.name

    try:
        run_ffmpeg(["-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", output_path])
    finally:
        Path(concat_list).unlink(missing_ok=True)

    return Path(output_path)
