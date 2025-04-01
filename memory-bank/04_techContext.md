# 4. 技術背景 (Tech Context)

## 主要技術棧

*   **核心語言**: JavaScript (ES6+)
*   **使用者介面**: HTML5
*   **樣式**: CSS3
*   **繪圖**: **Three.js (WebGL)**

## 開發環境

*   **執行環境**: 網頁瀏覽器 (Chrome, Firefox, Safari, Edge 等現代瀏覽器)
*   **程式碼編輯器**: VS Code (或其他使用者偏好的編輯器)
*   **版本控制**: Git (建議使用)

## 相依性 (預期)

*   **3D 渲染**: **Three.js** (透過 CDN 載入)
*   **鏡頭控制**: **OrbitControls** (Three.js 附加元件，透過 CDN 載入)
*   **動畫**: **Tween.js** (透過 CDN 載入)
*   **魔術方塊解題函式庫**: **決定不使用外部函式庫，改為自行實作 (`js/SimpleSolver.js`)**。
*   **其他**: 無。

## 技術限制與挑戰

*   **Three.js 學習曲線**: 需要熟悉 Three.js 的 API、概念（場景、相機、材質、幾何體、光照）和工作流程。
*   **狀態與渲染同步**: 需要精確地將 `CubeState` 的狀態映射到 Three.js 場景中對應方塊的顏色。在動畫過程中，視覺狀態會暫時與 `CubeState` 不同步，需要在動畫結束後確保一致性。
*   **動畫實作 (Three.js + Tween.js)**: **已使用 Tween.js 在 `CubeRenderer.js` 中初步實現 `animateRotation`**。需要仔細處理 Three.js 的物件附加/分離 (attach/detach) 和世界變換更新，以確保旋轉正確且不會導致物件跳躍。需要進一步測試和完善。
*   **效能 (WebGL)**: 雖然 WebGL 通常比 Canvas 2D 快，但複雜的場景和動畫仍需注意效能優化（例如，共用幾何體和材質）。
*   **"解題"邏輯實作**: **目前採用反轉打亂序列的簡易方法 (`js/SimpleSolver.js`)，這並非真正的解題**。未來若要實作真正的解題演算法，將面臨較大挑戰。將目前反轉序列的輸出連接到動畫序列（待辦）。

## 工具使用模式

*   **開發伺服器**: 可能需要一個簡單的本地開發伺服器（例如使用 `live-server` VS Code 擴充功能或 `npx http-server`）來避免瀏覽器的本地檔案存取限制。
*   **除錯**: 主要依賴瀏覽器開發者工具進行除錯。
*   **模組化**: 考慮使用 ES6 Modules (`import`/`export`) 來組織程式碼。
