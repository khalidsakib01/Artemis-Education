import { copyFile, cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(root, "dist/public");
const targetDir = path.resolve(root, "public");

await mkdir(targetDir, { recursive: true });
await rm(path.resolve(targetDir, "assets"), { recursive: true, force: true });

for (const entry of await readdir(sourceDir, {
  withFileTypes: true,
})) {
  const sourcePath = path.resolve(sourceDir, entry.name);
  const targetPath = path.resolve(targetDir, entry.name);

  if (entry.isDirectory()) {
    await cp(sourcePath, targetPath, { recursive: true, force: true });
  } else {
    await copyFile(sourcePath, targetPath);
  }
}
