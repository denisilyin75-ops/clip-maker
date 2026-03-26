"""Tests for the trimmer module."""

from unittest.mock import patch

from clip_maker.trimmer import trim


@patch("clip_maker.trimmer.run_ffmpeg")
def test_trim_with_copy_codec(mock_run):
    result = trim("input.mp4", "output.mp4", "00:01:00", "00:02:00")
    mock_run.assert_called_once_with(
        ["-i", "input.mp4", "-ss", "00:01:00", "-to", "00:02:00", "-c", "copy", "output.mp4"]
    )
    assert str(result) == "output.mp4"


@patch("clip_maker.trimmer.run_ffmpeg")
def test_trim_with_custom_codec(mock_run):
    result = trim("input.mp4", "output.mp4", "00:00:00", "00:00:30", codec="libx264")
    mock_run.assert_called_once_with(
        ["-i", "input.mp4", "-ss", "00:00:00", "-to", "00:00:30", "-c:v", "libx264", "output.mp4"]
    )
    assert str(result) == "output.mp4"
