# 5. 當前背景 (Active Context)

## 當前工作焦點

*   **渲染引擎遷移**: 將 3D 渲染從自訂 Canvas 2D 實現遷移到使用 **Three.js (WebGL)**。

## 近期變更

*   **渲染器重構 (`js/CubeRenderer.js`)**:
    *   完全替換為基於 Three.js 的實現。
    *   設定場景、相機、WebGL 渲染器、光照。
    *   創建 27 個小方塊的 Three.js 網格 (Mesh)。
    *   實作了新的 `updateColors` 方法，將 `CubeState` 映射到 Three.js 材質。
    *   加入了 OrbitControls 實現鏡頭互動。
*   **HTML 更新 (`index.html`)**:
    *   引入 Three.js 和 OrbitControls 的 CDN 連結。
*   **主邏輯調整 (`main.js`)**:
    *   移除獲取 2D context 的程式碼。
    *   調整 `CubeRenderer` 的初始化，只傳遞 canvas 元素。
*   (先前變更) 建立了 `js/CubeState.js` 模組。
*   (先前變更) 採用反轉打亂序列作為簡易 "解題" 方法 (`js/SimpleSolver.js`)。
*   (先前變更) 更新 `main.js` 以使用 `SimpleSolver.js`。

## 下一步計畫

1.  **Three.js 旋轉動畫**: 在 `CubeRenderer.js` 中實作單步旋轉的動畫邏輯 (例如，使用 `Tween.js` 或手動插值動畫 `THREE.Group` 的旋轉)。這是目前的主要任務。
2.  **連接動畫與解題**: 將 `SimpleSolver.js` 返回的**反轉序列**傳遞給新的 Three.js 動畫引擎進行播放。
3.  **UI/UX 優化**: 禁用按鈕、顯示當前步驟等。
4.  **(可選) 替換為真實解題器**: 未來如果需要，可以重新評估並實作或整合一個真正的解題演算法來取代目前的反轉邏輯。

## 當前決策與考量

*   **檔案結構**: 採用簡單的根目錄結構 (`index.html`, `style.css`, `main.js`)，並將 Memory Bank 放在 `memory-bank/` 子目錄中。未來可能根據複雜度增加而建立 `src/` 或 `js/` 等子目錄。
*   **渲染技術**: **已從 Canvas 2D 切換到 Three.js (WebGL)**，以利用其功能和效能。
*   **檔案結構**: 保持簡單的根目錄結構。

## 重要模式與偏好

*   **渲染**: **擁抱 Three.js** 以獲得更好的 3D 效果和開發效率。不再堅持純 Canvas 2D。
*   **模組化**: 儘早開始將程式碼組織成模組 (ES6 Modules)。 (持續進行中)
*   **註解與可讀性**: 保持程式碼清晰、易於理解，特別是涉及 Three.js API、狀態管理和**動畫引擎**的部分。

## 學習與洞見

*   整合外部函式庫（特別是透過 CDN）可能存在版本、路徑或可用性問題。
*   自行實作核心功能（如解題器）雖然挑戰更大，但能提供更多控制權並避免外部依賴問題。（目前採用反轉序列作為權宜之計）
*   使用成熟的 3D 函式庫 (Three.js) 可以顯著簡化渲染部分的開發，但需要投入時間學習其 API。
