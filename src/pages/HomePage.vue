<template>
  <div class="flex h-screen bg-green-100 page-wrapper">
    <div class="container mx-auto">
      <div class="grid grid-cols-3 gap-4 pt-5 cards">
        <div
          class="bg-white p-6 rounded-lg shadow-lg overflow-clip overflow-hidden max-h-64"
          v-for="(item, index) in items"
          :key="index"
        >
          <h2 class="text-2xl font-bold mb-2 text-gray-800">{{ item.title }}</h2>
          <p class="text-gray-700">{{ item.body }}</p>
        </div>
      </div>
      <pagination :per-page="9" @paginate="onPaginate" :total="totalPages" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '@/components/Pagination';

export default {
  name: 'HomePage',
  components: { Pagination },
  data() {
    return {
      items: [],
      totalPages: 0,
    };
  },
  methods: {
    loadData(pagination = {}, filters = {}) {
      const searchParams = new URLSearchParams({ ...pagination, ...filters });
      console.log(searchParams.toString());
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/?${searchParams.toString()}`)
        .then((res) => {
          if (res.status === 200) {
            this.items = res.data;
            if (res.headers['x-total-count']) {
              this.totalPages = +res.headers['x-total-count'] || 0;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onPaginate(config) {
      const pagination = {
        _start: config.offset,
        _limit: config.limit,
      };
      this.loadData(pagination);
    },
  },
  mounted() {},
};
</script>
