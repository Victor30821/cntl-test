import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { TabContainer, TabFormContent } from "./style";

export function findFieldError(error, index, tabComponent, setTabComponent) {
  let array = Object.keys(error).find((item) => error[item].error === true);
  tabComponent.tabs[index].error = !!array;
  setTabComponent(tabComponent);
}

export function handleTabs(index = 0, tabComponent, setTabComponent) {
  tabComponent.tabs = tabComponent.tabs.map((item, i) =>
    i === index
      ? { ...item, ...{ active: true } }
      : { ...item, ...{ active: false } }
  );
  tabComponent.tabActive = index;
  setTabComponent({ ...tabComponent });
}

export function thereTabError(tabComponent) {
  return !!tabComponent.tabs.find((item) => item.error === true);
}

export function Tab({
  tabComponent = {
    tabs: [],
    tabActive: 0,
  },
  handleTabs = () => { },
  style,
  navStyle,
}) {
  return (
    <>
      <TabContainer style={{...style}}>
        <Nav tabs style={{...navStyle}}>
          {tabComponent.tabs.map((tab, index) => (
            <NavItem
              key={index}
              onClick={() => handleTabs(index)}
              className={
                `
                  ${tab.active ? "active" : "inactive"}
                  ${tab.error ? "error" : ""}
                `}
            >
              <NavLink >{tab.name}</NavLink>
            </NavItem>
          ))}
        </Nav>
      </TabContainer>
      <TabContent activeTab={tabComponent.tabActive}>
        {tabComponent.tabs.map((item, index) => (
          <TabPane key={index} tabId={index}>
            <TabFormContent style={{...item.style}}>{<item.Component />}</TabFormContent>
          </TabPane>
        ))}
      </TabContent>
    </>
  );
}
