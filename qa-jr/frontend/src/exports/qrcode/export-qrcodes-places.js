import { api } from '../../services/api';

export const ExportQrCode = ({
    setStatusSuccessQrCode,
    client_ids,
    organization_id,
    status,
}) => {

    const loadPlacesQrCodes = async () => {
        try {

            const params = {
                limit: 10000,
                offset: 0,
                organization_id,
                client_ids,
                status: status
                    ? 1
                    : [1, 0]
            };
    
            const URL = "/place/v1";
    
            const {
                data: { places }
            } = await api.get(URL, { params });

            const place_ids = places.map(place => place.id);

            const URL_QR_CODE = "/place/v1/generate-list-qr-codes";

            const {
                data: { url_signed = "" }
            } = await api.post(URL_QR_CODE, { place_ids });

            window.open(url_signed, '_blank');

            setStatusSuccessQrCode({success:true});
            
        } catch (error) {
            console.error('[error] on trying to export qr codes: ' + error);
            setStatusSuccessQrCode({notFound:true});
        }
    }

    const init = async () => (await loadPlacesQrCodes());

    init();
}
