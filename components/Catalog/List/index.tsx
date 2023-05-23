import styles from "./List.module.sass";
import cn from "classnames";
import Card from "../../Card";
import Loader from "../../Loader";
import AppendCard from "./AppendCard";

import { ItemsType } from "../../../types";

type ListProps = {
  className?: string;
  items: ItemsType[];
  bigPreview?: boolean;
  col2?: boolean;
  crop?: boolean;
  saleItem?: boolean;
  offers?: [];
};

type Item = {
  escrowId: number;
  // other properties
};

type Offer = {
  escrowId: number;
  // other properties
};

const List = ({
  className,
  items,
  bigPreview,
  col2,
  crop,
  saleItem,
  offers,
}: ListProps) => {
  const list = crop ? items.slice(0, 2) : items;

  return (
    <>
      <div className={cn(styles.list, { [styles.list_2]: col2 }, className)}>
        {offers.map((offer: Offer, index) => {
          let x = items[Number(offer?.escrowId)];

          return (
            <Card
              className={styles.card}
              item={x}
              key={index + Date.now()}
              bigPreview={bigPreview}
              saleItem={saleItem}
              offer={offer}
            />
          );
        })}

        {crop && <AppendCard className={styles.card} />}
      </div>
      {/* {!crop && (
        <div className={styles.btns}>
          <button className={cn("button-stroke", styles.button)}>
            <Loader className={styles.loader} />
            Load more
          </button>
        </div>
      )} */}
    </>
  );
};

export default List;
