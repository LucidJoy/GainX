// ARV
import React, { useState } from "react";
import cn from "classnames";
import styles from "./FiatAndSpot.module.sass";
import { Link } from "react-router-dom";
import Wallet from "../../components/Wallet";
import Main from "./Main";
// import Funds from "../../components/Funds";
// import Modal from "../../components/Modal";
// import Withdraw from "../Withdraw";
import AssetBalances from "../WalletOverview/AssetBalances";

const FiatAndSpot = () => {
  const [visibleWithdraw, setVisibleWithdraw] = useState(false);

  return (
    <>
      <Wallet>
        <Main />
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.head}>Positions</div>
            <div className={styles.body}>
              <AssetBalances overview={false} borrower={true} lender={false}>
                <Link
                  className={cn("button-stroke button-small", styles.button)}
                  to='/buy-crypto'
                >
                  Buy
                </Link>
                <Link
                  className={cn("button-stroke button-small", styles.button)}
                  to='/deposit-fiat'
                >
                  Deposit
                </Link>
                <button
                  className={cn("button-stroke button-small", styles.button)}
                  onClick={() => setVisibleWithdraw(true)}
                >
                  Withdraw
                </button>
                <Link
                  className={cn("button-stroke button-small", styles.button)}
                  to='/exchange'
                >
                  Trade
                </Link>
              </AssetBalances>
            </div>
          </div>
        </div>
      </Wallet>
      {/* <Modal
        visible={visibleWithdraw}
        onClose={() => setVisibleWithdraw(false)}
      >
        <Withdraw />
      </Modal> */}
    </>
  );
};

export default FiatAndSpot;
