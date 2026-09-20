"""feature.jpg -> ASCII text band. Contrast is normalised first: the source is
very flat (68% near-white, darkest pixel 110), so a naive map renders a ghost."""
import sys
from PIL import Image

SRC = sys.argv[1]
COLS = int(sys.argv[2]) if len(sys.argv) > 2 else 200
LO_P = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
HI_P = float(sys.argv[4]) if len(sys.argv) > 4 else 98.0
GAMMA = float(sys.argv[5]) if len(sys.argv) > 5 else 2.2

# light -> dark. Weighted toward sparse glyphs so white areas stay empty.
RAMP = " .:-=+*#%@"

im = Image.open(SRC).convert("L")
W, H = im.size
# cell is 0.6em wide x 1.0em tall
rows = max(1, round(COLS * 0.6 * (H / W)))
im = im.resize((COLS, rows), Image.LANCZOS)

px = list(im.getdata())
s = sorted(px)
lo = s[int(len(s) * LO_P / 100)]
hi = s[min(len(s) - 1, int(len(s) * HI_P / 100))]
if hi <= lo:
    lo, hi = min(px), max(px)

out = []
for r in range(rows):
    line = []
    for c in range(COLS):
        v = px[r * COLS + c]
        t = (v - lo) / (hi - lo)          # 0 = darkest, 1 = lightest
        t = min(1.0, max(0.0, t))
        t = t ** GAMMA
        idx = int((1.0 - t) * (len(RAMP) - 1) + 0.5)   # invert: dark -> dense
        line.append(RAMP[idx])
    out.append("".join(line).rstrip())

print(f"# {COLS}x{rows} lo={lo} hi={hi} gamma={GAMMA}", file=sys.stderr)
ink = sum(1 for l in out for ch in l if ch != " ")
print(f"# ink coverage {ink/(COLS*rows)*100:.1f}%", file=sys.stderr)
sys.stdout.write("\n".join(out))
