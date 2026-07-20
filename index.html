# -*- coding: utf-8 -*-
"""
gen_icons.py
產生 PWA 所需的所有 icon 尺寸（含 maskable 版本）。

使用方式：
    pip install pillow
    python gen_icons.py

會在 ./icons 資料夾內產生：
    icon-72.png  icon-96.png  icon-128.png  icon-144.png
    icon-152.png icon-192.png icon-384.png  icon-512.png
    icon-512-maskable.png
    apple-touch-icon.png (180x180)
    favicon-32.png / favicon-16.png
"""

import os
import math
from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icons")
os.makedirs(OUT_DIR, exist_ok=True)

# 品牌色（與原 Excel / Gradio UI 一致）
COLOR_DARK = (31, 73, 125)      # #1F497D
COLOR_MID = (37, 99, 235)       # #2563EB
COLOR_LIGHT = (14, 165, 233)    # #0EA5E9
COLOR_WHITE = (255, 255, 255)
COLOR_GREEN = (0, 200, 120)
COLOR_RED = (255, 90, 90)

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]


def lerp(a, b, t):
    return a + (b - a) * t


def diagonal_gradient(size):
    """左上到右下的品牌漸層背景"""
    img = Image.new("RGB", (size, size), COLOR_DARK)
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            if t < 0.5:
                c = tuple(int(lerp(COLOR_DARK[i], COLOR_MID[i], t * 2)) for i in range(3))
            else:
                c = tuple(int(lerp(COLOR_MID[i], COLOR_LIGHT[i], (t - 0.5) * 2)) for i in range(3))
            px[x, y] = c
    return img


def rounded_mask(size, radius_ratio=0.22):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    r = int(size * radius_ratio)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
    return mask


def draw_candles(draw, size, safe_pad_ratio=0.0):
    """畫出簡化版K線走勢圖示（3根蠟燭 + 一條趨勢折線）"""
    pad = size * (0.24 + safe_pad_ratio)
    x0, x1 = pad, size - pad
    y0, y1 = pad, size - pad
    w = x1 - x0
    h = y1 - y0

    n = 5
    gap = w / n
    body_w = gap * 0.42

    bars = [
        (0.55, 0.85, 0.35, 0.95, COLOR_RED),
        (0.35, 0.65, 0.20, 0.75, COLOR_GREEN),
        (0.45, 0.90, 0.30, 0.98, COLOR_RED),
        (0.15, 0.55, 0.05, 0.62, COLOR_GREEN),
        (0.05, 0.40, 0.00, 0.48, COLOR_GREEN),
    ]

    trend_pts = []
    for i, (top, bottom, wick_top, wick_bottom, color) in enumerate(bars):
        cx = x0 + gap * i + gap / 2
        by_top = y0 + h * top
        by_bottom = y0 + h * bottom
        wy_top = y0 + h * wick_top
        wy_bottom = y0 + h * wick_bottom

        line_w = max(2, int(size * 0.012))
        draw.line([(cx, wy_top), (cx, wy_bottom)], fill=COLOR_WHITE, width=line_w)
        draw.rectangle([cx - body_w / 2, by_top, cx + body_w / 2, by_bottom],
                        fill=COLOR_WHITE)
        trend_pts.append((cx, (by_top + by_bottom) / 2))

    trend_w = max(2, int(size * 0.02))
    draw.line(trend_pts, fill=(255, 214, 10), width=trend_w, joint="curve")
    r = max(2, int(size * 0.018))
    for px_, py_ in trend_pts:
        draw.ellipse([px_ - r, py_ - r, px_ + r, py_ + r], fill=(255, 214, 10))


def make_icon(size, maskable=False):
    bg = diagonal_gradient(size)
    draw = ImageDraw.Draw(bg)
    draw_candles(draw, size, safe_pad_ratio=0.06 if maskable else 0.0)

    if maskable:
        # maskable icon 需保留安全區，不做圓角裁切（由系統自行裁切外形）
        return bg
    else:
        mask = rounded_mask(size)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(bg, (0, 0), mask)
        return out


def main():
    for s in SIZES:
        icon = make_icon(s)
        icon.save(os.path.join(OUT_DIR, f"icon-{s}.png"))
        print(f"✅ icon-{s}.png")

    maskable = make_icon(512, maskable=True)
    maskable.save(os.path.join(OUT_DIR, "icon-512-maskable.png"))
    print("✅ icon-512-maskable.png")

    apple = make_icon(180)
    apple.save(os.path.join(OUT_DIR, "apple-touch-icon.png"))
    print("✅ apple-touch-icon.png")

    for s in (32, 16):
        fav = make_icon(s)
        fav.save(os.path.join(OUT_DIR, f"favicon-{s}.png"))
        print(f"✅ favicon-{s}.png")

    print("\n全部圖示已產生於 ./icons 資料夾")


if __name__ == "__main__":
    main()
