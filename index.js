import bot from './src/bot'
import config from './config.json'

const thonk9k = bot(config.token);
thonk9k.init();