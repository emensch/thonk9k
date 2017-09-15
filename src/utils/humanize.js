export default num => {
    const strNum = parseInt(num, 10).toFixed(2).toString();
    const places = strNum.indexOf('.');

    if (places < 7) {
        // I absolutely ripped this regex off StackOverflow
        return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const truncated = num / 10 ** (Math.floor((places - 1)/3) * 3);
    return truncated.toFixed(2) + (places > 9 ? 'b' : 'm');
}