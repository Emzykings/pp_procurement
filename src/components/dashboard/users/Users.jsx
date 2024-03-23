import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { NavLink } from "react-router-dom/dist";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve token from localStorage
        const storedData = localStorage.getItem("userData");
        if (!storedData) {
          throw new Error("User data not found in localStorage");
        }
        const { token } = JSON.parse(storedData);

        // Perform GET request with Authorization header
        const response = await fetch(
          "https://spiritual-anglerfish-sodbridge.koyeb.app/api/users/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUserData(userData);
        console.log(userData);
      } catch (error) {
        console.error("Error:", error);
        // Handle errors here, e.g., set an error state
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div>
          <nav className="box bg-[#fff] h-[100px] px-[40px] sticky top-0 z-10">
            <div className="text-[#000] pt-[35px] text-[25px] font-[700]">
              <NavLink to="/admin">
                <h1>
                  <ArrowBackIcon /> Users
                </h1>
              </NavLink>
            </div>
          </nav>
          <div className="flex justify-center mt-4">
            <div className="w-[80vw] my-[40px]">
              {userData.map((data, index) => {
                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {data?.username}
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        gap: "30px",
                      }}
                    >
                      <p className="text-[#ffc82f]">
                        USER ID:{" "}
                        <span className="ml-3 text-[black]">
                          {data?.user_id}{" "}
                        </span>
                      </p>
                      <p className="text-[#ffc82f]">
                        USER TYPE:{" "}
                        <span className="ml-3 text-[black]">
                          {data?.user_type}{" "}
                        </span>
                      </p>
                      <p className="text-[#ffc82f]">
                        EMAIL:{" "}
                        <span className="ml-3 text-[black]">
                          {data?.email}{" "}
                        </span>
                      </p>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Users;
