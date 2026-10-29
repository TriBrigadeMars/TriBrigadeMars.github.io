#!/usr/bin/env python3
"""Lint the portfolio site against facts.json privacy and evidence rules.

Zero third-party dependencies. Run from anywhere:
    python3 scripts/check_facts.py [repo_root]

Resume PDF scanning uses pdftotext when available; without it the PDF rules
are reported as skipped warnings.
"""

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

FACTS = "facts.json"
PAGE = "index.html"


def compile_rules(entries: list) -> list:
    return [
        (entry["id"], entry.get("reason", ""), [re.compile(p) for p in entry["patterns"]])
        for entry in entries
    ]


def load_facts(root: Path) -> dict:
    return json.loads((root / FACTS).read_text(encoding="utf-8"))


def scan_forbidden(text: str, rules: list, tag: str, results: list) -> None:
    for rule_id, reason, regexes in rules:
        for regex in regexes:
            if regex.search(text):
                results.append(f"✗ FAIL [{rule_id}] {tag}: matched /{regex.pattern}/ — {reason}")


def scan_must_html(html: str, rules: list, results: list) -> None:
    for rule_id, reason, regexes in rules:
        for regex in regexes:
            if not regex.search(html):
                results.append(f"✗ FAIL [{rule_id}] {PAGE}: missing /{regex.pattern}/ — {reason}")


def scan_pdf(root: Path, rules: list, results: list) -> None:
    pdf_path = root / "assets" / "resume.pdf"
    if not pdf_path.is_file():
        results.append(f"⚠ skip: {pdf_path} missing")
        return
    if shutil.which("pdftotext") is None:
        results.append("⚠ skip: PDF rules unenforced (pdftotext not installed)")
        return
    with tempfile.NamedTemporaryFile(suffix=".txt") as tmp:
        proc = subprocess.run(["pdftotext", "-layout", str(pdf_path), tmp.name], capture_output=True)
        if proc.returncode != 0:
            results.append("⚠ skip: pdftotext failed on resume.pdf")
            return
        text = Path(tmp.name).read_text(encoding="utf-8", errors="replace")
    scan_forbidden(text, rules, "resume.pdf", results)


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else Path.cwd())
    facts_path = root / FACTS
    page_path = root / PAGE
    if not facts_path.is_file() or not page_path.is_file():
        print(f"✗ missing {facts_path if not facts_path.is_file() else page_path}")
        return 1

    rules = load_facts(root)["rules"]
    results: list = []

    html = page_path.read_text(encoding="utf-8")
    scan_forbidden(html, compile_rules(rules.get("forbidden_html", [])), PAGE, results)
    scan_must_html(html, compile_rules(rules.get("must_match_html", [])), results)
    scan_pdf(root, compile_rules(rules.get("forbidden_pdf", [])), results)

    if not results:
        print("✓ PASS — all privacy and evidence facts hold")
        return 0
    for line in results:
        print(line)
    errors = sum(1 for line in results if line.startswith("✗"))
    print(f"{errors} error(s), {len(results) - errors} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
