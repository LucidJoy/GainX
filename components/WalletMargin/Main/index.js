// ARV
import React from "react";
import cn from "classnames";
import styles from "./Main.module.sass";

const Main = () => {
  return (
    <div className={styles.main}>
      <h4 className={cn("h4", styles.title)}>Lendings</h4>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.info}>Total lended (in TFil)</div>
          <div className={styles.currency}>
            <div className={styles.number}>109.2789</div>
            <div className={cn("category-green", styles.category)}>15%</div>
          </div>
          <div className={styles.price}>$491.7551</div>
        </div>
        <div className={cn(styles.item, styles.flex)}>
          <div className={styles.chart}>
            <img src='/images/content/chart.svg' alt='Chart' />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>Total insuared</div>
            <div className={styles.currency}>
              <div className={styles.number}>3</div>
              <div className={cn("category-green", styles.category)}>
                LOW RISK
              </div>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.stage}>Average APY</div>
          <div className={styles.currency}>
            <div className={styles.number}>15.7439</div>
            <div
              className={cn("category-gray", styles.category)}
              style={{ background: "#353945" }}
            >
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
