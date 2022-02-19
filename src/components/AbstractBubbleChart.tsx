import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { forceSimulation } from "d3-force";
import { select } from "d3";

// JSONにおけるkey-valueのデータ型
type KeyValueData = {
  [key: string]: number | string;
};
// key-valueが配列になっているデータ型
type KeyValueDataArray = KeyValueData[];

// 可視化に使うための各次元のデータ型
type DimDataKeys = "value" | "displayName" | "patterns" | "domain" | "range";
type DimData = {
  [key: string]: {
    [key in DimDataKeys]: string | string[];
  };
};

// d3.jsで円を表示するためのデータ型
type BubbleData = {
  index: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  xAxis: string;
  yAxis: string;
  title?: string;
};

export const AbstractBubbleChart: React.VFC<{
  width: number;
  height: number;
  inputData: KeyValueDataArray;
  inputDimList: DimData;
  bubbleSizeKey: string;
  bubbleColorKey: string;
  bubbleTitle?: (d: KeyValueData) => string;
  xAxisKey: string;
  yAxisKey: string;
}> = ({
  width,
  height,
  inputData,
  inputDimList,
  bubbleSizeKey,
  bubbleColorKey,
  bubbleTitle,
  xAxisKey,
  yAxisKey,
}) => {
  const [data, setData] = useState<BubbleData[] | undefined>(undefined);
  const ref = useRef<SVGSVGElement>(null);
  const [center, setCenter] = useState({ x: width / 2, y: height / 2 });

  // width, heightに基づいて、centerの座標x, yを決定する
  useEffect(() => {
    if (!width || !height) {
      return;
    }
    setCenter({ x: width / 2, y: height / 2 });
  }, [width, height]);

  // bubbleSizeKey, bubbleColorKey, xAxisKey, yAxisKeyに基づいて、
  // inputDataをd3.jsで表示するためのBubbleData型のデータ構造に変換する
  useEffect(() => {
    const newData = inputData.map((rawD, i) => {
      return {
        index: i,
        x: center.x, // あとで動的に変更するので適当で良い
        y: center.y, // あとで動的に変更するので適当で良い
        radius: rawD[bubbleSizeKey] as number,
        color: rawD[bubbleColorKey] as string,
        xAxis: rawD[xAxisKey] as string,
        yAxis: rawD[yAxisKey] as string,
        title: bubbleTitle ? bubbleTitle(rawD) : undefined,
      };
    });
    setData(newData);
  }, [inputData, center, bubbleSizeKey, bubbleColorKey, xAxisKey, yAxisKey]);

  // 以下からはd3.jsの各種関数を使っていく
  // 参考文献:
  // - scaleOrdinal
  //   - https://github.com/d3/d3-scale/blob/v4.0.2/README.md#scaleOrdinal
  //   - https://observablehq.com/@d3/d3-scaleordinal
  // - scaleLinear
  //   - https://github.com/d3/d3-scale/blob/v4.0.2/README.md#scaleLinear
  //   - https://observablehq.com/@d3/d3-scalelinear

  // 円の色を決定するための関数
  // bubbleColorKeyで指定されたordinalな値と、
  // inputDimListにあるdomain, rangeで決定している
  const onFillColor = useCallback(
    (value) => {
      let domain = inputDimList[bubbleColorKey].domain;
      let range = inputDimList[bubbleColorKey].range;
      const fillColor = d3
        .scaleOrdinal<string>()
        .domain(domain)
        .range(range)
        .unknown("black");
      return fillColor(value);
    },
    [bubbleColorKey]
  );

  // 円の半径を決定するための関数
  // bubbleSizeKeyで指定されたlinearな値と、
  // heightに基づいて決定している
  const onRadiusSize = useCallback(
    (value) => {
      if (!data) {
        return 1;
      }
      const maxSize = d3.max(data, (d) => +d.radius);
      if (!maxSize) {
        return height / 40;
      }
      const radiusScaler = d3
        .scaleLinear()
        .domain([1, maxSize])
        .range([height / 400, height / 15]);
      return radiusScaler(value);
    },
    [data, bubbleSizeKey]
  );

  // 円のx座標を決定するための関数
  // inputDimListにdomainがある場合はordinalな値として扱う
  // inputDimListにdomainがない場合はlinearな値として扱う
  // widthに基づいて決定している
  const onForceX = useCallback(
    (value) => {
      let domain: string[] = inputDimList[xAxisKey].domain as string[];
      if (domain.length > 0) {
        console.log("x ordinal", domain);
        const range = Array.from(Array(domain.length), (_d, i) => {
          return (width / domain.length) * i + width / domain.length / 2;
        });
        console.log("x ordinal", range);
        const xScaler = d3
          .scaleOrdinal<number>()
          .domain(domain)
          .range(range)
          .unknown(center.x);
        return xScaler(value);
      } else {
        console.log("x linear", value);
        if (!data) {
          return center.x;
        }
        const maxSize = d3.max(data, (d) => +d.xAxis);
        if (!maxSize) {
          return center.x;
        }
        const xScaler = d3
          .scaleLinear()
          .domain([0, maxSize])
          .range([40, width - 40])
          .unknown(center.x);
        return xScaler(parseInt(value));
      }
    },
    [center, xAxisKey]
  );

  // 円のy座標を決定するための関数
  // inputDimListにdomainがある場合はordinalな値として扱う
  // inputDimListにdomainがない場合はlinearな値として扱う
  // heightに基づいて決定している
  const onForceY = useCallback(
    (value) => {
      let domain: string[] = inputDimList[yAxisKey].domain as string[];
      if (domain.length > 0) {
        console.log("y ordinal", domain);
        const range = Array.from(Array(domain.length), (_d, i) => {
          return (height / domain.length) * i + height / domain.length / 2;
        });
        console.log("y ordinal", range);
        const yScaler = d3
          .scaleOrdinal<number>()
          .domain(domain)
          .range(range)
          .unknown(center.y);
        return yScaler(value);
      } else {
        console.log("y linear", value);
        if (!data) {
          return center.y;
        }
        const maxSize = d3.max(data, (d) => +d.yAxis);
        if (!maxSize) {
          return center.y;
        }
        const yScaler = d3
          .scaleLinear()
          .domain([0, maxSize])
          .range([40, height - 40])
          .unknown(center.y);
        return yScaler(parseInt(value));
      }
    },
    [data, center, yAxisKey]
  );

  // d3.jsで円を描画する処理の実行
  useEffect(() => {
    if (!data || !ref.current) {
      return;
    }
    const svg = select(ref.current);
    const simulation = forceSimulation(data)
      // 円の当たり判定をonRadiusSize関数で動的に指定する
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (d.index === undefined) {
            return 1;
          }
          return onRadiusSize(data[d.index].radius) + 15;
        })
      )
      // 円のx座標をonForceX関数で動的に指定する
      .force(
        "x",
        d3
          .forceX()
          .strength(0.1)
          .x((d) => {
            if (d.index === undefined) {
              return center.x;
            }
            return onForceX(data[d.index].xAxis);
          })
      )
      // 円のy座標をonForceY関数で動的に指定する
      .force(
        "y",
        d3
          .forceY()
          .strength(0.1)
          .y((d) => {
            if (d.index === undefined) {
              return center.y;
            }
            return onForceY(data[d.index].yAxis);
          })
      );
    simulation.on("tick", () => {
      // 円を描画する
      svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .style("fill", (d) => onFillColor(d.color))
        .style("stroke", "black")
        .attr("x", (d) => {
          return (d.x = Math.max(30, Math.min(width - 30, d.x))); // 画面からはみ出さないようにしている
        })
        .attr("y", (d) => {
          return (d.y = Math.max(30, Math.min(height - 30, d.y))); // 画面からはみ出さないようにしている
        })
        .attr("width", (d) => onRadiusSize(d.radius))
        .attr("height", (d) => onRadiusSize(d.radius));
      // 円のラベルを描画する
      svg
        .selectAll("text")
        .data(data)
        .join("text")
        .style("fill", "darkGray")
        .style("font-size", "12px")
        .attr("x", (d) => d.x + onRadiusSize(d.radius) / 2)
        .attr("y", (d) => d.y + onRadiusSize(d.radius) + 15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => (d.title ? d.title : ""));
    });
  }, [data, center, xAxisKey, yAxisKey]);

  return (
    <svg
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        margin: "0px",
      }}
    ></svg>
  );
};