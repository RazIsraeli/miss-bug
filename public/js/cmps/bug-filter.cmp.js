'use strict'

export default {
  name: 'bug-filter',
  template: `
        <section class="bug-filter">
            <label>Filter</label>
            <input @input="setFilterBy" type="text" v-model="filterBy.title" placeholder="filter by text">
            <input @input="setFilterBy" type="number" v-model="filterBy.severity" placeholder="filter by severity 1-3" />
        </section>
    `,
  data() {
    return {
      filterBy: {
        title: '',
        severity: 3,
      },
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
  },
}
