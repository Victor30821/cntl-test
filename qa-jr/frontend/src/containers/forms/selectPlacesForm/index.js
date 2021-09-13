import React from "react";
import { Icon, Text, Select, HelpIconWithTooltip, Link } from "components";
import { SelectPlacesFormCreation } from "./style";
import { localizedStrings } from "constants/localizedStrings";
import { logisticsChangeSelected, } from "store/modules";

export default function selectPlacesForm({
    onCancel,
    addTag,
    addPlace,
    addClient,
    addIdentification,
    erroClient,
    erroPlace,
    erroTag,
    erroIdentification,
	dispatch,
    selector_clients,
    selector_places,
    selector_identifications,
    client_selected,
    place_selected,
    identification_selected,
    tag_selected,
    visibleTags,
    selected
}) {

    const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        trim: true,
        matchFrom: 'start',
    };

	return (
		<SelectPlacesFormCreation>
            <div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
				<Text
					style={{
						fontFamily: "Roboto",
						fontStyle: "normal",
						fontWeight: "bold",
						fontSize: "20px",
						lineHeight: "24px",
					}}
				>
					{localizedStrings.addNewStopPlace}
				</Text>
				<button onClick={onCancel}>
					{
						<Icon
							icon={"plus"}
							width={"20px"}
							height={"15px"}
							color={"#1D1B84"}
							cursor="pointer"
							style={{
								marginLeft: "13px",
								display: "flex",
								flexDirection: "row",
								transform: "rotate(45deg)",
							}}
						/>
					}
				</button>
			</div>
			<div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
				<Text
					style={{
						fontFamily: "Roboto",
						fontStyle: "normal",
						fontWeight: "normal",
						fontSize: "14px",
						lineHeight: "16px",
					}}
				>
					{localizedStrings.selectANewStopPlace}
				</Text>
			</div>
			<div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
				<Select
                    style={{
                        width: "100%",
                        marginRight: "10px",
                    }}
					title={localizedStrings.logisticService.client_name}
					error={erroClient.error}
					errorText={erroClient.message}
					options={selector_clients}
					placeholder={localizedStrings.logisticService.clientPlaceholder}
					onChange={(item) => {
						if (item) {
							dispatch(
								logisticsChangeSelected({
									selected: {
										stop_places: {
											...selected.stop_places,
											client_selected: item,
										},
									},
								})
							);
						}
					}}
					value={client_selected || {}}
					icon={
						<HelpIconWithTooltip
							text={[
								localizedStrings.logisticService.clientSelectedInfo,
								<Link
									href={localizedStrings.logisticService.clientSelectedInfoLink}
									target={"_blank"}
								>
									{" "}
									{localizedStrings.learnMore}
								</Link>,
							]}
						/>
					}
				/>
				<button
					style={{
						display: "flex",
						background: "#192379",
						flexDirection: "row",
						cursor: "pointer",
						alignItems: "center",
						border: "1px solid #1A237A",
						borderRadius: "4px",
						backgroundColor: "#192379",
						justifyContent: "flex-end",
						padding: "10px",
						height: "36px",
                        marginTop: "23px",
					}}
                    onClick={() => addClient()}
				>
					<Icon
						icon={"plus"}
						width={"15px"}
						height={"16px"}
						color="#fff"
						divProps={{ margin: "0px 5px" }}
					/>
				</button>
			</div>
            <div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
            <Select
                style={{
                    width: "100%",
                    marginRight: "10px",
                }}
                title={localizedStrings.logisticService.local_name}
                error={erroPlace.error}
                errorText={erroPlace.message}
                options={selector_places}
                filterConfig={filterConfig}
                placeholder={localizedStrings.logisticService.localPlaceHolder}
                onChange={(item) => {
                    if(item) {
                    dispatch(logisticsChangeSelected({
                    selected: { stop_places: { ...selected.stop_places, place_selected: item } }
                    }));
                    }
                }}
                value={place_selected || {}}
                icon={<HelpIconWithTooltip
                    text={[
                        localizedStrings.logisticService.placeSelectedInfo,
                        <Link
                        href={
                            localizedStrings.logisticService.placeSelectedInfoLink
                        }
                        target={"_blank"}
                        >
                        {" "}
                        {localizedStrings.learnMore}
                        </Link>
                    ]} />}
                />
                <button
					style={{
						display: "flex",
						background: "#192379",
						flexDirection: "row",
						cursor: "pointer",
						alignItems: "center",
						border: "1px solid #1A237A",
						borderRadius: "4px",
						backgroundColor: "#192379",
						justifyContent: "flex-end",
						padding: "10px",
						height: "36px",
                        marginTop: "23px",
					}}
                    onClick={() => addPlace()}
				>
					<Icon
						icon={"plus"}
						width={"15px"}
						height={"16px"}
						color="#fff"
						divProps={{ margin: "0px 5px" }}
					/>
				</button>
            </div>
            <div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
            <Select
                style={{
                    width: "100%",
                    marginRight: "10px",
                }}
                title={localizedStrings.logisticService.identification}
                error={erroIdentification.error}
                errorText={erroIdentification.message}
                options={selector_identifications}
                filterConfig={filterConfig}
                placeholder={localizedStrings.logisticService.localPlaceHolder}
                onChange={(item) => {
                    if(item) {
                    dispatch(logisticsChangeSelected({
                    selected: { stop_places: { ...selected.stop_places, identification_selected: item } }
                    }));
                    }
                }}
                value={identification_selected || {}}
                icon={<HelpIconWithTooltip
                    text={[
                        localizedStrings.logisticService.placeSelectedInfo,
                        <Link
                        href={
                            localizedStrings.logisticService.placeSelectedInfoLink
                        }
                        target={"_blank"}
                        >
                        {" "}
                        {localizedStrings.learnMore}
                        </Link>
                    ]} />}
                />
                <button
					style={{
						display: "flex",
						background: "#192379",
						flexDirection: "row",
						cursor: "pointer",
						alignItems: "center",
						border: "1px solid #1A237A",
						borderRadius: "4px",
						backgroundColor: "#192379",
						justifyContent: "flex-end",
						padding: "10px",
						height: "36px",
                        marginTop: "23px",
					}}
                    onClick={() => addIdentification()}
				>
					<Icon
						icon={"plus"}
						width={"15px"}
						height={"16px"}
						color="#fff"
						divProps={{ margin: "0px 5px" }}
					/>
				</button>    
            </div>
            <div style={{ flexDirection: "row", display: "flex", marginBottom: "16px" }}>
                <Select
                    style={{
                        width: "100%",
                        marginRight: "10px",
                    }}
                    title={localizedStrings.logisticService.tag_name}
                    options={visibleTags || []}
                    error={erroTag.error}
                    errorText={erroTag.message}
                    onChange={tag => {
                      if(tag) {
                        dispatch(logisticsChangeSelected({
                        selected: { stop_places: { ...selected.stop_places, tag_selected: tag } }
                      }));
                      }
                    }}
                    placeholder={""}
                    value={tag_selected || {}}
                    emptyStateText={localizedStrings.noTagFound}
                    icon={<HelpIconWithTooltip
                    text={[
                    localizedStrings.logisticService.tagInfo,
                    <Link
                      href={
                        localizedStrings.logisticService.tagInfoLink
                      }
                      target={"_blank"}
                      >
                      {" "}
                      {localizedStrings.learnMore}
                    </Link>
                    ]} />}
                />
                <button
                  style={{
						display: "flex",
						background: "#192379",
						flexDirection: "row",
						cursor: "pointer",
						alignItems: "center",
						border: "1px solid #1A237A",
						borderRadius: "4px",
						backgroundColor: "#192379",
						justifyContent: "flex-end",
						padding: "10px",
						height: "36px",
                        marginTop: "23px",
					}}
                  onClick={() => addTag()} >
                  <Icon icon={"plus"} width={'15px'} height={'16px'} color='#fff' divProps={{ margin: "0px 5px" }} />
                </button>
            </div>
		</SelectPlacesFormCreation>
	);
}
