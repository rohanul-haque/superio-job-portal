# Frontend Design System Documentation

> **Purpose:** This document defines the complete visual design system for the Job Portal frontend. Every page, dashboard, and reusable UI component must follow these design rules to maintain a consistent user experience.

---

# 1. Design Philosophy

The application should have a clean, modern, bright, spacious, and professional appearance.

The overall visual direction:

- Clean white backgrounds.
- Indigo-based brand identity.
- Modern Outfit typography.
- Rounded buttons and cards.
- Soft borders instead of heavy shadows.
- Consistent spacing and alignment.
- Clear visual hierarchy.
- Friendly and professional interface.
- Responsive layouts across all screen sizes.

The entire frontend must look like one unified product.

# 2. Color System

Use the following color palette consistently throughout the application.

| Color Token | Hex Code | Usage |
|---|---|---|
| Primary | `#4F46E5` | Brand color, active navigation, links, highlights |
| Secondary | `#6366F1` | Primary buttons and interactive emphasis |
| Tertiary | `#EF4444` | Important CTA accents and alerts |
| Neutral | `#FFFFFF` | White text and neutral elements |
| Surface | `#FFFFFF` | Cards, inputs, panels and containers |
| On Surface | `#0F172A` | Main text, headings and labels |
| Accent | `#1F2937` | Supporting icons and dark UI elements |
| Muted | `#E2E8F0` | Soft dividers and subtle borders |
| Border | `#E5E7EB` | Card and component borders |
| Background | `#FFFFFF` | Main application background |
| Text | `#4F46E5` | Brand-colored text and links |
| Success | `#22C55E` | Success messages and positive statuses |
| Error | `#DC2626` | Error messages and destructive states |

### Color Usage Rules

- Use `#FFFFFF` as the primary page and card background.
- Use `#4F46E5` for brand emphasis and active states.
- Use `#6366F1` for primary button backgrounds.
- Use `#0F172A` for headings and primary content.
- Use `#E5E7EB` for standard borders.
- Use `#E2E8F0` for subtle separators.
- Use success and error colors only for their semantic purposes.
- Avoid introducing unrelated colors without a clear functional reason.
- Maintain sufficient contrast between text and backgrounds.

# 3. Typography System

**Primary Font Family: Outfit**

Outfit must be used throughout the entire frontend, including public pages, dashboards, forms, tables, navigation, and modal components.

### Heading Typography

| Token | Font Size | Weight | Line Height | Letter Spacing |
|---|---:|---:|---:|---:|
| Headline Display | 48px | 800 | 48px | 0px |
| Headline Large | 38px | 800 | 40px | 0px |
| Headline Medium | 29px | 700 | 35px | -0.03em |
| Headline Small | 23px | 600 | 28px | 0px |

### Body Typography

| Token | Font Size | Weight | Line Height | Letter Spacing |
|---|---:|---:|---:|---:|
| Body Large | 18px | 400 | 28px | 0px |
| Body Medium | 16px | 400 | 24px | 0px |
| Body Small | 14px | 400 | 22px | 0px |

### Labels and Navigation

| Token | Font Size | Weight | Line Height | Letter Spacing |
|---|---:|---:|---:|---:|
| Label Large | 14px | 600 | 20px | 0px |
| Label Medium | 14px | 500 | 20px | 0px |
| Label Small | 12px | 500 | 16px | 0.08em |
| Navigation Link | 14px | 500 | 20px | 0px |
| Caption | 12px | 600 | 16px | 0.1em |

### Typography Rules

- Use bold display typography for important headings.
- Use medium and regular weights for body content.
- Maintain consistent heading hierarchy.
- Avoid using too many different font sizes.
- Keep paragraphs readable with comfortable line heights.
- Use Outfit consistently instead of mixing unrelated font families.

# 4. Border Radius System

Use these exact border-radius values.

| Token | Value | Usage |
|---|---:|---|
| None | 0px | Elements that require sharp corners |
| Small | 4px | Compact utility elements |
| Medium | 8px | Inputs and smaller controls |
| Large | 16px | Cards and content containers |
| Extra Large | 24px | Larger visual containers |
| Full | 9999px | Pill buttons, chips and rounded controls |

### Shape Rules

- Buttons should generally use `9999px`.
- Chips and badges should use `9999px`.
- Cards should generally use `16px`.
- Inputs should generally use `8px`.
- Larger feature containers may use `24px`.
- Maintain consistent corner rounding across similar components.

# 5. Spacing System

Use the following spacing scale throughout the application.

| Token | Value | Usage |
|---|---:|---|
| XS | 6px | Compact element spacing |
| SM | 16px | Small component gaps |
| MD | 28px | Card content and grouped elements |
| LG | 48px | Larger content separation |
| XL | 80px | Major section separation |
| Gutter | 24px | Horizontal page padding |
| Section | 96px | Standard section spacing |

