<template>
    <div v-if="currentInvoice.value" class="invoice-view container">
      <router-link class="nav-link flex" :to="{ name: 'Home' }">
        <img src="../assets/icon-arrow-left.svg" alt="" /> Wróć
      </router-link>
      <!-- Header -->
      <div class="header flex">
        <div class="left flex">
          <span>Status</span>
          <div
            class="status-button flex"
            :class="{
              paid: currentInvoice.value.invoicePaid,
              draft: currentInvoice.value.invoiceDraft,
              pending: currentInvoice.value.invoicePending,
            }"
          >
            <span v-if="currentInvoice.value.invoicePaid">Płatność</span>
            <span v-if="currentInvoice.value.invoiceDraft">Projekt</span>
            <span v-if="currentInvoice.value.invoicePending">Oczekiwanie na realizację</span>
          </div>
        </div>
        <div class="right flex">
          <button @click="toggleEditInvoice" class="dark-purple">Edytuj</button>
          <button @click="deleteInvoice(currentInvoice.value.docId)" class="red">Usuń</button>
          <button @click="updateStatusToPaid(currentInvoice.value.docId)" v-if="currentInvoice.value.invoicePending" class="green">
            Oznaczenie jako oczekujący
          </button>
          <button
            v-if="currentInvoice.value.invoiceDraft || currentInvoice.value.invoicePaid"
            @click="updateStatusToPending(currentInvoice.value.docId)"
            class="orange"
          >
            Oznaczone jako zapłacone 
          </button>
        </div>
      </div>
      <!-- Invoice Details -->
      <div class="invoice-details flex flex-column">
        <div class="top flex">
          <div class="left flex flex-column">
            <p><span>#</span>{{ currentInvoice.value.invoiceId }}</p>
            <p>{{ currentInvoice.value.productDescription }}</p>
          </div>
          <div class="right flex flex-column">
            <p>{{ currentInvoice.value.billerStreetAddress }}</p>
            <p>{{ currentInvoice.value.billerCity }}</p>
            <p>{{ currentInvoice.value.billerZipCode }}</p>
            <p>{{ currentInvoice.value.billerCountry }}</p>
          </div>
        </div>
        <div class="middle flex">
          <div class="payment flex flex-column">
            <h4>Data Faktury</h4>
            <p>
              {{ currentInvoice.value.invoiceDate }}
            </p>
            <h4>Data zapłaty</h4>
            <p>
              {{ currentInvoice.value.paymentDueDate }}
            </p>
          </div>
          <div class="bill flex flex-column">
            <h4>Rachunek do</h4>
            <p>{{ currentInvoice.value.clientName }}</p>
            <p>{{ currentInvoice.value.clientStreetAddress }}</p>
            <p>{{ currentInvoice.value.clientCity }}</p>
            <p>{{ currentInvoice.value.clientZipCode }}</p>
            <p>{{ currentInvoice.value.clientCountry }}</p>
          </div>
          <div class="send-to flex flex-column">
            <h4>Wysłać do</h4>
            <p>{{ currentInvoice.value.clientEmail }}</p>
          </div>
        </div>
        <div class="bottom flex flex-column">
          <div class="billing-items">
            <div class="heading flex">
              <p>Nazwa Produktu</p>
              <p>Ilość</p>
              <p>Cena</p>
              <p>Razem</p>
            </div>
            <div v-for="(item, index) in currentInvoice.value.invoiceItemList" :key="index" class="item flex">
              <p>{{ item.itemName }}</p>
              <p>{{ item.qty }}</p>
              <p>{{ item.price }}</p>
              <p>{{ item.total }}</p>
            </div>
          </div>
          <div class="total flex">
            <p>Kwota należna</p>
            <p>{{ currentInvoice.value.invoiceTotal }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();

const currentInvoice = ref(null);

const currentInvoiceArray = computed(() => store.state.currentInvoiceArray[0])
const editInvoice = computed(() => store.state.editInvoice) 

function getCurrentInvoice() {
  store.commit('SET_CURRENT_INVOICE',route.params.invoiceId)
  
  currentInvoice.value = currentInvoiceArray;
};

getCurrentInvoice();


const toggleEditInvoice = () => {
  store.commit('TOGGLE_EDIT_INVOICE');
  router.push({ name: 'NewInvoice'})

}

const deleteInvoice = async (docId) => {
  await store.dispatch('DELETE_INVOICE',docId);
  router.push({ name: 'Home'})
};
const updateStatusToPaid = (docId) => {
  store.dispatch('UPDATE_STATUS_TO_PAID',docId)
  
};
const updateStatusToPending = (docId) => {
  store.dispatch('UPDATE_STATUS_TO_PENDING',docId)
};

watch(editInvoice, (value) => {
  if (value) {
    currentInvoice.value = currentInvoiceArray
  }
})

</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }
  .header,
  .invoice-details {
    background-color: #30483f;
    border-radius: 20px;
  }
  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;
    .left {
      align-items: center;
      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }
    .right {
      flex: 1;
      justify-content: flex-end;
      button {
        color: #fff;
      }
    }
  }
  .invoice-details {
    padding: 48px;
    margin-top: 24px;
    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }
      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }
        p:nth-child(2) {
          font-size: 16px;
        }
        span {
          color: #888eb0;
        }
      }
      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }
    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;
      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }
      p {
        font-size: 16px;
      }
      .bill,
      .payment {
        flex: 1;
      }
      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }
        p {
          font-weight: 600;
        }
      }
      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }
        p {
          font-size: 12px;
        }
      }
      .send-to {
        flex: 2;
      }
    }
    .bottom {
      margin-top: 50px;
      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #355764;
        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;
          &:last-child {
            margin-bottom: 0;
          }
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
      }
      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(6, 45, 29, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;
        p {
          flex: 1;
          font-size: 12px;
        }
        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}

</style>