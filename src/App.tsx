import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Category, db } from "./data/db";
import List from "./component/List";
function App() {
  const [data, setData] = useState<Category[]>([]);
  const [search, setSearch] = useState<Category[]>([]);
  const timerRef = useRef<any>(null);
  const handleAdd = async () => {
    for (let i = 0; i < 100; i++) {
      await db.categories.add({ name: `Category ${i}`, parent_id: null });
      console.log(`Added category ${i}`);
    }
  };

  const handleAddChildren = async () => {
    let id = 1;
    for (let i = 100; i < 1000000; i++) {
      await db.categories.add({
        name: `Category ${i}`,
        parent_id: id,
      });
      if (i != 1 && i % 10 == 0) {
        id += 1;
      }
      console.log(`Added category ${i}`);
    }
  };

  const getData = async () => {
    const categories = await db.categories.offset(1).limit(100).toArray();
    setData(categories);
  };

  const searchData = async (search: string) => {
    timerRef.current && clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const categories = await db.categories.where("name").startsWith(search).toArray();
      setSearch(categories);
    }, 400);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div style={{ position: "fixed", left: "300px" }}>
        <input
          type="text"
          onChange={(e) => {
            searchData(e.currentTarget.value);
          }}
        />
      </div>
      <button onClick={handleAdd}>Add data</button>
      <button onClick={handleAddChildren}>Add children data</button>
      <List data={data} search={search} />
    </div>
  );
}

export default App;
