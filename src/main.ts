import * as THREE from 'three';
import './styles.css';

type Slot = 'armor' | 'melee' | 'ranged' | 'partner' | 'artifact' | 'look';
type Stat = 'might' | 'speed' | 'magic' | 'team';
type Option = { name: string; emoji: string; color: number; accent: number; power: Partial<Record<Stat, number>>; title: string };

const options: Record<Slot, Option[]> = {
  armor: [
    { name: 'Emerald Scout Armor', emoji: '💚', color: 0x22c55e, accent: 0x86efac, power: { speed: 4, team: 2 }, title: 'Emerald Scout' },
    { name: 'Diamond Knight Armor', emoji: '💎', color: 0x38bdf8, accent: 0xbae6fd, power: { might: 4, team: 1 }, title: 'Diamond Knight' },
    { name: 'Lava Guardian Armor', emoji: '🔥', color: 0xef4444, accent: 0xf97316, power: { might: 5, magic: 2 }, title: 'Lava Guardian' },
    { name: 'Shadow Ninja Armor', emoji: '🌙', color: 0x312e81, accent: 0xa78bfa, power: { speed: 5, magic: 1 }, title: 'Shadow Ninja' },
    { name: 'Royal Bee Armor', emoji: '🐝', color: 0xfacc15, accent: 0xfef08a, power: { team: 5, speed: 2 }, title: 'Bee Captain' },
  ],
  melee: [
    { name: 'Sparkle Sword', emoji: '⚔️', color: 0xe0f2fe, accent: 0x38bdf8, power: { might: 3, speed: 3 }, title: 'Sword' },
    { name: 'Thunder Hammer', emoji: '🔨', color: 0x64748b, accent: 0xfacc15, power: { might: 5, magic: 2 }, title: 'Hammer' },
    { name: 'Twin Fox Daggers', emoji: '🗡️', color: 0xf97316, accent: 0xfed7aa, power: { speed: 6 }, title: 'Daggers' },
    { name: 'Crystal Axe', emoji: '🪓', color: 0x14b8a6, accent: 0x99f6e4, power: { might: 4, magic: 2 }, title: 'Axe' },
  ],
  ranged: [
    { name: 'Thunder Bow', emoji: '🏹', color: 0x92400e, accent: 0xfacc15, power: { speed: 2, magic: 3 }, title: 'Thunder Bow' },
    { name: 'Snowball Crossbow', emoji: '❄️', color: 0x7dd3fc, accent: 0xffffff, power: { speed: 3, team: 2 }, title: 'Crossbow' },
    { name: 'Star Wand', emoji: '🪄', color: 0x8b5cf6, accent: 0xf0abfc, power: { magic: 6 }, title: 'Star Wand' },
    { name: 'Slime Launcher', emoji: '🟢', color: 0x16a34a, accent: 0xbbf7d0, power: { team: 3, magic: 3 }, title: 'Slime Launcher' },
  ],
  partner: [
    { name: 'Wolf Buddy', emoji: '🐺', color: 0x94a3b8, accent: 0xe2e8f0, power: { team: 5, might: 1 }, title: 'Wolf' },
    { name: 'Baby Dragon', emoji: '🐉', color: 0x22c55e, accent: 0xf97316, power: { magic: 4, might: 2 }, title: 'Dragon' },
    { name: 'Robot Pal', emoji: '🤖', color: 0x60a5fa, accent: 0xfacc15, power: { team: 3, magic: 3 }, title: 'Robot' },
    { name: 'Tiny Golem', emoji: '🪨', color: 0x78716c, accent: 0xd6d3d1, power: { might: 4, team: 2 }, title: 'Golem' },
  ],
  artifact: [
    { name: 'Firework Rocket', emoji: '🎆', color: 0xef4444, accent: 0xfacc15, power: { magic: 3, might: 3 }, title: 'Firework' },
    { name: 'Healing Totem', emoji: '💖', color: 0xec4899, accent: 0xfbcfe8, power: { team: 6 }, title: 'Healer' },
    { name: 'Speed Mushroom', emoji: '🍄', color: 0xdc2626, accent: 0xffffff, power: { speed: 6 }, title: 'Speedy' },
    { name: 'Soul Lantern', emoji: '🏮', color: 0x06b6d4, accent: 0xa5f3fc, power: { magic: 5, team: 1 }, title: 'Soul' },
  ],
  look: [
    { name: 'Sunny Smile', emoji: '😄', color: 0xf2b680, accent: 0x6b3f24, power: { team: 1 }, title: 'Brave' },
    { name: 'Cool Explorer', emoji: '😎', color: 0xc98b5f, accent: 0x27150d, power: { speed: 1 }, title: 'Cool' },
    { name: 'Freckle Hero', emoji: '🙂', color: 0xffc18a, accent: 0x8b4513, power: { magic: 1 }, title: 'Freckle' },
    { name: 'Moon Mystic', emoji: '🧙', color: 0x9f7aea, accent: 0x111827, power: { magic: 2 }, title: 'Mystic' },
  ],
};

