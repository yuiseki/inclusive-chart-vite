import React, { useCallback, useEffect, useRef, useState } from "react";
import { AbstractBubbleChart } from "./AbstractBubbleChart";

import sampleDataList from "../data/practice/data.json";
import sampleDimList from "../data/practice/dataDim.json";

// yuiseki
import yuisekiDataList from "../data/yuiseki/data.json";
import yuisekiDimList from "../data/yuiseki/dataDim.json";

const datasetOptions = ["sample", "yuiseki"];

export const PracticeBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);

  const [dataOption, setDataOption] = useState("sample");
  const [dataList, setDataList] = useState(sampleDataList);
  const [dimList, setDimList] = useState(sampleDimList);

  useEffect(() => {
    if (!div.current) {
      return;
    }
    setWidth(div.current.offsetWidth);
    setHeight(div.current.offsetHeight);
  }, [div.current]);

  const onChange = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
    setDataOption(e.currentTarget.value);
  }, []);

  useEffect(() => {
    switch (dataOption) {
      case "sample":
        setDataList(sampleDataList);
        setDimList(sampleDimList);
        break;
      case "yuiseki":
        setDataList(yuisekiDataList);
        setDimList(yuisekiDimList);
      default:
        break;
    }
  }, [dataOption]);

  return (
    <div>
      <select onChange={onChange}>
        {datasetOptions.map((opt) => {
          return (
            <option value={opt} selected={dataOption === opt}>
              {opt}
            </option>
          );
        })}
      </select>
      <div
        style={{
          height: "93vh",
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
    </div>
  );
};
