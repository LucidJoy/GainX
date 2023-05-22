// ARV

import React, { useState } from "react";
import cn from "classnames";
import styles from "./WalletOverview.module.sass";
import Wallet from "../Wallet";
// import Icon from "../../components/Icon";
// import Dropdown from "../../components/Dropdown";
// import AccountBalances from "./AccountBalances";
import AssetBalances from "./AssetBalances";
// import Integrations from "./Integrations";

const optionsCurrency = ["USD", "EUR", "RUB"];

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
            <button className={cn("button-black button-small", styles.button)}>
              Score: 1124
            </button>
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
            <AssetBalances />
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
