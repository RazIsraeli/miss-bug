'use strict'

import { eventBus } from '../services/eventBus.service.js'
import { userService } from '../services/user.service.js'

import loginSignup from './login-signup.cmp.js'

export default {
  name: 'app-header',
  template: `
        <header>
            <h1>Miss Bug</h1>
            <p class="test-user">[for testing: username: <span>Mrp</span>, pass:<span> pleasure</span>]</p>
            <section v-if="user" className="welcome">
                <h3>Welcome {{user.fullName}}</h3>
                <button @click="logout" class="logout">LOGOUT</button>
            </section>    
            <login-signup v-else @onChangeLoginStatus="onChangeLoginStatus" />
        </header>
    `,
  data() {
    return {
      user: userService.getLoggedInUser(),
    }
  },
  methods: {
    onChangeLoginStatus() {
      this.user = userService.getLoggedInUser()
      eventBus.emit('onChangeLoginStatus')
    },
    logout() {
      userService.logout().then(() => {
        this.user = null
        eventBus.emit('onChangeLoginStatus')
      })
    },
  },
  components: {
    loginSignup,
  },
}
