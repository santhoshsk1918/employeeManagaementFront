import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import Home from "./AnonymousUser/Home";
import DashBoard from "./Dashboard";
import AddDesignation from "./Dashboard/AddDesignation";
import AddEmployee from "./Dashboard/AddEmployee";
import AddBranch from "./Dashboard/AddBranch";
import NotFound from "./Dashboard/NotFound";
import AnmLayout from "./Layouts/AnmLayout";
import BaseLayout from "./Layouts/BaseLayout";

// This is the base component where all the router are handled and this is also the component which handles basic user login and page switching
export default function HomeComponent() {
  const { loggedInUser } = useContext(UserContext);
  return (
    <Router>
      {!loggedInUser.isLoggedIn ? (
        //When user is not logged in
        <Switch>
          <AnmLayout>
            <Route exact path={"/"} component={Home} />
          </AnmLayout>
        </Switch>
      ) : (
        //When user is logged in
        <BaseLayout>
          <Switch>
            <Route exact path={["/", "/dashboard"]} component={DashBoard} />
            <Route exact path={["/addemployee/:id", "/addemployee"]} component={AddEmployee} />
            <Route exact path="/adddesignation" component={AddDesignation} />
            <Route exact path="/AddBranch" component={AddBranch} />
            <Route component={NotFound} />
          </Switch>
        </BaseLayout>
      )}
    </Router>
  );
}
