import { FC, memo, useMemo } from "react";

type ListProps = {
  item: any;
  search?: string;
};

const List: FC<ListProps> = ({ item }) => {
  const color = useMemo(() => {
    return item.isSearch ? "blue" : "#000";
  }, [item]);

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
