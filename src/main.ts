import * as THREE from 'three';
import './styles.css';

type Slot = 'armor' | 'melee' | 'ranged' | 'partner' | 'artifact' | 'look';
type Stat = 'might' | 'speed' | 'magic' | 'team';
type Option = { name: string; emoji: string; color: number; accent: number; power: Partial<Record<Stat, number>>; title: string };

const options: Record<Slot, Option[]> = {
  armor: [
    { name: 'Wolf Guard Mail', emoji: '◆', color: 0x4f5f4a, accent: 0xd8b26a, power: { might: 3, team: 3 }, title: 'Wolf Guard' },
    { name: 'Champion Plate', emoji: '◈', color: 0x3e5571, accent: 0xd9d2bc, power: { might: 5, team: 1 }, title: 'Champion' },
    { name: 'Ember Scale Armor', emoji: '✦', color: 0x6b2f22, accent: 0xff9d3d, power: { might: 4, magic: 3 }, title: 'Ember Warden' },
    { name: 'Shadow Ranger Leathers', emoji: '◇', color: 0x242136, accent: 0x8f7aa8, power: { speed: 5, magic: 1 }, title: 'Shadow Ranger' },
    { name: 'Highland Battle Kilt', emoji: '⬟', color: 0x35523b, accent: 0xb03b2e, power: { speed: 2, might: 4 }, title: 'Highland Hero' },
  ],
  melee: [
    { name: 'Iron Longsword', emoji: '⚔', color: 0x6f5a3b, accent: 0xd7d2c6, power: { might: 4, speed: 2 }, title: 'Longsword' },
    { name: 'Storm Warhammer', emoji: '✚', color: 0x4d5055, accent: 0x6fb3c7, power: { might: 6, magic: 1 }, title: 'Warhammer' },
    { name: 'Rogue Twin Daggers', emoji: '†', color: 0x3a2a22, accent: 0xd5b07c, power: { speed: 6 }, title: 'Daggers' },
    { name: 'Runed Battle Axe', emoji: 'ᛉ', color: 0x5b4128, accent: 0xa8b49a, power: { might: 5, magic: 2 }, title: 'Battle Axe' },
  ],
  ranged: [
    { name: 'Hunter Longbow', emoji: '➳', color: 0x5a321e, accent: 0xd8b26a, power: { speed: 3, team: 2 }, title: 'Longbow' },
    { name: 'Heavy Crossbow', emoji: '⊹', color: 0x3c3130, accent: 0xb7b1a3, power: { might: 3, speed: 2 }, title: 'Crossbow' },
    { name: 'Elder Oak Staff', emoji: '✶', color: 0x4d3826, accent: 0x7dcfb6, power: { magic: 6 }, title: 'Elder Staff' },
    { name: 'Soul Lantern Caster', emoji: '☽', color: 0x1f3f48, accent: 0x7dd3fc, power: { team: 2, magic: 4 }, title: 'Soul Caster' },
  ],
  partner: [
    { name: 'Armored Wolf', emoji: '♞', color: 0x6d716d, accent: 0xc9b27f, power: { team: 5, might: 1 }, title: 'Wolf-Bonded' },
    { name: 'Hatchling Drake', emoji: '♜', color: 0x31513a, accent: 0xc4603d, power: { magic: 4, might: 2 }, title: 'Drake-Keeper' },
    { name: 'Iron Golem Squire', emoji: '♖', color: 0x7a766d, accent: 0xcabf9a, power: { team: 4, might: 2 }, title: 'Golem-Sworn' },
    { name: 'Cave Bat Familiar', emoji: '✧', color: 0x2e2632, accent: 0x9a8fb0, power: { speed: 3, magic: 3 }, title: 'Bat-Friend' },
  ],
  artifact: [
    { name: 'Firework Quiver', emoji: '✹', color: 0x8e2f25, accent: 0xffc857, power: { magic: 3, might: 3 }, title: 'Firework' },
    { name: 'Totem of Regeneration', emoji: '✥', color: 0x6b4a2c, accent: 0x79b06d, power: { team: 6 }, title: 'Totem-Bearer' },
    { name: 'Boots of Swiftness', emoji: '↟', color: 0x4f392a, accent: 0xd7b46a, power: { speed: 6 }, title: 'Swift' },
    { name: 'Soul Amulet', emoji: '☼', color: 0x123848, accent: 0x7dd3fc, power: { magic: 5, team: 1 }, title: 'Soulbound' },
  ],
  look: [
    { name: 'Village Champion', emoji: 'I', color: 0xb77b55, accent: 0x3a2316, power: { team: 1 }, title: 'Brave' },
    { name: 'Desert Wanderer', emoji: 'II', color: 0x9b684d, accent: 0x21160f, power: { speed: 1 }, title: 'Wanderer' },
    { name: 'Forest Warden', emoji: 'III', color: 0xc28d68, accent: 0x58351d, power: { magic: 1 }, title: 'Warden' },
    { name: 'Arcane Adept', emoji: 'IV', color: 0xa77fbd, accent: 0x191322, power: { magic: 2 }, title: 'Adept' },
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
scene.fog = new THREE.Fog(0x120e0b, 8, 24);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(4.1, 3.15, 6.6);
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

scene.add(new THREE.HemisphereLight(0xcfbf9e, 0x17100c, 1.35));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(4, 8, 5);
sun.castShadow = true;
scene.add(sun);
const rim = new THREE.PointLight(0xff8c32, 5.2, 12);
rim.position.set(-3.7, 2.1, -2.4);
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

const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.7, 0.42, 8), mat(0x2f2821, 0.74, 0.02));
floor.position.y = -1.42;
floor.receiveShadow = true;
world.add(floor);

