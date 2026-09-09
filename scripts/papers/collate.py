#!/usr/bin/env python3
"""Collate cleaned submission data against downloaded paper PDFs (and,
optionally, a manually-transcribed authors list) into one JSON record per
accepted paper.

Matching accepted rows to files in --papers-dir is done by the leading
submission number in the filename (e.g. "static/papers/2026/11_EmbodiedRec_..."
matches CSV row number "11"), not by fuzzy title matching -- this repo's
downloaded-paper filenames are already numbered to match OpenReview's
submission numbers, so an exact-number match is both simpler and safer than
guessing from title text.

Input: the cleaned CSV from clean_csv.py, and (optionally) a papers
directory and/or a hand-transcribed authors CSV (see README.md -- author
names are NOT reliably extractable from the Program Chairs Console PDF, so
this script does not attempt it).
Output: defaults to the gitignored scripts/papers/tmp/ scratch dir.
"""

import argparse
import csv
import json
import os
import re
import sys

from common import tmp_path

FILENAME_NUMBER_RE = re.compile(r"^(\d+)_")


def load_papers_dir(papers_dir: str) -> dict:
    """Map submission number -> pdf filename, from a downloaded-papers dir."""
    by_number = {}
    if not papers_dir:
        return by_number
    if not os.path.isdir(papers_dir):
        print(f"warning: --papers-dir {papers_dir!r} does not exist, skipping", file=sys.stderr)
        return by_number
    for name in os.listdir(papers_dir):
        if not name.lower().endswith(".pdf"):
            continue
        m = FILENAME_NUMBER_RE.match(name)
        if not m:
            print(f"warning: {name!r} has no leading submission number, skipping", file=sys.stderr)
            continue
        by_number[m.group(1)] = name
    return by_number


def load_authors_csv(path: str) -> dict:
    """Map submission number -> list of author names, from a hand-filled CSV.

    Expected columns: number, authors (semicolon-separated names).
    """
    by_number = {}
    if not path:
        return by_number
    with open(path, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            number = row["number"].strip()
            names = [n.strip() for n in row.get("authors", "").split(";") if n.strip()]
            by_number[number] = names
    return by_number


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("clean_csv", help="Path to the cleaned CSV from clean_csv.py")
    parser.add_argument(
        "--papers-dir",
        default=None,
        help="Directory of downloaded paper PDFs, e.g. static/papers/2026 (optional)",
    )
    parser.add_argument(
        "--authors-csv",
        default=None,
        help="Hand-transcribed number,authors CSV (optional; see README.md)",
    )
    parser.add_argument(
        "--pdf-web-prefix",
        default="/papers/2026",
        help="Web path prefix to prepend to matched pdf filenames (default: /papers/2026)",
    )
    parser.add_argument(
        "-o",
        "--out",
        default=None,
        help="Output path (default: scripts/papers/tmp/collated.json)",
    )
    args = parser.parse_args()

    out_path = args.out or tmp_path("collated.json")
    pdfs_by_number = load_papers_dir(args.papers_dir)
    authors_by_number = load_authors_csv(args.authors_csv)

    with open(args.clean_csv, encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))

    accepted = [r for r in rows if r.get("decision", "").startswith("Accept")]

    records = []
    warnings = []
    matched_numbers = set()
    for row in accepted:
        number = row["number"].strip()
        pdf_name = pdfs_by_number.get(number)
        if pdf_name:
            matched_numbers.add(number)
            pdf_web_path = f"{args.pdf_web_prefix}/{pdf_name}"
        else:
            pdf_web_path = None
            warnings.append(f"no downloaded PDF found for #{number} ({row['title']!r})")

        authors = authors_by_number.get(number, [])
        if args.authors_csv and not authors:
            warnings.append(f"no authors transcribed for #{number} ({row['title']!r})")

        records.append(
            {
                "number": number,
                "title": row["title"],
                "abstract": row["abstract"],
                "decision": row["decision"],
                "authors": authors,
                "pdf": pdf_web_path,
            }
        )

    for number, pdf_name in pdfs_by_number.items():
        if number not in matched_numbers and number not in {r["number"] for r in accepted}:
            warnings.append(f"downloaded PDF {pdf_name!r} (#{number}) has no accepted CSV row")

    for warning in warnings:
        print(f"warning: {warning}", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"papers": records, "warnings": warnings}, f, indent=2)

    print(
        f"Wrote {len(records)} accepted papers ({len(warnings)} warnings) to {out_path}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
