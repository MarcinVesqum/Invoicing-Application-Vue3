<template>
  <router-link class="invoice flex" :to="{ name: 'Invoice', params: { invoiceId: props.invoice.invoiceId}}">
    <div class="left flex">
        <span class="tracking-number">{{ props.invoice.invoiceId }}</span>
        <span class="due-date">{{ props.invoice.paymentDueDate }}</span>
        <span class="person">{{ props.invoice.clientName }}</span>
    </div>
    <div class="left flex">
        <span class="price">{{ props.invoice.invoiceTotal }}</span>
        <div 
        class="status-button flex"
        :class="{paid: props.invoice.invoicePaid, draft: props.invoice.invoiceDraft, pending: props.invoice.invoicePending }"
        >
            <span v-if="props.invoice.invoicePaid">Płatność</span>
            <span v-if="props.invoice.invoiceDraft">Projekt</span>
            <span v-if="props.invoice.invoicePending">W trakcie realizacji</span>
        </div>
        <div class="icon">
            <img src="../assets/icon-arrow-right.svg" alt="" />
        </div>
    </div>
  </router-link>
</template>

<script setup>
import {  defineProps } from "vue";


const props = defineProps(["invoice"]);


</script>

<style lang="scss" scoped>
  .invoice {
    text-decoration: none;
    cursor: pointer;
    gap: 16px;
    margin-bottom: 16px;
    color: #fff;
    border-radius: 20px;
    padding: 28px 32px;
    background-color: #30483f;
    align-items: center;
    span {
      font-size: 13px;
    }
    .left {
      align-items: center;
      flex-basis: 60%;
      gap: 16px;
      span {
        flex: 1;
      }
      .tracking-number {
        text-transform: uppercase;
      }
    }
    .right {
      gap: 16px;
      flex-basis: 40%;
      align-items: center;
      .price {
        flex: 1;
        font-size: 16px;
        font-weight: 600px;
      }
    }
  }
</style>