<template>
  <div>
    <div class="app flex flex-colum">
      <Sidebar />
    <div class="app-content flex flex-column">
        <router-view />
    </div>
  </div>
  </div>
  
</template>

<script setup>

import Sidebar from './components/Sidebar.vue';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';

const store = useStore();

const invoicesLoaded = computed(() => store.store.invoicesLoaded);
store.dispatch('GET_INVOICES')




</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family:"Poppins" ,sans-serif;
}

html {
  font-size: 62.5%;
}

.app {
  background-color: #355764;
  min-height: 100vh;

  .app-content {
  padding: 0 20px;
  flex: 1;
  position: relative;
  }
}



button,
.button {
  cursor: pointer;
  padding: 1rem 2.6rem;
  border-radius: 3rem;
  border: none;
  font-size: 1.4rem;
  margin-right: 0.8rem;
  color: #ffff;

}

.dark-green-alt {
  background-color: #355764;
}
.dark-green {
  background-color: #30483f;
}
.red {
  background-color: #ec5757;
}
.blue {
  background-color: #81CACF;
}
.green {
  background-color: #33d69f;
}
.yellow {
  background-color: #FFEA11;
}

// Utility class
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 4rem 1rem;
  max-width: 850px;
  margin: 0 auto;
  @media (min-width: 900px) {
    padding-top: 7.2rem;
  }
}
.status-button {
  &::before {
    content: '';
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    margin-right: 0.8rem;
  }
  font-size: 1.2rem;
  margin-right: 3rem;
  align-items: center;
  padding: 0.8rem 3rem;
  border-radius: 1rem;
}

.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #FFEA11;
  }
  color: #FFEA11;
  background-color: rgba(142, 136, 9, 0.1);
}

.draft {
  &::before {
    background-color: #81CACF;
  }
  color: #81CACF;
  background-color: rgba(13, 150, 139, 0.1);
}


</style>
