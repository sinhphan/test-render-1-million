import { useEffect, useState, useRef } from "react";
import List from "./List";
import { Pagination } from "antd";

const Test3 = () => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [res, setRes] = useState<{ total: number; page: number; data: any[] }>({
    total: 0,
    page: 1,
    data: [],
  });
  const timerRef = useRef<any>(null);

  const fetchData = async (page = 1) => {
    const response = await fetch(`http://localhost:1111/categories?limit=15&page=${page}&keyword=${search}`);
    const data = await response.json();
    setRes(data);
  };

  useEffect(() => {
    if (search) {
      fetchData();
    }
  }, [search]);

  return (
    <div>
      <div
        style={{
          position: "fixed",
          padding: "10px",
        }}
      >
        <input
          type="text"
          onChange={(e) => {
            timerRef.current && clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setSearch(e.target.value);
            }, 400);
          }}
        />
      </div>
      <div
        style={{
          paddingTop: "50px",
        }}
      ></div>
      <div>
        <div style={{ padding: "10px" }}>
          <Pagination
            defaultCurrent={1}
            total={res.total}
            pageSize={30}
            onChange={(page) => {
              fetchData(page);
            }}
            current={res.page}
          />
        </div>
        <div>
          {res.data.length > 0 &&
            res.data.map((item: any) => {
              return <List key={item.id} item={item} search={search} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Test3;
