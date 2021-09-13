
import styled from 'styled-components';

const clickableMenuItem = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
    paddingTop: "8px",
    paddingBottom: "8px",
    cursor: 'pointer'
}))
const divArrowToggle = styled.div(props => ({
    position: 'absolute',
    right: '5%',
}))
const divCircle = styled.div(props => ({
    position: 'absolute',
    right: "11%",
}))

const textMenuItem = styled.p(props => ({
    fontSize: '14px',
    color: '#fff',
    margin: '0px',
    fontWeight: 'bold'
}))
const circle = styled.div(props => ({
    width: "8px",
    height: "8px",
    borderRadius: "35px",
    backgroundColor: '#24B3A4',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))


export {
    textMenuItem as TextMenuItem,
    clickableMenuItem as ClickableMenuItem,
    divArrowToggle as DivArrowToggle,
    circle as Circle,
    divCircle as DivCircle,
}
