import styled from 'styled-components'

const reportCardStyle = styled.div(props => ({
    background: "#FFFFFF",
    padding: "15px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
    borderRadius: "4px",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    "svg": {
        opacity: 0.08,
        width: "82px",
        height: "82px",
        position: "absolute",
        top: "5px",
        right: "-15px",
        ...props.iconStyle,
    }
}))

const reportCardTooltipStyle = styled.div(props => ({
    "svg": {
        opacity: 1,
        width: '16px',
        height: '16px',
        position: 'relative',
        top: -2,
        right: 0,
        ...props}
}))

const reportCardTitleStyle = styled.p(props => ({
    display: "flex",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "16px",
    letterSpacing: "0.1px",
    color: "#212529",
    width: "100%",
    ...props
}))

const reportCardValueStyle = styled.p(props => ({
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "26px",
    lineHeight: "47px",
    letterSpacing: "0.1px",
    color: "#1D1B84",
    width: "100%",
    ...props
}))

export {
    reportCardStyle as ReportCardDiv,
    reportCardTitleStyle as ReportCardTitle,
    reportCardValueStyle as ReportCardValue,
    reportCardTooltipStyle as ReportCardTooltip
}