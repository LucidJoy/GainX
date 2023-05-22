import React, { useState } from "react";
import cn from "classnames";
import styles from "./AccountBalances.module.sass";
import { Link } from "react-router-dom";
import Icon from "../../Icon";
import Modal from "../../Modal";
import Transfer from "../../../components/Transfer";

const items = [
  {
    title: "Margin",
    color: "#9757D7",
    currency: "0.2785689852 BTC",
    price: "$10,098.36",
  },
  {
    title: "Fiat and Spot",
    color: "#FFD166",
    currency: "0.2785689852 BTC",
    price: "$10,098.36",
  },
  {
    title: "P2P",
    color: "#4BC9F0",
    soon: true,
  },
  {
    title: "Futures",
    color: "#3772FF",
    soon: true,
  },
];

const AccountBalances = () => {
  const [visibleTransfer, setVisibleTransfer] = useState(false);

  return (
    <>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div
            className={cn(styles.item, { [styles.soon]: x.soon })}
            key={index}
          >
            <div className={styles.head}>
              <div className={styles.title}>
                <div
                  className={styles.bg}
                  style={{ backgroundColor: x.color }}
                ></div>
                {x.title}
              </div>
              <div className={styles.details}>
                <div className={styles.currency}>{x.currency}</div>
                <div className={styles.price}>{x.price}</div>
              </div>
            </div>
            <div className={styles.body}>
              {x.soon ? (
                <div className={styles.soon}>Coming soon</div>
              ) : (
                <div className={styles.btns}>
                  <Link
                    className={cn("button-stroke button-small", styles.button)}
                    to='/deposit-fiat'
                  >
                    <span>Deposit</span>
                    <Icon name='arrow-right' size='16' />
                  </Link>
                  <button
                    className={cn("button-stroke button-small", styles.button)}
                    onClick={() => setVisibleTransfer(true)}
                  >
                    Transfer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        visible={visibleTransfer}
        onClose={() => setVisibleTransfer(false)}
      >
        <Transfer />
      </Modal>
    </>
  );
};

export default AccountBalances;