const state: Record<Slot, number> = { armor: 1, melee: 0, ranged: 0, partner: 0, artifact: 0, look: 0 };
let photoSkin: number | null = null;
let photoHair: number | null = null;

const wrap = document.querySelector<HTMLDivElement>('#canvas-wrap')!;
const selectors = document.querySelector<HTMLDivElement>('#selectors')!;
const statsEl = document.querySelector<HTMLDivElement>('#stats')!;
const heroTitle = document.querySelector<HTMLParagraphElement>('#hero-title')!;
const heroName = document.querySelector<HTMLInputElement>('#hero-name')!;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x101936, 13, 32);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(3.9, 3.25, 6.15);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
wrap.appendChild(renderer.domElement);

const world = new THREE.Group();
const hero = new THREE.Group();
const gear = new THREE.Group();
const partnerGroup = new THREE.Group();
const sparkleGroup = new THREE.Group();
scene.add(world);
world.add(hero, partnerGroup, sparkleGroup);
hero.scale.setScalar(1.12);
hero.add(gear);

scene.add(new THREE.HemisphereLight(0xbdeeff, 0x242047, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(5, 9, 4);
sun.castShadow = true;
scene.add(sun);
const rim = new THREE.PointLight(0x9f7aea, 3.8, 12);
rim.position.set(-4, 2.3, -2);
scene.add(rim);

function mat(color: number, roughness = 0.55, metalness = 0.06) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }
function cube(name: string, size: [number, number, number], pos: [number, number, number], color: number, metalness = 0.04) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat(color, 0.52, metalness));
  mesh.name = name;
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function gem(parent: THREE.Group, color: number, pos: [number, number, number], scale = 1) {
  const g = new THREE.Mesh(new THREE.OctahedronGeometry(0.16 * scale, 0), mat(color, 0.25, 0.38));
  g.position.set(...pos);
  g.castShadow = true;
  parent.add(g);
  return g;
}
function darken(color: number, factor: number) { const c = new THREE.Color(color); c.multiplyScalar(factor); return c.getHex(); }

const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.7, 0.42, 8), mat(0x25335f, 0.68, 0.08));
floor.position.y = -1.42;
floor.receiveShadow = true;
world.add(floor);

const body = cube('body', [1.12, 1.52, 0.55], [0, 0.05, 0], 0x38bdf8, 0.05);
const head = cube('head', [0.9, 0.9, 0.9], [0, 1.38, 0], 0xf2b680);
const hair = cube('hair', [0.96, 0.24, 0.96], [0, 1.92, 0], 0x6b3f24);
const leftArm = cube('left-arm', [0.34, 1.18, 0.38], [-0.83, 0.05, 0], 0xf2b680);
const rightArm = cube('right-arm', [0.34, 1.18, 0.38], [0.83, 0.05, 0], 0xf2b680);
const leftLeg = cube('left-leg', [0.42, 1.15, 0.42], [-0.28, -1.18, 0], 0x1d4ed8);
const rightLeg = cube('right-leg', [0.42, 1.15, 0.42], [0.28, -1.18, 0], 0x1d4ed8);
hero.add(body, head, hair, leftArm, rightArm, leftLeg, rightLeg);

