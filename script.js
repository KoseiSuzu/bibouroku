async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function createEntryCard(item) {
  const links = Object.entries(item.links || {})
    .filter(([, url]) => url)
    .map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">[${label}]</a>`)
    .join("");

  return `
    <article class="entry-card">
      <div class="entry-top">
        <div>
          <h3 class="entry-title">${item.title}</h3>
          <div class="entry-meta">${item.meta}</div>
        </div>
        ${item.tag ? `<span class="entry-tag">${item.tag}</span>` : ""}
      </div>
      ${item.description ? `<p class="entry-desc">${item.description}</p>` : ""}
      ${links ? `<div class="entry-links">${links}</div>` : ""}
    </article>
  `;
}

function renderList(items, container, query = "") {
  const q = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (!q) return true;
    return [item.title, item.meta, item.description, item.tag]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No matching items.</div>';
    return;
  }

  container.innerHTML = filtered.map(createEntryCard).join("");
}

function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 65;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.7
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 190, 255, 0.85)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(121, 240, 211, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(120, 170, 255, ${0.14 * (1 - d / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

async function init() {
  try {
    const [pubData, noteData] = await Promise.all([
      loadJSON('data/publications.json'),
      loadJSON('data/notes.json')
    ]);

    const pubList = document.getElementById('pub-list');
    const noteList = document.getElementById('note-list');
    const pubSearch = document.getElementById('pub-search');
    const noteSearch = document.getElementById('note-search');

    renderList(pubData.items, pubList);
    renderList(noteData.items, noteList);

    pubSearch.addEventListener('input', (e) => renderList(pubData.items, pubList, e.target.value));
    noteSearch.addEventListener('input', (e) => renderList(noteData.items, noteList, e.target.value));
  } catch (err) {
    console.error(err);
    document.getElementById('pub-list').innerHTML = '<div class="empty-state">Failed to load publications.</div>';
    document.getElementById('note-list').innerHTML = '<div class="empty-state">Failed to load notes.</div>';
  }

  initParticleBackground();
}

init();
