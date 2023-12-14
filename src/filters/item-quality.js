/**
 * ItemQuality
 * @param {*} Quality 品质
 */

export default (Quality) => {
    switch (Quality) {
        case 0:
            return '破败';
        case 1:
            return '普通';
        case 2:
            return '精巧';
        case 3 :
            return '卓越';
        case 4:
            return '珍奇';
        case 5:
            return '稀世';
        default:
            return '未知'
    }
}

