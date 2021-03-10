import React, { useRef } from "react";
import styles from "./Referrals.module.css";
import Modal from "components/Modal";
import { useModal, useReferrals } from "hooks";
import ReferralForm from "./ReferralForm";
import * as queries from "apollo/queries";
import { useQuery } from "@apollo/client";
import ReferralRow from "./ReferralRow";
import { Link } from "react-router-dom";
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
      <nav>
        <Link to={routes.referrals.client}>Client Referrals</Link>{" "}
        <Link to={routes.referrals.agent}>Broker/Agent Referrals</Link>
      </nav>
      <header>
        emails sent: {data?.users.total || "..."}, conversions: 0, your
        earnings: ${data?.users.total * 50 || "..."}
      </header>
      <main>
        <input placeholder={"search"}></input>
        <button ref={returnFocus} onClick={openModal}>
          add referral
        </button>
        {loading && <h2>Loading...</h2>}
        {error && (
          <p>An error occurred while fetching your data. Please try again.</p>
        )}
        {data?.users.data.map(({ id }: { id: string }) => {
          return <ReferralRow id={id} referralType={referralType} key={id} />;
        })}
      </main>
      <footer>
        <button
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
        <p>
          {referralType === "client"
            ? clientPagination.page + 1
            : brokerPagination.page - 9}
        </p>
        <button
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
