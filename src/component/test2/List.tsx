import { FC, memo, useMemo } from "react";

type ListProps = {
  item: any;
  search: any[];
};

const List: FC<ListProps> = ({ item, search}) => {
  const color = useMemo(() => {
    const isSearch = search.some((s) => s.id === item.id);
    const isParent = search.some((s) => s.parentId === item.id);
    const isChildren = search.some((s) => s.id === item.parentId)
    return isSearch ? "blue" : isParent ? "pink": isChildren ? "red" : "black";
  }, [search]);

  return (
    <div
      style={{
        marginLeft: item.depth * 30 + "px",
        color: color,
      }}
    >
      {item.name}
    </div>
  );
};

export default memo(List);