function makeDungeonSet() {
  const back = new THREE.Group();
  const stone = mat(0x3a332b, 0.82, 0.02);
  for (let i = 0; i < 9; i++) {
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.22), stone);
    brick.position.set(-3 + (i % 5) * 1.45 + (Math.floor(i / 5) * 0.35), -1.07 + Math.floor(i / 5) * 0.3, -2.45);
    brick.castShadow = true;
    brick.receiveShadow = true;
    back.add(brick);
  }
  const leftPillar = cube('left-pillar', [0.42, 2.55, 0.48], [-2.72, -0.18, -1.95], 0x40382f, 0.01);
  const rightPillar = cube('right-pillar', [0.42, 2.55, 0.48], [2.72, -0.18, -1.95], 0x40382f, 0.01);
  const bannerL = cube('banner-left', [0.42, 1.15, 0.04], [-2.72, 0.55, -1.68], 0x6b2f22, 0.02);
  const bannerR = cube('banner-right', [0.42, 1.15, 0.04], [2.72, 0.55, -1.68], 0x253c56, 0.02);
  back.add(leftPillar, rightPillar, bannerL, bannerR);
  world.add(back);
  const torchA = new THREE.PointLight(0xff8a2a, 2.8, 5);
  torchA.position.set(-2.55, 0.92, -1.35);
  const torchB = torchA.clone();
  torchB.position.set(2.55, 0.92, -1.35);
  world.add(torchA, torchB);
}
makeDungeonSet();

const body = cube('body', [1.18, 1.45, 0.62], [0, 0.08, 0], 0x3e5571, 0.09);
const head = cube('head', [0.9, 0.86, 0.9], [0, 1.35, 0], 0xb77b55);
const hair = cube('hair', [0.96, 0.28, 0.96], [0, 1.86, 0], 0x3a2316);
const leftArm = cube('left-arm', [0.38, 1.12, 0.42], [-0.86, 0.03, 0], 0xb77b55);
const rightArm = cube('right-arm', [0.38, 1.12, 0.42], [0.86, 0.03, 0], 0xb77b55);
const leftLeg = cube('left-leg', [0.44, 1.05, 0.44], [-0.3, -1.13, 0], 0x27211c);
const rightLeg = cube('right-leg', [0.44, 1.05, 0.44], [0.3, -1.13, 0], 0x27211c);
hero.add(body, head, hair, leftArm, rightArm, leftLeg, rightLeg);

