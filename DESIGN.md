# Neomorphism Design System

This document outlines the neomorphic design system implemented for TRI CUBE Digital Solutions.

## Core Philosophy

The neomorphism (or soft UI) design style creates a unified surface where UI elements appear to be extruded from or pressed into the background material, rather than floating above it like in Material Design. This requires a specific set of lighting, shadow, and color rules.

## Lighting & Light Source

- **Direction**: Top-Left
- **Highlight**: Top-Left (Warm white)
- **Shadow**: Bottom-Right (Cool blue-gray)

All interactive and elevated elements must adhere to this consistent light source.

## Color Palette

The system uses `oklch` for all color definitions, integrated with TailwindCSS v4.

### Base Neomorphic Palette

| Token | Hex Equivalent | OKLCH | Usage |
|-------|----------------|-------|-------|
| Background | `#E8ECEF` | `oklch(0.93 0.008 240)` | The base canvas everything is extruded from. |
| Surface/Card | `#EEF1F4` | `oklch(0.95 0.006 240)` | Slightly lighter for floating cards/panels. |
| Foreground | `#2D3748` | `oklch(0.28 0.04 240)` | Deep blue-gray for primary text. |
| Muted | `#718096` | `oklch(0.52 0.03 240)` | Medium gray for secondary text and disabled states. |

### Accent Colors (TRI CUBE Brand)

| Token | Hex Equivalent | OKLCH | Usage |
|-------|----------------|-------|-------|
| Gold Primary | `#C9A84C` | `oklch(0.72 0.12 78)` | Primary interactive elements, CTAs, and accents. |
| Gold Soft | `#F0D080` | `oklch(0.88 0.10 84)` | Gradients, soft highlights, background glows. |
| Gold Deep | `#8B6914` | `oklch(0.50 0.12 72)` | Shadow-side gold, gradient depth, active states. |
| Navy Accent | `#2C4A7C` | `oklch(0.34 0.08 240)` | Secondary brand accent, deep UI elements. |
| Destructive | `#E57373` | `oklch(0.65 0.17 22)` | Error states, dangerous actions. |

### Dark Mode Equivalent

Dark mode inverts the luminance but maintains the neomorphic physical properties, relying heavily on deep shadows and subtle specular highlights.

- **Background**: `oklch(0.22 0.025 245)` (Dark blue-gray)
- **Foreground**: `oklch(0.92 0.01 80)` (Soft off-white)
- **Primary Gold**: `oklch(0.78 0.14 78)` (Slightly brighter for contrast)

## Shadow Specifications (The Core of Neomorphism)

The essential characteristic of neomorphism is the dual shadow box:

1. **Light Shadow**: The highlight on the side facing the light source (top-left).
2. **Dark Shadow**: The cast shadow on the opposite side (bottom-right).

### Shadow Variables

- **Shadow Dark**: `rgba(163, 177, 198, 0.6)` (Cool, dense)
- **Shadow Light**: `rgba(255, 255, 255, 0.8)` (Bright, warm)

### Shadow Formulas

**Raised Surface (Default): `@utility neo`**
```css
box-shadow: 6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.8);
```

**Pressed / Inset Surface: `@utility neo-inset`**
```css
box-shadow: inset 4px 4px 8px rgba(163,177,198,0.6), inset -4px -4px 8px rgba(255,255,255,0.8);
```

**Floating Card (Higher elevation): `@utility neo-card`**
```css
box-shadow: 10px 10px 20px rgba(163,177,198,0.7), -10px -10px 20px rgba(255,255,255,0.9);
```

**Input Focus Ring: Applied on `:focus`**
```css
box-shadow: inset 2px 2px 5px rgba(163,177,198,0.5), inset -2px -2px 5px rgba(255,255,255,0.7), 0 0 0 2px rgba(201,168,76,0.4);
```

## Typography

Typography remains legible and structured, avoiding neomorphic shadows on text to ensure accessibility.
- **Font Stack**: System sans-serif (`-apple-system`, `Inter`, `SF Pro Display`).
- Primary text is a dark blue-gray to match the cooler shadow tones.
- Muted text is used heavily for secondary information to reduce cognitive load.

## Component Specifications

### 1. Buttons

**Standard Button (`@utility neo-btn`)**
- Default: Raised extrusion (`var(--shadow-neo)`).
- Hover: Elevates slightly (`var(--shadow-neo-hover)`).
- Active: Presses in (`var(--shadow-neo-active)`).

**Primary CTA (`@utility neo-btn-primary`)**
- Background: Gold gradient (`var(--gradient-gold)`).
- Shadow: Outer neo shadow + subtle inner top highlight.

### 2. Inputs & Forms (`@utility neo-input`)

Inputs are always carved into the background to indicate they can receive data.
- Default: Inset shadow (`var(--shadow-neo-inset)`).
- Background: Matches the base `var(--color-background)`.
- Border: None (relies on shadow edge).

### 3. Cards & Containers (`@utility neo-card`)

Cards use a larger drop shadow and a subtle gradient to appear as floating, detached surfaces.
- Background: `linear-gradient` from top-left (light) to bottom-right (darker) to simulate curved surface specular reflection.
- Border Radius: Large (`--radius-xl` / 1.5rem).

### 4. Badges / Chips (`@utility neo-badge`)

Small pill-shaped containers.
- Shadow: Small tight neo shadow (`--shadow-neo-sm`).
- Border Radius: Full pill shape (`--radius-4xl`).

## Spacing & Border Radius

Neomorphism looks best with generous spacing and soft, rounded corners. Sharp corners break the illusion of an extruded physical surface.

- Small elements (Inputs, Buttons): `--radius-md` to `var(--radius-3xl)`.
- Large containers (Cards, Modals): `var(--radius-xl)` to `var(--radius-4xl)`.
- **Golden Rule**: The larger the shadow blur, the larger the border radius should be.

## State Management

- **Resting**: Standard raised shadow.
- **Hover**: Expanded shadow spread, slight negative Y transform (move up).
- **Active/Pressed**: Shadow switches from outer `box-shadow` to inner `inset box-shadow`. Transform resets.
- **Focus**: Inset shadow remains, plus an outer colored ring for accessibility (usually the gold brand color at 40% opacity).
- **Disabled**: Lower opacity (50%), smaller flat shadow (`--shadow-neo-sm`), no hover transformations.
