/**
 * 剑三描述 转 纯描述
 *
 * @param {*} description 剑三描述
 */

export default (description) => {
    if (!description) return '';
    return description;

    let dom = document.createElement("span");
    dom.innerHTML = description.replace(/<text>(.*?)<\/text>/ig, '<span $1></span>');
    let nodes = dom.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        // 标签正文
        let innerHTML = nodes[i].getAttribute('text').replace(/\\n/g, "<br>").replace(/\\\\/g, '');
        nodes[i].removeAttribute('text');

        let sub_dom = null;
        //if (nodes[i].getAttribute('name') == 'iteminfolink' && nodes[i].getAttribute('script')) {
        //    let matches = /this\.dwIndex=(\d+)/.exec(nodes[i].getAttribute('script'));
        //    if (matches.length >= 2) {
        //        sub_dom = document.createElement("a");
        //        sub_dom.innerHTML = innerHTML;
        //        sub_dom.href = `${JX3BOX.__Root}item#/view/${matches[1]}`;
        //    }
        //}

        // 标签着色
        if (
            nodes[i].getAttribute('r') >= 0 &&
            nodes[i].getAttribute('g') >= 0 &&
            nodes[i].getAttribute('b') >= 0
        ) {
            let color = `rgb(${nodes[i].getAttribute('r')},${nodes[i].getAttribute('g')},${nodes[i].getAttribute('b')})`;
            if (sub_dom) {
                sub_dom.style.color = color;
                sub_dom.style['font-weight'] = 'bold';
            } else {
                nodes[i].style.color = color;
            }
        }

        // 标签内容
        if (sub_dom) {
            nodes[i].appendChild(sub_dom);
        } else {
            nodes[i].innerHTML = innerHTML;
        }
    }

    console.log(555, dom);
    return dom.innerHTML;

    // let output = '';
    // let matchs = description.match(/text="(.*?)(\\\\\\n)?"/ig);
    // for (let i in matchs) {
    //     let ms = /text="((.*?)(\\\\\\n)?)"/ig.exec(matchs[i]);
    //     if (ms && ms.length > 1) matchs[i] = ms[1].trim();
    //     if (matchs[i]) output += matchs[i].replace(/\\n/g, "<br>").replace(/\\\\/g, '');
    // }
    // return output;
}

