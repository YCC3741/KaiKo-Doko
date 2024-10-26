const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ACTIVITY_FILE = path.join(DATA_DIR, 'userActivity.json');

// 確保 data 目錄存在
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// 在模塊初始化時調用
ensureDataDir();

async function readActivityData() {
  try {
    const data = await fs.readFile(ACTIVITY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 如果文件不存在，創建一個空的 JSON 對象
      await writeActivityData({});
      return {};
    }
    throw error;
  }
}

async function writeActivityData(data) {
  await fs.writeFile(ACTIVITY_FILE, JSON.stringify(data, null, 2));
}

async function updateUserActivity(userId, content, channelId) {
  const activityData = await readActivityData();
  activityData[userId] = {
    timestamp: new Date().toISOString(),
    content: content,
    channelId: channelId
  };
  await writeActivityData(activityData);
}

async function getLastActivity(userId) {
  const activityData = await readActivityData();
  console.log('Activity data:', activityData);
  console.log('Requested user ID:', userId);
  return activityData[userId] || null;
}

module.exports = {
  updateUserActivity,
  getLastActivity
};
