# React Bits

Source: https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696

Components: Threads, AnimatedContent, Magnet. Original sources retained. License: public/licenses/react-bits.txt.

## Aloft-inspired portfolio revision

Added official Carousel and SpotlightCard JSX/CSS from the same pinned commit above. Original downloads retained locally under docs/private/reactbits-source/.

Carousel adaptations: removed demo items and replaced Hugeicons with existing Phosphor carets; added translated accessible labels and inert on inactive slides. Spring, sizing, transitions, controls and reduced-motion handling remain from React Bits. Project captures are custom slide children; autoplay and inner dragging are disabled to preserve vertical screenshot scrolling. Outer project strip uses native scrolling, pointer dragging and keyboard navigation rather than nesting two gesture engines. SpotlightCard source is unchanged; visual configuration is set by props and portfolio CSS.

The outer strip also implements continuous native scroll with requestAnimationFrame, repeated project sequences and hover/focus/interaction pauses. This behavior lives in ProjectShowcase.jsx; it is separate from the official Carousel engine used inside each card. Reduced motion disables the outer autoplay and renders only one sequence. Visible pause controls were removed at the user's request.

## Technology strip

LogoLoop.jsx and LogoLoop.css copied unchanged from src/content/Animations/LogoLoop/ at the same pinned React Bits commit. TechStack.jsx supplies local Devicon SVGs, inline labels and hover pause; it renders a single wrapping list under reduced motion. Devicon commit and icons are recorded in docs/devicon-source.json; MIT license is distributed in public/licenses/devicon.txt. No runtime CDN is used.
