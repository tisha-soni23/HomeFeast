import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inputDir = "./src/assets";
const outputDir = "./src/assets/optimized";

await fs.mkdir(outputDir, { recursive: true });

const files = await fs.readdir(inputDir);

for (const file of files) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(
    outputDir,
    `${path.parse(file).name}.webp`
  );

  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath);

  console.log(`Optimized: ${file} -> ${outputPath}`);
}

console.log("Image optimization complete!");