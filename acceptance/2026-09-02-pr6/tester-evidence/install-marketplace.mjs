// Acceptance-test harness: register the local PR-branch marketplace checkout
// with ZCode using the exact persistence schemas observed in the client engine.
import fs from 'node:fs';

const P = 'C:/Users/rocm/.zcode/cli/plugins';
const CLONE_WIN = 'C:\\Users\\rocm\\Desktop\\zcode-plugins';

// 1) repoint the official marketplace registration at the local PR checkout
const km = JSON.parse(fs.readFileSync(P + '/known_marketplaces.json', 'utf8'));
const entry = km.marketplaces.find((m) => m.id === 'zcode-plugins-official');
entry.source = { source: 'directory', path: CLONE_WIN };
entry.lastUpdated = new Date().toISOString();
fs.writeFileSync(P + '/known_marketplaces.json', JSON.stringify(km, null, 2));
console.log('1) known_marketplaces: zcode-plugins-official source ->', JSON.stringify(entry.source));

// 2) refresh the active cached marketplace manifest from the clone
const manifest = fs.readFileSync('C:/Users/rocm/Desktop/zcode-plugins/marketplace.json', 'utf8');
JSON.parse(manifest);
fs.writeFileSync(P + '/marketplaces/zcode-plugins-official/marketplace.json', manifest);
console.log('2) marketplaces/zcode-plugins-official/marketplace.json refreshed from clone');

// 3) materialize the plugin into the plugin cache at its manifest version
const src = 'C:/Users/rocm/Desktop/zcode-plugins/plugins/zcode-remotion';
const dst = P + '/cache/zcode-plugins-official/zcode-remotion/0.2.5';
fs.mkdirSync(dst, { recursive: true });
fs.cpSync(src, dst, { recursive: true });
console.log('3) plugin copied to', dst);

// 4) register the install record (same fields as existing records)
const ip = JSON.parse(fs.readFileSync(P + '/installed_plugins.json', 'utf8'));
if (!ip.plugins.some((p) => p.id === 'zcode-remotion@zcode-plugins-official')) {
  ip.plugins.push({
    id: 'zcode-remotion@zcode-plugins-official',
    name: 'zcode-remotion',
    marketplace: 'zcode-plugins-official',
    version: '0.2.5',
    installPath: dst.replaceAll('/', '\\'),
    installedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scope: 'user',
    source: { source: 'directory', path: 'C:\\Users\\rocm\\Desktop\\zcode-plugins\\plugins\\zcode-remotion' },
  });
}
fs.writeFileSync(P + '/installed_plugins.json', JSON.stringify(ip, null, 2));
console.log('4) installed_plugins.json record added');

// 5) enable the plugin (user scope)
const cfgPath = 'C:/Users/rocm/.zcode/cli/config.json';
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
cfg.plugins = cfg.plugins || {};
cfg.plugins.enabledPlugins = cfg.plugins.enabledPlugins || {};
cfg.plugins.enabledPlugins['zcode-remotion@zcode-plugins-official'] = true;
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
console.log('5) enabledPlugins:', JSON.stringify(cfg.plugins.enabledPlugins));
