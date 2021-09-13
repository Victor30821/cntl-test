import cities from 'assets/cities.json';

const SPECIAL_CHARACTERS = /[\u0300-\u036f]/g;

const normalizeValues = (values) => values.map(value => value.toLowerCase().normalize("NFD").replace(SPECIAL_CHARACTERS, ""));

const getCityByName = ({
    name = ""
}) => {
    try {
        const regexName = new RegExp(normalizeValues([name]).shift());

        return cities.filter(city => {
            const normalizedValues = normalizeValues([city.state, city.label]);

            return normalizedValues.some(regexName.test.bind(regexName))
        });

    } catch (error) {
        console.log(error);
        return []
    }
};

const getExactCity = ({
    name = "",
}) => {
    try {
        const searchedCities = getCityByName({
            name,
        });

        return searchedCities
            .filter(city => {
                const [
                    label,
                    searchedName
                ] = normalizeValues([city.label, name]);

                return label.toLowerCase() === searchedName.toLowerCase()
            })
            .shift();

    } catch (error) {
        console.log(error);
        return {}
    }
};

export {
    cities,
    getCityByName,
    getExactCity,
    normalizeValues,
}