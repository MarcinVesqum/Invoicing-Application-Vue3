import { createStore, createLogger } from 'vuex';
import {
	doc,
	collection,
	getDocs,
	deleteDoc,
	updateDoc,
} from 'firebase/firestore';
import {db} from '../firebase/init.js';
import RegisterStaff from './modules/staff/index.js';

const store = createStore({
	modules: {
		RegisterStaff
	},
	plugins: [createLogger()],
	state: {
			editInvoice: null,
			invoiceData: [],
			invoicesLoaded: null,
			currentInvoiceArray: [],
			editInvoice: null,
			
	},
	mutations: {
		SET_INVOICE_DATA(state, payload) {
			state.invoiceData.push(payload);
			
		},
		INVOICE_LOADED(state) {
			state.invoicesLoaded = true;
		},
		SET_CURRENT_INVOICE(state, payload) {
			state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
				return invoice.invoiceId === payload;
			});
		},
		TOGGLE_EDIT_INVOICE(state) {
			state.editInvoice = !state.editInvoice;
		},
		DELETE_INVOICE(state, payload) {
			state.invoiceData = state.invoiceData.filter((invocie) => {
				return invocie.invoiceId !== payload;
			});
		},
		UPDATE_STATUS_TO_PAID(state, payload) {
			state.invoiceData.forEach((invoice) => {
				if (invoice.docId === payload) {
					invoice.invoicePaid = true;
					invoice.invoiceDraft = false;
				}
			});
		},
		UPDATE_STATUS_TO_PENDING(state, payload) {
			state.invoiceData.forEach((invoice) => {
				if (invoice.docId === payload) {
					invoice.invoicePaid = false;
					invoice.invoicePending = true;
					invoice.invoiceDraft = false;
				}
			});
		},
	},
	actions: {
		async GET_INVOICES({ commit, state }) {
			const getData = await getDocs(collection(db, 'invoices'));
			getData.forEach((doc) => {
				if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
					const data = {
						docId: doc.id,
						invoiceId: doc.data().invoiceId,
						billerStreetAddress: doc.data().billerStreetAddress,
						billerCity: doc.data().billerCity,
						billerZipCode: doc.data().billerZipCode,
						billerCountry: doc.data().billerCountry,
						clientName: doc.data().clientName,
						clientEmail: doc.data().clientEmail,
						clientStreetAddress: doc.data().clientStreetAddress,
						clientCity: doc.data().clientCity,
						clientZipCode: doc.data().clientZipCode,
						clientCountry: doc.data().clientCountry,
						invoiceDateUnix: doc.data().invoiceDateUnix,
						invoiceDate: doc.data().invoiceDate,
						paymentTerms: doc.data().paymentTerms,
						paymentDueDateUnix: doc.data().paymentDueDateUnix,
						paymentDueDate: doc.data().paymentDueDate,
						productDescription: doc.data().productDescription,
						invoiceItemList: doc.data().invoiceItemList,
						invoiceTotal: doc.data().invoiceTotal,
						invoicePending: doc.data().invoicePending,
						invoiceDraft: doc.data().invoiceDraft,
						invoicePaid: doc.data().invoicePaid,
					};
					commit('SET_INVOICE_DATA', data);
				}
			});
			commit('INVOICE_LOADED');
		},
		async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
			commit('DELETE_INVOICE', docId);
			await dispatch('GET_INVOICES');
			commit('TOGGLE_EDIT_INVOICE');
			commit('SET_CURRENT_INVOICE', routeId);
		},
		async DELETE_INVOICE({ commit }, docId) {
			await deleteDoc(doc(db, 'invoices', docId));
			commit('DELETE_INVOCIE', docId);
		},
		async UPDATE_STATUS_TO_PAID({ commit }, docId) {
			const getRef = doc(db, 'invoices', docId);
			await updateDoc(getRef, {
				invoicePaid: true,
				invoicePending: false,
			});
			commit('UPDATE_STATUS_TO_PAID', docId);
		},
		async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
			const getRef = doc(db, 'invoices', docId);
			
			await updateDoc(getRef, {
				invoicePaid: false,
				invoicePending: true,
				invoiceDraft: false,
			});
			commit('UPDATE_STATUS_TO_PENDING', docId);
		},
	}
});

export default store;
