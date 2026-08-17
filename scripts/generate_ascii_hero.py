#!/usr/bin/env python3
"""Generate light and dark SVG profile cards from a local portrait."""

import argparse
import colorsys
import html
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


WIDTH = 1200
HEIGHT = 430
PORTRAIT_COLUMNS = 47
PORTRAIT_ROWS = 43
CHAR_WIDTH = 7.3
LINE_HEIGHT = 9.2
PORTRAIT_X = 38
PORTRAIT_Y = 25
CHARACTERS = "@%#*+=:"

THEMES = {
    "dark": {
        "background": "#0d1117",
        "border": "#30363d",
        "text": "#e6edf3",
        "muted": "#8b949e",
        "keyword": "#ff7b72",
        "property": "#79c0ff",
        "string": "#a5d6ff",
        "number": "#d2a8ff",
        "portrait": ("#58a6ff", "#79c0ff", "#a5d6ff", "#c9d1d9"),
    },
    "light": {
        "background": "#ffffff",
        "border": "#d0d7de",
        "text": "#1f2328",
        "muted": "#636c76",
        "keyword": "#cf222e",
        "property": "#0550ae",
        "string": "#0a3069",
        "number": "#8250df",
        "portrait": ("#0550ae", "#0969da", "#218bff", "#57606a"),
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert a portrait into syntax-colored ASCII SVG cards."
    )
    parser.add_argument("source", type=Path, help="Path to a local portrait image")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("assets"),
        help="Directory for generated SVG files",
    )
    return parser.parse_args()


def load_portrait(source: Path) -> Image.Image:
    image = ImageOps.fit(
        Image.open(source).convert("RGB"),
        (PORTRAIT_COLUMNS, PORTRAIT_ROWS),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.46),
    )
    grayscale = image.convert("L")
    pixels = grayscale.load()

    # The selected source has a neutral studio background. Suppress bright,
    # low-saturation pixels while retaining skin, hair, and clothing.
    for row in range(PORTRAIT_ROWS):
        for column in range(PORTRAIT_COLUMNS):
            red, green, blue = image.getpixel((column, row))
            _, saturation, value = colorsys.rgb_to_hsv(
                red / 255,
                green / 255,
                blue / 255,
            )
            if saturation < 0.105 and value > 0.63:
                pixels[column, row] = 255

    return ImageEnhance.Contrast(grayscale).enhance(1.12)


def pixel_to_character(value: int) -> tuple[str, int] | None:
    # The source portrait has a near-white background. Leaving those pixels
    # empty preserves the silhouette without committing the original photo.
    if value > 247:
        return None

    normalized = value / 247
    character_index = min(
        len(CHARACTERS) - 1,
        int(normalized * len(CHARACTERS)),
    )
    color_index = min(3, int(normalized * 4))
    return CHARACTERS[character_index], color_index


def render_portrait(image: Image.Image, colors: tuple[str, ...]) -> str:
    rows = []
    pixels = image.load()

    for row in range(PORTRAIT_ROWS):
        spans = []
        current_color = None
        current_text = ""

        for column in range(PORTRAIT_COLUMNS):
            mapped = pixel_to_character(pixels[column, row])
            character, color_index = mapped if mapped else (" ", None)

            if color_index != current_color:
                if current_text:
                    fill = (
                        colors[current_color]
                        if current_color is not None
                        else "transparent"
                    )
                    spans.append(
                        f'<tspan fill="{fill}">{html.escape(current_text)}</tspan>'
                    )
                current_color = color_index
                current_text = character
            else:
                current_text += character

        if current_text:
            fill = (
                colors[current_color]
                if current_color is not None
                else "transparent"
            )
            spans.append(
                f'<tspan fill="{fill}">{html.escape(current_text)}</tspan>'
            )

        y = PORTRAIT_Y + (row + 1) * LINE_HEIGHT
        rows.append(
            f'<text x="{PORTRAIT_X}" y="{y:.1f}" '
            f'font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
            f'font-size="8.8" xml:space="preserve">{"".join(spans)}</text>'
        )

    return "\n    ".join(rows)


def code_line(
    y: int,
    theme: dict[str, str | tuple[str, ...]],
    parts: list[tuple[str, str]],
) -> str:
    spans = []
    for token_type, content in parts:
        color = theme[token_type]
        spans.append(
            f'<tspan fill="{color}">{html.escape(content)}</tspan>'
        )
    return (
        f'<text x="470" y="{y}" '
        'font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="17" xml:space="preserve">{"".join(spans)}</text>'
    )


def render_svg(image: Image.Image, theme_name: str) -> str:
    theme = THEMES[theme_name]
    portrait = render_portrait(image, theme["portrait"])

    lines = [
        [("keyword", "const"), ("text", " engineer "), ("muted", "="), ("text", " {")],
        [("property", "  name"), ("muted", ": "), ("string", '"Sudarshan Dhage"'), ("muted", ",")],
        [("property", "  role"), ("muted", ": "), ("string", '"Software Engineer"'), ("muted", ",")],
        [("property", "  builds"), ("muted", ": "), ("text", "[")],
        [("string", '    "mobile"'), ("muted", ", "), ("string", '"backend"'), ("muted", ", "), ("string", '"applied AI"')],
        [("text", "  ]"), ("muted", ",")],
        [("property", "  shipped"), ("muted", ": "), ("text", "{")],
        [("property", "    newsSources"), ("muted", ": "), ("number", "100"), ("muted", ",")],
        [("property", "    apiLatency"), ("muted", ": "), ("string", '"-40%"'), ("muted", ",")],
        [("property", "    npmInstalls"), ("muted", ": "), ("string", '"300+"')],
        [("text", "  }"), ("muted", ",")],
        [("property", "  current"), ("muted", ": "), ("string", '"building MergedCode"')],
        [("text", "};")],
    ]
    rendered_lines = "\n    ".join(
        code_line(92 + index * 24, theme, line)
        for index, line in enumerate(lines)
    )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-label="Sudarshan Dhage software engineer profile">
  <rect x="0.5" y="0.5" width="{WIDTH - 1}" height="{HEIGHT - 1}" rx="12" fill="{theme['background']}" stroke="{theme['border']}"/>
  <circle cx="25" cy="23" r="5" fill="#ff5f56"/>
  <circle cx="43" cy="23" r="5" fill="#ffbd2e"/>
  <circle cx="61" cy="23" r="5" fill="#27c93f"/>
  <text x="600" y="27" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="12" fill="{theme['muted']}">sudarshan@github: ~/profile</text>
  <line x1="0" y1="43" x2="{WIDTH}" y2="43" stroke="{theme['border']}"/>
  <line x1="425" y1="66" x2="425" y2="398" stroke="{theme['border']}"/>
  <g aria-label="ASCII portrait generated from a local photo">
    {portrait}
  </g>
  <g aria-label="Profile written as TypeScript">
    {rendered_lines}
  </g>
</svg>
"""


def main() -> None:
    args = parse_args()
    image = load_portrait(args.source)
    args.output.mkdir(parents=True, exist_ok=True)

    for theme_name in THEMES:
        destination = args.output / f"profile-{theme_name}.svg"
        destination.write_text(
            render_svg(image, theme_name),
            encoding="utf-8",
        )
        print(f"generated {destination}")


if __name__ == "__main__":
    main()
