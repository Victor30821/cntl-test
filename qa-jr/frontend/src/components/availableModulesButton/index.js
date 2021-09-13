import React, { useState } from 'react'

import { store } from 'store';
import { AvailableModuleBtn } from './style';
import Swal from 'sweetalert2'
import { ModalAvailableModules, Text, Icon } from 'components';
import { localizedStrings } from 'constants/localizedStrings';
import { Provider } from 'react-redux';
import withReactContent from 'sweetalert2-react-content'
import { VEHICLES_CREATE_PATH } from 'constants/paths';
import qs from 'qs';
const MySwal = withReactContent(Swal)

export default ({history}) => {
    const [modal, setModal] = useState()
    return (
        <AvailableModuleBtn
            onClick={async () => {
                const onModuleClick = (tracker) => {
                    MySwal.close(modal)
                    const {
                        id: tracker_id,
                        serial_number: tracker_serial_number
                      } = tracker;
                      
                      const params = qs.stringify({
                        tracker_id,
                        tracker_serial_number
                      })
                      const vehicleCreateUrl = VEHICLES_CREATE_PATH + "?" + params;
                      history.push(vehicleCreateUrl, { tracker })
                } 
                const openedModal = await MySwal.fire({
                    showCancelButton: false,
                    showConfirmButton: false,
                    html: <Provider store={store}><ModalAvailableModules onModuleClick={onModuleClick} /></Provider>,
                    customClass: {
                        popup: 'modal-trackers-container',
                    }
                })
                setModal(openedModal)
            }}
        >
            <Icon
                icon="vehicle_and_module"
                width="22px"
                color="#192379"
                padding="5px"
            />
            <Text color={"#192379"} cursor={"pointer"}
                whiteSpace="nowrap"
                fontWeight="500"
                fontSize="14px"
                marginLeft="5px"
                color="#192379" >
                {localizedStrings.avaliableModules}
            </Text>
        </AvailableModuleBtn>
    )
}
