"""Text overlay functionality."""

from pathlib import Path

from .utils import run_ffmpeg

POSITION_MAP = {
    "top": "x=(w-text_w)/2:y=40",
    "center": "x=(w-text_w)/2:y=(h-text_h)/2",
    "bottom": "x=(w-text_w)/2:y=h-text_h-40",
}


def add_text_overlay(
    input_path: str,
    output_path: str,
    text: str,
    position: str = "bottom",
    font_size: int = 48,
    font_color: str = "white",
) -> Path:
    """Add a text overlay to a video.

    Args:
        input_path: Path to the input video file.
        output_path: Path for the output file.
        text: Text string to overlay.
        position: Position of the text — 'top', 'center', or 'bottom'.
        font_size: Font size in pixels.
        font_color: Font color name or hex value.

    Returns:
        Path to the created output file.
    """
    if position not in POSITION_MAP:
        raise ValueError(f"Invalid position '{position}'. Choose from: {', '.join(POSITION_MAP)}")

    escaped_text = text.replace("'", "\\'").replace(":", "\\:")
    pos = POSITION_MAP[position]
    drawtext = f"drawtext=text='{escaped_text}':{pos}:fontsize={font_size}:fontcolor={font_color}"

    run_ffmpeg(["-i", input_path, "-vf", drawtext, "-c:a", "copy", output_path])
    return Path(output_path)
