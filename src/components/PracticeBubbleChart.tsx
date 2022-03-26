import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AbstractBubbleChart,
  DimData,
  KeyValueDataArray,
} from "./AbstractBubbleChart";

import practiceDataList from "../data/practice/data.json";
import practiceDimList from "../data/practice/dataDim.json";
import japanAgeDataList from "../data/practice/japanAge/data.json";
import japanAgeDimList from "../data/practice/japanAge/dataDim.json";
import yuisekiDataList from "../data/practice/yuiseki/data.json";
import yuisekiDimList from "../data/practice/yuiseki/dataDim.json";
import shibaharuDataList from "../data/practice/shibaharu/data.json";
import shibaharuDimList from "../data/practice/shibaharu/dataDim.json";
import japanDisabilityDataList from "../data/practice/japanDisability/data.json";
import japanDisabilityDimList from "../data/practice/japanDisability/dataDim.json";

const datasetOptions: {
  [key: string]: { dataList: KeyValueDataArray; dimList: DimData };
} = {
  practice: {
    dataList: practiceDataList,
    dimList: practiceDimList,
  },
  japanAge: {
    dataList: japanAgeDataList,
    dimList: japanAgeDimList,
  },
  yuiseki: {
    dataList: yuisekiDataList,
    dimList: yuisekiDimList,
  },
  shibaharu: {
    dataList: shibaharuDataList,
    dimList: shibaharuDimList,
  },
  japanDisability: {
    dataList: japanDisabilityDataList,
    dimList: japanDisabilityDimList,
  },
};

export const PracticeBubbleChart: React.VFC = () => {
  const div = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(window.innerWidth - 100);
  const [height, setHeight] = useState<number>(window.innerHeight - 100);

  const [dataOption, setDataOption] = useState(Object.keys(datasetOptions)[0]);
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
    if (Object.keys(datasetOptions).indexOf(dataOption)) {
      const dataset = datasetOptions[dataOption];
      setDataList(dataset.dataList);
      setDimList(dataset.dimList);
    }
  }, [dataOption]);

  return (
    <div>
      <select onChange={onChange}>
        {Object.keys(datasetOptions).map((opt) => {
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
