"""Tests for utility functions."""

import pytest

from clip_maker.utils import format_timestamp, parse_timestamp


def test_parse_timestamp():
    assert parse_timestamp("00:00:00") == 0.0
    assert parse_timestamp("00:01:30") == 90.0
    assert parse_timestamp("01:00:00") == 3600.0
    assert parse_timestamp("01:30:45") == 5445.0


def test_parse_timestamp_invalid():
    with pytest.raises(ValueError, match="Invalid timestamp"):
        parse_timestamp("12:34")


def test_format_timestamp():
    assert format_timestamp(0) == "00:00:00.000"
    assert format_timestamp(90) == "00:01:30.000"
    assert format_timestamp(3661.5) == "01:01:01.500"
