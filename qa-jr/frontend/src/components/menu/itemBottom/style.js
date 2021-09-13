
import styled from 'styled-components';

const divMenuItem = styled.div(props => ({
    backgroundColor: "#908fc3",
    display: "flex",
    flexDirection: "row",
    width: props.width || "100%",
    position: "absolute",
    left: "0",
    bottom: "0",
    justifyContent: "center",
    paddingTop: "8px",
    paddingBottom: "8px",
    cursor: 'pointer'
}))
const divArrowToggle = styled.div(props => ({
    position: 'absolute',
    right: '10px',
}))

const textMenuItem = styled.p(props => ({
    fontSize: '14px',
    color: '#fff',
    margin: '0px',
    fontWeight: 'bold'
}))

export {
    textMenuItem as TextMenuItem,
    divMenuItem as DivMenuItem,
    divArrowToggle as DivArrowToggle,
}
