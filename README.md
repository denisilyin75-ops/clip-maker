# Clip Maker

A command-line tool for creating video clips from longer videos. Trim, merge, add text overlays, and export clips with ease.

## Features

- Trim video segments by start/end timestamps
- Merge multiple clips into one
- Add text overlays and subtitles
- Adjust resolution, FPS, and codec settings
- Batch processing from a config file
- Support for popular formats (MP4, MKV, AVI, MOV, WebM)

## Requirements

- Python 3.10+
- FFmpeg installed and available in PATH

## Installation

```bash
git clone https://github.com/denisilyin75-ops/clip-maker.git
cd clip-maker
pip install -e .
```

## Quick Start

```bash
# Trim a clip
clip-maker trim input.mp4 -s 00:01:30 -e 00:02:45 -o output.mp4

# Merge clips
clip-maker merge clip1.mp4 clip2.mp4 -o merged.mp4

# Add text overlay
clip-maker overlay input.mp4 --text "Hello World" --position bottom -o output.mp4

# Batch process from config
clip-maker batch config.yaml
```

## Configuration

Create a YAML config file for batch processing:

```yaml
clips:
  - input: video.mp4
    start: "00:01:00"
    end: "00:02:30"
    output: clip1.mp4
  - input: video.mp4
    start: "00:05:00"
    end: "00:06:00"
    overlay:
      text: "Scene 2"
      position: top
    output: clip2.mp4
```

## Project Structure

```
clip-maker/
├── src/
│   └── clip_maker/
│       ├── __init__.py
│       ├── cli.py          # CLI entry point
│       ├── trimmer.py      # Video trimming logic
│       ├── merger.py       # Clip merging logic
│       ├── overlay.py      # Text overlay logic
│       └── utils.py        # Shared utilities
├── tests/
│   ├── __init__.py
│   ├── test_trimmer.py
│   ├── test_merger.py
│   └── test_overlay.py
├── pyproject.toml
└── README.md
```

## License

MIT
