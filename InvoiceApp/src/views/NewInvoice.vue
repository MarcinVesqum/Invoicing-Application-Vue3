<template>
  <div  class="invoice-wrap flex flex-column">
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show="stateForm.loading"/>
      <h1 v-if="!editInvoice">Nowa Faktura</h1>
      <h1 v-else>Edytowanie Fakture</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Rachunek z</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Ulica</label>
          <input required type="text" id="billerStreetAddress" v-model="stateForm.billerStreetAddress" />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">Miasto</label>
            <input required type="text" id="billerCity" v-model="stateForm.billerCity" />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Kod Pocztowy</label>
            <input required type="text" id="billerZipCode" v-model="stateForm.billerZipCode" />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Kraj</label>
            <input required type="text" id="billerCountry" v-model="stateForm.billerCountry" />
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Imię Klienta</label>
          <input required type="text" id="clientName" v-model="stateForm.clientName" />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">E-mail Klienta</label>
          <input required type="text" id="clientEmail" v-model="stateForm.clientEmail" />
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Ulica</label>
          <input required type="text" id="clientStreetAddress" v-model="stateForm.clientStreetAddress" />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">Miasto</label>
            <input required type="text" id="clientCity" v-model="stateForm.clientCity" />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Kod Pocztowy</label>
            <input required type="text" id="clientZipCode" v-model="stateForm.clientZipCode" />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Kraj</label>
            <input required type="text" id="clientCountry" v-model="stateForm.clientCountry" />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Data faktury</label>
            <input disabled type="text" id="invoiceDate" v-model="stateForm.invoiceDate" />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Płatność należna</label>
            <input disabled type="text" id="paymentDueDate" v-model="stateForm.paymentDueDate" />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Warunki płatności</label>
          <select required  id="paymentTerms" v-model="stateForm.paymentTerms">
            <option value="30">30 dni</option>
            <option value="60">60 dni</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input required type="text" id="productDescription" v-model="stateForm.productDescription" />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Nazwa Produktu</th>
              <th class="qty">Ilość</th>
              <th class="price">Cena</th>
              <th class="total">Rzem</th>
            </tr>
            <tr class="table-items flex" v-for="(item, index) in stateForm.invoiceItemList" :key="index">
              <td class="item-name"><input type="text" v-model="item.itemName" /></td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">${{ (item.total = item.qty * item.price) }}</td>
              <img @click="deleteInvoiceItem(item.id)" src="../assets/icon-delete.svg" alt="" />
            </tr>
          </table>

          <div @click="addNewInvoiceItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="" />
            Dodaj nowy produkt
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">Wyjście</button>
        </div>
        <div class="right flex">
          <button v-if="!editInvoice" type="submit" @click="saveDraft" class="dark-blue">Zapisz projekt</button>
          <button v-if="!editInvoice" type="submit" @click="publishInvoice" class="blue">Utwórz fakturę</button>
          <button v-if="editInvoice" type="sumbit" class="blue">Aktualizacja faktury</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import Loading from '../components/Loading.vue';

import { computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import {  useRouter } from "vue-router";
import { uid } from 'uid';
import db from '../firebase/init.js';
import { addDoc, collection } from 'firebase/firestore';

const store = useStore();
const router = useRouter();
const currentInvoice = ref(null);
const stateForm = reactive({
    dateOption: { year: "numeric", month: "short", day: "numeric"},
    docId: null,
    loading: null,
    billerStreetAddress: null,
    billerCity: null,
    billerZipCode: null,
    billerCountry: null,
    clientName: null,
    clientEmail: null,
    clientStreetAddress: null,
    clientCity: null,
    clientZipCode: null,
    clientCountry: null,
    invoiceDateUnix: null,
    invoiceDate: null,
    paymentTerms: null,
    paymentDueDateUnix: null,
    paymentDueDate: null,
    productDescription: null,
    invoicePending: null,
    invoiceDraft: null,
    invoiceItemList: [],
    invoiceTotal: 0,
})
// State Modules
const editInvoice = computed(() => store.state.editInvoice);
const currentInvoiceArray = computed(() => store.state.currentInvoiceArray[0])
const UPDATE_INVOICE = () => store.dispatch('UPDATE_INVOICE')


// Created: Get current date for invoice date field


const editInvoiceFnc = () => {
  if (editInvoice) {
    stateForm.invoiceDateUnix = Date.now();
    stateForm.invoiceDate =
      new Date(stateForm.invoiceDateUnix).toLocaleDateString('pl-PL', stateForm.dateOption);

    return;
  }

  if (editInvoice) {
    currentInvoice.value = currentInvoiceArray;
    stateForm.docId = currentInvoice.value.docId;
    stateForm.billerStreetAddress = currentInvoice.value.billerStreetAddress;
    stateForm.billerCity = currentInvoice.value.billerCity;
    stateForm.billerZipCode = currentInvoice.value.billerZipCode;
    stateForm.billerCountry = currentInvoice.value.billerCountry;
    stateForm.clientName = currentInvoice.value.clientName;
    stateForm.clientEmail = currentInvoice.value.clientEmail;
    stateForm.clientStreetAddress = currentInvoice.value.clientStreetAddress;
    stateForm.clientCity = currentInvoice.value.clientCity;
    stateForm.clientZipCode = currentInvoice.value.clientZipCode;
    stateForm.clientCountry = currentInvoice.value.clientCountry;
    stateForm.invoiceDateUnix = currentInvoice.value.invoiceDateUnix;
    stateForm.invoiceDate = currentInvoice.value.invoiceDate;
    stateForm.paymentTerms = currentInvoice.value.paymentTerms;
    stateForm.paymentDueDateUnix = currentInvoice.value.paymentDueDateUnix;
    stateForm.paymentDueDate = currentInvoice.value.paymentDueDate;
    stateForm.productDescription = currentInvoice.value.productDescription;
    stateForm.invoicePending = currentInvoice.value.invoicePending;
    stateForm.invoiceDraft = currentInvoice.value.invoiceDraft;
    stateForm.invoiceItemList = currentInvoice.value.invoiceItemList;
    stateForm.invoiceTotal = currentInvoice.value.invoiceTotal;
  }
}
editInvoiceFnc();
 







// Functions
const addNewInvoiceItem = () => {
  stateForm.invoiceItemList.push({
    id: uid(),
    itemName: '',
    qty: '',
    price: 0,
    total: 0,
  })
};

const calcInvoiceTotal = () => {
  stateForm.invoiceTotal = 0;
  stateForm.invoiceItemList.forEach((item) => {
    stateForm.invoiceTotal += item.total
  })
}

const publishInvoice = () => {
  stateForm.invoicePending = true;
}

const saveDraft = () => {
  stateForm.invoiceDraft = true;
};

const uploadInvoice = async () => {
  if (stateForm.invoiceItemList.length <= 0) {
    alert('Pleas ensure you filled out work items!')
    return;
  }
  stateForm.loading = true;
  calcInvoiceTotal();

  await addDoc(collection(db, 'invoices'), {
    invoiceId: uid(6),
    billerStreetAddress: stateForm.billerStreetAddress,
    billerCity: stateForm.billerCity,
    billerZipCode: stateForm.billerZipCode,
    billerCountry: stateForm.billerCountry,
    clientName: stateForm.clientName,
    clientEmail: stateForm.clientEmail,
    clientStreetAddress: stateForm.clientStreetAddress,
    clientCity: stateForm.clientCity,
    clientZipCode: stateForm.clientZipCode,
    clientCountry: stateForm.clientCountry,
    invoiceDate: stateForm.invoiceDate,
    invoiceDateUnix: stateForm.invoiceDateUnix,
    paymentTerms: stateForm.paymentTerms,
    paymentDueDate: stateForm.paymentDueDate,
    paymentDueDateUnix: stateForm.paymentDueDateUnix,
    productDescription: stateForm.productDescription,
    invoiceItemList: stateForm.invoiceItemList,
    invoiceTotal: stateForm.invoiceTotal,
    invoicePending: stateForm.invoicePending,
    invoiceDraft: stateForm.invoiceDraft,
    invoicePaid: null,
  });

  stateForm.loading = false;
  router.push({ name: 'Home'})
  store.dispatch('GET_INVOICES');
}

const submitForm = () => {
  uploadInvoice();
}

const deleteInvoiceItem = (id) => {
  stateForm.invoiceItemList = stateForm.invoiceItemList.filter((item) => item.id !== id)
};
const closeInvoice = () => {
    router.push({ name: 'Home'})
};

watch(stateForm, (value) => {
  const futureDate = new Date();
  value.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(value.paymentTerms));
  value.paymentDueDate = new Date(value.paymentDueDateUnix).toLocaleDateString('pl-Pl', value.dateOption)
})

</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #30483f;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  
  .invoice-content {
    position: relative;
    padding: 56px;
    width: 100%;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #81CACF;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }
    // Invoice Work
    .invoice-work {
      background-color: #30483f;
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
      .work-items {
        background-color: #30483f;
        .item-list {
          width: 100%;
          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;
            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }
          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;
            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }
        .button {
          color: #fff;
          background-color: #355764;
          align-items: center;
          justify-content: center;
          width: 100%;
          
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background-color: #000;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>