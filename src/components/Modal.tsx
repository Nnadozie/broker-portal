import React, { RefObject } from "react";

type Props = {
  hideModal: (event, ref) => void;
  isVisible: boolean;
  returnFocus: RefObject<HTMLInputElement>;
  children: any;
};

const Modal = (props: Props) => {
  const { hideModal, isVisible, returnFocus } = props;

  return (
    <div
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        position: "fixed",
        left: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        display: isVisible ? "flex" : "none",
      }}
    >
      <div
        className={"sm-w-100 md-w-50"}
        style={{ backgroundColor: "white", margin: "2rem", padding: "2rem" }}
      >
        <button className={"btn"} onClick={(e) => hideModal(e, returnFocus)}>
          Close me
        </button>
        <section>{props.children}</section>
      </div>
    </div>
  );
};

export default Modal;
