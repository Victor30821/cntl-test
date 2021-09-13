
import React, { memo, useMemo } from "react";
import { HelpIconWithTooltip, Link } from '../../components'
import { ListStyle, ItemStyle } from './style.js';
import { localizedStrings } from '../../constants/localizedStrings'
import { vehiclesStatusTypes, noSignal, noSignal24, noModule, vehicleOff, vehicleOn, noUse, noCommunication } from 'constants/environment';
import { Icon } from 'components';

const moreInfo = {
	[vehiclesStatusTypes[noSignal].color]: {
		text: localizedStrings.tooltipHelpTexts.noSignal.text,
		link: localizedStrings.tooltipHelpTexts.noSignal.link
	},
	[vehiclesStatusTypes[noSignal24].color]: {
		text: localizedStrings.tooltipHelpTexts.vehiclesWithoutCommunication.text,
		link: localizedStrings.tooltipHelpTexts.vehiclesWithoutCommunication.link
	},
	[vehiclesStatusTypes[noCommunication].color]:  {
		text: localizedStrings.tooltipHelpTexts.noCommunication.text,
		link: localizedStrings.tooltipHelpTexts.noCommunication.link
	},
	[vehiclesStatusTypes[noUse].color]:  {
		text: localizedStrings.tooltipHelpTexts.noUse.text,
		link: localizedStrings.tooltipHelpTexts.noUse.link
	},
	[vehiclesStatusTypes[noModule].color]:  {
		text: localizedStrings.tooltipHelpTexts.noModules.text,
		link: localizedStrings.tooltipHelpTexts.noModules.link
	},
};

const getModulesToInstallQty = (items) => {
    return items?.find(elem => elem?.color === vehiclesStatusTypes[noModule].color)?.text?.props?.children?.[0]?.props?.children;
}

export default memo(function ColorfulList ({ items, ...option }) {

    const filteredItems = useMemo(() => {
        const statusToShow = {
            [vehiclesStatusTypes[vehicleOn].color]: true,
            [vehiclesStatusTypes[vehicleOff].color]: true,
        }

        return items.filter((item) => {
            if (statusToShow[item.color]) return true;

            return Number.isFinite(+item.quantity) && +item.quantity > 0;
        })
    }, [items]);

	const total = filteredItems?.reduce((acc, item) =>
        Number.isFinite(+item.quantity) ? acc + +item.quantity : acc , 0
    ) || 0;

    const modulesToInstallQty = getModulesToInstallQty(filteredItems);
    return (
        <div style={{
            background: "#FFFFFF",
            transition: "all 0.2s ease-out",
            display: "flex",
            opacity: option.show ? "1" : "0",
            borderRadius: "4px 4px 0px 0px",
            marginTop: "5px",
            boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
            height: '100%',
            alignItems: 'start',
            ...option,
        }} {...option}>
            <ListStyle>
				<li style={{alignItems: 'center', lineHeight: '2em'}}>
					<Icon icon={"vehicle-quantity"} width={'16px'} height={'16px'} color={"#868E96"} style={{margin: '0 8px'}} />
					<Link
						lineHeight={"13px"}
						fontSize={"14px"}
						color={"#000"}
						href="#"
						onClick={() => option.onStatusClick()}
						hover={{
							color: "#393791",
						}}
					>
						<span style={{ display: "flex" }}>
							<span style={{ fontWeight: "bold", marginRight: "8px" }}>
								{total}
							</span>{localizedStrings.vehiclesInAll}
						</span>
					</Link>
				</li>
                {
                    filteredItems.map((item, index) => {
                        if (item.color === vehiclesStatusTypes[noModule].color && !modulesToInstallQty) return null
                        return (
                            <ItemStyle key={index} color={item.color}>
                                <Link
                                    lineHeight={"13px"}
                                    fontSize={"14px"}
                                    color={"#000"}
                                    href="#"
									onClick={() => option.onStatusClick(item.status)}
                                    hover={{
                                        color: "#393791",
                                    }}
                                    {...item.textOptions}
                                >
                                    {item.text}
                                </Link>
                                {moreInfo[item.color] && (
                                    <HelpIconWithTooltip tooltipOptions={{placement:'top'}} key={index} style={{ margin: '-5px 0px 0px 10px' }}
                                        text={[moreInfo[item.color].text,
                                        <Link key={index}
                                            href={moreInfo[item.color].link}
                                            target="_blank"
                                        >
                                            {" "}
                                            {localizedStrings.learnMore}
                                        </Link>]} />
                                )}
                            </ItemStyle>
                        )
                    })
                }
                {
                    modulesToInstallQty && (
                        <div style={{marginLeft: "1rem", color: "#808080", fontSize: "14px"}}>
                            <Link
                                fontSize="14px"
                                href="https://exclusivo.contelerastreador.com.br/instalador/"
                                target="_blank"
                            >
                                {localizedStrings.ClickHere} {" "}
                            </Link>
                            {localizedStrings.andKnowHowToInstallModules}
                        </div>
                    )
                }
            </ListStyle>
        </div>
    )

})


