import React, { memo, forwardRef } from "react";
import IcoMoon from "react-icomoon";
import iconSet from "../../assets/icons.json";
import Tooltip from "@material-ui/core/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withStyles } from "@material-ui/core/styles";
import { StylableDiv } from "./style";
const TextOnlyTooltip = withStyles({
	tooltip: {
		color: "black",
		backgroundColor: "#fff",
		fontSize: "14px",
		border: "1px solid #00000070",
	},
})(Tooltip);
const Icon = forwardRef(({ useFontAwesome, icon, ...props }, ref) => {
	return (
		<StylableDiv ref={ref} 
		className= {props.className} {...props.divProps}>
			{!useFontAwesome ? (
				<IcoMoon
					xmlns="http://www.w3.org/2000/svg"
					ref={ref}
					iconSet={iconSet}
					icon={icon}
					{...props}
				/>
			) : (
				<FontAwesomeIcon icon={icon} {...props} />
			)}
		</StylableDiv>
	)
});

export default memo(
	({ tooltipText = "", useFontAwesome = false, icon, ...props }) => {
		if (tooltipText) {
			return (
				<TextOnlyTooltip
					title={tooltipText}
					arrow
					interactive
					{...props.tooltipOptions}
				>
					<Icon icon={icon} {...props} useFontAwesome={useFontAwesome} className= {props.className}/>
				</TextOnlyTooltip>
			);
		} else {
			return <Icon icon={icon} {...props} useFontAwesome={useFontAwesome} />;
		}
	}
);
