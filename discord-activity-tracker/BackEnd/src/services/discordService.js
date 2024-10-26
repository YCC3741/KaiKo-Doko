const { Client, GatewayIntentBits } = require('discord.js');
const userActivityService = require('./userActivityService');

const client = new Client({
	  intents: [
		      GatewayIntentBits.Guilds,
		      GatewayIntentBits.GuildMessages,
		      GatewayIntentBits.MessageContent,
		    ]
});

client.once('ready', () => {
	  console.log('Discord 機器人已準備就緒!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  let content = message.content;
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    if (attachment.contentType && attachment.contentType.startsWith('image/')) {
      content = `${content} ${attachment.url}`.trim();
    }
  }
  
  console.log(`收到來自 ${message.author.tag} 的消息: ${content} (頻道: ${message.channel.name})`);
  
  try {
    await userActivityService.updateUserActivity(message.author.id, content, message.channel.id);
    console.log(`已更新用戶 ${message.author.id} 的活動狀態`);
  } catch (error) {
    console.error(`更新用戶 ${message.author.id} 活動狀態時出錯:`, error);
  }
});

client.on('error', error => {
  console.error('Discord 客戶端錯誤:', error);
});

client.on('disconnect', () => {
  console.warn('Discord 機器人已斷開連接');
});

client.on('reconnecting', () => {
  console.log('Discord 機器人正在重新連接...');
});

async function getChannelInfo(channelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    return channel;
  } catch (error) {
    console.error('獲取頻道信息失敗:', error);
    return null;
  }
}

function init() {
	console.log('正在初始化 Discord 機器人...');
	if (!process.env.DISCORD_TOKEN) {
		console.error('錯誤：未設置 DISCORD_TOKEN 環境變量');
		process.exit(1);
	}
	client.login(process.env.DISCORD_TOKEN)
		.then(() => console.log('Discord 機器人登錄成功'))
		.catch(error => {
			console.error('Discord 機器人登錄失敗:', error);
			process.exit(1);
		});
}

module.exports = { init, getChannelInfo };
