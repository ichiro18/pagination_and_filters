<template>
    <ul class="flex flex-nowrap flex-auto justify-center items-center space-x-4 mt-5" v-if="total">

        <li v-if="pagination.currentPage > 1">
            <a class="block bg-white rounded-full py-0 px-6 hover:bg-green-700 hover:text-white"
               href="#"
               @click.prevent="routeTo(--pagination.currentPage)"
            >
                Prev
            </a>
        </li>

        <li v-for="page in pages[0]" :key="page">
            <a class="block bg-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-green-700 hover:text-white"
               :class="[ page === pagination.currentPage ? 'ring ring-green-700 ring-offset-4 ring-offset-green-100' : '']"
               href="#"
               @click.prevent="routeTo(page)"
            >
                {{ page }}
            </a>
        </li>

        <template v-if="pages[1]">
            <li>
                <a class="block bg-white rounded-full py-0 px-6 hover:bg-green-700 hover:text-white"
                   href="#"
                   @click.prevent="rewind"
                >
                    ...
                </a>
            </li>


            <template v-if="pagination.currentPage > 3 && pagination.currentPage < pages[1][0]">
                <li>
                    <a class="block bg-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-green-700 hover:text-white ring ring-green-700 ring-offset-4 ring-offset-green-100"
                       href="#"
                       @click.prevent="routeTo(pagination.currentPage)"
                    >
                        {{ pagination.currentPage }}
                    </a>
                </li>

                <li>
                    <a class="block bg-white rounded-full py-0 px-6 hover:bg-green-700 hover:text-white"
                       href="#"
                       @click.prevent="routeTo(pagination.currentPage + 3)"
                    >
                        ...
                    </a>
                </li>
            </template>

            <li v-for="page in pages[1]" :key="page">
                <a class="block bg-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-green-700 hover:text-white"
                   :class="[ page === pagination.currentPage ? 'ring ring-green-700 ring-offset-4 ring-offset-green-100' : '']"
                   href="#"
                   @click.prevent="routeTo(page)"
                >
                    {{ page }}
                </a>
            </li>
        </template>

        <li v-if="pagination.currentPage < pagination.pages">
            <a class="block bg-white rounded-full py-0 px-6 hover:bg-green-700 hover:text-white"
               href="#"
               @click.prevent="routeTo(++pagination.currentPage)"
            >
                Next
            </a>
        </li>

    </ul>
</template>

<script>

const DEFAULT_PAGE = 1;

export default {
    name: "Pagination",
    props: {
        perPage: {
            type: Number,
            default: 10,
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            pagination: {
                currentPage: 1,
                pages: 0,
                perPage: this.perPage,
            }
        }
    },
    computed: {
        pageCount() {
            return Math.floor(this.total / this.perPage)
        },
        pages() {
            const pageCount = Math.max(this.pageCount, 0);
            let res = [+pageCount];
            if (res[0] >= 6) {
                res[0] = [1, 2, 3]
                res[1] = [this.pageCount - 2, this.pageCount - 1, this.pageCount,]
            } else {
                res = [...Array(this.pageCount).keys()].map(item => 1 + item)
            }
            return res;
        }
    },
    methods: {
        parseUrl() {
            const {page} = this.$route.query;
            this.pagination.pages = Math.max(Math.floor(this.total / this.perPage), 0);
            this.pagination.currentPage = +page || 1;
            if (this.pagination.currentPage === DEFAULT_PAGE && !!page) {
                let query = Object.assign({}, this.$route.query);
                delete query.page;
                this.$router.replace({query});
            }

            this.$emit('paginate', this.preparePaginationData())
        },
        routeTo(page) {
            let targetPage = page;
            if (page <= 0) targetPage = 1;

            let query = Object.assign({}, this.$route.query);
            query.page = targetPage;
            if (targetPage === DEFAULT_PAGE && !!page) {
                delete query.page;
            }

            let targetUrl = this.$route.path;
            if (Object.keys(query).length) {
                const targetSearchParams = new URLSearchParams(query);
                targetUrl += `?${targetSearchParams}`
            }
            console.log('targetUrl', targetUrl);

            this.$router.push(targetUrl);
        },
        rewind() {
            return this.pagination.currentPage <= 3 ? this.routeTo(this.pagination.currentPage + 3) : this.routeTo(this.pagination.currentPage - 3)
        },
        preparePaginationData() {
            return {
                ...this.pagination,
                limit: this.pagination.perPage,
                offset: (this.pagination.currentPage - 1) * this.pagination.perPage,
            }
        }
    },
    watch: {
        '$route': {
            immediate: true,
            deep: true,
            handler() {
                this.parseUrl();
            }
        }
    }
}
</script>
