
document.addEventListener("DOMContentLoaded", () => {
  const wishlistEl = document.querySelector(".wishlist");
  if (!wishlistEl) return;

  const button = wishlistEl.querySelector(".wishlist-btn");

  const appUrl = wishlistEl.dataset.appUrl;
  const customerId = wishlistEl.dataset.customerId;
  const productId = wishlistEl.dataset.productId;
  const shopUrl = wishlistEl.dataset.shop;

  let wishlisted = false;

  /* =========================
     INIT (Alpine init())
  ========================= */
  fetch(
    `${appUrl}api/wishlist?customerId=${customerId}&productId=${productId}&shop=${shopUrl}`
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.data && result.data.length > 0) {
        wishlisted = true;
        button.classList.add("is-active");
      }
    })
    .catch((error) => console.log("error", error));

  /* =========================
     CLICK HANDLER
  ========================= */
  button.addEventListener("click", () => {
    // If customer not logged in
    if (!customerId) {
      alert("Please login to add to wishlist");
      return;
    }

    const formdata = new FormData();
    formdata.append("customerId", customerId);
    formdata.append("productId", productId);
    formdata.append("shophii", shopUrl);
    formdata.append("_action", wishlisted ? "DELETE" : "CREATE");

    // Optimistic toggle
    wishlisted = !wishlisted;
    button.classList.toggle("is-active", wishlisted);

    fetch(`${appUrl}api/wishlist`, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => {
        wishlisted = !!result.wishlisted;
        button.classList.toggle("is-active", wishlisted);
      })
      .catch((error) => {
        console.log("error", error);
        // rollback on error
        wishlisted = !wishlisted;
        button.classList.toggle("is-active", wishlisted);
      });
  });
});