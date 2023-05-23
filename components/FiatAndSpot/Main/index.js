// ARV
import React, {useContext} from "react";
import cn from "classnames";
import styles from "./Main.module.sass";

import CreateLendContext from "../../../context/LendContext"

const items = [
  {
    title: "Total Value Locked (TVL)",
    content: "100",
    currency: "TFil",
    price: "$450.36",
  },
  {
    title: "Total Borrowings",
    content: "3",
    currency: "Offers",
    price: "",
  },
  {
    title: "Average Tenure",
    content: "5",
    currency: "Months",
    price: "",
  },
  {
    title: "Average APR",
    content: "15.7429",
    currency: "%",
    price: "",
  },
];

const Main = () => {
  const {
    borrowerList
  } = useContext(CreateLendContext);
  return (
    <div className={styles.main}>
      <h4 className={cn("h4", styles.title)}>Borrowings</h4>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.info}>{x.title}</div>
            <div className={styles.line}>
              {x.title == 'Total Borrowings' ? (<div className={styles.currency}>{borrowerList.length}</div>) : (<div className={styles.currency}>{x.content}</div>)}
              <div className={cn("category-green", styles.category)}>
                {x.currency}
              </div>
            </div>
            <div className={styles.price}>{x.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
