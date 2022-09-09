<template>
    <aside class="flex flex-column" :class="`${activeMenu && 'active-menu'}`">
        <div class="logo flex">
            <img src="../assets/file-invoice-dollar-solid.png" alt="">
        </div>
        <div class="menu-toggle-wrapper flex" @click="toggleIcon">
            <div class="menu-toggle">
                <span class="material-icons">
                    keyboard_double_arrow_right
                </span>
            </div>
        </div>
        <h3>Menu</h3>
        <div class="menu">
            <router-link class="button-sidebar" :to="{ name: 'Home'}">
                <span class="material-icons">
                    home
                </span>
                <span class="text">Home</span>
            </router-link>
            <router-link  class="button-sidebar" :to="{ name: 'NewInvoice'}">
                <span class="material-icons">
                    screenshot_monitor
                </span>
                <span class="text">Nowa Faktura</span>
            </router-link>

        </div>

        <div class="flex-1">
        </div>

        <div class="menu">
            <router-link  v-if="!staff" class="button-sidebar" :to="{ name: 'Login'}">
                <span class="material-icons">
                    login
                </span>
                <span class="text">Logowanie</span>
            </router-link>
            <li @click="logout" v-if="staff"  class="button-sidebar">
                <span class="material-icons">
                    logout
                </span>
                <span class="text">Wyloguj</span>
            </li>
        </div>

    </aside>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { auth } from '../firebase/init.js'

const store = useStore();
const router = useRouter();
const activeMenu = ref(localStorage.getItem('activeMenu') === 'true')



const staff = ref(store.state.RegisterStaff.staff)
console.log(staff)

const toggleIcon = () => {
    activeMenu.value = !activeMenu.value
    localStorage.setItem('activeMenu', activeMenu.value)
}

const logout = () => {
    store.dispatch('RegisterStaff/logout')
}

</script>

<style lang="scss" scoped>
aside {

    width: calc(2rem + 32px);
    padding: 1rem;
    overflow: hidden;
    min-height: 100vh;
    background-color: #5A8F7B;
    position: fixed;
    color: #ffff;
    z-index: 1001;
    
        .logo {
        position: relative;
        border-radius: 0 20px 20px 0;
        margin-bottom: 1rem;
        top: -1rem;
        left: -1rem;
        height: 80px;
        width: 50px;
        background-color: #81CACF;
        padding: 2rem;
        justify-content: center;

        
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 2rem;
            }
        }
        
        h3 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            color: #fff;
        }
        .menu-toggle-wrapper {
            justify-content: flex-end;
            margin-bottom: 1rem;
            position: relative;
            top: 0;
            left: 0;
            transition:  .2s ease-in;
            .menu-toggle {
                transition:  .4s ease-out;
                .material-icons {
                    cursor: pointer;
                    font-size: 3rem;
                    color: #fff;
                }
                &:hover {
                    .material-icons {
                        color: #81CACF;
                        
                        transform: translateX(0.5rem);
                        transition: .4s ease-out;
                    }
                }
            }
        }
        .flex-1 {
            flex: 1 1 0;
        }
        h3, .button-sidebar .text {
            opacity: 0;
            transition: .3s ease-in;
        }
        .menu {
            // margin: 0 -1rem;
            display: flex;
            flex-direction: column;
            gap: 2rem 0;
            
            .button-sidebar {
                display: flex;
                align-items: center;
                text-decoration: none;
                margin-left: -0.7rem;
                transition: all 0.2s ease-in-out;
                // padding: 0.5rem 1rem;
                .material-icons {
                    font-size: 3rem;
                    color: #fff;
                    transition: all 0.5s ease-in-out;
                }
                .text {
                    color: #fff;
                    margin-left: 1rem;
                    transition: all  0.5s ease-in-out;
                }
                &:hover {
                    background-color: #459f7e;
                    .material-icons, .text {
                        color: #fff;
                    }
                    .text {
                        transform: scale(1.1);
                    }
                }
                &.router-link-exact-active {
                    margin-right: -0.7rem;
                    border-right: 5px solid #459f7e;
                    .material-icons, .text {
					    color: #fff;
				    }


                }
            }
        }
        &.active-menu {
            width: 200px;

            .menu-toggle-wrapper {
                top: -3rem;

                .menu-toggle {
                    transform: rotate(-180deg);
                }

            }
            h3, .button-sidebar .text {
                opacity: 1;
                transition: .3s ease-in;
                }
        }



        

}
</style>