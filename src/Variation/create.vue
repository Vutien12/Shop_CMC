<template>
  <section class="content-header clearfix">
    <h3>Create Variation</h3>

    <ol class="breadcrumb">
      <li>
        <a href="#" class="breadcrumb-home-icon" @click.prevent="$router.push({ name: 'admin.dashboard' })">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>

      <li><a href="#" @click.prevent="$router.push({ name: 'admin.variations.index' })">Variations</a></li>
      <li class="active">Create Variation</li>
    </ol>
  </section>

  <section class="content">
    <div class="box">
      <div class="box-body">
        <form class="form" @submit.prevent="saveForm">
          <!-- General -->
          <div class="row has-variation-type">
            <div class="col-lg-2 col-sm-2">
              <h5>General</h5>
            </div>
            <div class="col-lg-7 col-sm-10">
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label for="name">Name <span class="text-red">*</span></label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="form-group">
                    <label for="type">Type <span class="text-red">*</span></label>
                    <select
                      id="type"
                      v-model="form.type"
                      class="form-control custom-select-black"
                      required
                    >
                      <option value="">Please Select</option>
                      <option value="text">Text</option>
                      <option value="color">Color</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Values -->
          <div class="row">
            <div class="col-lg-2 col-sm-2">
              <h5>Values</h5>
            </div>
            <div class="col-lg-7 col-sm-10">
              <div class="variation-values clearfix">
                <div class="table-responsive">
                  <table
                    class="options table table-bordered"
                    :class="`type-${form.type}`"
                  >
                    <thead>
                      <tr>
                        <th style="width: 50px;"></th>
                        <th style="width: 75%;">Label <span class="text-red">*</span></th>
                        <th v-if="form.type === 'color'" style="width: 25%;">Color <span class="text-red">*</span></th>
                        <th v-if="form.type === 'image'" style="width: 25%;">Image <span class="text-red">*</span></th>
                        <th style="width: 80px;"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(option, index) in form.values"
                        :key="option.id"
                        class="option-row"
                      >
                        <td class="text-center">
                          <span class="drag-handle"><i class="fa"></i><i class="fa"></i></span>
                        </td>

                        <td>
                          <input
                            type="text"
                            v-model="option.label"
                            class="form-control"
                            style="min-width: 100px; width: 100%;"
                            required
                          />
                        </td>

                        <td v-if="form.type === 'color'">
                          <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; padding: 0px; min-width: 150px;">
                            <input
                              type="text"
                              v-model="option.color"
                              class="form-control"
                              placeholder="#000000"
                              style="flex: 1; min-width: 80px; border: none; outline: none; border-radius: 0; padding: 6px 8px; font-size: 14px;"
                            />
                            <button 
                              type="button" 
                              :style="getColorButtonStyle(option.color)"
                              @click="openColorPicker(index)"
                              :title="'Pick color: ' + (option.color || 'Select a color')"
                            ></button>
                            <input
                              type="color"
                              v-model="option.color"
                              :ref="el => colorInputs[index] = el"
                              style="opacity: 0; position: absolute; pointer-events: none; width: 0; height: 0;"
                            />
                          </div>
                        </td>

                        <td v-if="form.type === 'image'">
                          <input
                            type="file"
                            class="form-control"
                            @change="onFileChange($event, index)"
                          />
                        </td>

                        <td class="text-center">
                          <button
                            type="button"
                            class="btn btn-default"
                            @click="removeRow(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button type="button" class="btn btn-default" @click="addRow">
                  Add Row
                </button>
              </div>
            </div>
          </div>

          <!-- Save -->
          <div class="row">
            <div class="col-lg-7 col-lg-offset-2 col-md-12 text-right">
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  type: "",
  values: [
    {
      id: Date.now(),
      label: "",
      color: "", // Ban đầu để rỗng để hiển thị checkerboard
      image: null,
    },
  ],
});

const colorInputs = ref([]);

// Hàm tạo style cho button màu
const getColorButtonStyle = (color) => {
  const isValidHex = color && /^#[0-9A-Fa-f]{6}$/.test(color); // Kiểm tra mã màu hex hợp lệ
  return {
    backgroundImage: isValidHex 
      ? 'none' 
      : 'repeating-linear-gradient(45deg, #aaa 25%, transparent 25%, transparent 75%, #aaa 75%, #aaa), repeating-linear-gradient(45deg, #aaa 25%, #fff 25%, #fff 75%, #aaa 75%, #aaa)',
    backgroundColor: isValidHex ? color : 'transparent', // Chỉ áp dụng màu nếu hex hợp lệ
    backgroundSize: isValidHex ? 'auto' : '8px 8px, 8px 8px', // Chỉ cần khi có checkerboard
    backgroundPosition: isValidHex ? 'auto' : '0 0, 4px 4px', // Chỉ cần khi có checkerboard
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: '6px',
    marginRight: '4px'
  };
};

// Mở color picker khi click button màu
const openColorPicker = (index) => {
  if (colorInputs.value[index]) {
    colorInputs.value[index].click();
  }
};

// Thêm dòng mới
const addRow = () => {
  form.values.push({
    id: Date.now() + Math.random(),
    label: "",
    color: "", // Ban đầu để rỗng để hiển thị checkerboard
    image: null,
  });
};

// Xóa dòng
const removeRow = (index) => {
  form.values.splice(index, 1);
};

// Xử lý upload ảnh
const onFileChange = (event, index) => {
  const file = event.target.files[0];
  if (file) form.values[index].image = file;
};

// Giả lập lưu form
const saveForm = () => {
  console.log("Dữ liệu form:", form);
  alert("Form saved! (xem console để kiểm tra dữ liệu)");
};
</script>

<style scoped>
.text-red {
  color: red;
}
.drag-handle {
  cursor: move;
}
.table th,
.table td {
  vertical-align: middle;
}
.btn-default {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}

/* Breadcrumb styles */
.content-header {
  padding: 15px 15px;
  border-bottom: 1px solid #f4f4f4;
  margin-bottom: 20px;
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 400;
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  background: transparent;
  font-size: 14px;
}

.breadcrumb li {
  display: inline-block;
}

.breadcrumb li + li:before {
  content: "/";
  padding: 0 8px;
  color: #ccc;
}

.breadcrumb li a {
  color: #337ab7;
  text-decoration: none;
}

.breadcrumb li a:hover {
  color: #23527c;
  text-decoration: underline;
}

.breadcrumb li.active {
  color: #777;
}

.breadcrumb-home-icon {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-home-icon svg {
  width: 20px;
  height: 20px;
}
</style>