<template>
  <products-slider
    :products="products"
    :config="sliderConfig"
    :title="title"
  />
</template>
<script>

import ProductsSlider from 'theme/components/core/ProductsSlider'
import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'

export default {
  name: 'Collection',
  props: {
    title: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      products: [],
      sliderConfig: {
        perPage: 1,
        perPageCustom: [[576, 2], [1024, 4]],
        paginationEnabled: false,
        loop: true
      }
    }
  },
  computed: {
    currentIndex: {
      cache: false,
      get () {
        return this.$refs.carousel ? this.$refs.carousel.currentPage : 0
      }
    }
  },
  async beforeMount () {
    let inspirationsQuery = prepareQuery({queryConfig: 'inspirations'})

    const res = await this.$store.dispatch('product/list', {
      query: inspirationsQuery,
      size: 12,
      sort: 'created_at:desc'
    })
    if (res) {
      this.products = res.items
    }
  },
  components: {
    ProductsSlider
  }
}
</script>
