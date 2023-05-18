import cn from "classnames";
import styles from "./PageMarketplace.module.sass";
import Image from "../Image";
import Item from "./Item";

import { marketplaceCounter, marketplace } from "../../mocks/marketplace";
import { numberWithCommas } from "../../utils";
import Catalog from "../Catalog";
// import JoinCommunity from "../JoinCommunity";

import { sortingMarket } from "../../mocks/sortingCatalog";

type MainProps = {};

const Main = ({}: MainProps) => (
  <>
    <div className={styles.main} style={{ marginTop: "-45px" }}>
      <Catalog value={sortingMarket} filters />
    </div>
    {/* <JoinCommunity /> */}
  </>
);

export default Main;
