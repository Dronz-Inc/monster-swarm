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
camera.position.set(4.55, 3.35, 7.15);
let autoZoom = true;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
wrap.appendChild(renderer.domElement);

const world = new THREE.Group();
const hero = new THREE.Group();
const gear = new THREE.Group();
const partnerGroup = new THREE.Group();
const sparkleGroup = new THREE.Group();
const loadoutGroup = new THREE.Group();
scene.add(world);
world.add(hero, partnerGroup, sparkleGroup, loadoutGroup);
hero.scale.setScalar(0.92);
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
function lighten(color: number, factor: number) { const c = new THREE.Color(color); c.lerp(new THREE.Color(0xffffff), factor); return c.getHex(); }
function trim(parent: THREE.Group, name: string, size: [number, number, number], pos: [number, number, number], color: number, metalness = 0.1) {
  const piece = cube(name, size, pos, color, metalness);
  parent.add(piece);
  return piece;
}
function rune(parent: THREE.Group, color: number, x: number, y: number, z: number) {
  const r = cube('rune', [0.08, 0.18, 0.035], [x, y, z], color, 0.22);
  r.rotation.z = 0.8;
  parent.add(r);
  return r;
}
function makeStrap(parent: THREE.Group, x: number, y: number, z: number, color = 0x2a1a12) {
  trim(parent, 'leather-strap-a', [0.92, 0.08, 0.04], [x, y, z], color, 0.03).rotation.z = 0.58;
  trim(parent, 'leather-strap-b', [0.92, 0.08, 0.04], [x, y, z], color, 0.03).rotation.z = -0.58;
}
function makeBlade(parent: THREE.Group, name: string, x: number, y: number, z: number, color: number, accent: number, tall = 1.1) {
  trim(parent, `${name}-grip`, [0.13, 0.42, 0.13], [x, y, z], color, 0.12);
  trim(parent, `${name}-guard`, [0.5, 0.09, 0.1], [x, y + 0.26, z], color, 0.18);
  trim(parent, `${name}-blade`, [0.2, tall, 0.08], [x, y + 0.26 + tall / 2, z], accent, 0.42);
  trim(parent, `${name}-edge`, [0.04, tall * 0.92, 0.09], [x + 0.12, y + 0.32 + tall / 2, z], lighten(accent, 0.35), 0.48);
}

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

function makePortalSet() {
  const portal = new THREE.Group();
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xff7a22, transparent: true, opacity: 0.42, depthWrite: false });
  const hotMat = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.34, depthWrite: false });
  const core = new THREE.Mesh(new THREE.PlaneGeometry(2.65, 3.55), glowMat);
  core.position.set(0, 0.35, -2.16);
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 2.65), hotMat);
  inner.position.set(0, 0.3, -2.12);
  portal.add(core, inner);
  const hot = mat(0xff7a22, 0.35, 0.02);
  const ember = mat(0xffc052, 0.32, 0.02);
  for (let i = 0; i < 11; i++) {
    const h = 1.1 + i * 0.12;
    const columnL = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, 0.12), i % 2 ? hot : ember);
    columnL.position.set(-0.98 - i * 0.07, -0.75 + h / 2, -2.0 - i * 0.006);
    const columnR = columnL.clone();
    columnR.position.x *= -1;
    portal.add(columnL, columnR);
  }
  for (let i = 0; i < 9; i++) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.1), i % 2 ? hot : ember);
    cap.position.set(-1.35 + i * 0.34, 2.08 + Math.sin(i) * 0.06, -2.02);
    portal.add(cap);
  }
  const portalLight = new THREE.PointLight(0xff7a22, 13, 11);
  portalLight.position.set(0, 0.38, -1.35);
  const floorLight = new THREE.PointLight(0xff3d1a, 4.5, 6);
  floorLight.position.set(0, -1.05, 0.4);
  world.add(portalLight, floorLight, portal);
}
makePortalSet();

