
import React, { memo, useState } from "react";
import { Icon, Text, Link } from 'components';
import { faCheck, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { 
  ChecklistLineContainer,
  ChecklistLineContent,
  ChecklistLineMain,
  ChecklistLineNumber,
  ChecklistLinePercentageBox,
  ChecklistLineDropdownContent,
  ChecklistLineDropdownTexts
} from './style.js';
import { localizedStrings } from 'constants/localizedStrings';

function ChecklistLine({
    history,
    data,
    index = 0,
    ...option
}) {
  const BLACK = '#000000'
  const GREY = '#666666';
  const ALFAGREY = '#999999';

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const lineData = {
    checked: data?.checked,
    label: data?.label || "",
    percentage: data?.percentage || 0,
    texts: data?.texts || {},
    helper: data?.helper ? {
      ...data?.helper,
      text: data?.text || localizedStrings.learnMore,
      lineIndex: data?.helper?.lineIndex || Object.keys(data?.texts).length
    } : {}
  };

  const percentage = (lineData?.percentage?.split('.0')[0] || 0);

  const numberContent = () => {
    if(lineData.checked){
      return(
        <Icon
          useFontAwesome
          icon={faCheck} 
          width={'10px'} 
          height={'10px'} 
          color='#FFF'
          style={{ marginLeft: '1px' }}
        />
      );
    }
    const addLeftZero = index <= 8 ? '0' : '';
    return(`${addLeftZero}${index + 1}`);
  };

  const handleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    
    <ChecklistLineContainer 
      style={option.style}
      onClick={handleDropdown}
    >
      <ChecklistLineContent>
        <ChecklistLineMain>
            <ChecklistLineNumber active={lineData?.checked}> 
              {numberContent()}
            </ChecklistLineNumber>
            <Text style={{
              padding: '16px 16px',
              fontWeight: 400,
              fontSize: '14px',
              color: lineData?.checked ? ALFAGREY : BLACK,
            }}>
              {lineData?.label}
            </Text>
            <ChecklistLinePercentageBox> {`+${percentage}%`} </ChecklistLinePercentageBox>
        </ChecklistLineMain>
        {(lineData?.texts || lineData?.helper) && 
          <Icon
            useFontAwesome
            icon={dropdownVisible ? faChevronUp : faChevronDown} 
            width={'20px'} 
            height={'20px'} 
            color='#1D1B84'
          />
        }
      </ChecklistLineContent>
      {dropdownVisible && lineData?.texts && 
        <ChecklistLineDropdownContent>
          {Object.values(lineData?.texts).map((text, index) => (
            <ChecklistLineDropdownTexts>
              <Text style={{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '14px',
                lineHeight: '22px',
                color: lineData?.checked ? ALFAGREY : GREY,
              }}>
                {text}
              </Text>
              &ensp;
              {lineData?.helper && (lineData?.helper?.lineIndex === (index + 1)) &&
                <Link
                  fontSize={14}
                  href={lineData?.helper?.link || ''}
                  target={"_blank"}
                >
                  {" "}
                  {`${lineData?.helper?.text || ''}`}
                </Link>
              }
            </ChecklistLineDropdownTexts>
          ))}
        </ChecklistLineDropdownContent>
      }
    </ChecklistLineContainer>
  )
}

export default memo(ChecklistLine);