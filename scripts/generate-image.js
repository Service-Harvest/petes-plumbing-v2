#!/usr/bin/env node
/**
 * Phase 7 — Gemini image generation helper.
 * Usage: node scripts/generate-image.js "<prompt>" <output-path-no-ext> <width> <height>
 * Writes <output-path-no-ext>.webp, resized/cropped to <width>x<height>, and
 * prints "WIDTH HEIGHT" (the actual final pixel dimensions) to stdout on success.
 * Retries transient failures (429/5xx) up to 3 times with backoff (5s/15s/30s);
 * exits 1 immediately on a permanent failure (no retry) so the caller can
 * substitute an SVG graphic per phase-07-images.md's failure-handling rules.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const [, , prompt, outPath, widthArg, heightArg] = process.argv;
if (!prompt || !outPath || !widthArg || !heightArg) {
  console.error("Usage: node generate-image.js \"<prompt>\" <output-path-no-ext> <width> <height>");
  process.exit(2);
}
const width = parseInt(widthArg, 10);
const height = parseInt(heightArg, 10);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("PERMANENT_FAILURE: GEMINI_API_KEY not set");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

function callGemini() {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  });
  const tmpBody = outPath + ".req.json";
  fs.writeFileSync(tmpBody, body);
  const curlCmd = `curl -s -w "\\n%{http_code}" "${URL}" -H "Content-Type: application/json" -X POST --data @"${tmpBody}"`;
  let raw;
  try {
    raw = execSync(curlCmd, { maxBuffer: 1024 * 1024 * 50, encoding: "utf8" });
  } finally {
    fs.unlinkSync(tmpBody);
  }
  const lastNewline = raw.lastIndexOf("\n");
  const status = parseInt(raw.slice(lastNewline + 1).trim(), 10);
  const responseText = raw.slice(0, lastNewline);
  return { status, responseText };
}

function sleep(ms) {
  execSync(`sleep ${ms / 1000}`);
}

let result;
const delays = [5000, 15000, 30000];
for (let attempt = 0; attempt <= delays.length; attempt++) {
  result = callGemini();
  if (result.status === 200) break;
  const transient = result.status === 429 || result.status >= 500;
  if (!transient || attempt === delays.length) {
    console.error(`PERMANENT_FAILURE: HTTP ${result.status}: ${result.responseText.slice(0, 300)}`);
    process.exit(1);
  }
  console.error(`Transient failure (HTTP ${result.status}), retrying in ${delays[attempt] / 1000}s...`);
  sleep(delays[attempt]);
}

let data;
try {
  data = JSON.parse(result.responseText);
} catch (e) {
  console.error("PERMANENT_FAILURE: could not parse Gemini response as JSON");
  process.exit(1);
}

const parts = data?.candidates?.[0]?.content?.parts || [];
const imagePart = parts.find((p) => p.inlineData?.data);
if (!imagePart) {
  console.error("PERMANENT_FAILURE: no image data in Gemini response: " + JSON.stringify(data).slice(0, 300));
  process.exit(1);
}

const pngPath = outPath + ".tmp.png";
fs.writeFileSync(pngPath, Buffer.from(imagePart.inlineData.data, "base64"));

const webpPath = outPath + ".webp";
try {
  // Gemini does not honor arbitrary target dimensions — it returns its own
  // native size (e.g. a 1024x1024 square) regardless of the requested aspect
  // ratio. `cwebp -resize W H` does a naive non-uniform stretch to exactly
  // W x H, which distorts the actual photo content whenever the native
  // aspect ratio differs from the target (it almost always does). Instead:
  // uniformly scale to COVER the target box (preserving aspect ratio), then
  // center-crop to the exact target size — the same effect as CSS
  // `object-fit: cover`, but baked into the file itself.
  const dims = execSync(`sips -g pixelWidth -g pixelHeight "${pngPath}"`, { encoding: "utf8" });
  const nativeW = parseInt(dims.match(/pixelWidth:\s*(\d+)/)[1], 10);
  const nativeH = parseInt(dims.match(/pixelHeight:\s*(\d+)/)[1], 10);
  const scale = Math.max(width / nativeW, height / nativeH);
  const resampleW = Math.round(nativeW * scale);
  const resampleH = Math.round(nativeH * scale);
  execSync(`sips -z ${resampleH} ${resampleW} "${pngPath}"`, { stdio: "ignore" });
  execSync(`sips -c ${height} ${width} "${pngPath}"`, { stdio: "ignore" });
  execSync(`cwebp -quiet -q 82 "${pngPath}" -o "${webpPath}"`, { stdio: "inherit" });
} finally {
  fs.unlinkSync(pngPath);
}

console.log(`${width} ${height}`);
