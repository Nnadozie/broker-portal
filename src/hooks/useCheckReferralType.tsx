import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ReferralType, routes } from "../types";

export default function useCheckReferralType() {
  const { pathname } = useLocation();
  const history = useHistory();
  const [referralType, setReferralType] = useState<ReferralType>();

  useEffect(() => {
    switch (pathname) {
      case routes.referrals.client:
        setReferralType("client");
        break;
      case routes.referrals.agent:
        setReferralType("broker");
        break;
      default:
        history.replace(routes.noMatch);
        break;
    }
  }, [pathname, history]);

  return referralType;
}
