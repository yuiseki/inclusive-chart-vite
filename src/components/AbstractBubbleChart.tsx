import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { forceSimulation, SimulationNodeDatum } from "d3-force";
import { select } from "d3";

type BubbleData = {
  index: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  xAxis: string;
  yAxis: string;
};
type RawData = {
  [key: string]: number | string;
}[];
export const AbstractBubbleChart: React.VFC<{
  width: number;
  height: number;
  rawData: RawData;
  bubbleSize: string;
  bubbleColor: string;
  xAxis: string;
  yAxis: string;
}> = ({ width, height, rawData, bubbleSize, bubbleColor, xAxis, yAxis }) => {
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
    const newData = rawData.map((d, i) => {
      return {
        index: i,
        x: center.x,
        y: center.y,
        radius: d[bubbleSize] as number,
        color: d[bubbleColor] as string,
        xAxis: d[xAxis] as string,
        yAxis: d[yAxis] as string,
      };
    });
    setData(newData);
  }, [rawData, center, bubbleSize, bubbleColor, xAxis, yAxis]);

  const onRadiusSize = useCallback(
    (value) => {
      if (!data) {
        return 1;
      }
      const maxSize = d3.max(data, (d) => +d.radius);
      if (!maxSize) {
        return 10;
      }
      const radiusScaler = d3.scaleLinear().domain([1, maxSize]).range([3, 30]);
      return radiusScaler(value);
    },
    [data, bubbleSize]
  );

  const onFillColor = useCallback(
    (value) => {
      const fillColor = d3
        .scaleOrdinal<string>()
        .domain(["male", "female"])
        .range(["blue", "red"])
        .unknown("black");
      return fillColor(value);
    },
    [bubbleColor]
  );

  const onForceX = useCallback(
    (value) => {
      console.log(value);
      const xScaler = d3
        .scaleOrdinal<number>()
        .domain(["male", "female"])
        .range([center.x - width / 4, center.x + width / 4])
        .unknown(center.x);
      return xScaler(value);
    },
    [width, height, center, xAxis]
  );

  /*
  const onForceY = useCallback(
    (domain) => {
      const yScaleOrdinal = d3
        .scaleOrdinal<number>()
        .domain(["0", "1"])
        .range([center.y - height / 4, center.y + height / 4])
        .unknown(0);
      return yScaleOrdinal(domain);
    },
    [width, height]
  );*/

  const onForceY = useCallback(
    (value) => {
      const yScaler = d3
        .scaleLinear()
        .domain([0, 100])
        .range([10, height - 10])
        .unknown(center.y);
      return yScaler(parseInt(value));
    },
    [width, height, center, yAxis]
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
          .strength(0.05)
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
          .strength(0.05)
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
    simulation.on("tick", () =>
      svg
        .selectAll("circle")
        .data(data)
        .join("circle")
        .style("fill", (d) => onFillColor(d.color))
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => onRadiusSize(d.radius))
    );
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
