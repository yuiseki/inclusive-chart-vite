import React from "react";

export const InteractiveBubbleChartAxis: React.VFC<{
  onResetAxis: (e: React.FormEvent) => void;
  patterns: string[];
}> = ({ onResetAxis, patterns }) => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <button
        style={{
          flexGrow: 0,
          height: "80px",
          width: "80px",
          padding: "6px",
          margin: "4px",
          border: 0,
        }}
        value="none"
        onClick={onResetAxis}
      >
        リセット
      </button>
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
              margin: "4px",
              lineHeight: "80px",
              verticalAlign: "middle",
              textAlign: "center",
              backgroundColor: "lightgray",
            }}
          >
            {pattern}
          </div>
        ))}
      </div>
    </div>
  );
};
