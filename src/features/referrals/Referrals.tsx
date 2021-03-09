import React, { useRef } from "react";
import {} from "./referralsSlice";
import styles from "./Referrals.module.css";
import Modal from "components/Modal";
import { useModal, useCheckReferralType } from "hooks";
import ReferralForm from "./ReferralForm";

type Props = {};

export function Referrals(props: Props) {
  //Get referralType
  const referralType = useCheckReferralType();
  //Get modal controls
  const { hideModal, openModal, isVisible } = useModal();
  const returnFocus = useRef(null);

  return (
    <>
      <nav>{referralType}</nav>
      <header>emails sent, conversions, your earnings</header>
      <main>
        <input placeholder={"search"}></input>
        <button ref={returnFocus} onClick={openModal}>
          add referral
        </button>
        table
      </main>
      <Modal
        hideModal={hideModal}
        isVisible={isVisible}
        returnFocus={returnFocus}
      >
        <ReferralForm referralType={referralType} />
      </Modal>
    </>
  );
}
