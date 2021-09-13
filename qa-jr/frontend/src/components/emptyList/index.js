
import React, { memo } from "react";
import { Text } from 'components';
import { 
    EmptyListErrorBox
} from './style.js';
import { localizedStrings } from 'constants/localizedStrings';

function EmptyList({
    history,
    errorTitle,
    errorStyle,
    lineStyle,
    listData = [],
    colorsList = ["#FFF","#F6F5FF"],
    loading,
    ...option
}) {
    const CONTELE_BLUE = "#1D1B84";

    const informationTextStyle = {
        fontWeight: 500,
        fontSize: '20px',
        color: CONTELE_BLUE,
    };

    const errorMessage = errorTitle || localizedStrings.usageAchievements.emptyList;

    const hasData = Array.isArray(listData) && listData.length > 0;

    const colorSetSize = (colorsList.length -1);

    let lineColor = -1;
    
    return (
        <div style={{ ...option.style }}>
            {(hasData && !loading) && listData.map((data, index) => {
                lineColor += 1;
                if(lineColor > colorSetSize) lineColor = 0;
                return(
                    <div style={{
                        backgroundColor: colorsList[lineColor],
                        ...lineStyle
                    }}
                    key={index}>
                        <div style={{ width: '100%' }}>
                            {data}
                        </div>
                    </div>
                );
            })}
            {(!hasData && !loading) &&
                <EmptyListErrorBox>
                    <Text style={informationTextStyle}>
                        {errorMessage}
                    </Text>
                </EmptyListErrorBox>
            }
            {loading &&
                <EmptyListErrorBox>
                    <Text style={informationTextStyle}>
                        {`${localizedStrings.loading} ...`}
                    </Text>
                </EmptyListErrorBox>
            }
        </div>
    )

}
export default memo(EmptyList);