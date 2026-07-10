/**
 * GLB Spatial Analysis using Three.js GLTFLoader (already installed).
 * Extracts mesh names, world-space bounding boxes, centers, and materials.
 */
import { readFileSync } from 'fs';
import { Blob } from 'buffer';

// Minimal DOM polyfills for Three.js in Node
globalThis.document = { createElementNS: () => ({}) };
globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.Blob = Blob;
globalThis.URL = { createObjectURL: () => '' };

const THREE = await import('three');

// Read GLB as binary
const buffer = readFileSync('public/models/stadium.glb');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

// Parse GLB manually (binary glTF format)
const dataView = new DataView(arrayBuffer);
const magic = dataView.getUint32(0, true);
const version = dataView.getUint32(4, true);
const length = dataView.getUint32(8, true);

console.log(`=== GLB SPATIAL ANALYSIS ===`);
console.log(`Magic: 0x${magic.toString(16)}, Version: ${version}, Length: ${length}\n`);

// Parse chunks
let offset = 12;
let jsonChunk = null;

while (offset < length) {
  const chunkLength = dataView.getUint32(offset, true);
  const chunkType = dataView.getUint32(offset + 4, true);
  
  if (chunkType === 0x4E4F534A) { // JSON
    const decoder = new TextDecoder();
    jsonChunk = JSON.parse(decoder.decode(new Uint8Array(arrayBuffer, offset + 8, chunkLength)));
  }
  offset += 8 + chunkLength;
}

if (!jsonChunk) {
  console.error('No JSON chunk found');
  process.exit(1);
}

const gltf = jsonChunk;

// Print node hierarchy
console.log('--- NODE HIERARCHY ---\n');

function getNodeTransform(node) {
  const parts = [];
  if (node.translation) parts.push(`T=[${node.translation.map(v => v.toFixed(2)).join(', ')}]`);
  if (node.rotation) parts.push(`R=[${node.rotation.map(v => v.toFixed(4)).join(', ')}]`);
  if (node.scale) parts.push(`S=[${node.scale.map(v => v.toFixed(2)).join(', ')}]`);
  if (node.matrix) parts.push(`M=[${node.matrix.map(v => v.toFixed(2)).join(', ')}]`);
  return parts.join(' ');
}

function printNode(nodeIdx, depth = 0) {
  const node = gltf.nodes[nodeIdx];
  const indent = '  '.repeat(depth);
  const name = node.name || `node_${nodeIdx}`;
  const transform = getNodeTransform(node);
  const meshInfo = node.mesh !== undefined ? ` → mesh[${node.mesh}] "${gltf.meshes[node.mesh]?.name || ''}"` : '';
  
  console.log(`${indent}[${nodeIdx}] "${name}" ${transform}${meshInfo}`);
  
  if (node.children) {
    for (const childIdx of node.children) {
      printNode(childIdx, depth + 1);
    }
  }
}

// Print from scenes
for (const scene of gltf.scenes) {
  console.log(`Scene: "${scene.name || '(unnamed)'}"`);
  for (const nodeIdx of scene.nodes) {
    printNode(nodeIdx);
  }
}

// Print mesh details with accessor-based bounding boxes
console.log('\n--- MESH BOUNDING BOXES (from accessors) ---\n');

for (let mi = 0; mi < gltf.meshes.length; mi++) {
  const mesh = gltf.meshes[mi];
  const name = mesh.name || `mesh_${mi}`;
  
  for (let pi = 0; pi < mesh.primitives.length; pi++) {
    const prim = mesh.primitives[pi];
    const posAccessorIdx = prim.attributes?.POSITION;
    
    if (posAccessorIdx !== undefined) {
      const accessor = gltf.accessors[posAccessorIdx];
      const min = accessor.min;
      const max = accessor.max;
      const count = accessor.count;
      
      const matIdx = prim.material;
      const matName = matIdx !== undefined ? gltf.materials[matIdx]?.name || `mat_${matIdx}` : 'none';
      
      if (min && max) {
        const cx = ((min[0] + max[0]) / 2).toFixed(2);
        const cy = ((min[1] + max[1]) / 2).toFixed(2);
        const cz = ((min[2] + max[2]) / 2).toFixed(2);
        const sx = (max[0] - min[0]).toFixed(2);
        const sy = (max[1] - min[1]).toFixed(2);
        const sz = (max[2] - min[2]).toFixed(2);
        
        console.log(`Mesh[${mi}] "${name}" prim[${pi}]:`);
        console.log(`  Verts: ${count}, Material: "${matName}"`);
        console.log(`  Min: [${min.map(v => v.toFixed(2)).join(', ')}]`);
        console.log(`  Max: [${max.map(v => v.toFixed(2)).join(', ')}]`);
        console.log(`  Center: [${cx}, ${cy}, ${cz}]`);
        console.log(`  Size: [${sx}, ${sy}, ${sz}]`);
        console.log('');
      }
    }
  }
}

// Print materials
console.log('\n--- MATERIALS ---\n');
for (let i = 0; i < gltf.materials.length; i++) {
  const mat = gltf.materials[i];
  const name = mat.name || `mat_${i}`;
  const pbr = mat.pbrMetallicRoughness || {};
  const color = pbr.baseColorFactor || [1, 1, 1, 1];
  const hasTex = pbr.baseColorTexture !== undefined;
  console.log(`[${i}] "${name}" color=[${color.map(v => v.toFixed(3)).join(', ')}] texture=${hasTex ? 'YES (idx:' + pbr.baseColorTexture.index + ')' : 'no'}`);
}

// Print textures & images
console.log('\n--- TEXTURES & IMAGES ---\n');
if (gltf.textures) {
  for (let i = 0; i < gltf.textures.length; i++) {
    const tex = gltf.textures[i];
    const imgIdx = tex.source;
    const img = gltf.images?.[imgIdx];
    console.log(`Texture[${i}]: image[${imgIdx}] "${img?.name || ''}" mimeType="${img?.mimeType || ''}" bufferView=${img?.bufferView}`);
  }
}
