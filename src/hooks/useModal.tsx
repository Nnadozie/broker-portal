import { RefObject, useState } from "react";

export default function useModal() {
  const [isVisible, setIsVisible] = useState(false);

  const hideModal = (event, ref: RefObject<HTMLInputElement>) => {
    event.preventDefault();
    setIsVisible(false);
    if (ref.current) ref.current.focus();
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsVisible(true);
  };

  return {
    hideModal,
    openModal,
    isVisible,
  };
}
