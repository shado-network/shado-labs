import path from 'path'
import { fileURLToPath } from 'url'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const parseArgs = (
  _context: any,
): {
  puppets?: string
  plays?: string
} => {
  try {
    const args = yargs(hideBin(process.argv))
      .option('puppets', {
        type: 'string',
        description: 'A comma separated list of Puppet IDs.',
      })
      .option('plays', {
        type: 'string',
        description: 'A comma separated list of Play IDs.',
      })
      .parseSync()

    return args
  } catch (error) {
    console.error('Error parsing CLI arguments', error)
    return {}
  }
}

export const getCurrent = (url: string) => {
  const filename = fileURLToPath(url)
  const dirname = path.dirname(filename)

  return { filename, dirname }
}

export const lazyImport = async (path: string, file: string) => {
  try {
    const importFile = await import(`${path}/${file}`)
    const imported = importFile.default

    return imported
  } catch (error) {
    console.error(`Error loading file "${file}"`, error)
    return
  }
}
