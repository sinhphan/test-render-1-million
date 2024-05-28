import React, { useCallback, useEffect, useRef, useState } from "react";
import { TreeSelect } from "antd";
const TestTree: React.FC = () => {
  const [value, setValue] = useState<string>();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const timerRef = useRef<any>(null);

  const fetchData = async (page = 1, keyword: string) => {
    const response = await fetch(`http://localhost:1111/categories?limit=15&page=${page}&keyword=${keyword}`);
    const data: { total: number; page: number; data: any[]; expandedKeys: any[] } = await response.json();
    setExpandedKeys([...expandedKeys, ...data.expandedKeys]);
    setTreeData([...treeData, ...data.data]);
  };
  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (search) {
      fetchData(page, search);
    }
  }, [search, page]);

  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      value={value}
      treeExpandedKeys={expandedKeys}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Please select"
      allowClear
      multiple
      onChange={onChange}
      treeNodeFilterProp={"title"}
      onSearch={(value) => {
        timerRef.current && clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setSearch(value);
        }, 400);
      }}
      onSelect={() => {}}
      onDropdownVisibleChange={(open) => {
        if (!open) {
          setPage(1);
          setTreeData([]);
        }
      }}
      autoClearSearchValue={false}
      treeData={treeData}
      onPopupScroll={(e: any) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight) {
          setPage(page + 1);
        }
      }}
    />
  );
};

export default TestTree;
