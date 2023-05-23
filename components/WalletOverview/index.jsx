// ARV

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import cn from "classnames";
import styles from "./WalletOverview.module.sass";
import Wallet from "../Wallet";
// import Icon from "../../components/Icon";
// import Dropdown from "../../components/Dropdown";
// import AccountBalances from "./AccountBalances";
import AssetBalances from "./AssetBalances";
// import Integrations from "./Integrations";

const optionsCurrency = ["USD", "EUR", "RUB"];
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const WalletOverview = () => {
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState(optionsCurrency[0]);

  const handleSubmit = (e) => {
    alert();
  };

  return (
    <Wallet>
      <div className={styles.top}>
        <div className={styles.line}>
          <h4 className={cn("h4", styles.title)}>Overview</h4>
          <div className={styles.wrap}>
            {/* <form
              className={styles.form}
              action=""
              onSubmit={() => handleSubmit()}
            >
              <input
                className={styles.input}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Search coin"
                required
              />
              <button className={styles.result}>
                <Icon name="search" size="20" />
              </button>
            </form> */}
            {/* <Dropdown
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={currency}
              setValue={setCurrency}
              options={optionsCurrency}
            /> */}
            <div
              style={{
                background: "#E45F35",
                color: "#23262F",
                fontSize: "16px",
                padding: "0 16px",
                height: "40px",
                borderRadius: "20px",
                fontWeight: 700,
                paddingTop: "7px"
              }}
            >
              Score: 1124
            </div>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.info}>Total Earnings (in TFil)</div>
          <div className={styles.currency}>
            <div className={styles.number}>109.2789</div>
            <div className={cn("category-green", styles.category)}>15%</div>
          </div>
          <div className={styles.price}>$491.7551</div>
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.item}>
          {/* <div className={styles.head}>Account Balances</div> */}
          <div className={styles.body}>{/* <AccountBalances /> */}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.head}>Positions</div>
          <div className={styles.body}>
            <AssetBalances overview={true} borrower={false} lender={false}/>
          </div>
        </div>
        <div className={styles.item}>
          {/* <div className={styles.head}>Integrations</div> */}
          <div className={styles.body}>{/* <Integrations /> */}</div>
        </div>
      </div>
    </Wallet>
  );
};

export default WalletOverview;
