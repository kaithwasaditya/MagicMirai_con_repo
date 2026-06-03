/* ══════════════════════════════════════════
   SONGS
══════════════════════════════════════════ */
const SONGS = [
      {
    title: "アフター・ザ・カーテン / Rulmry.",
    url: "https://piapro.jp/t/zoqO/20251214200738",
    video: { beatId: 4827294, chordId: 2963755, repetitiveSegmentId: 3086262, lyricId: 126591, lyricDiffId: 28627 }
  },
  {
    title: "こたえて / imie",
    url: "https://piapro.jp/t/6W2N/20251215164617",
    video: { beatId: 4827293, chordId: 2963754, repetitiveSegmentId: 3086261, lyricId: 126519, lyricDiffId: 28645 }
  },
  {
    title: "シャッターチャンス / 夜未アガリ",
    url: "https://piapro.jp/t/PNpQ/20251209170719",
    video: { beatId: 4827295, chordId: 2963756, repetitiveSegmentId: 3086263, lyricId: 126542, lyricDiffId: 28628 }
  },
  {
    title: "世界最後の音楽隊 / 夏山よつぎ×ど～ぱみん",
    url: "https://piapro.jp/t/B3yJ/20251215061727",
    video: { beatId: 4827296, chordId: 2963757, repetitiveSegmentId: 3086264, lyricId: 126594, lyricDiffId: 28629 }
  },
  {
    title: "トリツクロジー / 鶴三",
    url: "https://piapro.jp/t/QBdL/20251215094303",
    video: { beatId: 4827297, chordId: 2963758, repetitiveSegmentId: 3086265, lyricId: 126593, lyricDiffId: 28630 }
  },
  {
    title: "TAKEOVER / Twinfield",
    url: "https://piapro.jp/t/E2i3/20251215092113",
    video: { beatId: 4827298, chordId: 2963759, repetitiveSegmentId: 3086266, lyricId: 126533, lyricDiffId: 28631 }
  },
];

const TOKEN = "6q5ihGBYOXCKd4ri";

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let currentSong   = 0;
let isPlaying     = false;
let player        = null;
let currentPhrase = null;
let beatPulse     = 0; // 0–1, decays each frame

/* ══════════════════════════════════════════
   DOM refs
══════════════════════════════════════════ */
const stage        = document.getElementById("stage");
const overlay      = document.getElementById("overlay");
const overlayTxt = { textContent: "" }; // dummy, no-op
const btnPlay      = document.getElementById("btn-play");
const icoPlay      = document.getElementById("ico-play");
const icoPause     = document.getElementById("ico-pause");
const songTitle    = document.getElementById("song-title");
const progressFill = document.getElementById("progress-fill");
const dotsWrap     = document.getElementById("song-dots");

/* ══════════════════════════════════════════
   SONG DOTS
══════════════════════════════════════════ */
SONGS.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "dot" + (i === 0 ? " active-dot" : "");
  d.addEventListener("click", () => loadSong(i));
  dotsWrap.appendChild(d);
});

function updateDots() {
  [...dotsWrap.children].forEach((d, i) =>
    d.classList.toggle("active-dot", i === currentSong));
}

/* ══════════════════════════════════════════
   PARTICLE BACKGROUND
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H, particles;

  const COLORS = ["#00ffe0", "#ff6ef7", "#ffe24b", "#a0c4ff"];

  const mouse = { x: -9999, y: -9999, down: false };

  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mousedown", () => { mouse.down = true; });
  window.addEventListener("mouseup",   () => { mouse.down = false; });

  const REPEL_RADIUS  = 120;
  const ATTRACT_RADIUS = 180;
  const REPEL_FORCE   = 0.55;
  const ATTRACT_FORCE = 0.18;
  const MAX_SPEED     = 4;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.4,
      dx:   (Math.random() - 0.5) * 0.3,
      dy:   (Math.random() - 0.5) * 0.3,
      oxdx: (Math.random() - 0.5) * 0.3, // original idle velocity x
      oydy: (Math.random() - 0.5) * 0.3, // original idle velocity y
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 800 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // decay beat pulse each frame
    beatPulse *= 0.88;

    for (const p of particles) {
      const distX = mouse.x - p.x;
      const distY = mouse.y - p.y;
      const dist  = Math.sqrt(distX * distX + distY * distY);

      if (mouse.down && dist < ATTRACT_RADIUS) {
        // attract toward cursor on click
        const force = (ATTRACT_RADIUS - dist) / ATTRACT_RADIUS * ATTRACT_FORCE;
        p.dx += distX / dist * force;
        p.dy += distY / dist * force;
      } else if (!mouse.down && dist < REPEL_RADIUS) {
        // repel away from cursor on hover
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_FORCE;
        p.dx -= distX / dist * force;
        p.dy -= distY / dist * force;
      } else {
        // drift back to idle speed
        p.dx += (p.oxdx - p.dx) * 0.03;
        p.dy += (p.oydy - p.dy) * 0.03;
      }

      // clamp speed
      const speed = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
      if (speed > MAX_SPEED) {
        p.dx = (p.dx / speed) * MAX_SPEED;
        p.dy = (p.dy / speed) * MAX_SPEED;
      }

      p.x += p.dx;
      p.y += p.dy;

      // soft repel from edges
      const EDGE = 20;
      const EDGE_FORCE = 0.15;
      if (p.x < EDGE)     p.dx += EDGE_FORCE;
      if (p.x > W - EDGE) p.dx -= EDGE_FORCE;
      if (p.y < EDGE)     p.dy += EDGE_FORCE;
      if (p.y > H - EDGE) p.dy -= EDGE_FORCE;

      // hard clamp just in case
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      ctx.beginPath();
      const drawR = p.r + beatPulse * p.r * 2.5;
      ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha + beatPulse * 0.3;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();

/* ══════════════════════════════════════════
   LYRIC RENDERING
══════════════════════════════════════════ */
function buildPhraseRow(text, isActive) {
  const row = document.createElement("div");
  row.className = "phrase-row " + (isActive ? "active" : "inactive");
  row.dataset.text = text;

  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00a0" : ch;
    span.style.animationDelay = (i * 0.028) + "s";
    row.appendChild(span);
  });
  return row;
}

