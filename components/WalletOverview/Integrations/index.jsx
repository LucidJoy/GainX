import React, { useState } from "react";
import cn from "classnames";
import styles from "./Integrations.module.sass";
import Icon from "../../Icon";

const Integrations = () => {
  const [integrations1, setIntegrations1] = useState(false);
  const [integrations2, setIntegrations2] = useState(true);
  const [integrations3, setIntegrations3] = useState(false);
  const [integrations4, setIntegrations4] = useState(false);

  const items = [
    {
      title: "Tokocrypto",
      content:
        "Trade with Indonesian rupiah. Deposit and withdraw instantly with direct bank transfer.",
      name: "integrations1",
      value: integrations1,
      setValue: setIntegrations1,
    },
    {
      title: "WazirX",
      content:
        "Trade with WazirX. Deposit and withdraw instantly with direct bank transfer.",
      name: "integrations2",
      value: integrations2,
      setValue: setIntegrations2,
    },
    {
      title: "Poloniex",
      content:
        "Trade with Poloniex. Deposit and withdraw instantly with direct bank transfer.",
      name: "integrations3",
      value: integrations3,
      setValue: setIntegrations3,
    },
    {
      title: "Binance",
      content:
        "Trade with Binance. Deposit and withdraw instantly with direct bank transfer.",
      name: "integrations4",
      value: integrations4,
      setValue: setIntegrations4,
    },
  ];

  return (
    <div className={styles.list}>
      {items.map((x, index) => (
        <div className={styles.item} key={index}>
          <div className={styles.head}>
            <div className={styles.title}>{x.title}</div>
            <div className={styles.content}>{x.content}</div>
          </div>
          <div className={styles.body}>
            <label className={styles.radio}>
              <input
                className={styles.input}
                type='radio'
                name={x.name}
                onChange={() => x.setValue(true)}
                checked={x.value}
              />
              <span className={styles.inner}>
                <span className={styles.line}>
                  <Icon name='line-dots' size='16' />
                  <span className={styles.text}>
                    <span>Active</span>
                    <span>Inactive</span>
                  </span>
                </span>
              </span>
            </label>
            <label className={styles.radio}>
              <input
                className={styles.input}
                type='radio'
                name={x.name}
                onChange={() => x.setValue(false)}
                checked={!x.value}
              />
              <span className={styles.inner}>
                <span
                  className={cn("button-stroke button-small", styles.button)}
                >
                  <span className={styles.text}>
                    <span>Active</span>
                    <span>Deactive</span>
                  </span>
                </span>
              </span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Integrations;
