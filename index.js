import userProductModal from "./userProductModal.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "sophie";

Vue.createApp({
  data() {
    return {
      status: {
        loadingCart: "",
      },
      products: [],
      product: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      cart: {},
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/api/${apiPath}/products`;
      axios
        .get(url)
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.status.loadingCart = id;
      axios
        .get(url)
        .then((response) => {
          this.status.loadingCart = "";
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      //參數預設值     //加入購物車
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.status.loadingCart = id;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios
        .post(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.status.loadingCart = "";
          this.getCart();  //再把品項取出來一次 +1
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(data) {  //調整購物車數量
      this.status.loadingCart = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios
        .put(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.status.loadingCart = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.status.loadingCart = "";
        });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(url)
        .then((response) => {
          this.cart = response.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.status.loadingCart = id;
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          this.status.loadingCart = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
})
  .component("userProductModal", userProductModal)
  .mount("#app");
