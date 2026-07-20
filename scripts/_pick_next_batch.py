"""Pick next missing vocab illustration slugs (all POS) for full card coverage."""
import json
import sys
from pathlib import Path

root = Path(r"D:/Projects/KKoreaHangul")
n = int(sys.argv[1]) if len(sys.argv) > 1 else 24
cat = json.loads((root / "docs/vocab-illustration-prompts.json").read_text(encoding="utf-8"))
have = {p.stem for p in (root / "assets/illustrations/vocab").glob("*.webp")}

# Only skip content that is unsafe or meaningless to illustrate.
SKIP = {
    "n-a",
    "aids",
    "gun",
    "snot-nasal-discharge",
    "even-if-for-example-diarrhea",
    "chest-breast",
}

POS_PRI = {"n": 0, "v": 1, "adj": 2}

cands = []
for e in cat["items"]:
    s = e["slug"]
    if s in have or s in SKIP:
        continue
    pos = e.get("pos") or "n"
    meaning = (e.get("meaning") or "").strip()
    if not meaning:
        continue
    # Prefer shorter, clearer meanings; nouns first, then verbs, then adjectives.
    cands.append((POS_PRI.get(pos, 3), len(meaning), s.count("-"), s, meaning, pos))

cands.sort()
out = [r[3] for r in cands[:n]]
(root / "scripts/_batch_slugs.txt").write_text("\n".join(out), encoding="utf-8")
print("webp", len(have), "/", cat["count"], "batch", len(out), "cands", len(cands))
for r in cands[:n]:
    print(f"{r[3]} | {r[5]} | {r[4]}")
