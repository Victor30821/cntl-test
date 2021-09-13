
import styled from 'styled-components';


// const divMenuRow = styled.div(props => ({
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     padding: '5px'
// }))
// const divMenuColumn = styled(divMenuRow)(props => ({
//     flexDirection: "column",
//     display: "flex",
// }))

const usageAchievementMenuItem = styled.div(props => ({
    display: 'flex',
    width: '100%',
    marginTop: props?.menuIsOpen ? '5px' : '8px',
    height: props?.menuIsOpen ? '40px' : '22px',
    paddingLeft: props?.menuIsOpen ? '16px' : '18px',
    paddingRight: props?.menuIsOpen ? '42px': '18px',
    cursor: 'pointer'
}));

const imageMenuHeader = styled.img(props => ({
    width: '170px',
}))

export {
    // divMenuRow as DivMenuRow,
    // divMenuColumn as DivMenuColumn,
    imageMenuHeader as ImageMenuHeader,
    usageAchievementMenuItem as UsageAchievementMenuItem,
}
