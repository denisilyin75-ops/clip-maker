"""Video trimming functionality."""

from pathlib import Path

from .utils import run_ffmpeg


def trim(
    input_path: str,
    output_path: str,
    start: str,
    end: str,
    codec: str = "copy",
) -> Path:
    """Trim a video from start to end timestamp.

    Args:
        input_path: Path to the input video file.
        output_path: Path for the output clip.
        start: Start timestamp (HH:MM:SS).
        end: End timestamp (HH:MM:SS).
        codec: Video codec to use. Use 'copy' for fast trimming without re-encoding.

    Returns:
        Path to the created output file.
    """
    args = ["-i", input_path, "-ss", start, "-to", end]
    if codec == "copy":
        args.extend(["-c", "copy"])
    else:
        args.extend(["-c:v", codec])
    args.append(output_path)

    run_ffmpeg(args)
    return Path(output_path)