const body = cube('body', [1.18, 1.45, 0.62], [0, 0.08, 0], 0x3e5571, 0.09);
const head = cube('head', [0.9, 0.86, 0.9], [0, 1.35, 0], 0xb77b55);
const hair = cube('hair', [0.96, 0.28, 0.96], [0, 1.86, 0], 0x3a2316);
const leftArm = cube('left-arm', [0.38, 1.12, 0.42], [-0.86, 0.03, 0], 0xb77b55);
leftArm.rotation.z = 0.12;
const rightArm = cube('right-arm', [0.38, 1.12, 0.42], [0.86, 0.03, 0], 0xb77b55);
rightArm.rotation.z = -0.54;
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
  gear.clear(); partnerGroup.clear(); sparkleGroup.clear(); loadoutGroup.clear();
  const armor = options.armor[state.armor];
  const melee = options.melee[state.melee];
  const ranged = options.ranged[state.ranged];
  const rangedName = ranged.name.toLowerCase();
  const artifact = options.artifact[state.artifact];
  const look = options.look[state.look];

  body.material = mat(armor.color, 0.48, 0.14);
  head.material = mat(photoSkin ?? look.color, 0.58, 0.02);
  leftArm.material = mat(photoSkin ?? look.color, 0.58, 0.02);
  rightArm.material = mat(photoSkin ?? look.color, 0.58, 0.02);
  hair.material = mat(photoHair ?? look.accent, 0.7, 0.02);
  leftLeg.material = mat(darken(armor.color, 0.42), 0.62, 0.04);
  rightLeg.material = mat(darken(armor.color, 0.42), 0.62, 0.04);

  trim(gear, 'cloak', [1.3, 1.9, 0.1], [0, -0.05, -0.43], darken(armor.color, 0.5), 0.02);
  trim(gear, 'cloak-hem', [1.18, 0.08, 0.12], [0, -0.98, -0.39], armor.accent, 0.08);
  trim(gear, 'helmet', [1.05, 0.3, 1.05], [0, 1.88, 0], armor.accent, 0.14);
  trim(gear, 'helmet-crown', [0.72, 0.12, 1.08], [0, 2.1, 0], lighten(armor.accent, 0.08), 0.18);
  trim(gear, 'helmet-side-l', [0.16, 0.42, 0.2], [-0.52, 1.63, 0.12], darken(armor.accent, 0.72), 0.14);
  trim(gear, 'helmet-side-r', [0.16, 0.42, 0.2], [0.52, 1.63, 0.12], darken(armor.accent, 0.72), 0.14);
  trim(gear, 'brow-guard', [1.0, 0.16, 0.22], [0, 1.64, 0.47], darken(armor.accent, 0.7), 0.2);
  trim(gear, 'left-pauldron', [0.5, 0.34, 0.7], [-0.78, 0.66, 0], armor.accent, 0.2);
  trim(gear, 'right-pauldron', [0.5, 0.34, 0.7], [0.78, 0.66, 0], armor.accent, 0.2);
  trim(gear, 'chest-plate', [1.02, 0.72, 0.09], [0, 0.24, 0.37], darken(armor.accent, 0.86), 0.22);
  trim(gear, 'chest-highlight', [0.88, 0.08, 0.11], [0, 0.55, 0.43], lighten(armor.accent, 0.12), 0.24);
  for (const x of [-0.36, -0.12, 0.12, 0.36]) {
    trim(gear, 'armor-rivet', [0.07, 0.07, 0.055], [x, 0.49, 0.47], lighten(armor.accent, 0.22), 0.28);
    trim(gear, 'armor-rivet-low', [0.06, 0.06, 0.055], [x * 0.82, 0.05, 0.47], darken(armor.accent, 0.7), 0.2);
  }
  trim(gear, 'plate-seam-left', [0.06, 0.62, 0.045], [-0.31, 0.22, 0.46], darken(armor.color, 0.5), 0.06);
  trim(gear, 'plate-seam-right', [0.06, 0.62, 0.045], [0.31, 0.22, 0.46], darken(armor.color, 0.5), 0.06);
  trim(gear, 'belt', [1.22, 0.18, 0.66], [0, -0.43, 0], darken(armor.accent, 0.52), 0.12);
  trim(gear, 'belt-buckle', [0.22, 0.22, 0.11], [0, -0.42, 0.39], lighten(armor.accent, 0.18), 0.26);
  trim(gear, 'tunic-left', [0.46, 0.5, 0.08], [-0.25, -0.76, 0.35], darken(armor.color, 0.62), 0.04);
  trim(gear, 'tunic-right', [0.46, 0.5, 0.08], [0.25, -0.76, 0.35], darken(armor.color, 0.62), 0.04);
  trim(gear, 'left-bracer', [0.42, 0.24, 0.46], [-0.86, -0.22, 0], armor.accent, 0.14);
  trim(gear, 'right-bracer', [0.42, 0.24, 0.46], [0.86, -0.22, 0], armor.accent, 0.14);
  trim(gear, 'left-boot', [0.5, 0.22, 0.5], [-0.3, -1.76, 0.03], armor.accent, 0.12);
  trim(gear, 'right-boot', [0.5, 0.22, 0.5], [0.3, -1.76, 0.03], armor.accent, 0.12);
  rune(gear, lighten(armor.accent, 0.2), -0.23, 0.28, 0.43);
  rune(gear, lighten(armor.accent, 0.2), 0.23, 0.28, 0.43);
  makeStrap(gear, 0, 0.04, 0.44);

  const meleeGroup = new THREE.Group();
  const rangedIsPrimary = rangedName.includes('bow') || rangedName.includes('crossbow') || rangedName.includes('staff');
  meleeGroup.position.set(rangedIsPrimary ? 0.95 : 0.72, rangedIsPrimary ? -0.82 : 0.04, rangedIsPrimary ? -0.5 : 0.22);
  meleeGroup.rotation.z = rangedIsPrimary ? -1.08 : -0.5;
  meleeGroup.scale.setScalar(rangedIsPrimary ? 0.5 : 1);
  if (melee.name.includes('Hammer')) {
    trim(meleeGroup, 'hammer-grip', [0.14, 1.28, 0.14], [0.12, 0.36, 0], melee.color, 0.1);
    trim(meleeGroup, 'hammer-core', [0.66, 0.34, 0.34], [0.12, 1.13, 0], melee.accent, 0.28);
    trim(meleeGroup, 'hammer-cap-l', [0.16, 0.42, 0.42], [-0.29, 1.13, 0], lighten(melee.accent, 0.16), 0.32);
    trim(meleeGroup, 'hammer-cap-r', [0.16, 0.42, 0.42], [0.53, 1.13, 0], darken(melee.accent, 0.8), 0.26);
  } else if (melee.name.includes('Daggers')) {
    makeBlade(meleeGroup, 'dagger-right', 0.18, 0.26, 0.08, melee.color, melee.accent, 0.62);
    const offhand = new THREE.Group();
    makeBlade(offhand, 'dagger-left', -0.42, -0.26, 0.1, melee.color, melee.accent, 0.58);
    offhand.rotation.z = 1.35;
    gear.add(offhand);
  } else if (melee.name.includes('Axe')) {
    trim(meleeGroup, 'axe-grip', [0.14, 1.28, 0.14], [0.12, 0.42, 0], melee.color, 0.08);
    trim(meleeGroup, 'axe-head', [0.58, 0.52, 0.12], [0.34, 1.16, 0], melee.accent, 0.32);
    trim(meleeGroup, 'axe-beard', [0.22, 0.42, 0.12], [0.08, 0.96, 0], lighten(melee.accent, 0.16), 0.32);
  } else {
    makeBlade(meleeGroup, 'longsword', 0.1, 0.24, 0.02, melee.color, melee.accent, 1.12);
  }
  gear.add(meleeGroup);
  trim(gear, 'right-hand-grip', [0.24, 0.2, 0.24], [rangedIsPrimary ? 0.52 : 0.88, rangedIsPrimary ? 0.2 : 0.14, rangedIsPrimary ? 0.86 : 0.34], photoSkin ?? look.color, 0.02);

  const rangedGroup = new THREE.Group();
  rangedGroup.position.set(-0.72, 0.18, -0.04);
  if (rangedName.includes('bow')) {
    rangedGroup.position.set(-0.78, 0.32, 1.24);
    rangedGroup.rotation.z = -0.08;
    rangedGroup.rotation.y = -0.04;
    rangedGroup.scale.setScalar(1.18);
    const bowMat = mat(ranged.color, 0.5, 0.08);
    const bowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 1.08, 0.0),
      new THREE.Vector3(-0.42, 0.62, 0.0),
      new THREE.Vector3(-0.56, 0.0, 0.0),
      new THREE.Vector3(-0.42, -0.62, 0.0),
      new THREE.Vector3(-0.08, -1.08, 0.0),
    ]);
    const bowMesh = new THREE.Mesh(new THREE.TubeGeometry(bowCurve, 18, 0.045, 8, false), bowMat);
    bowMesh.castShadow = true;
    bowMesh.receiveShadow = true;
    rangedGroup.add(bowMesh);
    const upperTip = trim(rangedGroup, 'bow-tip-top', [0.2, 0.08, 0.1], [-0.13, 1.0, 0], ranged.accent, 0.12); upperTip.rotation.z = -0.35;
    const lowerTip = trim(rangedGroup, 'bow-tip-bottom', [0.2, 0.08, 0.1], [-0.13, -1.0, 0], ranged.accent, 0.12); lowerTip.rotation.z = 0.35;
    trim(rangedGroup, 'bow-grip', [0.18, 0.36, 0.14], [-0.5, 0.0, 0.05], ranged.accent, 0.14);
    trim(rangedGroup, 'bow-leather-wrap-a', [0.24, 0.055, 0.16], [-0.5, 0.12, 0.11], darken(ranged.color, 0.62), 0.06);
    trim(rangedGroup, 'bow-leather-wrap-b', [0.24, 0.055, 0.16], [-0.5, -0.12, 0.11], darken(ranged.color, 0.62), 0.06);
    const stringMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const string = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.92, 0.035), stringMat);
    string.position.set(0.08, 0.0, 0.08);
    rangedGroup.add(string);
    trim(rangedGroup, 'nocked-arrow-shaft', [1.36, 0.06, 0.06], [-0.38, 0.02, 0.34], 0xe6c17a, 0.12);
    trim(rangedGroup, 'nocked-arrow-head', [0.2, 0.16, 0.12], [0.36, 0.02, 0.34], lighten(ranged.accent, 0.28), 0.24);
    trim(rangedGroup, 'arrow-fletch-a', [0.16, 0.07, 0.11], [-1.08, 0.11, 0.34], ranged.accent, 0.08).rotation.z = 0.5;
    trim(rangedGroup, 'arrow-fletch-b', [0.16, 0.07, 0.11], [-1.08, -0.07, 0.34], ranged.accent, 0.08).rotation.z = -0.5;
    trim(rangedGroup, 'spare-arrow-shaft-a', [0.95, 0.045, 0.045], [-0.18, -0.24, -0.08], 0xe6c17a, 0.08).rotation.z = -0.16;
    trim(rangedGroup, 'spare-arrow-shaft-b', [0.95, 0.045, 0.045], [-0.15, -0.38, -0.08], 0xe6c17a, 0.08).rotation.z = -0.16;
    trim(gear, 'bow-left-hand', [0.28, 0.22, 0.26], [-0.92, 0.34, 1.14], photoSkin ?? look.color, 0.02);
    trim(gear, 'bow-right-hand', [0.28, 0.22, 0.26], [0.18, 0.2, 1.2], photoSkin ?? look.color, 0.02);
    trim(gear, 'arrow-pull-hand', [0.24, 0.2, 0.22], [-0.18, 0.02, 1.28], photoSkin ?? look.color, 0.02);
    const visibleBowTop = trim(gear, 'visible-longbow-top', [0.18, 1.2, 0.18], [-1.72, 0.9, 1.76], lighten(ranged.color, 0.16), 0.1);
    visibleBowTop.rotation.z = -0.24;
    const visibleBowBottom = trim(gear, 'visible-longbow-bottom', [0.18, 1.2, 0.18], [-1.72, -0.32, 1.76], lighten(ranged.color, 0.16), 0.1);
    visibleBowBottom.rotation.z = 0.24;
    trim(gear, 'visible-longbow-grip', [0.26, 0.4, 0.22], [-1.48, 0.28, 1.86], ranged.accent, 0.16);
    trim(gear, 'visible-longbow-string', [0.045, 2.35, 0.05], [-1.26, 0.28, 1.96], 0xf8fafc, 0.0);
    trim(gear, 'visible-longbow-arrow', [1.3, 0.07, 0.07], [-0.86, 0.28, 2.02], 0xe6c17a, 0.12);
    trim(gear, 'visible-longbow-arrowhead', [0.18, 0.14, 0.1], [-0.26, 0.28, 2.02], lighten(ranged.accent, 0.28), 0.24);
    const rack = new THREE.Group();
    rack.position.set(1.82, 0.12, 1.52);
    rack.rotation.y = 0.22;
    rack.scale.setScalar(1.35);
    const rackTop = trim(rack, 'showcase-longbow-top', [0.16, 1.0, 0.16], [-0.18, 0.56, 0], 0xff9d2e, 0.12);
    rackTop.rotation.z = -0.35;
    const rackBottom = trim(rack, 'showcase-longbow-bottom', [0.16, 1.0, 0.16], [-0.18, -0.52, 0], 0xff9d2e, 0.12);
    rackBottom.rotation.z = 0.35;
    trim(rack, 'showcase-longbow-string', [0.06, 1.96, 0.06], [0.24, 0.02, 0.06], 0xf8fafc, 0.0);
    trim(rack, 'showcase-longbow-grip', [0.24, 0.36, 0.2], [-0.08, 0.02, 0.1], ranged.accent, 0.16);
    trim(rack, 'showcase-arrow-shaft', [0.96, 0.06, 0.06], [0.0, 0.02, 0.24], 0xe6c17a, 0.1);
    trim(rack, 'showcase-arrow-head', [0.18, 0.14, 0.1], [0.54, 0.02, 0.24], lighten(ranged.accent, 0.28), 0.24);
    loadoutGroup.add(rack);
  } else if (rangedName.includes('crossbow')) {
    rangedGroup.position.set(-0.04, 0.28, 0.92);
    rangedGroup.rotation.z = -0.04;
    const wood = ranged.color;
    const steel = ranged.accent;
    trim(rangedGroup, 'crossbow-main-stock', [1.28, 0.2, 0.24], [0.08, 0.0, 0.16], wood, 0.12);
    trim(rangedGroup, 'crossbow-butt', [0.24, 0.34, 0.24], [0.78, -0.02, 0.15], darken(wood, 0.65), 0.08);
    trim(rangedGroup, 'crossbow-front-block', [0.28, 0.34, 0.28], [-0.58, 0.0, 0.2], darken(wood, 0.72), 0.12);
    trim(rangedGroup, 'crossbow-upper-limb', [0.22, 0.78, 0.12], [-0.68, 0.44, 0.24], steel, 0.22).rotation.z = 0.18;
    trim(rangedGroup, 'crossbow-lower-limb', [0.22, 0.78, 0.12], [-0.68, -0.44, 0.24], steel, 0.22).rotation.z = -0.18;
    trim(rangedGroup, 'crossbow-tip-top', [0.34, 0.14, 0.13], [-0.78, 0.86, 0.24], lighten(steel, 0.18), 0.24);
    trim(rangedGroup, 'crossbow-tip-bottom', [0.34, 0.14, 0.13], [-0.78, -0.86, 0.24], lighten(steel, 0.18), 0.24);
    trim(rangedGroup, 'crossbow-string-visible', [0.035, 1.72, 0.04], [-0.36, 0.0, 0.36], 0xf8fafc, 0.0);
    trim(rangedGroup, 'crossbow-top-rail', [1.52, 0.07, 0.1], [0.06, 0.11, 0.42], lighten(wood, 0.15), 0.16);
    trim(rangedGroup, 'crossbow-bolt-shaft', [1.62, 0.07, 0.07], [0.02, 0.16, 0.58], 0xd8b26a, 0.2);
    trim(rangedGroup, 'crossbow-bolt-head', [0.2, 0.16, 0.12], [0.94, 0.16, 0.58], 0xd7d2c6, 0.28);
    trim(rangedGroup, 'crossbow-fletch-a', [0.16, 0.07, 0.1], [-0.78, 0.25, 0.58], steel, 0.12).rotation.z = 0.5;
    trim(rangedGroup, 'crossbow-fletch-b', [0.16, 0.07, 0.1], [-0.78, 0.06, 0.58], steel, 0.12).rotation.z = -0.5;
    trim(rangedGroup, 'crossbow-trigger', [0.14, 0.28, 0.12], [0.24, -0.23, 0.34], 0x1a100b, 0.08);
    trim(gear, 'left-crossbow-hand', [0.28, 0.22, 0.26], [-0.48, 0.22, 0.94], photoSkin ?? look.color, 0.02);
    trim(gear, 'right-crossbow-hand', [0.28, 0.22, 0.26], [0.38, 0.18, 0.94], photoSkin ?? look.color, 0.02);
  } else if (rangedName.includes('staff')) {
    rangedGroup.position.set(0.86, 0.1, 1.06);
    rangedGroup.rotation.z = -0.08;
    trim(rangedGroup, 'held-staff-shaft', [0.13, 2.18, 0.13], [0.0, 0.08, 0.0], ranged.color, 0.1);
    trim(rangedGroup, 'held-staff-highlight', [0.045, 2.0, 0.04], [0.055, 0.08, 0.075], 0xff9d2e, 0.03);
    trim(rangedGroup, 'held-staff-butt-cap', [0.24, 0.14, 0.16], [0.0, -1.02, 0.0], darken(ranged.accent, 0.72), 0.12);
    for (const y of [-0.42, -0.18, 0.08, 0.34]) trim(rangedGroup, 'staff-leather-wrap', [0.22, 0.075, 0.16], [0.0, y, 0.02], 0x5a3322, 0.08);
    trim(rangedGroup, 'elder-oak-crown', [0.42, 0.24, 0.2], [0.0, 1.23, 0.0], darken(ranged.color, 0.66), 0.18);
    trim(rangedGroup, 'staff-branch-left', [0.09, 0.58, 0.09], [-0.27, 1.18, 0.0], ranged.color, 0.08).rotation.z = -0.62;
    trim(rangedGroup, 'staff-branch-right', [0.09, 0.58, 0.09], [0.27, 1.18, 0.0], ranged.color, 0.08).rotation.z = 0.62;
    gem(rangedGroup, ranged.accent, [0.0, 1.5, 0.08], 1.35);
    trim(rangedGroup, 'magic-bolt-1', [0.38, 0.08, 0.08], [0.42, 1.48, 0.12], lighten(ranged.accent, 0.28), 0.2).rotation.z = 0.22;
    trim(rangedGroup, 'magic-bolt-2', [0.32, 0.07, 0.07], [-0.38, 1.42, 0.12], lighten(ranged.accent, 0.18), 0.2).rotation.z = -0.3;
    trim(gear, 'staff-main-hand-back', [0.34, 0.24, 0.16], [0.8, 0.12, 0.98], darken(photoSkin ?? look.color, 0.78), 0.04);
    trim(gear, 'staff-main-hand-front', [0.34, 0.24, 0.14], [0.93, 0.12, 1.18], photoSkin ?? look.color, 0.04);
    trim(gear, 'staff-support-hand-back', [0.28, 0.22, 0.15], [0.62, -0.38, 0.94], darken(photoSkin ?? look.color, 0.78), 0.04);
    trim(gear, 'staff-support-hand-front', [0.28, 0.22, 0.13], [0.74, -0.38, 1.14], photoSkin ?? look.color, 0.04);
    const staffGlow = new THREE.PointLight(ranged.accent, 2.8, 4.8);
    staffGlow.position.set(0.0, 1.5, 0.28);
    rangedGroup.add(staffGlow);
  } else {
    trim(rangedGroup, 'lantern-handle', [0.08, 0.72, 0.08], [-0.12, 0.38, 0.18], ranged.color, 0.08);
    trim(rangedGroup, 'lantern-cage', [0.34, 0.48, 0.34], [-0.12, -0.08, 0.18], darken(ranged.color, 0.75), 0.16);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.24), new THREE.MeshBasicMaterial({ color: ranged.accent, transparent: true, opacity: 0.64 }));
    glow.position.set(-0.12, -0.08, 0.18);
    rangedGroup.add(glow);
  }
  if (!rangedName.includes('bow') && !rangedName.includes('crossbow') && !rangedName.includes('staff')) rangedGroup.rotation.z = 0.22;
  gear.add(rangedGroup);
  if (!rangedIsPrimary) trim(gear, 'left-hand-grip', [0.24, 0.2, 0.24], [-0.88, 0.08, 0.3], photoSkin ?? look.color, 0.02);

  makeArtifact(artifact, look);
  makePartner(); makeSparkles(armor.accent, artifact.accent); updateUiText();
}

