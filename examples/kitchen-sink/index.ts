import GoodPuppet from '../../config/puppets/good.js'
import EvilPuppet from '../../config/puppets/evil.js'

import BardoPlay from '../../config/plays/bardo.js'

//

console.clear()

console.log('SHADŌ NETWORK')
console.log('shado-labs')
console.log('')

console.log('Example: Kitchen Sink')
console.log('')

//

GoodPuppet.setup()
GoodPuppet.start()

EvilPuppet.setup()
EvilPuppet.start()

BardoPlay.setup()
BardoPlay.start()