### Spacing Rules

- Use consistent spacing between related elements.
- Maintain generous whitespace.
- Avoid overcrowded layouts.
- Use 28px as the standard card interior padding.
- Use 24px as the standard horizontal page gutter.
- Maintain consistent vertical spacing between sections.
- Dashboard layouts may use more compact spacing where data density requires it, without breaking the spacing scale.

# 6. Border System

### Standard Border Specifications

| Property | Value |
|---|---|
| Default Border Width | 1px |
| Default Border Color | `#E5E7EB` |
| Subtle Border Color | `#E2E8F0` |
| Standard Border Style | Solid |
| Input Border Radius | 8px |
| Card Border Radius | 16px |

### Border Rules

- Prefer thin 1px borders for cards, inputs, tables and containers.
- Use `#E5E7EB` for standard component outlines.
- Use `#E2E8F0` for subtle dividers.
- Use brand indigo for active and focused states.
- Avoid unnecessarily thick or dark borders.
- Do not use borders and heavy shadows together unless functionally necessary.

# 7. Button System

All buttons must follow a consistent design.

### Primary Button

| Property | Value |
|---|---|
| Background | `#6366F1` |
| Text Color | `#FFFFFF` |
| Font | Outfit |
| Font Size | 14px |
| Font Weight | 500 |
| Line Height | 20px |
| Border Radius | 9999px |
| Padding | 8px 20px |
| Height | 40px |
| Hover Background | `#4F46E5` |

Usage:
- Main CTA buttons.
- Submit buttons.
- Important dashboard actions.
- Primary navigation actions.

### Secondary Button

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Text Color | `#0F172A` |
| Font Size | 14px |
| Font Weight | 500 |
| Border Radius | 9999px |
| Padding | 8px 20px |
| Height | 40px |
| Border | 1px solid `#E5E7EB` |

Usage:
- Cancel actions.
- Secondary navigation actions.
- Less prominent actions.

### Tertiary Button

| Property | Value |
|---|---|
| Background | Transparent |
| Text Color | `#4F46E5` |
| Font Size | 14px |
| Font Weight | 400 |
| Border Radius | 0px |
| Padding | 0px |

Usage:
- Text links.
- Minimal actions.
- Inline navigation.

### Button Rules

- Keep buttons compact and visually consistent.
- Avoid unnecessarily tall buttons.
- Use pill-shaped buttons.
- Maintain consistent button heights.
- Avoid excessive shadows.
- Hover effects should be subtle.
- Preserve existing button functionality and click handlers.

# 8. Card System

Cards should have a clean, lightweight appearance.

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Text Color | `#0F172A` |
| Border | 1px solid `#E5E7EB` |
| Border Radius | 16px |
| Padding | 28px |
| Shadow | None by default |

### Card Rules

- Use white surfaces.
- Use thin borders.
- Use consistent internal padding.
- Keep card layouts aligned.
- Avoid heavy shadows.
- Maintain consistent spacing between cards.
- Use the same visual treatment for similar card types.

# 9. Input and Form System

All input components must follow the same design language.

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Text Color | `#0F172A` |
| Font | Outfit |
| Font Size | 14px |
| Font Weight | 400 |
| Border | 1px solid `#E5E7EB` |
| Border Radius | 8px |
| Padding | 12px |

### Input Rules

- Maintain consistent heights and spacing.
- Use a clear brand-colored focus state.
- Use semantic error and success states.
- Labels must remain readable.
- Placeholder text should be visually secondary.
- Apply consistent styles to text inputs, selects, textareas and search fields.

# 10. Chip and Badge System

| Property | Value |
|---|---|
| Background | `#EEF2FF` |
| Text Color | `#4F46E5` |
| Font Size | 12px |
| Font Weight | 500 |
| Line Height | 16px |
| Letter Spacing | 0.08em |
| Border Radius | 9999px |
| Padding | 6px 12px |

Usage:
- Job categories.
- Job types.
- User metadata.
- Dashboard status indicators where appropriate.

Semantic success and error statuses should use the corresponding semantic colors.

# 11. Navigation System

Navigation should remain clean, lightweight and easy to understand.

### Navigation Link

| Property | Value |
|---|---|
| Font | Outfit |
| Font Size | 14px |
| Font Weight | 500 |
| Line Height | 20px |
| Letter Spacing | 0px |

### Navigation Rules

- Use `#0F172A` for standard navigation text.
- Use `#4F46E5` for active navigation.
- Active navigation may use a subtle pill-shaped background.
- Avoid heavy borders and decorative effects.
- Keep spacing consistent between navigation items.
- Preserve clear visual separation between sidebar groups.

# 12. Dashboard Design Guidelines

