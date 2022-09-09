<template>
    <div class="home container">
        <!-- Header -->
        <div class="header flex">
            <div class="left flex flex-column">
                <h1>Faktury</h1>
                <span>Faktur jest {{ invoiceData.length }} </span>
            </div>
            <div class="right flex">
                <div @click="toggleFilterMenu" class="filter flex" ref="filter">
                    <span>filtrowanie według statusu <span v-if="filteredInvoice">
                    : {{ filteredInvoice }}
                    </span></span>
                    <img src="../assets/icon-arrow-down.svg" alt="">
                    <ul v-show="filterMenu" class="filter-menu">
                        <li @click="filteredInvoices">Draft</li>
                        <li @click="filteredInvoices">Pending</li>
                        <li @click="filteredInvoices">Paid</li>
                        <li @click="filteredInvoices">Clear filter</li>
                    </ul>
                </div>
               
            </div>
        </div>
        <!-- Invoices -->
    <div class="invoice" v-if="invoiceData.length > 0">
      <Invoice v-for="(invoice, index) in filterData" :invoice="invoice" :key="index" />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="../assets/illustration-empty.svg" alt="" />
      <h3>Nie ma tu żadnej faktury</h3>
      <p>Utwórz nową fakturę, klikając przycisk Nowa faktura i zacznij działać</p>
    </div>

</div>
    
</template>

<script setup>
import Invoice from "../components/Invoice.vue";
import { ref, defineExpose, computed } from "vue";
import store from "../store";


const filter = ref(null);
const filterMenu = ref(null);
const filteredInvoice = ref(null);


const invoiceData = computed(() => store.state.invoiceData) 


const toggleFilterMenu = () => {
    filterMenu.value = !filterMenu.value
};

const filteredInvoices = (e) => {
    if (e.target.innerText === "Clear filter") {
        filteredInvoice.value = null;
        return;        
    }
    filteredInvoice.value = e.target.innerText;
}

const filterData = computed(() => {
    return invoiceData.value.filter((invoice) => {
        if (filteredInvoice.value === "Draft") {
            return invoice.invoiceDraft === true;
        }
        if (filteredInvoice.value === "Paid") {
            return invoice.invoicePaid === true;
        }
        if (filteredInvoice.value === "Pending") {
            return invoice.invoicePending === true;
        }
        return invoice;
    })
})


defineExpose({ filter })

</script>

<style lang="scss">
.home {
    color: #fff;

    .header {

        margin-bottom: 65px;

        .left,
        .right {
            flex: 1;
        }
        .left {
            margin-left: 3rem;
            @media (min-width: 900px) {
                
            }
        }

        .right {
            justify-content: flex-end;
            align-items: center;

            .button, 
            .filter {
                align-items: center;

                span {
                    font-size: 12px;
                }
            }
            .filter {
                position: relative;
                margin-right: 45px;
                cursor: pointer;
                z-index: 1;

                span,
                img {
                    pointer-events: none;
                }

                img {
                    margin-left: 12px;
                    width: 12px;
                    height: 10px;
                }
                .filter-menu {
                    width: 120px;
                    position: absolute;
                    top: 25px;
                    list-style: none;
                    background-color: #30483f;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0, 0.1), 0 2px 4px -1px rgba(0,0,0, 0.06);

                    li {
                        cursor: pointer;
                        font-size: 15px;
                        padding: 10px 20px;
                        &:hover {
                            color: #30483f;
                            background-color: #fff;
                        }
                    }
                    
                }
            }
            .button {
                padding: 8px 10px;
                background-color: #81CACF;
                border-radius: 40px;

                

                .inner-button {
                    margin-right: 8px;
                    border-radius: 50%;
                    padding: 8px;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;

                    img {
                        width: 10px;
                        height: 10px;
                    }
                }
                span,
                img {
                    pointer-events: none;
                }
            }
        }
        
    }
    .invoice {
        margin-left: 1.4rem;
    }
    .empty {
        margin-top: 140px;
        align-items: center;
        img {
            width: 400px;
            height: 400px;
        }
        h3 {
            font-size: 25px;
            margin-top: 40px;
        }
        p {
            text-align: center;
            max-width: 254px;
            font-size: 12px;
            font-weight: 300;
            margin-top: 16px;

        }
    }
    
}
</style>