<template>
  <section class="content-header clearfix">
    <h3>Create Option</h3>

    <ol class="breadcrumb">
      <li>
        <a href="#" class="breadcrumb-home-icon" @click.prevent="$router.push({ name: 'admin.dashboard' })">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 18V15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10.07 2.81997L3.13999 8.36997C2.35999 8.98997 1.85999 10.3 2.02999 11.28L3.35999 19.24C3.59999 20.66 4.95999 21.81 6.39999 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </a>
      </li>

      <li><a href="#" @click.prevent="$router.push({ name: 'admin.options.index' })">Options</a></li>
      <li class="active">Create Option</li>
    </ol>
  </section>

  <section class="content">
    <form class="form-horizontal" @submit.prevent="saveForm" novalidate>
      <div class="accordion-content clearfix">
        <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 sidebar-column" style="width: 350px;">
          <div class="accordion-box">
            <div class="panel-group" id="OptionTabs">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a>Option Information</a>
                  </h4>
                </div>

                <div id="option_information" class="panel-collapse collapse in">
                  <div class="panel-body">
                    <ul class="accordion-tab nav nav-tabs nav-stacked">
                      <li :class="{ active: activeTab === 'general' }">
                        <a href="#general" @click.prevent="activeTab = 'general'">General</a>
                      </li>
                      <li :class="{ active: activeTab === 'values' }">
                        <a href="#values" @click.prevent="activeTab = 'values'">Values</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9 col-md-8 col-sm-12 col-xs-12 content-column">
          <div class="accordion-box-content">
            <div class="tab-content clearfix">
              <!-- General Tab -->
              <div class="tab-pane fade" :class="{ 'in active': activeTab === 'general' }" id="general">
                <h4 class="tab-content-title">General</h4>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="name" class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label text-left">
                        Name<span class="m-l-5 text-red">*</span>
                      </label>
                      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12 input-wrapper">
                        <input
                          type="text"
                          id="name"
                          v-model="form.name"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group required">
                      <label for="type" class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label text-left" style="color:black">
                        Type<span class="m-l-5 text-red">*</span>
                      </label>

                      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12 input-wrapper">
                        <select
                          id="type"
                          v-model="form.type"
                          class="form-control custom-select-black"
                          @change="onTypeChange"
                          required
                        >
                          <option value="">Please Select</option>

                          <optgroup label="Text">
                            <option value="field">Field</option>
                            <option value="textarea">Textarea</option>
                          </optgroup>

                          <optgroup label="Select">
                            <option value="dropdown">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="checkbox_custom">Custom Checkbox</option>
                            <option value="radio">Radio Button</option>
                            <option value="radio_custom">Custom Radio Button</option>
                            <option value="multiple_select">Multiple Select</option>
                          </optgroup>

                          <optgroup label="Date">
                            <option value="date">Date</option>
                            <option value="date_time">Date & Time</option>
                            <option value="time">Time</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="is_required" class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label text-left">
                        Required
                      </label>
                      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                        <div class="checkbox">
                          <input
                            type="checkbox"
                            id="is_required"
                            v-model="form.is_required"
                          />
                          <label for="is_required">This option is required</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Values Tab -->
              <div class="tab-pane fade" :class="{ 'in active': activeTab === 'values' }" id="values">
                <h4 class="tab-content-title">Values</h4>
                <div class="option-values clearfix" id="option-values">
                  <!-- Info Alert when no type selected -->
                  <div v-if="!form.type" class="alert alert-info" id="option-values-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.25 8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75C11.59 13.75 11.25 13.41 11.25 13V8ZM12.92 16.38C12.87 16.51 12.8 16.61 12.71 16.71C12.61 16.8 12.5 16.87 12.38 16.92C12.26 16.97 12.13 17 12 17C11.87 17 11.74 16.97 11.62 16.92C11.5 16.87 11.39 16.8 11.29 16.71C11.2 16.61 11.13 16.51 11.08 16.38C11.03 16.26 11 16.13 11 16C11 15.87 11.03 15.74 11.08 15.62C11.13 15.5 11.2 15.39 11.29 15.29C11.39 15.2 11.5 15.13 11.62 15.08C11.86 14.98 12.14 14.98 12.38 15.08C12.5 15.13 12.61 15.2 12.71 15.29C12.8 15.39 12.87 15.5 12.92 15.62C12.97 15.74 13 15.87 13 16C13 16.13 12.97 16.26 12.92 16.38Z" fill="#555555"></path>
                    </svg>
                    <span>Please select a option type</span>
                  </div>

                  <!-- Text Type (Field/Textarea) -->
                  <div v-if="isTextType" class="table-responsive option-text">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>Price</th>
                          <th>Price Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="number"
                              v-model="form.values[0].price"
                              class="form-control"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td>
                            <select
                              v-model="form.values[0].price_type"
                              class="form-control custom-select-black"
                            >
                              <option value="fixed">Fixed</option>
                              <option value="percent">Percent</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Select Type (Dropdown/Checkbox/Radio/Multiple Select) -->
                  <div v-if="isSelectType" class="option-select m-b-15">
                    <div class="table-responsive">
                      <table class="options table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Label</th>
                            <th>Price</th>
                            <th>Price Type</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody id="select-values">
                          <tr
                            v-for="(value, index) in form.values"
                            :key="index"
                            class="option-row"
                          >
                            <td class="text-center">
                              <span class="drag-handle">
                                <i class="fa">&#xf142;</i>
                                <i class="fa">&#xf142;</i>
                              </span>
                            </td>
                            <td>
                              <input
                                type="text"
                                v-model="value.label"
                                class="form-control"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                v-model="value.price"
                                class="form-control"
                                step="0.01"
                                min="0"
                              />
                            </td>
                            <td>
                              <select
                                v-model="value.price_type"
                                class="form-control custom-select-black"
                              >
                                <option value="fixed">Fixed</option>
                                <option value="percent">Percent</option>
                              </select>
                            </td>
                            <td class="text-center">
                              <button
                                type="button"
                                class="btn btn-default delete-row"
                                @click="deleteRow(index)"
                                data-toggle="tooltip"
                                title="Delete Row"
                              >
                                <i class="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      class="btn btn-default"
                      id="add-new-row"
                      @click="addRow"
                    >
                      Add Row
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="col-lg-9 col-lg-offset-3 col-md-9 col-md-offset-3 col-sm-9 col-sm-offset-3 col-xs-12">
                  <button type="submit" class="btn btn-primary" data-loading="">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'OptionCreate',
  data() {
    return {
      activeTab: 'general',
      form: {
        name: '',
        type: '',
        is_required: false,
        values: []
      }
    };
  },
  computed: {
    isTextType() {
      return ['field', 'textarea'].includes(this.form.type);
    },
    isSelectType() {
      return ['dropdown', 'checkbox', 'checkbox_custom', 'radio', 'radio_custom', 'multiple_select'].includes(this.form.type);
    }
  },
  methods: {
    onTypeChange() {
      // Reset values when type changes
      this.form.values = [];
      
      if (this.isTextType) {
        // Add single value for text types
        this.form.values.push({
          price: 0,
          price_type: 'fixed'
        });
      } else if (this.isSelectType) {
        // Add initial row for select types
        this.addRow();
      }
    },
    addRow() {
      this.form.values.push({
        label: '',
        price: 0,
        price_type: 'fixed'
      });
    },
    deleteRow(index) {
      this.form.values.splice(index, 1);
    },
    saveForm() {
      console.log('Form submitted:', this.form);
      // TODO: Add API call to save option
      // For now, just redirect back to list
      this.$router.push({ name: 'admin.options.index' });
    }
  }
};
</script>

