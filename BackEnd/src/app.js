require('dotenv').config();

const express = require('express');
const discordService = require('./services/discordService');
const userRoutes = require('./routes/user');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5920;

app.use(express.json());
app.use(cors());
app.use('/api/user', userRoutes);

// 添加這個新的路由來處理圖片請求
app.get('/mainPic', async (req, res) => {
  try {
    const imageDir = path.join(__dirname, 'mainPic');

    
    // 檢查目錄是否存在
    if (!fs.existsSync(imageDir)) {
      return res.status(500).json({ error: '圖片目錄不存在' });
    }
    
    const files = fs.readdirSync(imageDir);
    
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|svg)$/i.test(file));
    
    if (imageFiles.length === 0) {
      return res.status(404).json({ error: '沒有找到圖片文件' });
    }
    
    res.json(imageFiles);
  } catch (error) {

    res.status(500).json({ error: '服務器錯誤', details: error.message });
  }
});

// 設置靜態文件服務
app.use('/mainPic', express.static(path.join(__dirname, 'mainPic')));
discordService.init();

app.listen(PORT, () => {
  console.log(`服務器運行在端口 ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未處理的 Promise 拒絕:', reason);
});
