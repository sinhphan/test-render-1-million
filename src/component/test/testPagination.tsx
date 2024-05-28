import React, { useEffect, useRef, useState } from "react";
import { Pagination, TreeSelect } from "antd";
const TestPagination: React.FC = () => {
  // data for tree
  const [value, setValue] = useState<string>();
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  // data for search value of tree
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  // data for pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isOpenPopup, setIsOpenPopup] = useState(false);

  // data for search
  const [search, setSearch] = useState<string | undefined>(undefined);

  // for debounce search
  const timerRef = useRef<any>(null);

  const fetchData = async (page = 1, keyword: string) => {
    const response = await fetch(`http://localhost:1111/categories?limit=15&page=${page}&keyword=${keyword}`);
    const data: { total: number; page: number; data: any[]; expandedKeys: any[] } = await response.json();
    // keys for always expanded
    setExpandedKeys([...expandedKeys, ...data.expandedKeys]);

    setTotal(data.total);
    setTreeData(data.data);
  };

  // fetch data when search change or page change
  useEffect(() => {
    if (search) {
      fetchData(page, search);
    }
  }, [search, page]);

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center", paddingTop: "50px" }}>
      <TreeSelect
        showSearch
        style={{ width: "50%" }}
        value={value}
        treeExpandedKeys={expandedKeys}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select"
        allowClear
        multiple
        onChange={(value) => {
          setValue(value);
        }}
        treeNodeFilterProp={"title"}
        onSearch={(value) => {
          // if popup is open and value is not empty then search
          // because we need to set search value to the input
          // ( default behavior when click to pagination input will reset search value)
          if (isOpenPopup && !!value) {
            setSearchValue(value);
            timerRef.current && clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setSearch(value);
            }, 400);
          } else if (!isOpenPopup) {
            setSearchValue(value);
            timerRef.current && clearTimeout(timerRef.current);
            setSearch(value);
          }
        }}
        onSelect={() => {}}
        onDropdownVisibleChange={(open) => {
          setIsOpenPopup(open);

          // when popup is close then reset state
          if (!open) {
            setPage(1);
            setSearch(undefined);
            setTotal(0);
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
    </div>
  );
};

export default TestPagination;
