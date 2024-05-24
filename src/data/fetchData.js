function createData(id, depth, parentId, parent) {
  let children = [];
  if (depth < 4) {
    for (let i = 0; i < 10; i++) {
      children.push(createData(id * 100 + i, depth + 1, id, parent));
    }
  }
  const data = {
    id: id,
    name: `name ${id}`,
    description: `description ${id}`,
    children: children,
    parentId: parentId,
    parent: parent,
  };
  id++;
  return data;
}

function getData(from, to) {
  let data = [];
  for (let i = from; i < to; i++) {
    data.push(createData(i, 0, -1, null));
  }
  const res = JSON.stringify(data);
  return res;
}

getData(1, 10);
