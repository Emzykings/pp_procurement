import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import logoIcon from "../asset/price.png";
import { NavLink } from "react-router-dom";
import axios from "axios";

const SideBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://spiritual-anglerfish-sodbridge.koyeb.app/api/procurement-officer/register/",
        userData
      );
      console.log(response.data);
      message.success("User registered successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error registering user:", error);
      console.log("Server Response:", error.response); 
      if (error.response && error.response.status === 400) {
        const { data } = error.response;
        const errorMessage = Object.keys(data)
          .map(key => `${key}: ${data[key][0]}`)
          .join('\n');
        message.error(errorMessage);
      } else {
        message.error("Failed to register user");
      }
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <>
      <div className="w-[20%] bg-[#c2c20c34] text-[#fff] flex flex-col gap-10 px-[14px] py-[20px]">
        <div className="flex items-center gap-2 border-b-[2px] pb-[5px] border-b-[#fff]">
          <img src={logoIcon} alt={logoIcon} />
          <p className="text-[#000 text-[25px] font-[700]">Pricepally</p>
        </div>
        <ul className="flex flex-col gap-4">
          <NavLink to="/orders">
            <li>All Orders</li>
          </NavLink>
          <NavLink to="/users">
            <li>Users</li>
          </NavLink>
          <li>
            <button onClick={showModal}>Add Officer</button>
          </li>
        </ul>
        <Modal
          title="Add User"
          visible={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <div className="flex flex-col gap-3">
            <Input
              placeholder="User Name"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
            <Input
              placeholder="User Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <Input
              placeholder="User Password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SideBar;
