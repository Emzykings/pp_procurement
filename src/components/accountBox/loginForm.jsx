import React, { useContext, useState } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://spiritual-anglerfish-sodbridge.koyeb.app/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
      const data = await response.json();
      console.log(data); // Log the response
     
      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("username", username);
      if (data?.is_admin) {
        navigate("/admin");
        
      } else {
        navigate("/procurement3yiukjeg5-47/5408456-856");
      }
      message.success("login successful")
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <BoxContainer>
      <FormContainer>
        <Input
          type="email"
          placeholder="User name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      {/* <Link style={{}} to={"/procurement3yiukjeg5-47/5408456-856"}>
        <SubmitButton type="submit">Sign in</SubmitButton>
      </Link> */}
      <SubmitButton type="submit" onClick={handleSignIn}>
        {loading ? "Loading..." : "Sign in"}
      </SubmitButton>

      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Don't have an accoun?{" "}
        <BoldLink onClick={switchToSignup} href="#">
          Sign up
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}
