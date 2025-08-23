import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);

  // 📌 ดึงข้อมูลทั้งหมดจาก backend
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/tests");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 📌 ฟังก์ชันส่งข้อมูลไป backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await res.json();
      console.log(result);
      setName("");
      setEmail("");
      fetchData(); // โหลดข้อมูลใหม่หลังเพิ่มเสร็จ
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>📌 เพิ่มข้อมูลใหม่</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
          ➕ เพิ่มข้อมูล
        </button>
      </form>

      <h3>📋 ข้อมูลทั้งหมด</h3>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.name} - {item.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