const face = new THREE.Group();
const eyeGeo = new THREE.BoxGeometry(0.12, 0.14, 0.035);
const le = new THREE.Mesh(eyeGeo, mat(0x111827)); le.position.set(-0.18, 1.47, 0.47);
const re = new THREE.Mesh(eyeGeo, mat(0x111827)); re.position.set(0.18, 1.47, 0.47);
const smile = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.055, 0.035), mat(0xef4444)); smile.position.set(0, 1.2, 0.47);
const grinL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.055, 0.035), mat(0xef4444)); grinL.position.set(-0.18, 1.24, 0.47); grinL.rotation.z = 0.55;
const grinR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.055, 0.035), mat(0xef4444)); grinR.position.set(0.18, 1.24, 0.47); grinR.rotation.z = -0.55;
face.add(le, re, smile, grinL, grinR);
hero.add(face);

function refreshGear() {
  gear.clear(); partnerGroup.clear(); sparkleGroup.clear();
  const armor = options.armor[state.armor];
  const melee = options.melee[state.melee];
  const ranged = options.ranged[state.ranged];
  const artifact = options.artifact[state.artifact];
  const look = options.look[state.look];

  body.material = mat(armor.color, 0.42, 0.16);
  head.material = mat(photoSkin ?? look.color);
  leftArm.material = mat(photoSkin ?? look.color);
  rightArm.material = mat(photoSkin ?? look.color);
  hair.material = mat(photoHair ?? look.accent);
  leftLeg.material = mat(darken(armor.color, 0.45));
  rightLeg.material = mat(darken(armor.color, 0.45));

  gear.add(cube('helmet', [1.05, 0.28, 1.05], [0, 1.91, 0], armor.accent, 0.12));
  gear.add(cube('left-pauldron', [0.36, 0.3, 0.62], [-0.72, 0.64, 0], armor.accent, 0.14));
  gear.add(cube('right-pauldron', [0.36, 0.3, 0.62], [0.72, 0.64, 0], armor.accent, 0.14));
  gear.add(cube('belt', [1.2, 0.16, 0.62], [0, -0.42, 0], darken(armor.accent, 0.65), 0.1));
  gear.add(cube('left-boot', [0.48, 0.18, 0.48], [-0.28, -1.84, 0.03], armor.accent, 0.1));
  gear.add(cube('right-boot', [0.48, 0.18, 0.48], [0.28, -1.84, 0.03], armor.accent, 0.1));
  gem(gear, armor.accent, [0, 0.36, 0.35], 1.1);

  if (melee.name.includes('Hammer')) {
    gear.add(cube('hammer-handle', [0.13, 1.25, 0.13], [1.24, 0.02, 0.15], melee.color));
    gear.add(cube('hammer-head', [0.62, 0.32, 0.34], [1.24, 0.7, 0.15], melee.accent, 0.2));
  } else if (melee.name.includes('Daggers')) {
    gear.add(cube('dagger-a', [0.12, 0.78, 0.08], [1.07, 0.12, 0.24], melee.accent, 0.28));
    gear.add(cube('dagger-b', [0.12, 0.78, 0.08], [-1.07, 0.12, 0.24], melee.accent, 0.28));
  } else if (melee.name.includes('Axe')) {
    gear.add(cube('axe-handle', [0.13, 1.18, 0.13], [1.22, 0.06, 0.18], melee.color));
    gear.add(cube('axe-head', [0.5, 0.42, 0.13], [1.34, 0.58, 0.18], melee.accent, 0.25));
  } else {
    gear.add(cube('sword-handle', [0.12, 0.42, 0.12], [1.16, -0.35, 0.22], melee.color));
    gear.add(cube('sword-blade', [0.18, 1.08, 0.08], [1.16, 0.33, 0.22], melee.accent, 0.35));
  }

  if (ranged.name.includes('Bow')) {
    const bow = new THREE.Group();
    const bowTop = cube('bow-top', [0.12, 0.82, 0.08], [-1.2, 0.36, 0.2], ranged.color); bowTop.rotation.z = -0.35;
    const bowBottom = cube('bow-bottom', [0.12, 0.82, 0.08], [-1.2, -0.36, 0.2], ranged.color); bowBottom.rotation.z = 0.35;
    bow.add(bowTop, bowBottom);
    bow.add(cube('bow-grip', [0.15, 0.3, 0.12], [-1.16, 0.02, 0.22], ranged.accent));
    bow.add(cube('bow-string', [0.035, 1.42, 0.035], [-0.96, 0.02, 0.24], 0xf8fafc));
    bow.add(cube('arrow', [0.75, 0.055, 0.055], [-1.16, 0.02, 0.42], ranged.accent, 0.16));
    gear.add(bow);
  } else if (ranged.name.includes('Wand')) {
    gear.add(cube('wand', [0.12, 1.1, 0.12], [-1.13, 0.08, 0.2], ranged.color, 0.18));
    gem(gear, ranged.accent, [-1.13, 0.73, 0.2], 1.3);
  } else {
    gear.add(cube('ranged-base', [0.88, 0.24, 0.24], [-1.12, 0.16, 0.2], ranged.color, 0.12));
    gear.add(cube('ranged-tip', [0.25, 0.34, 0.34], [-1.65, 0.16, 0.2], ranged.accent, 0.18));
  }
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12), mat(artifact.accent, 0.22, 0.2));
  orb.position.set(0.58, 0.95, 0.42); orb.castShadow = true; gear.add(orb);
  makePartner(); makeSparkles(armor.accent, artifact.accent); updateUiText();
}

