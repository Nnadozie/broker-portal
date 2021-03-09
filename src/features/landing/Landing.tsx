import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../../types";

export function Landing() {
  const history = useHistory();

  useEffect(() => {
    history.replace({ pathname: routes.referrals.client });
  }, [history]);

  return <></>;
}