Apply the same design system to every dashboard.

This includes:

- Candidate Dashboard.
- Recruiter Dashboard.
- Admin Dashboard.

### Dashboard Layout

- Use clean white surfaces.
- Maintain consistent page gutters.
- Use Outfit typography.
- Use the same button and input styles.
- Use 16px rounded cards.
- Use thin borders.
- Keep dashboard content organized and readable.
- Maintain consistent heading hierarchy.
- Use indigo for active sidebar items and important actions.

### Dashboard Cards and Statistics

- White background.
- 1px light border.
- 16px border radius.
- 28px padding where appropriate.
- No heavy shadows.
- Strong numeric hierarchy.
- Consistent spacing between statistics.

### Tables

- Use clear typography.
- Maintain readable row spacing.
- Use subtle separators.
- Keep table headers visually distinct.
- Use consistent status chips.
- Avoid unnecessary decorative styling.

# 13. Elevation and Shadow System

The overall interface should remain visually flat and lightweight.

### Rules

- Cards: No shadow by default.
- Inputs: No heavy shadow.
- Modals: Use restrained elevation.
- Primary buttons: A subtle colored shadow may be used when appropriate.
- Hover states: Avoid dramatic elevation changes.
- Avoid multiple layered shadows.
- Prefer borders and color contrast to establish hierarchy.

# 14. Layout and Responsive Design

The application must work consistently across:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

### Layout Rules

- Maintain consistent horizontal gutters.
- Keep content properly aligned.
- Use responsive grids.
- Avoid horizontal overflow.
- Maintain readable typography on smaller screens.
- Stack cards naturally on mobile.
- Keep forms usable on all screen sizes.
- Preserve spacing and visual hierarchy when adapting layouts.

Use the existing project's responsive breakpoints and layout conventions.

# 15. Iconography

- Use the icon library already installed in the project.
- Keep icon sizes consistent within similar components.
- Prefer simple, clean line icons.
- Use `#1F2937` or `#4F46E5` for standard icons where appropriate.
- Avoid mixing unrelated icon styles.
- Icons must support the meaning of the surrounding content.

# 16. Do's and Don'ts

### Do

- Use Outfit consistently.
- Use the defined color palette.
- Use rounded buttons and cards.
- Maintain generous whitespace.
- Prefer thin borders.
- Keep the interface bright and clean.
- Maintain consistent component styling.
- Reuse shared UI components.
- Follow the spacing and typography scales.

### Don't

- Don't introduce unrelated color palettes.
- Don't mix multiple font families.
- Don't use excessive shadows.
- Don't use inconsistent border radii.
- Don't make buttons unnecessarily large.
- Don't overcrowd dashboard layouts.
- Don't introduce heavy gradients or dark backgrounds without a clear requirement.
- Don't create different visual styles for different dashboards.

# 17. Implementation Guidelines

Follow these steps when applying the design system:

**Step 1 — Audit**

Inspect the existing frontend structure, shared components, stylesheets, theme configuration and dashboard layouts.

**Step 2 — Design Tokens**

Create or update centralized design tokens for colors, typography, border radius, spacing and other shared values.

**Step 3 — Global Typography**

Ensure Outfit is correctly configured and consistently applied throughout the application.

**Step 4 — Shared Components**

Standardize buttons, cards, inputs, badges, navigation elements and other reusable components.

**Step 5 — Public Pages**

Apply the design system to the homepage and all public-facing pages.

**Step 6 — Dashboards**

Apply the same design rules to Candidate, Recruiter and Admin dashboards.

**Step 7 — Forms and Data Components**

Standardize tables, forms, dialogs, dropdowns, status indicators and data cards.

**Step 8 — Responsive Verification**

Verify the visual consistency and usability across desktop, tablet and mobile.

**Step 9 — Final Review**

Check for inconsistent colors, fonts, spacing, border radii, shadows and component styles.

# 18. Strict Project Rules

- This document is the source of truth for frontend visual styling.
- All frontend pages must follow this design system.
- Do not create a separate design language for individual dashboards.
- Do not change backend functionality or API integrations.
- Do not modify authentication, routing or business logic for visual updates.
- Preserve existing content and features.
- Avoid unnecessary dependencies.
- Reuse existing components whenever possible.
- Do not perform unrelated refactoring.
- If an existing component conflicts with this design system, update its visual styling without breaking its functionality.

---

# Final Design System Goal

The entire Job Portal frontend must maintain one consistent visual identity.

The public website, Candidate Dashboard, Recruiter Dashboard, Admin Dashboard, authentication pages, forms, tables and all reusable components must follow the same colors, typography, spacing, border radius, button styles and visual principles defined in this document.

**Consistency is mandatory. No frontend page should introduce an unrelated visual design system.**
