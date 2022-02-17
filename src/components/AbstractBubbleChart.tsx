import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { forceSimulation } from "d3-force";
import { select } from "d3";
import dimList from "../data/sampleDims.json";

type dimStr = keyof typeof dimList;

type BubbleData = {
  index: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  xAxis: string;
  yAxis: string;
  title: string;
};
type RawData = {
  [key: string]: number | string;
}[];

export const AbstractBubbleChart: React.VFC<{
  width: number;
  height: number;
  inputData: RawData;
  bubbleSize: dimStr;
  bubbleColor: dimStr;
  xAxis: dimStr;
  yAxis: dimStr;
}> = ({ width, height, inputData, bubbleSize, bubbleColor, xAxis, yAxis }) => {
  const [data, setData] = useState<BubbleData[] | undefined>(undefined);
  const ref = useRef<SVGSVGElement>(null);
  const [center, setCenter] = useState({ x: width / 2, y: height / 2 });

  useEffect(() => {
    if (!width || !height) {
      return;
    }
    setCenter({ x: width / 2, y: height / 2 });
    console.log(center);
  }, [width, height]);

  useEffect(() => {
    console.log(xAxis, yAxis);
    const newData = inputData.map((rawD, i) => {
      return {
        index: i,
        x: center.x,
        y: center.y,
        radius: rawD[bubbleSize] as number,
        color: rawD[bubbleColor] as string,
        xAxis: rawD[xAxis] as string,
        yAxis: rawD[yAxis] as string,
        title: ((rawD.name as string) + "@" + rawD.address) as string,
      };
    });
    setData(newData);
  }, [inputData, center, bubbleSize, bubbleColor, xAxis, yAxis]);

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
        .range([height / 100, height / 20]);
      return radiusScaler(value);
    },
    [data, bubbleSize]
  );

  const onFillColor = useCallback(
    (value) => {
      let domain = dimList[bubbleColor].domain;
      let range = dimList[bubbleColor].range;
      const fillColor = d3
        .scaleOrdinal<string>()
        .domain(domain)
        .range(range)
        .unknown("black");
      return fillColor(value);
    },
    [bubbleColor]
  );

  const onForceX = useCallback(
    (value) => {
      let domain: string[] = dimList[xAxis].domain;
      const xScaler = d3
        .scaleOrdinal<number>()
        .domain(domain)
        .range([center.x - width / 4, center.x + width / 4])
        .unknown(center.x);
      return xScaler(value);
    },
    [center, xAxis]
  );

  const onForceY = useCallback(
    (value) => {
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
        .range([10, height - 40])
        .unknown(center.y);
      return yScaler(parseInt(value));
    },
    [data, center, yAxis]
  );

  useEffect(() => {
    if (!data || !ref.current) {
      return;
    }
    const svg = select(ref.current);
    const simulation = forceSimulation(data)
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
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (d.index === undefined) {
            return 1;
          }
          return onRadiusSize(data[d.index].radius) + 5;
        })
      );
    simulation.on("tick", () => {
      svg
        .selectAll("circle")
        .data(data)
        .join("circle")
        .style("fill", (d) => onFillColor(d.color))
        .style("stroke", "black")
        .attr("cx", (d) => {
          return (d.x = Math.max(30, Math.min(width - 30, d.x)));
        })
        .attr("cy", (d) => {
          return (d.y = Math.max(30, Math.min(height - 30, d.y)));
        })
        .attr("r", (d) => onRadiusSize(d.radius));

      svg
        .selectAll("text")
        .data(data)
        .join("text")
        .style("fill", "darkGray")
        .style("font-size", "12px")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => d.title);
    });
  }, [data, center, xAxis, yAxis]);

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
