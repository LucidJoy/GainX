import React, {useContext} from "react";
import cn from "classnames";
import styles from "./TextInput.module.sass";
import Icon from "../Icon";

import CreateLendContext from "../../context/LendContext";

const TextInput = ({
  className,
  classLabel,
  classInput,
  label,
  empty,
  view,
  icon,
  note,
  placeholder,
  ...props
}) => {
  const {
    setOfferId
  } = useContext(CreateLendContext);

  return (
    <div
      className={cn(
        styles.field,
        { [styles.empty]: empty },
        { [styles.view]: view },
        { [styles.icon]: icon },
        className
      )}
    >
      {label && <div className={cn(classLabel, styles.label)}>{label}</div>}
      <div className={styles.wrap}>
        <input
          className={cn(classInput, styles.input)}
          {...props}
          placeholder={placeholder}
          onChange={(e) => setOfferId(e.target.value)}
        />
        {view && (
          <button className={styles.toggle}>
            <Icon name='eye' size='24' />
          </button>
        )}
        {icon && (
          <div className={styles.preview}>
            <Icon name={icon} size='24' />
          </div>
        )}
        {note && <div className={styles.note}>{note}</div>}
      </div>
    </div>
  );
};

export default TextInput;
