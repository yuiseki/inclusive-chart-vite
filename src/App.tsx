import { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/css";
import "./App.css";
import { InteractiveScatterChart } from "./components/InteractiveScatterChart";
import { InteractiveBubbleChart } from "./components/InteractiveBubbleChart";

const tabs = ["scatter", "bubble"];
function App() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // load location hash
  useEffect(() => {
    const locationHash = window.location.hash.replace("#", "");
    if (tabs.indexOf(locationHash) >= 0) {
      setActiveTab(locationHash);
    }
  }, []);

  // update location hash
  useEffect(() => {
    window.history.pushState(undefined, "hoge", "#" + activeTab);
  }, [activeTab]);

  const onChangeTab = useCallback((e) => {
    setActiveTab(e.currentTarget.value);
  }, []);

  return (
    <div className="main">
      <div style={{ fontSize: "2em" }}>
        {tabs.map((tab) => {
          return (
            <label key={tab} htmlFor={`${tab}-button`}>
              <input
                type="radio"
                name="tab"
                id={`${tab}-button`}
                value={tab}
                onChange={onChangeTab}
                checked={activeTab === tab}
              />
              {tab}
            </label>
          );
        })}
      </div>
      <div
        className={css`
          width: 100%;
          height: 95%;
          display: ${activeTab === "scatter" ? "block" : "none"};
        `}
      >
        <InteractiveScatterChart />
      </div>
      <div
        className={css`
          width: 100%;
          height: 95%;
          display: ${activeTab === "bubble" ? "block" : "none"};
        `}
      >
        <InteractiveBubbleChart />
      </div>
    </div>
  );
}

export default App;
