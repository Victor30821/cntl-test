import { isWithinInterval } from 'date-fns'

const remove_route_from_date = '2021-06-12T06:00:00';

export const removeOldApiReportsUntil = ({
    routes,
    is_authorized
}) => {

    if(is_authorized === false) return {
        routes_period_removed: routes,
    };
    
    const routes_period_removed = routes.filter(route => !isWithinInterval(new Date(route.start_date), { 
        start: new Date(remove_route_from_date),
        end: new Date(),
    }))
    
    
    return {
        routes_period_removed
    }
}

export const removeOldApiTrackingUntil = ({
    trackings,
    is_authorized
}) => {
    if(is_authorized === false) return {
        routes_period_removed: trackings,
    };
    
    const routes_period_removed = trackings.filter(route => !isWithinInterval(new Date(route.timestamp), { 
        start: new Date(remove_route_from_date),
        end: new Date(),
    }))
    
    
    return {
        routes_period_removed
    }
}