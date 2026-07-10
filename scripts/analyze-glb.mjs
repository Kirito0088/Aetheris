/**
 * GLB Analysis Script
 * Inspects the stadium GLB file and reports verified metrics.
 */
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

const GLB_PATH = resolve(process.argv[2] || join(process.cwd(), 'KOREA Jeju World Cup Stadium 4K gkb.glb'));

console.log(`\n=== GLB Analysis: ${GLB_PATH} ===\n`);

// Read the GLB file
const buffer = readFileSync(GLB_PATH);
const fileSize = buffer.length;
console.log(`File Size: ${fileSize} bytes (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

// GLB Header (12 bytes)
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546C67) {
  console.error('ERROR: Not a valid GLB file (magic number mismatch)');
  process.exit(1);
}
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);
console.log(`GLB Version: ${version}`);
console.log(`GLB Total Length: ${length}`);

// Parse chunks
let offset = 12;
let jsonChunk = null;
let binChunkLength = 0;

while (offset < length) {
  const chunkLength = buffer.readUInt32LE(offset);
  const chunkType = buffer.readUInt32LE(offset + 4);
  
  if (chunkType === 0x4E4F534A) { // JSON
    const jsonData = buffer.slice(offset + 8, offset + 8 + chunkLength).toString('utf8');
    jsonChunk = JSON.parse(jsonData);
  } else if (chunkType === 0x004E4942) { // BIN
    binChunkLength = chunkLength;
  }
  
  offset += 8 + chunkLength;
}

if (!jsonChunk) {
  console.error('ERROR: No JSON chunk found');
  process.exit(1);
}

console.log(`Binary Data Size: ${binChunkLength} bytes (${(binChunkLength / 1024 / 1024).toFixed(2)} MB)`);

// Asset info
if (jsonChunk.asset) {
  console.log(`\n--- Asset Info ---`);
  console.log(`Generator: ${jsonChunk.asset.generator || 'unknown'}`);
  console.log(`glTF Version: ${jsonChunk.asset.version}`);
  if (jsonChunk.asset.copyright) console.log(`Copyright: ${jsonChunk.asset.copyright}`);
  if (jsonChunk.asset.extras) console.log(`Extras: ${JSON.stringify(jsonChunk.asset.extras)}`);
}

// Scene info
console.log(`\n--- Scenes ---`);
console.log(`Scene Count: ${jsonChunk.scenes?.length || 0}`);
if (jsonChunk.scenes) {
  jsonChunk.scenes.forEach((s, i) => {
    console.log(`  Scene ${i}: name="${s.name || 'unnamed'}", root nodes: [${s.nodes?.join(', ')}]`);
  });
}
console.log(`Default Scene: ${jsonChunk.scene ?? 'none'}`);

// Node hierarchy
console.log(`\n--- Node Hierarchy ---`);
console.log(`Total Nodes: ${jsonChunk.nodes?.length || 0}`);

function printNode(nodeIdx, depth = 0) {
  const node = jsonChunk.nodes[nodeIdx];
  const indent = '  '.repeat(depth);
  let info = `${indent}[${nodeIdx}] "${node.name || 'unnamed'}"`;
  
  if (node.mesh !== undefined) info += ` (mesh: ${node.mesh})`;
  if (node.camera !== undefined) info += ` (camera: ${node.camera})`;
  if (node.skin !== undefined) info += ` (skin: ${node.skin})`;
  if (node.translation) info += ` T:[${node.translation.map(v => v.toFixed(3)).join(', ')}]`;
  if (node.rotation) info += ` R:[${node.rotation.map(v => v.toFixed(3)).join(', ')}]`;
  if (node.scale) info += ` S:[${node.scale.map(v => v.toFixed(3)).join(', ')}]`;
  if (node.matrix) info += ` Matrix:[${node.matrix.map(v => v.toFixed(3)).join(', ')}]`;
  
  console.log(info);
  
  if (node.children) {
    node.children.forEach(c => printNode(c, depth + 1));
  }
}

// Print from root nodes of default scene
const defaultScene = jsonChunk.scenes?.[jsonChunk.scene ?? 0];
if (defaultScene?.nodes) {
  defaultScene.nodes.forEach(n => printNode(n, 1));
}

// Meshes
console.log(`\n--- Meshes ---`);
console.log(`Total Meshes: ${jsonChunk.meshes?.length || 0}`);
let totalTriangles = 0;
let totalVertices = 0;

if (jsonChunk.meshes) {
  jsonChunk.meshes.forEach((mesh, i) => {
    let meshTris = 0;
    let meshVerts = 0;
    
    mesh.primitives?.forEach((prim) => {
      // Count indices
      if (prim.indices !== undefined) {
        const accessor = jsonChunk.accessors[prim.indices];
        meshTris += accessor.count / 3;
      }
      
      // Count vertices via POSITION accessor
      if (prim.attributes?.POSITION !== undefined) {
        const accessor = jsonChunk.accessors[prim.attributes.POSITION];
        meshVerts += accessor.count;
      }
    });
    
    totalTriangles += meshTris;
    totalVertices += meshVerts;
    
    console.log(`  Mesh ${i}: "${mesh.name || 'unnamed'}" - ${mesh.primitives?.length || 0} primitive(s), ${Math.floor(meshTris)} tris, ${meshVerts} verts, material(s): [${mesh.primitives?.map(p => p.material ?? 'none').join(', ')}]`);
  });
}
console.log(`\nTotal Triangles: ${Math.floor(totalTriangles)}`);
console.log(`Total Vertices: ${totalVertices}`);

// Materials
console.log(`\n--- Materials ---`);
console.log(`Total Materials: ${jsonChunk.materials?.length || 0}`);
if (jsonChunk.materials) {
  jsonChunk.materials.forEach((mat, i) => {
    let info = `  Material ${i}: "${mat.name || 'unnamed'}"`;
    if (mat.pbrMetallicRoughness) {
      const pbr = mat.pbrMetallicRoughness;
      if (pbr.baseColorFactor) info += ` baseColor:[${pbr.baseColorFactor.map(v => v.toFixed(3)).join(', ')}]`;
      if (pbr.baseColorTexture) info += ` baseColorTex:${pbr.baseColorTexture.index}`;
      if (pbr.metallicFactor !== undefined) info += ` metallic:${pbr.metallicFactor}`;
      if (pbr.roughnessFactor !== undefined) info += ` roughness:${pbr.roughnessFactor}`;
      if (pbr.metallicRoughnessTexture) info += ` mrTex:${pbr.metallicRoughnessTexture.index}`;
    }
    if (mat.normalTexture) info += ` normalTex:${mat.normalTexture.index}`;
    if (mat.emissiveTexture) info += ` emissiveTex:${mat.emissiveTexture.index}`;
    if (mat.emissiveFactor) info += ` emissive:[${mat.emissiveFactor.join(', ')}]`;
    if (mat.occlusionTexture) info += ` aoTex:${mat.occlusionTexture.index}`;
    if (mat.alphaMode) info += ` alpha:${mat.alphaMode}`;
    if (mat.doubleSided) info += ` doubleSided`;
    console.log(info);
  });
}

// Textures
console.log(`\n--- Textures ---`);
console.log(`Total Textures: ${jsonChunk.textures?.length || 0}`);
console.log(`Total Images: ${jsonChunk.images?.length || 0}`);
if (jsonChunk.images) {
  jsonChunk.images.forEach((img, i) => {
    let info = `  Image ${i}: "${img.name || 'unnamed'}"`;
    if (img.mimeType) info += ` type:${img.mimeType}`;
    if (img.bufferView !== undefined) {
      const bv = jsonChunk.bufferViews[img.bufferView];
      info += ` size:${bv.byteLength} bytes (${(bv.byteLength / 1024).toFixed(1)} KB)`;
    }
    if (img.uri) info += ` uri:${img.uri.substring(0, 50)}`;
    console.log(info);
  });
}

if (jsonChunk.textures) {
  jsonChunk.textures.forEach((tex, i) => {
    console.log(`  Texture ${i}: source:${tex.source ?? 'none'} sampler:${tex.sampler ?? 'default'}`);
  });
}

// Samplers
if (jsonChunk.samplers) {
  console.log(`\n--- Samplers ---`);
  jsonChunk.samplers.forEach((samp, i) => {
    console.log(`  Sampler ${i}: magFilter:${samp.magFilter} minFilter:${samp.minFilter} wrapS:${samp.wrapS} wrapT:${samp.wrapT}`);
  });
}

// Bounding Box from POSITION accessors
console.log(`\n--- Bounding Box (from POSITION accessors) ---`);
let globalMin = [Infinity, Infinity, Infinity];
let globalMax = [-Infinity, -Infinity, -Infinity];

if (jsonChunk.accessors) {
  jsonChunk.accessors.forEach((acc) => {
    if (acc.type === 'VEC3' && acc.min && acc.max) {
      // Heuristic: POSITION accessors have componentType 5126 (FLOAT) and type VEC3
      if (acc.componentType === 5126) {
        for (let j = 0; j < 3; j++) {
          if (acc.min[j] < globalMin[j]) globalMin[j] = acc.min[j];
          if (acc.max[j] > globalMax[j]) globalMax[j] = acc.max[j];
        }
      }
    }
  });
}

if (globalMin[0] !== Infinity) {
  console.log(`Min: [${globalMin.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`Max: [${globalMax.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`Dimensions: [${(globalMax[0] - globalMin[0]).toFixed(4)}, ${(globalMax[1] - globalMin[1]).toFixed(4)}, ${(globalMax[2] - globalMin[2]).toFixed(4)}]`);
  console.log(`Center: [${((globalMin[0] + globalMax[0]) / 2).toFixed(4)}, ${((globalMin[1] + globalMax[1]) / 2).toFixed(4)}, ${((globalMin[2] + globalMax[2]) / 2).toFixed(4)}]`);
}

// Animations
console.log(`\n--- Animations ---`);
console.log(`Total Animations: ${jsonChunk.animations?.length || 0}`);
if (jsonChunk.animations) {
  jsonChunk.animations.forEach((anim, i) => {
    console.log(`  Animation ${i}: "${anim.name || 'unnamed'}" channels:${anim.channels?.length || 0} samplers:${anim.samplers?.length || 0}`);
  });
}

// Extensions
console.log(`\n--- Extensions ---`);
console.log(`Extensions Used: ${JSON.stringify(jsonChunk.extensionsUsed || [])}`);
console.log(`Extensions Required: ${JSON.stringify(jsonChunk.extensionsRequired || [])}`);

// Summary
console.log(`\n--- Summary ---`);
console.log(`Scenes: ${jsonChunk.scenes?.length || 0}`);
console.log(`Nodes: ${jsonChunk.nodes?.length || 0}`);
console.log(`Meshes: ${jsonChunk.meshes?.length || 0}`);
console.log(`Materials: ${jsonChunk.materials?.length || 0}`);
console.log(`Textures: ${jsonChunk.textures?.length || 0}`);
console.log(`Images: ${jsonChunk.images?.length || 0}`);
console.log(`Accessors: ${jsonChunk.accessors?.length || 0}`);
console.log(`BufferViews: ${jsonChunk.bufferViews?.length || 0}`);
console.log(`Buffers: ${jsonChunk.buffers?.length || 0}`);
console.log(`Animations: ${jsonChunk.animations?.length || 0}`);
console.log(`Skins: ${jsonChunk.skins?.length || 0}`);
console.log(`Cameras: ${jsonChunk.cameras?.length || 0}`);
console.log(`Total Triangles: ${Math.floor(totalTriangles)}`);
console.log(`Total Vertices: ${totalVertices}`);
console.log(`File Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

console.log(`\n=== Analysis Complete ===\n`);
