# Imagens próprias

O site está preparado para receber fotografias sem exibir placeholders enquanto elas não existirem.

## Como publicar uma foto

1. Adicione a imagem em `assets/images/` (preferencialmente WebP ou JPEG otimizado).
2. Abra `assets/data/media.json`.
3. Preencha o `src` do slot desejado, por exemplo `/assets/images/environment-01.webp`.
4. Preencha `alt` com uma descrição objetiva da imagem. `caption` é opcional.
5. O `site.js` passa a montar a galeria automaticamente na página correspondente.

Enquanto `src` estiver vazio, o slot não ocupa espaço e não aparece para o visitante.

## Slots preparados

- `profile`: substitui a foto de perfil atualmente carregada do GitHub quando `src` for preenchido.
- `environment`: até 4 registros.
- `technology`: até 4 registros.
- `radio`: até 4 registros.
- `meliponiculture`: até 4 registros.
- `notebook`: até 2 registros ligados ao Caderno.

Sugestão prática: manter a borda maior da foto entre aproximadamente 1600 e 2200 px e evitar arquivos excessivamente pesados. A foto de perfil funciona melhor em enquadramento quadrado.