<style scoped>
.content-header {
  padding: 15px;
  background: #fff;
  border-bottom: none;
  margin-bottom: 20px;
}

.content-header h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
}

.breadcrumb-home-icon svg {
  vertical-align: middle;
}

.accordion-content {
  padding: 20px;
  display: flex;
  align-items: stretch;
}

/* Sidebar column styles */
.sidebar-column {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}

.accordion-box {
  background: #fff;
  border: none;
  border-radius: 4px;
  margin-bottom: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-default {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: none !important;
  box-shadow: none !important;
}

.panel-heading {
  border: none !important;
  background: transparent !important;
}

.panel-collapse {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: none !important;
}

.panel-body {
  flex: 1;
  border: none !important;
}

.accordion-tab {
  border-bottom: 0 !important;
}

.accordion-tab.nav-stacked li {
  display: block;
  width: 100%;
}

.accordion-tab.nav-stacked li a {
  display: block;
  width: 100%;
}

.accordion-tab li a {
  border: 0 !important;
  border-left: 3px solid transparent !important;
  border-radius: 0 !important;
  color: #555;
  padding: 10px 15px;
}

.accordion-tab li.active a {
  border-left-color: #0071df !important;
  background: #f5f5f5;
  color: #0071df;
}

.accordion-box-content {
  background: #fff;
  border: none;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
}

.tab-content-title {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: none;
}

/* Form input width control for desktop */
.input-wrapper {
  max-width: 450px;
}

.text-red {
  color: #d9534f;
}

.m-l-5 {
  margin-left: 5px;
}

.m-b-15 {
  margin-bottom: 15px;
}

.drag-handle {
  cursor: move;
  color: #999;
}

.drag-handle i:last-child {
  margin-left: -3px;
}

.delete-row {
  padding: 5px 10px;
}

.alert-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #d9edf7;
  border: 1px solid #bce8f1;
  border-radius: 4px;
  color: #31708f;
}

