# devnux.com.br

Personal static site published with GitHub Pages.

## Structure

```text
assets/
├── images/
├── scripts/
│   ├── gateway/
│   ├── locale-router.js
│   └── site.js
└── styles/

pt/
├── radio/
└── meliponicultura/

en/
├── radio/
└── meliponiculture/

es/
├── radio/
└── meliponicultura/

gateway/
└── index.html

tests/
└── e2e/
```

The root route selects a locale from the saved preference or browser language. Localized pages are published as independent static documents with explicit canonical and `hreflang` relationships.

Public endpoints and platform convention files remain at the repository root.

## Public cryptographic identity

- OpenPGP public key: `https://devnux.com.br/gpg.asc`
- OpenPGP fingerprint: `https://devnux.com.br/fingerprint`
- SSH public key: `https://devnux.com.br/ssh.pub`
- Security contact: `https://devnux.com.br/.well-known/security.txt`

The repository contains public material only. Private cryptographic keys are never published here.
