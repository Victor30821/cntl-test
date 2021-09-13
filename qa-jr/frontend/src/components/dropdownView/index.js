import React, { useState } from 'react';
import { Text, Icon, Link } from 'components'
import { DropdownContainer, DropdownSelect, DropdownBox } from './styles';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

export default function DropdownView({ title = "Detalhes", data = {}, ...props }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const dataKeys = Object.keys(data);

    const toggleDropdown = (target) => setShowDropdown(target);

    const handleClose = (event, onClose) => {
        toggleDropdown(null);
        if (!event) return;
        onClose && onClose(event)
    };

    const dateIsValid = (date) => {
        try{
            const formatedDate = format(new Date(date), 'dd/MM/yyyy');
            return(formatedDate);
        }catch(error) {
            console.log('Invalid date -> ' + date + " - " + error);
            return("-");
        }
    };

    const types = {
        text: data => <Text>{data?.value || "-"}</Text>,
        link: data =>
            (data?.value && data?.link) ?
                <Link
                    fontSize={13}
                    href={data?.link}
                    target={"_blank"}
                >
                    {" "}
                    {data?.value}
                </Link>
            :
                <Text>{data?.value || "-"}</Text>
        ,
        date: data => 
            (data?.value) ?
                <Text>{dateIsValid(data?.value)}</Text>
            :
                <Text>{"-"}</Text>
            ,
        group: data =>
            (Array.isArray(data?.value) && data?.value?.length > 0) ?
                <div style={{display: 'flex' , flexWrap: 'wrap'}}>
                    {data?.value?.map(group => (
                        <div style={{border: '2px solid #1b2778', padding: '4px', borderRadius: '5px' , marginRight: '5px', marginTop: '5px'}}>
                            <Text style={{color: '#1b2778'}}>{group}</Text>
                        </div>
                    ))}
                </div>
                :
                <Text>{"-"}</Text>
        ,
    };

    const formatDataType = (data) => {
        const fn = types[data?.type];
        return fn(data);
    }
    
    return (
        <DropdownContainer style={props.style}>
            <DropdownSelect
                id={'dropdownAnchor' + title?.trim()}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Text>{title}</Text>
                <Icon
                    useFontAwesome
                    style={{marginRight: '5px'}}
                    icon={!showDropdown ? faChevronDown : faChevronUp} 
                    width={'20px'} 
                    height={'20px'} 
                    color='#1D1B84'
                />
            </DropdownSelect>
            {showDropdown && (
                <DropdownBox
                    anchorEl={document.getElementById('dropdownAnchor' + title?.trim())}
                    keepMounted
                    onClick={() => handleClose(false)}
                    open={Boolean(showDropdown)}
                >
                    {dataKeys.map(key => (
                        <div style={{padding: '5px'}}>
                            <Text style={{ color: '#666666'}}>
                                {key}:
                            </Text>
                            {formatDataType(data?.[key])}
                        </div>
                    ))}
                </DropdownBox>
            )}
        </DropdownContainer>
    )
}