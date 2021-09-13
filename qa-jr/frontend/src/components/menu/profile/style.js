
import styled from 'styled-components';

const divMenuRow = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    width: "100%",
    margin: "10px"
}))

// const divMenuColumn = styled(divMenuRow)(props => ({
//     flexDirection: "column",
//     justifyContent: "center",
//     marginLeft: "16px",
//     padding: "0px",
//     alignItems: "flex-start"
// }))


const imageMenuHeader = styled.img(props => ({
    width: '250px',
}))
const profileCircle = styled.div(props => ({
    width: "50px",
    height: "50px",
    borderRadius: "35px",
    backgroundColor: '#ffffff',
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
    justifyContent: "center",
    boxShadow: '0px 0px 5px 0px rgba(255,255,255,0.75)'
}))


export {
    divMenuRow as DivMenuRow,
    // divMenuColumn as DivMenuColumn,
    imageMenuHeader as ImageMenuHeader,
    profileCircle as ProfileCircle,
}
