import React from "react";
import { Route, Switch } from "react-router-dom";
import { Counter } from "./features/counter/Counter";
import { Landing } from "./features/landing/Landing";
import NotFound from "./features/NotFound";
import { Referrals } from "./features/referrals/Referrals";
import { routes } from "./types";

export default function Routes() {
  return (
    <Switch>
      <Route exact path={routes.root}>
        <Landing />
      </Route>
      <Route path="/counter">
        <Counter />
      </Route>
      <Route path={[routes.referrals.client, routes.referrals.agent]}>
        <Referrals />
      </Route>
      <Route path={routes.noMatch}>
        <NotFound />
      </Route>
    </Switch>
  );
}
