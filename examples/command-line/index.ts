import path from 'path'

import { getCurrent, lazyImport, parseArgs } from '../../src/utils.js'

//

console.clear()

console.log('SHADŌ NETWORK')
console.log('shado-labs')
console.log('')

console.log('Example: Command Line')
console.log('')

//

const args = parseArgs({})

const puppetIds: string[] = []
const playIds: string[] = []

args.puppets?.split(',').forEach((puppetId) => {
  if (puppetId.trim() !== '') {
    puppetIds.push(puppetId.trim())
  }
})

args.plays?.split(',').forEach((playId) => {
  if (playId.trim() !== '') {
    playIds.push(playId.trim())
  }
})

//

const initPuppets = (puppetIds: string[]) => {
  if (!puppetIds || puppetIds.length === 0) {
    // console.warn('No Puppet ID(s) set!')
    return
  }

  puppetIds.forEach(async (puppetId) => {
    if (!puppetId) {
      // console.warn('Not a valid Puppet ID!')
      return
    }

    try {
      const puppetsPath = path.join(
        getCurrent(import.meta.url).dirname,
        '..',
        '..',
        'config',
        'puppets',
      )
      const puppet = await lazyImport(puppetsPath, `${puppetId}.js`)

      puppet.setup()
      puppet.start()
    } catch (error) {
      console.error('Something went wrong', error)
    }
  })
}

const initPlays = (playIds: string[]) => {
  if (!playIds || playIds.length === 0) {
    // console.warn('No Play ID(s) set!')
    return
  }

  playIds.forEach(async (playId) => {
    if (!playId) {
      // console.warn('Not a valid Play ID!')
      return
    }

    try {
      const playsPath = path.join(
        getCurrent(import.meta.url).dirname,
        '..',
        '..',
        'config',
        'plays',
      )
      const play = await lazyImport(playsPath, `${playId}.js`)

      play.setup()
      play.start()
    } catch (error) {
      console.error('Something went wrong', error)
    }
  })
}

//

initPuppets(puppetIds)
initPlays(playIds)