function makePartner() {
  const p = options.partner[state.partner];
  partnerGroup.position.set(-1.85, -0.84, 0.75);
  partnerGroup.add(cube('partner-body', [0.72, 0.55, 0.56], [0, 0, 0], p.color, 0.08));
  partnerGroup.add(cube('partner-head', [0.48, 0.45, 0.45], [0.48, 0.22, 0.02], p.color, 0.08));
  if (p.name.includes('Dragon')) {
    partnerGroup.add(cube('wing-l', [0.12, 0.42, 0.65], [-0.28, 0.22, -0.42], p.accent));
    partnerGroup.add(cube('wing-r', [0.12, 0.42, 0.65], [-0.28, 0.22, 0.42], p.accent));
  } else if (p.name.includes('Robot')) {
    gem(partnerGroup, p.accent, [0.48, 0.25, 0.25], 0.65); gem(partnerGroup, p.accent, [0.48, 0.25, -0.25], 0.65);
  } else if (p.name.includes('Wolf')) {
    partnerGroup.add(cube('tail', [0.5, 0.16, 0.16], [-0.55, 0.12, 0], p.accent));
    partnerGroup.add(cube('ear-a', [0.16, 0.22, 0.12], [0.54, 0.54, 0.18], p.accent));
    partnerGroup.add(cube('ear-b', [0.16, 0.22, 0.12], [0.54, 0.54, -0.18], p.accent));
  } else {
    partnerGroup.add(cube('golem-rock', [0.32, 0.32, 0.32], [-0.4, 0.42, 0.28], p.accent));
  }
}
function makeSparkles(a: number, b: number) {
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.035 + Math.random() * 0.045), mat(i % 2 ? a : b, 0.2, 0.25));
    const angle = (i / 18) * Math.PI * 2;
    s.position.set(Math.cos(angle) * (1.4 + Math.random() * 1.2), -0.7 + Math.random() * 2.8, Math.sin(angle) * (1.4 + Math.random() * 1.2));
    s.userData.float = Math.random() * Math.PI * 2;
    sparkleGroup.add(s);
  }
}