function makeArtifact(artifact: Option, look: Option) {
  const a = new THREE.Group();
  a.position.set(1.42, -0.28, -0.02);
  a.scale.setScalar(0.72);
  if (artifact.name.includes('Quiver')) {
    trim(a, 'quiver-case', [0.34, 0.95, 0.28], [0.0, 0.25, 0.0], artifact.color, 0.08).rotation.z = -0.18;
    trim(a, 'quiver-band-top', [0.42, 0.08, 0.32], [0.0, 0.58, 0.02], artifact.accent, 0.14).rotation.z = -0.18;
    trim(a, 'quiver-band-low', [0.42, 0.08, 0.32], [0.0, 0.12, 0.02], darken(artifact.accent, 0.72), 0.1).rotation.z = -0.18;
    for (let i = 0; i < 5; i++) {
      const rocket = trim(a, 'firework-rocket', [0.06, 0.76, 0.06], [-0.14 + i * 0.07, 0.88 + (i % 2) * 0.05, 0.08], artifact.accent, 0.12);
      rocket.rotation.z = -0.18;
      trim(a, 'rocket-cap', [0.11, 0.08, 0.08], [-0.14 + i * 0.07, 1.28 + (i % 2) * 0.05, 0.08], lighten(artifact.accent, 0.2), 0.14).rotation.z = -0.18;
    }
    trim(a, 'spark-fuse', [0.22, 0.08, 0.08], [0.16, 1.25, 0.12], lighten(artifact.accent, 0.18), 0.1);
  } else if (artifact.name.includes('Totem')) {
    trim(a, 'totem-body', [0.36, 0.62, 0.2], [0, 0.18, 0], artifact.color, 0.08);
    trim(a, 'totem-face', [0.24, 0.2, 0.05], [0, 0.32, 0.12], artifact.accent, 0.12);
    trim(a, 'totem-arms', [0.62, 0.12, 0.12], [0, 0.16, 0.08], darken(artifact.color, 0.72), 0.06);
  } else if (artifact.name.includes('Boots')) {
    trim(gear, 'boot-glow-l', [0.56, 0.08, 0.56], [-0.3, -1.9, 0.04], artifact.accent, 0.18);
    trim(gear, 'boot-glow-r', [0.56, 0.08, 0.56], [0.3, -1.9, 0.04], artifact.accent, 0.18);
    trim(a, 'boot-charm', [0.2, 0.28, 0.1], [0, 0.2, 0.0], artifact.color, 0.08);
  } else {
    trim(a, 'amulet-chain', [0.52, 0.06, 0.05], [0, 0.52, 0], 0xd8b26a, 0.24).rotation.z = -0.4;
    trim(a, 'amulet-chain-b', [0.52, 0.06, 0.05], [0, 0.52, 0], 0xd8b26a, 0.24).rotation.z = 0.4;
    gem(a, artifact.accent, [0, 0.22, 0.08], 1.0);
    const light = new THREE.PointLight(artifact.accent, 1.6, 3);
    light.position.set(0, 0.24, 0.24);
    a.add(light);
  }
  gear.add(a);
}


