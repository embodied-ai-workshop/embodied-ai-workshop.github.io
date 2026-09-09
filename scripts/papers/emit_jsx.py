#!/usr/bin/env python3
"""Emit the `acceptedPapers` JSX array from collate.py's output, matching the
<Paper title=... abstract=... authors={{...}} affiliations={[]} pdf=.../>
shape used on every existing cvprYYYY.tsx page (see src/pages/cvpr2025.tsx).

This only prints the array literal -- paste it into the target page's
`let acceptedPapers = [...]` block by hand, so a human reviews the diff
before it goes live.

Input: collate.py's JSON output.
Output: defaults to stdout; pass --out to write into the gitignored
scripts/papers/tmp/ scratch dir instead.
"""

import argparse
import json
import sys

from common import escape_jsx_attr, tmp_path


def render_paper(paper: dict) -> str:
    title = escape_jsx_attr(paper["title"])
    abstract = escape_jsx_attr(paper["abstract"])
    authors = paper.get("authors") or []
    authors_obj = "{\n" + "".join(f'    "{escape_jsx_attr(name)}":[],\n' for name in authors) + "    }"
    pdf = paper.get("pdf") or ""
    return (
        "  <Paper\n"
        f'    title="{title}"\n'
        f'    abstract="{abstract}"\n'
        f"    authors={{{authors_obj}}}\n"
        "    affiliations={[]}\n"
        f'    pdf="{pdf}"\n'
        "    />,"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("collated_json", help="Path to collate.py's output JSON")
    parser.add_argument(
        "-o",
        "--out",
        default=None,
        help="Output path (default: stdout)",
    )
    args = parser.parse_args()

    with open(args.collated_json, encoding="utf-8") as f:
        data = json.load(f)

    papers = data["papers"]
    missing_pdf = [p["number"] for p in papers if not p.get("pdf")]
    missing_authors = [p["number"] for p in papers if not p.get("authors")]
    if missing_pdf:
        print(f"warning: papers missing a matched pdf: {', '.join(missing_pdf)}", file=sys.stderr)
    if missing_authors:
        print(f"warning: papers missing authors: {', '.join(missing_authors)}", file=sys.stderr)

    body = "let acceptedPapers = [\n" + "\n".join(render_paper(p) for p in papers) + "\n];\n"

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(body)
        print(f"Wrote {len(papers)} papers to {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(body)

    return 0


if __name__ == "__main__":
    sys.exit(main())
