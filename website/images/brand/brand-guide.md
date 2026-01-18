# Bhoomi Natural Brand Guide

Brand assets extracted from the official Bhoomi Natural logo.

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Earth Brown | `#623C16` | rgb(98, 60, 22) | Hands symbol, "Bhoomi" text |
| Natural Green | `#7EC032` | rgb(126, 192, 50) | "Natural" text, underline |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Forest Green | `#1E6F48` | rgb(30, 111, 72) | Outer arc, dark accents |
| Leaf Green | `#7CAD41` | rgb(124, 173, 65) | Tree leaves |
| Spring Green | `#B1D08C` | rgb(177, 208, 140) | Inner arc highlight |

### CSS Variables

```css
:root {
  /* Primary */
  --bhoomi-earth-brown: #623C16;
  --bhoomi-natural-green: #7EC032;

  /* Secondary */
  --bhoomi-forest-green: #1E6F48;
  --bhoomi-leaf-green: #7CAD41;
  --bhoomi-spring-green: #B1D08C;
}
```

## Typography

### Font Style
The logo uses a **bold, rounded sans-serif** typeface.

### Recommended Web Fonts
Listed in order of visual similarity:

1. **Fredoka One** (Google Fonts) - Closest match
2. **Nunito Bold** (Google Fonts) - Good alternative
3. **Varela Round** (Google Fonts) - Lighter alternative

### Usage Example

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
```

```css
.brand-heading {
  font-family: 'Fredoka One', cursive;
  color: var(--bhoomi-earth-brown);
}

.brand-subheading {
  font-family: 'Fredoka One', cursive;
  color: var(--bhoomi-natural-green);
}
```

## Logo Symbol

### Files
- `symbol.png` - Tree with hands symbol (transparent PNG, 370x580px)
- `colors.json` - Color palette in JSON format

### Symbol Description
The Bhoomi Natural symbol depicts a tree with leaves growing from cupped human hands, enclosed within a circular green arc. This represents:
- **Tree**: Growth, nature, organic farming
- **Hands**: Care, nurturing, human connection to the earth
- **Circle**: Wholeness, cycle of nature, sustainability

### Usage Guidelines
- Maintain aspect ratio when resizing
- Ensure adequate contrast against backgrounds
- Minimum display size: 32px width for digital, 0.5" for print

## Brand Assets Directory

```
website/images/brand/
├── brand-guide.md   # This file
├── colors.json      # Color palette data
└── symbol.png       # Tree+hands symbol (transparent)
```