function makeAlly(kind: 'rogue' | 'mage', x: number, color: number, accent: number) {
  const g = new THREE.Group();
  g.scale.setScalar(0.56);
  g.position.set(x, -0.82, -0.18);
  trim(g, `${kind}-cloak`, [0.82, 1.16, 0.08], [0, -0.02, -0.28], darken(color, 0.55), 0.02);
  trim(g, `${kind}-body`, [0.76, 1.05, 0.44], [0, 0.0, 0], color, 0.08);
  trim(g, `${kind}-head`, [0.56, 0.54, 0.56], [0, 0.82, 0], 0xa36f52, 0.02);
  trim(g, `${kind}-hood`, [0.68, 0.3, 0.68], [0, 1.1, 0], accent, 0.06);
  trim(g, `${kind}-pauldron-l`, [0.28, 0.22, 0.42], [-0.5, 0.38, 0], accent, 0.12);
  trim(g, `${kind}-pauldron-r`, [0.28, 0.22, 0.42], [0.5, 0.38, 0], accent, 0.12);
  if (kind === 'rogue') {
    const dagger = new THREE.Group();
    makeBlade(dagger, 'rogue-dagger', 0, -0.12, 0.18, 0x3a2a22, 0xd7d2c6, 0.48);
    dagger.position.set(0.48, -0.05, 0.02);
    dagger.rotation.z = -0.55;
    g.add(dagger);
  } else {
    trim(g, 'mage-staff', [0.08, 1.42, 0.08], [-0.52, 0.22, 0.22], 0x5b4128, 0.08);
    trim(g, 'mage-staff-ring', [0.36, 0.08, 0.08], [-0.52, 0.9, 0.22], accent, 0.16);
    gem(g, accent, [-0.52, 1.05, 0.22], 0.72);
  }
  world.add(g);
  return g;
}
const allyRogue = makeAlly('rogue', -1.75, 0x252338, 0x6f5a8b);
allyRogue.scale.setScalar(0.58);
allyRogue.position.z = -0.38;
const allyMage = makeAlly('mage', 1.75, 0x2b4050, 0x7dcfb6);
allyMage.scale.setScalar(0.58);
allyMage.position.z = -0.42;

