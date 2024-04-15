// mobile menu
const burgerIcon: HTMLElement = document.querySelector("#burger")!;
const navbarMenu: HTMLElement = document.querySelector("#nav-links")!;

burgerIcon.addEventListener("click", () => {
	navbarMenu.classList.toggle("is-active")
});