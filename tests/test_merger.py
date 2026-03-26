"""Tests for the merger module."""

import pytest
from unittest.mock import patch

from clip_maker.merger import merge


@patch("clip_maker.merger.run_ffmpeg")
def test_merge_two_files(mock_run):
    result = merge(["a.mp4", "b.mp4"], "merged.mp4")
    assert mock_run.called
    assert str(result) == "merged.mp4"


def test_merge_requires_at_least_two_files():
    with pytest.raises(ValueError, match="At least two"):
        merge(["only_one.mp4"], "out.mp4")
