<template>
    <div class="login container flex-column flex">
        <div class="info-login">
            <span>Jeśli juz masz konto <router-link class="nav-link" :to="{ name: 'Login'}">
                Logowanie
            </router-link></span>
        </div>
        <form class="flex flex-column" @submit.prevent="register">
            <h1>Register Staff</h1>
            <div class="item flex flex-column">
                <input  type="email"  id="email" placeholder="E-mail"  v-model="register_form.email"/>
            </div>
            <div class="item flex flex-column">
                <input  type="password"  id="password" placeholder="Password"  v-model="register_form.password"/>
            </div>
            <button type="submit" class="button blue">Register</button>
        </form>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from 'vuex';

const store = useStore();
const register_form = ref({
    email: null,
    password: null
})



const register =  () => {
    store.dispatch('RegisterStaff/register', register_form.value);
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