function makePartner() {
  const p = options.partner[state.partner];
  partnerGroup.position.set(-3.05, -1.16, 0.38);
  partnerGroup.scale.setScalar(1.15);
  const saddle = darken(p.accent, 0.8);
  if (p.name.includes('Wolf')) {
    trim(partnerGroup, 'wolf-body', [0.92, 0.42, 0.46], [0, 0.02, 0], p.color, 0.08);
    trim(partnerGroup, 'wolf-chest', [0.32, 0.48, 0.5], [0.42, 0.12, 0], lighten(p.color, 0.12), 0.08);
    trim(partnerGroup, 'wolf-head', [0.46, 0.42, 0.42], [0.82, 0.24, 0], p.color, 0.08);
    trim(partnerGroup, 'wolf-ear-a', [0.14, 0.24, 0.1], [0.9, 0.58, 0.16], p.accent, 0.06);
    trim(partnerGroup, 'wolf-ear-b', [0.14, 0.24, 0.1], [0.9, 0.58, -0.16], p.accent, 0.06);
    trim(partnerGroup, 'wolf-armor', [0.66, 0.18, 0.54], [0.0, 0.34, 0], saddle, 0.16);
    trim(partnerGroup, 'wolf-helm', [0.38, 0.2, 0.3], [0.78, 0.38, 0], saddle, 0.16);
    trim(partnerGroup, 'wolf-helm-spike', [0.09, 0.28, 0.09], [0.88, 0.62, 0], p.accent, 0.12);
    trim(partnerGroup, 'wolf-strap', [0.08, 0.58, 0.54], [0.1, 0.22, 0], p.accent, 0.12);
    for (const lx of [-0.28, 0.28]) {
      trim(partnerGroup, 'wolf-leg-front', [0.14, 0.44, 0.14], [lx + 0.32, -0.22, 0.16], darken(p.color, 0.72), 0.05);
      trim(partnerGroup, 'wolf-leg-back', [0.14, 0.44, 0.14], [lx - 0.32, -0.22, -0.16], darken(p.color, 0.72), 0.05);
    }
    trim(partnerGroup, 'wolf-snout', [0.28, 0.18, 0.24], [1.1, 0.2, 0], lighten(p.color, 0.16), 0.06);
    trim(partnerGroup, 'wolf-tail', [0.48, 0.14, 0.14], [-0.62, 0.18, 0], p.color, 0.05).rotation.z = 0.35;
  } else if (p.name.includes('Drake')) {
    trim(partnerGroup, 'drake-body', [0.82, 0.42, 0.46], [0, 0.06, 0], p.color, 0.08);
    trim(partnerGroup, 'drake-neck', [0.28, 0.38, 0.28], [0.52, 0.28, 0], p.color, 0.08).rotation.z = -0.25;
    trim(partnerGroup, 'drake-head', [0.46, 0.34, 0.38], [0.82, 0.44, 0], p.color, 0.08);
    trim(partnerGroup, 'drake-wing-l', [0.12, 0.72, 0.72], [-0.18, 0.36, -0.36], p.accent, 0.1).rotation.x = 0.5;
    trim(partnerGroup, 'drake-wing-r', [0.12, 0.72, 0.72], [-0.18, 0.36, 0.36], p.accent, 0.1).rotation.x = -0.5;
    trim(partnerGroup, 'drake-tail', [0.68, 0.12, 0.12], [-0.62, 0.12, 0], p.color, 0.05).rotation.z = -0.25;
    for (const lx of [-0.24, 0.26]) trim(partnerGroup, 'drake-leg', [0.16, 0.34, 0.16], [lx, -0.18, 0.18], darken(p.color, 0.72), 0.05);
  } else if (p.name.includes('Golem')) {
    trim(partnerGroup, 'golem-torso', [0.72, 0.72, 0.52], [0, 0.22, 0], p.color, 0.12);
    trim(partnerGroup, 'golem-head', [0.52, 0.42, 0.42], [0.05, 0.84, 0], lighten(p.color, 0.08), 0.12);
    trim(partnerGroup, 'golem-arm-l', [0.24, 0.62, 0.28], [-0.52, 0.22, 0], darken(p.color, 0.8), 0.12);
    trim(partnerGroup, 'golem-arm-r', [0.24, 0.62, 0.28], [0.52, 0.22, 0], darken(p.color, 0.8), 0.12);
    rune(partnerGroup, p.accent, 0.05, 0.24, 0.28);
    trim(partnerGroup, 'golem-plate', [0.48, 0.12, 0.08], [0, 0.48, 0.3], p.accent, 0.14);
  } else {
    trim(partnerGroup, 'bat-body', [0.38, 0.48, 0.28], [0, 0.28, 0], p.color, 0.05);
    trim(partnerGroup, 'bat-head', [0.34, 0.3, 0.3], [0.3, 0.48, 0], p.color, 0.05);
    trim(partnerGroup, 'bat-wing-l', [0.12, 0.72, 0.82], [-0.22, 0.3, -0.42], p.accent, 0.06).rotation.x = 0.36;
    trim(partnerGroup, 'bat-wing-r', [0.12, 0.72, 0.82], [-0.22, 0.3, 0.42], p.accent, 0.06).rotation.x = -0.36;
    trim(partnerGroup, 'bat-ears', [0.16, 0.22, 0.42], [0.34, 0.76, 0], p.accent, 0.05);
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
let dragging = false, lastX = 0, targetRot = -0.18, zoom = 8.55;
wrap.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; wrap.setPointerCapture(e.pointerId); });
wrap.addEventListener('pointermove', (e) => { if (dragging) { targetRot += (e.clientX - lastX) * 0.012; lastX = e.clientX; } });
wrap.addEventListener('pointerup', () => dragging = false);
wrap.addEventListener('wheel', (e) => { e.preventDefault(); autoZoom = false; zoom = THREE.MathUtils.clamp(zoom + e.deltaY * 0.006, 4.7, 9.8); }, { passive: false });
function updateViewportVars() {
  const viewport = window.visualViewport;
  const height = viewport?.height ?? window.innerHeight;
  const width = viewport?.width ?? window.innerWidth;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
  document.documentElement.style.setProperty('--app-width', `${width}px`);
}
function resize() {
  updateViewportVars();
  const rect = wrap.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height);
  if (autoZoom) {
    const heightZoom = Math.max(0, 620 - rect.height) * 0.0045;
    const narrowZoom = rect.width / rect.height < 1.05 ? 0.55 : 0;
    zoom = THREE.MathUtils.clamp(8.1 + heightZoom + narrowZoom, 7.25, 9.55);
  }
}
window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
window.visualViewport?.addEventListener('scroll', resize);
function animate(t = 0) {
  requestAnimationFrame(animate);
  hero.rotation.y = THREE.MathUtils.lerp(hero.rotation.y, targetRot, 0.085); camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoom, 0.08);
  camera.lookAt(0, 0.05, 0);
  hero.position.y = Math.sin(t * 0.004) * 0.055; partnerGroup.position.y = -0.84 + Math.sin(t * 0.005 + 1.3) * 0.05;
  rightArm.rotation.z = -0.54 + Math.sin(t * 0.006) * 0.06; leftArm.rotation.z = 0.12 + Math.sin(t * 0.006 + Math.PI) * 0.05;
  allyRogue.rotation.y = -0.28 + Math.sin(t * 0.002) * 0.06; allyMage.rotation.y = 0.28 + Math.sin(t * 0.002 + 1.4) * 0.06;
  sparkleGroup.children.forEach((child, i) => { child.rotation.y += 0.02 + i * 0.0005; child.position.y += Math.sin(t * 0.002 + child.userData.float) * 0.0018; });
  renderer.render(scene, camera);
}
buildSelectors(); resize(); refreshGear(); animate();
