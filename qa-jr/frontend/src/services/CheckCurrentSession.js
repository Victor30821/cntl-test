import React from 'react';
import storage from "redux-persist/lib/storage";
import { useEffect } from "react";
import { store } from 'store';

export default function CheckCurrentSession() {
	const checkUserAuthentication = async () => {
		const state = store.getState();

		const reduxStorageString = await storage.getItem("persist:contelerastreador");
        const reduxStorageObj = JSON.parse(reduxStorageString || null)
        const auth = JSON.parse(reduxStorageObj?.auth || null);

		const storageId = auth?.user?.id;
		const stateId = state.auth?.user?.id;

		if (storageId !== stateId) {
			window.location.href = window.location.origin;
		}
	}

    useEffect(() => {
        window.addEventListener("storage", checkUserAuthentication);
        checkUserAuthentication();
        return () => window.removeEventListener("storage", checkUserAuthentication);
    }, []);

    return <></>;
}

