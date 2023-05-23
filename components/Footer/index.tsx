import Link from "next/link";
import styles from "./Footer.module.sass";
import cn from "classnames";

import { NavigationListFooter, LegalList } from "../../constants/navigation";

type FooterProps = {
  className?: string;
};

const Footer = ({ className }: FooterProps) => (
  <div className={cn(className, styles.footer)}>
    <div className='container-xl'>
      <div className={styles.body}>
        <div className={styles.menu}>
          {NavigationListFooter.map((link, index) => (
            <Link href={link.url} key={index}>
              <p className={styles.link}>{link.title}</p>
            </Link>
          ))}
        </div>
        <Link href='/'>
          <div className={cn("button-stroke button-sm", styles.button)}>
            Home
          </div>
        </Link>
      </div>
      <div className={styles.foot}>
        <div className={styles.copyright}>© 2023 GainX</div>
        <div className={styles.list} style={{ display: "flex" }}>
          {LegalList.map((link, index) => (
            <div key={index}>
              <p className={styles.link}>{link.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
