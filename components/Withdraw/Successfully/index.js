import React from "react";
import cn from "classnames";
import styles from "./Successfully.module.sass";
import Link from "next/link";
import { useRouter } from "next/router";

const items = [
  {
    title: "Status",
    content: "Completed",
    color: "#58BD7D",
  },
  // {
  //   title: "Transaction ID",
  //   content: "0msx836930...87r398",
  // },
  // {
  //   title: "Address",
  //   content: "0xC416...756f05",
  // },
];

const Successfully = () => {
  const router = useRouter();

  return (
    <>
      <div className={styles.successfully}>
        <div className={cn("h2", styles.title)}>
          Yay!{" "}
          <span role='img' aria-label='firework'>
            🎉
          </span>
        </div>
        <div className={styles.info}>
          Your insurance was successfull !
        </div>
        <div className={styles.list}>
          {items.map((x, index) => (
            <div className={styles.item} key={index}>
              <div className={styles.category}>{x.title}</div>
              <div className={styles.content} style={{ color: x.color }}>
                {x.content}
              </div>
            </div>
          ))}
        </div>
        {/* <button
          className={cn("button", styles.button)}
          onClick={() => {
            window.location.reload();
            router.push("/dashboard");
          }}
        >
          Wallet
        </button> */}
      </div>
    </>
  );
};

export default Successfully;
