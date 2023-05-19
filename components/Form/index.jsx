import React from "react";
import styles from "./Form.module.sass";
import cn from "classnames";

const Form = () => {
  return (
    <div className={styles.list_form}>
      <p>Details</p>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <p className={styles.label}>NFT Address:</p>
          <p className={styles.data}>
            0xb53A165f344827da29f7d489F549a197F18528d1
          </p>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>NFT Id:</p>
          <p className={styles.data}>0001</p>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Chain:</p>
          <select
            name='chain'
            id=''
            style={{
              borderRadius: "5px",
              padding: "8px",
              backgroundColor: "transparent",
              color: "#fff",
              border: "1px solid #4c5059",
              width: "175px",
              fontWeight: "bold",
            }}
          >
            <option value=''>Select chain</option>
            <option value='fvm'>FVM Hyperspace</option>
            <option value='polygon'>Polygon Mumbai</option>
          </select>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Owner:</p>
          <p className={styles.data}>
            0xb53A165f344827da29f7d489F549a197F18528d1
          </p>
        </div>

        <div
          className={styles.input}
          style={{
            marginTop: "15px",
            borderTop: "1px solid #4c5059",
            borderBottom: "1px solid #4c5059",
            padding: "8px 0px",
            marginBottom: "15px",
          }}
        >
          <p className={styles.label}>Estimated Amount:</p>
          <p className={styles.data}>20</p>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Tenure (In Months):</p>
          <input className={styles.dataInput} type='number' min={1}></input>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>APY (in %):</p>
          <input className={styles.dataInput} type='number' min={1}></input>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "15px",
        }}
      >
        <button
          className={cn("button")}
          style={{ width: "50%", textAlign: "center" }}
          // onClick={() => setVisiblePurchase(true)}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default Form;
