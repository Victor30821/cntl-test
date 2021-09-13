import React, { useState } from "react";
import { localizedStrings } from "constants/localizedStrings";
import { useSelector } from "react-redux";
import { Input, Button, Text } from "components";
import {
    Br,
  } from "./style.js";
export default function FormLogin({
    onSubmit,
    errors,
    user,
    handleEmail,
    handlePassword,
}) {
    const { loginLoading } = useSelector(state => state.auth);
    const [passwordInputType, setPasswordInputType] = useState("password");

    return (
        <form onSubmit={onSubmit}>
              <Input
                error={errors.emailEmpty.error ? true : false}
                errorTitle={
                  errors.emailEmpty.error ? errors.emailEmpty.message : false
                }
                name={"email"}
                value={user.email}
                onChange={handleEmail}
                placeholder={localizedStrings.typeEmail}
              />
              <Br height="25px" />
              <Text
                fontSize="13px"
                fontWeight="bold"
                lineHeight="19px"
                color="#666666"
              >
                {localizedStrings.password}
              </Text>
              <Input
                error={
                  errors.passwordEmpty.error
                    ? true
                    : errors.emailPasswordWrong.error
                      ? true
                      : false
                }
                errorTitle={
                  errors.passwordEmpty.error
                    ? errors.passwordEmpty.message
                    : errors.emailPasswordWrong.error
                      ? errors.emailPasswordWrong.message
                      : null
                }
                value={user.password}
                onChange={handlePassword}
                placeholder={localizedStrings.typePassword}
                type={passwordInputType}
                isPassword={true}
                passwordInputType={passwordInputType}
                setPasswordInputType={setPasswordInputType}
              />
              <Br height="48px" />
              <Button
                width="100%"
                fontWeight="500"
                textConfig={{ style: { color: "#fff" } }}
                title={localizedStrings.enter}
                loading={loginLoading}
                type="submit"
              />
            </form>
    )
}

