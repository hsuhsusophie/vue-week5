export default {
  template: '#userProductModal',
  props: {
    product: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      status: {},
      modal: '',
      qty: 1,
    };
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  watch: {
    product() {
      this.qty = 1;  //預設1
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
      //new xxx函式建構子
    });
  },
}