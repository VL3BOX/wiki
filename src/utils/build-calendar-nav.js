/**
 * 构建日历侧边栏
 * @param {number} start 开始年份
 * @param {number} end 结束年份
 */
function buildCalendarNav({ start = 2009, end }) {
    let arr = [];

    for (let year = end; year >= start; year--) {
        arr.push({
            label: `${year}年`,
            key: year,
            app: "calendar",
            type: "calendar",
            children: buildYearData(year),
        });
    }

    return arr;
}

function buildYearData(year) {
    let data = [];

    for (let month = 1; month <= 12; month++) {
        data.push({
            label: `${month}月`,
            year: year,
            month: month,
            key: `${year}_${month}`,
            path: `/archive/${year}/${month}/1`,
            count: 0,
            app: "calendar",
        });
    }

    return data;
}

export default buildCalendarNav;
