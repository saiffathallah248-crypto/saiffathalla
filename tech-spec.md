# Tech Spec — Saif Fathalla Portfolio

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM renderer |
| typescript | ^5.3.0 | Type safety |
| vite | ^5.0.0 | Build tool |
| tailwindcss | ^3.4.0 | Utility CSS |
| three | ^0.160.0 | 3D particle morph field (hero) |
| @types/three | ^0.160.0 | Three.js type definitions |
| gsap | ^3.12.0 | Animation engine (morph tweens, entrance animations, ScrollTrigger) |
| lenis | ^1.1.0 | Smooth scroll with inertia |

Fonts loaded via Google Fonts CDN (no npm packages):
- Playfair Display (400, 400i)
- Inter (400, 500, 600)
- JetBrains Mono (400)

---

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| Navigation | Custom | Single | Fixed top bar. Transparent → blur bg on scroll. Color flips per section theme (dark/light). Scroll detection via ScrollTrigger or Lenis callback. |
| Footer | Custom | Single | Static, minimal. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Contains ThreeCanvas (child) + text overlay. Text positioned left, z-index above canvas. |
| AboutSection | Custom | Two-column asymmetric (45/55). Light theme. |
| SkillsSection | Custom | 3-column grid of category cards. Dark theme. |
| ProjectsSection | Custom | 3-column grid of project cards. Light theme. |
| CertificationsSection | Custom | Horizontal scroll row on desktop, 2-col grid on mobile. Dark theme. |
| ContactSection | Custom | Centered layout. Light theme. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| ThreeCanvas | Custom | HeroSection | Encapsulates entire Three.js scene. See "State & Logic" for lifecycle. |
| SectionHeading | Custom | About, Skills, Projects, Certs, Contact | Label + heading pair. Includes gold accent line animation. |
| ProjectCard | Custom | ProjectsSection | Image + content card with hover lift/shadow. |
| CertCard | Custom | CertificationsSection | Thumbnail + text card with left gold border. |
| SkillCategory | Custom | SkillsSection | Card with tag-list of skills. |

### Hooks

| Hook | Purpose |
|------|---------|
| useScrollDirection | Track scroll position for nav background transition. Optional — can inline in Navigation. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| 3D particle morph field (hero) | Three.js + GSAP | 🔒 **Proprietary effect.** Custom ShaderMaterial on Points with per-particle UV offsets and texture indices. Three morph targets (grid, sphere, wave) via GSAP `endArray` tweens on position buffer. Continuous loop chain. | **High** |
| Mouse cloth ripple (hero) | Three.js (raycaster) | Raycaster intersects invisible Plane at z=0. Intersection point passed to shader uniform `mouse`. Shader applies z-displacement based on distance from cursor. | **High** |
| Section entrance animations | GSAP ScrollTrigger | Batch utility or per-section timeline. Pattern: `opacity: 0→1, y: 40→0, stagger: 0.12s, duration: 0.8s, ease: power3.out`. Applied to all content sections. | Medium |
| Gold accent line expand | GSAP ScrollTrigger | Label underline element: `width: 0→40px, duration: 0.5s, ease: power2.out`. Triggered with section heading entrance. | Low |
| Nav background transition | GSAP ScrollTrigger | Toggle class or inline styles at hero bottom boundary. Background opacity 0→0.92, backdrop-filter blur 12px. | Low |
| Project card hover | CSS transitions | `translateY(-4px)` + box-shadow deepen. Pure CSS, no JS. | Low |
| Cert card hover | CSS transitions | `border-left-width: 3px→5px`. Pure CSS. | Low |
| Smooth scroll | Lenis | Global instance. `lerp: 0.08`. Synced to GSAP ticker. | Low |

---

## State & Logic Plan

### ThreeCanvas — Imperative 3D Lifecycle

The Three.js scene is entirely imperative and must be carefully managed outside React's render cycle:

**Mount sequence (useEffect)**:
1. Create `THREE.Scene`, `PerspectiveCamera` (75°, z=25), `WebGLRenderer` (alpha, antialias)
2. Set pixel ratio cap at 2, set size to window dimensions
3. Load all 12 image textures via `TextureLoader`, store in array
4. Build `BufferGeometry` with position, uvOffset, textureIndex attributes
5. Create `Points` with custom `ShaderMaterial` (onBeforeCompile override)
6. Start morph cycle (grid → sphere → wave → repeat)
7. Attach mousemove listener (raycaster → plane intersection)
8. Attach resize listener
9. Start RAF loop

**Per-frame RAF**:
1. Update `time` uniform from `performance.now()`
2. Call `renderer.render(scene, camera)`
3. (Lenis raf is handled globally, not inside this component)

**Cleanup (useEffect return)**:
1. Cancel RAF
2. Kill all GSAP tweens and delayedCalls on the scene
3. Remove event listeners
4. Dispose: geometry, all textures, renderer, material
5. Remove canvas DOM element

**Reduced motion check**: Read `prefers-reduced-motion` at mount. If true: skip morph cycle (particles stay in initial random distribution), skip mouse interaction, do not start time uniform updates.

### Responsive Particle Count

Detect viewport width at mount. If `< 768px`, set `particleCount = 200` and disable `antialias`. Otherwise `particleCount = 400`. Recreate the entire scene on breakpoint crossing (or accept static count per session).

### Section Theme Coordination

Navigation text color must flip between `#F5F5F5` (on dark sections) and `#121212` (on light sections). Use ScrollTrigger `onEnter`/`onLeaveBack` callbacks on each section boundary to toggle a CSS class on the nav. Dark sections: Hero, Skills, Certs. Light sections: About, Projects, Contact.

---

## Other Key Decisions

### Raw Three.js over React Three Fiber

The design specifies a custom `ShaderMaterial` with `onBeforeCompile` injection on `PointsMaterial`, `InstancedBufferAttribute` for per-particle data, and `BufferAttribute` endArray tweening via GSAP. R3F's declarative model adds complexity for these low-level operations. Raw Three.js in a `useEffect` is simpler and more direct for this use case.

### No shadcn/ui Components

The design is fully bespoke — no standard UI patterns (dialogs, forms, tables) that would benefit from shadcn. All components are custom-built.

### Image Loading Strategy

12 image textures load at ThreeCanvas mount. Use `THREE.LoadingManager` to track progress and show a minimal loading state (optional — the canvas area can be blank until textures arrive). For the rest of the page, standard `<img>` tags with lazy loading via `loading="lazy"`.
