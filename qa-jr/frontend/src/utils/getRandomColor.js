export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    const color = ['#'];
    for (let i = 0; i < 6; i++) {
        color.push(letters[Math.floor(Math.random() * 16)])
    }
    return color.join('');
}