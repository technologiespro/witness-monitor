class feeds {
    constructor(options) {
        this.options = options
    }

    async init() {
        this.user = new this.options.BitSharesInstance(this.options.producer.name, this.options.producer.key);

    }


}

module.exports = feeds;
