# 3. 系統模式 (System Patterns)

## 系統架構 (初步設想)

```mermaid
graph TD
    subgraph Frontend (Browser)
        A[HTML Structure] --> B(CSS Styling);
        A --> C{JavaScript Logic};
        B --> D[UI (Buttons, Text Display)];
        C --> E[Three.js Renderer]; %% Changed
        C --> F[Cube State Manager];
        C --> G[Animation Engine];
        C --> H[Solver Algorithm Interface];
        E --> I(Canvas Element);
        F --> E;
        G --> E;
        H --> F;
        H --> G;
        D -- Trigger --> C;
        H --> C; // Solver logic is now internal
    end

    %% External Libraries/Logic subgraph removed or marked as internal
```

## 關鍵技術決策 (初步)

*   **渲染**: **改用 Three.js 函式庫** 進行 WebGL 渲染，以利用硬體加速並簡化 3D 效果的實現。 (`js/CubeRenderer.js` 已重構)
*   **狀態管理**: 需要一個明確的機制來表示和管理魔術方塊的狀態（各個小方塊的位置和朝向）。可能會使用陣列或物件來表示。 (`js/CubeState.js` 已實作)
*   **動畫**: 使用 `requestAnimationFrame` (由 Three.js 內部管理) 和 **Tween.js** 實現平滑的旋轉動畫。 (`js/CubeRenderer.js` 中 `animateRotation` 已初步實作)
*   **"解題"邏輯 (簡易版)**: **目前採用一種非標準的簡易方法**：記錄隨機產生的打亂序列，並在請求解題時，將該序列反轉並反向 (`js/SimpleSolver.js`)。這並非真正的解題，但可作為動畫流程的輸入。

## 設計模式考量

*   **模組化**: 將渲染、狀態管理、動畫、解題邏輯分離成獨立的模組或類別。
*   **狀態模式**: 可能用於管理應用程式的不同狀態（例如：空閒、隨機化中、解題動畫中）。
*   **命令模式**: 或許可以用於封裝魔術方塊的旋轉操作（U, F, R' 等）。

## 組件關係

*   **UI**: 負責接收使用者輸入（按鈕點擊）並顯示資訊（解題步驟）。
*   **Three.js Renderer**: 根據 `Cube State Manager` 提供的狀態，使用 Three.js 將 3D 魔術方塊渲染到 Canvas 上。 (`js/CubeRenderer.js` 已重構)
*   **Cube State Manager**: 維護魔術方塊的內部狀態，並提供方法來修改狀態（執行旋轉）。 (`js/CubeState.js` 已實作)
*   **Animation Engine**: **整合在 `CubeRenderer.js` (`animateRotation`) 和 `main.js` (序列處理) 中**。負責根據步驟序列，調用 Three.js 渲染器的動畫方法，並在動畫完成後更新 `CubeState`。 (打亂動畫已實作)
*   **Solver Interface**: **現在是內部模組 (`js/SimpleSolver.js`)**，負責接收打亂序列並回傳其反轉、反向的版本。

## 關鍵實作路徑

1.  **基礎 3D 渲染 (Three.js)**: **設置 Three.js 場景、相機、渲染器，創建 3x3x3 的方塊網格，並實現顏色更新邏輯**。 (`js/CubeRenderer.js` 已重構)
2.  **方塊狀態表示**: 設計數據結構來表示 3x3x3 魔術方塊的狀態。 (`js/CubeState.js` 已實作)
3.  **單步旋轉實作 (狀態)**: 實作單一面（或層）的旋轉邏輯，更新 `CubeState`。 (`js/CubeState.js` 已實作)
4.  **動畫插值 (Three.js)**: **使用 Tween.js 在 `CubeRenderer.js` 中實作 `animateRotation` 方法**。 (已初步完成)
5.  **實作"解題"邏輯**: **已在 `js/SimpleSolver.js` 中實作反轉打亂序列的邏輯**。未來可能替換為真正的解題演算法。將其輸出連接到動畫引擎。
6.  **UI 互動與動畫序列**: **連接「隨機產生」按鈕以觸發打亂動畫序列**。 (已完成) 連接「自動解題」按鈕以觸發解題動畫序列 (待辦)。
