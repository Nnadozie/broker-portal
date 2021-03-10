import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Pagination, ReferralType, routes } from "../types";

export default function useReferrals() {
  const { pathname } = useLocation();
  const history = useHistory();
  const [referralType, setReferralType] = useState<ReferralType>();

  //Need these to update client side cache on a page by page basis
  //We're using a single data source which can't be mutated, so for client side
  //data manipulation, segment the data into two halves, one for clients and one for brokers
  const [clientPagination, setClientPagination] = useState<Pagination>({
    page: 0,
    limit: 5,
  });
  const [brokerPagination, setBrokerPagination] = useState<Pagination>({
    page: 10,
    limit: 5,
  });

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

  return {
    referralType,
    clientPagination,
    brokerPagination,
    setClientPagination,
    setBrokerPagination,
  };
}