.alert-info svg {
  flex-shrink: 0;
}

/* Tablet styles (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .accordion-content {
    padding: 15px;
    flex-direction: column;
    align-items: normal;
  }
  
  .sidebar-column {
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  .input-wrapper {
    max-width: 100%;
  }
  
  .accordion-tab li a {
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* Mobile styles (max-width: 767px) */
@media (max-width: 767px) {
  .content-header {
    padding: 10px;
    margin-bottom: 15px;
  }
  
  .content-header h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .breadcrumb {
    font-size: 12px;
  }
  
  .accordion-content {
    padding: 10px;
    flex-direction: column;
    align-items: normal;
  }
  
  .sidebar-column {
    margin-top: 0;
    margin-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .content-column {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .accordion-box,
  .accordion-box-content {
    margin-bottom: 15px;
  }
  
  /* Keep tabs vertical on mobile */
  .accordion-tab.nav-stacked li {
    display: block;
    width: 100%;
  }
  
  .accordion-tab li a {
    padding: 8px 15px;
    font-size: 14px;
  }
  
  /* Form styles for mobile */
  .form-group label.control-label {
    text-align: left !important;
    margin-bottom: 5px;
    padding-left: 15px;
  }
  
  .form-group .col-xs-12 {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .input-wrapper {
    max-width: 100%;
  }
  
  .tab-content-title {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  /* Table responsive adjustments */
  .table-responsive {
    margin-bottom: 15px;
    font-size: 13px;
  }
  
  .table th,
  .table td {
    padding: 8px 5px;
  }
  
  .drag-handle {
    font-size: 12px;
  }
  
  .delete-row {
    padding: 3px 8px;
  }
  
  /* Button styling */
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  #add-new-row {
    margin-top: 10px;
  }
}

/* Extra small mobile (max-width: 480px) */
@media (max-width: 480px) {
  .content-header h3 {
    font-size: 16px;
  }
  
  .breadcrumb {
    font-size: 11px;
  }
  
  .accordion-tab li a {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .table-responsive {
    font-size: 12px;
  }
  
  .table th,
  .table td {
    padding: 5px 3px;
  }
  
  .form-control {
    font-size: 14px;
  }
}
</style>
