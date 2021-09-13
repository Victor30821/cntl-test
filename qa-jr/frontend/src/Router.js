import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import {
  DriversManage,
  DriversCreate,
  DriversEdit,
} from "./pages/";

import { localizedStrings } from "./constants/localizedStrings";
import {
  DRIVERS_MANAGE_PATH,
  DRIVERS_CREATE_PATH,
  DRIVERS_EDIT_PATH,
} from "constants/paths";

export default function Router() {
  return (
    <Switch>
      <Route
        exact
        path={DRIVERS_CREATE_PATH}
        component={props => (
          <DriversCreate
            {...props}
            title={localizedStrings.drivers}
            subtitle={localizedStrings.createDriver}
            icon={"drivers"}
          />
        )}
      />
      <Route
        exact
        path={DRIVERS_MANAGE_PATH}
        component={props => (
          <DriversManage
            {...props}
            title={localizedStrings.drivers}
            subtitle={localizedStrings.manage}
            icon={"drivers"}
          />
        )}
      />
      <Route
        exact
        path={DRIVERS_EDIT_PATH}
        component={props => (
          <DriversEdit
            {...props}
            title={localizedStrings.drivers}
            subtitle={localizedStrings.driverEdition}
            icon={"drivers"}
          />
        )}
      />
      <Redirect from="/" to={DRIVERS_MANAGE_PATH} />
    </Switch>
  );
}

export { Router };
