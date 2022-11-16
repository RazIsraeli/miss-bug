'use strict'
import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { eventBus, showErrorMsg } from '../services/eventBus.service.js'

import bugList from '../cmps/bug-list.cmp.js'
import bugFilter from '../cmps/bug-filter.cmp.js'

export default {
  name: 'bug-app',
  template: `
    <section class="bug-app" v-if="user">
      <div class="subheader">
          <button @click="downloadList" class="download-list" title="download bugs list as PDF"></button>
          <bug-filter @setFilterBy="setFilterBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
        <div className="paging">
          <button @click="setPage(-1)">Prev</button>
          <button @click="setPage(1)">Next</button>
        </div>
    </section>
    `,
  data() {
    return {
      bugs: null,
      filterBy: {
        title: '',
        severity: 3,
        page: 0,
      },
      totalPages: 0,
      user: userService.getLoggedInUser(),
    }
  },
  created() {
    this.loadBugs()
    eventBus.on('onChangeLoginStatus', this.onChangeLoginStatus)
  },
  methods: {
    loadBugs() {
      bugService.query(this.filterBy).then(({ totalPages, filteredBugs }) => {
        this.totalPages = totalPages
        this.bugs = filteredBugs
      })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, page: this.filterBy.page }
      this.loadBugs()
    },
    removeBug(bugId) {
      const user = userService.getLoggedInUser()
      bugService
        .remove(bugId, { ...user })
        .then(() => this.loadBugs())
        .catch(showErrorMsg)
    },
    setPage(dir) {
      this.filterBy.page += +dir
      if (this.filterBy.page > this.totalPages - 1) this.filterBy.page = 0
      if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
      this.loadBugs()
    },
    downloadList() {
      bugService
        .downloadList(this.filterBy)
        .then(() => console.log('downloading bugs list...'))
    },
    onChangeLoginStatus() {
      this.user = userService.getLoggedInUser()
    },
  },
  computed: {
    // bugsToDisplay() {
    //   //prevent issues with rendering page when the filter is NULL
    //   if (!this.filterBy || (!this.filterBy.title && !this.filterBy.severity))
    //     return this.bugs
    //   //filter bugs by title
    //   const regex = new RegExp(this.filterBy.title, 'i')
    //   let bugs = this.bugs.filter(
    //     (bug) => regex.test(bug.title) || regex.test(bug.description)
    //   )
    //   //filter bugs by severity
    //   bugs = bugs.filter((bug) => bug.severity <= this.filterBy.severity)
    //   return bugs
    // },
  },
  components: {
    bugList,
    bugFilter,
  },
}
