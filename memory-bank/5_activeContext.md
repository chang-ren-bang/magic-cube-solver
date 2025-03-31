# 5. 當前背景 (Active Context)

## 當前工作焦點

*   **專案初始化**: 建立基本的專案結構和 Memory Bank 文件。
*   **基礎 HTML/CSS**: 設定主要的 HTML 檔案，包含 Canvas 元素和控制按鈕的區域，以及基礎的 CSS 樣式。
*   **Canvas 設置**: 在 JavaScript 中獲取 Canvas 元素及其 2D 繪圖上下文 (Context)。

## 近期變更

*   將 3D 渲染邏輯重構到 `js/CubeRenderer.js`。
*   建立了 `js/CubeState.js` 模組，包含狀態表示、完整的 12 種基本旋轉邏輯、改進的隨機序列生成，以及 `toSolverString` 方法。
*   更新了 `CubeRenderer.js` 的 `updateColors` 方法。
*   建立了**模擬**的解題函式庫 `js/lib/solver.js`。
*   更新了 `main.js`：
    *   導入並初始化 `CubeState`, `CubeRenderer`, 和**模擬**的 `solver`。
    *   「隨機產生」按鈕功能完成（應用完整序列並更新畫面）。
    *   **連接「自動解題」按鈕：獲取狀態字串，調用模擬解題器，並顯示其（固定的）回傳解法**。

## 下一步計畫

1.  **整合真實解題器**: 將 `js/lib/solver.js` 替換為實際的 JavaScript 解題函式庫 (例如 `cubejs`)。這需要：
    *   獲取函式庫檔案 (CDN 或下載)。
    *   可能需要調整 `main.js` 中的導入方式。
    *   確保 `CubeState` 的 `toSolverString` 格式與所選函式庫兼容。
2.  **動畫引擎**: 設計和實作單步旋轉動畫。
3.  **解題動畫播放**: 將**真實**解題器返回的序列傳遞給動畫引擎進行播放。
4.  **UI/UX 優化**: 禁用按鈕、顯示當前步驟等。

## 當前決策與考量

*   **檔案結構**: 採用簡單的根目錄結構 (`index.html`, `style.css`, `main.js`)，並將 Memory Bank 放在 `memory-bank/` 子目錄中。未來可能根據複雜度增加而建立 `src/` 或 `js/` 等子目錄。
*   **渲染起點**: 從最基本的單一立方體渲染開始，逐步增加複雜度到 3x3x3 的魔術方塊。

## 重要模式與偏好

*   **原生優先**: 盡可能使用瀏覽器原生 API (HTML, CSS, JS, Canvas 2D)，避免引入大型框架或函式庫，除非必要 (例如解題演算法)。
*   **模組化**: 儘早開始將程式碼組織成模組 (ES6 Modules)。
*   **註解與可讀性**: 保持程式碼清晰、易於理解，特別是涉及複雜 3D 計算和狀態管理的部分。

## 學習與洞見

*   (尚無，專案剛開始)
