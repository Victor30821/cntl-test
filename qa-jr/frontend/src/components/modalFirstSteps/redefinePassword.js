import React, { useState } from "react";
import { Button, CardInput } from "components";
import { api } from "services/api";
import qs from "qs";
import { updateUserInSession } from "store/modules";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { localizedStrings } from "constants/localizedStrings";

const RedefinePassword = ({setCurrentStep}) => {
	const { register, getValues } = useForm();

	const dispatch = useDispatch();
	const {
		user: { id },
	} = useSelector((state) => state.auth);

	const redefineUserPasswordRequest = async ({
		password,
		userId,
		dispatch,
	}) => {
		const URL = `/user/v1/${userId}`;
		const response = await api.put(
			URL,
			qs.stringify({
				user: {
					password,
					has_logged: 1,
				},
			})
		);

		return response;
	};

	const redefinePasswordSubmit = async () => {
		try {
			setIsLoading(true);
			const { password, password_confirm } = getValues();
			if (!password || !password_confirm) {
				setIsLoading(false);
				return toast.warn(localizedStrings.fullfillPasswords);
			}
			if (password !== password_confirm) {
				setIsLoading(false);
				return toast.warn(localizedStrings.passwordWrong);
			} else {
				const response = await redefineUserPasswordRequest({
					userId: id,
					password,
					dispatch,
				});
				setIsLoading(false);
				if (response.status !== 200) {
					throw new Error();
				}
				dispatch(
					updateUserInSession({
						has_logged: 1,
					})
				);
				setCurrentStep(1);
				return toast.success(localizedStrings.passwordChangedSuccessfully);
			}
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			return toast.warn(localizedStrings.passwordError);
		}
	};

	const [isLoading, setIsLoading] = useState(false);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				width: "100%",
				height: "100%",
			}}
		>
			<h1
				style={{
					alignSelf: "center",
					fontSize: "16px",
					fontWeight: "bold",
				}}
			>
				{localizedStrings.redefineYourPassword}
			</h1>
			<CardInput
				register={register}
				inputs={[
					{
						label: localizedStrings.newPassword,
						name: "password",
						type: "password",
						noMask: true,
						required: false,
						placeholder: localizedStrings.typePassword,
						autoComplete: "off",
					},
				]}
			/>
			<CardInput
				register={register}
				inputs={[
					{
						label: localizedStrings.confirmYourNewPassword,
						name: "password_confirm",
						type: "password",
						noMask: true,
						required: false,
						placeholder: localizedStrings.typeNewPassword,
					},
				]}
			/>
			<Button
				title={localizedStrings.redefine}
				style={{ alignSelf: "flex-end", marginRight: "8px" }}
				onClick={redefinePasswordSubmit}
				loading={isLoading}
			/>
		</div>
	);
};

export default RedefinePassword;
