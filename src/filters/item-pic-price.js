/**
 * ItemPrice
 * @param {*} Price 绑定类型
 */

export default (Price) => {
    let zhuan = parseInt(Price / 100 / 100 / 10000) || 0;
    let jin = parseInt((Price / 100 / 100) % 10000) || 0;
    let yin = parseInt((Price / 100) % 100) || 0;
    let tong = parseInt(Price % 100) || 0;

    return {
        zhuan,
        jin,
        yin,
        tong,
    };
};
