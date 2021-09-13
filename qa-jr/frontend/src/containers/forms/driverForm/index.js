import React from 'react';
import { Card, CardTitle, CardForm, CardInput } from '../../../components'

export default function DriverForm({ title, onSubmit, inputsConfig, formId }) {


    return (
        <Card >
            <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"} >
                {title}
            </CardTitle>
            <CardForm id={formId} onSubmit={onSubmit}>
                {inputsConfig.inputs.map((inputList, index) => {
                    return (
                        <CardInput
                            key={index}
                            onChange={inputsConfig.onChange}
                            register={inputsConfig.register}
                            inputs={inputList}
                            marginRight={'10px'}
                            marginBottom={'10px'}
                            />
                    )
                })}
            </CardForm>
        </Card>
    );
}
