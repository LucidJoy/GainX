// ARV
import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./AssetBalances.module.sass";

const items = [
  {
    escrowId: 0,
    apy: "7.46",
    amount: "50.5678",
    tenure: "30",
    insured: "True",
  }
];

// overview page items

const AssetBalances = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.col}>Offer ID</div>
          <div className={styles.col}>APY</div>
          <div className={styles.col}>Amount</div>
          <div className={styles.col}>Tenure</div>
          <div className={styles.col}>Insuared</div>
        </div>
        {items.map((x, index) => (
          <div
            className={styles.row}
          >
            <div className={styles.col}>
              <div className={styles.currency}>
                {/* <div className={styles.icon}>
                  <img src={x.icon} alt="Currency" />
                </div> */}
                <div className={styles.details}>
                  <div className={styles.info}>{`# ${x.escrowId}`}</div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              {x.apy && (
                <div className={cn("category-green", styles.category)}>
                  {`${x.apy} % APY`}
                </div>
              )}
            </div>
            <div className={styles.col}>
              <div className={styles.info}>{`${x.amount} TFil`}</div>
            </div>
            <div className={styles.col}>
              <div className={styles.info}>{`${x.tenure} days`}</div>
            </div>
            <div className={styles.col}>
              <div className={styles.info}>{x.insured}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetBalances;