function buildSelectors() {
  const labels: Record<Slot, string> = { armor: 'Armor', melee: 'Close Weapon', ranged: 'Long Weapon', partner: 'Partner', artifact: 'Power', look: 'Look' };
  (Object.keys(options) as Slot[]).forEach((slot) => {
    const box = document.createElement('section');
    box.className = 'selector';
    box.innerHTML = `<div class="selector-header"><h2>${labels[slot]}</h2><span class="value" data-value="${slot}"></span></div><div class="choice-row"><button type="button" data-dir="-1" data-slot="${slot}">‹</button><button class="equip" type="button" data-dir="1" data-slot="${slot}"></button><button type="button" data-dir="1" data-slot="${slot}">›</button></div>`;
    selectors.appendChild(box);
  });
  selectors.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-slot]');
    if (!button) return;
    const slot = button.dataset.slot as Slot;
    const dir = Number(button.dataset.dir ?? 1);
    state[slot] = (state[slot] + dir + options[slot].length) % options[slot].length;
    refreshGear();
  });
}
function updateUiText() {
  (Object.keys(options) as Slot[]).forEach((slot) => {
    const opt = options[slot][state[slot]];
    document.querySelector(`[data-value="${slot}"]`)!.textContent = `${opt.emoji} ${opt.name}`;
    document.querySelector<HTMLButtonElement>(`.equip[data-slot="${slot}"]`)!.textContent = `${opt.emoji} ${opt.name}`;
  });
  heroTitle.textContent = `${options.partner[state.partner].title} ${options.armor[state.armor].title} with ${options.ranged[state.ranged].title}`;
  updateStats();
}
function updateStats() {
  const total: Record<Stat, number> = { might: 1, speed: 1, magic: 1, team: 1 };
  (Object.keys(options) as Slot[]).forEach((slot) => Object.entries(options[slot][state[slot]].power).forEach(([k, v]) => total[k as Stat] += v ?? 0));
  statsEl.innerHTML = Object.entries(total).map(([k, v]) => `<div class="stat-row"><span>${k}</span><span class="meter"><i style="width:${Math.min(100, v * 12)}%"></i></span><b>${v}</b></div>`).join('');
}
function randomize() {
  (Object.keys(options) as Slot[]).forEach((slot) => state[slot] = Math.floor(Math.random() * options[slot].length));
  heroName.value = ['Leo the Brave', 'Captain Spark', 'Dungeon Buddy', 'Wolf Hero', 'Robot Knight', 'Thunder Leo'][Math.floor(Math.random() * 6)];
  refreshGear();
}
function averageImageColors(file: File) {
  const img = new Image(); const url = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement('canvas'); canvas.width = 48; canvas.height = 48;
    const ctx = canvas.getContext('2d')!; ctx.drawImage(img, 0, 0, 48, 48);
    const data = ctx.getImageData(0, 0, 48, 48).data;
    const skin = new THREE.Color(); const hairC = new THREE.Color(); let skinN = 0, hairN = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2]; const max = Math.max(r,g,b), min = Math.min(r,g,b);
      if (max - min > 18 && r > g * 0.92 && g > b * 0.72 && r > 75) { skin.r += r/255; skin.g += g/255; skin.b += b/255; skinN++; }
      if (r + g + b < 260 || (r > 80 && g > 45 && b < 45)) { hairC.r += r/255; hairC.g += g/255; hairC.b += b/255; hairN++; }
    }
    if (skinN) photoSkin = skin.multiplyScalar(1 / skinN).getHex();
    if (hairN) photoHair = hairC.multiplyScalar(1 / hairN).lerp(new THREE.Color(0x2b170f), 0.22).getHex();
    URL.revokeObjectURL(url); refreshGear();
  };
  img.src = url;
}

document.querySelector('#randomize')!.addEventListener('click', randomize);
document.querySelector<HTMLInputElement>('#photo-upload')!.addEventListener('change', (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) averageImageColors(file); });
let dragging = false, lastX = 0, targetRot = -0.28, zoom = 6.15;
wrap.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; wrap.setPointerCapture(e.pointerId); });
wrap.addEventListener('pointermove', (e) => { if (dragging) { targetRot += (e.clientX - lastX) * 0.012; lastX = e.clientX; } });
wrap.addEventListener('pointerup', () => dragging = false);
wrap.addEventListener('wheel', (e) => { e.preventDefault(); zoom = THREE.MathUtils.clamp(zoom + e.deltaY * 0.006, 4.7, 9.5); }, { passive: false });
function resize() { const rect = wrap.getBoundingClientRect(); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); renderer.setSize(rect.width, rect.height); }
window.addEventListener('resize', resize);
function animate(t = 0) {
  requestAnimationFrame(animate);
  hero.rotation.y = THREE.MathUtils.lerp(hero.rotation.y, targetRot, 0.085); camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoom, 0.08);
  camera.lookAt(0, 0.05, 0);
  hero.position.y = Math.sin(t * 0.004) * 0.055; partnerGroup.position.y = -0.84 + Math.sin(t * 0.005 + 1.3) * 0.05;
  rightArm.rotation.z = -0.12 + Math.sin(t * 0.006) * 0.08; leftArm.rotation.z = 0.12 + Math.sin(t * 0.006 + Math.PI) * 0.08;
  sparkleGroup.children.forEach((child, i) => { child.rotation.y += 0.02 + i * 0.0005; child.position.y += Math.sin(t * 0.002 + child.userData.float) * 0.0018; });
  renderer.render(scene, camera);
}
buildSelectors(); resize(); refreshGear(); animate();
