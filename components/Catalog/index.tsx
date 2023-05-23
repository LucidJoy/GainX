import { useEffect, useState, useContext } from "react";
import cn from "classnames";
import styles from "./Catalog.module.sass";
import List from "./List";
import { useRouter } from "next/router";
// import Filters from "./Filters";
import Wishlist from "./Wishlist";
import CreateLendContext from "../../context/LendContext";

import { characters } from "../../mocks/characters";
import { planets } from "../../mocks/planets";
import { items } from "../../mocks/items";
import { bundles } from "../../mocks/bundles";

const sortDropdown: Array<string> = ["All", "On sale"];

type ListProps = {
  className?: string;
  value: any[];
  filters?: boolean;
  sort?: boolean;
  crop?: boolean;
  wishlist?: boolean;
  saleItem?: boolean;
};

type AllListType = {
  allListings?: any[];
};

const Catalog = ({
  className,
  value,
  filters,
  sort,
  crop,
  wishlist,
  saleItem,
}: ListProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dropdown, setDropdown] = useState<string>(sortDropdown[0]);
  const [search, setSearch] = useState("");

  const handleSubmit = () => alert();

  const router = useRouter();

  const { allListings }: AllListType = useContext(CreateLendContext);

  return (
    <>
      <div className={cn(styles.catalog, className)}>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <p className={styles.heading}>
              {router.pathname === "/marketplace" ? "Marketplace" : "My NFTs"}
            </p>
            {/* {wishlist ? (
              <Wishlist value={activeIndex} />
            ) : (
              {
                0: <List items={characters} crop={crop} saleItem={saleItem} />,
                1: <List items={planets} crop={crop} saleItem={saleItem} />,
                2: <List items={items} crop={crop} saleItem={saleItem} />,
                3: (
                  <List
                    items={bundles}
                    bigPreview
                    col2
                    saleItem={saleItem}
                    crop={crop}
                  />
                ),
              }[activeIndex]
            )} */}
            <List
              offers={allListings}
              items={characters}
              crop={crop}
              saleItem={saleItem}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;
