# 5. 當前背景 (Active Context)

## 當前工作焦點

*   **專案初始化**: 建立基本的專案結構和 Memory Bank 文件。
*   **基礎 HTML/CSS**: 設定主要的 HTML 檔案，包含 Canvas 元素和控制按鈕的區域，以及基礎的 CSS 樣式。
*   **Canvas 設置**: 在 JavaScript 中獲取 Canvas 元素及其 2D 繪圖上下文 (Context)。

## 近期變更

*   將 3D 渲染邏輯重構到 `js/CubeRenderer.js` 模組，並修改其以繪製 3x3x3 結構。
*   建立了 `js/CubeState.js` 模組：
    *   定義了基於面的狀態表示法 (U/R/F/D/L/B)。
    *   實作了 `createSolvedState`。
    *   實作了基本的 `generateScramble` 方法。
    *   實作了 `rotateU` 方法（其他旋轉待辦）。
    *   實作了 `applySequence` 和 `applyMove` 的基本框架。
*   更新了 `CubeRenderer.js` 的 `updateColors` 方法，使其能根據 `CubeState` 更新畫面顏色。
*   更新了 `main.js`：
    *   導入並初始化 `CubeState` 和 `CubeRenderer`。
    *   連接「隨機產生」按鈕：產生序列、顯示序列、**應用測試旋轉 (U轉)** 到狀態、更新畫面顏色。

## 下一步計畫

1.  **完成旋轉邏輯**: 在 `CubeState.js` 中實作所有標準旋轉 (R, F, D, L, B, U', R', F', D', L', B') 以及可選的雙倍旋轉 (U2, R2 等)。這是實現完整打亂和解題功能的基礎。
2.  **改進 Scramble**:
    *   在 `CubeState.js` 的 `generateScramble` 中加入反向和雙倍旋轉。
    *   加入更完善的邏輯以避免無效或冗餘的步驟 (例如 U U', R L R')。
3.  **應用完整 Scramble**: 修改 `main.js` 中的 `randomizeBtn` 事件處理器，調用 `cubeState.applySequence(scrambleSequence)` 來應用完整的隨機序列，而不是目前的測試旋轉。
4.  **動畫引擎**: 開始設計和實作旋轉動畫，而不僅僅是靜態地更新顏色。

## 當前決策與考量

*   **檔案結構**: 採用簡單的根目錄結構 (`index.html`, `style.css`, `main.js`)，並將 Memory Bank 放在 `memory-bank/` 子目錄中。未來可能根據複雜度增加而建立 `src/` 或 `js/` 等子目錄。
*   **渲染起點**: 從最基本的單一立方體渲染開始，逐步增加複雜度到 3x3x3 的魔術方塊。

## 重要模式與偏好

*   **原生優先**: 盡可能使用瀏覽器原生 API (HTML, CSS, JS, Canvas 2D)，避免引入大型框架或函式庫，除非必要 (例如解題演算法)。
*   **模組化**: 儘早開始將程式碼組織成模組 (ES6 Modules)。
*   **註解與可讀性**: 保持程式碼清晰、易於理解，特別是涉及複雜 3D 計算和狀態管理的部分。

## 學習與洞見

*   (尚無，專案剛開始)
