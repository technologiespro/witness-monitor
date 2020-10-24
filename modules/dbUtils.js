class dbUtils {
    constructor(db) {
        this.db = db
    }

    async dbGet(key) {
        let result = null;
        try {
            result = await this.db.get(key)
        } catch(e) {
            result = null
        }
        return result
    }

    async dbObj(from, to, limit = 10000) {
        return new Promise((resolve, reject) => {
            let result = {};
            this.db.createReadStream({gte: from + 'x', lt: to + 'x', "limit": limit})
                .on('data', function (data) {
                    result[data.key] = data.value
                })
                .on('error', function (err) {
                    reject([]);
                })
                .on('end', function () {
                    resolve(result);
                });
        });
    }

    async dbArray(from, to, limit = 10000) {
        return new Promise((resolve, reject) => {
            let result = [];
            this.db.createReadStream({limit: limit, gte: from + 'x', lt: to + 'x'})
                .on('data', function (data) {
                    result.unshift(data.value)
                })
                .on('error', function (err) {
                    reject([]);
                })
                .on('end', function () {
                    resolve(result);
                });
        });
    }

}

module.exports = dbUtils;
