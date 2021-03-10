import { useQuery } from "@apollo/client";
import React from "react";
import * as queries from "apollo/queries";
import { ReferralType } from "types";
import styles from "./Referrals.module.css";

type Prop = {
  id: string;
  referralType: ReferralType;
};

const ReferralRow = ({ id, referralType }: Prop) => {
  //get user data using apollo hooks
  const { loading, error, data } = useQuery(
    referralType === "client" ? queries.GET_CLIENT(id) : queries.GET_BROKER(id)
  );

  const { user } = data || {};
  return (
    <>
      {loading && <p>Loading...</p>}
      {data && (
        <tr className={styles.tr}>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.phone}</td>
          <td>{user.email}</td>
        </tr>
      )}
      {JSON.stringify(error)}
    </>
  );
};

export default ReferralRow;
