import React, { useRef } from "react";
import styles from "./Referrals.module.css";
import Modal from "components/Modal";
import { useModal, useReferrals } from "hooks";
import ReferralForm from "./ReferralForm";
import * as queries from "apollo/queries";
import { useQuery } from "@apollo/client";
import ReferralRow from "./ReferralRow";
import { NavLink } from "react-router-dom";
import { routes } from "types";

type Props = {};

export function Referrals(props: Props) {
  //Get referral page helpers from custom hook
  const {
    referralType,
    clientPagination,
    brokerPagination,
    setClientPagination,
    setBrokerPagination,
  } = useReferrals();

  //Get modal controls
  const { hideModal, openModal, isVisible } = useModal();
  const returnFocus = useRef(null);

  //get data by referralType using apollo hooks
  const { loading, error, data } = useQuery(
    referralType === "client"
      ? queries.GET_CLIENT_LIST(clientPagination.page, clientPagination.limit)
      : queries.GET_BROKER_LIST(brokerPagination.page, brokerPagination.limit)
  );

  return (
    <>
      <nav
        style={{
          display: "flex",
          width: "80%",
        }}
      >
        <NavLink
          className={styles.link}
          activeClassName={styles["link-active"]}
          to={routes.referrals.client}
        >
          Client referrals
        </NavLink>
        <NavLink
          className={styles.link}
          activeClassName={styles["link-active"]}
          to={routes.referrals.agent}
        >
          Broker/Agent referrals
        </NavLink>
      </nav>
      <header className={styles.header}>
        <div className={styles["header-item"]}>
          <p>
            Emails sent<br></br>
            <span>{data?.users.total / 2 || "..."}</span>
          </p>
        </div>
        <div className={styles["header-item"]}>
          <p>
            Conversions<span>0</span>
          </p>
        </div>
        <div className={styles["header-item"]}>
          <p>
            Your earnings<span>{(data?.users.total * 50) / 2 || "..."}</span>
          </p>
        </div>
      </header>
      <main className={styles.main}>
        <input style={{ display: "none" }} placeholder={"search"}></input>
        <button
          className={styles.btn}
          style={{
            marginTop: "2rem",
            padding: "1.5rem 6rem",
            fontSize: "1.1rem",
          }}
          ref={returnFocus}
          onClick={openModal}
        >
          Add referral
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {loading && <h2>Loading...</h2>}
            {error && (
              <p>
                An error occurred while fetching your data. Please try again.
              </p>
            )}
            {data?.users.data.map(({ id }: { id: string }) => {
              return (
                <ReferralRow id={id} referralType={referralType} key={id} />
              );
            })}
          </tbody>
        </table>
      </main>
      <footer style={{ display: "flex", marginTop: "2rem" }}>
        <button
          className={"btn"}
          onClick={(e) => {
            e.preventDefault();
            referralType === "client"
              ? setClientPagination({
                  ...clientPagination,
                  page: clientPagination.page - 1,
                })
              : setBrokerPagination({
                  ...brokerPagination,
                  page: brokerPagination.page - 1,
                });
          }}
          disabled={
            (referralType === "client" && clientPagination.page <= 0) ||
            (referralType === "broker" && brokerPagination.page <= 10)
          }
        >
          Back
        </button>
        <p style={{ width: "3rem", textAlign: "center" }}>
          {referralType === "client"
            ? clientPagination.page + 1
            : brokerPagination.page - 9}
        </p>
        <button
          className={"btn"}
          onClick={(e) => {
            e.preventDefault();
            referralType === "client"
              ? setClientPagination({
                  ...clientPagination,
                  page: clientPagination.page + 1,
                })
              : setBrokerPagination({
                  ...brokerPagination,
                  page: brokerPagination.page + 1,
                });
          }}
          disabled={
            (referralType === "client" && clientPagination.page >= 9) ||
            (referralType === "broker" && brokerPagination.page >= 19)
          }
        >
          Next
        </button>
      </footer>
      <Modal
        hideModal={hideModal}
        isVisible={isVisible}
        returnFocus={returnFocus}
      >
        <ReferralForm
          referralType={referralType}
          clientPagination={clientPagination}
          brokerPagination={brokerPagination}
        />
      </Modal>
    </>
  );
}
