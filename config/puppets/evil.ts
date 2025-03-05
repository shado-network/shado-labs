import path from 'path'
import dotenv from 'dotenv'

//

import ShadoPuppet from 'shado-puppet'
import type { PuppetContext } from 'shado-puppet'

import ShadoLogger from '@shado-network/shado-logger'
import ShadoSandbox from '@shado-network/shado-sandbox'
import ShadoComms from '@shado-network/shado-comms'
import ShadoPlannerHTN from '@shado-network/shado-planner-htn'

import AnthropicAdapter from '@shado-network/adapter-anthropic'
// import DeepSeekAdapter from '@shado-network/adapter-deepseek'
// import OpenAiAdapter from '@shado-network/adapter-openai'

import TelegramClient from '@shado-network/client-telegram'
import TwitterApiClient from '@shado-network/client-twitter-api'

// NOTE: Get the appropriate .env files

import { getCurrent } from '../../src/utils'

dotenv.config({
  path: path.join(getCurrent(import.meta.url).dirname, '..', '..', '.env'),
})
dotenv.config({
  path: path.join(getCurrent(import.meta.url).dirname, '.env.evil'),
})

// NOTE: Set the context
const context: PuppetContext = {
  config: {
    sandboxMode: true,
  },
  utils: {
    logger: new ShadoLogger(['shado-screen', 'node-console']),
  },
}

context.utils.sandbox = new ShadoSandbox(
  ['shado-screen', 'logger', 'telegram'],
  {
    botHandle: process.env['SANDBOX_TELEGRAM_BOT_HANDLE'],
    botToken: process.env['SANDBOX_TELEGRAM_BOT_TOKEN'],
    chatId: process.env['SANDBOX_TELEGRAM_CHAT_ID'],
  },
  context,
)

// NOTE: Create a new puppet
const puppet = new ShadoPuppet(
  {
    id: 'evil',
    name: 'Evil',
    //
    bio: [
      "You are roleplaying as the cheeky little devil on everyone's shoulder. Mocking your subject often, you give humorously bad advice but also appeal to the adventurous and slightly dark part that lives inside of everyone. Short sentences and replies. No emojis or hashtags.",
    ],
  },
  context,
)

// NOTE: Register puppet planner
puppet.registerPlanner({
  plugin: ShadoPlannerHTN,
  props: [
    {
      // TODO: How to make this more low to no-code?
      // TODO: How will devs know about tasks that can fulfill the goals?
      goals: [
        // Telegram
        {
          identifier: 'telegram-last-replied',
          description: 'Reply to Telegram message within 1 second.',
          // NOTE: Wants to reply no longer than 1 second ago.
          evaluator: (props) => {
            return (
              props._origin.memory.state?.['telegram-last-replied'] >=
              Date.now() - 1 * 1000
            )
          },
        },
        // Twitter
        {
          identifier: 'twitter-last-sent',
          description: 'Tweet on Twitter every 3 minutes.',
          // NOTE: Wants to reply no longer than 3 minutes ago.
          evaluator: (props) => {
            return (
              props._origin.memory.state?.['twitter-last-sent'] >=
              Date.now() - 3 * 60 * 1000
            )
          },
        },
      ],
    },
    puppet,
    context,
  ],
})

// NOTE: Register puppet model
puppet.registerModel({
  plugin: AnthropicAdapter,
  props: [
    {
      // temperature: 0.6,
      // maxTokens: 256,
    },
    {
      apiKey: process.env['ANTHROPIC_API_KEY'],
    },
    puppet,
    context,
  ],
})

// NOTE: Register puppet clients
puppet.registerClient({
  plugin: ShadoComms,
  props: [
    {
      http: {
        port: 10111,
      },
      ws: {
        port: 10112,
      },
    },
    puppet,
    context,
  ],
})

puppet.registerClient({
  plugin: TelegramClient,
  props: [
    {},
    {
      botHandle: process.env['TELEGRAM_EVIL_BOT_HANDLE'],
      botToken: process.env['TELEGRAM_EVIL_BOT_TOKEN'],
    },
    puppet,
    context,
  ],
})

puppet.registerClient({
  plugin: TwitterApiClient,
  props: [
    {},
    {
      appKey: process.env['TWITTER_EVIL_APP_KEY'],
      appSecret: process.env['TWITTER_EVIL_APP_SECRET'],
      accessToken: process.env['TWITTER_EVIL_ACCESS_TOKEN'],
      accessSecret: process.env['TWITTER_EVIL_ACCESS_SECRET'],
    },
    puppet,
    context,
  ],
})

export default puppet
