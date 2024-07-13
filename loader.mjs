import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Register the TypeScript loader
register('ts-node/esm', pathToFileURL(__dirname));
