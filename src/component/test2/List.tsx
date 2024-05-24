import { FC, memo, useMemo } from "react";

type ListProps = {
  item: any;
  search: any[];
};

const List: FC<ListProps> = ({ item, search }) => {
  const color = useMemo(() => {
    const isSearch = search.some((s) => s.id === item.id);
    
    const isParent = search.some((s) => {
      const path = s.path?.split(",");
      const indexOf = path.indexOf(`${item.id}`);
      const res = indexOf != -1 && indexOf < path.indexOf(`${s.id}`);
      return s.parentId === item.id || res;
    });

    const isChildren = search.some((s) => {
      const path = item.path?.split(",");
      const indexOf = path.indexOf(`${s.id}`);
      const res = indexOf != -1 && indexOf < path.indexOf(`${item.id}`);
      return !isParent && (s.id === item.parentId || res);
    });

    return isSearch ? "blue" : isParent ? "pink" : isChildren ? "red" : "black";
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
