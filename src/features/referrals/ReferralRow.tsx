import { useQuery } from "@apollo/client";
import React from "react";
import * as queries from "apollo/queries";
import { ReferralType } from "types";

type Prop = {
  id: string;
  referralType: ReferralType;
};

const ReferralRow = ({ id, referralType }: Prop) => {
  //get user data using apollo hooks
  const { loading, error, data } = useQuery(
    referralType === "client" ? queries.GET_CLIENT(id) : queries.GET_BROKER(id)
  );
  return (
    <>
      {loading && <h2>Loading...</h2>}
      {JSON.stringify(data)}
      {JSON.stringify(error)}
    </>
  );
};

export default ReferralRow;
