import { auth } from '../../../firebase/init.js';
import {
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import router from '../../../router/router.js';


export default {
	namespaced: true,
	state: {
		staff: null
	},
	mutations: {
		SET_STAFF(state, staff) {
			state.staff = staff;
		},
		CLEAR_STAFF(state) {
			state.staff = null;
		},
	},
	actions: {
		async login({ commit }, details) {
			const { email, password } = details;
			try {
				await signInWithEmailAndPassword(auth, email, password);
				
			} catch (error) {
				switch (error.code) {
					case 'auth/user-not-found':
						 alert('User not found');
						break;
					case 'auth/worng-password':
						 alert('Wrong password');
						break;
					case 'auth/wrong-emial':
						 alert('Wrong emial');
						break;
					default:
						 alert('Smoting wrong');
				}
				return;
			}
			commit('SET_STAFF', auth.currentUser);
            
            router.push('/');
		},
		async register({ commit }, details) {
			const { email, password } = details;
			try {
				await createUserWithEmailAndPassword(auth, email, password);
				
			} catch (error) {
				switch (error.code) {
                    case 'auth/email-already-in-use':
						 alert('Emial already in use');
						break;
					case 'auth/invalid-email':
						 alert('Invalid email');
						break;
					case 'auth/operation-not-allowed':
						 alert('Operation not allowed');
						break;
					case 'auth/weak-password':
						 alert('Weak password');
						break;
					default:
						 alert('Smoting wrong');
					
				}
                return;
			}

            commit('SET_STAFF', auth.currentUser)
            router.push('/');
		},
		async logout({ commit }) {
			await signOut(auth);

			commit('CLEAR_STAFF');
            router.push('/login')
		},

		fetchUser({ commit }) {
			auth.onAuthStateChanged(async staff => {
				if (staff === null) {
					commit('CLEAR_STAFF')
				} else {
					commit('SET_STAFF', staff)
					console.log(staff)
					
					if (router.isReady() && router.currentRoute.value.path === '/login') {
						router.push('/')
					}
				}

			})
		}

	},
	getters: {},
};
