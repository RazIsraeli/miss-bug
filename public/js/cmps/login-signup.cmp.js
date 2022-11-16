import { userService } from '../services/user.service.js'
import {
  showErrorMsg,
  showSuccessMsg,
  eventBus,
} from '../services/eventBus.service.js'

export default {
  name: 'login-signup',
  props: [],
  template: `
  <section className="login-signup">
   <div className="user-forms">
       <section className="login-form">
           <form @submit.prevent="login" class="login-signup-form">
               <legend>Login</legend>
               <input v-model="credentials.username" type="text" placeholder="Username" />
               <input v-model="credentials.password" type="text" placeholder="Password" />
               <button>LOGIN</button>
            </form>
        </section>
        <div className="or"></div>
        <section className="signup-form">
            <form @submit.prevent="signUp" class="login-signup-form">
                <legend>Sign-Up</legend>
                <input v-model="signupInfo.fullName" type="text" placeholder="Full Name" />
                <input v-model="signupInfo.username" type="text" placeholder="Username" />
                <input v-model="signupInfo.password" type="text" placeholder="Password" />
                <button>SIGN UP</button>
            </form>    
        </section>
    </div> 
  </section>
`,
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      signupInfo: {
        fullName: '',
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      userService
        .login(this.credentials)
        .then((user) => this.$emit('onChangeLoginStatus'))
        .catch((err) => {
          showErrorMsg("Can't log in...")
        })
    },
    signUp() {
      userService
        .signup(this.signupInfo)
        .then((user) => this.$emit('onChangeLoginStatus'))
        .catch((err) => {
          showErrorMsg("Can't sign up...")
        })
    },
  },
  computed: {},
  components: {},
}
