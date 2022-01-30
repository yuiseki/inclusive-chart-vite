import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AbstractBubbleChart } from "./AbstractBubbleChart";

import dataList from "../data/sample.json";

export const InteractiveBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);
  const [bubbleColor, setBubbleColor] = useState();

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
        height: "95%",
        width: "100%",
      }}
    >
      <div style={{ width: "100%", textAlign: "center" }}>
        <b>バブルの大きさ：所得</b>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <div style={{ width: "5%" }}></div>
        <div style={{ width: "47%", textAlign: "center" }}>男性</div>
        <div style={{ width: "47%", textAlign: "center" }}>女性</div>
      </div>
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <div
          style={{
            width: "5%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            writingMode: "vertical-rl",
            marginLeft: "2%",
          }}
        >
          <div style={{ margin: "auto", height: "20%" }}>年齢が低い</div>
          <div style={{ margin: "auto", height: "20%" }}>年齢が高い</div>
        </div>
        <div
          ref={div}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <AbstractBubbleChart
            width={width}
            height={height}
            rawData={dataList}
            radiusKey="income"
            onFillColor={(d) => {
              switch (dataList[d.index].sex) {
                case "male":
                  return "blue";
                case "female":
                  return "red";
                default:
                  return "gray";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
