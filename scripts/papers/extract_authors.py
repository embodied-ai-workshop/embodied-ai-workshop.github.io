#!/usr/bin/env python3
"""Extract author names from one or more Program Chairs Console PDF exports,
self-checked against the already-cleaned submission CSV.

The console PDF has no reliable structural markers (no font-weight info
survives text extraction) to separate a submission's title from its author
list, so this script does not trust its own text reconstruction blindly.
Instead, for each submission number it concatenates all text between the
number and the "EAI, Reviewers, Authors" marker, and requires that text to
start with an exact match (whitespace-normalized) of the *known* title from
the CSV -- which is the trusted source, not the PDF. Only the remainder
after that matched title prefix is kept as the author list. Any submission
whose PDF text doesn't start with its CSV title is reported as a mismatch
and left out of the output entirely, for manual review -- this script never
guesses at a boundary it can't verify.

(A column-width bug in an earlier version of this pipeline caused every
submission's title/author split to look unrecoverable -- the left-column
word cutoff was hardcoded and clipped a handful of short trailing words
like "as"/"in"/"for" that happened to sit right at the column edge. Fixing
the cutoff to be derived per-page from the actual middle-column header
position resolved every case in the real 2026 export -- see README.md.)

You can pass more than one PDF (OpenReview sometimes exports the console in
multiple pieces, e.g. a partial re-export covering only the last few
submissions) -- records are merged by submission number.

Input: one or more raw Program Chairs Console PDF exports (kept OUTSIDE the
repo), and the cleaned CSV from clean_csv.py.
Output: defaults to the gitignored scripts/papers/tmp/ scratch dir, in the
`number,authors` format collate.py's --authors-csv expects.
"""

import argparse
import csv
import re
import subprocess
import sys
import tempfile

from common import tmp_path

DASH_CHARS = ("-", "–", "—")  # -, en dash, em dash
MARKER_TEXT = "EAI, Reviewers, Authors"
MID_COLUMN_ANCHORS = ("Official", "Average", "Decision")


def extract_words_by_page(pdf_path: str):
    with tempfile.NamedTemporaryFile(suffix=".xml") as tmp:
        subprocess.run(["pdftotext", "-bbox-layout", pdf_path, tmp.name], check=True)
        with open(tmp.name, encoding="utf-8") as f:
            data = f.read()

    page_re = re.compile(r'<page width="[\d.]+" height="[\d.]+">(.*?)</page>', re.S)
    word_re = re.compile(
        r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>'
    )
    return [
        [(float(x0), float(y0), float(x1), float(y1), t) for x0, y0, x1, y1, t in word_re.findall(ptext)]
        for ptext in page_re.findall(data)
    ]


def rows_from_words(words, row_tolerance=3.0):
    """Group (x, y, text) words into visual rows by proximity in y."""
    words = sorted(words, key=lambda w: (w[1], w[0]))
    rows, current_row, current_y = [], [], None
    for x, y, t in words:
        if current_y is None or abs(y - current_y) <= row_tolerance:
            current_row.append((x, y, t))
            current_y = current_y if current_y is not None else y
        else:
            rows.append(current_row)
            current_row, current_y = [(x, y, t)], y
    if current_row:
        rows.append(current_row)
    return rows


def join_words(tokens):
    """Join word tokens, keeping line-wrap breaks at a trailing dash glued
    (e.g. ["Cloud–", "Edge"] -> "Cloud–Edge", not "Cloud– Edge")."""
    out = ""
    for t in tokens:
        if not out:
            out = t
        elif out[-1] in DASH_CHARS:
            out += t
        else:
            out += " " + t
    return out


def extract_raw_blocks(pdf_path: str) -> dict:
    """Return {submission_number: raw joined text between the number and the
    "EAI, Reviewers, Authors" marker} for every submission in this PDF."""
    records = {}
    for page_words in extract_words_by_page(pdf_path):
        mid_starts = [x0 for x0, y0, x1, y1, t in page_words if t in MID_COLUMN_ANCHORS]
        x_cut = (min(mid_starts) - 2) if mid_starts else 290
        left_words = [(x0, y0, t) for x0, y0, x1, y1, t in page_words if x0 < x_cut]

        rows = rows_from_words(left_words)
        header_end = 0
        for i, row in enumerate(rows):
            texts = [t for _, _, t in sorted(row)]
            if texts[:1] == ["#"] or " ".join(texts).strip() == "# Submission Summary":
                header_end = i + 1
        rows = rows[header_end:]

        current_number, pending_tokens, skip_next_row = None, [], False
        for row in rows:
            texts = [t for _, _, t in sorted(row)]
            row_text = " ".join(texts).strip()
            if skip_next_row:
                skip_next_row = False
                continue
            if row_text == MARKER_TEXT:
                if current_number is not None:
                    records[current_number] = join_words(pending_tokens)
                current_number, pending_tokens = None, []
                skip_next_row = True  # the venue line right after the marker
                continue
            if texts and texts[0].isdigit() and current_number is None:
                current_number = texts[0]
                pending_tokens.extend(texts[1:])
            else:
                pending_tokens.extend(texts)
    return records


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_author_names(authors_text: str) -> list:
    """Split the PDF's comma-joined author list into individual names.

    collate.py's --authors-csv expects `;`-separated names (a name can
    itself contain a comma-free "Firstname M. Lastname" pattern, but not a
    literal comma), so this must not just pass the comma-joined text
    through -- that collapses every paper's author list into a single
    dict key downstream instead of one key per author.
    """
    return [n.strip() for n in authors_text.split(",") if n.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("clean_csv", help="Path to the cleaned CSV from clean_csv.py")
    parser.add_argument(
        "console_pdfs", nargs="+", help="One or more Program Chairs Console PDF exports"
    )
    parser.add_argument(
        "-o",
        "--out",
        default=None,
        help="Output path (default: scripts/papers/tmp/authors.csv)",
    )
    args = parser.parse_args()

    out_path = args.out or tmp_path("authors.csv")

    with open(args.clean_csv, encoding="utf-8", newline="") as f:
        titles = {row["number"]: row["title"] for row in csv.DictReader(f)}

    raw_blocks = {}
    for pdf_path in args.console_pdfs:
        raw_blocks.update(extract_raw_blocks(pdf_path))

    rows, mismatches = [], []
    for number, title in titles.items():
        block = raw_blocks.get(number)
        if block is None:
            continue  # not in this PDF export (e.g. rejected, or a partial export)
        normalized_block, normalized_title = normalize(block), normalize(title)
        if not normalized_block.startswith(normalized_title):
            mismatches.append((number, normalized_title, normalized_block))
            continue
        authors_text = normalized_block[len(normalized_title) :].strip(" ,")
        names = split_author_names(authors_text)
        rows.append({"number": number, "authors": "; ".join(names)})

    for number, expected, got in mismatches:
        print(f"warning: #{number} title mismatch, skipped -- review manually", file=sys.stderr)
        print(f"    expected title: {expected}", file=sys.stderr)
        print(f"    pdf text:       {got}", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["number", "authors"])
        writer.writeheader()
        writer.writerows(rows)

    print(
        f"Wrote {len(rows)} rows ({len(mismatches)} mismatches skipped) to {out_path}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
