
import config from '../../config/config';
const httpUrl =  config.control.httpUrl;

export default class FetchUtil {

    static async request(method, url, data) {
        const param = {
            method: method,
            //credentials: 'include',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
            }
        };
        if (method === 'GET') {
            url += this.formatQuery(data);
        } else {
            param['body'] = JSON.stringify(data);
        }
        return fetch(httpUrl + url, param).then(response => this.isSuccess(response))
            .then(response => {
                return response.json()
            });
    }

    // 判断请求是否成功
    static isSuccess(res) {
        if (res.status >= 200 && res.status < 300) {
            return res
        } else {
            this.requestException(res)
        }
    }

    // 处理异常
    static requestException(res) {
        const error = new Error(res.statusText);
        error.response = res;
        throw error;
    }

    // url处理
    static formatQuery(query) {
        let params = [];

        if (query) {
            for (let item in query) {
                let vals = query[item];
                if (vals !== undefined) {
                    params.push(item + '=' + query[item])
                }
            }
        }
        return params.length ? '?' + params.join('&') : '';
    }

    //
    static  decodeQuery(queryStr){
        let query = {}
        // 中文需解码
        queryStr = decodeURI(queryStr.replace('?', ''))
        let queryArr = queryStr.split('&')
        queryArr.forEach(item => {
            let keyAndValue = item.split('=')
            query[keyAndValue[0]] = keyAndValue[1]
        });
        return query;
    }
    // 处理 get 请求
    static async get(url, data) {
        return this.request('GET', url, data)
    }

    // 处理 put 请求
    static async put(url, data) {
        return this.request('PUT', url, data)
    }

    // 处理 post 请求
    static async post(url, data) {
        return this.request('POST', url, data)
    }

    // 处理 patch 请求
    static async patch(url, data) {
        return this.request('PATCH', url, data)
    }

    // 处理 delete 请求
    static async delete(url, data) {
        return this.request('DELETE', url, data)
    }
}