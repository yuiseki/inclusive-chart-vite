import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { forceSimulation } from "d3-force";
import { select } from "d3";

type BubbleData = {
  index: number;
  x: number;
  y: number;
  r: number;
};
type RawData = {
  [key: string]: number | string;
}[];
export const AbstractBubbleChart: React.VFC<{
  width: number;
  height: number;
  rawData: RawData;
  radiusKey: string;
  onFillColor: (d: BubbleData) => string;
}> = ({ width, height, rawData, radiusKey, onFillColor }) => {
  const forceStrength = 0.03;
  const center = { x: width / 2, y: height / 2 };
  const [data, setData] = useState<BubbleData[] | undefined>(undefined);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const newData = rawData.map((d, i) => {
      return {
        index: i,
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        r: d[radiusKey] as number,
      };
    });
    setData(newData);
  }, [rawData]);

  const radiusScale = useCallback(
    (v) => {
      if (!data) {
        return 0;
      }
      const maxSize = d3.max(data, (d) => +d.r);
      if (!maxSize) {
        return 0;
      }
      const radiusScale = d3.scaleSqrt().domain([0, maxSize]).range([0, 10]);
      return radiusScale(v);
    },
    [data]
  );

  useEffect(() => {
    if (!data || !ref.current) {
      return;
    }
    const svg = select(ref.current);
    const simulation = forceSimulation(data)
      .force("x", d3.forceX().strength(forceStrength).x(center.x))
      .force("y", d3.forceY().strength(forceStrength).y(center.y))
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (!d.index) {
            return 1;
          }
          return radiusScale(data[d.index].r) + 1;
        })
      );
    simulation.on("tick", () =>
      svg
        .selectAll("circle")
        .data(data)
        .join("circle")
        .style("fill", (d) => onFillColor(d))
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => radiusScale(d.r))
    );
  }, [data]);

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
