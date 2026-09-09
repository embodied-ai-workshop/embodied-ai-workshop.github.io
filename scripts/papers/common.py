"""Shared helpers for the scripts/papers/ pipeline."""

import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TMP_DIR = os.path.join(SCRIPT_DIR, "tmp")


def tmp_path(filename: str) -> str:
    """Return a path under the gitignored scratch dir, creating it if needed.

    Only derived/public output belongs here (cleaned CSVs, extracted author
    lists, collated JSON, generated JSX) -- never raw confidential exports.
    See scripts/papers/README.md.
    """
    os.makedirs(TMP_DIR, exist_ok=True)
    return os.path.join(TMP_DIR, filename)


def escape_jsx_attr(text: str) -> str:
    """Escape a string for use inside a double-quoted JSX attribute literal.

    JSX decodes HTML entities in quoted attribute literals the same way it
    does in text children (see &amp; used elsewhere in this repo's pages),
    so a literal `"` must become `&quot;` or it would terminate the
    attribute early. Curly braces are safe here since `title="..."` is a
    plain quoted literal, not a `{...}` JS expression.
    """
    return text.replace("&", "&amp;").replace('"', "&quot;")
