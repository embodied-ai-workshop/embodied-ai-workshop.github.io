# Papers pipeline

Turns an OpenReview "Submission Status" CSV export (plus optionally the
downloaded accepted-paper PDFs) into the `acceptedPapers` JSX array pasted
into `src/pages/cvprYYYY.tsx` (see `src/pages/cvpr2025.tsx:466`).

## Confidentiality: raw inputs never live in this repo

The CSV export and the "Program Chairs Console" PDF cover the *full*
submission pool -- rejected papers, reviewer identities, scores -- which is
confidential, unlike the public accepted-paper PDFs already committed under
`static/papers/<year>/`. Every script here takes raw input paths as CLI
arguments; **never copy the raw CSV/PDF export into this repo**, gitignored
or not -- a `.gitignore` entry only stops *accidental* future commits, it
doesn't protect against a stray `git add -f` or a zipped checkout. Point the
scripts at wherever you keep those files outside the repo (e.g.
`~/Workspace/EmbodiedAI/Working/<year>/`).

All derived/intermediate output (cleaned CSV, collated JSON, generated JSX)
goes to `scripts/papers/tmp/`, which *is* gitignored -- it only ever holds
data already scoped to publicly-accepted papers, the same category as the
`.cache/`/`public` build directories Gatsby already ignores.

## Requirements

- Python 3 (stdlib only, no pip installs needed)
- [`pdftotext`](https://poppler.freedesktop.org/) on `PATH` (e.g. `brew install poppler`), for `extract_authors.py`

## Pipeline

```bash
cd scripts/papers

# 1. Re-serialize the raw CSV export with consistent quoting/whitespace.
#    (Python's csv module already parses the "broken" export correctly --
#    RFC 4180 allows real newlines inside quoted fields -- the actual
#    problem is that Excel/Numbers/naive line-based tools choke on them.
#    This just makes the file portable to those tools too.)
python3 clean_csv.py "/path/to/EAI-CVPRXX Submission Status.csv"
# -> tmp/submissions.clean.csv

# 2. Extract author names from the Program Chairs Console PDF export(s).
#    The CSV has NO author column -- OpenReview only exposes real names to
#    program chairs via this console. Pass every PDF export you have; a
#    partial re-export covering only some submissions is fine, records are
#    merged by submission number.
#    Each submission's title/author-list boundary is self-checked against
#    the trusted CSV title (whitespace-normalized exact-prefix match) --
#    any submission that doesn't match is skipped and reported on stderr
#    for manual review rather than guessed at. On the real 2026 export this
#    validated all 29 accepted papers with zero mismatches.
python3 extract_authors.py tmp/submissions.clean.csv \
  "/path/to/openreview.net-Program Chairs Console.pdf" \
  "/path/to/openreview.net-Program Chairs Console (1).pdf"
# -> tmp/authors.csv (number,authors -- semicolon-separated names)
# ALWAYS spot-check a few rows against the console PDF by eye before
# treating this as final -- it's self-checked against titles, not authors.

# 3. Collate accepted rows against downloaded PDFs (matched by the leading
#    submission number in the filename, e.g. "11_EmbodiedRec_....pdf" -> #11)
#    and the authors extracted in step 2.
python3 collate.py tmp/submissions.clean.csv \
  --papers-dir ../../static/papers/2026 \
  --authors-csv tmp/authors.csv
# -> tmp/collated.json (warnings for unmatched PDFs/authors printed to stderr)

# 4. Emit the acceptedPapers JSX array for review before pasting it in.
python3 emit_jsx.py tmp/collated.json --out tmp/acceptedPapers.jsx
```

Review `tmp/collated.json`'s warnings and `tmp/acceptedPapers.jsx` by hand,
then paste the array into the target `cvprYYYY.tsx`'s `acceptedPapers`
block.

## Why extract_authors.py's title cross-check matters

An early version of this script mis-tokenized the console PDF's columns (a
hardcoded left-column cutoff clipped a handful of short trailing words like
"as"/"in"/"for" that sit right at the column edge before a line wraps) and
looked, from a quick manual read, like the document was an unrecoverable
multi-column grid. It wasn't -- the actual bug was in the test, not the
PDF. The fix was to derive the column cutoff per page from the real
middle-column header position instead of a fixed constant. The lesson kept
here as code, not just as a comment: never trust a PDF-derived field for
something as consequential as public authorship without a cross-check
against an independently-trusted source (here, the CSV title) -- that
cross-check is what caught the bug during development, and it's what will
catch the next one.
