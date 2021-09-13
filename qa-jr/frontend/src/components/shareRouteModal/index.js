import React, { useState } from 'react'
import {
    ShareRouteModalContainer
} from './style'
import { Icon, Text, Link, Modal } from 'components'
import { localizedStrings } from 'constants/localizedStrings';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { URL_WHATSAPP } from "constants/environment";

export default function ShareRouteModal({
    share,
    setShare = () => { },
}) {

    const {
        url,
        vehicleToShow,
    } = useSelector(state => state.map);
    const vehiclePhone = vehicleToShow?.driver?.phone?.replace(/\D/g, "").replace('55','');
    const thereIsVehiclePhone = !!vehicleToShow?.driver?.phone;

    const onShare = ({ type }) => {
      const typesOfShare = {
        whatsapp: () => window.open(`${URL_WHATSAPP}?phone=55${vehiclePhone}&text=${encodeURIComponent(url)}`),
        app: () => console.log("app"),
        copy: () => {
          navigator.clipboard.writeText(url).then(
            function () {
              toast.success(localizedStrings.messageCopy);
            },
            function (err) {
              toast.error(localizedStrings.messageCopyError);
            }
          );
        },
      };
      typesOfShare[type]();
    };

    const [actions,] = useState([
        {
            title: localizedStrings.copyLink,
            tooltipText: "",
            onClick: () => {
                onShare({
                    type: "copy"
                });
                setShare(false)
            },
            icon: "copy",
            show: true
        },
        {
            title: localizedStrings.sendViaWhatsapp,
            tooltipText: "",
            onClick: () => {
                onShare({
                    type: "whatsapp",
                });
                setShare(false)
            },
            icon: "whatsapp",
            iconOptions: {
                width: "24px",
                height: "24px",
            },
            show: thereIsVehiclePhone
        },
    ])
    return (
        <ShareRouteModalContainer>
            <Modal
                open={share}
                setOpen={setShare}
                header={
                    <ShareRouteModal />
                } />
            <Text fontSize={"18px"} color={"#666666"}>
                {localizedStrings.shareRoute}
            </Text>
            <div style={{display: "flex", justifyContent: "center"}}>
                {
                    actions.map(action => (
                        <Link
                            display={action.show ? "flex" : "none"}
                            flexDirection="column"
                            alignItems="center"
                            minHeight="100px"
                            justifyContent="space-evenly"
                            padding='10px'
                            borderRadius={"4px"}
                            onClick={action.onClick}
                            as={"button"}
                            hover={{
                                transition: "all 0.2s ease-out",
                                background: "#1A237A20",
                                textDecoration: "none",
                            }}
                        >
                            <Icon icon={action.icon} width={'22px'} height={'22px'} color='#1A237A' {...action.iconOptions} />
                            <div>
                                <Text textAlign="center " fontWeight={"500"} fontSize={"12px"} color={"#666"}>
                                    {action.title}
                                </Text>
                            </div>
                        </Link>

                    ))
                }
            </div>
        </ShareRouteModalContainer>
    )
}
