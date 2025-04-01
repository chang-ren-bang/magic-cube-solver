# 魔方求解器 (Magic Cube Solver)

一個基於 Three.js 的網頁魔方求解器，提供 3D 視覺化的魔方操作和解題動畫展示。這個專案旨在幫助初學者更直觀地理解魔方的解題過程。

## 功能特色

- 🎲 **3D 視覺化**：使用 Three.js 實現可互動的 3D 魔方模型
- 🔄 **隨機打亂**：一鍵生成隨機打亂的魔方狀態
- ⚡ **自動解題**：展示從當前狀態到完成狀態的解題動畫
- 📝 **步驟提示**：同步顯示解題過程的操作代號（如：F, R', U2）
- 🎮 **互動控制**：支援使用滑鼠查看不同角度

## 技術棧

- **前端框架**：純 HTML5 + CSS3 + JavaScript (ES6+)
- **3D 渲染**：Three.js（WebGL）
- **動畫效果**：Tween.js
- **相機控制**：OrbitControls（Three.js 擴充）
- **AI 輔助開發**：
  - Google Gemini 2.5 Pro（初期）
  - VSCode LM API 的 Claude 3.5（後期）

## 線上展示

🌐 **[在線演示](https://chang-ren-bang.github.io/magic-cube-solver)** - 通過 GitHub Pages 託管

## 快速開始

1. 克隆專案：
```bash
git clone https://github.com/chang-ren-bang/magic-cube-solver.git
cd magic-cube-solver
```

2. 使用任何支援的方式啟動本地伺服器：
   - 使用 VS Code 的 Live Server 擴充
   - 或使用 `npx http-server`
   - 或其他 HTTP 伺服器

3. 在瀏覽器中打開 `index.html`

## 使用方法

1. 等待 3D 魔方模型載入完成
2. 使用滑鼠拖曳可旋轉視角
3. 使用滑鼠滾輪可縮放
4. 點擊「打亂」按鈕會隨機打亂魔方
5. 點擊「解題」按鈕會自動展示解題動畫

## 開發狀態

### 已完成功能

- ✅ Three.js 基礎渲染系統
- ✅ 3x3x3 魔方模型建立
- ✅ 基礎打亂功能
- ✅ 動畫系統整合
- ✅ 解題動畫展示
- ✅ 使用者介面實作

### 開發中功能

- 🚧 效能優化
- 🚧 更豐富的動畫效果
- 🚧 手動操作功能
- 🚧 進階解題算法

## 瀏覽器支援

支援所有現代瀏覽器：
- Google Chrome
- Firefox
- Safari
- Microsoft Edge

## 授權

本專案採用 MIT 授權條款。

## 部署

本專案使用 GitHub Pages 進行部署。若要部署你的版本：

1. Fork 此專案到你的 GitHub 帳號
2. 進入專案倉庫的 Settings 頁面
3. 找到 Pages 選項（在左側選單）
4. 在 Source 部分選擇 main 分支
5. 選擇 root (/) 作為發布來源
6. 儲存設定後等待部署完成
7. 你的網站將會在 `https://[你的GitHub用戶名].github.io/magic-cube-solver` 上線

## 貢獻

歡迎提交 Issue 或 Pull Request 來協助改進這個專案。

---

💡 **教學工具**：本專案主要作為一個視覺化的魔方教學工具，幫助使用者更好地理解魔方的解題過程。
