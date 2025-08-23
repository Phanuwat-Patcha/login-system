import React, { useState } from "react";

function App() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nickname: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 📌 เปลี่ยนเป็น relative path
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("สมัครสำเร็จ:", result);
        setStep(3); // ไปหน้า Success
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>สมัครสมาชิก</h2>

      {/* STEP 1: Email + Password */}
      {step === 1 && (
        <form onSubmit={handleNext}>
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
            ต่อไป ➡️
          </button>
        </form>
      )}

      {/* STEP 2: ข้อมูลส่วนตัว */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="ชื่อจริง"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="lastName"
            placeholder="นามสกุล"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="nickname"
            placeholder="ชื่อเล่น"
            value={formData.nickname}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="เบอร์โทร"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
            ✅ สมัครสมาชิก
          </button>
        </form>
      )}

      {/* STEP 3: Success */}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "20px", color: "green" }}>
          <h3>🎉 สมัครบัญชีสำเร็จแล้ว!</h3>
          <p>ยินดีต้อนรับ {formData.firstName} {formData.lastName}</p>
        </div>
      )}
    </div>
  );
}

export default App;
