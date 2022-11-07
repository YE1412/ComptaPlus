<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router/index";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
import StartContentLoginItem from "./StartContentLoginItem.vue";
import UserIcon from "./icons/IconUser.vue";
import LockIcon from "./icons/IconLock.vue";
import ModalItem from "./ModalItem.vue";

export default defineComponent({
	name: "StartContent",
	setup() {
  	const store = useUserStore();

  	return { store };
	},
	components: {
		RouterLink,
		StartContentLoginItem,
		UserIcon,
		LockIcon,
		ModalItem,
	},
	data() {
		return {
			login: "",
			password: "",
			loginModal: false
		};
	},
	methods: {
		register(e: Event) {
			if (this.login !== "" && this.password !== ""){
				this.store
				.registerUser(this.login, this.password)
				.then((res) => {
				    this.store.connected = true;
				    this.store.user = res;
				    router.push("/");
				    // console.log(this.store);
				},() => {
				    this.store.connected = false;
				    this.loginModal = true;
				    // console.log(this.store);
				})
				.catch((err) => {
					this.store.connected = false;
					this.loginModal = true;
					// console.log(this.store);
				});
			}else{
				console.log("empty strings !");
				this.loginModal = true;
			}
		},
		modalChange(val: Boolean){
			this.loginModal = val;
		}
	}
});
</script>

<i18n>
{
  "en": {
    "login_submit_text": "Sign In",
    "login_placeholder": "Login",
    "password_placeholder": "Password",
    "not_yet": "Not registred yet?",
    "register": "Sign Up",
    "register_path": "/register",
    "modalTitle": "Error !",
    "modalContent": "Error while siging in : Bad Login and/or paswword !",
    "modalCloseBtnText": "Close"
  },
  "fr": {
    "login_submit_text": "Se connecter",
    "login_placeholder": "Login",
    "password_placeholder": "Mot de passe",
    "not_yet": "Pas encore inscrit ?",
    "register": "S'inscrire",
    "register_path": "/inscription",
    "modalTitle": "Erreur !",
    "modalContent": "Erreur lors de la connexion : Login et/ou Mot de passe incorrect !",
    "modalCloseBtnText": "Fermer"
  }
}
</i18n>

<template>
  <div class="cont">
    <div class="demo">
      	<div class="login">
	        <div class="login__check">	
	        </div>
	        <div class="login__form">
	        	<StartContentLoginItem>
	        		<template #loginIcon>
	        			<UserIcon />
	        		</template>
	        		<template #loginInput>
	        			<input v-model="login" type="text" class="login__input name" :placeholder="$t('login_placeholder')"/>
	        		</template>
	        	</StartContentLoginItem>
	        	<StartContentLoginItem>
	        		<template #loginIcon>
	        			<LockIcon />
	        		</template>
	        		<template #loginInput>
	        			<input v-model="password" type="password" class="login__input pass" :placeholder="$t('password_placeholder')"/>
	        		</template>
	        	</StartContentLoginItem>
		    		<button @click="register($event)" type="button" class="login__submit">{{ $t('login_submit_text') }}</button>
		    		<p class="login__signup">{{ $t('not_yet') }} &nbsp;
			    			<RouterLink :to="$t('register_path')">{{ $t('register') }}</RouterLink>
		    		</p>
	    		</div>
      	</div>
    </div>
  </div>
  <ModalItem
  	@loginModal="modalChange"
  	input="loginModal"
  	id="loginModal"
  	tabIndex="-1"
  	labelledBy="loginModal"
  	:model="loginModal"
  	:centered="true"
  	:modalTitle="$t('modalTitle')"
		:modalContent="$t('modalContent')"
		:modalCloseBtnText="$t('modalCloseBtnText')"
		:staticBackdrop="true">
  </ModalItem>
</template>
