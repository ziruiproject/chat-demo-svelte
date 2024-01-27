<script>
	import { afterUpdate, onMount, tick } from 'svelte';
	import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
	import { writable } from 'svelte/store';
	import { auth, db } from '$lib';
	import {
		collection,
		onSnapshot,
		query,
		serverTimestamp,
		setDoc,
		where,
		doc,
		addDoc,
		orderBy
	} from 'firebase/firestore';

	const currentUser = writable(null);
	const chats = writable([]);

	let message = '';
	let element;

	onMount(async () => {
		onAuthStateChanged(auth, (user) => {
			getChats();

			if (user) {
				currentUser.set(user);
			} else {
				currentUser.set(null);
			}
		});
	});

	function login() {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider).then((result) => {
			currentUser.set(result.user);
		});
	}

	async function post() {
		await addDoc(collection(db, 'chats'), {
			message: message,
			userUid: $currentUser.uid,
			displayName: $currentUser.displayName,
			createdAt: serverTimestamp()
		});

		message = '';
	}

	function getChats() {
		const q = query(collection(db, 'chats'), orderBy('createdAt'));
		onSnapshot(q, (querySnapshot) => {
			let docs = [];
			querySnapshot.forEach((doc) => {
				docs.push(doc.data());
			});
			docs = docs;
			chats.set(docs);
		});
	}

	function logout() {
		signOut(auth).then(() => {
			$currentUser.set(null);
		});
	}

	$: if ($chats && element) {
		console.log(element);
		element.scrollIntoView({
			block: 'end',
			inline: 'nearest',
			behavior: 'smooth'
		});
	}
</script>

<main class="h-screen bg-gray-800 text-white">
	{#if $currentUser}
		<div
			class="flex flex-col items-center justify-center py-5 justify-self-center w-screen bg-gray-800 gap-y-3"
		>
			<h1 class="text-2xl">
				Chat Sebagai
				<span class="font-bold">
					{$currentUser.displayName}
				</span>
			</h1>
			<button on:click={logout} class="bg-red-500 py-1 px-2 rounded-lg font-bold text-xl">
				Izin Off
			</button>
		</div>
		<div class="flex flex-col overflow-y-auto pb-32 px-5 gap-y-3 bg-gray-800" bind:this={element}>
			{#each $chats as chat}
				{#if chat.userUid === $currentUser.uid}
					<div
						class="bg-green-500 text-left w-fit place-self-end px-5 py-2 text-xl font-semibold rounded-2xl flex flex-col"
					>
						<span class="text-sm text-left">You</span>
						<span>
							{chat.message}
						</span>
					</div>
				{:else}
					<div
						class="bg-gray-700 text-left w-fit place-self-start px-5 py-2 text-xl font-semibold rounded-2xl flex flex-col"
					>
						<span class="text-sm text-left">{chat.displayName}</span>
						<span>
							{chat.message}
						</span>
					</div>
				{/if}
			{/each}
		</div>
		<form
			on:submit|preventDefault={post}
			class="fixed bottom-0 w-screen justify-center flex py-5 gap-x-2 items-center bg-gray-800"
		>
			<input
				type="text"
				placeholder="Masukan Pesan Disini"
				class=" w-5/6 p-5 rounded-full bg-gray-700 outline-none caret-white text-white text-wrap"
				bind:value={message}
			/>
			<button class="bg-green-500 p-4 rounded-full w-fit h-fit">
				<svg
					width="24px"
					height="24px"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="#ffffff"
					><path
						d="M22 12L3 20L6.5625 12L3 4L22 12Z"
						stroke="#ffffff"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M6.5 12L22 12"
						stroke="#ffffff"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
			</button>
		</form>
	{:else}
		<div class="grid place-content-center place-items-center gap-y-7 h-5/6">
			<h1 class="font-bold text-3xl">Login Dulu Mas Bro</h1>
			<button
				on:click={login}
				class="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-2xl"
			>
				Masuk Pakai Google
			</button>
		</div>
	{/if}
</main>
