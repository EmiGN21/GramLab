import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve('dist')
const indexPath = resolve(dist, 'index.html')
const index = await readFile(indexPath, 'utf8')

const stylesheetMatch = index.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^\"]+\.css)"[^>]*>/)
const scriptMatch = index.match(/<script type="module"[^>]*src="\.\/(assets\/[^\"]+\.js)"><\/script>/)

if (!stylesheetMatch || !scriptMatch) {
  throw new Error('Could not find the generated CSS and JavaScript assets to make a portable build.')
}

const css = await readFile(resolve(dist, stylesheetMatch[1]), 'utf8')
const javascript = await readFile(resolve(dist, scriptMatch[1]), 'utf8')
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

await writeFile(resolve(dist, 'gramlab.html'), portable, 'utf8')
console.log('Created dist/gramlab.html - a standalone offline file.')
