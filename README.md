
# Flip & Match 


---

#設計理念

 模組化：使用 React hooks管理狀態，確保邏輯清晰、易於維護。

 即時回饋：翻牌、配對、完成動作都提供動畫與即時分數統計。
 
 學習導向：程式碼簡潔明瞭，讓讀者能快速理解 React 前端專案的完整架構。



#資訊架構


App 
├─ Header：顯示標題、步數、計時、最佳紀錄
├─ Controls：棋盤大小選擇、重新開始、重置紀錄
├─ Board：卡牌與互動（翻牌、配對、動畫）
├─ Footer：玩法說明
└─ Overlay：勝利視窗與重玩按鈕


Data Flow：
1. newGame()→初始化deck與狀態  
2. onCardClick()→處理翻牌與配對
3. useEffect()→檢查勝利條件並更新最佳紀錄  
4. localStorage →儲存最佳step



#未來優化方向

訓練模式: 限時、限步、挑戰等模式以增加挑戰性

音效: 翻牌、成功音效去提升遊戲沉浸感

排行榜: 線上記錄系統等與其他玩家競爭

可安裝的App: 支援多平台、離線遊玩

UI優化: 主題切換、卡牌動畫



#檔案結構


flip-match/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  └─ styles.css
└─ hw2/
   └─ chat-history/
      └─ PLACEHOLDER.md




#安裝與執行

bash
npm install
npm run dev
# 或
npm run build
npm run preview


打開瀏覽器前往顯示網址（通常是 http://localhost:5173）。



#遊戲玩法
點兩張卡牌配對；全部配對即勝。
可選 4×4、6×6、8×8；記錄最佳步數（localStorage）。

