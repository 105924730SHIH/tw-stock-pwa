# -*- coding: utf-8 -*-
"""
gen_icons.py
產生 PWA 所需的所有尺寸 App Icon（含 maskable 版本）。

用法：
    pip install pillow
    python gen_icons.py

輸出：
    icons/icon-<size>.png            一般圖示
    icons/icon-maskable-192.png      Android 自適應圖示（192）
    icons/icon-maskable-512.png      Android 自適應圖示（512）
"""

import os
from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icons")
os.makedirs(OUT_DIR, exist_ok=True)

# 品牌配色（與網頁 hero 區塊一致）
BLUE_DARK = (31, 73, 125)      # #1f497d
BLUE_MID = (37, 99, 235)       # #2563eb
BLUE_LIGHT = (14, 165, 233)    # #0ea5e9
WHITE = (255, 255, 255)
GREEN_UP = (0, 200, 120)
RED_DOWN = (255, 90, 90)

SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512]
MASKABLE_SIZES = [192, 512]


def _lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_gradient_bg(size, radius_ratio=0.22):
    """對角線漸層背景 + 圓角"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            c = _lerp(BLUE_DARK, BLUE_LIGHT, t)
            px[x, y] = (c[0], c[1], c[2], 255)

    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    radius = int(size * radius_ratio)
    mdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    img.putalpha(mask)
    return img


def draw_candles_and_line(img, size, inset_ratio=0.20):
    """繪製簡化版K棒 + 折線走勢，代表股票技術分析"""
    d = ImageDraw.Draw(img)
    inset = size * inset_ratio
    left, right = inset, size - inset
    top, bottom = inset, size - inset
    w = right - left
    h = bottom - top

    # --- 四根簡化K棒（交替漲跌色）---
    n = 4
    gap = w * 0.06
    bar_w = (w - gap * (n - 1)) / n
    bar_defs = [
        (0.55, 0.30, RED_DOWN),   # (body_height_ratio, body_top_ratio, color)
        (0.35, 0.55, GREEN_UP),
        (0.65, 0.20, GREEN_UP),
        (0.45, 0.45, RED_DOWN),
    ]
    centers_x = []
    for i, (bh, bt, color) in enumerate(bar_defs):
        x0 = left + i * (bar_w + gap)
        x1 = x0 + bar_w
        cx = (x0 + x1) / 2
        centers_x.append(cx)
        body_top = top + h * bt
        body_bot = body_top + h * bh
        # 影線
        wick_w = max(size * 0.006, 1.5)
        d.line([(cx, top + h * 0.05), (cx, bottom - h * 0.05)],
               fill=color, width=int(wick_w))
        # 實體
        d.rounded_rectangle([x0, body_top, x1, body_bot],
                             radius=bar_w * 0.15, fill=color)

    # --- 白色趨勢折線覆蓋於上方 ---
    line_pts = [
        (left - w * 0.02, bottom - h * 0.15),
        (centers_x[0], top + h * 0.35),
        (centers_x[1], top + h * 0.55),
        (centers_x[2], top + h * 0.10),
        (centers_x[3], top + h * 0.30),
        (right + w * 0.02, top - h * 0.05),
    ]
    line_w = max(size * 0.028, 2)
    d.line(line_pts, fill=WHITE, width=int(line_w), joint="curve")

    # 端點小圓點
    r = line_w * 1.1
    ex, ey = line_pts[-1]
    d.ellipse([ex - r, ey - r, ex + r, ey + r], fill=WHITE)

    return img


def make_icon(size, maskable=False):
    if maskable:
        # maskable 圖示需保留安全區（約 40% 內縮），背景需鋪滿整個畫布無圓角
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        px = img.load()
        for y in range(size):
            for x in range(size):
                t = (x + y) / (2 * size)
                c = _lerp(BLUE_DARK, BLUE_LIGHT, t)
                px[x, y] = (c[0], c[1], c[2], 255)
        img = draw_candles_and_line(img, size, inset_ratio=0.30)
    else:
        img = draw_gradient_bg(size)
        img = draw_candles_and_line(img, size, inset_ratio=0.20)
    return img


def main():
    for s in SIZES:
        icon = make_icon(s, maskable=False)
        path = os.path.join(OUT_DIR, f"icon-{s}.png")
        icon.save(path, "PNG")
        print(f"✔ {path}")

    for s in MASKABLE_SIZES:
        icon = make_icon(s, maskable=True)
        path = os.path.join(OUT_DIR, f"icon-maskable-{s}.png")
        icon.save(path, "PNG")
        print(f"✔ {path}")

    # favicon
    favicon = make_icon(48, maskable=False)
    favicon.save(os.path.join(OUT_DIR, "favicon.ico"), format="ICO",
                  sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"✔ {os.path.join(OUT_DIR, 'favicon.ico')}")

    print("\n全部圖示產生完成！")


if __name__ == "__main__":
    main()
