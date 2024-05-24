import { FC, memo, useEffect, useMemo, useState } from "react";
import { Category, db } from "../data/db";
import LazyLoad from "react-lazyload";

type ListProps = {
  data: any[];
  search: Category[];
};

const List: FC<ListProps> = ({ data, search }) => {
  return (
    <ul>
      {data.map((item, index) => {
        return (
          <LazyLoad height={3000} key={item.id} placeholder={<>loading</>}>
            <ListItem item={item} search={search} />
          </LazyLoad>
        );
      })}
    </ul>
  );
};

export default memo(List);

const ListItem = memo(
  ({
    item,
    search,
    setParent,
    isChildren,
  }: {
    item: Category;
    search: Category[];
    setParent?: (e: boolean) => void;
    isChildren?: boolean;
  }) => {
    const [children, setChildren] = useState<Category[]>([]);
    const [isParent, setIsParent] = useState<boolean>(false);
    const [hasChildren, setHasChildren] = useState<boolean>(false);
    const color = useMemo(() => {
      const some = search.some((s) => s.id === item.id);
      if (some || isParent) {
        setParent?.(true);
      } else {
        setParent?.(false);
      }

      if (some || isChildren) {
        setHasChildren(true);
      } else {
        setHasChildren(false);
      }

      return some ? "red" : isParent ? "blue" : isChildren ? "pink" : "black";
    }, [search, isParent]);
    
    const getData = async () => {
      const categories = await db.categories
        .where("parent_id")
        .equals(item?.id ?? 0)
        .toArray();
      setChildren(categories);
    };

    useEffect(() => {
      getData();
    }, [item]);

    return (
      <li style={{ color }}>
        {item?.name}
        {children.length > 0 && (
          <ul>
            {children.map((child, index) => {
              return (
                <LazyLoad key={item.id} placeholder={<>loading</>}>
                  <ListItem
                    item={child}
                    key={child.id}
                    search={search}
                    setParent={setIsParent}
                    isChildren={hasChildren}
                  />
                </LazyLoad>
              );
            })}
          </ul>
        )}
      </li>
    );
  }
);
