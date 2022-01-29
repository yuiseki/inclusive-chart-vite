import { AbstractBubbleChart } from "./AbstractBubbleChart";

const gender = ["man", "woman"];

const dataA = Array.from(new Array(50)).map((i) => {
  const d = {
    income: Math.floor(Math.random() * 1000),
    gender: gender[Math.floor(Math.random() * gender.length)],
  };
  return d;
});
const dataB = Array.from(new Array(50)).map((i) => {
  const d = {
    income: Math.floor(Math.random() * 1000),
    gender: gender[Math.floor(Math.random() * gender.length)],
  };
  return d;
});

export const InteractiveBubbleChart: React.VFC = () => {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
      <AbstractBubbleChart
        width={400}
        height={800}
        rawData={dataA}
        radiusKey="income"
        onFillColor={(d) => {
          switch (dataA[d.index].gender) {
            case "man":
              return "blue";
            case "woman":
              return "red";
            default:
              return "gray";
          }
        }}
      />
      <AbstractBubbleChart
        width={400}
        height={800}
        rawData={dataB}
        radiusKey="income"
        onFillColor={(d) => {
          switch (dataB[d.index].gender) {
            case "man":
              return "yellow";
            case "woman":
              return "green";
            default:
              return "gray";
          }
        }}
      />
    </div>
  );
};
