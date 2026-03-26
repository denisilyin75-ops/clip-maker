"""Command-line interface for clip-maker."""

import argparse
import sys
from pathlib import Path

import yaml

from . import __version__
from .merger import merge
from .overlay import add_text_overlay
from .trimmer import trim


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="clip-maker",
        description="Create video clips from longer videos.",
    )
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # trim
    trim_parser = subparsers.add_parser("trim", help="Trim a video segment")
    trim_parser.add_argument("input", help="Input video file")
    trim_parser.add_argument("-s", "--start", required=True, help="Start timestamp (HH:MM:SS)")
    trim_parser.add_argument("-e", "--end", required=True, help="End timestamp (HH:MM:SS)")
    trim_parser.add_argument("-o", "--output", required=True, help="Output file path")
    trim_parser.add_argument("--codec", default="copy", help="Video codec (default: copy)")

    # merge
    merge_parser = subparsers.add_parser("merge", help="Merge multiple clips")
    merge_parser.add_argument("inputs", nargs="+", help="Input video files")
    merge_parser.add_argument("-o", "--output", required=True, help="Output file path")

    # overlay
    overlay_parser = subparsers.add_parser("overlay", help="Add text overlay")
    overlay_parser.add_argument("input", help="Input video file")
    overlay_parser.add_argument("--text", required=True, help="Text to overlay")
    overlay_parser.add_argument("--position", default="bottom", choices=["top", "center", "bottom"])
    overlay_parser.add_argument("--font-size", type=int, default=48, help="Font size")
    overlay_parser.add_argument("--font-color", default="white", help="Font color")
    overlay_parser.add_argument("-o", "--output", required=True, help="Output file path")

    # batch
    batch_parser = subparsers.add_parser("batch", help="Batch process from config file")
    batch_parser.add_argument("config", help="YAML config file")

    return parser


def run_batch(config_path: str) -> None:
    """Run batch processing from a YAML config file."""
    path = Path(config_path)
    if not path.exists():
        print(f"Error: config file not found: {config_path}", file=sys.stderr)
        sys.exit(1)

    with open(path) as f:
        config = yaml.safe_load(f)

    clips = config.get("clips", [])
    if not clips:
        print("No clips defined in config.", file=sys.stderr)
        sys.exit(1)

    for i, clip in enumerate(clips, 1):
        input_file = clip["input"]
        output_file = clip["output"]
        start = clip.get("start")
        end = clip.get("end")

        print(f"[{i}/{len(clips)}] Processing: {output_file}")

        if start and end:
            trim(input_file, output_file, start, end)

        overlay_cfg = clip.get("overlay")
        if overlay_cfg:
            # If we already trimmed, use the output as input for overlay
            overlay_input = output_file if (start and end) else input_file
            overlay_output = output_file if (start and end) else output_file
            if start and end:
                # Re-encode with overlay applied to trimmed file
                temp = f"{output_file}.tmp.mp4"
                add_text_overlay(
                    overlay_input,
                    temp,
                    text=overlay_cfg["text"],
                    position=overlay_cfg.get("position", "bottom"),
                )
                Path(temp).rename(output_file)
            else:
                add_text_overlay(
                    overlay_input,
                    overlay_output,
                    text=overlay_cfg["text"],
                    position=overlay_cfg.get("position", "bottom"),
                )

    print("Batch processing complete.")


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "trim":
        trim(args.input, args.output, args.start, args.end, args.codec)
        print(f"Trimmed clip saved to {args.output}")

    elif args.command == "merge":
        merge(args.inputs, args.output)
        print(f"Merged clip saved to {args.output}")

    elif args.command == "overlay":
        add_text_overlay(
            args.input, args.output, args.text,
            args.position, args.font_size, args.font_color,
        )
        print(f"Overlay clip saved to {args.output}")

    elif args.command == "batch":
        run_batch(args.config)


if __name__ == "__main__":
    main()
