import * as esbuild from "esbuild";
import * as fs from "fs";

process.chdir(`${__dirname}/../`);

const minify = process.argv.includes("--minify");

// generate facade/generated.js
esbuild.buildSync({
  entryPoints: ["facade/source.ts"],
  banner: {
    js: "// AUTOGENERATED, DO NOT EDIT!\n /* eslint-disable */",
  },
  format: "esm",
  outfile: "facade/generated.js",
  platform: "neutral",
});

// generate bin/index.js
esbuild.buildSync({
  entryPoints: ["src/bin.ts"],
  bundle: true,
  format: "cjs",
  outfile: "dist/bin.js",
  platform: "node",
  external: [
    "esbuild",
    "clipboardy",
    "@edge-runtime/primitives",
    "update-notifier",
  ],
  sourcemap: true,
  minify,
  define: {
    PARTYKIT_API_BASE: `"${process.env.PARTYKIT_API_BASE}"`,
  },
});

fs.chmodSync("dist/bin.js", 0o755);

// generate dist/server.js
esbuild.buildSync({
  entryPoints: ["src/server.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/server.js",
  sourcemap: true,
  minify,
  // platform: "node", // ?neutral?
});
