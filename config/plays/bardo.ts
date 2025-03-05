import path from 'path'
import dotenv from 'dotenv'

//

import ShadoPlay from 'shado-play'
import type { PlayContext } from 'shado-play'

import ShadoLogger from '@shado-network/shado-logger'
import ShadoComms from '@shado-network/shado-comms'
import ShadoPlannerHTN from '@shado-network/shado-planner-htn'

// NOTE: Get the appropriate .env files

import { getCurrent } from '../../src/utils'

dotenv.config({
  path: path.join(getCurrent(import.meta.url).dirname, '..', '..', '.env'),
})
dotenv.config({
  path: path.join(getCurrent(import.meta.url).dirname, '.env.bardo'),
})

// NOTE: Set the context
const context: PlayContext = {
  config: {},
  utils: {
    logger: new ShadoLogger(['shado-screen', 'node-console']),
  },
}

// NOTE: Create a new play
const play = new ShadoPlay(
  {
    id: 'bardo',
    name: 'Bardō',
  },
  context,
)

// NOTE: Register play planner
play.registerPlanner({
  plugin: ShadoPlannerHTN,
  props: [
    {
      goals: [],
    },
    play,
    context,
  ],
})

// // NOTE: Register play model
// puppet.registerModel({
//   plugin: DeepSeekAdapter,
//   props: [
//     {
//       // temperature: 0.6,
//       // maxTokens: 256,
//     },
//     {
//       apiKey: process.env['DEEPSEEK_API_KEY'],
//     },
//     puppet,
//     context,
//   ],
// })

// NOTE: Register puppet clients
play.registerClient({
  plugin: ShadoComms,
  props: [
    {
      http: {
        port: 10001,
      },
      ws: {
        port: 10002,
      },
    },
    play,
    context,
  ],
})

export default play
