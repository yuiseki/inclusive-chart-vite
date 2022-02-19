import { useCallback, useEffect, useRef, useState } from "react";
import { AbstractBubbleChart } from "./AbstractBubbleChart";

import dataList from "../data/practice.json";
import dimList from "../data/practiceDim.json";

export const PracticeBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);

  useEffect(() => {
    if (!div.current) {
      return;
    }
    setWidth(div.current.offsetWidth);
    setHeight(div.current.offsetHeight);
  }, [div.current]);

  return (
    <div
      style={{
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignContent: "stretch",
      }}
    >
      <AbstractBubbleChart
        width={width}
        height={height}
        inputData={dataList}
        inputDimList={dimList}
        bubbleSizeKey={"sizeValue"}
        bubbleColorKey={"colorValue"}
        bubbleTitle={(d) => d.name + ""}
        xAxisKey={"xValue"}
        yAxisKey={"yValue"}
      />
    </div>
  );
};
