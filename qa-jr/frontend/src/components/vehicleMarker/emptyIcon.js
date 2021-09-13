export const getIcon = ({name}) => {
    const icon = {
        "marker-1": "carro",
        "marker-2":"carro",
        "alfinete-1":"carro",
        "alfinete-2":"carro",
        "ambulancia-1":"van",
        "ambulancia-2":"van",
        "carro":"carro",
        "caminhao":"caminhao",
        "caminhao-grande": "caminhao-grande",
        "caminhao-frente-1":"caminhao-grande",
        "caminhao-frente-2":"caminhao-grande",
        "caminhao-frente":"caminhao-grande",
        "caminhao-1":"caminhao-grande",
        "caminhao-2":"caminhao-grande",
        "caminhao-3":"caminhao-grande",
        "caminhao-4":"caminhao-grande",
        "caminhao-betoneira-1":"caminhao-grande",
        "caminhao-lixo-1": "caminhao",
        "caminhao-obras-1":"caminhao",
        "carro-frente-1":"carro",
        "carro-passeio-1":"carro",
        "carro-passeio-2":"carro",
        "carro-passeio-3":"carro",
        "escavadeira-1":"maquina",
        "escavadeira-2":"maquina",
        "maquina":"maquina",
        "motocicleta-frente-1":"motocicleta",
        "motocicleta":"motocicleta",
        "motocicleta-1":"motocicleta",
        "motocicleta-2":"motocicleta",
        "motocicleta-3":"motocicleta",
        "motocicleta-4":"motocicleta",
        "onibus-1":"van",
        "onibus-2":"van",
        "onibus-frente-1":"van",
        "onibus-frente-2":"van",
        "picape-frente-1":"van",
        "picape-1":"van",
        "picape-2":"van",
        "taxi-frente-1":"carro",
        "taxi-frente-2":"carro",
        "trator-1":"maquina",
        "trator-frente-1":"maquina",
        "van":"van",
        "van-1":"van",
        "van-2":"van",
        "van-frente-1":"van",
        "van-frente-2":"van"
    };
    return icon?.[name] || icon?.['carro'];
}