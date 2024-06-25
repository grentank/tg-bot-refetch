async function testConnection() {
  const res = await fetch(
    "https://heroleague.ru/api/event_format/event/gonka2024_524901_1008"
  );
  const data = await res.json();
  const { values } = data;
  const { tickets_left } = values[0];
  console.log(tickets_left);
}

testConnection()