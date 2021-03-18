import React, {useState, useEffect} from 'react';
import * as moment from 'moment';
import { Field } from 'react-final-form';

const FieldTimeRange = (props) => {
    const {onChangeTime, nameSelectStart, nameSelectEnd} = props;
    const [valueTime, setValueTime] = useState({startHour: "00:00",endHour: "00:00"})
    const {startDate} = props.bookingDates || {};

    const onInitRangeStart = (startDate) => {
        const dayStart = moment(startDate);
        const today = moment();
        const arrHourStart = [];
        const arrHourEnd = [];

        if(dayStart.startOf('day').isSame(today.startOf('day'))) {
            if(moment().minutes() <= 30){
                arrHourStart.push(moment().hours()+':'+'30');
                for(let hour = moment().hours() + 1; hour < 24; hour ++ ){
                    arrHourStart.push(hour+':'+'00');
                    arrHourStart.push(hour+':'+'30');
                }
            }
            if(moment().minutes() > 30){
                for(let hour = moment().hours() + 1; hour < 24; hour ++ ){
                    arrHourStart.push(hour+':'+'00');
                    arrHourStart.push(hour+':'+'30');
                }
            }
        }else {
            for(let hour = 0; hour < 24; hour ++ ){
                arrHourStart.push(hour+':'+'00');
                arrHourStart.push(hour+':'+'30');
            }
        }

        for(let hour = 0; hour < 24; hour++) {
            arrHourEnd.push(hour+':'+'00');
            arrHourEnd.push(hour+':'+'30');
        }

        return {arrHourStart, arrHourEnd};
    } 

    const render = () => {
        const {arrHourStart, arrHourEnd} = startDate ? onInitRangeStart(startDate) : {};
        return (
            <div>
                <div>
                    <label>Start hour</label>
                    <Field name={nameSelectStart} component="select">
                        { 
                            arrHourStart &&
                            arrHourStart.map((item, key) => {
                                return <option key={key} value={item}>{item}</option>
                            })
                        }  
                    </Field>
                </div>
                <div>
                    <Field name={nameSelectEnd} component="select">
                        { 
                            arrHourEnd &&
                            arrHourEnd.map((item, key) => {
                                return <option key={key} value={item}>{item}</option>
                            })
                        }  
                    </Field>
                </div>
            </div>            
        );
    }

    return render();
};

export default FieldTimeRange;