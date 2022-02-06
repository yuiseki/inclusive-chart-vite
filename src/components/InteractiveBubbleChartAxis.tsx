import React from "react";

export const InteractiveBubbleChartAxis: React.VFC<{
  onResetAxis: (e: React.FormEvent) => void;
  patterns: string[];
}> = ({ onResetAxis, patterns }) => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
        }}
      >
        {patterns.map((pattern) => (
          <div
            style={{
              flexGrow: 1,
              height: "100%",
              minWidth: "44px",
              margin: "4px",
              lineHeight: "44px",
              verticalAlign: "middle",
              textAlign: "center",
              backgroundColor: "lightgray",
            }}
          >
            {pattern}
          </div>
        ))}
      </div>
      <button
        style={{
          flexGrow: 0,
          height: "44px",
          width: "44px",
          padding: "4px",
          margin: "4px",
          border: 0,
        }}
        value="none"
        onClick={onResetAxis}
      >
        リセット
      </button>
    </div>
  );
};
