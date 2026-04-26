<template>
  <div class="admin-banners">
    <div class="header-section">
      <div class="left">
        <h2>Hero Banners</h2>
        <p>Manage the 3-column slider on the home page</p>
      </div>
      <div class="right">
        <button class="add-btn" @click="openModal(null)">
          <Plus :size="18" />
          Add New Banner
        </button>
      </div>
    </div>

    <div class="banners-grid" v-if="localBanners.length">
      <div v-for="banner in localBanners" :key="banner._id" class="banner-card">
        <div class="preview" :style="{ background: banner.backgroundGradient }">
          <img :src="banner.imageUrl" :class="banner.imageClass" />
          <div class="content">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.description.substring(0, 50) }}...</p>
          </div>
        </div>
        <div class="actions">
          <button class="edit-btn" @click="openModal(banner)">
            <Edit :size="16" />
          </button>
          <button class="delete-btn" @click="deleteBanner(banner._id)">
            <Trash :size="16" />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <p>No banners found. Add your first one!</p>
    </div>

    <!-- MODAL FOR ADD/EDIT -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingBanner ? "Edit Banner" : "Add Banner" }}</h3>
          <button @click="showModal = false"><X :size="20" /></button>
        </div>
        <form @submit.prevent="saveBanner" class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input
              v-model="form.title"
              required
              placeholder="e.g. Growbit Jackpots"
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" required rows="3"></textarea>
          </div>
          <div class="flex-row">
            <div class="form-group">
              <label>Button Text</label>
              <input v-model="form.buttonText" placeholder="View Jackpots" />
            </div>
            <div class="form-group">
              <label>Button URL</label>
              <input v-model="form.buttonUrl" placeholder="/cases" />
            </div>
          </div>
          <div class="flex-row">
            <div class="form-group">
              <label>Image Class</label>
              <select v-model="form.imageClass">
                <option value="wizard">Wizard</option>
                <option value="plane">Biplane</option>
                <option value="vip">VIP character</option>
                <option value="">Default</option>
              </select>
            </div>
            <div class="form-group">
              <label>Order</label>
              <input type="number" v-model.number="form.order" />
            </div>
          </div>
          <div class="form-group">
            <label>Background Gradient (CSS)</label>
            <input
              v-model="form.backgroundGradient"
              placeholder="linear-gradient(...)"
            />
          </div>
          <div class="form-group">
            <label>Image File (Upload to Cloudinary)</label>
            <input
              type="file"
              @change="handleFileUpload"
              :required="!editingBanner"
              accept="image/*"
            />
          </div>
          <div class="modal-footer">
            <button type="button" @click="showModal = false" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? "Saving..." : "Save Banner" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Plus, Edit, Trash, X } from "lucide-vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AdminBanners",
  components: { Plus, Edit, Trash, X },
  data() {
    return {
      localBanners: [],
      showModal: false,
      editingBanner: null,
      loading: false,
      file: null,
      form: {
        title: "",
        description: "",
        buttonText: "View Now",
        buttonUrl: "/",
        imageClass: "wizard",
        backgroundGradient: "linear-gradient(180deg, #1d3330 0%, #0c1c1a 100%)",
        order: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["banners"]),
  },
  methods: {
    ...mapActions(["generalFetchBanners", "notificationShow"]),
    async fetchBanners() {
      try {
        const res = await axios.get("/admin/banners");
        if (res.data.success) {
          this.localBanners = res.data.banners;
        }
      } catch (e) {
        console.error(e);
      }
    },
    openModal(banner) {
      this.editingBanner = banner;
      if (banner) {
        this.form = {
          title: banner.title,
          description: banner.description,
          buttonText: banner.buttonText,
          buttonUrl: banner.buttonUrl,
          imageClass: banner.imageClass,
          backgroundGradient: banner.backgroundGradient,
          order: banner.order,
        };
      } else {
        this.form = {
          title: "",
          description: "",
          buttonText: "View Now",
          buttonUrl: "/",
          imageClass: "wizard",
          backgroundGradient:
            "linear-gradient(180deg, #1d3330 0%, #0c1c1a 100%)",
          order: 0,
        };
      }
      this.file = null;
      this.showModal = true;
    },
    handleFileUpload(e) {
      this.file = e.target.files[0];
    },
    async saveBanner() {
      this.loading = true;
      const formData = new FormData();
      // append only the relevant fields
      formData.append("title", this.form.title);
      formData.append("description", this.form.description);
      formData.append("buttonText", this.form.buttonText);
      formData.append("buttonUrl", this.form.buttonUrl);
      formData.append("imageClass", this.form.imageClass);
      formData.append("backgroundGradient", this.form.backgroundGradient);
      formData.append("order", this.form.order);

      if (this.file) {
        formData.append("image", this.file);
      }

      try {
        let res;
        if (this.editingBanner) {
          res = await axios.put(
            `/admin/banners/${this.editingBanner._id}`,
            formData,
          );
        } else {
          res = await axios.post("/admin/banners", formData);
        }

        if (res.data.success) {
          this.notificationShow({
            type: "success",
            message: "Banner saved successfully",
          });
          this.showModal = false;
          this.fetchBanners();
          this.generalFetchBanners(); // Refresh home page state
        }
      } catch (e) {
        this.notificationShow({
          type: "error",
          message: e.message || "Failed to save banner",
        });
      } finally {
        this.loading = false;
      }
    },
    async deleteBanner(id) {
      if (!confirm("Are you sure?")) return;
      try {
        const res = await axios.delete(`/admin/banners/${id}`);
        if (res.data.success) {
          this.notificationShow({ type: "success", message: "Banner deleted" });
          this.fetchBanners();
          this.generalFetchBanners();
        }
      } catch (e) {
        this.notificationShow({ type: "error", message: "Failed to delete" });
      }
    },
  },
  created() {
    this.fetchBanners();
  },
};
</script>

<style scoped lang="scss">
.admin-banners {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  h2 {
    font-size: 1.5rem;
    margin-bottom: 5px;
  }
  p {
    color: #616498;
    font-size: 0.9rem;
  }
}

.add-btn {
  background: #5b46bc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background: lighten(#5b46bc, 5%);
  }
}

.banners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.banner-card {
  background: #111026;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #22224a;

  .preview {
    height: 150px;
    position: relative;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 80%;
      object-fit: contain;
    }
    .content {
      position: relative;
      z-index: 2;
      h3 {
        font-size: 1.1rem;
        margin-bottom: 5px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
      p {
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 10px;
    button {
      background: #161533;
      border: 1px solid #22224a;
      color: #616498;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: grid;
      place-content: center;
      cursor: pointer;
      &:hover {
        color: white;
        background: #22224a;
      }
      &.delete-btn:hover {
        color: #ff4d4d;
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: grid;
  place-content: center;
  z-index: 1000;
}

.modal-content {
  background: #111026;
  width: 500px;
  border-radius: 16px;
  border: 1px solid #22224a;
  padding: 25px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  button {
    background: transparent;
    border: none;
    color: #616498;
    cursor: pointer;
  }
}

.form-group {
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.85rem;
    color: #616498;
  }
  input,
  textarea,
  select {
    width: 100%;
    background: #09081a;
    border: 1px solid #22224a;
    border-radius: 8px;
    padding: 10px;
    color: white;
    &:focus {
      border-color: #5b46bc;
      outline: none;
    }
  }
}

.flex-row {
  display: flex;
  gap: 15px;
  .form-group {
    flex: 1;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  .cancel-btn {
    background: transparent;
    border: 1px solid #22224a;
    color: #616498;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
  .save-btn {
    background: #5b46bc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
  }
}
</style>
