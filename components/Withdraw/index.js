import React, { useState, useContext } from "react";
import cn from "classnames";
import styles from "./Withdraw.module.sass";
import Icon from "../Icon";
import TextInput from "../TextInput";
// import Checkbox from "../Checkbox";
import Successfully from "./Successfully";

import CreateLendContext from "../../context/LendContext";

const Withdraw = () => {
  const {
    buyInsurance
  } = useContext(CreateLendContext);

  const [save, setSave] = useState(true);
  const [visibleWithdraw, setVisibleWithdraw] = useState(true);
  const [visibleSuccessfully, setVisibleSuccessfully] = useState(false);

  const handleClick = async () => {
    const response = await buyInsurance();
    console.log('Response to buy insurance: ', response);
    setVisibleWithdraw(false);
    setVisibleSuccessfully(true);
  };

  return (
    <>
      {visibleWithdraw && (
        <div className={styles.withdraw}>
          <div className={cn("h4", styles.title)}>
            <Icon name='arrow-left' size='32' />
            Insurance
          </div>
          <TextInput
            className={styles.field}
            label='Offer Id'
            name='address'
            type='text'
            placeholder='Enter offer ID'
            note=''
            required
          />

          <button
            className={cn("button", styles.button)}
            onClick={() => handleClick()}
          >
            Buy
          </button>
        </div>
      )}
      {visibleSuccessfully && <Successfully />}
    </>
  );
};

export default Withdraw;
