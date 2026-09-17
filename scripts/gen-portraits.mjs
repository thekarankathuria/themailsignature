/**
 * Illustrative portraits for the sample signatures (npm run portraits).
 *
 * Generates one headshot of a fictional person for each sample person that
 * does not have one yet, using the OpenAI Images API, and records it in
 * lib/marketing/sample-people.json. The people do not exist; every page that
 * shows them says the samples are illustrative.
 *
 *   OPENAI_API_KEY=... npm run portraits            # all missing portraits
 *   OPENAI_API_KEY=... npm run portraits lawyers ceos
 *
 * Review every image before committing it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const FILE = "lib/marketing/sample-people.json";
const OUT = "public/samples";
const key = process.env.OPENAI_API_KEY?.trim();
if (!key) {
  console.error("Set OPENAI_API_KEY to generate portraits. Samples keep their monogram avatars until then.");
  process.exit(1);
}

const people = JSON.parse(readFileSync(FILE, "utf8"));
const only = process.argv.slice(2);
const todo = people.filter((p) => !p.photo && (!only.length || only.includes(p.key)));

function prompt(person) {
  const { presentation = "person", age = "mid 30s" } = person.portrait ?? {};
  return (
    `Professional corporate headshot of a fictional ${presentation} in their ${age}, ` +
    `working as ${person.jobTitle.toLowerCase()}. Soft studio light, plain warm grey background, ` +
    `shoulders up, facing the camera, natural relaxed expression, business attire, photorealistic. ` +
    `No text, no logos, no watermark.`
  );
}

for (const person of todo) {
  process.stdout.write(`${person.key}... `);
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: prompt(person), size: "1024x1024", n: 1 }),
  });
  if (!response.ok) {
    console.error(`failed (${response.status}): ${(await response.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const json = await response.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    console.error("failed: no image in the response");
    process.exit(1);
  }
  const path = `${OUT}/${person.key}-photo.jpg`;
  await sharp(Buffer.from(b64, "base64")).resize(240, 240).jpeg({ quality: 82, mozjpeg: true }).toFile(path);
  person.photo = `/samples/${person.key}-photo.jpg`;
  // Save after each image so an interrupted run keeps what it made.
  writeFileSync(FILE, "[\n" + people.map((p) => "  " + JSON.stringify(p)).join(",\n") + "\n]\n");
  console.log("done");
}

console.log(todo.length ? `Generated ${todo.length} portraits. Review them before committing.` : "Every sample person already has a portrait.");