function animateIn(row) {
  [...row.querySelectorAll(".char")].forEach(c => c.classList.add("enter"));
}

function animateOut(row, cb) {
  const chars = [...row.querySelectorAll(".char")];
  chars.forEach(c => { c.classList.remove("enter"); c.classList.add("exit"); });
  setTimeout(() => { row.remove(); if (cb) cb(); }, 200);
}

function clearStage() {
  [...stage.children].forEach(r => r.remove());
}

function renderPhrase(phrase) {
  if (!phrase) return;
  clearStage();

  const prev = phrase.previous;
  const next = phrase.next;

  if (prev) {
    const row = buildPhraseRow(prev.text, false);
    stage.appendChild(row);
    animateIn(row);
  }

  const activeRow = buildPhraseRow(phrase.text, true);
  stage.appendChild(activeRow);
  animateIn(activeRow);

  if (next) {
    const row = buildPhraseRow(next.text, false);
    stage.appendChild(row);
    animateIn(row);
  }
}

/* ══════════════════════════════════════════
   TEXTALIVE PLAYER
══════════════════════════════════════════ */
function initPlayer() {
  if (player) {
    player.dispose();
    player = null;
  }

  player = new TextAliveApp.Player({
    app: { token: TOKEN },
    mediaElement: createMediaEl(),
  });

  player.addListener({
    onAppReady(app) {
      if (!app.songUrl) {
        player.createFromSongUrl(SONGS[currentSong].url, {
          video: SONGS[currentSong].video
        });
      }
    },

    onVideoReady() {
      overlayTxt.textContent = "LOADING AUDIO…";
    },

    onTimerReady() {
      overlay.classList.add("hidden");
      songTitle.textContent = SONGS[currentSong].title;
    },

    onBeat(beat) {
      beatPulse = 1;
    },

    onPlay()  { setPlayState(true);  },
    onPause() { setPlayState(false); },
    onStop()  {
      setPlayState(false);
      clearStage();
      progressFill.style.width = "0%";
      currentPhrase = null;
    },

    onTimeUpdate(pos) {
      if (player.video && player.video.duration) {
        progressFill.style.width = ((pos / player.video.duration) * 100).toFixed(2) + "%";
      }

      if (!player.video) return;
      const phrase = player.video.findPhrase(pos);
      if (phrase && phrase !== currentPhrase) {
        currentPhrase = phrase;
        renderPhrase(phrase);
      }
      if (!phrase && currentPhrase) {
        currentPhrase = null;
        clearStage();
      }
    },

    onError(msg) {
      console.error("TextAlive error:", msg);
      overlayTxt.textContent = "ERROR: " + msg;
    },
  });
}

function createMediaEl() {
  let el = document.getElementById("__ta_media__");
  if (el) el.remove();
  el = document.createElement("div");
  el.id = "__ta_media__";
  el.style.cssText = "position:fixed;bottom:0px;right:16px;z-index:9;width:220px;";
  document.body.appendChild(el);
  return el;
}

/* ══════════════════════════════════════════
   SONG LOADING
══════════════════════════════════════════ */
function loadSong(index) {
  currentSong   = index;
  currentPhrase = null;
  isPlaying     = false;
  clearStage();
  setPlayState(false);
  progressFill.style.width = "0%";
  overlay.classList.remove("hidden");
  overlayTxt.textContent = "LOADING SONG…";
  songTitle.textContent  = "–";
  updateDots();
  initPlayer();
}

/* ══════════════════════════════════════════
   CONTROLS
══════════════════════════════════════════ */
function setPlayState(playing) {
  isPlaying = playing;
  icoPlay.style.display  = playing ? "none" : "";
  icoPause.style.display = playing ? ""     : "none";
}

btnPlay.addEventListener("click", () => {
  if (!player) return;
  if (isPlaying) player.requestPause();
  else           player.requestPlay();
});

document.getElementById("btn-prev").addEventListener("click", () => {
  loadSong((currentSong - 1 + SONGS.length) % SONGS.length);
});

document.getElementById("btn-next").addEventListener("click", () => {
  loadSong((currentSong + 1) % SONGS.length);
});

document.getElementById("progress-wrap").addEventListener("click", (e) => {
  if (!player || !player.data || !player.data.song) return;
  const rect  = e.currentTarget.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  player.requestMediaSeek(ratio * player.data.song.duration);
});

/* ══════════════════════════════════════════
   BOOT
══════════════════════════════════════════ */
loadSong(0);