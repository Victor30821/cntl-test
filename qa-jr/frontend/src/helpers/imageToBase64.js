export async function imageToBase64 (img) {
    const reader = new FileReader();
    let base = {};
    reader.readAsDataURL(img);
    await (reader.onload = async () => {
        base.base64 = reader.result.split(',')[1];
    });

    return base;
}