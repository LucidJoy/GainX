import { useState } from "react";
import styles from "./Parameters.module.sass";
import cn from "classnames";
import Image from "../../Image";
import Icon from "../../Icon";
import { shortenAddress } from "../../../utils/shortenAddr";

type ParametersType = {
  label: string;
  title?: string;
  content?: string;
  image?: string;
  icon?: string;
  color?: string;
  avatars?: Array<string>;
};

type ParametersProps = {
  className?: string;
  parameters: ParametersType[];
  activeObject?: any;
};

const Parameters = ({
  parameters,
  className,
  activeObject,
}: ParametersProps) => (
  <div className={cn(styles.parameters, className)}>
    <div
      className={styles.parameter}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className={styles.label} style={{ display: "block" }}>
        Owner Address
      </div>

      <div className={styles.title}>
        {shortenAddress(activeObject.borrower)}
      </div>
      {/* {parameter.avatars ? (
          <div className={styles.avatars}>
            {parameter.avatars.map((avatar, index) => (
              <div className={styles.avatar} key={index}>
                <Image src={avatar} width={48} height={48} alt='Avatar' />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.line}>
            <div
              className={styles.preview}
              style={{ backgroundColor: parameter.color }}
            >
              {parameter.image && (
                <Image
                  src={parameter.image}
                  width={48}
                  height={48}
                  alt='Avatar'
                />
              )}
              {parameter.icon && <Icon name={parameter.icon} />}
            </div>
            <div className={styles.details}>
              <div className={styles.title}>
                {shortenAddress(activeObject.borrower)}
              </div>
              <div className={styles.content}>{parameter.content}</div>
            </div>
          </div>
        )} */}
    </div>
  </div>
);

export default Parameters;
