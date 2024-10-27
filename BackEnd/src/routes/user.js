const express = require('express');
const router = express.Router();
const userActivityService = require('../services/userActivityService');
const discordService = require('../services/discordService');
const fs = require('fs').promises;
const path = require('path');

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Received request for user ID:', userId);
    const lastActivity = await userActivityService.getLastActivity(userId);
    console.log('Last activity:', lastActivity);
    if (lastActivity) {
      res.json({
        lastActivity: {
          timestamp: lastActivity.timestamp,
          content: lastActivity.content,
          channelId: lastActivity.channelId
        }
      });
    } else {
      res.status(404).json({ error: '未找到用戶活動' });
    }
  } catch (error) {
    console.error('獲取用戶活動失敗:', error);
    res.status(500).json({ error: '服務器錯誤' });
  }
});

router.get('/channel/:id', async (req, res) => {
  try {
    const channelId = req.params.id;
    const channel = await discordService.getChannelInfo(channelId);
    if (channel) {
      res.json({ name: channel.name });
    } else {
      res.status(404).json({ error: '未找到頻道' });
    }
  } catch (error) {
    console.error('獲取頻道信息失敗:', error);
    res.status(500).json({ error: '服務器錯誤' });
  }
});

module.exports = router;
