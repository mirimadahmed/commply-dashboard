<script>
import Layout from "../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import api from "@/api";
import { mapState } from "vuex";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Employees",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: [],
      isLoading: false,
      title: "Employees",
      items: [
        {
          text: "Manage Employees",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "company_name",
      sortDesc: false,
      fields: [
        { key: "company_name", sortable: true },
        { key: "employee_firstname", sortable: true },
        { key: "employee_middlename", sortable: true },
        { key: "employee_lastname", sortable: true },
        { key: "employee_number", sortable: true },
        { key: "employee_job", sortable: true },
        { key: "employee_telephone", sortable: true },
        { key: "date_created", sortable: true },
        { key: "action", sortable: false },
      ],
      editedEmployee: null,
      newEmployee: {},
      company_options: [],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
    ...mapState("authfack", {
      user: (state) => state.user,
    }),
  },
  mounted() {
    // Set the initial number of items
    let company_id = this.user.company_id ? this.user.company_id : null;
    this.fetch(company_id);
    if (!company_id) {
      this.fetchCompanies();
    }
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async fetch(company_id) {
      this.isLoading = true;
      if (company_id === null) {
        const { data } = await api.employees(company_id);
        this.totalRows = data.length;
        this.tableData = data;
      } else {
        const { data } = await api.allEmployees(company_id);
        this.totalRows = data.length;
        this.tableData = data;
      }
      this.isLoading = false;
    },
    async fetchCompanies() {
      this.isLoading = true;
      const { data } = await api.companies(null);
      data.forEach((element) => {
        this.company_options.push({
          text: element.company_name,
          value: element.company_id,
        });
      });
      this.isLoading = false;
    },
    viewEmployee(row) {
      this.$router.push(`/view-employee?id=${row.item.employee_id}`);
    },
    editEmployee(row) {
      this.editedEmployee = JSON.parse(JSON.stringify(row.item));
    },
    async saveEmployee() {
      this.isLoading = true;
      const { data } = await api.updateEmployee(this.editedEmployee);
      const index = this.tableData.findIndex(
        (item) => item.employee_id === this.editedEmployee.employee_id
      );
      if (index > -1) {
        this.tableData[index] = JSON.parse(JSON.stringify(this.editedEmployee));
      }
      this.isLoading = false;
    },
    setCompanyName(company) {
      const index = this.company_options.findIndex(item => item.value === company);
      if(index > -1) {
        this.editedEmployee.company_name = this.company_options[index].text;
      }
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body text-center" v-if="isLoading">
            <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
          </div>
          <div class="card-body" v-else>
            <h4 class="card-title text-primary">
              <i class="bx bxs-user-detail" /> Manage Employees
            </h4>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    <span class="mr-1">Show</span>
                    <b-form-select class="mr-1" v-model="perPage" size="sm" :options="pageOptions"></b-form-select>entries
                  </label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search..."
                      class="form-control form-control-sm ml-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                striped
                hover
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <template v-slot:cell(action)="row">
                  <b-button-group>
                    <b-button
                      v-b-modal.modal-edit
                      @click="editEmployee(row)"
                      variant="primary"
                      size="sm"
                    >
                      <i class="bx bx-pencil"></i>
                    </b-button>
                    <b-button @click="viewEmployee(row)" variant="success" size="sm">
                      <i class="fas fa-eye" />
                    </b-button>
                  </b-button-group>
                </template>
                <template v-slot:cell(date_created)="row">
                  <i class="fas fa-calendar-day mr-1" />
                  {{row.item.date_created}}
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-right">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      id="modal-edit"
      title="Employee"
      title-class="font-18"
      ok-title="Save Changes"
      cancel-title="Cancel"
      @ok="saveEmployee"
    >
      <h5>EDIT EMPLOYEE DETAILS</h5>
      <div class="row">
        <div class="col-12">
          <form class="form-horizontal" role="form" v-if="editedEmployee">
            <b-form-group
              id="employee_number"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Employee ID Number"
              label-for="employee_number"
            >
              <b-form-input id="employee_number" v-model="editedEmployee.employee_id_number"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_firstname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="First Name"
              label-for="employee_firstname"
            >
              <b-form-input for="employee_firstname" v-model="editedEmployee.employee_firstname"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_middlename"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Middle Name"
              label-for="employee_middlename"
            >
              <b-form-input for="employee_middlename" v-model="editedEmployee.employee_middlename"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_lastname"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Last Name"
              label-for="employee_lastname"
            >
              <b-form-input for="employee_lastname" v-model="editedEmployee.employee_lastname"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_job"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Job"
              label-for="employee_job"
            >
              <b-form-input for="employee_job" v-model="editedEmployee.employee_job"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_number"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Employee Number"
              label-for="employee_number"
            >
              <b-form-input for="employee_number" v-model="editedEmployee.employee_number"></b-form-input>
            </b-form-group>

            <b-form-group
              id="employee_telephone"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Employee Telephone"
              label-for="employee_telephone"
            >
              <b-form-input for="employee_telephone" v-model="editedEmployee.employee_telephone"></b-form-input>
            </b-form-group>

            <b-form-group
              id="manager_id"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Manager ID"
              label-for="manager_id"
            >
              <b-form-input for="manager_id" v-model="editedEmployee.manager_id"></b-form-input>
            </b-form-group>

            <b-form-group
              v-if="!user.company_id"
              id="employee_company_id"
              label-cols-sm="2"
              label-cols-lg="3"
              label="Company"
              label-for="employee_company_id"
            >
              <b-form-select
                @change="setCompanyName"
                v-model="editedEmployee.company_id"
                :options="company_options"
              ></b-form-select>
            </b-form-group>
          </form>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>