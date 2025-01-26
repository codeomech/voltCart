// components/ModalProvider.tsx
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { createContext, useContext, useState } from "react";
import React from "react";
import LoginDialog from "@/components/shopping-view/login";
import RegisterDialog from "@/components/shopping-view/register";

export const MODAL_TYPES = {
  LOGIN_MODAL: "LOGIN_MODAL",
  REGISTER_MODAL: "REGISTER_MODAL",
};

// Create a context for global modal management [2]
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(MODAL_TYPES.LOGIN_MODAL); // [2]
  const [modalProps, setModalProps] = useState({}); // [2]
  // Function to open a modal with a specific type and props [2]
  const openModal = (type, props = {}) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  };

  // Function to close the modal [2]
  const closeModal = () => {
    setIsOpen(false);
    setModalProps({}); // Reset modal props on close
  };

  // Render the correct modal component based on the type [2]
  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPES.LOGIN_MODAL:
        return (
          <LoginDialog
            openModal={openModal}
            closeModal={closeModal}
            {...modalProps}
          />
        );
      case MODAL_TYPES.REGISTER_MODAL:
        return (
          <RegisterDialog
            openModal={openModal}
            closeModal={closeModal}
            {...modalProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[250px]  md:max-w-[400px]">
          {renderModal()}
        </DialogContent>
        <DialogClose />
        {children}
      </Dialog>
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext); // [2]
export default ModalProvider;
