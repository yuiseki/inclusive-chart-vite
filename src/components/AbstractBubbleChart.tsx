import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { forceSimulation, SimulationNodeDatum } from "d3-force";
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
    const newData = rawData.map((d, i) => {
      return {
        index: i,
        x: center.x,
        y: center.y,
        r: d[radiusKey] as number,
      };
    });
    setData(newData);
  }, [rawData, center]);

  const radiusScale = useCallback(
    (v) => {
      if (!data) {
        return 1;
      }
      const maxSize = d3.max(data, (d) => +d.r);
      if (!maxSize) {
        return 1;
      }
      const radiusScale = d3.scaleLinear().domain([1, maxSize]).range([3, 30]);
      return radiusScale(v);
    },
    [data]
  );

  const onForceX = useCallback(
    (domain) => {
      const xScaler = d3
        .scaleOrdinal<number>()
        .domain(["male", "female"])
        .range([center.x - width / 4, center.x + width / 4])
        .unknown(center.x);
      return xScaler(domain);
    },
    [width, height, center]
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
    (domain) => {
      const yScaler = d3
        .scaleLinear()
        .domain([0, 100])
        .range([10, height - 10]);
      return yScaler(parseInt(domain));
    },
    [width, height, center]
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
            if (!d.index) {
              return 0;
            }
            return onForceX(rawData[d.index]["sex"]);
          })
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.05)
          .y((d) => {
            if (!d.index) {
              return 0;
            }
            return onForceY(rawData[d.index]["age"]);
          })
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (!d.index) {
            return 1;
          }
          return radiusScale(data[d.index].r) + 5;
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
  }, [data, center]);

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
