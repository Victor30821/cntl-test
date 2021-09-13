import React, { useState } from "react";
import { Tabs } from "components";
import { localizedStrings } from "constants/localizedStrings";
import Path from "./components/path";
const { Tab, handleTabs } = Tabs;

export default function LogisticDetailRouteForm({ setStatePeriod }) {
  
  const [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        style: {
            margin: "0px",
            maxHeight: "345px",
            overflow: "scroll",
        },
        name: localizedStrings.logisticService.detail_route.path,
        Component: () => (
          <Path 
          setStatePeriod={setStatePeriod} 
          />
        )
      },
      // {
      //   active: false,
      //   style: {
      //       margin: "0px",
      //       maxHeight: "372px",
      //       overflow: "scroll",
      //   },
      //   name: localizedStrings.logisticService.detail_route.detail,
      //   Component: () => (
      //     <Detail />
      //   )
      // },
    ],
    tabActive: 0
  });


  return (
    <>
      <Tab
        handleTabs={index => handleTabs(index, tabComponent, setTabComponent)}
        tabComponent={tabComponent}
        style={{margin: "0px"}}
      />
    </>
  );
}
