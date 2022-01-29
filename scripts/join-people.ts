import * as fs from "fs";
import * as readline from "readline";

(async () => {
  const dir = "./src/data/people/";
  const files = fs.readdirSync(dir);

  const result: { [key: string]: Array<{}> } = {};
  for await (const file of files) {
    if (fs.statSync(dir + file).isFile() && /.*\.csv$/.test(file)) {
      const rs = fs.createReadStream(dir + file);
      const rl = readline.createInterface({ input: rs });
      const it = rl[Symbol.asyncIterator]();
      for await (const line of it) {
        const data = line.split(",");
        const id = file;
        const year = data[0] as string;
        if (year === "year") {
          continue;
        }
        const age = parseInt(data[1]);
        const income = parseInt(data[2]);
        const satisfaction = parseInt(data[3]);
        const information = data[4];
        const gender = data[5];
        if (!result[year]) {
          result[year] = [];
        }
        result[year].push({
          id: id,
          age: age,
          income: income,
          satisfaction: satisfaction,
          information: information,
          gender: gender,
        });
      }
    }
  }

  fs.writeFileSync(dir + "peopleByYears.json", JSON.stringify(result, null, 2));
})();
