const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Custom plugin to make build errors easier to read.
 * Works well with VS Code's problem matcher format.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',
  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });

    build.onEnd((result) => {
      if (result.errors.length > 0) {
        result.errors.forEach(({ text, location }) => {
          console.error(`✘ [ERROR] ${text}`);
          if (location) {
            console.error(`    ${location.file}:${location.line}:${location.column}`);
          }
        });
      } else {
        console.log('[watch] build finished with no errors ✅');
      }
    });
  },
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],   // main extension entry point
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    target: ['node18'],                  // assuming VS Code uses Node 18+
    outfile: 'dist/extension.js',
    external: ['vscode'],               // don't bundle vscode module
    logLevel: 'silent',
    plugins: [esbuildProblemMatcherPlugin],
  });

  if (watch) {
    console.log('[watch] Watching for changes...');
    await ctx.watch();
  } else {
    console.log('[build] Building...');
    await ctx.rebuild();
    await ctx.dispose();
    console.log('[build] Done ✅');
  }
}

main().catch((e) => {
  console.error('[build] Failed with error:', e);
  process.exit(1);
});
