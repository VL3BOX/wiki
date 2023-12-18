export const ellipsis = (value) => {
    value = value ? value.trim().replace(/<[^>]*>/g, '') : "";
    if (value.length > 100) {
        return value.slice(0, 100) + "...";
    }
    return value;
}
