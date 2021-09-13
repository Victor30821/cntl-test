
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Icon, Button } from '../../components'
import createXLSX from '../../helpers/createXLSX';
import { localizedStrings } from 'constants/localizedStrings'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function XLSXExport({document,fileName,successStatus,notFoundStatus = false,showButton = true, tabName, multipleTabs = false, loadingText = undefined, loadingPaginationText = undefined, loadingPagination = false,notFoundStatusMessage = undefined}) {
    return (
        <div style={{display:'flex',flexDirection:'column'}}>
            {notFoundStatus || successStatus ? (
                <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {
                            successStatus && (
                                <Icon useFontAwesome={true} icon={faCheckCircle} color="#24B3A4" style={{marginBottom:20, width:"50px", height:"50px"}}/>
                            )
                        }
                        {
                            notFoundStatus && (
                                <Icon useFontAwesome={true} icon={faTimesCircle} color="#FF0000" style={{marginBottom:20, width:"50px", height:"50px"}}/>
                            )
                        }
                    </div>
                    {
                        successStatus && <span style={{ color: '#838383',fontSize:15,marginTop:10 }}>{localizedStrings.modalMessageReady}</span>
                    }
                    {
                        notFoundStatus && <span style={{ color: '#838383',fontSize:15,marginTop:10 }}>{notFoundStatusMessage || localizedStrings.modalMessageNotFound}</span>
                    }
                </div>
            ) :
                (
                    <div style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
                        <div style={{display: 'flex',justifyContent: 'center',marginBottom:20}}>
                             <CircularProgress size={50} />
                        </div>
                        <div>
                            <span style={{ color: '#838383',fontSize:15,marginTop:10 }}>{loadingText || localizedStrings.messageModalPleaseWait}</span>
                        </div>
                        { loadingPagination &&
                        <div style={{marginTop: "10px", textAlign: "center"}}>
                            <span style={{ color: '#838383',fontSize:15,marginTop:10 }}>{loadingPaginationText || "sem texto"}</span>
                        </div>
                        }
                    </div>
                )
            }
            <div style={{display:'flex',justifyContent:'center',marginTop:15}}>
                {(successStatus && showButton) && (
                    <Button
                        onClick={() => createXLSX({document, fileName, tabName, multipleTabs})}
                        backgroundColor="#192379"
                        color="#fff"
                        width="110px"
                        height="29px"
                        minWidth="41px"
                        padding="0"
                        marginLeft="5px"
                        title={localizedStrings.downloadReady}
                        textConfig={{fontWeight:'bold'}}
                    >
                    </Button>
                )}
            </div>

        </div>
    )
}
