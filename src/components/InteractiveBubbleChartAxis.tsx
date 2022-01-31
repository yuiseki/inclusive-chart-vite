import React from "react";

export const InteractiveBubbleChartAxis: React.VFC<{
  onResetAxis: (e: React.FormEvent) => void;
  patterns: string[];
}> = ({ onResetAxis, patterns }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          flexGrow: 0,
          textAlign: "center",
          margin: "1%",
          writingMode: "horizontal-tb",
        }}
      >
        <button value="none" onClick={onResetAxis}>
          リセット
        </button>
      </div>
      {patterns.map((pattern) => (
        <div
          style={{
            margin: "1%",
            flexGrow: 1,
            textAlign: "center",
            backgroundColor: "lightgray",
          }}
        >
          {pattern}
        </div>
      ))}
    </div>
  );
};
