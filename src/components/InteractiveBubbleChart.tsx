import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AbstractBubbleChart } from "./AbstractBubbleChart";

import dataList from "../data/sample.json";
import { InteractiveBubbleChartAxis } from "./InteractiveBubbleChartAxis";

export const InteractiveBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);
  const [bubbleSize, setBubbleSize] = useState("none");
  const [bubbleColor, setBubbleColor] = useState("none");
  const [xAxis, setXAxis] = useState("none");
  const [yAxis, setYAxis] = useState("none");

  useEffect(() => {
    if (!div.current) {
      return;
    }
    setWidth(div.current.offsetWidth);
    setHeight(div.current.offsetHeight);
  }, [div.current]);

  const onChangeBubbleSize = useCallback((e) => {
    setBubbleSize(e.currentTarget.value);
  }, []);

  const onChangeBubbleColor = useCallback((e) => {
    setBubbleColor(e.currentTarget.value);
  }, []);

  const onChangeXAxis = useCallback((e) => {
    setXAxis(e.currentTarget.value);
  }, []);

  const onChangeYAxis = useCallback((e) => {
    setYAxis(e.currentTarget.value);
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignContent: "stretch",
      }}
    >
      <div style={{ flexGrow: 0 }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <b>
            バブルの大きさ：
            <select name="bubbleSize" onChange={onChangeBubbleSize}>
              <option value="none">なし</option>
              <option value="income">所得</option>
            </select>
          </b>
          <b style={{ marginLeft: "1%" }}>
            バブルの色：
            <select name="bubbleColor" onChange={onChangeBubbleColor}>
              <option value="none">なし</option>
              <option value="sex">性別</option>
              <option value="job">仕事</option>
            </select>
          </b>
        </div>
        <div
          style={{
            flexGrow: 0,
            display: "flex",
            alignItems: "center",
            height: "80px",
          }}
        >
          <div style={{ height: "100px", width: "100px" }}></div>
          {xAxis === "none" && (
            <div style={{ width: "100%", textAlign: "center", margin: "4px" }}>
              <b>
                横軸：
                <select name="xAxis" onChange={onChangeXAxis}>
                  <option value="none">なし</option>
                  <option value="sex">性別</option>
                  <option value="job">仕事</option>
                </select>
              </b>
            </div>
          )}
          {xAxis === "sex" && (
            <InteractiveBubbleChartAxis
              onResetAxis={onChangeXAxis}
              patterns={["男性", "女性"]}
            />
          )}
          {xAxis === "job" && (
            <InteractiveBubbleChartAxis
              onResetAxis={onChangeXAxis}
              patterns={["働いていない", "働いている"]}
            />
          )}
        </div>
      </div>
      <div style={{ flexGrow: 1, display: "flex", marginLeft: "4px" }}>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            writingMode: "vertical-rl",
          }}
        >
          {yAxis === "none" && (
            <div style={{ height: "100%", textAlign: "center" }}>
              <b>
                縦軸：
                <select name="yAxis" onChange={onChangeYAxis}>
                  <option value="none">なし</option>
                  <option value="age">年齢</option>
                  <option value="income">所得</option>
                </select>
              </b>
            </div>
          )}
          {yAxis === "age" && (
            <InteractiveBubbleChartAxis
              onResetAxis={onChangeYAxis}
              patterns={["子ども", "大人", "老人"]}
            />
          )}
          {yAxis === "income" && (
            <InteractiveBubbleChartAxis
              onResetAxis={onChangeYAxis}
              patterns={["低所得", "中所得", "高所得"]}
            />
          )}
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
            bubbleSize={bubbleSize}
            bubbleColor={bubbleColor}
            xAxis={xAxis}
            yAxis={yAxis}
          />
        </div>
      </div>
    </div>
  );
};
