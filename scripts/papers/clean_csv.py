#!/usr/bin/env python3
"""Re-serialize an OpenReview "Submission Status" CSV export into a portable,
predictable form.

Note: Python's csv module already parses the raw export correctly -- RFC
4180 allows real newlines inside quoted fields, so nothing is structurally
"broken". The problem is that naive tools (Excel/Numbers, line-based greps)
choke on those embedded newlines. This script collapses embedded
newlines/extra whitespace in every field to single spaces and re-writes with
consistent quoting, so the output behaves in any tool.

Input: a path to the raw CSV export (kept OUTSIDE the repo -- it covers the
full submission pool, including rejected papers, scores, and reviewer
identities, which is confidential; see scripts/papers/README.md).
Output: defaults to the gitignored scripts/papers/tmp/ scratch dir.
"""

import argparse
import csv
import re
import sys

from common import tmp_path

WHITESPACE_RUN = re.compile(r"\s+")


def clean_field(value: str) -> str:
    return WHITESPACE_RUN.sub(" ", value).strip()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_csv", help="Path to the raw submission-status CSV export")
    parser.add_argument(
        "-o",
        "--out",
        default=None,
        help="Output path (default: scripts/papers/tmp/submissions.clean.csv)",
    )
    args = parser.parse_args()

    out_path = args.out or tmp_path("submissions.clean.csv")

    with open(args.input_csv, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = [{k: clean_field(v or "") for k, v in row.items()} for row in reader]

    with open(out_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} rows to {out_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
