import { useCallback, useEffect, useRef, useState } from "react";
import { AbstractBubbleChart } from "./AbstractBubbleChart";
import { InteractiveBubbleChartAxis } from "./InteractiveBubbleChartAxis";

import dataList from "../data/sample.json";
import dimList from "../data/sampleDims.json";
type dimStr = keyof typeof dimList;

// 連続値
const bubbleSizeDims = [dimList.income, dimList.satisfaction];
// 連続値
const yAxisDims = [dimList.age, dimList.income, dimList.satisfaction];
// 離散値
const xAxisDims = [dimList.sex, dimList.job];

export const InteractiveBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);
  const [bubbleSize, setBubbleSize] = useState<dimStr>("none");
  const [bubbleColor, setBubbleColor] = useState<dimStr>("none");
  const [xAxis, setXAxis] = useState<dimStr>("none");
  const [yAxis, setYAxis] = useState<dimStr>("none");

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
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignContent: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          flexGrow: 0,
          width: "100%",
          height: "25px",
          verticalAlign: "middle",
          alignItems: "flex-start",
          textAlign: "start",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <b>
            バブルの大きさ：
            <select name="bubbleSize" onChange={onChangeBubbleSize}>
              <option value="none">なし</option>
              {bubbleSizeDims.map((dim) => {
                return (
                  <option key={"bubble-size-" + dim.value} value={dim.value}>
                    {dim.displayName}
                  </option>
                );
              })}
            </select>
          </b>
        </div>
        <div>
          <b>
            バブルの色：
            <select name="bubbleColor" onChange={onChangeBubbleColor}>
              <option value="none">なし</option>
              <option value="sex">性別</option>
              <option value="job">仕事</option>
            </select>
          </b>
        </div>
      </div>
      <div
        style={{
          flexGrow: 0,
          display: "flex",
          alignItems: "center",
          height: "66px",
          margin: "4px",
        }}
      >
        <div style={{ width: "66px" }} />
        {xAxis === "none" && (
          <div
            style={{ width: "100%", textAlign: "start", marginRight: "70px" }}
          >
            <b>
              横軸：
              <select name="xAxis" onChange={onChangeXAxis}>
                <option value="none">なし</option>
                {xAxisDims.map((dim) => {
                  return (
                    <option key={"x-axis-" + dim.value} value={dim.value}>
                      {dim.displayName}
                    </option>
                  );
                })}
              </select>
            </b>
          </div>
        )}
        {xAxisDims
          .filter((dim) => {
            return dim.value === xAxis;
          })
          .map((dim) => {
            return (
              <InteractiveBubbleChartAxis
                onResetAxis={onChangeXAxis}
                patterns={dim.patterns}
              />
            );
          })}
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          marginLeft: "4px",
        }}
      >
        {/* 縦軸 */}
        <div
          style={{
            flexGrow: 0,
            display: "flex",
            writingMode: "vertical-rl",
            width: "66px",
            marginLeft: "4px",
          }}
        >
          {yAxis === "none" && (
            <div style={{ flexGrow: 1, height: "100%", textAlign: "start" }}>
              <b>
                縦軸：
                <select
                  style={{
                    display: "inline-block",
                    maxWidth: "66px",
                  }}
                  name="yAxis"
                  onChange={onChangeYAxis}
                >
                  <option value="none">なし</option>
                  {yAxisDims.map((dim) => {
                    return (
                      <option key={"y-axis-" + dim.value} value={dim.value}>
                        {dim.displayName}
                      </option>
                    );
                  })}
                </select>
              </b>
            </div>
          )}
          {yAxisDims
            .filter((dim) => {
              return dim.value === yAxis;
            })
            .map((dim) => {
              return (
                <InteractiveBubbleChartAxis
                  onResetAxis={onChangeYAxis}
                  patterns={dim.patterns}
                />
              );
            })}
        </div>
        <div style={{ width: "70px" }} />
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ height: "70px" }} />
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
              inputData={dataList}
              inputDimList={dimList}
              bubbleSize={bubbleSize}
              bubbleColor={bubbleColor}
              bubbleTitle={(d) => d.name + "@" + d.address}
              xAxis={xAxis}
              yAxis={yAxis}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
