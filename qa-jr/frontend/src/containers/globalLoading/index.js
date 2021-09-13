import React from "react";
import { Text } from "../../components";
import { BackgroundLayer, LoadingSpinStyle } from "./style";
import useFormLoading from "hooks/useFormLoading";
import { localizedStrings } from "constants/localizedStrings";

export default function GlobalLoading({
    loading = false,
    ...options
}) {
    const isFormLoading = useFormLoading() || loading;
    if (!isFormLoading) return (<></>)
    return (
        <BackgroundLayer {...options.layerOptions} style={{ zIndex: 99999 }}>
            <div>
                <div>
                    <LoadingSpinStyle className={"spin"} />
                </div>
                <div>
                    <Text marginBottom="20px" color={"#1D1B84"} fontSize={"24px"}>
                        {localizedStrings.loading}...
                </Text>
                    <Text marginTop={"20px"} color={"#676788"} fontSize={"16px"}>
                        {localizedStrings.waitUntilLoadingEnds}
                    </Text>
                </div>
            </div>
        </BackgroundLayer>
    );
}
