import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AbstractBubbleChart,
  DimData,
  KeyValueDataArray,
} from "./AbstractBubbleChart";

import practiceDataList from "../data/practice/data.json";
import practiceDimList from "../data/practice/dataDim.json";

// japan
import japanDataList from "../data/japan/data.json";
import japanDimList from "../data/japan/dataDim.json";

// yuiseki
import yuisekiDataList from "../data/yuiseki/data.json";
import yuisekiDimList from "../data/yuiseki/dataDim.json";

const datasetOptions = ["practice", "japan", "yuiseki"];

export const PracticeBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);

  const [dataOption, setDataOption] = useState("sample");
  const [dataList, setDataList] = useState<KeyValueDataArray>(practiceDataList);
  const [dimList, setDimList] = useState<DimData>(practiceDimList);

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
      case "practice":
        setDataList(practiceDataList);
        setDimList(practiceDimList);
        break;
      case "yuiseki":
        setDataList(yuisekiDataList);
        setDimList(yuisekiDimList);
        break;
      case "japan":
        setDataList(japanDataList);
        setDimList(japanDimList);
        break;
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
          bubbleSizeKey={dimList.sizeValue.value as string}
          bubbleColorKey={dimList.colorValue.value as string}
          bubbleTitle={(d) => d.name + ""}
          xAxisKey={dimList.xValue.value as string}
          yAxisKey={dimList.yValue.value as string}
        />
      </div>
    </div>
  );
};
