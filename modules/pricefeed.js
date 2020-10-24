class feeds {
    constructor(options) {
        this.options = options
    }

    async init() {
        this.account = new this.options.BitSharesInstance(this.options.producer.name, this.options.producer.key);
        this.feeder = await this.options.BitSharesInstance.accounts[this.options.producer.name];
        console.log('account', this.feeder.id, this.feeder.name);

    }


}

module.exports = feeds;
