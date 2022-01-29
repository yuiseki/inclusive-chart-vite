import { People } from "./people";

export type PeopleByYears = {
  [year: string]: People[];
};