const face = new THREE.Group();
const eyeGeo = new THREE.BoxGeometry(0.12, 0.14, 0.035);
const le = new THREE.Mesh(eyeGeo, mat(0x111827)); le.position.set(-0.18, 1.47, 0.47);
const re = new THREE.Mesh(eyeGeo, mat(0x111827)); re.position.set(0.18, 1.47, 0.47);
const browL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.045, 0.035), mat(0x2a1911)); browL.position.set(-0.18, 1.58, 0.47); browL.rotation.z = -0.18;
const browR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.045, 0.035), mat(0x2a1911)); browR.position.set(0.18, 1.58, 0.47); browR.rotation.z = 0.18;
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.035), mat(0x4a1f18)); mouth.position.set(0, 1.18, 0.47);
face.add(le, re, browL, browR, mouth);
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

  gear.add(cube('cloak', [1.25, 1.85, 0.1], [0, -0.02, -0.43], darken(armor.color, 0.55), 0.02));
  gear.add(cube('helmet', [1.05, 0.3, 1.05], [0, 1.88, 0], armor.accent, 0.12));
  gear.add(cube('helmet-side-l', [0.16, 0.42, 0.2], [-0.52, 1.63, 0.12], darken(armor.accent, 0.75), 0.14));
  gear.add(cube('helmet-side-r', [0.16, 0.42, 0.2], [0.52, 1.63, 0.12], darken(armor.accent, 0.75), 0.14));
  gear.add(cube('brow-guard', [1.0, 0.16, 0.22], [0, 1.64, 0.47], darken(armor.accent, 0.75), 0.18));
  gear.add(cube('left-pauldron', [0.46, 0.34, 0.68], [-0.76, 0.66, 0], armor.accent, 0.18));
  gear.add(cube('right-pauldron', [0.46, 0.34, 0.68], [0.76, 0.66, 0], armor.accent, 0.18));
  gear.add(cube('chest-plate', [1.0, 0.7, 0.09], [0, 0.24, 0.36], darken(armor.accent, 0.9), 0.2));
  gear.add(cube('belt', [1.22, 0.18, 0.66], [0, -0.43, 0], darken(armor.accent, 0.55), 0.12));
  gear.add(cube('tunic-left', [0.46, 0.5, 0.08], [-0.25, -0.76, 0.35], darken(armor.color, 0.62), 0.04));
  gear.add(cube('tunic-right', [0.46, 0.5, 0.08], [0.25, -0.76, 0.35], darken(armor.color, 0.62), 0.04));
  gear.add(cube('left-bracer', [0.42, 0.24, 0.46], [-0.86, -0.22, 0], armor.accent, 0.12));
  gear.add(cube('right-bracer', [0.42, 0.24, 0.46], [0.86, -0.22, 0], armor.accent, 0.12));
  gear.add(cube('shield-face', [0.12, 0.72, 0.6], [-1.14, 0.18, 0.28], darken(armor.color, 0.58), 0.12));
  gear.add(cube('shield-boss', [0.14, 0.24, 0.24], [-1.08, 0.18, 0.29], armor.accent, 0.18));
  gear.add(cube('left-boot', [0.5, 0.22, 0.5], [-0.3, -1.76, 0.03], armor.accent, 0.1));
  gear.add(cube('right-boot', [0.5, 0.22, 0.5], [0.3, -1.76, 0.03], armor.accent, 0.1));
  gem(gear, armor.accent, [0, 0.48, 0.43], 0.52);

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
  const labels: Record<Slot, string> = { armor: 'Armor Set', melee: 'Melee', ranged: 'Ranged', partner: 'Companion', artifact: 'Artifact', look: 'Origin' };
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
    document.querySelector(`[data-value="${slot}"]`)!.textContent = opt.emoji;
    document.querySelector<HTMLButtonElement>(`.equip[data-slot="${slot}"]`)!.innerHTML = `<span class="sigil">${opt.emoji}</span><span>${opt.name}</span>`;
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
  heroName.value = ['Leo Ironleaf', 'Thorn of Oakvale', 'Garrick Wolfguard', 'Mira Emberhand', 'Rowan Deepdelver', 'Sir Thunderbrook'][Math.floor(Math.random() * 6)];
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
let dragging = false, lastX = 0, targetRot = -0.42, zoom = 6.6;
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
