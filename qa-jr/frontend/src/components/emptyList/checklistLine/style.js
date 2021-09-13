
import styled from 'styled-components';

const WHITE = "#FFFFFF";
const GREEN = '#0F9D58';
const GREY = '#E5E5E5';
const PURPLE = '#908FC3';

const checklistLineDivDefault = styled.div(props => ({
    display: 'flex',
    alignItems: 'center',
}));

const checklistLineContainer = styled.div(props => ({
    width: '100%',
    cursor: 'pointer',
    padding: '0 24px 0 24px',
    ...props.style,
}));

const checklistLineContent = styled(checklistLineDivDefault)(props => ({
    justifyContent: 'space-between',
}));

const checklistLineMain = styled(checklistLineDivDefault)(props => ({...props.style}));

const checklistLineNumber = styled(checklistLineDivDefault)(props => ({
    justifyContent: 'center',
    textAlign: 'center',
    background: (props?.active ? GREEN : WHITE),
    width: '25px',
    height: '25px',
    border: (props?.active ? 'none' : `1px solid ${GREY}`),
    borderRadius: '13px',
    padding: '6px',
    color: (props?.active ? WHITE : PURPLE),
    fontWeight: 'bold',
    fontSize: '11px',
    lineHeight: '13px',
}));

const checklistLinePercentageBox = styled(checklistLineDivDefault)(props => ({
    flexDirection: 'row',
    padding: '4px 6px',
    background: WHITE,
    border: `1px solid ${GREY}`,
    boxSizing: 'border-box',
    borderRadius: '4px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '14px',
    color: PURPLE,
}));

const checklistLineDropdownContent = styled.div(props => ({
    padding: '5px 0 18px 41px',
}));

const checklistLineDropdownTexts = styled(checklistLineDivDefault)(props => ({...props.style}));

export {
    checklistLineContainer as ChecklistLineContainer,
    checklistLineContent as ChecklistLineContent,
    checklistLineMain as ChecklistLineMain,
    checklistLineNumber as ChecklistLineNumber,
    checklistLinePercentageBox as ChecklistLinePercentageBox,
    checklistLineDropdownContent as ChecklistLineDropdownContent,
    checklistLineDropdownTexts as ChecklistLineDropdownTexts,
}