// ARV

import React, { useState } from "react";
import cn from "classnames";
import styles from "./WalletMargin.module.sass";
// import { Link } from "react-router-dom";
import Wallet from "../../components/Wallet";
import Main from "./Main";
// import Funds from "../../components/Funds";
import Modal from "../../components/Modal";
// import Transfer from "../../components/Transfer";
// import Borrow from "../../components/Borrow";
import AssetBalances from "../WalletOverview/AssetBalances";

const WalletMargin = () => {
  const [visibleTransfer, setVisibleTransfer] = useState(false);
  const [visibleBorrow, setVisibleBorrow] = useState(false);

  return (
    <>
      <Wallet>
        <Main />

        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.head}>Positions</div>
            <div className={styles.body}>
              <AssetBalances overview={false} borrower={false} lender={true}>
                <button
                  className={cn("button-stroke button-small", styles.button)}
                  onClick={() => setVisibleTransfer(true)}
                >
                  Buy Insurance
                </button>
                <button
                  className={cn("button-stroke button-small", styles.button)}
                  onClick={() => setVisibleBorrow(true)}
                >
                  Redeem
                </button>
                {/* <Link
                  className={cn("button-stroke button-small", styles.button)}
                  to="/exchange"
                >
                  Trade
                </Link> */}
              </AssetBalances>
            </div>
          </div>
        </div>
      </Wallet>
      {/* <Modal
        visible={visibleTransfer}
        onClose={() => setVisibleTransfer(false)}
      >
        <Transfer />
      </Modal> */}
      {/* <Modal visible={visibleBorrow} onClose={() => setVisibleBorrow(false)}>
        <Borrow />
      </Modal> */}
    </>
  );
};

export default WalletMargin;
