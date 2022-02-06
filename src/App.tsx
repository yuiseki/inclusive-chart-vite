import { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/css";
import "./App.css";
import { InteractiveScatterChart } from "./components/InteractiveScatterChart";
import { InteractiveBubbleChart } from "./components/InteractiveBubbleChart";

const tabs = ["bubble", "scatter"];
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
      <div style={{ fontSize: "1.5em", height: "2vh", padding: "1vh" }}>
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
        <a
          href="https://scrapbox.io/c4j/インクルーシブチャート"
          target="_blank"
          style={{ marginLeft: "5px" }}
        >
          <i className="fab fa-github" />
          開発に協力
        </a>
      </div>
      <div style={{ width: "100vw", height: "96vh" }}>
        {activeTab === "scatter" && <InteractiveScatterChart />}
        {activeTab === "bubble" && <InteractiveBubbleChart />}
      </div>
    </div>
  );
}

export default App;
