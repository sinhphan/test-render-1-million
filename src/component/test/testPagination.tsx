import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pagination, TreeSelect } from "antd";
const TestPagination: React.FC = () => {
  const [value, setValue] = useState<string>();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const timerRef = useRef<any>(null);

  const fetchData = async (page = 1, keyword: string) => {
    const response = await fetch(`http://localhost:1111/categories?limit=15&page=${page}&keyword=${keyword}`);
    const data: { total: number; page: number; data: any[]; expandedKeys: any[] } = await response.json();
    setExpandedKeys([...expandedKeys, ...data.expandedKeys]);
    setTotal(data.total);
    setTreeData(data.data);
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
        if (isOpenPopup && !!value) {
          setSearchValue(value);
          timerRef.current && clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setSearch(value);
          }, 400);
        } else if (!isOpenPopup) {
          setSearchValue(value);
          timerRef.current && clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setSearch(value);
          }, 400);
        }
      }}
      onSelect={() => {}}
      onDropdownVisibleChange={(open) => {
        setIsOpenPopup(open);
        if (!open) {
          setPage(1);
          setSearch(undefined);
          setTreeData([]);
        }
      }}
      searchValue={searchValue}
      autoClearSearchValue={false}
      treeData={treeData}
      dropdownRender={(menu) => {
        return (
          <div>
            {menu}
            <div style={{ padding: "10px" }}>
              <Pagination
                defaultCurrent={1}
                total={total}
                pageSize={15}
                onChange={(page) => {
                  setPage(page);
                }}
                current={page}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default TestPagination;
