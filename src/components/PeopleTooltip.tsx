import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const PeopleTooltip = (props: TooltipProps<ValueType, NameType>) => {
  if (!props.active || !props.payload) {
    return null;
  }
  const values = props.payload[0].payload;
  const newPayload = [
    {
      name: "年齢",
      value: values.age,
    },
    {
      name: "年収",
      value: values.income,
    },
    {
      name: "ジェンダー",
      value: values.gender,
    },
    {
      name: "情報",
      value: values.information,
    },
  ];
  return (
    <div>
      {newPayload.map((p) => {
        return (
          <div key={p.name}>
            {p.name}: {p.value}
          </div>
        );
      })}
    </div>
  );
};
