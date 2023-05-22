import React, { useState, useContext } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Link from "next/link";
import cn from "classnames";
import styles from "./Settings.module.sass";
import NavLink from "../../NavLink";
import Icon from "../../Icon";
import Image from "../../Image";
import Theme from "../../Theme";
import Modal from "../../Modal";
import Form from "../../Form";
import CreateLendContext from "../../../context/LendContext";

type LinksType = {
  title: string;
  icon: string;
  divider?: boolean;
  url: string;
};

type SettingsProps = {
  className?: string;
  items: LinksType[];
};

const Settings = ({ items, className }: SettingsProps) => {
  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState<boolean>(false);

  const { listClicked, setListClicked } = useContext(CreateLendContext);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(styles.settings, className, {
          [styles.active]: visible,
        })}
      >
        <button
          className={cn(styles.head, styles.active)}
          onClick={() => setVisible(!visible)}
        >
          <Image
            src='/images/content/avatars/avatar-7.png'
            width={32}
            height={32}
            alt='Avatar'
          />
        </button>
        <div className={styles.body}>
          {/* <Link href='/user-profile'> */}
            <div className={styles.top}>
              <div className={styles.details}>
                <div className={cn("title", styles.user)}>Arv</div>
                <div className={styles.login}>@arv31</div>
              </div>
              <div className={styles.arrow}>
                <Icon name='arrow-next' />
              </div>
            </div>
          {/* </Link> */}
          <div className={styles.list}>
            {items.map((x, index) => (
              <NavLink
                className={cn(styles.link, {
                  [styles.divider]: x.divider,
                })}
                activeClassName={styles.active}
                href={x.url}
                onClick={() => setVisible(!visible)}
                key={index}
              >
                <div className={styles.icon}>
                  <Icon name={x.icon} />
                </div>
                {x.title}
                <div className={styles.arrow}>
                  <Icon name='arrow-next' />
                </div>
              </NavLink>
            ))}
          </div>
          <div className={styles.control}>
            <Theme className={styles.theme} />
            <div
              className={cn("button-sm", styles.button)}
              onClick={() => setListClicked(!listClicked)}
            >
              <span>List</span>
              <Icon name='arrow-right' size='16' />

              <Modal
                visible={listClicked}
                onClose={() => setListClicked(false)}
                blink={blink}
                form
              >
                <Form profile />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Settings;
