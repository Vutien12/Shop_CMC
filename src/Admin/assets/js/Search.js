export default class SearchModule {
    constructor(options = {}) {
        // Default config
        this.config = {
            selectors: {
                input: '#dt-search',
                loading: '.search-loading'
            },
            debounceTime: 300,
            minLength: 2,
            ...options
        };

        // Bind methods to maintain context
        this.handleSearch = this.handleSearch.bind(this);
        this.init = this.init.bind(this);
    }

    /**
     * Khởi tạo module
     * @returns {SearchModule}
     */
    init() {
        $(this.config.selectors.input).on('keyup',
            this.debounce(this.handleSearch, this.config.debounceTime)
        );
        return this;
    }

    handleSearch(event) {
        if (event.key !== 'Enter') return;

        const keyword = $(this.config.selectors.input).val().trim();

        this.updateURL(keyword);
    }

    updateURL(keyword) {
        try {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            if (keyword) {
                params.set('keyword', keyword);
            } else {
                params.delete('keyword');
            }

            // Lọc params rỗng
            const cleanParams = this.cleanParams(params);

            window.location.href = `${url.pathname}${cleanParams ? '?' + cleanParams : ''}`;
        } catch (error) {
            console.error('Error updating URL:', error);
        }
    }

    cleanParams(params) {
        return Array.from(params.entries())
            .filter(([_, value]) => value)
            .reduce((acc, [key, value]) => {
                acc.set(key, value);
                return acc;
            }, new URLSearchParams())
            .toString();
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}
