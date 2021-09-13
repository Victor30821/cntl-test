import { localizedStrings } from "constants/localizedStrings";

export const convertUserMaskToDateFns = ({
    mask = "",
    timeMask = ""
}) => {
    try {
        const toLowerCaseLetter = ["d", "y"]
        const formattedDate = mask
            .split("")
            .map(maskLetter => {
                if (toLowerCaseLetter.includes(maskLetter.toLowerCase())) return maskLetter.toLowerCase();
                return maskLetter;
            })
            .join("");

        if(timeMask.length > 0) {
            const formattedTime = timeMask
                .split("")
                // eslint-disable-next-line
                .map(maskLetter => {
                    if(timeMask.match('HH24')) {
                        if(maskLetter === 'H') {
                            return maskLetter.toUpperCase();
                        }
                    } else if (timeMask.match('HH:')) {
                        if(maskLetter === 'H') {
                            return maskLetter.toUpperCase();
                        }
                    }

                    if(maskLetter !== '2' && maskLetter !== '4') {
                        return maskLetter.toLowerCase();
                    }
                })
                .join("");

            return `${formattedDate} ${formattedTime}`;
        }

        return formattedDate;
    } catch (error) {
        console.log(error);
        return localizedStrings.dateMask
    }
}
