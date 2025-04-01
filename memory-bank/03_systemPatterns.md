# 3. 系統模式 (System Patterns)

## 系統架構 (初步設想)

```mermaid
graph TD
    subgraph Frontend (Browser)
        A[HTML Structure] --> B(CSS Styling);
        A --> C{JavaScript Logic};
        B --> D[UI (Buttons, Text Display)];
        C --> E[Canvas 3D Renderer];
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

*   **渲染**: 使用原生 HTML5 Canvas 2D API 繪製 3D 效果。不引入 WebGL 或 Three.js 等大型函式庫，以保持純粹性與輕量。
*   **狀態管理**: 需要一個明確的機制來表示和管理魔術方塊的狀態（各個小方塊的位置和朝向）。可能會使用陣列或物件來表示。 (`js/CubeState.js` 已實作)
*   **動畫**: 使用 `requestAnimationFrame` 實現平滑的旋轉動畫。需要計算旋轉過程中的中間狀態。 (待辦)
*   **解題演算法**: **決定自行實作**一個（至少是基礎的）JavaScript 魔術方塊解題演算法 (`js/SimpleSolver.js`)，而不是依賴外部函式庫。演算法的輸出（解題步驟）將驅動動畫引擎。

## 設計模式考量

*   **模組化**: 將渲染、狀態管理、動畫、解題邏輯分離成獨立的模組或類別。
*   **狀態模式**: 可能用於管理應用程式的不同狀態（例如：空閒、隨機化中、解題動畫中）。
*   **命令模式**: 或許可以用於封裝魔術方塊的旋轉操作（U, F, R' 等）。

## 組件關係

*   **UI**: 負責接收使用者輸入（按鈕點擊）並顯示資訊（解題步驟）。
*   **Canvas Renderer**: 根據 `Cube State Manager` 提供的狀態，將 3D 魔術方塊繪製到 Canvas 上。
*   **Cube State Manager**: 維護魔術方塊的內部狀態，並提供方法來修改狀態（執行旋轉）。
*   **Animation Engine**: 負責根據解題步驟，平滑地過渡 `Cube State Manager` 的狀態，並觸發 `Canvas Renderer` 重繪。
*   **Solver Interface**: **現在是內部模組 (`js/SimpleSolver.js`)**，負責根據狀態計算解題步驟。

## 關鍵實作路徑

1.  **基礎 3D 渲染**: 實作在 Canvas 2D Context 上繪製立方體、設置透視投影、處理面片排序（遮擋關係）。
2.  **方塊狀態表示**: 設計數據結構來表示 3x3x3 魔術方塊的狀態。
3.  **單步旋轉實作**: 實作單一面（或層）的旋轉邏輯，更新方塊狀態。
4.  **動畫插值**: 計算旋轉動畫的中間幀。
5.  **實作解題演算法**: **開發 `js/SimpleSolver.js`**，從簡單邏輯開始，逐步完善。將其輸出連接到未來的動畫引擎。
6.  **UI 互動**: 連接按鈕點擊事件到相應的功能（隨機化、解題）。 (已部分完成)
