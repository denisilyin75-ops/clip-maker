"""Tests for the overlay module."""

import pytest
from unittest.mock import patch

from clip_maker.overlay import add_text_overlay


@patch("clip_maker.overlay.run_ffmpeg")
def test_add_text_overlay_bottom(mock_run):
    result = add_text_overlay("input.mp4", "output.mp4", "Hello", position="bottom")
    assert mock_run.called
    assert str(result) == "output.mp4"


@patch("clip_maker.overlay.run_ffmpeg")
def test_add_text_overlay_top(mock_run):
    result = add_text_overlay("input.mp4", "output.mp4", "Title", position="top")
    assert mock_run.called
    assert str(result) == "output.mp4"


def test_invalid_position():
    with pytest.raises(ValueError, match="Invalid position"):
        add_text_overlay("input.mp4", "output.mp4", "text", position="left")
