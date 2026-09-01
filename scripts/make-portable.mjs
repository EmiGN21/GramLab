import { readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'

const dist = resolve('dist')
const indexPath = resolve(dist, 'index.html')
const index = await readFile(indexPath, 'utf8')

const stylesheetMatch = index.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^\"]+\.css)"[^>]*>/)
const scriptMatch = index.match(/<script type="module"[^>]*src="\.\/(assets\/[^\"]+\.js)"><\/script>/)

if (!stylesheetMatch || !scriptMatch) {
  throw new Error('Could not find the generated CSS and JavaScript assets to make a portable build.')
}

const stylesheetPath = resolve(dist, stylesheetMatch[1])
let css = await readFile(stylesheetPath, 'utf8')
const javascript = await readFile(resolve(dist, scriptMatch[1]), 'utf8')

const assetMimeTypes = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

const cssAssetUrls = [...css.matchAll(/url\((['"]?)(\.\/[^)'"]+)\1\)/g)]
const inlinedAssets = new Map()

for (const match of cssAssetUrls) {
  const relativeAsset = match[2]
  const mimeType = assetMimeTypes[extname(relativeAsset).toLowerCase()]

  if (!mimeType || inlinedAssets.has(match[0])) continue

  const asset = await readFile(resolve(dirname(stylesheetPath), relativeAsset))
  inlinedAssets.set(match[0], `url(data:${mimeType};base64,${asset.toString('base64')})`)
}

for (const [source, inlined] of inlinedAssets) {
  css = css.split(source).join(inlined)
}

const safeJavascript = javascript.replace(/<\/script/gi, '<\\/script')
const inlineScript = `<script>\n${safeJavascript}\n</script>`

const portable = index
  .replace(stylesheetMatch[0], () => `<style>\n${css}\n</style>`)
  .replace(scriptMatch[0], '')
  .replace('</body>', () => `${inlineScript}\n  </body>`)
  .replace('<title>GramLab · visual grammar laboratory</title>', '<title>GramLab · visual grammar laboratory</title>\n    <meta name="gramlab-build" content="portable-offline" />')
  .replace(/^[ \t]+$/gm, '')

if (/<(?:script|link)\b[^>]*(?:src|href)="\.\/assets\//.test(portable)) {
  throw new Error('The portable build still references an external asset.')
}

if (/url\((?:['"]?)\.\//.test(portable)) {
  throw new Error('The portable build still references an external CSS asset.')
}

await writeFile(resolve(dist, 'gramlab.html'), portable, 'utf8')
console.log('Created dist/gramlab.html - a standalone offline file.')
