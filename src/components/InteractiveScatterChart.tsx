import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Label,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { PeopleByYears } from "../data/people/peopleByYears";
import { PeopleTooltip } from "./PeopleTooltip";

import dataList from "../data/people/peopleByYears.json";
type Year = keyof typeof dataList;
const years = Object.keys(dataList) as Year[];

export const InteractiveScatterChart: React.VFC = () => {
  const [year, setYear] = useState<Year>(years[0]);
  const peopleAtYear = dataList[year];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 50,
          bottom: 60,
          left: 50,
        }}
      >
        <CartesianGrid />
        <XAxis tick={{ fill: "gray" }} type="number" dataKey="income">
          <Label
            value="年収"
            offset={5}
            position="bottom"
            fill="gray"
            style={{ fontSize: "30px" }}
          />
        </XAxis>
        <YAxis
          tick={{ fill: "gray" }}
          domain={[0, 100]}
          type="number"
          dataKey="age"
        >
          <Label
            value="年齢"
            offset={-15}
            position="left"
            fill="gray"
            style={{ fontSize: "30px" }}
          />
        </YAxis>
        <ZAxis
          type="number"
          dataKey="satisfaction"
          range={[400, 5000]}
          scale="pow"
        />
        <Tooltip
          labelFormatter={() => {
            return "";
          }}
          content={<PeopleTooltip />}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Scatter
          name="Satisfaction"
          data={peopleAtYear}
          fill="yellow"
          fillOpacity={0.5}
          shape="star"
        >
          {/*
              <LabelList dataKey='id' style={{ pointerEvents: 'none' }} />;
              */}
          {peopleAtYear.map((entry, index) => {
            if (!entry.satisfaction) {
              return null;
            }
            return (
              <Cell
                key={`cell-${index}`}
                fillOpacity={entry.satisfaction / 10}
                fill="yellow"
              />
            );
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
