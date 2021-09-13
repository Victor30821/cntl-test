export function getLabelCode() {
    const letters = '0123456789abcdefghijklmnopqrstuvxwyz';
    const labelCode = [];
    for (let i = 0; i < 4; i++) {
        labelCode.push(letters[Math.floor(Math.random() * 16)])
    }
    return labelCode.join('');
}