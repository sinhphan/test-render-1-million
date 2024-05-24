import React, { useEffect, useState, useRef, useCallback } from "react";
import List from "./List";
import LazyLoad from "react-lazyload";

const Test3 = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const timerRef = useRef<any>(null);

  const fetchData = async (limit = 200, page = 1) => {
    const response = await fetch(`http://localhost:3000/categories?limit=${limit}&page=${page}`);
    const data = await response.json();
    setList((pre) => {
      return [...pre, ...data];
    });
  };

  const searchData = async (search: string) => {
    const response = await fetch(`http://localhost:3000/categories/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search }),
    });
    const data = await response.json();
    setSearch(data);
  };

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    fetchData(200, page);
  }, [page]);

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, [handleObserver]);

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
              searchData(e.target.value);
            }, 400);
          }}
        />
      </div>
      <div
        style={{
          paddingTop: "50px",
        }}
      ></div>
      <div style={{ height: "600px", overflow: "auto" }}>
        {list &&
          list.map((item: any) => {
            return (
              <LazyLoad key={item.id} overflow>
                <List key={item.id} item={item} search={search} />
              </LazyLoad>
            );
          })}
        <div ref={loader}>
          <h2>Loading More...</h2>
        </div>
      </div>
    </div>
  );
};

export default Test3;
