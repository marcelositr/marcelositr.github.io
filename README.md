# devnux.com.br

Personal static site published with GitHub Pages. The repository intentionally stays small and inspectable: independent HTML documents, shared CSS/JavaScript, no application framework and no backend.

## Structure

```text
assets/
├── data/
│   └── media.json
├── images/
├── scripts/
│   ├── gateway/
│   ├── locale-router.js
│   ├── not-found.js
│   └── site.js
└── styles/

pt/
├── meio-ambiente/
├── tecnologia/
├── radio/
└── meliponicultura/

en/
├── environment/
├── technology/
├── radio/
└── meliponiculture/

es/
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

The root route selects a locale from the saved preference or browser language. Core profile content is maintained in PT-BR, English and Spanish with explicit canonical and `hreflang` relationships. The Caderno is intentionally Portuguese-first and is not required to be translated.

## Caderno

`/caderno/` is a lightweight notebook for occasional notes, experiments and observations. It has no publishing cadence. The RSS feed lives at `/caderno/feed.xml`.

## Images

Future first-party photos are configured in `assets/data/media.json`. Empty slots are invisible. See `assets/images/README.md` for the publication workflow.

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
