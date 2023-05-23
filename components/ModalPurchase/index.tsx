import { useState, useEffect, useContext } from "react";
import cn from "classnames";
import styles from "./ModalPurchase.module.sass";
import Modal from "../Modal";
import Icon from "../Icon";

import { numberWithCommas } from "../../utils";

import CreateLendContext from "../../context/LendContext";

import PreviewLoader from "../PreviewLoader";
import Link from "next/link";
import Checkbox from "../Checkbox";

const item = {
  escrowId: "0",
  name: "Shiny APE",
  crypto: "40.7826",
  price: 183.5217,
  location: "Bored Ape Yacht Club",
  tenure: "4"
};

const exchange = 2646.4;

type ModalPurchaseProps = {
  visibleModal: boolean;
  setVisibleModal: (e: boolean) => void;
};

type ModalStatesType = "confirm" | "joy" | "waiting" | "complete" | "error";

type ModalType = {
  setStateModal: (e: ModalStatesType) => void;
};

const Confirm = ({ setStateModal }: ModalType) => (
  <>
    <div className={cn("title", styles.title)}>Confirm purchase</div>
    <div className={styles.info}>
      <div>
        <div className={cn("h6", styles.name)}>{item.name}</div>
        <div className={styles.location}>
          {/* <Icon name='location' size={20} /> */}
          {item.location}
        </div>
      </div>
      <div>
        <div className={cn("h6", styles.crypto)}>{`${item.crypto} TFil`}</div>
        <div className={styles.price}>~ $ {item.price}</div>
      </div>
    </div>
    <div className={styles.exchange}>
      <Icon name='start' />
      Duration
      <div className={styles.value}>{`${item.tenure} months`}</div>
    </div>

    <button
      className={cn("button", styles.confirm)}
      onClick={() => setStateModal("joy")}
    >
      Next
    </button>
    <div className={styles.note}>
      You are accepting this offer and funds will be deducted.
    </div>
  </>
);

const Waiting = ({}) => (
  <div className={cn(styles.waiting, styles.centered)}>
    <PreviewLoader
      className={styles.loader}
      srcImage='/images/content/loader-char.jpg'
    />
    <h5 className={cn("h5", styles.subtitle)}>Waiting for confirmation</h5>
    <div className={styles.text}>
      You are purchasing <span className={styles.red}>{`${item.name}`}</span> for{" "}
      <span className={styles.dark}>{`${item.crypto} ETH`}</span>
    </div>
  </div>
);

const Complete = ({}) => (
  <div className={cn(styles.centered)}>
    <div className={cn(styles.icon, styles.success)}>
      <Icon name='check' size='48' />
    </div>
    <h5 className={cn("h5", styles.subtitle)}>Purchased</h5>
    <div className={styles.text}>Awesome, transaction submitted.</div>
    <Link href='/marketplace'>
      <p className={styles.explore}>
        View on marketplace
        <Icon name='external-link' size='16' />
      </p>
    </Link>
  </div>
);

const Joy = ({ setStateModal }: ModalType) => {
  const [value, setValue] = useState<boolean>(true);
  const [terms, setTerms] = useState<boolean>(true);

  const {acceptOffer} = useContext(CreateLendContext);

  
const handleAcceptOffer = async () => {
  const response = await acceptOffer();
  console.log('Accept offer res💵: ', response);
  
  if (response) setStateModal("complete")
  else setStateModal("error") 
}

  return (
    <div>
      <div
        style={{
          display: "flex",
          color: "white",
          marginTop: "50px",
          justifyContent: "space-between",
          padding: "0px 10px",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            marginRight: "10px",
            fontWeight: 600,
          }}
        >
          Do you want to insure your position?
        </p>
        <Checkbox
          className={styles.item}
          label=''
          value={value}
          setValue={setValue}
        />
      </div>
      <div
        style={{
          display: "flex",
          color: "white",
          marginTop: "20px",
          marginBottom: "20px",
          justifyContent: "space-between",
          padding: "0px 10px",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            marginRight: "10px",
            fontWeight: 600,
          }}
        >
          Terms and Conditions
        </p>
        <Checkbox
          className={styles.item}
          label=''
          value={terms}
          setValue={setTerms}
        />
      </div>
      <button
        className={cn("button", styles.confirm)}
        onClick={() => {
          setStateModal("waiting")
          handleAcceptOffer();
        }}
        style={{ marginBottom: "0px" }}
      >
        Confirm purchase
      </button>
    </div>
  );
};

const Error = ({
  setStateModal,
}: {
  setStateModal: (e: ModalStatesType) => void;
}) => (
  <div className={cn(styles.centered)}>
    <div className={cn(styles.icon, styles.error)}>
      <Icon name='alert' size='40' />
    </div>
    <h5 className={cn("h5", styles.subtitle)}>Something went wrong</h5>
    <div className={styles.text}>Sorry, transaction failed</div>
    <button
      className={cn("button-sm", styles.retry)}
      onClick={() => setStateModal("confirm")}
    >
      Try again
    </button>
  </div>
);

const ModalPurchase = ({
  visibleModal,
  setVisibleModal,
}: ModalPurchaseProps) => {
  const [stateModal, setStateModal] = useState<ModalStatesType>("confirm");
  const [transferModal, setTransferModal] =
    useState<ModalStatesType>(stateModal);
  const [blink, setBlink] = useState<boolean>(false);

  const handleStateModal = (state: ModalStatesType) => {
    setBlink(true);
    setTransferModal(state);
  };

  useEffect(() => setStateModal(transferModal), [transferModal]);

  return (
    <Modal
      visible={visibleModal}
      onClose={() => setVisibleModal(false)}
      blink={blink}
      form={false}
    >
      <div className={styles.wrapper}>
        {
          {
            confirm: <Confirm setStateModal={handleStateModal} />,
            joy: <Joy setStateModal={handleStateModal} />,
            waiting: <Waiting />,
            complete: <Complete />,
            error: <Error setStateModal={handleStateModal} />,
          }[stateModal]
        }
      </div>
    </Modal>
  );
};

export default ModalPurchase;
