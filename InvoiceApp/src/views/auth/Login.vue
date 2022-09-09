<template>
    <div class="login container flex-column flex">
        <div class="info-login">
            <span>Jeśli chcesz zarejstrować pracownika <router-link class="nav-link" :to="{ name: 'RegisterStaff'}">
                Rejestracja
            </router-link></span>
        </div>
        <form class="flex flex-column" @submit.prevent="login">
            <h1>Login</h1>
            <div class="item flex flex-column">
                <label for="email">E-mail</label>
                <input  type="email"  id="email"  v-model="login_form.email"/>
            </div>
            <div class="item flex flex-column">
                <label for="password">Password</label>
                <input  type="password"  id="password"  v-model="login_form.password"/>
            </div>
            <div v-if="errorMsg" class="error-massega">
                <p>{{ errorMsg }}</p>
            </div>
            <button type="submit" class="button blue">Login</button>
        </form>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from 'vuex';

const store = useStore();

const errorMsg = computed(() => store.state.RegisterStaff.errorMsg)
const login_form = ref({
    email: null,
    password: null,
})




const submitForm = () => {}
const login =  () => {
    store.dispatch('RegisterStaff/login', login_form.value);
};



</script>

<style lang="scss" scoped>
.login {
    position: relative;
    top: 20%;
    background-color: #30483f;
    border: none;
    border-radius: 24px;
    color: #fff;
    @media (max-width: 900px) {
        left: 24px;
    }
    .error-massega {
        color: rgb(201, 21, 21);
        font-weight: bold;
        margin: 2rem 0;
        font-size: 1.2rem;
    }
    .info-login {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        .nav-link {
            text-transform: uppercase;
            text-decoration: none;
            color: #81CACF;
        }
    }
    

    h1 {
        margin: 0 auto;
        text-transform: uppercase;
    }
    label,
    input {
        // margin-top: 1.2rem;
        padding: 0.4rem;
    }
    label {
        font-size: 1.2rem;
        font-weight: bold;
        margin-top: 1rem;
    }

    

    form {
        padding: 2.4rem 1.7rem;

        .item {
            margin-bottom: 2rem;
        }
    }
}
</style>