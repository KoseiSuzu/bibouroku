# Particle Theory Homepage Template v2

## Recommended structure for real files

```text
/
├─ index.html
├─ styles.css
├─ script.js
├─ data/
│  ├─ publications.json
│  └─ notes.json
└─ docs/
   ├─ papers/
   │  ├─ sample-paper-01.pdf
   │  └─ sample-paper-02.pdf
   └─ notes/
      ├─ qft-notes.pdf
      └─ gauge-theory-memo.pdf
```

## How to store actual papers and notes

Put the actual PDF files into:

- `docs/papers/` for papers
- `docs/notes/` for notes and materials

Then update the link inside the JSON files.

Example:

```json
{
  "title": "My First Paper",
  "meta": "Yamada Taro, Journal of Example Physics (2027)",
  "tag": "Journal",
  "description": "Short summary.",
  "links": {
    "PDF": "docs/papers/my-first-paper.pdf",
    "arXiv": "https://arxiv.org/abs/xxxx.xxxxx"
  }
}
```

## GitHub Pages

Upload the whole folder to a GitHub repository and enable Pages from the main branch.
