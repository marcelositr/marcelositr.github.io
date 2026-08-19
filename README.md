# devnux.com.br

Personal static site published with GitHub Pages. DevNux is organized as a living personal archive: current state, topic trails, experiments, a Portuguese-first Caderno, chronological archive and verifiable identity.

The repository intentionally stays small and inspectable: independent HTML documents, shared CSS/JavaScript, no application framework and no backend.

## Structure

```text
assets/
├── data/
├── images/
├── scripts/
└── styles/
    ├── site.css
    ├── editorial.css
    └── vnext.css

pt/
├── agora/
├── experimentos/
├── arquivo/
├── identidade/
├── meio-ambiente/
├── tecnologia/
├── radio/
└── meliponicultura/

en/
├── now/
├── experiments/
├── archive/
├── identity/
├── environment/
├── technology/
├── radio/
└── meliponiculture/

es/
├── ahora/
├── experimentos/
├── archivo/
├── identidad/
├── medio-ambiente/
├── tecnologia/
├── radio/
└── meliponicultura/

caderno/
├── 2026/
└── feed.xml

gateway/
tests/e2e/
```

The root route selects a locale from the saved preference or browser language. Core public navigation is maintained in PT-BR, English and Spanish with canonical and `hreflang` relationships. The Caderno remains intentionally Portuguese-first and is not required to be translated.

## Content model

- **Now / Agora / Ahora**: a short snapshot of what is receiving attention.
- **Trails**: environment, technology, amateur radio and meliponiculture act as topic indexes rather than departments.
- **Experiments**: work in progress with explicit state.
- **Caderno**: occasional narrative notes, without a publishing cadence.
- **Archive**: chronological trace of notes, experiments and meaningful site updates.
- **Identity**: public keys, radio identifiers, vCard and contact channels.

## Images

First-party photos are configured in `assets/data/media.json`. Empty slots are invisible. See `assets/images/README.md` for the publication workflow.

## Public identity

- OpenPGP public key: `https://devnux.com.br/gpg.asc`
- OpenPGP fingerprint: `https://devnux.com.br/fingerprint`
- SSH public key: `https://devnux.com.br/ssh.pub`
- Security contact: `https://devnux.com.br/.well-known/security.txt`
- vCard: `https://devnux.com.br/marcelo.vcf`
- humans.txt: `https://devnux.com.br/humans.txt`

The repository contains public material only. Private cryptographic keys are never published here.

## Quality and maintenance

Playwright exercises Chromium, Firefox and WebKit. Lighthouse audits representative public pages. Dependabot watches npm and GitHub Actions dependencies. Workflow actions are pinned to immutable commit SHAs and annotated with their release line.
