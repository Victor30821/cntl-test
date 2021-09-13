import React from 'react';
import {
    Col,
    DateInput,
    ReportCard,
    ButtonWithIcon,
    Card,
    CardForm,
    Icon,
} from 'components'
import { useSelector } from 'react-redux';
import { Row, } from "reactstrap";
import { localizedStrings } from 'constants/localizedStrings'

export default function ReportsKmForm ({
    onSubmit,
    inputsConfig,
    filtersDate,
    handleDate,
    handleDrawer,
    showAdvancedFiltersDrawer,
    showClearFilters,
    clearFilters,
	loading,
 }) {
    const {
        summary,
        loadLoading,
    } = useSelector(state => state.kmReports);

    return (
        <div style={{ padding: "0 25px" }}>
            <Card marginRight={'0px'} marginLeft={'0px'}>
                <CardForm>
                    <Row>
                        <Col style={{paddingLeft:0,paddingRight:0, display:'flex', justifyContent:'space-between', alignItems: "flex-end"}}>
                            <div style={{display: "flex", alignItems: "flex-end"}}>
                                <DateInput
                                    type={'dateRangePicker'}
                                    register={inputsConfig.register}
                                    isMulti={true}
                                    label={localizedStrings.selectPeriod}
                                    onChange={handleDate}
                                    name={"kmDate"}
                                    id={"kmDate"}
                                    monthDefault={true}
                                    placeholder={"dd/mm/aaaa"}
                                    value={filtersDate}
                                    divStyles={{width: "20rem"}}
                                />
                                <Icon
                                    divProps={{ padding: "9px 9px 9px 9px", marginLeft: "9px", border: ".5px solid #eff0f0", borderRadius: "6px", backgroundColor: showAdvancedFiltersDrawer ? "#1A237A" : "white" }}
                                    icon={'filter'}
                                    width={'16px'}
                                    height={'16px'}
                                    color={showAdvancedFiltersDrawer ? "white" : "#1A237A"}
                                    cursor="pointer"
                                    onClick={handleDrawer}
                                />
                                <span
                                    style={{
                                      fontSize: ".8rem",
                                      color: "red",
                                      cursor: "pointer",
                                      margin: ".8rem",
                                      fontWeight: "bold",
                                      visibility: showClearFilters(),
                                    }}
                                    onClick={clearFilters}
                                >
                                  X {localizedStrings.clearFilters}
                                </span>
                            </div>
                            <ButtonWithIcon
                                icon={"list"}
                                title={localizedStrings.generateReport}
                                onClick={() => onSubmit()}
                                disabled={loadLoading || loading}
                            />
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            <Row>
                <Col md="3" className="md-3">
                    <ReportCard
                        title={localizedStrings.travelledDistance}
                        value={summary?.distance}
                        icon={"road"}
                        type={"distance"}
                        iconStyle={{
                            right: "15px"
                        }}
                    />
                </Col>
                <Col md="3" className="md-3">
                    <ReportCard
                        title={localizedStrings.realTotalExpenses}
                        value={summary?.cost}
                        type={"cost"}
                        icon={"money"}
                        iconStyle={{
                            right: "-15px"
                        }}
                    />
                </Col>

            </Row>
        </div>
    );
}
