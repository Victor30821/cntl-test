import styled from 'styled-components'

const ReportCardDiv = styled.div(props => ({
    background: "#FFFFFF",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    margin: "0 1rem 0 0",
    border: props.isSelected ? `2px solid #1D1B84` : "2px solid #e6e6e6",
    borderRadius: "4px",
    overflow: "hidden",
    position: "relative",
    width: "150px",
    height: "75px",
    "svg": {
        height: "62px",
        width: "62px",
        opacity: 0.3,
        position: "absolute",
        bottom: "-15px",
        right: "-15px",
        ...props.iconStyle
    },
}))

const ReportCardTitle = styled.span(props => ({
    fontSize: "13px",
    color: "#212529",
    ...props
}))

const ReportCardValue = styled.span(props => ({
    fontWeight: "bold",
    fontSize: "30px",
    color: "#1D1B84",
    ...props
}))

export {
    ReportCardDiv,
    ReportCardTitle,
    ReportCardValue,
}
