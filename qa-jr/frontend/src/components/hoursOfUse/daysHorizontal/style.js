import styled from "styled-components";
import background from '../../../assets/editHoursOfUseBackGround.png'

export const DaysDiv = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    height: "47px",
    width: "inherit",
    paddingTop: "16px",
    alignItems: "center",
    position: "relative",
    "& > div": {
        margin: "0 10px"
    },
    "& > div:first-child": {
        margin: "0 10px 0 0"
    },
    "& > div:last-child": {
        margin: "0 0 0 10px"
    },

    ...props,
}))
export const DayStyle = styled.div(props => ({
    "& > p": {
        position: "absolute",
        top: "-20px"
    },
    display: "flex",
    alignItems: "center",
    position: "relative",
    flex: "1",
    height: "47px",
    background: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "none",
    ...props
}))
export const PeriodSelected = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    background: props.fillColor || "#1A237A",
    flexDirection: "column",
    left: !props.startPercentage ? "0px" : props.startPercentage + "%" || "0%",
    right: !props.endPercentage ? "0px" : props.endPercentage + "%" || "0%",
    height: "100%",
    "& *": {
        color: "#fff"
    },
    "& > div": {
        width: "inherit",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: "1",
    },
    ...props
}))

export const AccompaniedTime = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    marginLeft: '43px',
    width: "90%"
}))
